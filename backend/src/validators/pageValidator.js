const { body, param } = require('express-validator');

const createPageValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Page title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('slug')
    .trim()
    .notEmpty().withMessage('Slug is required')
    .toLowerCase()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Slug must be lowercase alphanumeric with hyphens only'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'published']).withMessage('Status must be either draft or published'),
  body('blocks')
    .optional()
    .isArray().withMessage('Blocks must be an array'),
];

const updatePageValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Page title cannot be empty')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('slug')
    .optional()
    .trim()
    .toLowerCase()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Slug must be lowercase alphanumeric with hyphens only'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'published']).withMessage('Status must be either draft or published'),
  body('blocks')
    .optional()
    .isArray().withMessage('Blocks must be an array'),
];

const pageIdValidator = [
  param('id')
    .isMongoId().withMessage('Invalid page ID format'),
];

module.exports = { createPageValidator, updatePageValidator, pageIdValidator };
