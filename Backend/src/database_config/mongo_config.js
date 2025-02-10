const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://haonudechimlac:EQcA2jqEVmQCmUUQ@mydb.dyiwq.mongodb.net/BookingDatabase';

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
