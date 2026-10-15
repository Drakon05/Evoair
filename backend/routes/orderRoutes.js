import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

router.use(authenticate);

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);

export default router;
