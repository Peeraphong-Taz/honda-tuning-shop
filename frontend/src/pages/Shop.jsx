import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useCart } from '../context/CartContext';
import {
  PackageX, Search, Filter, Car, ShoppingCart, Check, Eye, Tag
} from 'lucide-react';

export const Shop = () => {
  const { products, PRODUCT_CATEGORIES, CIVIC_GENERATIONS } = useDatabase();
  const { addToCart, cart } = useCart();

  const [category, setCategory] = useState('all');
  const [selectedGen, setSelectedGen] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let data = [...products].filter(p => p.status === 'active');

    if (category !== 'all') {
      data = data.filter(p => p.category === category);
    }
    if (selectedGen) {
      data = data.filter(p => p.compatibleGens?.includes(selectedGen));
    }
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price_asc') data.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') data.sort((a, b) => b.price - a.price);
    else data.sort((a, b) => a.name.localeCompare(b.name));

    return data;
  }, [products, category, selectedGen, search, sortBy]);

  const getCategoryInfo = (catId) => PRODUCT_CATEGORIES.find(c => c.id === catId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
          คลังอะไหล่แต่ง Honda Civic
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          อะไหล่แต่งของแท้สำหรับ Civic FD (Gen 8) ถึง FE/FL (Gen 11) — กันชน Type R, ท่อ ProDrager & JTC, โช้ค Profender & H-Drive, เบรค Brembo & Endless และอื่นๆ
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#161922] border border-[#2E3547] rounded-xl p-4 space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหา กันชน, ท่อ, โช้ค, เบรค, ล้อ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Generation Filter */}
            <div className="flex items-center gap-1.5 flex-1">
              <Car className="w-4 h-4 text-red-500 shrink-0" />
              <select
                value={selectedGen}
                onChange={e => setSelectedGen(e.target.value)}
                className="w-full md:w-52 bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500"
              >
                <option value="">ทุกเจน (All Gens)</option>
                {CIVIC_GENERATIONS.map(gen => (
                  <option key={gen.id} value={gen.id}>{gen.name} ({gen.years})</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500"
            >
              <option value="name">เรียงตามชื่อ</option>
              <option value="price_asc">ราคา ↑ ต่ำ→สูง</option>
              <option value="price_desc">ราคา ↓ สูง→ต่ำ</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              category === 'all'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-[#1F2430] text-slate-300 hover:bg-[#2E3547]'
            }`}
          >
            ทั้งหมด ({products.filter(p => p.status === 'active').length})
          </button>
          {PRODUCT_CATEGORIES.map(cat => {
            const count = products.filter(p => p.category === cat.id && p.status === 'active').length;
            if (count === 0) return null;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  category === cat.id
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-[#1F2430] text-slate-300 hover:bg-[#2E3547]'
                }`}
              >
                {cat.icon} {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#161922] border border-[#2E3547] rounded-xl p-12 text-center space-y-3">
          <PackageX className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">ไม่พบสินค้าตามเงื่อนไขที่ค้นหา</h3>
          <p className="text-xs text-slate-400">ลองเปลี่ยนหมวดหมู่ รุ่นรถ หรือคำค้นหาใหม่</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map(product => {
            const isInCart = cart.some(item => item._id === product.id || item.id === product.id);
            const catInfo = getCategoryInfo(product.category);

            return (
              <div
                key={product.id}
                className="group bg-[#161922] border border-[#2E3547] rounded-xl overflow-hidden hover:border-red-500/60 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-red-600/10"
              >
                {/* Image Area */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-[#1F2430] to-[#161922] overflow-hidden flex items-center justify-center">
                  <div className="text-5xl opacity-30 group-hover:opacity-50 transition-opacity group-hover:scale-110 duration-500">
                    {catInfo?.icon || '📦'}
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-red-400 border border-red-500/30">
                    {catInfo?.name}
                  </div>
                  {product.stock <= 3 && product.stock > 0 && (
                    <div className="absolute top-2 right-2 bg-amber-500/90 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                      เหลือ {product.stock}
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      หมดสต็อก
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 flex gap-1">
                    {product.compatibleGens?.slice(0, 3).map(g => (
                      <span key={g} className="text-[9px] bg-black/60 text-slate-300 px-1.5 py-0.5 rounded">
                        {g.replace('gen', 'Gen ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Tag className="w-3 h-3 text-slate-500" />
                      <span className="text-[10px] text-slate-500">{product.brand}</span>
                    </div>
                    <h3 className="font-semibold text-slate-100 text-sm line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#2E3547] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block -mb-0.5">ราคา</span>
                      <span className="text-lg font-bold text-red-500 font-['Outfit']">
                        ฿{Number(product.price).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart({ ...product, _id: product.id }, 1)}
                      disabled={product.stock === 0}
                      className={`p-2 rounded-lg font-medium text-xs flex items-center gap-1 transition ${
                        product.stock === 0
                          ? 'bg-slate-700/30 text-slate-500 cursor-not-allowed'
                          : isInCart
                            ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/30'
                      }`}
                      title={product.stock === 0 ? 'หมดสต็อก' : isInCart ? 'เพิ่มในตะกร้าแล้ว' : 'ใส่ตะกร้า'}
                    >
                      {product.stock === 0 ? '—' : isInCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Shop;
