const Book = require('../models/Book');
const Review = require('../models/Review');

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

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { title, author, description, genre, publishedYear } = req.body;
    if (!title || !author) return res.status(400).json({ message: 'Title and author are required' });

    const book = await Book.create({
      title, author, description, genre, publishedYear, addedBy: req.user._id
    });

    res.status(201).json(book);
  } catch (err) {
    console.error('Create Book Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all books with pagination
exports.getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '5', 10);
    const skip = (page - 1) * limit;

    const total = await Book.countDocuments();
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('addedBy', 'name email')
      .lean();

    res.json({
      page, limit, total, pages: Math.ceil(total / limit), books
    });
  } catch (err) {
    console.error('Get Books Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('addedBy', 'name email')
      .lean();
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const reviews = await Review.find({ book: book._id })
      .populate('user', 'name email')
      .lean();

    res.json({ ...book, reviews });
  } catch (err) {
    console.error('Get Book Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update book
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.addedBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden - not the owner' });

    const fields = ['title','author','description','genre','publishedYear'];
    fields.forEach(f => { if (req.body[f] !== undefined) book[f] = req.body[f]; });

    await book.save();
    res.json(book);
  } catch (err) {
    console.error('Update Book Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.addedBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden - not the owner' });

    await Review.deleteMany({ book: book._id });
    await book.deleteOne();

    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Delete Book Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add review to a book
exports.addReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const existing = await Review.findOne({ book: book._id, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'You already reviewed this book' });

    const review = await Review.create({
      user: req.user._id,
      book: book._id,
      rating,
      reviewText
    });

    await updateBookRatings(book._id);
    res.status(201).json(review);
  } catch (err) {
    console.error('Add Review Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get books added by logged-in user
exports.getUserBooks = async (req, res) => {
  try {
    const userId = req.user._id;
    const books = await Book.find({ addedBy: userId })
      .sort({ createdAt: -1 })
      .populate('addedBy', 'name email')
      .lean();

    const booksWithReviews = await Promise.all(
      books.map(async b => {
        const reviews = await Review.find({ book: b._id })
          .populate('user', 'name email')
          .lean();
        return { ...b, reviews };
      })
    );

    res.json(booksWithReviews);
  } catch (err) {
    console.error('Get User Books Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
