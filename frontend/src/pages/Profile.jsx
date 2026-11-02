import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import orderService from '../services/orderService';
import bookingService from '../services/bookingService';
import { User, Car, ShoppingBag, Calendar, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const { orders: dbOrders, bookings: dbBookings } = useDatabase();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'bookings'
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, bookingsRes] = await Promise.all([
          orderService.getMyOrders().catch(() => ({ data: [] })),
          bookingService.getMyBookings().catch(() => ({ data: [] }))
        ]);
        const userOrders = ordersRes.data && ordersRes.data.length > 0
          ? ordersRes.data
          : (dbOrders || []).filter(o => !user?.id || o.userId === user?.id || o.userId === 'guest');
        
        const userBookings = bookingsRes.data && bookingsRes.data.length > 0
          ? bookingsRes.data
          : (dbBookings || []).filter(b => !user?.id || b.userId === user?.id || b.userId === 'guest');

        setOrders(userOrders);
        setBookings(userBookings);
      } catch (err) {
        console.error('Failed to load profile data:', err);
        setOrders(dbOrders || []);
        setBookings(dbBookings || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, dbOrders, dbBookings]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
      case 'confirmed':
      case 'completed':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">อนุมัติแล้ว</span>;
      case 'slip_uploaded':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">แนบสลิปแล้ว / รอตรวจ</span>;
      case 'shipping':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">กำลังจัดส่ง</span>;
      case 'pending':
      case 'pending_payment':
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">รอดำเนินการ</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Profile Card */}
      <div className="bg-[#161922] border border-[#2E3547] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-red-500 text-2xl font-black">
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user?.name || 'User Profile'}</h1>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-[#1F2430] text-red-400 px-2.5 py-0.5 rounded-full border border-[#2E3547] flex items-center gap-1">
                <Car className="w-3.5 h-3.5" />
                {user?.carModel || 'Honda Civic'}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full uppercase text-[10px] font-bold">
                {user?.role || 'user'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-[#2E3547]">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'orders'
              ? 'border-red-500 text-red-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          ประวัติคำสั่งซื้อ ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'bookings'
              ? 'border-red-500 text-red-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          คิวจองเซอร์วิส ({bookings.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : activeTab === 'orders' ? (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-[#161922] rounded-xl border border-[#2E3547]">
              ยังไม่มีประวัติคำสั่งซื้อ
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="bg-[#161922] border border-[#2E3547] rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2E3547] pb-3">
                  <div>
                    <span className="text-xs text-slate-400">Order ID: </span>
                    <span className="font-mono text-xs font-semibold text-white">{order._id}</span>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-300">
                      <span>{item.name} x {item.quantity}</span>
                      <span className="font-['Outfit'] font-semibold">฿{Number(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-[#2E3547] text-sm font-bold">
                  <span className="text-slate-400">ยอดสุทธิ</span>
                  <span className="text-red-500 font-['Outfit'] text-base">฿{Number(order.total).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-[#161922] rounded-xl border border-[#2E3547]">
              ยังไม่มีประวัติการจองคิว
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking._id} className="bg-[#161922] border border-[#2E3547] rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-center border-b border-[#2E3547] pb-3">
                  <h4 className="font-bold text-white text-sm">{booking.serviceType}</h4>
                  {getStatusBadge(booking.status)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                    <span>วันที่: {booking.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-red-500" />
                    <span>รอบ: {booking.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-red-500" />
                    <span>รถ: {booking.carModel}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
