import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { uploadProductImage } from '../../lib/supabase';
import ProductImage from '../../components/ProductImage';
import { Plus, Trash2, Package, X } from 'lucide-react';

const EMPTY_FORM = {
  name: '',
  brand: '',
  price: '',
  stock: '',
  category: 'exhaust',
  compatibleModels: 'Civic FE, Civic FC',
  description: '',
  imageUrl: '',
};

const inputClass = 'w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded px-3 py-2 text-white focus:border-red-500 focus:outline-none';

export const ManageProducts = () => {
  const { products, addProduct, deleteProduct, loading, isSupabase, PRODUCT_CATEGORIES } = useDatabase();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const categoryName = (id) => PRODUCT_CATEGORIES.find(c => c.id === id)?.name || id;

  const handleDelete = async (id) => {
    if (!window.confirm('คุณแน่ใจว่าต้องการลบสินค้านี้?')) return;
    const { error } = await deleteProduct(id);
    if (error) alert(`ลบสินค้าไม่สำเร็จ: ${error}`);
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    } catch (err) {
      alert(`อัปโหลดรูปไม่สำเร็จ: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await addProduct({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      compatibleGens: ['gen8', 'gen9', 'gen10', 'gen11'],
      compatibleModels: formData.compatibleModels.split(',').map(s => s.trim()).filter(Boolean),
    });
    setSaving(false);
    if (error) {
      alert(`เกิดข้อผิดพลาดในการเพิ่มสินค้า: ${error}`);
      return;
    }
    setShowAddModal(false);
    setFormData(EMPTY_FORM);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#121212] border border-[#2A2A2A] p-5 rounded-md">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2 font-display">
            <Package className="w-5 h-5 text-red-500" />
            จัดการรายการสินค้า & สต็อก (Product Inventory)
          </h1>
          <p className="text-xs text-slate-400">เพิ่ม ลบ แก้ไข ข้อมูลอะไหล่แต่งในระบบ</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" /> เพิ่มสินค้าใหม่
        </button>
      </div>

      {/* Modal Add Product */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-lg p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
              <h3 className="font-bold text-white text-base">เพิ่มอะไหล่แต่งรายการใหม่</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-slate-300 font-medium block mb-1">ชื่อสินค้า *</label>
                  <input type="text" required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">แบรนด์</label>
                  <input type="text" value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">หมวดหมู่</label>
                  <select value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={inputClass}>
                    {PRODUCT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">ราคา (บาท) *</label>
                  <input type="number" required min="0" value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">จำนวนสต็อก *</label>
                  <input type="number" required min="0" value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">รุ่นรถยนต์ที่รองรับ (คั่นด้วยจุลภาค)</label>
                <input type="text" value={formData.compatibleModels}
                  onChange={(e) => setFormData({ ...formData, compatibleModels: e.target.value })} className={inputClass} />
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-20 h-20 rounded bg-[#1A1A1A] overflow-hidden shrink-0 border border-[#2A2A2A]">
                  <ProductImage product={formData} width={200} />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-slate-300 font-medium block">รูปสินค้า (เว้นว่าง = ใช้รูปประจำหมวด)</label>
                  {isSupabase && (
                    <label className="inline-flex px-3 py-1.5 rounded bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-slate-200 font-semibold cursor-pointer">
                      {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูป'}
                      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageFile} disabled={uploading} />
                    </label>
                  )}
                  <input type="url" value={formData.imageUrl} placeholder="หรือวางลิงก์รูป https://..."
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">คำอธิบาย</label>
                <textarea rows={2} value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputClass} />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-[#1A1A1A] text-slate-300 rounded">
                  ยกเลิก
                </button>
                <button type="submit" disabled={saving || uploading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded disabled:opacity-50">
                  {saving ? 'กำลังบันทึก...' : 'บันทึกสินค้า'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#121212] border border-[#2A2A2A] rounded-md overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#1A1A1A] text-slate-400 uppercase font-semibold border-b border-[#2A2A2A]">
            <tr>
              <th className="p-4">สินค้า</th>
              <th className="p-4">หมวดหมู่</th>
              <th className="p-4">ราคา</th>
              <th className="p-4">คงเหลือ (สต็อก)</th>
              <th className="p-4 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">กำลังโหลดรายการสินค้า...</td>
              </tr>
            ) : products.map((item) => (
              <tr key={item.id} className="hover:bg-[#1A1A1A]/40 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#0A0A0A] overflow-hidden shrink-0">
                      <ProductImage product={item} width={120} />
                    </div>
                    <div>
                      <span className="font-semibold text-white block">{item.name}</span>
                      <span className="text-[10px] text-slate-400">{item.compatibleModels?.join(', ')}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-[#1A1A1A] text-slate-300 text-[11px] font-medium border border-[#2A2A2A]">
                    {categoryName(item.category)}
                  </span>
                </td>
                <td className="p-4 font-bold text-white font-display">
                  ฿{Number(item.price).toLocaleString()}
                </td>
                <td className="p-4 font-mono">
                  {item.stock} ชิ้น
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(item.id)}
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
