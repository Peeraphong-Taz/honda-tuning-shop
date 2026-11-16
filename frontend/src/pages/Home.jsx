import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import ProductTile from '../components/ProductTile';
import { hondaPhoto } from '../data/productImages';

// Civic Type R FK8 — Unsplash License (unsplash.com/photos/Z_M-3hZn7oQ)
const HERO_IMAGE_BASE = 'https://images.unsplash.com/photo-1572471372724-a7c1c9450c21?auto=format&fit=crop&q=75';
const HERO_IMAGE = `${HERO_IMAGE_BASE}&w=1400`;

const BRANDS = ['BREMBO', 'ENDLESS', 'JTC TITANIUM', 'PRODRAGER', 'PROFENDER', 'H-DRIVE', 'ADRO', 'K&N', 'VAGE', 'LENSO', 'ULTRA RACING'];

export const Home = () => {
  const { products, PRODUCT_CATEGORIES, CIVIC_GENERATIONS } = useDatabase();

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

  const features = [
    { title: 'อะไหล่แท้ 100%', desc: 'Brembo, Endless, ProDrager, JTC, Profender, H-Drive, ADRO ของแท้ทุกชิ้น' },
    { title: 'Dyno Tuning Room', desc: 'จูน ECU Remap บนไดโน่ 4WD ทั้ง Pop & Bang เสียงลั่นๆ และ Stage 1 เงียบแรง' },
    { title: 'ช่าง 3 ระดับ', desc: 'ช่างใหญ่ ช่างทั่วไป และช่างฝึกหัด พร้อมรับงานทุกระดับความซับซ้อน' },
    { title: 'รองรับ Gen 8-11', desc: 'Civic FD, FB, FC/FK, FE/FL รวมถึง Type R FK8 & FL5' },
  ];

  const activeCount = products.filter(p => p.status === 'active').length;

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="pt-6 md:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <p className="font-display text-sm font-semibold text-red-500 tracking-wide">
              CIVIC FD — FE/FL · ของแต่ง · ติดตั้ง · จูน
            </p>
            <h1 className="font-display italic font-bold text-5xl md:text-7xl tracking-tight text-white leading-[0.95]">
              ปลดปล่อยพลัง<br />
              <span className="text-red-600">VTEC</span> &amp; TURBO
            </h1>

            <p className="text-slate-400 text-base leading-relaxed">
              อะไหล่แท้และของแต่งสำหรับ Honda Civic ตั้งแต่ FD ถึง FE/FL
              พร้อมช่างติดตั้งและห้องไดโน่จูนในอู่เดียว
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/shop"
                className="btn-cut px-7 py-3 bg-red-600 hover:bg-red-700 text-white font-display font-bold text-base transition-colors"
              >
                เลือกซื้ออะไหล่
              </Link>
              <Link
                to="/service"
                className="px-7 py-3 border border-[#3A3A3A] hover:border-white text-white font-display font-bold text-base transition-colors"
              >
                จองคิวช่าง
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative aspect-[3/2] overflow-hidden bg-[#121212]">
              <div className="absolute top-0 right-0 z-10 w-24 h-24 stripes opacity-90 [clip-path:polygon(0_0,100%_0,100%_100%)]" />
              <img
                src={HERO_IMAGE}
                srcSet={`${HERO_IMAGE_BASE}&w=900 900w, ${HERO_IMAGE_BASE}&w=1400 1400w, ${HERO_IMAGE_BASE}&w=2000 2000w`}
                sizes="(min-width: 1024px) 58vw, 100vw"
                alt="Honda Civic Type R FK8 สีขาว"
                fetchpriority="high"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Quick facts */}
        <dl className="mt-10 grid grid-cols-3 border-y border-[#2A2A2A] divide-x divide-[#2A2A2A]">
          <div className="py-5 px-4 md:px-6">
            <dt className="text-xs text-slate-500">สินค้าพร้อมขาย</dt>
            <dd className="text-xl md:text-3xl font-bold italic text-white font-display mt-1">{activeCount} รายการ</dd>
          </div>
          <div className="py-5 px-4 md:px-6">
            <dt className="text-xs text-slate-500">รุ่นที่รองรับ</dt>
            <dd className="text-xl md:text-3xl font-bold italic text-white font-display mt-1">Gen 8–11</dd>
          </div>
          <div className="py-5 px-4 md:px-6">
            <dt className="text-xs text-slate-500">ห้องจูน</dt>
            <dd className="text-xl md:text-3xl font-bold italic text-white font-display mt-1">ไดโน่ 4WD</dd>
          </div>
        </dl>
      </section>

      {/* Brand strip */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden bg-red-600 py-3 select-none" aria-label="แบรนด์ที่มีจำหน่าย">
        <div className="flex w-max animate-marquee">
          {[0, 1].map(copy => (
            <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
              {BRANDS.map(b => (
                <span key={b} className="font-display italic font-bold text-lg md:text-xl text-white px-6 whitespace-nowrap">
                  {b} <span className="text-black/40 ml-6">/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* About the shop */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
        <div className="aspect-[4/3] rounded-md overflow-hidden bg-[#121212]">
          <img
            src={hondaPhoto('typeRBay', 900)}
            alt="ห้องเครื่อง Honda Type R แต่ง"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="font-display italic font-bold text-2xl md:text-3xl tracking-tight text-white">
            <span className="slash" />ซื้อของ ติดตั้ง และจูน จบในอู่เดียว
          </h2>
          <dl className="divide-y divide-[#2A2A2A] border-y border-[#2A2A2A]">
            {features.map(f => (
              <div key={f.title} className="py-4 grid grid-cols-3 gap-4">
                <dt className="text-sm font-semibold text-white">{f.title}</dt>
                <dd className="col-span-2 text-sm text-slate-400 leading-relaxed">{f.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="space-y-6">
        <SectionHeader title="หมวดหมู่อะไหล่" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#2A2A2A] border border-[#2A2A2A] rounded-md overflow-hidden">
          {PRODUCT_CATEGORIES.filter(c => categoryCounts[c.id] > 0).map(cat => (
            <Link
              key={cat.id}
              to={`/shop?cat=${cat.id}`}
              className="bg-[#0A0A0A] hover:bg-[#121212] p-5 flex items-center justify-between group transition-colors"
            >
              <div>
                <h4 className="text-sm font-semibold text-white">{cat.name}</h4>
                <span className="text-xs text-slate-500">{categoryCounts[cat.id]} รายการ</span>
              </div>
              <span className="font-display text-slate-600 group-hover:text-red-500 transition-colors">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <SectionHeader
          title="สินค้ายอดนิยม"
          subtitle="ของแต่งที่ลูกค้าเลือกบ่อยที่สุด"
          action={
            <Link to="/shop" className="text-sm font-semibold text-slate-300 hover:text-white flex items-center gap-1 transition-colors shrink-0">
              ดูทั้งหมด →
            </Link>
          }
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
          {featuredProducts.map(product => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Civic Generations */}
      <section className="space-y-6">
        <SectionHeader title="รุ่นรถที่รองรับ" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#2A2A2A] border border-[#2A2A2A] rounded-md overflow-hidden">
          {CIVIC_GENERATIONS.map(gen => (
            <div key={gen.id} className="bg-[#0A0A0A] p-5">
              <p className="text-3xl font-bold italic text-white font-display">{gen.code}</p>
              <h4 className="text-sm text-slate-300 mt-2">{gen.name}</h4>
              <p className="text-xs text-slate-500">{gen.years}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex items-end justify-between gap-4 border-b border-[#2A2A2A] pb-4">
    <div>
      <h2 className="font-display italic font-bold text-2xl md:text-3xl tracking-tight text-white"><span className="slash" />{title}</h2>
      {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default Home;
