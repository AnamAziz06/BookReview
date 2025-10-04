const Review = require('../models/Review');
const Book = require('../models/Book');

// Helper to update ratings
async function updateBookRatings(bookId) {
  const agg = await Review.aggregate([
    { $match: { book: bookId } },
    { $group: { _id: '$book', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  if (agg.length) {
    await Book.findByIdAndUpdate(bookId, { averageRating: agg[0].avg, reviewsCount: agg[0].count });
  } else {
    await Book.findByIdAndUpdate(bookId, { averageRating: 0, reviewsCount: 0 });
  }
}

// Add review
exports.addReview = async (req, res) => {
  try {
    const { bookId, rating, reviewText } = req.body;
    if (!bookId || !rating) return res.status(400).json({ message: 'bookId and rating required' });

    const existing = await Review.findOne({ book: bookId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'You already reviewed this book' });

    const review = await Review.create({ book: bookId, user: req.user._id, rating, reviewText });
    await updateBookRatings(bookId);
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit review
exports.editReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });

    if (req.body.rating !== undefined) review.rating = req.body.rating;
    if (req.body.reviewText !== undefined) review.reviewText = req.body.reviewText;

    await review.save();
    await updateBookRatings(review.book);
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });

    const bookId = review.book;
    await review.remove();
    await updateBookRatings(bookId);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get reviews by logged-in user
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviews = await Review.find({ user: userId })
      .populate('book', 'title') // ensures book title is available
      .select('reviewText rating book') // only needed fields
      .lean();

    res.json(reviews);
  } catch (err) {
    console.error("Get User Reviews Error:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

