require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');

// Import routes
const courseRoutes = require('./routes/courseRoutes');
const defaultRoutes = require('./routes/defaultRoutes');
const authRoutes = require('./routes/authRoutes');


// Connect to MongoDB
const db = require('./config/db');

const app = express();

// Middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'padhakoo-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGO_URI,
    ttl: 60 * 60 * 24 // 1 day
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Configure passport
require('./config/passport')(passport);

// File uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));


// Routes

app.use('/api/courses', courseRoutes);
app.use('/api/default', defaultRoutes);
app.use('/api/auth/login', authRoutes);

// Serve the login page
// Serve the landing page at root

// Serve the login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'student-login.html'));
});

app.get('/teacher-course', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/teacherCourse.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});