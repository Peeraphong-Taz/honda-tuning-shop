import React from 'react';
import BookingForm from '../components/BookingForm';

const SERVICES = [
  {
    name: 'ECU Remap & Hondata Tune',
    desc: 'จูนสเตจ 1 / สเตจ 2 ปลดล็อคความเร็ว ปรับบูสต์เทอร์โบและองศาไฟจุดระเบิด พร้อมวัดแรงม้าบนไดโน่',
    price: 12000,
  },
  {
    name: 'ติดตั้งสตรัทและเซ็ตช่วงล่าง',
    desc: 'ปรับความสูง ค่า Bump & Rebound และตั้งศูนย์ถ่วงล้อ ทั้งสเปคใช้ถนนและลงแทร็ค',
    price: 2500,
  },
  {
    name: 'อัปเกรดเบรค Big Brake Kit',
    desc: 'ติดตั้งคาลิปเปอร์ 4-Pot / 6-Pot จานเบรคสองชิ้น และไล่น้ำมันเบรคเกรดแข่ง',
    price: 3500,
  },
];

export const Service = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-14">
      {/* Header */}
      <div className="border-b border-[#2A2A2A] pb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display italic">
          <span className="slash" />บริการจูนและติดตั้ง
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl">
          ห้องไดโน่ 4WD และช่างที่ทำรถ Honda VTEC และเทอร์โบโดยเฉพาะ
        </p>
      </div>

      {/* Price list */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-2">ราคาเริ่มต้น</h2>
        <ul className="divide-y divide-[#2A2A2A] border-y border-[#2A2A2A]">
          {SERVICES.map(s => (
            <li key={s.name} className="py-5 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6">
              <h3 className="md:col-span-4 text-base font-semibold text-white">{s.name}</h3>
              <p className="md:col-span-6 text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              <p className="md:col-span-2 md:text-right text-base font-semibold text-white font-display">
                ฿{s.price.toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500 mt-3">
          ราคาจริงขึ้นอยู่กับรุ่นรถและอะไหล่ ช่างจะแจ้งราคาก่อนเริ่มงานทุกครั้ง
        </p>
      </section>

      {/* Booking */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <aside className="space-y-5 text-sm">
          <div>
            <h3 className="text-white font-semibold">เวลาทำการ</h3>
            <p className="text-slate-400 mt-1">จันทร์ – เสาร์ 09:00 – 18:30 น.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold">ที่ตั้งอู่</h3>
            <p className="text-slate-400 mt-1">ถนนเกษตร-นวมินทร์ ลาดพร้าว กทม.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold">โทร</h3>
            <p className="text-slate-400 mt-1">02-888-9999 / 089-777-6655</p>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed pt-2 border-t border-[#2A2A2A]">
            หลังส่งคำขอ ทางร้านจะโทรยืนยันคิวภายในวันทำการถัดไป
          </p>
        </aside>
        <div className="lg:col-span-2">
          <BookingForm />
        </div>
      </section>
    </div>
  );
};

export default Service;
