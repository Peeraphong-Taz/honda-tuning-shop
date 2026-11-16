import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { isSupabaseConfigured, uploadPaymentSlip } from '../lib/supabase';
import ProductImage from '../components/ProductImage';
import { Trash2, ShoppingBag, CreditCard, UploadCloud, CheckCircle2, ArrowRight } from 'lucide-react';

export const Checkout = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalAmount } = useCart();
  const { user } = useAuth();
  const { createOrder } = useDatabase();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    province: 'กรุงเทพมหานคร',
    postalCode: ''
  });

  const [slipFile, setSlipFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSlipFile(e.target.files[0]);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      // 1. Upload payment slip (Supabase Storage) — demo mode keeps a local preview URL
      let slipUrl = null;
      if (slipFile) {
        slipUrl = isSupabaseConfigured
          ? await uploadPaymentSlip(slipFile)
          : URL.createObjectURL(slipFile);
      }

      // 2. Create order (ราคาและยอดรวมถูกคำนวณใหม่ฝั่ง Supabase อีกครั้ง)
      const orderPayload = {
        customerName: address.fullName,
        customerPhone: address.phone,
        items: cart.map(item => ({
          productId: item.id || item._id,
          name: item.name,
          category: item.category,
          brand: item.brand,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        })),
        totalAmount: totalAmount,
        shippingAddress: address,
        slipUrl,
      };
      if (!isSupabaseConfigured) orderPayload.userId = user?.id || 'guest';

      const { data, error } = await createOrder(orderPayload);
      if (error) throw new Error(error);

      clearCart();
      setOrderComplete(data);
    } catch (err) {
      console.error('Failed to place order:', err);
      alert(err.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-xl mx-auto bg-[#121212] border border-[#2A2A2A] rounded-lg p-8 text-center space-y-6">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">สั่งซื้อสินค้าสำเร็จ!</h2>
          <p className="text-xs text-slate-400">
            หมายเลขคำสั่งซื้อ: <span className="font-mono text-red-400 font-semibold">{orderComplete._id || orderComplete.id}</span>
          </p>
          <p className="text-sm text-slate-300">
            ยอดรวมทั้งสิ้น <span className="font-bold text-red-500 font-display">฿{Number(orderComplete.total || orderComplete.totalAmount || 0).toLocaleString()}</span>
          </p>
        </div>

        <p className="text-xs text-slate-400 bg-[#1A1A1A] p-4 rounded-md leading-relaxed">
          เจ้าหน้าที่จะตรวจสอบหลักฐานการชำระเงิน และจัดส่งสินค้าให้ท่านอย่างรวดเร็ว สามารถตรวจสอบสถานะได้ที่หน้าโปรไฟล์ของคุณ
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            to="/profile"
            className="btn-cut px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-display font-bold transition"
          >
            ดูคำสั่งซื้อของฉัน
          </Link>
          <Link
            to="/shop"
            className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white text-sm rounded-md transition"
          >
            เลือกซื้อสินค้าต่อ
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-[#121212] border border-[#2A2A2A] rounded-lg p-16 text-center space-y-4 max-w-lg mx-auto">
        <ShoppingBag className="w-16 h-16 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">ยังไม่มีสินค้าในตะกร้า</h2>
        <p className="text-xs text-slate-400">เลือกชมอะไหล่แต่งและอุปกรณ์เสริมสำหรับฮอนด้าของคุณได้เลย</p>
        <Link
          to="/shop"
          className="btn-cut inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-display font-bold transition"
        >
          ไปที่หน้าร้านค้า <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-display italic">
        <span className="slash" />ชำระเงิน
      </h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cart items & Shipping address */}
        <div className="lg:col-span-7 space-y-6">
          {/* Cart items */}
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-md p-5 space-y-4">
            <h3 className="font-bold text-white text-base border-b border-[#2A2A2A] pb-3 flex items-center justify-between">
              <span>รายการสินค้า ({cart.length})</span>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-red-400"
              >
                ล้างตะกร้า
              </button>
            </h3>

            <div className="divide-y divide-[#2A2A2A]">
              {cart.map((item) => (
                <div key={item._id} className="py-3 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md bg-[#1A1A1A] shrink-0 overflow-hidden">
                    <ProductImage product={item} width={160} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                    <span className="text-xs text-red-400 font-display font-semibold">
                      ฿{Number(item.price).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center border border-[#2A2A2A] rounded bg-[#0A0A0A] text-xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-2 py-1 text-slate-300"
                      >
                        -
                      </button>
                      <span className="px-2 py-1 font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-2 py-1 text-slate-300"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      className="p-1.5 text-slate-400 hover:text-red-400"
                      title="ลบ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-md p-5 space-y-4">
            <h3 className="font-bold text-white text-base border-b border-[#2A2A2A] pb-3">
              ที่อยู่จัดส่งสินค้า
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 block">ชื่อ-นามสกุล ผู้รับ *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={address.fullName}
                  onChange={handleAddressChange}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 block">เบอร์โทรศัพท์ติดต่อ *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={address.phone}
                  onChange={handleAddressChange}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-slate-300 mb-1 block">ที่อยู่จัดส่ง (บ้านเลขที่, ถนน, แขวง/ตำบล) *</label>
                <textarea
                  name="address"
                  rows={2}
                  required
                  value={address.address}
                  onChange={handleAddressChange}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 block">จังหวัด *</label>
                <input
                  type="text"
                  name="province"
                  required
                  value={address.province}
                  onChange={handleAddressChange}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 block">รหัสไปรษณีย์ *</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={address.postalCode}
                  onChange={handleAddressChange}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Payment details & Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-md p-5 space-y-5">
            <h3 className="font-bold text-white text-base border-b border-[#2A2A2A] pb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-red-500" />
              วิธีชำระเงิน: โอนผ่านธนาคาร / พร้อมเพย์
            </h3>

            {/* Bank details card */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-md p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>ธนาคารกสิกรไทย (KBANK)</span>
                <span className="font-mono font-bold text-white">098-7-65432-1</span>
              </div>
              <div className="text-slate-400">
                ชื่อบัญชี: บจก. ฮอนด้า จูนนิ่ง มอเตอร์สปอร์ต
              </div>
              <div className="text-slate-400">
                พร้อมเพย์ (PromptPay): 089-777-6655
              </div>
            </div>

            {/* Slip Upload */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-red-400" />
                แนบสลิปหลักฐานการโอนเงิน (Optional / สามารถแนบทีหลังได้)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
              />
              {slipFile && (
                <span className="text-xs text-emerald-400 block">
                  เลือกไฟล์แล้ว: {slipFile.name}
                </span>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-2 pt-4 border-t border-[#2A2A2A] text-sm">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>ยอดรวมสินค้า</span>
                <span>฿{Number(totalAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-xs">
                <span>ค่าจัดส่งด่วน</span>
                <span className="text-emerald-400">ฟรี (โปรโมชั่น)</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-[#2A2A2A]">
                <span>ยอดชำระสุทธิ</span>
                <span className="text-red-500 font-display">฿{Number(totalAmount).toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-cut w-full py-3 bg-red-600 hover:bg-red-700 text-white font-display font-bold transition disabled:opacity-50"
            >
              {loading ? 'กำลังประมวลผลคำสั่งซื้อ...' : 'ยืนยันและสั่งซื้อสินค้า'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
