-- ==============================================================================
-- HONDA TUNING SHOP — DATABASE SCHEMA & INITIAL PARTS (POSTGRESQL / SUPABASE)
-- Civic Generation 8 - 11 (FD, FB, FC, FK, FE, FL5)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    category VARCHAR(50) NOT NULL, -- 'bumper', 'exhaust', 'suspension', 'brake', 'wheel', 'spoiler', 'ecu', 'other'
    price NUMERIC(12, 2) NOT NULL,
    description TEXT,
    compatible_gens TEXT[] NOT NULL DEFAULT '{}', -- e.g. ARRAY['gen8', 'gen9', 'gen10', 'gen11']
    compatible_models TEXT[] NOT NULL DEFAULT '{}', -- e.g. ARRAY['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE']
    stock INT NOT NULL DEFAULT 0,
    image_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'preorder'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MECHANICS TABLE
CREATE TABLE IF NOT EXISTS mechanics (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'master', 'general', 'apprentice'
    role_label VARCHAR(100) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    avatar TEXT,
    color VARCHAR(20),
    level INT NOT NULL DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BOOKINGS TABLE (จองคิวช่าง & เซอร์วิส)
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    car_model VARCHAR(100) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    note TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending', -- 'pending', 'assigned', 'in_progress', 'completed', 'cancelled'
    mechanic_id VARCHAR(64) REFERENCES mechanics(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ORDERS TABLE (คำสั่งซื้อสินค้า)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    shipping_address JSONB,
    slip_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'verified', 'shipping', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PURCHASE CHECKLIST TABLE (เช็คลิสต์ของแต่งที่ซื้อ & ให้ช่างติดตั้ง)
CREATE TABLE IF NOT EXISTS purchase_checklist (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    brand VARCHAR(100),
    quantity INT NOT NULL DEFAULT 1,
    price NUMERIC(12, 2) NOT NULL,
    checked BOOLEAN NOT NULL DEFAULT FALSE,
    installed_by VARCHAR(64) REFERENCES mechanics(id) ON DELETE SET NULL,
    installed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- INITIAL DATA: MECHANICS
-- ==============================================================================
INSERT INTO mechanics (id, name, role, role_label, specialty, avatar, color, level, description)
VALUES
  ('mech-001', 'ช่างใหญ่ (Master Tuner)', 'master', 'ช่างใหญ่ / หัวหน้าช่าง', 'Dyno Remap, Turbo Setup, ช่วงล่าง Race Spec', '👨‍🔧', '#EF4444', 3, 'ประสบการณ์ 15+ ปี จูนเครื่อง Honda VTEC & Turbo แชมป์ Drag 402m 3 สมัย'),
  ('mech-002', 'ช่างเอก (General Mechanic)', 'general', 'ช่างทั่วไป', 'ติดตั้งท่อ, กันชน, ล้อ, เบรค Big Brake Kit', '🛠️', '#3B82F6', 2, 'ช่างชำนาญการติดตั้งงานตัวถัง ท่อไอเสีย และระบบเบรคความเร็วสูง 8+ ปี'),
  ('mech-003', 'ช่างโจ (Apprentice)', 'apprentice', 'ช่างฝึกหัด', 'ถ่ายน้ำมันเครื่อง, สปอยเลอร์, เช็คระยะ, ซ่อมบำรุง', '🧑‍🎓', '#10B981', 1, 'กำลังฝึกงานด้านระบบรองรับและงานประกอบภายนอก ภายใต้การดูแลของช่างใหญ่')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- INITIAL DATA: HONDA CIVIC TUNING PARTS (GEN 8 - GEN 11)
-- FD (Gen 8) | FB (Gen 9) | FC/FK (Gen 10) | FE/FL5 (Gen 11)
-- ==============================================================================

-- 1. กันชนหน้า-หลัง Type R FL5
INSERT INTO products (id, name, brand, category, price, description, compatible_gens, compatible_models, stock, image_url, status)
VALUES
(
  'prod-001',
  'กันชนหน้า Type R FL5 Style',
  'Type R',
  'bumper',
  18900.00,
  'กันชนหน้าดีไซน์ Honda Civic Type R (FL5) พร้อมกระจังหน้าลายรังผึ้ง ลิ้นหน้าดำเงา ช่องดักลมระบายความร้อนเบรคแท้ วัสดุ PP เกรดพรีเมียม เข้ารูป 100%',
  ARRAY['gen11'],
  ARRAY['Civic FE', 'Civic FL'],
  8,
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
  'active'
),
(
  'prod-002',
  'กันชนหลัง Type R FL5 Style พร้อม Diffuser',
  'Type R',
  'bumper',
  16500.00,
  'กันชนหลัง Type R FL5 พร้อม Diffuser ท่อ 3 ออกกลาง วัสดุ PP ทนทาน แข็งแรง ติดตั้งเข้ารูปเป๊ะ ไม่ต้องแปลงตัวถัง',
  ARRAY['gen11'],
  ARRAY['Civic FE', 'Civic FL'],
  6,
  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
  'active'
),

-- 2. กันชน Type R สำหรับ Gen อื่น (FD2, FB, FK8)
(
  'prod-003',
  'กันชนหน้า Type R FD2 Style สำหรับ Civic Gen 8',
  'Type R',
  'bumper',
  12500.00,
  'กันชนหน้า Type R FD2 ในตำนาน สำหรับ Civic FD Gen 8 วัสดุพลาสติก PP ฉีดขึ้นรูป พร้อมช่องดักลมแท้',
  ARRAY['gen8'],
  ARRAY['Civic FD'],
  10,
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
  'active'
),
(
  'prod-004',
  'กันชนหลัง Type R FD2 Style พร้อม Diffuser สำหรับ Gen 8',
  'Type R',
  'bumper',
  11500.00,
  'กันชนหลัง Type R FD2 วัสดุ PP สำหรับ Civic FD Gen 8 เข้ารูปเนียนตา พร้อมจุดยึดไฟเบรคดวงที่สาม',
  ARRAY['gen8'],
  ARRAY['Civic FD'],
  5,
  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
  'active'
),
(
  'prod-005',
  'กันชนหน้า Type R FB Style สำหรับ Civic Gen 9',
  'Type R',
  'bumper',
  13500.00,
  'กันชนหน้าทรง Type R สเปคญี่ปุ่นสำหรับ Civic FB Gen 9 วัสดุ PP พร้อมช่อง Fog Lamp สปอร์ตดุดัน',
  ARRAY['gen9'],
  ARRAY['Civic FB'],
  7,
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
  'active'
),
(
  'prod-006',
  'ชุดกันชนหน้า-หลัง FK8 Type R Style สำหรับ Civic Gen 10',
  'Type R',
  'bumper',
  28000.00,
  'ชุดกันชนหน้า + กันชนหลัง FK8 Type R วัสดุ PP แท้ พร้อมท่อคาร์บอน Diffuser และคิ้วข้างสำหรับ Civic FC/FK',
  ARRAY['gen10'],
  ARRAY['Civic FC', 'Civic FK'],
  4,
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
  'active'
),

-- 3. ท่อไอเสีย Prodrager & JTC Titanium
(
  'prod-007',
  'ท่อไอเสีย Prodrager Monster Full System',
  'Prodrager',
  'exhaust',
  24500.00,
  'ชุดท่อไอเสีย Prodrager สแตนเลส 304 ดัดเข้ารูปด้วย CNC ไส้ตรงสูตร VTEC ให้เสียงทุ้มแน่น รอบปลายไหลลื่น ไม่รอรอบ',
  ARRAY['gen8', 'gen9', 'gen10', 'gen11'],
  ARRAY['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE'],
  12,
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  'active'
),
(
  'prod-008',
  'ท่อไอเสีย JTC Titanium Full Exhaust System',
  'JTC Titanium',
  'exhaust',
  42000.00,
  'ชุดท่อ JTC Titanium แท้เกรดอากาศยานทั้งเส้น น้ำหนักเบากว่าท่อเดิม 65% ปลายท่อสีรุ้งไทเทเนียมแท้ ให้เสียงแผดหวานสไตล์รถแข่ง',
  ARRAY['gen10', 'gen11'],
  ARRAY['Civic FC 1.5T', 'Civic FK', 'Civic FE 1.5T', 'Civic FL5'],
  5,
  'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80',
  'active'
),

-- 4. โช้คอัพ Profender & H.Drive Spec S
(
  'prod-009',
  'โช้คอัพ Profender FITz สตรัทปรับเกลียว 16 ระดับ',
  'Profender',
  'suspension',
  29900.00,
  'โช้คสตรัทปรับเกลียว Profender FITz สำหรับ Civic ปรับนุ่ม-หนึบได้ 16 ระดับ สปริงสั่งทำพิเศษ นุ่มนวลซับแรงกระแทกเยี่ยม หนึบแน่นไม่โคลง',
  ARRAY['gen8', 'gen9', 'gen10', 'gen11'],
  ARRAY['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE'],
  15,
  'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
  'active'
),
(
  'prod-010',
  'โช้คอัพ Profender Queen Series (โมโนทูบปรับ 16 ระดับ)',
  'Profender',
  'suspension',
  35900.00,
  'รุ่นท็อป Monotube ปรับความหนืด Rebound & Compression 16 ระดับ รองรับการขับขี่ความเร็วสูงและลงสนามแข่ง Track Day',
  ARRAY['gen10', 'gen11'],
  ARRAY['Civic FC', 'Civic FK', 'Civic FE'],
  8,
  'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
  'active'
),
(
  'prod-011',
  'โช้คอัพ H.Drive Spec S ปรับ 32 ระดับ',
  'H.Drive',
  'suspension',
  32500.00,
  'สตรัทปรับเกลียว H.Drive Spec S ยอดนิยม ปรับแข็ง-อ่อนได้ละเอียด 32 ระดับ สไลด์กระบอก ปรับความสูงได้โดยไม่เสียระยะยุบของสปริง',
  ARRAY['gen8', 'gen9', 'gen10', 'gen11'],
  ARRAY['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE'],
  10,
  'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
  'active'
),

-- 5. ชุดเบรค Brembo & Endless
(
  'prod-012',
  'ชุดเบรค Brembo 17Z (6-Pot) พร้อมจาน 355mm',
  'Brembo',
  'brake',
  38500.00,
  'ชุดคาลิปเปอร์ Brembo 17Z 6-Pot แท้บิวด์ใหม่ พร้อมจานขยายฮับอลูมิเนียมขนาด 355mm ผ้าเบรคเกรดซิ่ง สายถักสแตนเลส ครบชุดพร้อมติดตั้ง',
  ARRAY['gen8', 'gen9', 'gen10', 'gen11'],
  ARRAY['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE'],
  6,
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  'active'
),
(
  'prod-013',
  'ชุดเบรค Brembo 18Z (6-Pot Big Rotor 380mm)',
  'Brembo',
  'brake',
  46500.00,
  'Brembo 18Z ลูกสูบใหญ่ 6-Pot คู่หน้า พร้อมจานสองชิ้น Floating Rotor 380mm เบรคอยู่สั่งได้ทุกความเร็ว เหมาะกับล้อ 18-19 นิ้ว',
  ARRAY['gen10', 'gen11'],
  ARRAY['Civic FC', 'Civic FK', 'Civic FE', 'Civic FL5'],
  4,
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  'active'
),
(
  'prod-014',
  'ชุดเบรค Brembo GT Monobloc แท้ (Italian Genuine)',
  'Brembo',
  'brake',
  89000.00,
  'Brembo GT แท้เบิกศูนย์อิตาลี คาลิปเปอร์ Monobloc หล่อขึ้นรูปชิ้นเดียว จานแท้ Type 3 หมุดสองชิ้น ประกันศูนย์ Brembo Thailand 2 ปี',
  ARRAY['gen10', 'gen11'],
  ARRAY['Civic FC', 'Civic FK', 'Civic FE', 'Civic FL5'],
  2,
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  'active'
),
(
  'prod-015',
  'ชุดเบรค Endless EC470 4-Pot แท้ Japan พร้อมจาน 332mm',
  'Endless',
  'brake',
  75000.00,
  'Endless สีน้ำเงิน Anodized แท้ Made in Japan พร้อมผ้าเบรค Endless MX72 ทนความร้อนสูง 700 องศา น้ำหนักเบา ทนทาน เบรคแน่นดูดเท้า',
  ARRAY['gen8', 'gen9', 'gen10', 'gen11'],
  ARRAY['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE'],
  3,
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  'active'
),

-- 6. ล้อแม็กซ์ ลายเท่ๆ (Vage VF, Lenso)
(
  'prod-016',
  'ล้อแม็กซ์ VAGE VF-Series Flow Forming 18x8.5 ET35',
  'VAGE Wheels',
  'wheel',
  28000.00,
  'ล้อแม็กซ์ Flow Forming แบรนด์ VAGE เบาเพียง 8.2 kg/วง ก้านยกหลบเบรคใหญ่ Brembo/Endless ได้สบาย สี Satin Gunmetal สปอร์ตดุดัน 5H114.3',
  ARRAY['gen8', 'gen9', 'gen10', 'gen11'],
  ARRAY['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE', 'Civic FL5'],
  8,
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
  'active'
),
(
  'prod-017',
  'ล้อแม็กซ์ Lenso Venom 5 Lightweight 18x8.5 ET38',
  'Lenso',
  'wheel',
  24500.00,
  'ล้อ Lenso Venom 5 ลาย 5 ก้านยอดฮิต เทคโนโลยี Flow Forming แข็งแกร่งผ่านมาตรฐาน JWL/VIA รับประกันโครงสร้าง 10 ปีเต็ม',
  ARRAY['gen8', 'gen9', 'gen10', 'gen11'],
  ARRAY['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE'],
  12,
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
  'active'
),

-- 7. สปอยเลอร์ G82 & ADRO Carbon
(
  'prod-018',
  'สปอยเลอร์ G82 Style (สีดำเงา Piano Black)',
  'G82 Aero',
  'spoiler',
  8900.00,
  'สปอยเลอร์ทรง G82 ดีไซน์ยกขาสูง ทรงปีกนก สีดำเงา Gloss Piano Black พ่นอบสี 2K เข้ารูปฝาท้าย Civic สวยหรูสปอร์ต',
  ARRAY['gen10', 'gen11'],
  ARRAY['Civic FC', 'Civic FE'],
  9,
  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
  'active'
),
(
  'prod-019',
  'สปอยเลอร์ G82 Style (Prepreg Carbon แท้)',
  'G82 Aero',
  'spoiler',
  15900.00,
  'สปอยเลอร์ทรง G82 คาร์บอนแท้ Prepreg Carbon น้ำหนักเบา ลายคาร์บอน 2x2 คมชัด เคลือบ UV ชัดเจน ของแท้ไม่ใช่สติ๊กเกอร์หรือฟิล์มน้ำ',
  ARRAY['gen10', 'gen11'],
  ARRAY['Civic FC', 'Civic FE'],
  6,
  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
  'active'
),
(
  'prod-020',
  'สปอยเลอร์ ADRO Carbon Prepreg Duckbill แท้',
  'ADRO',
  'spoiler',
  22500.00,
  'สปอยเลอร์ ADRO แท้ คาร์บอนไฟเบอร์ Prepreg แบบ Duckbill ตูดเป็ดแนบสนิท ลู่ลม Aerodynamic สูงสุด ดีไซน์เรียบหรูระดับซูเปอร์คาร์',
  ARRAY['gen11'],
  ARRAY['Civic FE', 'Civic FL'],
  4,
  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
  'active'
),

-- 8. กล่องจูน ECU Remap (แรงจริงเสียงเงียบ & Pop&Bang ลั่นๆ)
(
  'prod-021',
  'กล่องจูน ECU Remap Stage 1 (เอาแรงจริง เสียงไม่รบกวน)',
  'Honda Tuning Custom',
  'ecu',
  18000.00,
  'จูน ECU Remap Stage 1 เน้นแรงม้าและแรงบิดใช้งานประจำวัน เพิ่ม +30HP / +65Nm เสียงเงียบเหมือนเดิมไม่รบกวนเพื่อนบ้าน ประหยัดน้ำมันยามขับชิลล์',
  ARRAY['gen10', 'gen11'],
  ARRAY['Civic FC 1.5T', 'Civic FE 1.5T'],
  20,
  'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
  'active'
),
(
  'prod-022',
  'กล่องจูน ECU Remap Stage 2 Pop & Bang (ท่อตดเสียงลั่นๆ)',
  'Honda Tuning Custom',
  'ecu',
  25000.00,
  'จูน Stage 2 เต็มระบบ ปรับบูสต์เทอร์โบ 1.5 บาร์ + Map Pop & Bang ท่อตดไฟออกท่อลั่นสะใจตอนยกคันเร่ง พร้อมฟังก์ชัน Anti-Lag ออกตัวเปิดรอบลั่นสนาม',
  ARRAY['gen10', 'gen11'],
  ARRAY['Civic FC 1.5T', 'Civic FK8 Type R', 'Civic FE 1.5T', 'Civic FL5 Type R'],
  15,
  'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
  'active'
),

-- 9. อื่นๆ (Strut Bar, กรองอากาศ K&N)
(
  'prod-023',
  'กรองอากาศ K&N High-Flow Drop-in แท้ USA',
  'K&N',
  'other',
  3500.00,
  'กรองอากาศผ้าล้างได้ เคลือบน้ำมันพิเศษ เพิ่มอัตราการไหลเวียนของอากาศ ประหยัดน้ำมัน ตอบสนองคันเร่งได้ไวยิ่งขึ้น รับประกัน 1,000,000 ไมล์',
  ARRAY['gen8', 'gen9', 'gen10', 'gen11'],
  ARRAY['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE'],
  30,
  'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
  'active'
),
(
  'prod-024',
  'ค้ำโช้คหน้า Ultra Racing หน้า-หลัง เสริมความแกร่ง',
  'Ultra Racing',
  'other',
  5500.00,
  'ค้ำโช้ค Ultra Racing อลูมิเนียมเกรดแข็งพิเศษ ช่วยลดการบิดตัวของแชสซีส์ เข้าโค้งนิ่งขึ้น พวงมาลัยแม่นยำขึ้นชัดเจน',
  ARRAY['gen8', 'gen9', 'gen10', 'gen11'],
  ARRAY['Civic FD', 'Civic FB', 'Civic FC', 'Civic FE'],
  12,
  'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  compatible_gens = EXCLUDED.compatible_gens,
  compatible_models = EXCLUDED.compatible_models,
  stock = EXCLUDED.stock,
  updated_at = NOW();

-- ==============================================================================
-- SAMPLE QUERIES (ตัวอย่างคำสั่ง SELECT สำหรับใช้งานจริง)
-- ==============================================================================

-- 1. ดูอะไหล่ทั้งหมดที่ใส่กับ Civic FE Gen 11 ได้
-- SELECT * FROM products WHERE 'gen11' = ANY(compatible_gens);

-- 2. ดูอะไหล่ตามหมวดหมู่ เช่น กล่องจูน หรือ เบรค
-- SELECT * FROM products WHERE category IN ('ecu', 'brake');

-- 3. คำสั่ง INSERT เพิ่มสินค้าแต่งชิ้นใหม่
-- INSERT INTO products (id, name, brand, category, price, description, compatible_gens, compatible_models, stock)
-- VALUES ('prod-custom-01', 'ปีกนกหลังซิ่ง Hardrace', 'Hardrace', 'suspension', 14500, 'ปีกนกอลูมิเนียมปรับแคมเบอร์ได้', ARRAY['gen10', 'gen11'], ARRAY['Civic FC', 'Civic FE'], 5);
