import React, { useState, useEffect } from 'react';
import {
  X, CheckCircle, AlertTriangle, ShieldCheck, Car, Gauge,
  Wrench, Check, FileText, Sparkles, Clock, AlertCircle
} from 'lucide-react';

export const CarIntakeModal = ({ booking, mechanic, isOpen, onClose, onSave }) => {
  if (!isOpen || !booking) return null;

  const isAlreadyInspected = Boolean(booking.intakeChecklist);

  const [form, setForm] = useState({
    // 1. Body & Cosmetic
    wheelsClean: true,
    scratchedWheels: [], // 'FL', 'FR', 'RL', 'RR'
    bodyLipClean: true,
    panelClean: true,

    // 2. Electrical & Cluster
    noWarningLights: true,
    mileage: '',
    fuelLevel: '1/2',

    // 3. Tuning Parts Fitment
    partModelMatch: true,
    hardwareComplete: true,
    clearanceChecked: true,

    // 4. Notes & Valuables
    looseItemsRemoved: true,
    notes: '',
  });

  // Load existing checklist if already inspected
  useEffect(() => {
    if (booking.intakeChecklist) {
      setForm(booking.intakeChecklist);
    } else {
      setForm({
        wheelsClean: true,
        scratchedWheels: [],
        bodyLipClean: true,
        panelClean: true,
        noWarningLights: true,
        mileage: '',
        fuelLevel: '1/2',
        partModelMatch: true,
        hardwareComplete: true,
        clearanceChecked: true,
        looseItemsRemoved: true,
        notes: '',
      });
    }
  }, [booking]);

  // Quick 1-click All Pass
  const handlePassAll = () => {
    setForm(prev => ({
      ...prev,
      wheelsClean: true,
      scratchedWheels: [],
      bodyLipClean: true,
      panelClean: true,
      noWarningLights: true,
      partModelMatch: true,
      hardwareComplete: true,
      clearanceChecked: true,
      looseItemsRemoved: true,
      mileage: prev.mileage || '42,500',
    }));
  };

  const toggleWheel = (wheelId) => {
    setForm(prev => {
      const exists = prev.scratchedWheels.includes(wheelId);
      const updated = exists
        ? prev.scratchedWheels.filter(w => w !== wheelId)
        : [...prev.scratchedWheels, wheelId];
      return {
        ...prev,
        scratchedWheels: updated,
        wheelsClean: updated.length === 0,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(booking.id, {
      ...form,
      inspectedBy: mechanic?.name || 'ช่างประจำอู่',
      inspectedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#161922] border border-[#2E3547] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#2E3547] flex items-center justify-between bg-gradient-to-r from-blue-950/40 to-[#161922]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              <ClipboardIcon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  ใบตรวจรับรถเข้าทำ (Car Intake Checklist)
                </h2>
                {isAlreadyInspected && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ตรวจแล้ว
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                บันทึกสภาพรถและตรวจเช็กอะไหล่แต่งก่อนลงมือทำ เพื่อความปลอดภัยและป้องกันข้อพิพาท
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-[#1F2430] rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Vehicle Quick Info Banner */}
        <div className="bg-[#0F1115] px-6 py-3 border-b border-[#2E3547] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px]">รุ่นรถยนต์:</span>
            <span className="text-white font-semibold flex items-center gap-1">
              <Car size={13} className="text-red-500" />
              {booking.carModel || 'Honda Civic'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">ประเภทงาน:</span>
            <span className="text-blue-400 font-semibold flex items-center gap-1">
              <Wrench size={13} />
              {booking.serviceType || 'ติดตั้งของแต่ง'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">ลูกค้า:</span>
            <span className="text-slate-200 font-medium">
              {booking.customerName || 'ลูกค้าทั่วไป'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">ช่างผู้รับผิดชอบ:</span>
            <span className="text-amber-400 font-medium">
              {mechanic?.name || 'ช่างประจำอู่'}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Action Button */}
          {!isAlreadyInspected && (
            <div className="flex justify-between items-center bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-xs text-blue-300">
                <Sparkles size={16} />
                <span>หากตรวจแล้วรถสภาพสมบูรณ์ ของแต่งครบ ไม่มีรอยเดิม:</span>
              </div>
              <button
                type="button"
                onClick={handlePassAll}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow"
              >
                <Check size={14} />
                ผ่านทั้งหมด (Pass All)
              </button>
            </div>
          )}

          {/* Section 1: Body & Wheels */}
          <div className="bg-[#1F2430]/60 border border-[#2E3547] rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldCheck size={15} className="text-red-500" />
              1. สภาพตัวถัง & ล้อแม็ก (Cosmetic Pre-Check)
            </h3>

            <div className="space-y-3 text-xs">
              {/* Wheels */}
              <div className="bg-[#0F1115] p-3 rounded-lg border border-[#2E3547]/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-200">
                    สภาพล้อแม็ก 4 วง:
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, wheelsClean: true, scratchedWheels: [] }))}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                        form.wheelsClean ? 'bg-emerald-600 text-white' : 'bg-[#161922] text-slate-400 hover:text-white'
                      }`}
                    >
                      ✓ ไม่มีรอย
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, wheelsClean: false }))}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                        !form.wheelsClean ? 'bg-amber-600 text-white' : 'bg-[#161922] text-slate-400 hover:text-white'
                      }`}
                    >
                      ⚠ มีรอยเบียดเดิม
                    </button>
                  </div>
                </div>

                {!form.wheelsClean && (
                  <div className="pt-2 border-t border-[#2E3547] flex items-center gap-2">
                    <span className="text-[11px] text-amber-400">ระบุล้อที่มีรอย:</span>
                    {[
                      { id: 'FL', label: 'หน้าซ้าย' },
                      { id: 'FR', label: 'หน้าขวา' },
                      { id: 'RL', label: 'หลังซ้าย' },
                      { id: 'RR', label: 'หลังขวา' },
                    ].map(w => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => toggleWheel(w.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                          form.scratchedWheels.includes(w.id)
                            ? 'bg-red-500/20 border-red-500 text-red-300'
                            : 'bg-[#161922] border-[#2E3547] text-slate-400'
                        }`}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Front Lip / Skirt */}
              <div className="flex items-center justify-between bg-[#0F1115] p-3 rounded-lg border border-[#2E3547]/80">
                <span className="font-semibold text-slate-200">
                  สเกิร์ต & ลิ้นหน้า (รอยครูดใต้ท้อง/รอยแตกเดิม):
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.bodyLipClean}
                    onChange={e => setForm(p => ({ ...p, bodyLipClean: e.target.checked }))}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-[#161922] border-slate-600"
                  />
                  <span className={form.bodyLipClean ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                    {form.bodyLipClean ? 'ปกติ ไม่มีรอยแตก' : '⚠ มีรอยครูดเดิม'}
                  </span>
                </label>
              </div>

              {/* Body Panels */}
              <div className="flex items-center justify-between bg-[#0F1115] p-3 rounded-lg border border-[#2E3547]/80">
                <span className="font-semibold text-slate-200">
                  สีตัวถังรอบจุดที่จะรื้อทำ (ซุ้มล้อ/กันชน):
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.panelClean}
                    onChange={e => setForm(p => ({ ...p, panelClean: e.target.checked }))}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-[#161922] border-slate-600"
                  />
                  <span className={form.panelClean ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                    {form.panelClean ? 'ปกติ เรียบร้อยดี' : '⚠ มีรอยขีดข่วนเดิม'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Electrical & Cluster */}
          <div className="bg-[#1F2430]/60 border border-[#2E3547] rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Gauge size={15} className="text-blue-400" />
              2. หน้าปัดเรือนไมล์ & ระบบไฟฟ้า (Cluster & Mileage)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#0F1115] p-3 rounded-lg border border-[#2E3547]">
                <label className="block text-slate-400 mb-1 text-[11px]">ไฟเตือนหน้าปัด:</label>
                <label className="flex items-center gap-2 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={form.noWarningLights}
                    onChange={e => setForm(p => ({ ...p, noWarningLights: e.target.checked }))}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-[#161922] border-slate-600"
                  />
                  <span className={form.noWarningLights ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                    {form.noWarningLights ? '✓ ไม่มีไฟเตือนโชว์' : '⚠ มีไฟเตือนค้าง'}
                  </span>
                </label>
              </div>

              <div className="bg-[#0F1115] p-3 rounded-lg border border-[#2E3547]">
                <label className="block text-slate-400 mb-1 text-[11px]">เลขไมล์ปัจจุบัน (กม.):</label>
                <input
                  type="text"
                  placeholder="เช่น 45,200"
                  value={form.mileage}
                  onChange={e => setForm(p => ({ ...p, mileage: e.target.value }))}
                  className="w-full bg-[#161922] border border-[#2E3547] rounded px-2.5 py-1 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="bg-[#0F1115] p-3 rounded-lg border border-[#2E3547]">
                <label className="block text-slate-400 mb-1 text-[11px]">ระดับน้ำมันในถัง:</label>
                <select
                  value={form.fuelLevel}
                  onChange={e => setForm(p => ({ ...p, fuelLevel: e.target.value }))}
                  className="w-full bg-[#161922] border border-[#2E3547] rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="1/4">1/4 ถัง</option>
                  <option value="1/2">1/2 ถัง</option>
                  <option value="3/4">3/4 ถัง</option>
                  <option value="เต็มถัง">เต็มถัง</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Tuning Parts Verification */}
          <div className="bg-[#1F2430]/60 border border-[#2E3547] rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Wrench size={15} className="text-emerald-400" />
              3. ตรวจเช็กอะไหล่แต่งก่อนลงมือรื้อ (Part & Fitment Verification)
            </h3>

            <div className="space-y-2.5 text-xs">
              <label className="flex items-center justify-between bg-[#0F1115] p-3 rounded-lg border border-[#2E3547] cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-200 block">อะไหล่แต่งตรงรุ่น 100%</span>
                  <span className="text-[10px] text-slate-500">เช็กโค้ดบนกล่องตรงกับรหัสตัวถัง/เครื่องยนต์ ไม่ผิดรุ่น</span>
                </div>
                <input
                  type="checkbox"
                  checked={form.partModelMatch}
                  onChange={e => setForm(p => ({ ...p, partModelMatch: e.target.checked }))}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-[#161922] border-slate-600"
                />
              </label>

              <label className="flex items-center justify-between bg-[#0F1115] p-3 rounded-lg border border-[#2E3547] cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-200 block">อุปกรณ์และน็อตประกอบครบชุด</span>
                  <span className="text-[10px] text-slate-500">ปะเก็น, ขายึด, บูชยาง, น็อตยึด อยู่ในกล่องครบ</span>
                </div>
                <input
                  type="checkbox"
                  checked={form.hardwareComplete}
                  onChange={e => setForm(p => ({ ...p, hardwareComplete: e.target.checked }))}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-[#161922] border-slate-600"
                />
              </label>

              <label className="flex items-center justify-between bg-[#0F1115] p-3 rounded-lg border border-[#2E3547] cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-200 block">ระยะเคลียร์แรนซ์ (Clearance Check)</span>
                  <span className="text-[10px] text-slate-500">เช็กเบื้องต้น: ไม่ติดก้านแม็ก, ไม่ติดซุ้ม, ไม่ติดกันชน</span>
                </div>
                <input
                  type="checkbox"
                  checked={form.clearanceChecked}
                  onChange={e => setForm(p => ({ ...p, clearanceChecked: e.target.checked }))}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-[#161922] border-slate-600"
                />
              </label>
            </div>
          </div>

          {/* Section 4: Notes */}
          <div className="bg-[#1F2430]/60 border border-[#2E3547] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FileText size={15} className="text-amber-400" />
                4. หมายเหตุและข้อสังเกตจากช่าง
              </h3>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.looseItemsRemoved}
                  onChange={e => setForm(p => ({ ...p, looseItemsRemoved: e.target.checked }))}
                  className="w-3.5 h-3.5 rounded text-blue-600 bg-[#161922] border-slate-600"
                />
                <span className="text-[11px]">นำของมีค่าออกจากรถแล้ว</span>
              </label>
            </div>

            <textarea
              rows={2}
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="ระบุข้อสังเกต เช่น: 'พบยางหุ้มเพลาขาด แจ้งลูกค้าแล้ว', 'ผ้าเบรกเดิมใกล้หมด แนะนำให้เปลี่ยนรอบหน้า'"
              className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2E3547]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
            >
              <CheckCircle size={16} />
              {isAlreadyInspected ? 'บันทึกการแก้ไข' : 'ยืนยันการรับรถ ➔ เริ่มลงมือทำงาน'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ClipboardIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

