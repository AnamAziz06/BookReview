const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const bookController = require('../controllers/bookController');

// Create book
router.post('/', protect, bookController.createBook);

// Get books by logged-in user (must be BEFORE :id)
router.get('/user', protect, bookController.getUserBooks);

// Get all books (with pagination)
router.get('/', bookController.getBooks);

// Get single book by ID
router.get('/:id', bookController.getBookById);

// Update & delete
router.put('/:id', protect, bookController.updateBook);
router.delete('/:id', protect, bookController.deleteBook);

// Reviews under book
router.post('/:id/reviews', protect, bookController.addReview);

module.exports = router;
