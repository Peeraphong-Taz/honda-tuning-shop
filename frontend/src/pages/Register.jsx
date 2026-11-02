import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle } from 'lucide-react';

const popularModels = [
  'Honda Civic FE (2021-ปัจจุบัน)',
  'Honda Civic FK8 / FL5 Type R',
  'Honda City Hatchback / Sedan 1.0 Turbo',
  'Honda Accord G10 / G11 e:HEV',
  'Honda Jazz GK / GE',
  'Honda Brio / Amaze',
  'Honda CR-V Turbo / e:HEV'
];

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    carModel: popularModels[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'การสมัครสมาชิกล้มเหลว');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-[#161922] border border-[#2E3547] rounded-2xl p-8 space-y-6 shadow-2xl">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-red-600 mx-auto flex items-center justify-center font-black text-2xl text-white italic shadow-lg shadow-red-600/30">
          H
        </div>
        <h1 className="text-2xl font-bold text-white font-['Outfit']">สมัครสมาชิกใหม่</h1>
        <p className="text-xs text-slate-400">สร้างบัญชีเพื่อสั่งซื้ออะไหล่และจองคิวเซอร์วิส</p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-300 mb-1 block">ชื่อ-นามสกุล หรือชื่อเล่น *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="เช่น คุณเอกชัย VTEC"
            className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-300 mb-1 block">อีเมล (Email) *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="yourname@gmail.com"
            className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-300 mb-1 block">รหัสผ่าน (อย่างน้อย 6 ตัวอักษร) *</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-300 mb-1 block">รุ่นรถยนต์ที่คุณขับขี่</label>
          <select
            name="carModel"
            value={formData.carModel}
            onChange={handleChange}
            className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
          >
            {popularModels.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg shadow-red-600/30 transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          {loading ? 'กำลังลงทะเบียน...' : 'ยืนยันสมัครสมาชิก'}
        </button>
      </form>

      <div className="text-center text-xs text-slate-400 pt-2">
        มีบัญชีอยู่แล้ว?{' '}
        <Link to="/login" className="text-red-400 hover:underline font-semibold">
          เข้าสู่ระบบที่นี่
        </Link>
      </div>
    </div>
  );
};

export default Register;
