require('dotenv').config();

const productData = require('./data/productList');
const connectDB = require('./config/db');
const Product = require('./models/productModel');

connectDB();

const importData = async () => {
  try {
    await Product.deleteMany({});

    await Product.insertMany(productData);

    console.log('Data import success.');

    process.exit();
  } catch (error) {
    console.error('Error with data import.');
    process.exit(1);
  }
};

importData();

// Deletes current items in database and replaces them with file
