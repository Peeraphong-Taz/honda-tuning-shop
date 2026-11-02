import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// GET /api/products
router.get('/', getProducts);

// GET /api/products/:id
router.get('/:id', getProductById);

// POST /api/products (Admin only)
router.post('/', authMiddleware, requireAdmin, createProduct);

// PUT /api/products/:id (Admin only)
router.put('/:id', authMiddleware, requireAdmin, updateProduct);

// DELETE /api/products/:id (Admin only)
router.delete('/:id', authMiddleware, requireAdmin, deleteProduct);

export default router;
