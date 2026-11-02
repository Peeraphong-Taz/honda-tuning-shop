import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDatabase } from '../../context/DatabaseContext';
import {
  ShieldCheck, Package, Calendar, DollarSign, Plus, Trash2, Edit3,
  Search, Terminal, CheckCircle, XCircle, Clock, Send, ChevronDown,
  ChevronUp, Database, RefreshCw, Eye, Filter
} from 'lucide-react';

export const AdminDashboard = () => {
  const {
    products, orders, bookings, purchaseChecklist, mechanics,
    addProduct, updateProduct, deleteProduct, updateOrderStatus,
    updateBookingStatus, assignMechanic, executeDbCommand,
    PRODUCT_CATEGORIES, CIVIC_GENERATIONS, refreshAll,
  } = useDatabase();

  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [dbCommand, setDbCommand] = useState('');
  const [dbResults, setDbResults] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '', brand: '', category: 'bumper', price: '',
    description: '', stock: '', compatibleGens: [],
    compatibleModels: '', imageUrl: '',
  });

  // Stats
  const stats = useMemo(() => ({
    totalProducts: products.length,
    totalOrders: orders.length,
    totalBookings: bookings.length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    activeProducts: products.filter(p => p.status === 'active').length,
    lowStock: products.filter(p => p.stock <= 3 && p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    checklistPending: purchaseChecklist.filter(c => !c.checked).length,
  }), [products, orders, bookings, purchaseChecklist]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    let data = [...products];
    if (filterCategory !== 'all') {
      data = data.filter(p => p.category === filterCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
      );
    }
    return data;
  }, [products, filterCategory, searchQuery]);

  // Handle add product
  const handleAddProduct = (e) => {
    e.preventDefault();
    const result = addProduct({
      ...newProduct,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      compatibleModels: newProduct.compatibleModels.split(',').map(s => s.trim()).filter(Boolean),
    });
    if (!result.error) {
      setShowAddProduct(false);
      setNewProduct({
        name: '', brand: '', category: 'bumper', price: '',
        description: '', stock: '', compatibleGens: [],
        compatibleModels: '', imageUrl: '',
      });
    }
  };

  // Handle edit product
  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...editingProduct,
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock),
        compatibleModels: typeof editingProduct.compatibleModels === 'string'
          ? editingProduct.compatibleModels.split(',').map(s => s.trim()).filter(Boolean)
          : editingProduct.compatibleModels,
      });
      setEditingProduct(null);
    }
  };

  // Handle DB command
  const handleDbCommand = (e) => {
    e.preventDefault();
    if (!dbCommand.trim()) return;
    const result = executeDbCommand(dbCommand);
    setDbResults(prev => [
      { command: dbCommand, ...result, timestamp: new Date().toLocaleTimeString('th-TH') },
      ...prev.slice(0, 19),
    ]);
    setDbCommand('');
  };

  // Toggle gen compatibility
  const toggleGen = (genId, target = 'new') => {
    if (target === 'new') {
      setNewProduct(prev => ({
        ...prev,
        compatibleGens: prev.compatibleGens.includes(genId)
          ? prev.compatibleGens.filter(g => g !== genId)
          : [...prev.compatibleGens, genId],
      }));
    } else if (editingProduct) {
      setEditingProduct(prev => ({
        ...prev,
        compatibleGens: prev.compatibleGens?.includes(genId)
          ? prev.compatibleGens.filter(g => g !== genId)
          : [...(prev.compatibleGens || []), genId],
      }));
    }
  };

  const tabs = [
    { id: 'overview', label: 'ภาพรวม', icon: Eye },
    { id: 'products', label: 'จัดการสินค้า', icon: Package },
    { id: 'bookings', label: 'ตารางนัดช่าง', icon: Calendar },
    { id: 'orders', label: 'คำสั่งซื้อ', icon: DollarSign },
    { id: 'checklist', label: 'เช็คลิสต์ติดตั้ง', icon: CheckCircle },
    { id: 'database', label: 'คำสั่ง Database', icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#161922] to-[#1a1525] border border-amber-500/20 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <h1 className="text-2xl font-black text-white font-['Outfit']">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              จัดการสินค้า คิวจอง ช่าง และ Database ของร้าน Honda Tuning
            </p>
          </div>
          <button
            onClick={refreshAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-medium hover:bg-amber-500/20 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> รีเฟรช
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-1 bg-[#161922] border border-[#2E3547] rounded-xl p-1.5 no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-[#1F2430]'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== OVERVIEW TAB ===== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#161922] border border-[#2E3547] p-5 rounded-xl space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-medium">ยอดขายรวม</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white font-['Outfit']">
                ฿{stats.totalRevenue.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400">{stats.totalOrders} คำสั่งซื้อ</div>
            </div>

            <div className="bg-[#161922] border border-[#2E3547] p-5 rounded-xl space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-medium">สินค้าในระบบ</span>
                <Package className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl font-bold text-white font-['Outfit']">
                {stats.activeProducts}
              </div>
              <div className="text-[10px] text-purple-400">{stats.lowStock} ใกล้หมด · {stats.outOfStock} หมดสต็อก</div>
            </div>

            <div className="bg-[#161922] border border-[#2E3547] p-5 rounded-xl space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-medium">คิวนัดช่าง</span>
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-xl font-bold text-white font-['Outfit']">
                {stats.totalBookings}
              </div>
              <div className="text-[10px] text-blue-400">{stats.pendingBookings} รอยืนยัน</div>
            </div>

            <div className="bg-[#161922] border border-[#2E3547] p-5 rounded-xl space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-medium">เช็คลิสต์รอติดตั้ง</span>
                <CheckCircle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-white font-['Outfit']">
                {stats.checklistPending}
              </div>
              <div className="text-[10px] text-amber-400">รายการรอดำเนินการ</div>
            </div>
          </div>

          {/* Mechanics Overview */}
          <div className="bg-[#161922] border border-[#2E3547] rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm border-b border-[#2E3547] pb-3">
              🔧 ทีมช่าง (Mechanics)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mechanics.map(mech => (
                <div key={mech.id} className="bg-[#1F2430] rounded-xl p-4 border border-[#2E3547] hover:border-red-500/30 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">{mech.avatar}</div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{mech.name}</h4>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${mech.color}20`, color: mech.color, border: `1px solid ${mech.color}40` }}
                      >
                        {mech.roleLabel}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-2">{mech.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {mech.specialties.map(s => (
                      <span key={s} className="text-[9px] bg-[#0F1115] text-slate-300 px-1.5 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2">ประสบการณ์: {mech.experience}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => { setActiveTab('products'); setShowAddProduct(true); }}
              className="bg-[#161922] border border-red-500/30 rounded-xl p-5 text-left hover:border-red-500 transition group"
            >
              <div className="flex items-center gap-2 text-red-400 mb-1">
                <Plus className="w-5 h-5" />
                <span className="font-bold text-sm">เพิ่มสินค้าใหม่</span>
              </div>
              <p className="text-[11px] text-slate-400">เพิ่มอะไหล่แต่ง Civic Gen 8-11 เข้าระบบ</p>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className="bg-[#161922] border border-emerald-500/30 rounded-xl p-5 text-left hover:border-emerald-500 transition group"
            >
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Terminal className="w-5 h-5" />
                <span className="font-bold text-sm">คำสั่ง Database</span>
              </div>
              <p className="text-[11px] text-slate-400">ใช้คำสั่ง INSERT, SELECT, DELETE เพิ่ม/จัดการสินค้า</p>
            </button>
          </div>
        </div>
      )}

      {/* ===== PRODUCTS TAB ===== */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between bg-[#161922] border border-[#2E3547] rounded-xl p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาสินค้า..."
                  className="bg-[#0F1115] border border-[#2E3547] rounded-lg pl-8 pr-3 py-2 text-xs text-slate-100 w-52 focus:border-red-500 focus:outline-none"
                />
              </div>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-red-500 focus:outline-none"
              >
                <option value="all">หมวดหมู่ทั้งหมด</option>
                {PRODUCT_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowAddProduct(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md transition"
            >
              <Plus className="w-3.5 h-3.5" /> เพิ่มสินค้าใหม่
            </button>
          </div>

          {/* Add Product Modal */}
          {showAddProduct && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#161922] border border-[#2E3547] rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-red-500" /> เพิ่มสินค้าใหม่
                </h3>
                <form onSubmit={handleAddProduct} className="space-y-3">
                  <input
                    type="text" required value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="ชื่อสินค้า *" className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-red-500 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text" value={newProduct.brand}
                      onChange={e => setNewProduct({...newProduct, brand: e.target.value})}
                      placeholder="แบรนด์" className="bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-red-500 focus:outline-none"
                    />
                    <select
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-red-500 focus:outline-none"
                    >
                      {PRODUCT_CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number" required value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="ราคา (฿) *" className="bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-red-500 focus:outline-none"
                    />
                    <input
                      type="number" value={newProduct.stock}
                      onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                      placeholder="จำนวนสต็อก" className="bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  {/* Compatible Generations */}
                  <div>
                    <label className="text-[11px] text-slate-400 mb-1.5 block">รุ่น Civic ที่รองรับ:</label>
                    <div className="flex flex-wrap gap-2">
                      {CIVIC_GENERATIONS.map(gen => (
                        <button
                          key={gen.id} type="button"
                          onClick={() => toggleGen(gen.id, 'new')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                            newProduct.compatibleGens.includes(gen.id)
                              ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                              : 'bg-[#1F2430] text-slate-400 border border-[#2E3547]'
                          }`}
                        >
                          {gen.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text" value={newProduct.compatibleModels}
                    onChange={e => setNewProduct({...newProduct, compatibleModels: e.target.value})}
                    placeholder="รุ่นรถ (คั่นด้วย , เช่น Civic FD, Civic FB)"
                    className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-red-500 focus:outline-none"
                  />

                  <textarea
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="รายละเอียดสินค้า" rows={3}
                    className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-red-500 focus:outline-none"
                  />

                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition">
                      เพิ่มสินค้า
                    </button>
                    <button type="button" onClick={() => setShowAddProduct(false)} className="px-4 py-2.5 bg-[#1F2430] text-slate-300 rounded-lg text-sm transition hover:bg-[#2E3547]">
                      ยกเลิก
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Product Modal */}
          {editingProduct && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#161922] border border-[#2E3547] rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-400" /> แก้ไขสินค้า
                </h3>
                <form onSubmit={handleUpdateProduct} className="space-y-3">
                  <input
                    type="text" required value={editingProduct.name}
                    onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                    placeholder="ชื่อสินค้า *" className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-red-500 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text" value={editingProduct.brand || ''}
                      onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})}
                      placeholder="แบรนด์" className="bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-red-500 focus:outline-none"
                    />
                    <select
                      value={editingProduct.category}
                      onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                      className="bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-red-500 focus:outline-none"
                    >
                      {PRODUCT_CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number" required value={editingProduct.price}
                      onChange={e => setEditingProduct({...editingProduct, price: e.target.value})}
                      placeholder="ราคา" className="bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-red-500 focus:outline-none"
                    />
                    <input
                      type="number" value={editingProduct.stock}
                      onChange={e => setEditingProduct({...editingProduct, stock: e.target.value})}
                      placeholder="สต็อก" className="bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1.5 block">รุ่น Civic ที่รองรับ:</label>
                    <div className="flex flex-wrap gap-2">
                      {CIVIC_GENERATIONS.map(gen => (
                        <button
                          key={gen.id} type="button"
                          onClick={() => toggleGen(gen.id, 'edit')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                            editingProduct.compatibleGens?.includes(gen.id)
                              ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                              : 'bg-[#1F2430] text-slate-400 border border-[#2E3547]'
                          }`}
                        >
                          {gen.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={editingProduct.description || ''}
                    onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                    placeholder="รายละเอียด" rows={3}
                    className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-red-500 focus:outline-none"
                  />

                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition">
                      บันทึกการแก้ไข
                    </button>
                    <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2.5 bg-[#1F2430] text-slate-300 rounded-lg text-sm transition hover:bg-[#2E3547]">
                      ยกเลิก
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-[#161922] border border-[#2E3547] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#2E3547] flex items-center justify-between">
              <span className="text-sm font-bold text-white">
                สินค้าทั้งหมด ({filteredProducts.length})
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#2E3547] text-slate-400">
                    <th className="text-left px-4 py-3 font-medium">สินค้า</th>
                    <th className="text-left px-4 py-3 font-medium">หมวด</th>
                    <th className="text-right px-4 py-3 font-medium">ราคา</th>
                    <th className="text-center px-4 py-3 font-medium">สต็อก</th>
                    <th className="text-center px-4 py-3 font-medium">เจน</th>
                    <th className="text-center px-4 py-3 font-medium">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => {
                    const cat = PRODUCT_CATEGORIES.find(c => c.id === product.category);
                    return (
                      <tr key={product.id} className="border-b border-[#2E3547]/50 hover:bg-[#1F2430]/50 transition">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white max-w-[200px] truncate">{product.name}</div>
                          <div className="text-[10px] text-slate-500">{product.brand}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-[#1F2430] text-slate-300 px-2 py-0.5 rounded text-[10px]">
                            {cat?.icon} {cat?.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-red-400 font-['Outfit']">
                          ฿{Number(product.price).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            product.stock === 0 ? 'bg-red-500/20 text-red-400' :
                            product.stock <= 3 ? 'bg-amber-500/20 text-amber-400' :
                            'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-0.5 justify-center">
                            {product.compatibleGens?.map(g => (
                              <span key={g} className="text-[9px] bg-[#0F1115] text-slate-400 px-1 rounded">
                                {g.replace('gen', 'G')}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setEditingProduct({
                                ...product,
                                compatibleModels: Array.isArray(product.compatibleModels)
                                  ? product.compatibleModels.join(', ')
                                  : product.compatibleModels || ''
                              })}
                              className="p-1.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                              title="แก้ไข"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`ลบ "${product.name}" ?`)) {
                                  deleteProduct(product.id);
                                }
                              }}
                              className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                              title="ลบ"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredProducts.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">ไม่พบสินค้า</div>
            )}
          </div>
        </div>
      )}

      {/* ===== BOOKINGS TAB ===== */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="bg-[#161922] border border-[#2E3547] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#2E3547]">
              <h3 className="font-bold text-white text-sm">ตารางนัดช่าง ({bookings.length} รายการ)</h3>
            </div>
            {bookings.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500">ยังไม่มีการนัดช่าง</p>
              </div>
            ) : (
              <div className="divide-y divide-[#2E3547]/50">
                {bookings.map(booking => {
                  const assignedMech = mechanics.find(m => m.id === booking.mechanicId);
                  return (
                    <div key={booking.id} className="p-4 hover:bg-[#1F2430]/30 transition">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-sm">{booking.customerName}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              booking.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                              booking.status === 'assigned' ? 'bg-blue-500/20 text-blue-400' :
                              booking.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {booking.status === 'pending' ? 'รอยืนยัน' :
                               booking.status === 'assigned' ? 'มอบหมายแล้ว' :
                               booking.status === 'completed' ? 'เสร็จแล้ว' : booking.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 space-y-0.5">
                            <div>📞 {booking.customerPhone} · 🚗 {booking.carModel}</div>
                            <div>🔧 {booking.serviceType} · 📅 {booking.date} · ⏰ {booking.timeSlot}</div>
                            {booking.note && <div className="text-slate-500">💬 {booking.note}</div>}
                          </div>
                          {assignedMech && (
                            <div className="text-[11px] text-blue-400">
                              {assignedMech.avatar} มอบหมายให้: {assignedMech.name} ({assignedMech.roleLabel})
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <select
                            value={booking.mechanicId || ''}
                            onChange={e => {
                              if (e.target.value) assignMechanic(booking.id, e.target.value);
                            }}
                            className="bg-[#0F1115] border border-[#2E3547] rounded-lg px-2 py-1.5 text-[11px] text-slate-200 focus:border-blue-500 focus:outline-none"
                          >
                            <option value="">เลือกช่าง...</option>
                            {mechanics.map(m => (
                              <option key={m.id} value={m.id}>{m.avatar} {m.name}</option>
                            ))}
                          </select>
                          {booking.status !== 'completed' && (
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'completed')}
                              className="px-2.5 py-1.5 bg-emerald-600/20 text-emerald-400 rounded-lg text-[11px] font-medium hover:bg-emerald-600/30 transition"
                            >
                              ✅ เสร็จ
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== ORDERS TAB ===== */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-[#161922] border border-[#2E3547] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#2E3547]">
              <h3 className="font-bold text-white text-sm">คำสั่งซื้อ ({orders.length} รายการ)</h3>
            </div>
            {orders.length === 0 ? (
              <div className="p-8 text-center">
                <DollarSign className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500">ยังไม่มีคำสั่งซื้อ</p>
              </div>
            ) : (
              <div className="divide-y divide-[#2E3547]/50">
                {orders.map(order => (
                  <div key={order.id} className="p-4 hover:bg-[#1F2430]/30 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-[11px] text-slate-500">{order.id}</span>
                        <div className="text-sm font-bold text-white mt-0.5">
                          ฿{Number(order.totalAmount || 0).toLocaleString()}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          {order.items?.length || 0} รายการ · {new Date(order.createdAt).toLocaleDateString('th-TH')}
                        </div>
                      </div>
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value)}
                        className="bg-[#0F1115] border border-[#2E3547] rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:outline-none"
                      >
                        <option value="pending">รอดำเนินการ</option>
                        <option value="processing">กำลังจัดเตรียม</option>
                        <option value="shipped">จัดส่งแล้ว</option>
                        <option value="completed">สำเร็จ</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== CHECKLIST TAB ===== */}
      {activeTab === 'checklist' && (
        <PurchaseChecklistTab />
      )}

      {/* ===== DATABASE COMMAND TAB ===== */}
      {activeTab === 'database' && (
        <div className="space-y-4">
          <div className="bg-[#161922] border border-emerald-500/20 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Terminal className="w-5 h-5" />
              <h3 className="font-bold text-sm">คำสั่ง Database Console</h3>
            </div>

            <div className="bg-[#0F1115] rounded-lg p-3 text-[11px] text-slate-400 space-y-1 font-mono">
              <p className="text-emerald-400">// ตัวอย่างคำสั่ง:</p>
              <p>INSERT product name="กันชนหน้า Custom" brand="Type R" category="bumper" price=12000 stock=5</p>
              <p>SELECT products</p>
              <p>DELETE product id="prod-001"</p>
              <p>RESET database</p>
              <p className="text-amber-400 mt-2">// หมวดหมู่: bumper, exhaust, suspension, brake, wheel, spoiler, ecu, other</p>
            </div>

            <form onSubmit={handleDbCommand} className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-2.5 text-emerald-500 font-mono text-xs">$</span>
                <input
                  type="text"
                  value={dbCommand}
                  onChange={e => setDbCommand(e.target.value)}
                  placeholder='พิมพ์คำสั่ง... เช่น INSERT product name="ท่อ XYZ" price=15000'
                  className="w-full bg-[#0F1115] border border-emerald-500/30 rounded-lg pl-7 pr-3 py-2.5 text-sm text-slate-100 font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1 transition"
              >
                <Send className="w-3.5 h-3.5" /> Execute
              </button>
            </form>
          </div>

          {/* Results Log */}
          {dbResults.length > 0 && (
            <div className="bg-[#0F1115] border border-[#2E3547] rounded-xl p-4 space-y-2 max-h-[400px] overflow-y-auto font-mono text-xs">
              {dbResults.map((result, idx) => (
                <div key={idx} className="border-b border-[#2E3547]/50 pb-2 last:border-0">
                  <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                    <Clock className="w-3 h-3" />
                    {result.timestamp}
                  </div>
                  <div className="text-emerald-500">$ {result.command}</div>
                  <div className={result.success ? 'text-emerald-400' : 'text-red-400'}>
                    {result.success ? '✅' : '❌'} {result.message}
                  </div>
                  {result.data && Array.isArray(result.data) && result.data.length > 0 && (
                    <div className="text-[10px] text-slate-500 mt-1">
                      ({result.data.length} รายการ)
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ===== Purchase Checklist Sub-Component =====
const PurchaseChecklistTab = () => {
  const { purchaseChecklist, toggleChecklistItem, orders } = useDatabase();

  // Group checklist by orderId
  const grouped = useMemo(() => {
    const map = {};
    purchaseChecklist.forEach(item => {
      if (!map[item.orderId]) map[item.orderId] = [];
      map[item.orderId].push(item);
    });
    return map;
  }, [purchaseChecklist]);

  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#161922] border border-[#2E3547] rounded-xl p-5">
        <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-amber-400" />
          เช็คลิสต์ของที่ซื้อ (Purchase Installation Checklist)
        </h3>
        <p className="text-[11px] text-slate-400 mb-4">
          รายการอะไหล่ที่ลูกค้าสั่งซื้อ พร้อมสถานะการติดตั้ง ✅ = ติดตั้งแล้ว
        </p>

        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500">ยังไม่มีรายการ — เมื่อลูกค้าสั่งซื้อสินค้า รายการจะแสดงที่นี่</p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(grouped).map(([orderId, items]) => {
              const order = orders.find(o => o.id === orderId);
              const completedCount = items.filter(i => i.checked).length;
              const isExpanded = expandedOrders[orderId] !== false;

              return (
                <div key={orderId} className="bg-[#1F2430] rounded-xl border border-[#2E3547] overflow-hidden">
                  <button
                    onClick={() => toggleExpand(orderId)}
                    className="w-full flex items-center justify-between p-3 hover:bg-[#2E3547]/30 transition"
                  >
                    <div className="text-left">
                      <span className="text-[11px] font-mono text-slate-500">Order: {orderId}</span>
                      <div className="text-xs text-white font-medium">
                        {items.length} รายการ · ติดตั้งแล้ว {completedCount}/{items.length}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-[#0F1115] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${items.length > 0 ? (completedCount / items.length) * 100 : 0}%` }}
                        />
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[#2E3547] divide-y divide-[#2E3547]/50">
                      {items.map(item => (
                        <div
                          key={item.id}
                          onClick={() => toggleChecklistItem(item.id)}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#2E3547]/30 transition ${
                            item.checked ? 'opacity-60' : ''
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${
                            item.checked
                              ? 'bg-emerald-500 border-emerald-500'
                              : 'border-slate-500'
                          }`}>
                            {item.checked && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`text-xs font-medium block truncate ${item.checked ? 'line-through text-slate-500' : 'text-white'}`}>
                              {item.productName}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {item.brand} · ฿{Number(item.price).toLocaleString()} × {item.quantity}
                            </span>
                          </div>
                          {item.checked && item.installedAt && (
                            <span className="text-[9px] text-emerald-400 flex-shrink-0">
                              ✅ {new Date(item.installedAt).toLocaleDateString('th-TH')}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
