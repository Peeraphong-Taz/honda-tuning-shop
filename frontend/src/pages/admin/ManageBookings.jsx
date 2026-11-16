import React from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Calendar, Clock, Car, Phone, User, CheckCircle2 } from 'lucide-react';

export const ManageBookings = () => {
  const { bookings, updateBookingStatus, loading } = useDatabase();

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await updateBookingStatus(id, newStatus);
    if (error) alert(`ไม่สามารถอัปเดตสถานะได้: ${error}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#121212] border border-[#2A2A2A] p-5 rounded-md">
        <h1 className="text-xl font-bold text-white flex items-center gap-2 font-display">
          <Calendar className="w-5 h-5 text-red-500" />
          จัดการคิวจองงานเซอร์วิส & ไดโน่ (Service Schedule)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          อนุมัติ อัปเดตสถานะ และตรวจสอบคิวลูกค้าที่นัดหมายเข้าอู่
        </p>
      </div>

      <div className="bg-[#121212] border border-[#2A2A2A] rounded-md overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#1A1A1A] text-slate-400 uppercase font-semibold border-b border-[#2A2A2A]">
            <tr>
              <th className="p-4">วัน & เวลา</th>
              <th className="p-4">บริการ</th>
              <th className="p-4">ลูกค้า & รถยนต์</th>
              <th className="p-4">เบอร์โทรศัพท์</th>
              <th className="p-4">สถานะคิว</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">กำลังโหลดรายการคิวจอง...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">ไม่มีรายการคิวจองในระบบ</td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-[#1A1A1A]/40 transition">
                  <td className="p-4 whitespace-nowrap">
                    <span className="font-semibold text-white block">{booking.date}</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-red-500" /> {booking.timeSlot}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-red-400 block">{booking.serviceType}</span>
                    {booking.note && (
                      <span className="text-[10px] text-slate-400 italic">"{booking.note}"</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-white block">{booking.customerName}</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Car className="w-3 h-3 text-slate-500" /> {booking.carModel}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-300">
                    {booking.customerPhone || '-'}
                  </td>
                  <td className="p-4">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className={`text-xs px-2.5 py-1 rounded font-semibold border focus:outline-none transition ${
                        booking.status === 'confirmed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : booking.status === 'completed'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : booking.status === 'cancelled'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      <option value="pending" className="bg-[#121212] text-amber-400">pending (รอตรวจ)</option>
                      <option value="confirmed" className="bg-[#121212] text-emerald-400">confirmed (ยืนยันแล้ว)</option>
                      <option value="in_progress" className="bg-[#121212] text-yellow-400">in_progress (กำลังทำ)</option>
                      <option value="completed" className="bg-[#121212] text-blue-400">completed (เสร็จสิ้น)</option>
                      <option value="cancelled" className="bg-[#121212] text-rose-400">cancelled (ยกเลิก)</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
