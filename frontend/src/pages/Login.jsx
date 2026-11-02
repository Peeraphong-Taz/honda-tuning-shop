import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login(formData);
      if (res?.user?.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (res?.user?.role === 'mechanic') {
        navigate('/mechanic/dashboard', { replace: true });
      } else {
        navigate(from === '/' ? '/profile' : from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-[#161922] border border-[#2E3547] rounded-2xl p-8 space-y-6 shadow-2xl">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-red-600 mx-auto flex items-center justify-center font-black text-2xl text-white italic shadow-lg shadow-red-600/30">
          H
        </div>
        <h1 className="text-2xl font-bold text-white font-['Outfit']">เข้าสู่ระบบ</h1>
        <p className="text-xs text-slate-400">ยินดีต้อนรับสู่ระบบ Honda Tuning Shop</p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-300 mb-1 block">อีเมล (Email) *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="user@honda.com"
            className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-300 mb-1 block">รหัสผ่าน (Password) *</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg shadow-red-600/30 transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>

      {/* Demo Credentials Box */}
      <div className="bg-[#1F2430] border border-[#2E3547] rounded-xl p-3 text-xs space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 block">บัญชีทดสอบด่วน (Click to fill):</span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('user@honda.com', '123456')}
            className="py-1 px-2 rounded bg-[#161922] hover:bg-[#2E3547] text-slate-300 border border-[#2E3547] text-[11px]"
          >
            👤 ลูกค้า
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('mechanic@honda.com', 'mechanic123')}
            className="py-1 px-2 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px]"
          >
            🔧 ช่าง
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@honda.com', 'admin123')}
            className="py-1 px-2 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px]"
          >
            🛡️ แอดมิน
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 pt-2">
        ยังไม่มีบัญชีผู้ใช้?{' '}
        <Link to="/register" className="text-red-400 hover:underline font-semibold">
          สมัครสมาชิกใหม่
        </Link>
      </div>
    </div>
  );
};

export default Login;
