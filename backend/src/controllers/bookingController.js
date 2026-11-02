import Booking from '../models/Booking.js';

let mockBookings = [
  {
    _id: 'book-1',
    userId: 'mock-user-1',
    customerName: 'K. Tanaphat',
    customerPhone: '081-234-5678',
    carModel: 'Honda Civic FE 1.5 Turbo',
    date: '2026-11-10',
    timeSlot: '10:00 - 12:00',
    serviceType: 'ECU Remap & Dyno',
    status: 'confirmed',
    note: 'Stage 1 95 octane tune request'
  },
  {
    _id: 'book-2',
    userId: 'mock-user-1',
    customerName: 'K. Somchai',
    customerPhone: '089-987-6543',
    carModel: 'Honda City Hatchback RS',
    date: '2026-11-12',
    timeSlot: '13:00 - 15:00',
    serviceType: 'Suspension & Coilovers Install',
    status: 'pending',
    note: 'Bring own Tein Flex Z coilovers'
  }
];

// POST /api/bookings (User)
export const createBooking = async (req, res, next) => {
  try {
    const { customerName, customerPhone, carModel, date, timeSlot, serviceType, note } = req.body;
    const userId = req.user ? req.user.id : 'guest-user';

    if (!date || !timeSlot || !serviceType) {
      return res.status(400).json({ success: false, message: 'Please provide date, time slot, and service type' });
    }

    try {
      const newBooking = await Booking.create({
        userId,
        customerName: customerName || req.user?.name || 'Customer',
        customerPhone: customerPhone || '',
        carModel: carModel || req.user?.carModel || 'Honda Civic',
        date,
        timeSlot,
        serviceType,
        note: note || '',
        status: 'pending'
      });
      return res.status(201).json({ success: true, data: newBooking });
    } catch (e) {
      const newMock = {
        _id: 'book-' + Date.now(),
        userId,
        customerName: customerName || 'Customer',
        customerPhone: customerPhone || '',
        carModel: carModel || 'Honda Civic',
        date,
        timeSlot,
        serviceType,
        note: note || '',
        status: 'pending'
      };
      mockBookings.unshift(newMock);
      return res.status(201).json({ success: true, data: newMock });
    }
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings/my-bookings (User)
export const getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    try {
      const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
      if (bookings && bookings.length > 0) {
        return res.json({ success: true, count: bookings.length, data: bookings });
      }
    } catch (e) {
      // Fallback
    }

    const filtered = mockBookings.filter(b => b.userId === userId || userId === 'mock-user-1');
    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings (Admin)
export const getAllBookings = async (req, res, next) => {
  try {
    try {
      const bookings = await Booking.find().sort({ date: 1, timeSlot: 1 });
      if (bookings && bookings.length > 0) {
        return res.json({ success: true, count: bookings.length, data: bookings });
      }
    } catch (e) {
      // Fallback
    }

    return res.json({ success: true, count: mockBookings.length, data: mockBookings });
  } catch (error) {
    next(error);
  }
};

// PUT /api/bookings/:id/status (Admin)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const updated = await Booking.findByIdAndUpdate(id, { status }, { new: true });
      if (updated) {
        return res.json({ success: true, data: updated });
      }
    } catch (e) {
      // Fallback
    }

    const index = mockBookings.findIndex(b => b._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    mockBookings[index].status = status;
    return res.json({ success: true, data: mockBookings[index] });
  } catch (error) {
    next(error);
  }
};
