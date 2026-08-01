const { validationResult } = require('express-validator');
const userService = require('../services/user.service');

/**
 * GET /api/users/me
 * Returns the logged-in user's profile.
 */
const getMe = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/me
 * Updates the logged-in user's profile.
 */
const updateMe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, bio, profilePicture } = req.body;
    const user = await userService.updateUserProfile(req.user._id, {
      username,
      bio,
      profilePicture,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/me/password
 * Changes the logged-in user's password.
 */
const changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const result = await userService.changePassword(req.user._id, {
      currentPassword,
      newPassword,
    });

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMe, updateMe, changePassword };
