import mongoose from 'mongoose';
import formidable from 'formidable';

import fs from 'fs';

import Media from "./../models/media.model";

let gridfs = null;

mongoose.connection.on('connected', () => {
    gridfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db)
})

const create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: "Video could not be uploaded"
            })
        }

        let media = new Media(fields);
        media.postedBy = req.profile;

        if(files.video) {
            let writeStream = gridfs.openUploadStream(media._id, {
                contentType: files.video.type || 'binary/octet-stream'
            })
            fs.createReadStream(files.video.path).pipe(writeStream);
        }

        try {
            let result = await media.save()
            res.status(200).json(result)
        } catch(e) {
            return res.status(400).json({
                error: "Could not save to database"
            })
        }
    })
}

const mediaByID = async (req, res, next, id) => {
    try {
        let media = await Media.findById(id).populate('postBy', '_id name').exec()

        if(!media) {
            return res.status(400).json({
                error: "Media not found"
            })
        }

        req.media = media

        //get file name
        let files = await gridfs.find({filename:media._id}).toArray()
        if(!files[0]) {
            return res.status(400).json({
                error: "No video was found"
            })
        }
        req.file = files[0]

        next()
    } catch (e) {
        return res.status(400).json({
            error: "Could not retrieve media file"
        })
    }
}

//Send back correct chunks of video with related content set as res headers
const video = (req, res) => {
    const range = req.headers["range"];

    //Range headers when user drags to middle of video
    if(range && typeof range === "string") {
        const parts = range.replace(/bytes=/, "").split("-")
        const partialStart = parts[0]
        const partialEnd = parts[1]

        const start = parseInt(partialStart, 10)
        const end = partialEnd ? parseInt(partialEnd, 10) : req.file.length - 1

        const chunkSize = (end - start) + 1

        res.writeHead(206, {
            'Accept-Ranges': 'bytes',
            'Content-length': chunkSize,
            'Content-Range': 'bytes ' + start + '-' + end + '/' + req.file.length,
            'Content-Type': req.file.contentType
        })

        let downloadStream = gridfs.openDownloadStream(req.file._id, {
            start, end: end + 1
        })

        downloadStream.pipe(res)
        downloadStream.on('error', () => {
            res.sendStatus(404)
        })
        downloadStream.on('end', () => {
            res.end()
        })

    } else {
        //If no range headers
        res.header('Content-Length', req.file.length)
        res.header('Content-Type', req.file.contentType)

        let downloadStream = gridfs.openDownloadStream(req.file._id)
        downloadStream.pipe(res)
        downloadStream.on('error', () => {
            res.sendStatus(404)
        })
        downloadStream.on('end', () => {
            res.end()
        })
    }

}

const listPopular = async (req, res) => {
    try {
        let media = await Media.find({})
            .populate('postedBy', '_id name')
            .sort('-views')
            .limit(9)
            .exec()

        res.json(media)
    }
    catch (e) {
        return res.status(400).json({
            error: "Could not retrieve popular list"
        })
    }
}

const listByUser = async (req, res) => {
    try {
        let media = await Media.find({ postedBy: req.profile._id })
            .populate('postedBy', '_id name')
            .sort('-created')
            .exec()

        res.json(media)
    } catch (e) {
        return res.status(400).json({
            error: "Could not list media by user"
        })
    }
}

const incrementViews = async (req, res, next) => {
    try {
        await Media.findByIdAndUpdate(req.media._id, { $inc: { "views": 1 } }, { new: true }).exec()
        next()
    } catch (e) {
        return res.status(400).json({
            error: "Could not increase views"
        })
    }
}

const read = (req, res) => {
    return res.json(req.media)
}

export { create, mediaByID, video, listPopular, listByUser, incrementViews, read };
