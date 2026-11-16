/**
 * แปลงชื่อฟิลด์ระหว่างหน้าเว็บ (camelCase) กับตาราง Supabase (snake_case)
 * เช่น customerName <-> customer_name
 */
const toSnake = (key) => key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
const toCamel = (key) => key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

// คอลัมน์ที่มีจริงในแต่ละตาราง — ฟิลด์อื่นที่หน้าเว็บส่งมาจะถูกตัดทิ้งก่อนส่งเข้า DB
const COLUMNS = {
  products: ['id', 'name', 'brand', 'category', 'price', 'description', 'compatible_gens',
    'compatible_models', 'stock', 'image_url', 'status'],
  orders: ['id', 'user_id', 'customer_name', 'customer_phone', 'items', 'total_amount',
    'shipping_address', 'slip_url', 'status'],
  bookings: ['id', 'user_id', 'customer_name', 'customer_phone', 'car_model', 'service_type',
    'date', 'time_slot', 'note', 'status', 'mechanic_id', 'intake_checklist', 'intake_at'],
  purchase_checklist: ['checked', 'installed_by', 'installed_at'],
  mechanics: [],
  profiles: ['name', 'phone'],
};

const NUMERIC = new Set(['price', 'total_amount']);

/** แถวจาก DB -> object ที่หน้าเว็บใช้ */
export const fromDb = (row) => {
  if (!row) return row;
  const out = {};
  for (const [key, value] of Object.entries(row)) {
    out[toCamel(key)] = NUMERIC.has(key) && value !== null ? Number(value) : value;
  }
  return out;
};

/** object จากหน้าเว็บ -> แถวสำหรับ insert/update (เฉพาะคอลัมน์ที่มีจริง) */
export const toDb = (table, obj) => {
  const allowed = COLUMNS[table];
  const out = {};
  for (const [key, value] of Object.entries(obj || {})) {
    const col = toSnake(key);
    if (allowed && !allowed.includes(col)) continue;
    if (value === undefined) continue;
    out[col] = value;
  }
  return out;
};

export const fromDbList = (rows) => (rows || []).map(fromDb);
