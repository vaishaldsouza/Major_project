import express from 'express';
import {
  createOrder,
  getOrders,
  getBuyerOrders,
  getFarmerOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  updatePaymentStatus,
} from '../controllers/orderController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

router.use(protect);

// Create order
router.post('/', restrictTo('buyer'), createOrder);

// Get orders based on role
router.get('/', restrictTo('admin'), getOrders);
router.get('/buyer', restrictTo('buyer'), getBuyerOrders);
router.get('/farmer', restrictTo('farmer'), getFarmerOrders);

// Single order
router.get('/:id', getOrder);

// Order actions
router.put('/:id/status', restrictTo('farmer', 'admin'), updateOrderStatus);
router.put('/:id/cancel', restrictTo('buyer', 'admin'), cancelOrder);
router.put('/:id/payment', restrictTo('buyer', 'admin'), updatePaymentStatus);

export default router;