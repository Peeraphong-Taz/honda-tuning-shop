import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  imageUrl: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [orderItemSchema],
    total: {
      type: Number,
      required: true,
      min: 0
    },
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      province: String,
      postalCode: String
    },
    slipUrl: {
      type: String, // Uploaded payment receipt image path or URL
      default: ''
    },
    status: {
      type: String,
      enum: ['pending_payment', 'slip_uploaded', 'verified', 'shipping', 'completed', 'cancelled'],
      default: 'pending_payment'
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
