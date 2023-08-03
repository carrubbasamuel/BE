const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const SchemaResources = require('../models/SchemaResources');


//add new resource
router.post('/resource', (req, res) => {
    const response = new SchemaResources(req.body);
    if (!response) {
        res.status(404).send('No data found');
    }
    response.save()
        .then(data => {
            res.status(200).send(data);
        }
        )
        .catch(err => {
            console.log(err);
        })
})



//get all resources and filter by age
router.get('/resource', (req, res) => {
    const { ageA, ageB } = req.query;

    if (ageA && ageB) {
        SchemaResources.find({
            $and: [
                { age: { $gte: ageA } },
                { age: { $lte: ageB } }
            ]
        })
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        if (ageA) {
            SchemaResources.find({ age: { $gte: ageA } })
                .then(data => {
                    res.status(200).send(data);
                })
                .catch(err => {
                    console.log(err);
                })
        } else if (ageB) {
            SchemaResources.find({ age: { $lte: ageB } })
                .then(data => {
                    res.status(200).send(data);
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            SchemaResources.find()
                .then(data => {
                    res.status(200).send(data);
                })
                .catch(err => {
                    console.log(err);
                })
        }

    }
})

//get all resources and filter by isActive
router.get('/resource/isactive', (req, res) => {
    SchemaResources.find({ isActive: true })
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            console.log(err);
        })
})



//get all resources and filter by eyeColor
router.get('/resources/eye', (req, res) => {
    SchemaResources.find({ $or: [{ eyeColor: 'blue' }, { eyeColor: 'brown' }] })
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            console.log(err);
        })
})




//get all resources and filter by eyeColor whit $ne
router.get('/resources/notEye', (req, res) => {
    SchemaResources.find({
        $and: [
            { eyeColor: { $ne: 'blue' } },
            { eyeColor: { $ne: 'green' } }
        ]
    })
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            console.log(err);
        })
})



//get all resources and filter by company whit $ne
router.get('/resources/company', (req, res) => {
    SchemaResources.find({ company: { $regex: '.*' + 'FITCORE' + '.*', $options: 'i' } })
        .then(data => {
            const emails = data.map(element => element.email);
            res.status(200).send(emails);
        })
        .catch(err => {
            console.log(err);
        })
});







module.exports = router;
