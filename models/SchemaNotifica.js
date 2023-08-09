const mongoose = require('mongoose');

const SchemaNotifica = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },  
    reciver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,  
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model('notifica', SchemaNotifica);