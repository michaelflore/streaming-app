import mongoose from 'mongoose';
import crypto from 'crypto';
const Schema = mongoose.Schema;

const User = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    password: {
        type: String,
        required: "Password is required"
    },
    salt: String,
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ]

}, { collection: "users" });

User.virtual('password')
    .set(function (pw) {
        //methods
        this.password = this.encryptPassword(pw)
        this.salt = this.makeSalt()
    })
    .get(function () {
        return this.password
    })

User.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.password
    },
    encryptPassword: function(password) {
        if (!password) return ''
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
        } catch (err) {
            return ''
        }
    },
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}

export default mongoose.model('User', User);