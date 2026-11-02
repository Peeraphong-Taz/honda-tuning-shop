import React, { useEffect, useState } from 'react';
import productsService from '../../services/productsService';
import { Plus, Trash2, Edit, Package, Check, X } from 'lucide-react';

export const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'Exhaust',
    carCompatible: 'Honda Civic FE, Universal Honda',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80'
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productsService.getProducts();
      if (res.data) setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('คุณแน่ใจว่าต้องการลบสินค้านี้?')) return;
    try {
      await productsService.deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการลบสินค้า');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await productsService.createProduct(formData);
      setShowAddModal(false);
      setFormData({
        name: '',
        price: '',
        stock: '',
        category: 'Exhaust',
        carCompatible: 'Honda Civic FE, Universal Honda',
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80'
      });
      fetchProducts();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการเพิ่มสินค้า');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#161922] border border-[#2E3547] p-5 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2 font-['Outfit']">
            <Package className="w-5 h-5 text-red-500" />
            จัดการรายการสินค้า & สต็อก (Product Inventory)
          </h1>
          <p className="text-xs text-slate-400">เพิ่ม ลบ แก้ไข ข้อมูลอะไหล่แต่งในระบบ</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-red-600/30 transition"
        >
          <Plus className="w-4 h-4" /> เพิ่มสินค้าใหม่
        </button>
      </div>

      {/* Modal Add Product */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-[#2E3547] rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#2E3547] pb-3">
              <h3 className="font-bold text-white text-base">เพิ่มอะไหล่แต่งรายการใหม่</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">ชื่อสินค้า *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0F1115] border border-[#2E3547] rounded px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">ราคา (บาท) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#0F1115] border border-[#2E3547] rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">จำนวนสต็อก *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-[#0F1115] border border-[#2E3547] rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">หมวดหมู่</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#0F1115] border border-[#2E3547] rounded px-3 py-2 text-white"
                >
                  <option value="Exhaust">Exhaust</option>
                  <option value="Engine & Turbo">Engine & Turbo</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Brake Kit">Brake Kit</option>
                  <option value="Aero & Exterior">Aero & Exterior</option>
                  <option value="ECU & Tuning">ECU & Tuning</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">รุ่นรถยนต์ที่รองรับ (คั่นด้วยจุลภาค)</label>
                <input
                  type="text"
                  value={formData.carCompatible}
                  onChange={(e) => setFormData({ ...formData, carCompatible: e.target.value })}
                  className="w-full bg-[#0F1115] border border-[#2E3547] rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">รูปภาพ URL</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-[#0F1115] border border-[#2E3547] rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">คำอธิบาย</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#0F1115] border border-[#2E3547] rounded px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#1F2430] text-slate-300 rounded"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded"
                >
                  บันทึกสินค้า
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#161922] border border-[#2E3547] rounded-xl overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#1F2430] text-slate-400 uppercase font-semibold border-b border-[#2E3547]">
            <tr>
              <th className="p-4">สินค้า</th>
              <th className="p-4">หมวดหมู่</th>
              <th className="p-4">ราคา</th>
              <th className="p-4">คงเหลือ (สต็อก)</th>
              <th className="p-4 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2E3547]">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">กำลังโหลดรายการสินค้า...</td>
              </tr>
            ) : products.map((item) => (
              <tr key={item._id} className="hover:bg-[#1F2430]/40 transition">
                <td className="p-4 flex items-center gap-3">
                  <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded bg-[#0F1115]" />
                  <div>
                    <span className="font-semibold text-white block">{item.name}</span>
                    <span className="text-[10px] text-slate-400">{item.carCompatible?.join(', ')}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-[#1F2430] text-red-400 text-[11px] font-medium border border-[#2E3547]">
                    {item.category}
                  </span>
                </td>
                <td className="p-4 font-bold text-white font-['Outfit']">
                  ฿{Number(item.price).toLocaleString()}
                </td>
                <td className="p-4 font-mono">
                  {item.stock} ชิ้น
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                    title="ลบสินค้า"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;
