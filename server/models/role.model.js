import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Role = new Schema({
    name: {
        type: String,
        trim: true
    }
}, { collection: "roles" });

export default mongoose.model('Role', Role);
