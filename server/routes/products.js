// src/routes/products.js
const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Get all products
router.get('/', getProducts);

// Create product
router.post('/', [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),
  body('price')
    .isNumeric()
    .custom(value => value >= 0)
    .withMessage('Price must be a positive number'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
], createProduct);

// Update product
router.put('/:id', [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product name cannot be empty'),
  body('price')
    .optional()
    .isNumeric()
    .custom(value => value >= 0)
    .withMessage('Price must be a positive number'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty')
], updateProduct);

// Delete product
router.delete('/:id', deleteProduct);
module.exports = router;