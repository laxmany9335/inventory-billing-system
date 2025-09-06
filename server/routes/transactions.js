// src/routes/transactions.js
const express = require('express');
const { body } = require('express-validator');
const {
  getTransactions,
  createTransaction
} = require('../controllers/transactionController');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Get all transactions
router.get('/', getTransactions);

// Create transaction
router.post('/', [
  body('type')
    .isIn(['sale', 'purchase'])
    .withMessage('Type must be either sale or purchase'),
  body('customerId')
    .if(body('type').equals('sale'))
    .notEmpty()
    .withMessage('Customer ID is required for sales'),
  body('vendorId')
    .if(body('type').equals('purchase'))
    .notEmpty()
    .withMessage('Vendor ID is required for purchases'),
  body('products')
    .isArray({ min: 1 })
    .withMessage('At least one product is required'),
  body('products.*.productId')
    .notEmpty()
    .withMessage('Product ID is required'),
  body('products.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('products.*.price')
    .isNumeric()
    .custom(value => value >= 0)
    .withMessage('Price must be a positive number')
], createTransaction);

module.exports = router;
