const express = require('express');
const router = express.Router();
const { createBlock, updateBlock, deleteBlock } = require('../controllers/blocksController');
const { protect } = require('../middleware/auth');
const { createBlockValidator, updateBlockValidator, blockIdValidator } = require('../validators/blockValidator');
const validate = require('../middleware/validate');

router.post('/', protect, createBlockValidator, validate, createBlock);
router.put('/:id', protect, blockIdValidator, validate, updateBlockValidator, validate, updateBlock);
router.delete('/:id', protect, blockIdValidator, validate, deleteBlock);

module.exports = router;
