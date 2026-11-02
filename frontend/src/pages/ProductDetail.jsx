import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useCart } from '../context/CartContext';
import {
  ArrowLeft, ShoppingCart, Check, ShieldCheck, Truck, RotateCcw,
  Car, Tag, Layers, CheckCircle2
} from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useDatabase();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (products && products.length > 0) {
      const found = products.find(p => p.id === id || p._id === id);
      setProduct(found || null);
      setLoading(false);
    }
  }, [id, products]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold text-white">ไม่พบข้อมูลสินค้านี้</h2>
        <p className="text-sm text-slate-400">รหัสสินค้า: {id}</p>
        <Link to="/shop" className="text-red-500 hover:underline text-sm inline-block">
          กลับไปยังหน้าร้านค้า
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const compatibleList = product.compatibleModels ||
    (product.compatibleGens && product.compatibleGens.map(g => `Civic Gen ${g.replace('gen', '')}`)) ||
    product.carCompatible || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Back button */}
      <Link to="/shop" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4" /> ย้อนกลับไปเลือกสินค้า
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="bg-[#161922] border border-[#2E3547] rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-4 relative group">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl transition duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80';
            }}
          />
          {product.brand && (
            <span className="absolute top-6 left-6 px-3 py-1 rounded-md bg-black/70 backdrop-blur-md text-red-400 font-bold text-xs uppercase tracking-wider border border-white/10">
              {product.brand}
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-block px-2.5 py-1 rounded bg-red-600/20 text-red-400 text-xs font-semibold border border-red-500/30">
                {product.category}
              </span>
              {product.stock > 0 ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> พร้อมส่ง ({product.stock} ชิ้น)
                </span>
              ) : (
                <span className="text-xs text-red-400">สินค้าหมด (Pre-order)</span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight font-['Outfit']">
              {product.name}
            </h1>

            <div className="text-3xl md:text-4xl font-extrabold text-red-500 font-['Outfit'] pt-2">
              ฿{Number(product.price).toLocaleString()}
            </div>
          </div>

          {/* Compatible Generations */}
          {product.compatibleGens && product.compatibleGens.length > 0 && (
            <div className="p-4 bg-[#161922] border border-[#2E3547] rounded-xl space-y-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-red-500" /> รุ่น Honda Civic ที่รองรับ:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.compatibleGens.map((gen, idx) => (
                  <span
                    key={idx}
                    className="bg-[#1F2430] border border-[#2E3547] px-2.5 py-1 rounded-md text-xs text-red-400 font-semibold"
                  >
                    Civic {gen.toUpperCase()}
                  </span>
                ))}
              </div>
              {product.compatibleModels && (
                <p className="text-xs text-slate-400 pt-1">
                  {product.compatibleModels}
                </p>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">รายละเอียดสินค้า</h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-[#161922]/50 p-4 rounded-xl border border-[#2E3547]/50">
              {product.description}
            </p>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-4 border-t border-[#2E3547]">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-medium text-slate-400">จำนวน:</span>
              <div className="flex items-center border border-[#2E3547] rounded-lg bg-[#0F1115]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-300 hover:text-white"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-semibold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-slate-300 hover:text-white"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-slate-500">
                {product.stock > 0 ? `คงเหลือ ${product.stock} ชิ้น` : 'สั่งจองล่วงหน้า'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 py-3 px-6 rounded-lg bg-[#1F2430] hover:bg-[#2E3547] disabled:opacity-50 border border-[#2E3547] text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
              >
                {added ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingCart className="w-4 h-4 text-red-500" />}
                {added ? 'เพิ่มลงในตะกร้าแล้ว' : 'เพิ่มลงตะกร้า'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 py-3 px-6 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition"
              >
                สั่งซื้อทันที
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#2E3547] text-center text-[11px] text-slate-400">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span>ของแท้ 100% ประกันศูนย์</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-red-500" />
              <span>ส่งด่วนทั่วไทย 1-2 วัน</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-red-500" />
              <span>ติดตั้ง & จูนนิ่งที่อู่</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
