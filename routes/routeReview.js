const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Review = require('../models/SchemaReview');

// Create a review
router.post('/addReview', (req, res) => {
    const { comment, rate, postId } = req.body;
    const newReview = new Review({
        comment,
        rate,
        postId,
        authorId: req.userId,
    });
    newReview.save()
        .then(review => {
            res.json(review);
        })
        .catch(err => {
            res.json(err);
        })
});

// Get all reviews
router.get('/getReviews/:postId', (req, res) => {
  const { postId } = req.params;
  const { userId } = req;

  Review.find({ postId })
    .populate('authorId', 'email name surname avatar')
    .lean()
    .then((reviews) => {
      // Aggiungi il campo isMine a ciascuna recensione se l'utente corrente è l'autore
      reviews.forEach((review) => {
        review.isMine = review.authorId._id.toString() === userId.toString();
      });

      res.json(reviews);
    })
    .catch((err) => {
      res.json(err);
    });
});


// Delete a review
router.delete('/deleteReview/:reviewId', (req, res) => {
    const { reviewId } = req.params;
    Review.findByIdAndDelete(reviewId)
        .then(review => {
            if (!review) {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'Review not found!',
                });
            }
            return res.status(200).json({
                statusCode: 200,
                message: 'Review deleted successfully',
                review,
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


// Edit a review
router.patch('/editReview/:reviewId', (req, res) => {
    const { reviewId } = req.params;
    const { comment, rate } = req.body;
    Review.findByIdAndUpdate(reviewId, { comment, rate }, { new: true })
        .then(review => {
            if (!review) {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'Review not found!',
                });
            }
            return res.status(200).json({
                statusCode: 200,
                message: 'Review edited successfully',
                review,
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