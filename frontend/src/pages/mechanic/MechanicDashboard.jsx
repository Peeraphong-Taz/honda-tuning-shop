import React, { useState, useMemo } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import {
  Wrench, Calendar, Clock, CheckCircle, XCircle, User, Phone, Car,
  MessageCircle, ChevronDown, ChevronUp, AlertCircle, Clipboard, Star,
  Zap
} from 'lucide-react';

export const MechanicDashboard = () => {
  const {
    bookings, mechanics, purchaseChecklist,
    updateBookingStatus, assignMechanic, toggleChecklistItem,
    SERVICE_TYPES,
  } = useDatabase();

  const [selectedMechanic, setSelectedMechanic] = useState(mechanics[0]?.id || '');
  const [activeTab, setActiveTab] = useState('schedule');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [sentMessages, setSentMessages] = useState([]);
  const [expandedBooking, setExpandedBooking] = useState(null);

  const currentMechanic = mechanics.find(m => m.id === selectedMechanic);

  // Bookings assigned to this mechanic
  const myBookings = useMemo(() => {
    return bookings.filter(b => b.mechanicId === selectedMechanic);
  }, [bookings, selectedMechanic]);

  // All pending bookings (unassigned)
  const pendingBookings = useMemo(() => {
    return bookings.filter(b => b.status === 'pending' && !b.mechanicId);
  }, [bookings]);

  // Check mechanic capability for a service
  const canHandleService = (serviceId) => {
    const service = SERVICE_TYPES.find(s => s.id === serviceId);
    if (!service || !currentMechanic) return true;

    const levelMap = { master: 3, general: 2, apprentice: 1 };
    return levelMap[currentMechanic.role] >= levelMap[service.minLevel];
  };

  // Stats for the selected mechanic
  const mechStats = useMemo(() => ({
    totalJobs: myBookings.length,
    completed: myBookings.filter(b => b.status === 'completed').length,
    inProgress: myBookings.filter(b => b.status === 'assigned').length,
    pending: pendingBookings.length,
  }), [myBookings, pendingBookings]);

  // Handle self-assignment
  const handleAcceptJob = (bookingId) => {
    assignMechanic(bookingId, selectedMechanic);
  };

  // Handle complete job
  const handleCompleteJob = (bookingId) => {
    updateBookingStatus(bookingId, 'completed');
  };

  // Handle send contact message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setSentMessages(prev => [
      {
        id: Date.now(),
        mechanic: currentMechanic?.name || 'ช่าง',
        message: contactMessage,
        timestamp: new Date().toLocaleString('th-TH'),
      },
      ...prev,
    ]);
    setContactMessage('');
    setShowContactModal(false);
  };

  const tabs = [
    { id: 'schedule', label: 'ตารางงาน', icon: Calendar },
    { id: 'available', label: `งานรอรับ (${pendingBookings.length})`, icon: Clipboard },
    { id: 'install', label: 'เช็คลิสต์ติดตั้ง', icon: CheckCircle },
    { id: 'messages', label: 'ข้อความ', icon: MessageCircle },
  ];

  const getRoleBadge = (role) => {
    switch (role) {
      case 'master': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/40', label: '⭐ Master' };
      case 'general': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/40', label: '🔧 ช่างทั่วไป' };
      case 'apprentice': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40', label: '🧑‍🔧 ฝึกหัด' };
      default: return { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/40', label: role };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#161922] to-[#15191f] border border-blue-500/20 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Wrench className="w-7 h-7 text-blue-400" />
            <div>
              <h1 className="text-2xl font-black text-white font-['Outfit']">
                แดชบอร์ดช่าง
              </h1>
              <p className="text-xs text-slate-400">
                Mechanic Dashboard — ตารางงาน นัดลูกค้า เช็คลิสต์ติดตั้ง
              </p>
            </div>
          </div>

          {/* Mechanic Selector */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[11px] text-slate-400">เข้าใช้ในนาม:</span>
            <select
              value={selectedMechanic}
              onChange={e => setSelectedMechanic(e.target.value)}
              className="bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              {mechanics.map(m => (
                <option key={m.id} value={m.id}>{m.avatar} {m.name} — {m.roleLabel}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mechanic Profile Card */}
      {currentMechanic && (
        <div className="bg-[#161922] border border-[#2E3547] rounded-xl p-5">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="text-5xl">{currentMechanic.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-white">{currentMechanic.name}</h2>
                {(() => {
                  const badge = getRoleBadge(currentMechanic.role);
                  return (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text} border ${badge.border}`}>
                      {badge.label}
                    </span>
                  );
                })()}
              </div>
              <p className="text-xs text-slate-400 mb-3 max-w-xl">{currentMechanic.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {currentMechanic.specialties.map(s => (
                  <span key={s} className="text-[10px] bg-[#1F2430] text-slate-300 px-2 py-0.5 rounded border border-[#2E3547]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 text-right">
              <span className="text-[11px] text-slate-500">ประสบการณ์</span>
              <span className="text-sm font-bold text-white">{currentMechanic.experience}</span>
              <span className="text-[11px] text-slate-500 mt-1">งานสูงสุด/วัน</span>
              <span className="text-sm font-bold text-white">{currentMechanic.maxJobsPerDay} งาน</span>
            </div>
          </div>

          {/* Mechanic Stats */}
          <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#2E3547]">
            <div className="text-center">
              <div className="text-lg font-bold text-white font-['Outfit']">{mechStats.totalJobs}</div>
              <div className="text-[10px] text-slate-400">งานทั้งหมด</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400 font-['Outfit']">{mechStats.inProgress}</div>
              <div className="text-[10px] text-slate-400">กำลังทำ</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-400 font-['Outfit']">{mechStats.completed}</div>
              <div className="text-[10px] text-slate-400">เสร็จแล้ว</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-amber-400 font-['Outfit']">{mechStats.pending}</div>
              <div className="text-[10px] text-slate-400">งานรอรับ</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-1 bg-[#161922] border border-[#2E3547] rounded-xl p-1.5 no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-[#1F2430]'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}

        <button
          onClick={() => setShowContactModal(true)}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition whitespace-nowrap"
        >
          <Phone className="w-3.5 h-3.5" />
          ติดต่อร้าน
        </button>
      </div>

      {/* ===== SCHEDULE TAB ===== */}
      {activeTab === 'schedule' && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            งานที่ได้รับมอบหมาย ({myBookings.length})
          </h3>

          {myBookings.length === 0 ? (
            <div className="bg-[#161922] border border-[#2E3547] rounded-xl p-8 text-center">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-white mb-1">ยังไม่มีงาน</h4>
              <p className="text-xs text-slate-400">ดูงานรอรับใน tab "งานรอรับ" เพื่อรับงาน</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myBookings.map(booking => (
                <div
                  key={booking.id}
                  className={`bg-[#161922] border rounded-xl overflow-hidden transition ${
                    booking.status === 'completed' ? 'border-emerald-500/30 opacity-60' : 'border-[#2E3547] hover:border-blue-500/30'
                  }`}
                >
                  <div
                    onClick={() => setExpandedBooking(expandedBooking === booking.id ? null : booking.id)}
                    className="flex items-center justify-between p-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-8 rounded-full ${
                        booking.status === 'completed' ? 'bg-emerald-500' :
                        booking.status === 'assigned' ? 'bg-blue-500 animate-pulse' : 'bg-amber-500'
                      }`} />
                      <div>
                        <span className="text-sm font-semibold text-white">{booking.serviceType}</span>
                        <div className="text-[11px] text-slate-400">
                          {booking.customerName} · {booking.date} · {booking.timeSlot}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        booking.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                        booking.status === 'assigned' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {booking.status === 'completed' ? '✅ เสร็จแล้ว' :
                         booking.status === 'assigned' ? '🔧 กำลังทำ' : '⏳ รอ'}
                      </span>
                      {expandedBooking === booking.id
                        ? <ChevronUp className="w-4 h-4 text-slate-400" />
                        : <ChevronDown className="w-4 h-4 text-slate-400" />
                      }
                    </div>
                  </div>

                  {expandedBooking === booking.id && (
                    <div className="border-t border-[#2E3547] p-4 space-y-3 bg-[#1F2430]/30">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2 text-slate-300">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{booking.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{booking.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Car className="w-3.5 h-3.5 text-slate-400" />
                          <span>{booking.carModel}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{booking.date} ({booking.timeSlot})</span>
                        </div>
                      </div>
                      {booking.note && (
                        <div className="text-[11px] text-slate-400 bg-[#0F1115] rounded-lg p-3">
                          💬 {booking.note}
                        </div>
                      )}
                      {booking.status !== 'completed' && (
                        <button
                          onClick={() => handleCompleteJob(booking.id)}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> เสร็จสิ้นงาน
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== AVAILABLE JOBS TAB ===== */}
      {activeTab === 'available' && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clipboard className="w-4 h-4 text-amber-400" />
            งานรอรับ ({pendingBookings.length})
          </h3>

          {pendingBookings.length === 0 ? (
            <div className="bg-[#161922] border border-[#2E3547] rounded-xl p-8 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-white mb-1">ไม่มีงานรอ</h4>
              <p className="text-xs text-slate-400">งานทั้งหมดได้รับการมอบหมายเรียบร้อยแล้ว</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingBookings.map(booking => {
                const serviceInfo = SERVICE_TYPES.find(s => s.name === booking.serviceType);
                const canHandle = canHandleService(serviceInfo?.id);

                return (
                  <div
                    key={booking.id}
                    className={`bg-[#161922] border rounded-xl p-4 transition ${
                      canHandle ? 'border-[#2E3547] hover:border-amber-500/30' : 'border-red-500/20 opacity-50'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{booking.serviceType}</span>
                          {!canHandle && (
                            <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                              ⚠️ เกินระดับความสามารถ
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 space-y-0.5">
                          <div>👤 {booking.customerName} · 📞 {booking.customerPhone}</div>
                          <div>🚗 {booking.carModel} · 📅 {booking.date} · ⏰ {booking.timeSlot}</div>
                          {booking.note && <div>💬 {booking.note}</div>}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAcceptJob(booking.id)}
                        disabled={!canHandle}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 flex-shrink-0 ${
                          canHandle
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                            : 'bg-[#1F2430] text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        รับงาน
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===== INSTALL CHECKLIST TAB ===== */}
      {activeTab === 'install' && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            เช็คลิสต์อะไหล่ที่ต้องติดตั้ง
          </h3>

          {purchaseChecklist.length === 0 ? (
            <div className="bg-[#161922] border border-[#2E3547] rounded-xl p-8 text-center">
              <CheckCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-xs text-slate-500">ยังไม่มีรายการติดตั้ง</p>
            </div>
          ) : (
            <div className="bg-[#161922] border border-[#2E3547] rounded-xl overflow-hidden">
              <div className="divide-y divide-[#2E3547]/50">
                {purchaseChecklist.map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#1F2430]/50 transition ${
                      item.checked ? 'opacity-50' : ''
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${
                      item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'
                    }`}>
                      {item.checked && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-medium block truncate ${item.checked ? 'line-through text-slate-500' : 'text-white'}`}>
                        {item.productName}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {item.brand} · {item.category} · ×{item.quantity}
                      </span>
                    </div>
                    <span className="text-[10px] text-red-400 font-bold font-['Outfit'] flex-shrink-0">
                      ฿{Number(item.price).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== MESSAGES TAB ===== */}
      {activeTab === 'messages' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              ข้อความถึงร้าน
            </h3>
            <button
              onClick={() => setShowContactModal(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition"
            >
              + ส่งข้อความใหม่
            </button>
          </div>

          {sentMessages.length === 0 ? (
            <div className="bg-[#161922] border border-[#2E3547] rounded-xl p-8 text-center">
              <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-xs text-slate-500">ยังไม่มีข้อความ — กดปุ่ม "ติดต่อร้าน" เพื่อส่งข้อความ</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sentMessages.map(msg => (
                <div key={msg.id} className="bg-[#161922] border border-[#2E3547] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-semibold text-blue-400">{msg.mechanic}</span>
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-200">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== CONTACT MODAL ===== */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-[#2E3547] rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-400" />
              ติดต่อร้าน Honda Tuning
            </h3>

            <div className="bg-[#1F2430] rounded-lg p-3 mb-4 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-red-500" /> 02-888-9999 / 089-777-6655
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> LINE: @hondatuning
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-blue-400" /> จันทร์ - เสาร์ 09:00 - 18:30
              </div>
            </div>

            <form onSubmit={handleSendMessage}>
              <div className="mb-1 text-[11px] text-slate-400">
                ส่งจาก: {currentMechanic?.avatar} {currentMechanic?.name}
              </div>
              <textarea
                value={contactMessage}
                onChange={e => setContactMessage(e.target.value)}
                placeholder="พิมพ์ข้อความถึงร้าน..."
                rows={3}
                className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none mb-3"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition">
                  ส่งข้อความ
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2.5 bg-[#1F2430] text-slate-300 rounded-lg text-sm hover:bg-[#2E3547] transition"
                >
                  ปิด
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MechanicDashboard;
