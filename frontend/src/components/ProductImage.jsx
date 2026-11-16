import React, { useState } from 'react';
import { getProductFallbackImage, getProductImage } from '../data/productImages';

/**
 * รูปสินค้า — ถ้ารูปของสินค้าโหลดไม่ได้ จะสลับไปใช้รูปประจำหมวดหมู่ให้อัตโนมัติ
 */
export const ProductImage = ({ product, width = 600, className = '', eager = false }) => {
  const [failed, setFailed] = useState(false);
  const src = failed ? getProductFallbackImage(product, width) : getProductImage(product, width);

  return (
    <img
      src={src}
      alt={product?.name || ''}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => { if (!failed) setFailed(true); }}
      className={`w-full h-full object-cover ${className}`}
    />
  );
};

export default ProductImage;
