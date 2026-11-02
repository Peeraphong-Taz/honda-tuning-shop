/**
 * Mock Database for Honda Tuning Shop
 * =============================================
 * This file simulates a Supabase database with localStorage persistence.
 * When your friend connects Supabase, replace the functions in DatabaseContext
 * with actual Supabase calls. The data schema here matches Supabase table design.
 *
 * Tables simulated:
 * - products: อะไหล่แต่ง Honda Civic Gen 8-11
 * - orders: คำสั่งซื้อ
 * - bookings: ตารางนัดช่าง
 * - mechanics: ข้อมูลช่าง
 * - purchase_checklist: รายการเช็คของที่ซื้อ
 */

// ===== HONDA CIVIC GENERATIONS =====
export const CIVIC_GENERATIONS = [
  { id: 'gen8', name: 'Civic FD (Gen 8)', years: '2006-2011', code: 'FD' },
  { id: 'gen9', name: 'Civic FB (Gen 9)', years: '2012-2015', code: 'FB' },
  { id: 'gen10', name: 'Civic FC/FK (Gen 10)', years: '2016-2021', code: 'FC/FK' },
  { id: 'gen11', name: 'Civic FE/FL (Gen 11)', years: '2021-ปัจจุบัน', code: 'FE/FL' },
];

// ===== PRODUCT CATEGORIES =====
export const PRODUCT_CATEGORIES = [
  { id: 'bumper', name: 'กันชนหน้า-หลัง', icon: '🛡️' },
  { id: 'exhaust', name: 'ท่อไอเสีย', icon: '💨' },
  { id: 'suspension', name: 'โช้คอัพ / ช่วงล่าง', icon: '🔧' },
  { id: 'brake', name: 'ระบบเบรค', icon: '🔴' },
  { id: 'wheel', name: 'ล้อแม็ก', icon: '⚙️' },
  { id: 'spoiler', name: 'สปอยเลอร์ / แอโร่', icon: '🏎️' },
  { id: 'ecu', name: 'กล่องจูน / ECU', icon: '🖥️' },
  { id: 'other', name: 'อื่นๆ', icon: '📦' },
];

// ===== MECHANICS DATA =====
export const MECHANICS = [
  {
    id: 'mech-001',
    name: 'ช่างใหญ่',
    nickname: 'พี่ใหญ่',
    role: 'master',
    roleLabel: 'ช่างหัวหน้า (Master Mechanic)',
    description: 'ทำได้ทุกอย่าง ตั้งแต่จูน ECU, ติดตั้งเทอร์โบ, เซ็ตช่วงล่าง, เปลี่ยนเบรค Big Brake Kit จนถึงงานพ่นสีและชุดแต่งรอบคัน',
    specialties: ['ECU Tuning', 'Turbo Install', 'Suspension Setup', 'Brake Kit', 'Full Body Kit', 'Engine Swap'],
    experience: '15+ ปี',
    avatar: '👨‍🔧',
    color: '#DC2626',
    available: true,
    maxJobsPerDay: 3,
  },
  {
    id: 'mech-002',
    name: 'ช่างทั่วไป',
    nickname: 'ช่างเบนซ์',
    role: 'general',
    roleLabel: 'ช่างทั่วไป (General Mechanic)',
    description: 'งานติดตั้งทั่วไป เปลี่ยนอะไหล่, ติดตั้งท่อไอเสีย, เปลี่ยนโช้ค, ติดตั้งชุดแต่ง, เปลี่ยนผ้าเบรค และงานเซอร์วิสทั่วไป',
    specialties: ['Exhaust Install', 'Suspension Change', 'Body Kit Install', 'Brake Pad Change', 'General Service'],
    experience: '8 ปี',
    avatar: '🔧',
    color: '#3B82F6',
    available: true,
    maxJobsPerDay: 5,
  },
  {
    id: 'mech-003',
    name: 'ช่างฝึกหัด',
    nickname: 'น้องเจ',
    role: 'apprentice',
    roleLabel: 'ช่างฝึกหัด (Apprentice)',
    description: 'ดูได้เบื้องต้น เปลี่ยน part ง่ายๆ เช่น เปลี่ยนไฟ, เปลี่ยนกรองอากาศ, เปลี่ยนน้ำมัน, ติดสติ๊กเกอร์ และเช็คสภาพรถเบื้องต้น',
    specialties: ['Oil Change', 'Air Filter', 'Light Bulbs', 'Stickers', 'Basic Inspection'],
    experience: '2 ปี',
    avatar: '🧑‍🔧',
    color: '#10B981',
    available: true,
    maxJobsPerDay: 8,
  },
];

// ===== INITIAL PRODUCTS DATA =====
export const INITIAL_PRODUCTS = [
  // ===== กันชนหน้า-หลัง TYPE R FL5 =====
  {
    id: 'prod-001',
    name: 'กันชนหน้า Type R FL5 Style (PP)',
    brand: 'Type R',
    category: 'bumper',
    price: 15900,
    description: 'กันชนหน้าทรง Type R FL5 วัสดุ PP เกรดพรีเมียม ตรงรุ่น Civic FE/FL Gen 11 พร้อมตะแกรงดำเงา สเปคจากโรงงานผลิตญี่ปุ่น',
    compatibleGens: ['gen11'],
    compatibleModels: ['Civic FE', 'Civic FL'],
    stock: 12,
    imageUrl: '',
    status: 'active',
  },
  {
    id: 'prod-002',
    name: 'กันชนหลัง Type R FL5 Style (PP) พร้อม Diffuser',
    brand: 'Type R',
    category: 'bumper',
    price: 18500,
    description: 'กันชนหลังทรง Type R FL5 วัสดุ PP พร้อม diffuser ด้านล่าง เสริมลุคสปอร์ตก้าวร้าว ตรงรุ่น Civic FE/FL Gen 11',
    compatibleGens: ['gen11'],
    compatibleModels: ['Civic FE', 'Civic FL'],
    stock: 8,
    imageUrl: '',
    status: 'active',
  },
  {
    id: 'prod-003',
    name: 'กันชนหน้า Type R FD2 Style สำหรับ Gen 8',
    brand: 'Type R',
    category: 'bumper',
    price: 12500,
    description: 'กันชนหน้าทรง Type R FD2 วัสดุ FRP+PP สำหรับ Civic FD Gen 8 ดีไซน์สปอร์ตดุดัน ช่องลมใหญ่ระบายความร้อนดี',
    compatibleGens: ['gen8'],
    compatibleModels: ['Civic FD'],
    stock: 6,
    imageUrl: '',
    status: 'active',
  },
  {
    id: 'prod-004',
    name: 'กันชนหน้า Type R FK8 Style สำหรับ Gen 10',
    brand: 'Type R',
    category: 'bumper',
    price: 14900,
    description: 'กันชนหน้า FK8 Type R สำหรับ Civic FC/FK Gen 10 วัสดุ PP คุณภาพสูง พร้อม LED DRL ตำแหน่ง OEM',
    compatibleGens: ['gen10'],
    compatibleModels: ['Civic FC', 'Civic FK'],
    stock: 10,
    imageUrl: '',
    status: 'active',
  },

  // ===== ท่อไอเสีย =====
  {
    id: 'prod-005',
    name: 'ท่อ ProDrager Full System (Stainless 304)',
    brand: 'ProDrager',
    category: 'exhaust',
    price: 28900,
    description: 'ท่อ ProDrager ระบบเต็ม สแตนเลส 304 Header 4-2-1 + ท่อกลาง + ปลายท่อคู่ เสียงทุ้มเข้มกำลังดี กำลังไม่หายจากปลายท่อ',
    compatibleGens: ['gen8', 'gen9', 'gen10', 'gen11'],
    compatibleModels: ['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE'],
    stock: 5,
    imageUrl: '',
    status: 'active',
  },
  {
    id: 'prod-006',
    name: 'ท่อ JTC Titanium Full Exhaust (Ti Grade 2)',
    brand: 'JTC',
    category: 'exhaust',
    price: 45900,
    description: 'ท่อ JTC Titanium เกรด 2 เผาไล่สีรุ้ง น้ำหนักเบากว่าสแตนเลส 40% เสียงแหลมคมสไตล์ Japanese Tuning ทนความร้อน 800°C',
    compatibleGens: ['gen10', 'gen11'],
    compatibleModels: ['Civic FC', 'Civic FK', 'Civic FE', 'Civic FL'],
    stock: 3,
    imageUrl: '',
    status: 'active',
  },
  {
    id: 'prod-007',
    name: 'ท่อ ProDrager Cat-Back Exhaust (SS304)',
    brand: 'ProDrager',
    category: 'exhaust',
    price: 18500,
    description: 'ท่อ ProDrager แบบ Cat-Back (ไม่รวม Header) สแตนเลส 304 ปลายท่อเดี่ยวขนาด 4 นิ้ว เสียงทุ้มนุ่มใช้งานประจำวันสบาย',
    compatibleGens: ['gen8', 'gen9', 'gen10', 'gen11'],
    compatibleModels: ['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE'],
    stock: 15,
    imageUrl: '',
    status: 'active',
  },

  // ===== โช้คอัพ =====
  {
    id: 'prod-008',
    name: 'โช้ค Profender Adjustable Coilover (32 คลิก)',
    brand: 'Profender',
    category: 'suspension',
    price: 32000,
    description: 'โช้ค Profender Adjustable ปรับความนุ่มแข็งได้ 32 ระดับ พร้อมสปริง Hi-Lo Kit สำหรับใช้งานถนน-สนามแข่ง Civic ทุกเจน',
    compatibleGens: ['gen8', 'gen9', 'gen10', 'gen11'],
    compatibleModels: ['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE'],
    stock: 7,
    imageUrl: '',
    status: 'active',
  },
  {
    id: 'prod-009',
    name: 'โช้ค H-Drive Spec R (Inverted Type)',
    brand: 'H-Drive',
    category: 'suspension',
    price: 38500,
    description: 'โช้ค H-Drive Spec R แบบ Inverted (คว่ำหัว) ปรับ 36 คลิก วัสดุอลูมิเนียม Forged ทนทาน แรงกดดันสูง เหมาะสำหรับวิ่งสนามและถนน',
    compatibleGens: ['gen10', 'gen11'],
    compatibleModels: ['Civic FC', 'Civic FK', 'Civic FE', 'Civic FL'],
    stock: 4,
    imageUrl: '',
    status: 'active',
  },

  // ===== ระบบเบรค =====
  {
    id: 'prod-010',
    name: 'เบรค Brembo 17Z (4-Pot) Caliper Kit',
    brand: 'Brembo',
    category: 'brake',
    price: 55000,
    description: 'ชุดคาลิปเปอร์ Brembo 17Z 4 ลูกสูบ สีแดง Brembo แท้ พร้อมจานเบรค 2-piece 330mm และผ้าเบรค Brembo Sport',
    compatibleGens: ['gen8', 'gen9', 'gen10', 'gen11'],
    compatibleModels: ['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE'],
    stock: 3,
    imageUrl: '',
    status: 'active',
  },
  {
    id: 'prod-011',
    name: 'เบรค Brembo 18Z (6-Pot) Caliper Kit',
    brand: 'Brembo',
    category: 'brake',
    price: 78000,
    description: 'ชุดคาลิปเปอร์ Brembo 18Z 6 ลูกสูบ สีแดง Brembo แท้ พร้อมจานเบรค 2-piece 355mm และผ้าเบรค Brembo Racing',
    compatibleGens: ['gen10', 'gen11'],
    compatibleModels: ['Civic FC', 'Civic FK', 'Civic FE', 'Civic FL'],
    stock: 2,
    imageUrl: '',
    status: 'active',
  },
  {
    id: 'prod-012',
    name: 'เบรค Brembo แท้ OEM (Civic Type R FK8/FL5)',
    brand: 'Brembo',
    category: 'brake',
    price: 42000,
    description: 'ชุดเบรค Brembo แท้จากโรงงาน OEM Type R FK8/FL5 4-Pot หน้า พร้อมจานเบรค Brembo ของแท้ Civic Type R',
    compatibleGens: ['gen10', 'gen11'],
    compatibleModels: ['Civic FK8 Type R', 'Civic FL5 Type R'],
    stock: 4,
    imageUrl: '',
    status: 'active',
  },
  {
    id: 'prod-013',
    name: 'เบรค Endless MX72 Plus (หน้า-หลัง)',
    brand: 'Endless',
    category: 'brake',
    price: 35000,
    description: 'ผ้าเบรค Endless MX72 Plus (หน้า+หลัง) สำหรับ Civic ทุกเจน เกรดถนน-สนามแข่ง ทนความร้อนสูง ฝุ่นน้อย กัดจานเบรคน้อย',
    compatibleGens: ['gen8', 'gen9', 'gen10', 'gen11'],
    compatibleModels: ['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE', 'Civic FK8 Type R'],
    stock: 10,
    imageUrl: '',
    status: 'active',
  },

  // ===== ล้อแม็ก =====
  {
    id: 'prod-014',
    name: 'ล้อ Vage Vf04  (18x8.5)',
    brand: 'VageWheels',
    category: 'wheel',
    price: 30000,
    description: 'ล้อ Vage Vf04 ขนาด 18x8.5 VageWheels ที่โดดเด่นด้วยงานผลิตแบบ Flow-Forming (ขึ้นรูปด้วยการรีดไหล ทำให้เนื้ออลูมิเนียมแกร่ง เบา และลดแรงเหวี่ยง)',
    compatibleGens: ['gen8', 'gen9', 'gen10', 'gen11'],
    compatibleModels: ['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE'],
    stock: 4,
    imageUrl: '',
    status: 'active',
  },
  {
    id: 'prod-015',
    name: 'ล้อ Lenso Jager Dyna (17x7.5) ลายสปอร์ต',
    brand: 'Lenso',
    category: 'wheel',
    price: 28000,
    description: 'ล้อ Lenso Jager Dyna 17x7.5 ET42 ลายสปอร์ตก้านคู่ Flow Forming น้ำหนักเบา ราคาคุ้มค่า เหมาะทั้งถนนและสนาม',
    compatibleGens: ['gen8', 'gen9', 'gen10', 'gen11'],
    compatibleModels: ['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE'],
    stock: 8,
    imageUrl: '',
    status: 'active',
  },

  // ===== สปอยเลอร์ =====
  {
    id: 'prod-016',
    name: 'สปอยเลอร์ G82 Style (ดำเงา Gloss Black)',
    brand: 'G82 Aero',
    category: 'spoiler',
    price: 5000,
    description: 'สปอยเลอร์ทรง G82 ดำเงา Gloss Black วัสดุ ABS เกรดพรีเมียม ติดตั้งง่ายด้วยเทปกาว 3M + สกรู ลุคสปอร์ตหรูหรา',
    compatibleGens: ['gen10', 'gen11'],
    compatibleModels: ['Civic FC', 'Civic FE'],
    stock: 20,
    imageUrl: '',
    status: 'active',
  },
  {
    id: 'prod-017',
    name: 'สปอยเลอร์ G82 Style (Prepreg Carbon)',
    brand: 'G82 Aero',
    category: 'spoiler',
    price: 15900,
    description: 'สปอยเลอร์ทรง G82 คาร์บอนแท้ Prepreg Carbon น้ำหนักเบา ลายคาร์บอนคมชัด เคลือบ UV กันแดดแตก ของแท้ไม่ใช่ไฮโดรกราฟิก',
    compatibleGens: ['gen10', 'gen11'],
    compatibleModels: ['Civic FC', 'Civic FE'],
    stock: 6,
    imageUrl: '',
    status: 'active',
  },
  {
    id: 'prod-018',
    name: 'สปอยเลอร์ ADRO Carbon Prepreg (Duckbill)',
    brand: 'ADRO',
    category: 'spoiler',
    price: 22500,
    description: 'สปอยเลอร์ ADRO แท้ คาร์บอนไฟเบอร์ Prepreg แบบ Duckbill ดีไซน์เรียบหรูมินิมอล น้ำหนักเบามาก เหมาะกับ Civic FE/FL',
    compatibleGens: ['gen11'],
    compatibleModels: ['Civic FE', 'Civic FL'],
    stock: 3,
    imageUrl: '',
    status: 'active',
  },

  // ===== กล่องจูน / ECU =====
  {
    id: 'prod-019',
    name: 'กล่องจูน Stage 1 (เอาแรง เสียงไม่รบกวน)',
    brand: 'Honda Tuning Custom',
    category: 'ecu',
    price: 18000,
    description: 'กล่องจูน ECU Remap Stage 1 เน้นแรงบิดเต็มพิกัด เสียงไม่รบกวนการใช้งานปกติ เพิ่มแรงม้า 20-30% แรงบิดเพิ่ม 25-35% ปลดล็อค Speed Limiter',
    compatibleGens: ['gen10', 'gen11'],
    compatibleModels: ['Civic FC 1.5T', 'Civic FE 1.5T'],
    stock: 10,
    imageUrl: '',
    status: 'active',
  },
  {
    id: 'prod-020',
    name: 'กล่องจูน Stage 2 Pop & Bang (ท่อตดเสียงลั่นๆ)',
    brand: 'Honda Tuning Custom',
    category: 'ecu',
    price: 25000,
    description: 'กล่องจูน ECU Remap Stage 2 + Pop & Bang Map เสียงระเบิดท่อตดลั่นๆ ตอนปล่อยคันเร่ง ดังสุดเท่ เหมาะคนชอบเสียงแรง มาพร้อมโหมด Anti-Lag',
    compatibleGens: ['gen10', 'gen11'],
    compatibleModels: ['Civic FC 1.5T', 'Civic FK8 Type R', 'Civic FE 1.5T', 'Civic FL5 Type R'],
    stock: 5,
    imageUrl: '',
    status: 'active',
  },

  // ===== อื่นๆ =====
  {
    id: 'prod-021',
    name: 'กรองอากาศ K&N Drop-in Filter',
    brand: 'K&N',
    category: 'other',
    price: 3500,
    description: 'กรองอากาศ K&N แบบ Drop-in ใส่แทนกรองเดิมได้เลย เพิ่ม Air Flow ล้างทำความสะอาดได้ ใช้งานได้ตลอดอายุรถ',
    compatibleGens: ['gen8', 'gen9', 'gen10', 'gen11'],
    compatibleModels: ['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE'],
    stock: 30,
    imageUrl: '',
    status: 'active',
  },
  {
    id: 'prod-022',
    name: 'Strut Bar หน้า-หลัง Ultra Racing',
    brand: 'Ultra Racing',
    category: 'other',
    price: 5500,
    description: 'Strut Bar Ultra Racing หน้า+หลัง เสริมความแข็งแกร่งตัวถัง ลดอาการโย้ตัวเข้าโค้ง อลูมิเนียมน้ำหนักเบา',
    compatibleGens: ['gen8', 'gen9', 'gen10', 'gen11'],
    compatibleModels: ['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE'],
    stock: 12,
    imageUrl: '',
    status: 'active',
  },
  {
    id: 'prod-023',
    name: 'กันชนหน้า Type R FB Style สำหรับ Gen 9',
    brand: 'Type R',
    category: 'bumper',
    price: 13500,
    description: 'กันชนหน้าทรง Type R สำหรับ Civic FB Gen 9 วัสดุ PP พร้อมช่องลม Fog Lamp สเปคญี่ปุ่น',
    compatibleGens: ['gen9'],
    compatibleModels: ['Civic FB'],
    stock: 5,
    imageUrl: '',
    status: 'active',
  },
  {
    id: 'prod-024',
    name: 'กันชนหลัง Type R FD2 Style สำหรับ Gen 8',
    brand: 'Type R',
    category: 'bumper',
    price: 11500,
    description: 'กันชนหลัง Type R FD2 วัสดุ PP+FRP สำหรับ Civic FD Gen 8 พร้อม Diffuser คู่',
    compatibleGens: ['gen8'],
    compatibleModels: ['Civic FD'],
    stock: 4,
    imageUrl: '',
    status: 'active',
  },
];

// ===== TIME SLOTS =====
export const TIME_SLOTS = [
  '09:00 - 11:00',
  '11:00 - 13:00',
  '13:30 - 15:30',
  '15:30 - 17:30',
];

// ===== SERVICE TYPES =====
export const SERVICE_TYPES = [
  { id: 'bumper_install', name: 'ติดตั้งกันชนหน้า-หลัง', minLevel: 'general', estimatedHours: 3, price: 3500 },
  { id: 'exhaust_install', name: 'ติดตั้งท่อไอเสียระบบเต็ม', minLevel: 'general', estimatedHours: 4, price: 4500 },
  { id: 'suspension_install', name: 'ติดตั้ง/เซ็ตโช้ค+ช่วงล่าง', minLevel: 'master', estimatedHours: 5, price: 5000 },
  { id: 'brake_install', name: 'ติดตั้ง Big Brake Kit', minLevel: 'master', estimatedHours: 4, price: 5500 },
  { id: 'wheel_install', name: 'เปลี่ยนล้อ+ตั้งศูนย์ถ่วง', minLevel: 'general', estimatedHours: 2, price: 2000 },
  { id: 'spoiler_install', name: 'ติดตั้งสปอยเลอร์', minLevel: 'apprentice', estimatedHours: 1, price: 1500 },
  { id: 'ecu_tune', name: 'จูน ECU Remap บนไดโน่', minLevel: 'master', estimatedHours: 6, price: 8000 },
  { id: 'oil_change', name: 'เปลี่ยนน้ำมันเครื่อง+กรอง', minLevel: 'apprentice', estimatedHours: 1, price: 800 },
  { id: 'basic_inspection', name: 'เช็คสภาพรถเบื้องต้น', minLevel: 'apprentice', estimatedHours: 1, price: 500 },
  { id: 'full_service', name: 'เซอร์วิสครบรอบ (Full Service)', minLevel: 'general', estimatedHours: 4, price: 3500 },
];

// ===== HELPER: Generate unique ID =====
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
};

// ===== DATABASE HELPER FUNCTIONS =====
// These simulate Supabase operations: SELECT, INSERT, UPDATE, DELETE

/**
 * Get data from localStorage (simulates Supabase .select())
 */
export const dbSelect = (tableName) => {
  try {
    const data = localStorage.getItem(`honda_db_${tableName}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

/**
 * Set data to localStorage (simulates Supabase .insert() / .upsert())
 */
export const dbInsert = (tableName, records) => {
  try {
    const existing = dbSelect(tableName) || [];
    const newData = Array.isArray(records) ? records : [records];
    const combined = [...existing, ...newData];
    localStorage.setItem(`honda_db_${tableName}`, JSON.stringify(combined));
    return { data: newData, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

/**
 * Update a record by ID (simulates Supabase .update().eq('id', id))
 */
export const dbUpdate = (tableName, id, updates) => {
  try {
    const existing = dbSelect(tableName) || [];
    const updated = existing.map(item =>
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    );
    localStorage.setItem(`honda_db_${tableName}`, JSON.stringify(updated));
    return { data: updated.find(i => i.id === id), error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

/**
 * Delete a record by ID (simulates Supabase .delete().eq('id', id))
 */
export const dbDelete = (tableName, id) => {
  try {
    const existing = dbSelect(tableName) || [];
    const filtered = existing.filter(item => item.id !== id);
    localStorage.setItem(`honda_db_${tableName}`, JSON.stringify(filtered));
    return { data: { id }, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

/**
 * Replace entire table data (simulates Supabase full table reset)
 */
export const dbSetAll = (tableName, data) => {
  try {
    localStorage.setItem(`honda_db_${tableName}`, JSON.stringify(data));
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

/**
 * Initialize the database with default data if empty
 */
export const initializeDatabase = () => {
  // Products table
  if (!dbSelect('products')) {
    dbSetAll('products', INITIAL_PRODUCTS);
  }

  // Orders table
  if (!dbSelect('orders')) {
    dbSetAll('orders', []);
  }

  // Bookings table
  if (!dbSelect('bookings')) {
    dbSetAll('bookings', []);
  }

  // Purchase checklist
  if (!dbSelect('purchase_checklist')) {
    dbSetAll('purchase_checklist', []);
  }

  // Mechanics
  if (!dbSelect('mechanics')) {
    dbSetAll('mechanics', MECHANICS);
  }

  console.log('[Honda DB] ✅ Mock database initialized successfully');
};
