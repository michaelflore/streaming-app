import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Media = new Schema({
    title: {
        type: String,
        required: 'title is required'
    },
    description: String,
    genre: String,
    views: {
        type: Number,
        default: 0
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    }
}, { collection: "media" });

export default mongoose.model('Media', Media);