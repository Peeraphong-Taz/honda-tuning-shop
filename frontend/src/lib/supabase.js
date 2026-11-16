import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * true เมื่อใส่ VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY ใน frontend/.env แล้ว
 * ถ้ายังไม่ใส่ เว็บจะใช้ฐานข้อมูลจำลองใน localStorage (โหมด demo) ต่อไป
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const STORAGE_BUCKETS = {
  productImages: 'product-images',
  paymentSlips: 'payment-slips',
};

const safeFileName = (file) => {
  const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
};

/** อัปโหลดรูปสินค้า (แอดมินเท่านั้น) แล้วคืน public URL */
export const uploadProductImage = async (file) => {
  if (!supabase) throw new Error('ยังไม่ได้เชื่อมต่อ Supabase');
  const path = `products/${safeFileName(file)}`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.productImages)
    .upload(path, file, { cacheControl: '31536000', upsert: false, contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from(STORAGE_BUCKETS.productImages).getPublicUrl(path);
  return data.publicUrl;
};

/** อัปโหลดสลิปโอนเงิน แล้วคืน path (bucket เป็น private — staff เปิดดูผ่าน signed URL) */
export const uploadPaymentSlip = async (file) => {
  if (!supabase) throw new Error('ยังไม่ได้เชื่อมต่อ Supabase');
  const path = `slips/${safeFileName(file)}`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.paymentSlips)
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return path;
};

/** ขอลิงก์ชั่วคราว (1 ชม.) สำหรับเปิดดูสลิป */
export const getSlipSignedUrl = async (path) => {
  if (!supabase || !path) return null;
  if (/^(https?:|blob:)/.test(path)) return path;
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.paymentSlips)
    .createSignedUrl(path, 3600);
  return error ? null : data.signedUrl;
};
