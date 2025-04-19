const mongoose = require('mongoose');

const connectDB = async () => {
  try {
<<<<<<< HEAD
    await mongoose.connect('mongodb://localhost:27017/', {
=======
    await mongoose.connect('mongodb://localhost:27017/padhakoo', {
>>>>>>> 5e8918aa10c007464dd906b02003a939364de3bb
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;