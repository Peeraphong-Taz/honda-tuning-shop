import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import bookingService from '../services/bookingService';
import { Calendar, Clock, Wrench, Car, Phone, User, CheckCircle2, AlertCircle } from 'lucide-react';

const serviceOptions = [
  'ECU Remap & Dyno',
  'Suspension & Coilovers Install',
  'Full Exhaust Setup',
  'Big Brake Kit Install',
  'Oil & Fluid Maintenance',
  'Performance Inspection'
];

const timeSlots = [
  '09:00 - 11:00',
  '11:00 - 13:00',
  '13:30 - 15:30',
  '15:30 - 17:30'
];

export const BookingForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const { createBooking } = useDatabase();
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerPhone: '',
    carModel: user?.carModel || 'Honda Civic FE',
    serviceType: serviceOptions[0],
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    timeSlot: timeSlots[0],
    note: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Save to mock/local database (instant sync with Mechanic & Admin Dashboard)
      createBooking({
        ...formData,
        userId: user?.id || 'guest',
      });

      // 2. Optionally notify backend if running
      try {
        await bookingService.createBooking(formData);
      } catch (backendErr) {
        // Backend offline is normal in mock mode
        console.log('Saved to local DB (backend offline)');
      }

      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'การจองคิวล้มเหลว กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#161922] border border-emerald-500/40 rounded-xl p-8 text-center space-y-4">
        <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
        <h3 className="text-xl font-bold text-white">ส่งคำขอจองคิวเรียบร้อยแล้ว!</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          เจ้าหน้าที่จะทำการตรวจสอบคิวและติดต่อยืนยันการจองผ่านเบอร์โทรศัพท์ของท่าน
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 px-6 py-2 bg-[#1F2430] hover:bg-[#2E3547] text-white rounded-lg text-sm font-medium transition"
        >
          จองคิวเพิ่มอีก
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#161922] border border-[#2E3547] rounded-xl p-6 md:p-8 space-y-5 shadow-xl">
      <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-[#2E3547] pb-4">
        <Wrench className="w-5 h-5 text-red-500" />
        ฟอร์มจองคิวติดตั้งและจูนนิ่ง (Garage Appointment)
      </h3>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Name */}
        <div>
          <label className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            ชื่อ-นามสกุล ผู้ติดต่อ *
          </label>
          <input
            type="text"
            name="customerName"
            required
            value={formData.customerName}
            onChange={handleChange}
            placeholder="เช่น คุณธนภัทร"
            className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Customer Phone */}
        <div>
          <label className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            เบอร์โทรศัพท์ติดต่อ *
          </label>
          <input
            type="tel"
            name="customerPhone"
            required
            value={formData.customerPhone}
            onChange={handleChange}
            placeholder="08X-XXX-XXXX"
            className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Car Model */}
        <div>
          <label className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-slate-400" />
            รุ่นรถยนต์และเครื่องยนต์ *
          </label>
          <input
            type="text"
            name="carModel"
            required
            value={formData.carModel}
            onChange={handleChange}
            placeholder="เช่น Honda Civic FE 1.5 Turbo หรือ City Hatchback"
            className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Service Type */}
        <div>
          <label className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-slate-400" />
            บริการที่ต้องการ *
          </label>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
          >
            {serviceOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            วันที่ต้องการเข้ารับบริการ *
          </label>
          <input
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Time Slot */}
        <div>
          <label className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            รอบเวลา (Time Slot) *
          </label>
          <select
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleChange}
            className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="text-xs font-medium text-slate-300 mb-1 block">
          รายละเอียดเพิ่มเติม (เช่น สเปคอะไหล่ที่นำมาเอง หรือปัญหาที่ต้องการแก้ไข)
        </label>
        <textarea
          name="note"
          rows={3}
          value={formData.note}
          onChange={handleChange}
          placeholder="ระบุความต้องการเพิ่มเติม..."
          className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? 'กำลังส่งข้อมูล...' : 'ยืนยันการนัดหมายจองคิว'}
      </button>
    </form>
  );
};

export default BookingForm;
