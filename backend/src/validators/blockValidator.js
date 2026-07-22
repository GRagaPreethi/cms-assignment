const { body, param } = require('express-validator');

const VALID_BLOCK_TYPES = ['header', 'paragraph', 'list', 'nested-list', 'table', 'equation', 'image', 'documentation', 'mixed-content'];

const createBlockValidator = [
  body('pageId')
    .notEmpty().withMessage('Page ID is required')
    .isMongoId().withMessage('Invalid page ID format'),
  body('type')
    .notEmpty().withMessage('Block type is required')
    .isIn(VALID_BLOCK_TYPES).withMessage(`Block type must be one of: ${VALID_BLOCK_TYPES.join(', ')}`),
  body('data')
    .notEmpty().withMessage('Block data is required'),
  body('order')
    .notEmpty().withMessage('Block order is required')
    .isInt({ min: 0 }).withMessage('Block order must be a non-negative integer'),
];

const updateBlockValidator = [
  body('type')
    .optional()
    .isIn(VALID_BLOCK_TYPES).withMessage(`Block type must be one of: ${VALID_BLOCK_TYPES.join(', ')}`),
  body('data')
    .optional()
    .notEmpty().withMessage('Block data cannot be empty'),
  body('order')
    .optional()
    .isInt({ min: 0 }).withMessage('Block order must be a non-negative integer'),
];

const blockIdValidator = [
  param('id').isMongoId().withMessage('Invalid block ID format'),
];

module.exports = { createBlockValidator, updateBlockValidator, blockIdValidator };
