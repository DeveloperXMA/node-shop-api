const express = require('express');
const router = express.Router();
const multer = require('multer');

const ProductsController = require('../controllers/products');

const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './uploads/');
  },
  filename: function(req, file, callback) {
    callback(null, new Date().toISOString() + file.originalname)
  }
});

const fileFilter = (req, file, callback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
    callback(null, true);
  } else {
    callback(null, false);
  }
}

const upload = multer({
  storage: storage, 
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const Product = require('../models/product');

router.get('/', ProductsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'),ProductsController.products_create_product);

router.get('/:productId', ProductsController.products_get_product);

router.patch('/:productId', checkAuth, ProductsController.products_patch_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;