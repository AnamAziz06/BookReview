import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getBook, addReview } from "../api";
import { AuthContext } from "../context/AuthContext";
import "./BookDetails.css";

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  const fetchBook = async () => {
    try {
      const response = await getBook(id);
      const bookData = response.data?.book || response.data;
      setBook(bookData);
    } catch (err) {
      console.error("Fetch Book Error:", err);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Login to add review");
    if (!rating || rating < 1 || rating > 5)
      return alert("Rating must be between 1 and 5");
    if (!reviewText.trim())
      return alert("Please write a review before submitting");

    try {
      const reviewPayload = {
        rating: Number(rating),
        reviewText: reviewText.trim(),
      };
      await addReview(id, reviewPayload);
      setReviewText("");
      setRating(5);
      fetchBook();
    } catch (err) {
      console.error("Add Review Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add review");
    }
  };

  if (!book) return <p className="loading-text">Loading...</p>;

  const avgRating = book.reviews?.length
    ? (book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length).toFixed(1)
    : "N/A";

  const renderStars = (value) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i + 1 <= value ? "star filled" : "star"}>
        ★
      </span>
    ));
  };

  return (
    <div className="book-details-container">
      <div className="book-card">
        <h2 className="book-title">{book.title}</h2>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Genre:</strong> {book.genre}</p>
        <p><strong>Published:</strong> {book.publishedYear}</p>
        <p><strong>Description:</strong> {book.description}</p>
        <p className="book-rating">
          <strong>Average Rating:</strong>{" "}
          {avgRating !== "N/A" ? (
            <>
              <span className="rating-value">{avgRating}</span> / 5
              <span className="star-container">
                {renderStars(Math.round(avgRating))}
              </span>
            </>
          ) : (
            "N/A"
          )}
        </p>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h4 className="reviews-heading">Reviews</h4>
        {book.reviews?.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          book.reviews.map((r, i) => (
            <div key={i} className="review-card">
              <strong>{r.user?.name || "Anonymous"}</strong>{" "}
              <span className="review-rating">
                {renderStars(r.rating)} ({r.rating}/5)
              </span>
              <p>{r.reviewText || "No comment"}</p>
            </div>
          ))
        )}
      </div>

      {/* Add Review */}
      {user && (
        <div className="add-review-card">
          <h5 className="reviews-heading">Add Review</h5>
          <form onSubmit={handleReviewSubmit}>
            <textarea
              className="form-control mb-2"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review..."
              required
            />
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={n <= rating ? "star filled" : "star"}
                  onClick={() => setRating(n)}
                >
                  ★
                </span>
              ))}
            </div>
            <button className="btn-amber" type="submit">
              Submit Review
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
