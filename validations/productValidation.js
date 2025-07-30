const { body } = require('express-validator');

exports.validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required'),

  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isNumeric().withMessage('Quantity must be a number'),

  body('categories')
    .isArray({ min: 1 }).withMessage('At least one category is required')
];
