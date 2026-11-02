import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  const isInCart = cart.some(item => item._id === product._id);

  return (
    <div className="group bg-[#161922] border border-[#2E3547] rounded-xl overflow-hidden hover:border-red-500/60 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-red-600/10">
      {/* Product Image */}
      <div className="relative aspect-[4/3] bg-[#1F2430] overflow-hidden">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-semibold text-red-400 border border-red-500/30">
          {product.category}
        </div>
        {product.stock <= 3 && product.stock > 0 && (
          <div className="absolute top-2 right-2 bg-amber-500/90 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
            เหลือ {product.stock} ชิ้น
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Compatible cars badges */}
          <div className="flex flex-wrap gap-1 mb-1.5">
            {product.carCompatible?.slice(0, 2).map((car, idx) => (
              <span key={idx} className="text-[10px] bg-[#1F2430] text-slate-300 px-1.5 py-0.5 rounded">
                {car}
              </span>
            ))}
            {product.carCompatible?.length > 2 && (
              <span className="text-[10px] text-slate-400">+{product.carCompatible.length - 2}</span>
            )}
          </div>

          <Link to={`/products/${product._id}`}>
            <h3 className="font-semibold text-slate-100 hover:text-red-400 text-sm line-clamp-2 leading-snug transition">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="pt-2 border-t border-[#2E3547] flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block -mb-0.5">ราคา</span>
            <span className="text-lg font-bold text-red-500 font-['Outfit']">
              ฿{Number(product.price).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <Link
              to={`/products/${product._id}`}
              className="p-2 rounded-lg bg-[#1F2430] hover:bg-[#2E3547] text-slate-300 transition"
              title="ดูรายละเอียด"
            >
              <Eye className="w-4 h-4" />
            </Link>

            <button
              onClick={() => addToCart(product, 1)}
              className={`p-2 rounded-lg font-medium text-xs flex items-center gap-1 transition ${
                isInCart
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/30'
              }`}
              title={isInCart ? 'เพิ่มในตะกร้าแล้ว' : 'ใส่ตะกร้า'}
            >
              {isInCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
