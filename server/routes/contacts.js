// src/routes/contacts.js
const express = require('express');
const { body } = require('express-validator');
const {
  getContacts,
  createContact,
  updateContact,
  deleteContact
} = require('../controllers/contactController');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Get all contacts
router.get('/', getContacts);

// Create contact
router.post('/', [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Contact name is required'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('type')
    .isIn(['customer', 'vendor'])
    .withMessage('Type must be either customer or vendor')
], createContact);

// Update contact
router.put('/:id', [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Contact name cannot be empty'),
  body('phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Phone number cannot be empty'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('type')
    .optional()
    .isIn(['customer', 'vendor'])
    .withMessage('Type must be either customer or vendor')
], updateContact);

// Delete contact
router.delete('/:id', deleteContact);

module.exports = router;