const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    author: {
        type: String,
        required: true
    },
    state: {
        type: String,
        default: 'draft',
        required: true
    },
    body: {
        type: String,
        required: true
    },
    read_count: {
        type: Number,
        default: 0
    },
    reading_time: {
        type: String,
        required: true
    }

}, { timestamps: true })



module.exports = mongoose.model('Blog', blogSchema);
