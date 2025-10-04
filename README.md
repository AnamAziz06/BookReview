Book Review Platform (MERN Stack)

A Fullstack Book Review Platform built using MongoDB, Express, React, and Node.js (MERN).
This platform allows users to sign up, log in, add books, and write reviews with ratings and comments.
It demonstrates JWT authentication, CRUD operations, and frontend-backend integration in a clean, professional architecture.

🚀 Features
🔐 User Authentication

Signup with name, email, password (hashed using bcrypt)

Login and get a JWT token

Protected routes for authenticated users

Token stored securely in localStorage

📖 Book Management

Add, view, edit, and delete books

Each book includes: Title, Author, Description, Genre, Published Year

Only the creator of a book can modify or delete it

All users can browse all books

Pagination: 5 books per page

⭐ Review System

Add, edit, and delete your own reviews

Rate books from 1–5 stars

View all reviews on each book’s details page

Dynamic average rating calculation

🧩 Tech Stack
Layer	Technology
Frontend	React.js, React Router, Axios, Context API, Tailwind CSS / Bootstrap
Backend	Node.js, Express.js, JWT, bcrypt
Database	MongoDB Atlas, Mongoose ODM
Auth	JWT (JSON Web Token)
Deployment (Optional)	Render / Vercel / Netlify
🗂️ Folder Structure
BookReviewPlatform/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   └── reviewController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── Review.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   └── reviewRoutes.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Signup.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── BookList.jsx
│   │   │   ├── BookDetails.jsx
│   │   │   ├── AddBook.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── App.js
│   │   ├── index.js
│   │   └── utils/axiosInstance.js
│   ├── package.json
│
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/yourusername/book-review-platform.git
cd book-review-platform

2️⃣ Backend Setup
cd backend
npm install


Create a .env file in the backend folder:

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key


Run the backend server:

npm run dev


Backend will start at:
👉 http://localhost:5000

3️⃣ Frontend Setup
cd ../frontend
npm install
npm start


Frontend will start at:
👉 http://localhost:3000

🔒 Authentication Flow

Signup – Creates a new user with hashed password.

Login – Validates credentials, returns a JWT.

Protected Routes – JWT is required for adding/editing books or reviews.

Token Storage – Stored in localStorage and attached to Axios headers.

🧮 Pagination

Books are displayed 5 per page with Next/Previous controls.
Example API endpoint:

GET /api/books?page=2

🧠 API Endpoints
🔹 Auth
Method	Endpoint	Description
POST	/api/auth/signup	Register new user
POST	/api/auth/login	Login user and get token
🔹 Books
Method	Endpoint	Description
GET	/api/books	Get all books (paginated)
POST	/api/books	Add new book (Protected)
GET	/api/books/:id	Get single book details
PUT	/api/books/:id	Edit book (Protected, Owner only)
DELETE	/api/books/:id	Delete book (Protected, Owner only)
🔹 Reviews
Method	Endpoint	Description
POST	/api/books/:id/reviews	Add review
PUT	/api/reviews/:id	Edit review
DELETE	/api/reviews/:id	Delete review
