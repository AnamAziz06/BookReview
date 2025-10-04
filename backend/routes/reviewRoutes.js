const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

// /api/books/:id/reviews
router.post('/:id', protect, reviewController.addReview);

// /api/reviews/:id
router.put('/:id', protect, reviewController.editReview);
router.delete('/:id', protect, reviewController.deleteReview);

// /api/reviews/user
router.get('/user', protect, reviewController.getUserReviews);

module.exports = router;
