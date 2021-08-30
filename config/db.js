require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to server.');
  } catch (error) {
    console.log('Failed to connect to server.');
    process.exit(1);
  }
};

module.exports = connectDB;
