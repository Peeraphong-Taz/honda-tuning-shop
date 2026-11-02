import Order from '../models/Order.js';

let mockOrders = [
  {
    _id: 'ord-1001',
    userId: 'mock-user-1',
    items: [
      {
        productId: 'prod-1',
        name: 'HKS Hi-Power Spec-L II Exhaust System',
        price: 36500,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=400&q=80'
      }
    ],
    total: 36500,
    shippingAddress: {
      fullName: 'Tanaphat VTEC',
      phone: '081-234-5678',
      address: '99/1 Rama 9 Road, Huai Khwang',
      province: 'Bangkok',
      postalCode: '10310'
    },
    slipUrl: '/uploads/sample-slip.jpg',
    status: 'verified',
    createdAt: new Date().toISOString()
  }
];

// POST /api/orders (Checkout)
export const createOrder = async (req, res, next) => {
  try {
    const { items, total, shippingAddress } = req.body;
    const userId = req.user ? req.user.id : 'guest-user';

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    try {
      const newOrder = await Order.create({
        userId,
        items,
        total,
        shippingAddress,
        status: 'pending_payment'
      });
      return res.status(201).json({ success: true, data: newOrder });
    } catch (e) {
      const newMock = {
        _id: 'ord-' + Date.now(),
        userId,
        items,
        total,
        shippingAddress,
        slipUrl: '',
        status: 'pending_payment',
        createdAt: new Date().toISOString()
      };
      mockOrders.unshift(newMock);
      return res.status(201).json({ success: true, data: newMock });
    }
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/my-orders (User)
export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    try {
      const orders = await Order.find({ userId }).sort({ createdAt: -1 });
      if (orders && orders.length > 0) {
        return res.json({ success: true, count: orders.length, data: orders });
      }
    } catch (e) {
      // Fallback
    }

    const filtered = mockOrders.filter(o => o.userId === userId || userId === 'mock-user-1');
    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    next(error);
  }
};

// POST /api/orders/:id/slip (Upload slip)
export const uploadPaymentSlip = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image slip' });
    }

    const slipPath = `/uploads/${req.file.filename}`;

    try {
      const updated = await Order.findByIdAndUpdate(
        id,
        { slipUrl: slipPath, status: 'slip_uploaded' },
        { new: true }
      );
      if (updated) {
        return res.json({ success: true, message: 'Payment slip uploaded successfully', data: updated });
      }
    } catch (e) {
      // Fallback
    }

    const index = mockOrders.findIndex(o => o._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    mockOrders[index].slipUrl = slipPath;
    mockOrders[index].status = 'slip_uploaded';
    return res.json({ success: true, message: 'Payment slip uploaded successfully', data: mockOrders[index] });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders (Admin)
export const getAllOrders = async (req, res, next) => {
  try {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      if (orders && orders.length > 0) {
        return res.json({ success: true, count: orders.length, data: orders });
      }
    } catch (e) {
      // Fallback
    }

    return res.json({ success: true, count: mockOrders.length, data: mockOrders });
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id/status (Admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
      if (updated) {
        return res.json({ success: true, data: updated });
      }
    } catch (e) {
      // Fallback
    }

    const index = mockOrders.findIndex(o => o._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    mockOrders[index].status = status;
    return res.json({ success: true, data: mockOrders[index] });
  } catch (error) {
    next(error);
  }
};
