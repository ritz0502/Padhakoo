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

<<<<<<< HEAD

=======
>>>>>>> 5e8918aa10c007464dd906b02003a939364de3bb
// Connect to MongoDB
const db = require('./config/db');
db();

const app = express();

// Middleware
<<<<<<< HEAD

=======
>>>>>>> 5e8918aa10c007464dd906b02003a939364de3bb
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
<<<<<<< HEAD
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
=======
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'padhakoo-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 60 * 60 * 24, // 1 day
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);
>>>>>>> 5e8918aa10c007464dd906b02003a939364de3bb

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Configure passport
<<<<<<< HEAD
require('./config/passport')(passport);
=======
require('./config/passport'); // ✅ Don't pass anything here
>>>>>>> 5e8918aa10c007464dd906b02003a939364de3bb

// File uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files
<<<<<<< HEAD
app.use(express.static(path.join(__dirname, '..', 'public')));


// Routes

app.use('/api/courses', courseRoutes);
app.use('/api/default', defaultRoutes);
app.use('/api/login', authRoutes);


// Serve the login page
// Serve the landing page at root

// Serve the login page
=======
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/default', defaultRoutes);
app.use('/api/auth', authRoutes);

>>>>>>> 5e8918aa10c007464dd906b02003a939364de3bb
// Serve the landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'landingpage.html'));
});


<<<<<<< HEAD
=======

>>>>>>> 5e8918aa10c007464dd906b02003a939364de3bb
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
<<<<<<< HEAD
});
=======
});
>>>>>>> 5e8918aa10c007464dd906b02003a939364de3bb
