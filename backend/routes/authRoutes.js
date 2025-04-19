const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
// ✅ Hardcoded user for testing
const testUser = {
  email: 'test@padhakoo.com',
  password: 'test123'
};

router.post('/', (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", email, password);

  if (email === testUser.email && password === testUser.password) {
    return res.status(200).json({ message: 'Login successful' });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});
// Local login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // If user doesn't exist
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // If user exists but no password (social login only)
    if (!user.password) {
      return res.status(401).json({ 
        message: 'This account uses social login. Please sign in with the appropriate social provider.' 
      });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Update last login
    user.lastLogin = Date.now();
    await user.save();
    
    // Login with passport
    req.login(user, (err) => {
      if (err) return next(err);
      
      return res.status(200).json({ 
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Google OAuth Routes
// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login.html' }),
  (req, res) => {
    console.log('User authenticated:', req.user);
    res.redirect('/');
  }
);



// GitHub OAuth Routes
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Facebook OAuth Routes
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Route for checking authentication status
// Route for checking authentication status
router.get('/status', (req, res) => {
  console.log("User authenticated:", req.isAuthenticated()); // Add this log for debugging
  if (req.isAuthenticated()) {
    return res.status(200).json({
      isAuthenticated: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } else {
    return res.status(200).json({ isAuthenticated: false });
  }
});

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Create new user
    const newUser = new User({
      name,
      email,
      password
    });
    
    await newUser.save();
    
    res.status(201).json({ message: 'Registration successful. Please login.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

module.exports = router;