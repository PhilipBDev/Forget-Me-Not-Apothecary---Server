const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProductById,
} = require('../controllers/productController');

// @desc GET all products from database
// @route GET /api/products
router.get('/', getProducts);

// @desc GET one product from database by ID
// @route GET /api/products/:id
router.get('/:id', getProductById);

module.exports = router;
