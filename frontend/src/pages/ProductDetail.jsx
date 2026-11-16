import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useCart } from '../context/CartContext';
import ProductImage from '../components/ProductImage';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, PRODUCT_CATEGORIES, CIVIC_GENERATIONS } = useDatabase();

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

  const categoryName = PRODUCT_CATEGORIES.find(c => c.id === product.category)?.name || product.category;
  const genNames = (product.compatibleGens || [])
    .map(g => CIVIC_GENERATIONS.find(x => x.id === g)?.name || g);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 flex items-center gap-2">
        <Link to="/shop" className="hover:text-white transition-colors">อะไหล่แต่ง</Link>
        <span>/</span>
        <Link to={`/shop?cat=${product.category}`} className="hover:text-white transition-colors">{categoryName}</Link>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
        {/* Product Image */}
        <div className="rounded-md overflow-hidden aspect-square bg-[#121212]">
          <ProductImage product={product} width={1000} eager />
        </div>

        {/* Product Info */}
        <div className="space-y-7">
          <div>
            <p className="text-sm text-slate-400">{product.brand}</p>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight font-display">
              {product.name}
            </h1>
            <div className="mt-4 text-3xl font-semibold text-white font-display">
              ฿{Number(product.price).toLocaleString()}
            </div>
            <p className={`mt-1 text-sm ${product.stock > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {product.stock > 0 ? `มีของพร้อมส่ง ${product.stock} ชิ้น` : 'สินค้าหมด สั่งจองล่วงหน้าได้'}
            </p>
          </div>

          <p className="text-[15px] text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity and Actions */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex items-center border border-[#2A2A2A] rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-11 text-slate-300 hover:text-white"
                  aria-label="ลดจำนวน"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-11 text-slate-300 hover:text-white"
                  aria-label="เพิ่มจำนวน"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="btn-cut flex-1 h-11 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-display font-bold text-sm transition-colors"
              >
                สั่งซื้อเลย
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full h-11 rounded-md border border-[#2A2A2A] hover:border-slate-400 disabled:opacity-50 text-white text-sm transition-colors"
            >
              {added ? 'เพิ่มลงตะกร้าแล้ว' : 'ใส่ตะกร้า'}
            </button>
          </div>

          {/* Specs */}
          <dl className="divide-y divide-[#2A2A2A] border-y border-[#2A2A2A] text-sm">
            <div className="py-3 grid grid-cols-3 gap-4">
              <dt className="text-slate-500">หมวดหมู่</dt>
              <dd className="col-span-2 text-slate-200">{categoryName}</dd>
            </div>
            {genNames.length > 0 && (
              <div className="py-3 grid grid-cols-3 gap-4">
                <dt className="text-slate-500">รุ่นที่รองรับ</dt>
                <dd className="col-span-2 text-slate-200">{genNames.join(', ')}</dd>
              </div>
            )}
            {compatibleList.length > 0 && (
              <div className="py-3 grid grid-cols-3 gap-4">
                <dt className="text-slate-500">ใส่ได้กับ</dt>
                <dd className="col-span-2 text-slate-200">{[].concat(compatibleList).join(', ')}</dd>
              </div>
            )}
            <div className="py-3 grid grid-cols-3 gap-4">
              <dt className="text-slate-500">การรับประกัน</dt>
              <dd className="col-span-2 text-slate-200">ของแท้ ประกันตามศูนย์ ติดตั้งและจูนได้ที่อู่ ส่งทั่วไทย 1–2 วัน</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
