import React, { useState, useEffect } from "react";
import { addBook, updateBook, getBook } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import "./AddEditBook.css"; 

const AddEditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    publishedYear: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await getBook(id);
          const bookData = res.data?.book || res.data;
          if (bookData) {
            setForm({
              title: bookData.title || "",
              author: bookData.author || "",
              description: bookData.description || "",
              genre: bookData.genre || "",
              publishedYear: bookData.publishedYear || ""
            });
          }
        } catch (err) {
          console.error("Error fetching book:", err);
        }
      })();
    }
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await updateBook(id, form);
      } else {
        await addBook(form);
      }
      navigate("/");
    } catch (err) {
      console.error("Error saving book:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-edit-container">
      <div className="add-edit-card">
        <h2 className="form-heading">
          {id ? "Edit Book" : "Add Book"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            className="form-control mb-2"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            name="author"
            className="form-control mb-2"
            placeholder="Author"
            value={form.author}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            className="form-control mb-2"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          />
          <input
            name="genre"
            className="form-control mb-2"
            placeholder="Genre"
            value={form.genre}
            onChange={handleChange}
            required
          />
          <input
            name="publishedYear"
            type="number"
            className="form-control mb-2"
            placeholder="Published Year"
            value={form.publishedYear}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-amber" disabled={loading}>
            {loading ? "Saving..." : id ? "Update Book" : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditBook;
