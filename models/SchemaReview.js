const mongoose = require('mongoose');


const SchemaReview = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

module.exports = mongoose.model('Review', SchemaReview, 'reviews');
