import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#050505] text-slate-400 text-sm mt-24">
      <div className="h-1.5 stripes" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Shop Brand */}
          <div className="space-y-4">
            <span className="font-display italic font-bold text-xl tracking-tight text-white">
              HONDA<span className="text-red-600 mx-0.5">/</span>TUNING
            </span>
            <p className="text-sm text-slate-400 leading-relaxed">
              ศูนย์รวมอะไหล่แท้ อะไหล่แต่งสปอร์ต ชุดแต่งรอบคัน ท่อไอเสีย เบรค ช่วงล่าง และบริการจูนกล่อง ECU สำหรับรถยนต์ฮอนด้าทุกรุ่น
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-display font-semibold text-sm">เมนูหลัก</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-red-400 transition">หมวดหมู่อะไหล่แต่ง</Link></li>
              <li><Link to="/service" className="hover:text-red-400 transition">จองคิวไดโน่ & ติดตั้ง</Link></li>
              <li><Link to="/checkout" className="hover:text-red-400 transition">ตะกร้าสินค้า & ชำระเงิน</Link></li>
              <li><Link to="/profile" className="hover:text-red-400 transition">ประวัติคำสั่งซื้อของฉัน</Link></li>
            </ul>
          </div>

          {/* Col 3: Popular Car Models */}
          <div className="space-y-3">
            <h4 className="text-white font-display font-semibold text-sm">รุ่นรถยอดนิยม</h4>
            <ul className="space-y-2 text-sm">
              {['Civic FE / FL', 'Civic Type R', 'City Turbo', 'Accord e:HEV', 'Jazz GK / GE', 'CR-V Turbo'].map(m => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-white font-display font-semibold text-sm">ติดต่ออู่ & สำนักงาน</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span>ถนนเกษตร-นวมินทร์ ลาดพร้าว กทม.</span>
              </li>
              <li className="flex items-center gap-2">
                <span>02-888-9999 / 089-777-6655</span>
              </li>
              <li className="flex items-center gap-2">
                <span>จันทร์ - เสาร์: 09:00 - 18:30 น.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2A2A2A] mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Honda Tuning Motorsport Co., Ltd. All rights reserved.</p>
          <p className="mt-2 md:mt-0">VTEC Performance & Custom Garage Thailand</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
