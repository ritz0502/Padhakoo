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
db();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5500',
  credentials: true
}));



app.use(
  session({
    secret: 'mySuperSecretKey123', // hardcoded session secret
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb://127.0.0.1:27017/padhakoo', // hardcoded mongo URL
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Configure passport
require('./config/passport'); // ✅ Don't pass anything here

// File uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/default', defaultRoutes);
app.use('/api/auth', authRoutes);

// Serve the landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'landingpage.html'));
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
