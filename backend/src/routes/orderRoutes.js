import express from 'express';
import {
  createOrder,
  getMyOrders,
  uploadPaymentSlip,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/roleMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// POST /api/orders (Checkout new order)
router.post('/', authMiddleware, createOrder);

// GET /api/orders/my-orders (Get user orders)
router.get('/my-orders', authMiddleware, getMyOrders);

// POST /api/orders/:id/slip (Upload payment slip)
router.post('/:id/slip', authMiddleware, upload.single('slip'), uploadPaymentSlip);

// GET /api/orders (Admin view all orders)
router.get('/', authMiddleware, requireAdmin, getAllOrders);

// PUT /api/orders/:id/status (Admin update order status)
router.put('/:id/status', authMiddleware, requireAdmin, updateOrderStatus);

export default router;
