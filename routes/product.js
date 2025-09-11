const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const auth = require('../middlewares/auth');

router.post('/create-product', auth.authenticate, ProductController.createProcuct);
router.delete('/delete-product/:id', auth.authenticate, ProductController.deleteProduct);
router.put('/update-product/:id', auth.authenticate, ProductController.updateProduct);
router.get('/products/barbershop/:barbershop', auth.authenticate, ProductController.getProductByBarbershop);

module.exports = router;