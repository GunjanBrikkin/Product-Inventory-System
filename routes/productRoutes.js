const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../validations/productValidation');

router.post('/product/add', validateProduct, productController.createProduct);
router.post('/products/list', productController.list);
router.delete('/product/delete', productController.deleteProduct);

module.exports = router;
