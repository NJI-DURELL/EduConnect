const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

/**
 * Generates a signed JWT for a given user ID.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Registers a new user and returns a JWT.
 * @param {object} data - { username, email, password, role }
 */
const registerUser = async ({ username, email, password, role }) => {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    const field = existingUser.email === email ? 'Email' : 'Username';
    const error = new Error(`${field} is already in use.`);
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({ username, email, password, role });
  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,
      profilePicture: user.profilePicture,
    },
  };
};

/**
 * Authenticates a user and returns a JWT.
 * @param {object} data - { email, password }
 */
const loginUser = async ({ email, password }) => {
  // Include password field explicitly since it's select: false
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,
      profilePicture: user.profilePicture,
    },
  };
};

module.exports = { registerUser, loginUser };
