import React from 'react';
import BookingForm from '../components/BookingForm';
import { Gauge, Cpu, Disc, Wrench, Shield, CheckCircle } from 'lucide-react';

export const Service = () => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-red-500 font-semibold">
          Honda Performance Garage Services
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-white font-['Outfit']">
          บริการจูนนิ่ง & ติดตั้งครบวงจร
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
          ดูแลรถฮอนด้าของคุณด้วยเครื่องมือมาตรฐานศูนย์แข่งขัน ห้องไดโน่ 4WD และช่างผู้ชำนาญการ VTEC & Turbo
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161922] border border-[#2E3547] rounded-xl p-6 space-y-3 hover:border-red-500 transition">
          <div className="w-10 h-10 rounded-lg bg-red-600/10 flex items-center justify-center text-red-500">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">ECU Remap & Hondata Tune</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            จูนสเตจ 1, สเตจ 2 ปลดล็อคความเร็ว ปรับบูสต์เทอร์โบ และองศาไฟจุดระเบิด พร้อมวัดแรงม้าบนไดโน่
          </p>
          <div className="text-xs font-semibold text-red-400 pt-1">เริ่มต้น ฿12,000</div>
        </div>

        <div className="bg-[#161922] border border-[#2E3547] rounded-xl p-6 space-y-3 hover:border-red-500 transition">
          <div className="w-10 h-10 rounded-lg bg-red-600/10 flex items-center justify-center text-red-500">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">ติดตั้งสตรัท & เซ็ตช่วงล่าง</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            ปรับระดับความสูง ค่า Bump & Rebound และตั้งศูนย์ถ่วงล้อสำหรับวิ่งถนนและแทร็คเซอร์กิต
          </p>
          <div className="text-xs font-semibold text-red-400 pt-1">เริ่มต้น ฿2,500</div>
        </div>

        <div className="bg-[#161922] border border-[#2E3547] rounded-xl p-6 space-y-3 hover:border-red-500 transition">
          <div className="w-10 h-10 rounded-lg bg-red-600/10 flex items-center justify-center text-red-500">
            <Disc className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">อัปเกรดเบรค Big Brake Kit</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            ติดตั้งชุดคาลิปเปอร์ 4-Pot / 6-Pot, จานเบรคขยายสองชิ้น และไล่น้ำมันเบรคเกรดแข่งขัน
          </p>
          <div className="text-xs font-semibold text-red-400 pt-1">เริ่มต้น ฿3,500</div>
        </div>
      </div>

      {/* Booking Form Section */}
      <div className="pt-6">
        <BookingForm />
      </div>
    </div>
  );
};

export default Service;
