import express from 'express';
import * as catalogController from '../controllers/catalogController.js';

const router = express.Router();

router.get('/products', catalogController.getProducts);
router.get('/products/:slug', catalogController.getProductBySlug);
router.post('/cart/validate', catalogController.validateCart);

export default router;
