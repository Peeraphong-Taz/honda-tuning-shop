import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Wrench, Gauge, User as UserIcon, LogOut, Menu, X, ShieldCheck } from 'lucide-react';

export const Navbar = () => {
  const { user, isAdmin, isMechanic, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0F1115]/90 backdrop-blur-md border-b border-[#2E3547]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center font-black text-xl text-white italic tracking-wider shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              H
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1 font-['Outfit']">
                HONDA <span className="text-red-500 font-black">TUNING</span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase block -mt-1">
                Motorsport & Performance
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="text-slate-300 hover:text-white transition">หน้าแรก</Link>
            <Link to="/shop" className="text-slate-300 hover:text-white transition">อะไหล่แต่ง (Shop)</Link>
            <Link to="/service" className="text-slate-300 hover:text-white flex items-center gap-1.5 transition">
              <Wrench className="w-4 h-4 text-red-500" />
              จองคิวเซอร์วิส
            </Link>

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-400/10 px-3 py-1 rounded-md border border-amber-400/20 text-xs font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                แอดมิน (Admin)
              </Link>
            )}

            {isMechanic && (
              <Link
                to="/mechanic/dashboard"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-400/10 px-3 py-1 rounded-md border border-cyan-400/20 text-xs font-semibold"
              >
                <Wrench className="w-3.5 h-3.5" />
                แดชบอร์ดช่าง (Mechanic)
              </Link>
            )}
          </div>



          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Icon */}
            <Link
              to="/checkout"
              className="relative p-2 rounded-lg bg-[#1F2430] border border-[#2E3547] hover:border-red-500 text-slate-200 transition"
              title="ตะกร้าสินค้า"
            >
              <ShoppingBag className="w-5 h-5 text-slate-200" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 bg-[#1F2430] border border-[#2E3547] px-3 py-1.5 rounded-lg text-sm hover:border-slate-500 transition"
                >
                  <UserIcon className="w-4 h-4 text-red-500" />
                  <span className="text-slate-200 font-medium max-w-[120px] truncate">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 transition"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium px-4 py-1.5 rounded-lg text-slate-200 hover:bg-[#1F2430] transition"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/25 transition"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            <Link to="/checkout" className="relative p-2 text-slate-200">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#1F2430] border border-[#2E3547] text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#161922] border-b border-[#2E3547] px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 font-medium"
          >
            หน้าแรก
          </Link>
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 font-medium"
          >
            อะไหล่แต่ง (Shop)
          </Link>
          <Link
            to="/service"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 font-medium"
          >
            จองคิวเซอร์วิส
          </Link>
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-amber-400 font-semibold"
            >
              แดชบอร์ดแอดมิน
            </Link>
          )}
          <div className="pt-3 border-t border-[#2E3547]">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-slate-200"
                >
                  โปรไฟล์ ({user.name})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-red-400"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg bg-[#1F2430] text-white"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg bg-red-600 text-white font-semibold"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
