const User = require('../models/User.model');

/**
 * Returns the public profile of a user by ID.
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

/**
 * Updates the profile info (username, bio, profilePicture) for a user.
 */
const updateUserProfile = async (userId, { username, bio, profilePicture }) => {
  // Check if username is taken by another user
  if (username) {
    const existing = await User.findOne({ username, _id: { $ne: userId } });
    if (existing) {
      const error = new Error('Username is already taken.');
      error.statusCode = 400;
      throw error;
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { username, bio, profilePicture },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/**
 * Changes a user's password after verifying the current one.
 */
const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    const error = new Error('Current password is incorrect.');
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  await user.save();

  return { message: 'Password changed successfully.' };
};

module.exports = { getUserProfile, updateUserProfile, changePassword };
