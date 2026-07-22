const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/response');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin with password field
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    const token = generateToken(admin._id);

    sendSuccess(res, 200, 'Login successful', {
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout admin
// @route   POST /api/auth/logout
// @access  Protected
const logout = async (req, res, next) => {
  try {
    // Client should remove the token; server can log the event
    sendSuccess(res, 200, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Verify token and return current admin
// @route   GET /api/auth/verify
// @access  Protected
const verifyToken = async (req, res, next) => {
  try {
    sendSuccess(res, 200, 'Token is valid', {
      admin: {
        id: req.admin._id,
        username: req.admin.username,
        email: req.admin.email,
        role: req.admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, logout, verifyToken };
