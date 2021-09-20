const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProductById,
} = require('../controllers/productController');

// @desc GET all products from database
// @route GET /api/products
// @access Public
router.get('/', getProducts);

// @desc GET one product from database by ID
// @route GET /api/products/:id
// @access Public
router.get('/:id', getProductById);

module.exports = router;
