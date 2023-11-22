const express = require('express');

const {
  getProducts, 
  getProduct, 
  deleteProduct,
  addProduct,
  updateProduct,
	getComments,
} = require('../controllers/product-controller');

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products', addProduct);
router.put('/products/:id', updateProduct);

router.get('/products/:id', getComments);


module.exports = router;
