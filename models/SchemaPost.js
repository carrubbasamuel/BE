const mongoose = require('mongoose');

const SchemaPost = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: false,
    },
    cover: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: true,
    },
    readTime: {
        value: Number,
        unit: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    howSave: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
},{ timestamps: true, strict: true });

module.exports = mongoose.model('Post', SchemaPost, 'posts');