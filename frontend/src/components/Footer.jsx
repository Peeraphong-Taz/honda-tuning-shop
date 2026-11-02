import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0B0D11] border-t border-[#2E3547] text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Shop Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-black text-white italic">
                H
              </div>
              <span className="text-lg font-bold text-white tracking-wider font-['Outfit']">
                HONDA <span className="text-red-500">TUNING</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              ศูนย์รวมอะไหล่แท้ อะไหล่แต่งสปอร์ต ชุดแต่งรอบคัน ท่อไอเสีย เบรค ช่วงล่าง และบริการจูนกล่อง ECU สำหรับรถยนต์ฮอนด้าทุกรุ่น
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider font-['Outfit']">เมนูหลัก</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop" className="hover:text-red-400 transition">หมวดหมู่อะไหล่แต่ง</Link></li>
              <li><Link to="/service" className="hover:text-red-400 transition">จองคิวไดโน่ & ติดตั้ง</Link></li>
              <li><Link to="/checkout" className="hover:text-red-400 transition">ตะกร้าสินค้า & ชำระเงิน</Link></li>
              <li><Link to="/profile" className="hover:text-red-400 transition">ประวัติคำสั่งซื้อของฉัน</Link></li>
            </ul>
          </div>

          {/* Col 3: Popular Car Models */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider font-['Outfit']">รุ่นรถยอดนิยม</h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="bg-[#1F2430] px-2.5 py-1 rounded text-slate-300">Civic FE / FL</span>
              <span className="bg-[#1F2430] px-2.5 py-1 rounded text-slate-300">Civic Type R</span>
              <span className="bg-[#1F2430] px-2.5 py-1 rounded text-slate-300">City Turbo</span>
              <span className="bg-[#1F2430] px-2.5 py-1 rounded text-slate-300">Accord e:HEV</span>
              <span className="bg-[#1F2430] px-2.5 py-1 rounded text-slate-300">Jazz GK / GE</span>
              <span className="bg-[#1F2430] px-2.5 py-1 rounded text-slate-300">CR-V Turbo</span>
            </div>
          </div>

          {/* Col 4: Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider font-['Outfit']">ติดต่ออู่ & สำนักงาน</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>ถนนเกษตร-นวมินทร์ ลาดพร้าว กทม.</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>02-888-9999 / 089-777-6655</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500 shrink-0" />
                <span>จันทร์ - เสาร์: 09:00 - 18:30 น.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2E3547] mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Honda Tuning Motorsport Co., Ltd. All rights reserved.</p>
          <p className="mt-2 md:mt-0">VTEC Performance & Custom Garage Thailand</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
