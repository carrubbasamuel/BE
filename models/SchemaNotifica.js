const mongoose = require('mongoose');

const SchemaNotifica = new mongoose.Schema({
    reciver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    sender: {
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