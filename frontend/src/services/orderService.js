import api from './api';

export const orderService = {
  // Create order / Checkout
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get current user's orders
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  // Upload payment slip image
  uploadSlip: async (orderId, formData) => {
    const response = await api.post(`/orders/${orderId}/slip`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get all orders (Admin)
  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Update order status (Admin)
  updateStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  }
};

export default orderService;
