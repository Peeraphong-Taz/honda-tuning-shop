import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import orderService from '../services/orderService';
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
      // 1. Create order in DatabaseContext
      const orderPayload = {
        userId: user?.id || 'guest',
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
        total: totalAmount,
        totalAmount: totalAmount,
        shippingAddress: address,
        slipUrl: slipFile ? URL.createObjectURL(slipFile) : null,
      };

      const localResult = createOrder(orderPayload);
      let createdOrder = localResult.data || { ...orderPayload, id: 'ord-' + Date.now() };

      // 2. Fallback / Sync to backend API if available
      try {
        const res = await orderService.createOrder({
          items: orderPayload.items.map(i => ({ ...i, productId: i.productId })),
          total: totalAmount,
          shippingAddress: address
        });
        if (res.data) {
          createdOrder = { ...createdOrder, ...res.data };
          if (slipFile && res.data._id) {
            const formData = new FormData();
            formData.append('slip', slipFile);
            await orderService.uploadSlip(res.data._id, formData).catch(() => {});
          }
        }
      } catch (backendErr) {
        console.log('Order saved to local database (backend offline)');
      }

      clearCart();
      setOrderComplete(createdOrder);
    } catch (err) {
      console.error('Failed to place order:', err);
      alert(err.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-xl mx-auto bg-[#161922] border border-[#2E3547] rounded-2xl p-8 text-center space-y-6 shadow-2xl">
        <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto animate-bounce" />
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">สั่งซื้อสินค้าสำเร็จ!</h2>
          <p className="text-xs text-slate-400">
            หมายเลขคำสั่งซื้อ: <span className="font-mono text-red-400 font-semibold">{orderComplete._id || orderComplete.id}</span>
          </p>
          <p className="text-sm text-slate-300">
            ยอดรวมทั้งสิ้น <span className="font-bold text-red-500 font-['Outfit']">฿{Number(orderComplete.total || orderComplete.totalAmount || 0).toLocaleString()}</span>
          </p>
        </div>

        <p className="text-xs text-slate-400 bg-[#1F2430] p-4 rounded-xl leading-relaxed">
          เจ้าหน้าที่จะตรวจสอบหลักฐานการชำระเงิน และจัดส่งสินค้าให้ท่านอย่างรวดเร็ว สามารถตรวจสอบสถานะได้ที่หน้าโปรไฟล์ของคุณ
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            to="/profile"
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-md transition"
          >
            ดูคำสั่งซื้อของฉัน
          </Link>
          <Link
            to="/shop"
            className="px-6 py-2.5 bg-[#1F2430] hover:bg-[#2E3547] text-white text-sm rounded-lg transition"
          >
            เลือกซื้อสินค้าต่อ
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-[#161922] border border-[#2E3547] rounded-2xl p-16 text-center space-y-4 max-w-lg mx-auto">
        <ShoppingBag className="w-16 h-16 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">ยังไม่มีสินค้าในตะกร้า</h2>
        <p className="text-xs text-slate-400">เลือกชมอะไหล่แต่งและอุปกรณ์เสริมสำหรับฮอนด้าของคุณได้เลย</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-red-600/30 transition"
        >
          ไปที่หน้าร้านค้า <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-white font-['Outfit']">
        ตรวจสอบรายการและชำระเงิน (Checkout)
      </h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cart items & Shipping address */}
        <div className="lg:col-span-7 space-y-6">
          {/* Cart items */}
          <div className="bg-[#161922] border border-[#2E3547] rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-white text-base border-b border-[#2E3547] pb-3 flex items-center justify-between">
              <span>รายการสินค้า ({cart.length})</span>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-red-400"
              >
                ล้างตะกร้า
              </button>
            </h3>

            <div className="divide-y divide-[#2E3547]">
              {cart.map((item) => (
                <div key={item._id} className="py-3 flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-[#1F2430] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                    <span className="text-xs text-red-400 font-['Outfit'] font-semibold">
                      ฿{Number(item.price).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center border border-[#2E3547] rounded bg-[#0F1115] text-xs">
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
          <div className="bg-[#161922] border border-[#2E3547] rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-white text-base border-b border-[#2E3547] pb-3">
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
                  className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
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
                  className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
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
                  className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
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
                  className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
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
                  className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Payment details & Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#161922] border border-[#2E3547] rounded-xl p-5 space-y-5">
            <h3 className="font-bold text-white text-base border-b border-[#2E3547] pb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-red-500" />
              วิธีชำระเงิน: โอนผ่านธนาคาร / พร้อมเพย์
            </h3>

            {/* Bank details card */}
            <div className="bg-[#1F2430] border border-[#2E3547] rounded-xl p-4 space-y-2 text-xs">
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
                className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
              />
              {slipFile && (
                <span className="text-[11px] text-emerald-400 block">
                  เลือกไฟล์แล้ว: {slipFile.name}
                </span>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-2 pt-4 border-t border-[#2E3547] text-sm">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>ยอดรวมสินค้า</span>
                <span>฿{Number(totalAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-xs">
                <span>ค่าจัดส่งด่วน</span>
                <span className="text-emerald-400">ฟรี (โปรโมชั่น)</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-[#2E3547]">
                <span>ยอดชำระสุทธิ</span>
                <span className="text-red-500 font-['Outfit']">฿{Number(totalAmount).toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg shadow-red-600/30 transition disabled:opacity-50"
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
