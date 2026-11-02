import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please enter product price'],
      min: 0
    },
    stock: {
      type: Number,
      required: [true, 'Please enter stock quantity'],
      default: 10,
      min: 0
    },
    category: {
      type: String,
      required: [true, 'Please select category'],
      enum: ['Exhaust', 'Engine & Turbo', 'Suspension', 'Brake Kit', 'Aero & Exterior', 'ECU & Tuning', 'Interior & Gauges']
    },
    carCompatible: {
      type: [String],
      default: ['Honda Civic FE', 'Honda Civic FK8', 'Honda City Turbo', 'Honda Accord', 'Universal Honda']
    },
    description: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80'
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
