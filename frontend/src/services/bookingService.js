import api from './api';

export const bookingService = {
  // Create booking (User)
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get current user's bookings
  getMyBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  // Get all bookings (Admin)
  getAllBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  // Update booking status (Admin)
  updateStatus: async (id, status) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
  }
};

export default bookingService;
