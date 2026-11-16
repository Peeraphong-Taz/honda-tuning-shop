import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Menu, X } from 'lucide-react';

const CartLink = ({ count }) => (
  <Link to="/checkout" className="text-sm text-slate-200 hover:text-white transition-colors">
    ตะกร้า{' '}
    <span className={`font-display font-semibold ${count > 0 ? 'text-red-500' : 'text-slate-500'}`}>({count})</span>
  </Link>
);

const NavItem = ({ to, end, children }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center border-b-2 transition-colors ${
        isActive ? 'border-red-600 text-white' : 'border-transparent text-slate-400 hover:text-white'
      }`
    }
  >
    {children}
  </NavLink>
);

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
    <nav className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="group leading-none" aria-label="Honda Tuning หน้าแรก">
            <span className="font-display italic font-bold text-xl tracking-tight text-white">
              HONDA<span className="text-red-600 mx-0.5">/</span>TUNING
            </span>
            <span className="block mt-1 h-[3px] w-full stripes opacity-80 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-stretch self-stretch gap-7 text-sm">
            <NavItem to="/" end>หน้าแรก</NavItem>
            <NavItem to="/shop">อะไหล่แต่ง</NavItem>
            <NavItem to="/service">จองคิวเซอร์วิส</NavItem>
            {isAdmin && <NavItem to="/admin/dashboard">หลังร้าน</NavItem>}
            {isMechanic && <NavItem to="/mechanic/dashboard">งานช่าง</NavItem>}
          </div>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <CartLink count={totalItems} />

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="text-sm text-slate-200 hover:text-white max-w-[140px] truncate transition-colors"
                >
                  {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-500 hover:text-white transition-colors"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium px-4 py-1.5 rounded-md text-slate-200 hover:bg-[#1A1A1A] transition"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  className="btn-cut text-sm font-display font-semibold px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            <CartLink count={totalItems} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200" aria-label="เมนู"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121212] border-b border-[#2A2A2A] px-4 pt-2 pb-6 space-y-3">
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
              หลังร้าน
            </Link>
          )}
          <div className="pt-3 border-t border-[#2A2A2A]">
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
                  className="w-full text-center py-2 rounded-md bg-[#1A1A1A] text-white"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-md bg-red-600 text-white font-semibold"
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
