import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    customerName: {
      type: String,
      default: ''
    },
    customerPhone: {
      type: String,
      default: ''
    },
    carModel: {
      type: String,
      default: 'Honda Civic'
    },
    date: {
      type: String, // e.g. YYYY-MM-DD
      required: true
    },
    timeSlot: {
      type: String, // e.g. "09:00 - 11:00", "13:00 - 15:00"
      required: true
    },
    serviceType: {
      type: String,
      required: true,
      enum: ['ECU Remap & Dyno', 'Suspension & Coilovers Install', 'Full Exhaust Setup', 'Big Brake Kit Install', 'Oil & Fluid Maintenance', 'Performance Inspection']
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    note: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
