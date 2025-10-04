import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const signup = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);

// Books
export const getBooks = (page = 1, limit = 5) => API.get(`/books?page=${page}&limit=${limit}`);
export const getBook = (id) => API.get(`/books/${id}`);
export const addBook = (book) => API.post("/books", book);
export const updateBook = (id, book) => API.put(`/books/${id}`, book);
export const deleteBook = (id) => API.delete(`/books/${id}`);

// Reviews
export const addReview = (bookId, review) => API.post(`/books/${bookId}/reviews`, review);
export const editReview = (reviewId, review) => API.put(`/reviews/${reviewId}`, review);
export const deleteReview = (reviewId) => API.delete(`/reviews/${reviewId}`);

// User-specific
export const getUserBooks = () => API.get(`/books/user`);
export const getUserReviews = () => API.get(`/reviews/user`);

export default API;
