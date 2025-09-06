const express = require('express');
const { body } = require('express-validator');
const { register, login, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('businessName')
    .trim()
    .notEmpty()
    .withMessage('Business name is required')
], register);

// Login
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], login);

// Logout
router.get('/logout', auth, logout);

module.exports = router;
