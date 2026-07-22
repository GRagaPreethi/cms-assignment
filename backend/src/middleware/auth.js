const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const ApiError = require('../utils/ApiError');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError(401, 'Authentication token is required'));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return next(new ApiError(401, 'Invalid authentication token'));
      }
      if (err.name === 'TokenExpiredError') {
        return next(new ApiError(401, 'Authentication token has expired'));
      }
      return next(new ApiError(401, 'Token verification failed'));
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return next(new ApiError(401, 'Admin account no longer exists'));
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(new ApiError(500, 'Authentication error'));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return next(new ApiError(403, `Role '${req.admin.role}' is not authorized to access this resource`));
    }
    next();
  };
};

module.exports = { protect, authorize };
