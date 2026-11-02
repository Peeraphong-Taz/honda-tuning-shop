import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useCart } from '../context/CartContext';
import {
  Gauge, Shield, Wrench, Flame, ArrowRight, Zap, ShoppingCart,
  Tag, Check, Car
} from 'lucide-react';

export const Home = () => {
  const { products, PRODUCT_CATEGORIES, CIVIC_GENERATIONS } = useDatabase();
  const { addToCart, cart } = useCart();

  // Featured products (first 8 active)
  const featuredProducts = useMemo(() => {
    return products.filter(p => p.status === 'active').slice(0, 8);
  }, [products]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = {};
    PRODUCT_CATEGORIES.forEach(c => {
      counts[c.id] = products.filter(p => p.category === c.id && p.status === 'active').length;
    });
    return counts;
  }, [products, PRODUCT_CATEGORIES]);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-black via-[#161922] to-[#1F2430] border border-[#2E3547] p-8 md:p-16 my-4 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-10 bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            Honda Civic Tuning Specialist — Gen 8-11
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white font-['Outfit'] leading-tight">
            ปลดปล่อยพลัง <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
              VTEC & TURBO
            </span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            ศูนย์รวมอะไหล่แท้ กันชน Type R FL5, ท่อ ProDrager & JTC Titanium, โช้ค Profender & H-Drive Spec,
            เบรค Brembo & Endless, สปอยเลอร์ ADRO Carbon และกล่องจูน ECU สำหรับ Honda Civic ตั้งแต่ FD (Gen 8) ถึง FE/FL (Gen 11)
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/shop"
              className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-lg shadow-red-600/30 flex items-center gap-2 transition"
            >
              เลือกซื้ออะไหล่แต่ง <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/service"
              className="px-6 py-3 rounded-lg bg-[#1F2430] hover:bg-[#2E3547] text-white border border-[#2E3547] font-semibold text-sm flex items-center gap-2 transition"
            >
              <Wrench className="w-4 h-4 text-red-500" />
              จองคิวช่าง & ไดโน่
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#161922] border border-[#2E3547] p-6 rounded-xl space-y-2 hover:border-red-500/30 transition">
          <div className="w-10 h-10 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Shield className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base">อะไหล่แท้ 100%</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Brembo, Endless, ProDrager, JTC, Profender, H-Drive, ADRO ของแท้ทุกชิ้น
          </p>
        </div>

        <div className="bg-[#161922] border border-[#2E3547] p-6 rounded-xl space-y-2 hover:border-red-500/30 transition">
          <div className="w-10 h-10 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Gauge className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base">Dyno Tuning Room</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            จูน ECU Remap บนไดโน่ 4WD ทั้ง Pop & Bang เสียงลั่นๆ และ Stage 1 เงียบแรง
          </p>
        </div>

        <div className="bg-[#161922] border border-[#2E3547] p-6 rounded-xl space-y-2 hover:border-red-500/30 transition">
          <div className="w-10 h-10 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Wrench className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base">ช่าง 3 ระดับ</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            ช่างใหญ่ (Master), ช่างทั่วไป และช่างฝึกหัด พร้อมรับงานทุกระดับความซับซ้อน
          </p>
        </div>

        <div className="bg-[#161922] border border-[#2E3547] p-6 rounded-xl space-y-2 hover:border-red-500/30 transition">
          <div className="w-10 h-10 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Car className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base">รองรับ Gen 8-11</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Civic FD, FB, FC/FK, FE/FL รวมถึง Type R FK8 & FL5
          </p>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white font-['Outfit']">หมวดหมู่อะไหล่</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PRODUCT_CATEGORIES.filter(c => categoryCounts[c.id] > 0).map(cat => (
            <Link
              key={cat.id}
              to={`/shop?cat=${cat.id}`}
              className="bg-[#161922] border border-[#2E3547] rounded-xl p-4 hover:border-red-500/40 transition group"
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <h4 className="text-sm font-semibold text-white group-hover:text-red-400 transition">{cat.name}</h4>
              <span className="text-[10px] text-slate-500">{categoryCounts[cat.id]} รายการ</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white font-['Outfit']">สินค้ายอดนิยม</h2>
            <p className="text-xs text-slate-400">อะไหล่แต่ง Honda Civic Gen 8-11 ที่ขายดีที่สุด</p>
          </div>
          <Link to="/shop" className="text-xs font-semibold text-red-500 hover:text-red-400 flex items-center gap-1">
            ดูทั้งหมด <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {featuredProducts.map(product => {
            const isInCart = cart.some(item => item._id === product.id || item.id === product.id);
            const catInfo = PRODUCT_CATEGORIES.find(c => c.id === product.category);

            return (
              <div
                key={product.id}
                className="group bg-[#161922] border border-[#2E3547] rounded-xl overflow-hidden hover:border-red-500/60 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-red-600/10"
              >
                <div className="relative aspect-[4/3] bg-gradient-to-br from-[#1F2430] to-[#161922] overflow-hidden flex items-center justify-center">
                  <div className="text-5xl opacity-30 group-hover:opacity-50 transition-opacity group-hover:scale-110 duration-500">
                    {catInfo?.icon || '📦'}
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-red-400 border border-red-500/30">
                    {catInfo?.name}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Tag className="w-3 h-3 text-slate-500" />
                      <span className="text-[10px] text-slate-500">{product.brand}</span>
                    </div>
                    <h3 className="font-semibold text-slate-100 text-sm line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-[#2E3547] flex items-center justify-between">
                    <span className="text-lg font-bold text-red-500 font-['Outfit']">
                      ฿{Number(product.price).toLocaleString()}
                    </span>
                    <button
                      onClick={() => addToCart({ ...product, _id: product.id }, 1)}
                      className={`p-2 rounded-lg transition ${
                        isInCart
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/30'
                      }`}
                    >
                      {isInCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Civic Generations */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white font-['Outfit']">รุ่นรถที่รองรับ</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CIVIC_GENERATIONS.map(gen => (
            <div key={gen.id} className="bg-[#161922] border border-[#2E3547] rounded-xl p-4 hover:border-red-500/30 transition">
              <h4 className="text-sm font-bold text-white">{gen.name}</h4>
              <p className="text-[11px] text-slate-400">{gen.years}</p>
              <p className="text-[10px] text-red-400 mt-1">Code: {gen.code}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
