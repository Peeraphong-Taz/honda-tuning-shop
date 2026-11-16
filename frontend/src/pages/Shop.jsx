import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import ProductTile from '../components/ProductTile';
import { Search } from 'lucide-react';

export const Shop = () => {
  const { products, PRODUCT_CATEGORIES, CIVIC_GENERATIONS } = useDatabase();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('cat') || 'all';
  const setCategory = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'all') next.delete('cat'); else next.set('cat', cat);
    setSearchParams(next, { replace: true });
  };
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

  const activeProducts = products.filter(p => p.status === 'active');
  const tabs = [
    { id: 'all', name: 'ทั้งหมด', count: activeProducts.length },
    ...PRODUCT_CATEGORIES
      .map(c => ({ ...c, count: activeProducts.filter(p => p.category === c.id).length }))
      .filter(c => c.count > 0),
  ];

  const selectClass = 'bg-[#0A0A0A] border border-[#2A2A2A] rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-slate-400';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[#2A2A2A] pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display italic">
            <span className="slash" />อะไหล่แต่ง
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            ของแท้สำหรับ Civic FD ถึง FE/FL
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              placeholder="ค้นหาสินค้า หรือแบรนด์"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`${selectClass} w-full sm:w-64 pl-9 placeholder-slate-500`}
            />
          </div>
          <select value={selectedGen} onChange={e => setSelectedGen(e.target.value)} className={selectClass}>
            <option value="">ทุกรุ่น</option>
            {CIVIC_GENERATIONS.map(gen => (
              <option key={gen.id} value={gen.id}>{gen.name}</option>
            ))}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={selectClass}>
            <option value="name">เรียงตามชื่อ</option>
            <option value="price_asc">ราคาต่ำไปสูง</option>
            <option value="price_desc">ราคาสูงไปต่ำ</option>
          </select>
        </div>
      </div>

      {/* Category tabs */}
      <nav className="flex gap-6 overflow-x-auto no-scrollbar border-b border-[#2A2A2A] -mt-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setCategory(tab.id)}
            className={`pb-3 -mb-px border-b-2 text-sm whitespace-nowrap transition-colors ${
              category === tab.id
                ? 'border-red-600 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.name} <span className="text-slate-500">{tab.count}</span>
          </button>
        ))}
      </nav>

      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-2">
          <h3 className="text-lg font-semibold text-white">ไม่พบสินค้าที่ค้นหา</h3>
          <p className="text-sm text-slate-400">ลองเปลี่ยนหมวด รุ่นรถ หรือคำค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {filteredProducts.map(product => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
