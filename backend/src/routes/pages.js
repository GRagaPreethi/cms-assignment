const express = require('express');
const router = express.Router();
const { getPages, getPageBySlug, createPage, updatePage, deletePage } = require('../controllers/pagesController');
const { protect } = require('../middleware/auth');
const { createPageValidator, updatePageValidator, pageIdValidator } = require('../validators/pageValidator');
const validate = require('../middleware/validate');

// Optional auth middleware (attaches admin to req if token exists, doesn't block if not)
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const jwt = require('jsonwebtoken');
    const Admin = require('../models/Admin');
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select('-password');
    } catch (err) {
      // Token invalid or expired - continue as public
    }
  }
  next();
};

router.get('/', optionalAuth, getPages);
router.get('/:slug', optionalAuth, getPageBySlug);
router.post('/', protect, createPageValidator, validate, createPage);
router.put('/:id', protect, pageIdValidator, validate, updatePageValidator, validate, updatePage);
router.delete('/:id', protect, pageIdValidator, validate, deletePage);

module.exports = router;
