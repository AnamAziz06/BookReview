import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserBooks, getUserReviews, deleteReview, deleteBook, updateBook } from "../api";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review edit state
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editText, setEditText] = useState("");

  // Book edit state
  const [editingBookId, setEditingBookId] = useState(null);
  const [editBookData, setEditBookData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    publishedYear: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [booksRes, reviewsRes] = await Promise.all([
          getUserBooks(),
          getUserReviews(),
        ]);
        setBooks(booksRes.data || []);
        setReviews(reviewsRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error loading profile data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // ----- Review Handlers -----
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter(r => r._id !== reviewId));
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  const handleEditReviewInit = (review) => {
    setEditingReviewId(review._id);
    setEditRating(review.rating);
    setEditText(review.reviewText || "");
  };

  const handleEditReviewSave = async (reviewId) => {
    try {
      // Just update locally for now
      const updatedReviews = reviews.map(r =>
        r._id === reviewId ? { ...r, rating: editRating, reviewText: editText } : r
      );
      setReviews(updatedReviews);
      setEditingReviewId(null);
    } catch (err) {
      console.error("Failed to update review:", err);
    }
  };

  // ----- Book Handlers -----
  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteBook(bookId);
      setBooks(books.filter(b => b._id !== bookId));
    } catch (err) {
      console.error("Failed to delete book:", err);
    }
  };

  const handleEditBookInit = (book) => {
    setEditingBookId(book._id);
    setEditBookData({
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
      genre: book.genre || "",
      publishedYear: book.publishedYear || ""
    });
  };

  const handleEditBookChange = (field, value) => {
    setEditBookData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditBookSave = async (bookId) => {
    try {
      await updateBook(bookId, editBookData);
      const updatedBooks = books.map(b =>
        b._id === bookId ? { ...b, ...editBookData } : b
      );
      setBooks(updatedBooks);
      setEditingBookId(null);
    } catch (err) {
      console.error("Failed to update book:", err);
    }
  };

  if (!user) return <p className="mt-4">Login to view profile</p>;
  if (loading) return <p className="mt-4">Loading profile...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3" style={{ color: "#d97706" }}>
        {user.name}’s Profile
      </h2>

      {/* User's Books */}
      <div className="card p-3 shadow-sm mt-3">
        <h4 style={{ color: "#d97706" }}>My Books</h4>
        {books.length === 0 ? (
          <p>No books added yet</p>
        ) : (
          books.map((book) => (
            <div key={book._id} className="border-bottom py-2">
              {editingBookId === book._id ? (
                <div className="mt-2">
                  <input
                    type="text"
                    value={editBookData.title}
                    onChange={(e) => handleEditBookChange("title", e.target.value)}
                    placeholder="Title"
                    className="me-2"
                  />
                  <input
                    type="text"
                    value={editBookData.author}
                    onChange={(e) => handleEditBookChange("author", e.target.value)}
                    placeholder="Author"
                    className="me-2"
                  />
                  <input
                    type="text"
                    value={editBookData.description}
                    onChange={(e) => handleEditBookChange("description", e.target.value)}
                    placeholder="Description"
                    className="me-2"
                  />
                  <input
                    type="text"
                    value={editBookData.genre}
                    onChange={(e) => handleEditBookChange("genre", e.target.value)}
                    placeholder="Genre"
                    className="me-2"
                  />
                  <input
                    type="number"
                    value={editBookData.publishedYear}
                    onChange={(e) => handleEditBookChange("publishedYear", e.target.value)}
                    placeholder="Year"
                    className="me-2"
                  />
                  <button
                    onClick={() => handleEditBookSave(book._id)}
                    className="btn btn-sm me-2"
                    style={{ backgroundColor: "#d97706", color: "white" }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingBookId(null)}
                    className="btn btn-sm btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <strong style={{ color: "#d97706" }}>{book.title || "Untitled"}</strong> – {book.author || "Unknown Author"}
                  <div className="mt-1">
                    <button
                      onClick={() => handleEditBookInit(book)}
                      className="btn btn-sm me-2"
                      style={{ backgroundColor: "#d97706", color: "white" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book._id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* User's Reviews */}
      <div className="card p-3 shadow-sm mt-4">
        <h4 style={{ color: "#d97706" }}>My Reviews</h4>
        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          reviews.map((review, i) => (
            <div key={i} className="border-bottom py-2">
              <strong>{review.book?.title || "Unknown Book"}</strong> – {review.rating}/5
              {editingReviewId === review._id ? (
                <div className="mt-2">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                    className="me-2"
                  />
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="me-2"
                  />
                  <button
                    onClick={() => handleEditReviewSave(review._id)}
                    className="btn btn-sm me-2"
                    style={{ backgroundColor: "#d97706", color: "white" }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingReviewId(null)}
                    className="btn btn-sm btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <p>{review.reviewText || "No comment"}</p>
                  <button
                    onClick={() => handleEditReviewInit(review)}
                    className="btn btn-sm me-2"
                    style={{ backgroundColor: "#d97706", color: "white" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
