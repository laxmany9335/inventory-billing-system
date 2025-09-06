// src/routes/reports.js
const express = require('express');
const {
  getInventoryReport,
  getTransactionReport
} = require('../controllers/reportController');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Get inventory report
router.get('/inventory', getInventoryReport);

// Get transaction report
router.get('/transactions', getTransactionReport);

module.exports = router;