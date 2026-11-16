import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductImage from './ProductImage';

/**
 * การ์ดสินค้าแบบเรียบ: รูป / แบรนด์ / ชื่อ / ราคา + ปุ่มใส่ตะกร้า
 * ใช้ร่วมกันในหน้าแรกและหน้าร้านค้า
 */
export const ProductTile = ({ product }) => {
  const { addToCart, cart } = useCart();
  const isInCart = cart.some(item => item._id === product.id || item.id === product.id);
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 3;

  return (
    <div className="group flex flex-col">
      <Link
        to={`/products/${product.id}`}
        className="relative block aspect-[4/3] rounded-md overflow-hidden bg-[#121212]"
      >
        <ProductImage
          product={product}
          width={600}
          className={`transition-transform duration-500 group-hover:scale-[1.03] ${outOfStock ? 'opacity-50' : ''}`}
        />
        {outOfStock && (
          <span className="absolute top-3 left-3 bg-[#0A0A0A] text-slate-200 text-xs px-2 py-1 rounded-sm">
            สินค้าหมด
          </span>
        )}
      </Link>

      <div className="pt-3 flex-1 flex flex-col">
        <span className="text-xs text-slate-500">{product.brand}</span>
        <Link
          to={`/products/${product.id}`}
          className="mt-0.5 text-[15px] text-slate-100 leading-snug line-clamp-2 hover:text-white hover:underline underline-offset-4 decoration-slate-500"
        >
          {product.name}
        </Link>

        <div className="mt-auto pt-3 flex items-end justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-white font-display">
              ฿{Number(product.price).toLocaleString()}
            </div>
            {lowStock && <div className="text-xs text-amber-400">เหลือ {product.stock} ชิ้น</div>}
          </div>

          {!outOfStock && (
            <button
              onClick={() => addToCart({ ...product, _id: product.id }, 1)}
              disabled={isInCart}
              className={`text-sm px-3 py-1.5 rounded-md border transition-colors ${
                isInCart
                  ? 'border-transparent text-slate-500 cursor-default'
                  : 'border-[#2A2A2A] text-slate-200 hover:border-red-600 hover:text-white'
              }`}
            >
              {isInCart ? 'อยู่ในตะกร้า' : 'ใส่ตะกร้า'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductTile;
