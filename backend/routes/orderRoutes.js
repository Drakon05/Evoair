import express from 'express';
import { createOrder, getOrders } from '../controllers/orderController.js';

const router = express.Router();

router.route('/').post(createOrder).get(getOrders);

export default router;
