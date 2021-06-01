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

export { create };
