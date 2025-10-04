// src/pages/BookList.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getBooks, deleteBook, updateBook } from "../api";
import { Link } from "react-router-dom";

const BookList = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [editingBookId, setEditingBookId] = useState(null);
  const [editBookData, setEditBookData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    publishedYear: ""
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await getBooks(page, 5);
        setBooks(res.data.books);
        setTotalPages(res.data.pages);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching books:", err);
        setLoading(false);
      }
    };
    fetchBooks();
  }, [page]);

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

  if (loading) return <p className="mt-4">Loading books...</p>;
  if (books.length === 0) return <p className="mt-4">No books available.</p>;

  // Split books into two rows: first 3, next 2
  const firstRow = books.slice(0, 3);
  const secondRow = books.slice(3, 5);

  const renderCard = (book) => (
    <div key={book._id} className="card h-100 p-3 border shadow-sm d-flex flex-column align-items-center justify-content-center text-center">
      {editingBookId === book._id ? (
        <div className="d-flex flex-column align-items-center">
          <input
            type="text"
            value={editBookData.title}
            onChange={(e) => handleEditBookChange("title", e.target.value)}
            placeholder="Title"
            className="form-control form-control-sm mb-1 text-center"
          />
          <input
            type="text"
            value={editBookData.author}
            onChange={(e) => handleEditBookChange("author", e.target.value)}
            placeholder="Author"
            className="form-control form-control-sm mb-1 text-center"
          />
          <div className="d-flex justify-content-center mt-2 gap-2">
            <button
              onClick={() => handleEditBookSave(book._id)}
              className="btn btn-sm"
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
        </div>
      ) : (
        <>
          <Link to={`/books/${book._id}`} className="fw-bold mb-1" style={{ color: "#d97706" }}>
            {book.title || "Untitled"}
          </Link>
          <p className="mb-1">{book.author || "Unknown Author"}</p>
          {user && book.addedBy._id === user._id && (
            <div className="mt-2 d-flex gap-2">
              <button
                onClick={() => handleEditBookInit(book)}
                className="btn btn-sm"
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
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="container mt-4">
      <h2 style={{ color: "#d97706" }}>Books</h2>

      {/* First Row - 3 cards */}
      <div className="row mb-3 justify-content-center g-3">
        {firstRow.map(book => (
          <div key={book._id} className="col-md-4">{renderCard(book)}</div>
        ))}
      </div>

      {/* Second Row - 2 cards centered */}
      {secondRow.length > 0 && (
        <div className="row justify-content-center g-3">
          {secondRow.map(book => (
            <div key={book._id} className="col-md-4 col-lg-3">{renderCard(book)}</div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-3 d-flex justify-content-between">
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookList;
