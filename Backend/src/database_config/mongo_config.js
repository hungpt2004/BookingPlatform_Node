const mongoose = require('mongoose');
require('dotenv').config();

// const mongoURL = process.env.MONGO_URL;
 const mongoURL = "mongodb://localhost:27017/BookingDatabase";

const connectDB = async () => {
   try {
      await mongoose.connect(mongoURL); 
      console.log('MongoDB connected successfully');
   } catch (err) {
      console.error('Error connecting MongoDB:', err.message);
      process.exit(1);  
   }
};

module.exports = connectDB; 
