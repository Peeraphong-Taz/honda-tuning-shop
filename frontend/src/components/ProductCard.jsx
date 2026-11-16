import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductImage from './ProductImage';

export const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  const isInCart = cart.some(item => item._id === product._id);

  return (
    <div className="group bg-[#121212] border border-[#2A2A2A] rounded-md overflow-hidden hover:border-slate-500 transition-all duration-300 flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-[4/3] bg-[#1A1A1A] overflow-hidden">
        <ProductImage product={product} width={600} className="group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-0 left-0 bg-[#0A0A0A] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
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
              <span key={idx} className="text-[10px] bg-[#1A1A1A] text-slate-300 px-1.5 py-0.5 rounded">
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

        <div className="pt-2 border-t border-[#2A2A2A] flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block -mb-0.5">ราคา</span>
            <span className="text-lg font-bold text-red-500 font-display">
              ฿{Number(product.price).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <Link
              to={`/products/${product._id}`}
              className="p-2 rounded-md bg-[#1A1A1A] hover:bg-[#2A2A2A] text-slate-300 transition"
              title="ดูรายละเอียด"
            >
              <Eye className="w-4 h-4" />
            </Link>

            <button
              onClick={() => addToCart(product, 1)}
              className={`p-2 rounded-md font-medium text-xs flex items-center gap-1 transition ${
                isInCart
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-600 hover:bg-red-700 text-white'
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
