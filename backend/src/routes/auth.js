const express = require('express');
const router = express.Router();
const { login, logout, verifyToken } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { loginValidator } = require('../validators/authValidator');
const validate = require('../middleware/validate');

router.post('/login', loginValidator, validate, login);
router.post('/logout', protect, logout);
router.get('/verify', protect, verifyToken);

module.exports = router;
