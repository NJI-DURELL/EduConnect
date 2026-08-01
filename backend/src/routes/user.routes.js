const express = require('express');
const { body } = require('express-validator');
const { getMe, updateMe, changePassword } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All user routes are protected
router.use(protect);

// GET /api/users/me
router.get('/me', getMe);

// PUT /api/users/me
router.put(
  '/me',
  [
    body('username').optional().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('bio').optional().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
    body('profilePicture').optional().isURL().withMessage('Profile picture must be a valid URL'),
  ],
  updateMe
);

// PUT /api/users/me/password
router.put(
  '/me/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  changePassword
);

module.exports = router;
