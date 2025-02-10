const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/BookingDatabase';

const connectDB = async () => {
   try {
      await mongoose.connect(mongoURI);
      console.log('MongoDB connected successfully');
   } catch (err) {
      console.error('Error connecting MongoDB:', err.message);
      process.exit(1);
   }
};

module.exports = connectDB; 
