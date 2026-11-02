import express from 'express';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus
} from '../controllers/bookingController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// POST /api/bookings (User book a slot)
router.post('/', authMiddleware, createBooking);

// GET /api/bookings/my-bookings (User get own bookings)
router.get('/my-bookings', authMiddleware, getMyBookings);

// GET /api/bookings (Admin get all bookings)
router.get('/', authMiddleware, requireAdmin, getAllBookings);

// PUT /api/bookings/:id/status (Admin update booking status)
router.put('/:id/status', authMiddleware, requireAdmin, updateBookingStatus);

export default router;
