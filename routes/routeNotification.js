const express = require('express');
const mongoose = require('mongoose');
const SchemaNotifica = require('../models/SchemaNotifica');



const router = express.Router();



router.get('/notification', (req, res) => {
    SchemaNotifica.find({ reciver: req.userId }).populate('sender', 'name surname avatar').populate('postId', 'title cover')
        .then((notifiche) => {
            res.status(200).json({
                statusCode: 200,
                message: 'Notifiche recuperate con successo',
                notifiche,
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({
                statusCode: 500,
                message: 'Internal server error',
            });
        });
});



module.exports = router;