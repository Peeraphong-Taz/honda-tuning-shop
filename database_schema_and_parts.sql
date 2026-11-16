-- ==============================================================================
-- HONDA TUNING SHOP — SUPABASE SCHEMA, SECURITY (RLS) & SEED DATA
-- Civic Generation 8 - 11 (FD, FB, FC, FK, FE, FL5)
--
-- วิธีใช้: เปิด Supabase Dashboard → SQL Editor → วางไฟล์นี้ทั้งไฟล์ → Run
-- รันซ้ำได้ (idempotent) ไม่ลบข้อมูลเดิม
-- ==============================================================================

-- ==============================================================================
-- 1. TABLES
-- ==============================================================================

-- 1.1 PROFILES (ผูกกับ Supabase Auth — 1 แถวต่อผู้ใช้ 1 คน)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(30),
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'mechanic', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    category VARCHAR(50) NOT NULL, -- 'bumper', 'exhaust', 'suspension', 'brake', 'wheel', 'spoiler', 'ecu', 'other'
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    description TEXT,
    compatible_gens TEXT[] NOT NULL DEFAULT '{}',
    compatible_models TEXT[] NOT NULL DEFAULT '{}',
    stock INT NOT NULL DEFAULT 0,
    image_url TEXT, -- ว่างไว้ได้ เว็บจะแสดงรูปตามหมวดหมู่แทน
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'preorder'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3 MECHANICS (โครงสร้างตรงกับหน้าเว็บ)
CREATE TABLE IF NOT EXISTS public.mechanics (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    nickname VARCHAR(100),
    role VARCHAR(50) NOT NULL, -- 'master', 'general', 'apprentice'
    role_label VARCHAR(100) NOT NULL,
    description TEXT,
    specialties TEXT[] NOT NULL DEFAULT '{}',
    experience VARCHAR(50),
    avatar TEXT,
    color VARCHAR(20),
    available BOOLEAN NOT NULL DEFAULT TRUE,
    max_jobs_per_day INT NOT NULL DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- สร้างตารางเวอร์ชันเก่าไว้แล้ว? เพิ่มคอลัมน์ที่ขาดให้
ALTER TABLE public.mechanics ADD COLUMN IF NOT EXISTS nickname VARCHAR(100);
ALTER TABLE public.mechanics ADD COLUMN IF NOT EXISTS specialties TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE public.mechanics ADD COLUMN IF NOT EXISTS experience VARCHAR(50);
ALTER TABLE public.mechanics ADD COLUMN IF NOT EXISTS available BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.mechanics ADD COLUMN IF NOT EXISTS max_jobs_per_day INT NOT NULL DEFAULT 3;
DO $$
BEGIN
  -- คอลัมน์จากสคีมาเวอร์ชันเก่า: ไม่ใช้แล้ว ปลด NOT NULL ออก
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mechanics' AND column_name = 'specialty') THEN
    ALTER TABLE public.mechanics ALTER COLUMN specialty DROP NOT NULL;
  END IF;
END $$;

-- 1.4 BOOKINGS (จองคิวช่าง & เซอร์วิส)
CREATE TABLE IF NOT EXISTS public.bookings (
    id VARCHAR(64) PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL = ลูกค้าไม่ได้ล็อกอิน
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    car_model VARCHAR(100) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    note TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending', -- 'pending', 'assigned', 'in_progress', 'completed', 'cancelled'
    mechanic_id VARCHAR(64) REFERENCES public.mechanics(id) ON DELETE SET NULL,
    intake_checklist JSONB, -- เช็คลิสต์ตรวจสภาพรถก่อนรับงาน
    intake_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS intake_checklist JSONB;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS intake_at TIMESTAMPTZ;

-- 1.5 ORDERS (คำสั่งซื้อสินค้า)
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(64) PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL = สั่งแบบ guest
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    items JSONB NOT NULL DEFAULT '[]', -- [{productId, name, category, brand, price, quantity, imageUrl}]
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    shipping_address JSONB,
    slip_url TEXT, -- path ใน storage bucket 'payment-slips'
    status VARCHAR(30) NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'verified', 'shipping', 'completed', 'cancelled'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items JSONB NOT NULL DEFAULT '[]';

-- 1.6 PURCHASE CHECKLIST (เช็คลิสต์ของแต่งที่ซื้อ & ให้ช่างติดตั้ง)
-- สร้างอัตโนมัติจาก trigger ตอนมีออเดอร์ใหม่ (ไม่ต้อง insert จากหน้าเว็บ)
CREATE TABLE IF NOT EXISTS public.purchase_checklist (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES public.products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    brand VARCHAR(100),
    quantity INT NOT NULL DEFAULT 1,
    price NUMERIC(12, 2) NOT NULL,
    checked BOOLEAN NOT NULL DEFAULT FALSE,
    installed_by VARCHAR(64) REFERENCES public.mechanics(id) ON DELETE SET NULL,
    installed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mechanic ON public.bookings(mechanic_id);
CREATE INDEX IF NOT EXISTS idx_checklist_order ON public.purchase_checklist(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- ==============================================================================
-- 2. HELPER FUNCTIONS & TRIGGERS
-- ==============================================================================

-- 2.1 เช็ค role ของผู้ใช้ปัจจุบัน (SECURITY DEFINER เพื่อไม่ให้ติด RLS วนซ้ำ)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'mechanic'));
$$;

-- 2.2 อัปเดต updated_at อัตโนมัติ
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated ON public.profiles;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS trg_products_updated ON public.products;
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS trg_bookings_updated ON public.bookings;
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS trg_orders_updated ON public.orders;
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2.3 สมัครสมาชิกใหม่ → สร้าง profile อัตโนมัติ (role = customer เสมอ)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2.4 กันไม่ให้ผู้ใช้เปลี่ยน role ตัวเอง (เปลี่ยนได้เฉพาะแอดมิน หรือผ่าน SQL Editor)
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'ไม่มีสิทธิ์เปลี่ยน role';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- 2.5 ออเดอร์ใหม่: คำนวณราคาจากตาราง products จริง (กันลูกค้าแก้ราคาเอง)
CREATE OR REPLACE FUNCTION public.prepare_new_order()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  fixed_items JSONB := '[]'::jsonb;
  item JSONB;
  p RECORD;
  qty INT;
  total NUMERIC(12, 2) := 0;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(COALESCE(NEW.items, '[]'::jsonb)) LOOP
    SELECT id, name, category, brand, price, image_url INTO p
      FROM public.products WHERE id = item->>'productId';
    IF NOT FOUND THEN
      RAISE EXCEPTION 'ไม่พบสินค้า %', item->>'productId';
    END IF;
    qty := GREATEST(COALESCE((item->>'quantity')::int, 1), 1);
    total := total + p.price * qty;
    fixed_items := fixed_items || jsonb_build_object(
      'productId', p.id, 'name', p.name, 'category', p.category, 'brand', p.brand,
      'price', p.price, 'quantity', qty, 'imageUrl', p.image_url
    );
  END LOOP;

  NEW.items := fixed_items;
  NEW.total_amount := total;
  NEW.status := 'pending';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prepare_new_order ON public.orders;
CREATE TRIGGER trg_prepare_new_order BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.prepare_new_order();

-- 2.6 ออเดอร์ใหม่: สร้างรายการเช็คลิสต์ติดตั้งให้ช่างอัตโนมัติ
CREATE OR REPLACE FUNCTION public.create_order_checklist()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  item JSONB;
  n INT := 0;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(NEW.items) LOOP
    n := n + 1;
    INSERT INTO public.purchase_checklist (id, order_id, product_id, product_name, category, brand, quantity, price)
    VALUES (
      NEW.id || '-chk-' || n,
      NEW.id,
      item->>'productId',
      item->>'name',
      item->>'category',
      item->>'brand',
      (item->>'quantity')::int,
      (item->>'price')::numeric
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_create_order_checklist ON public.orders;
CREATE TRIGGER trg_create_order_checklist AFTER INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.create_order_checklist();

-- 2.7 การจองใหม่: บังคับสถานะเริ่มต้น (กันลูกค้าส่งสถานะ/ช่างมาเอง)
CREATE OR REPLACE FUNCTION public.prepare_new_booking()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NOT public.is_staff() THEN
    NEW.status := 'pending';
    NEW.mechanic_id := NULL;
    NEW.intake_checklist := NULL;
    NEW.intake_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prepare_new_booking ON public.bookings;
CREATE TRIGGER trg_prepare_new_booking BEFORE INSERT ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.prepare_new_booking();

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (สำคัญมาก — กันคนอื่นอ่าน/แก้ข้อมูลผ่าน anon key)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mechanics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_checklist ENABLE ROW LEVEL SECURITY;

-- PROFILES: เห็น/แก้ของตัวเอง, staff เห็นทั้งหมด, admin แก้ได้ทั้งหมด
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.is_staff());
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());

-- PRODUCTS: ทุกคนดูได้, admin เท่านั้นที่เพิ่ม/แก้/ลบ
DROP POLICY IF EXISTS "products_select" ON public.products;
CREATE POLICY "products_select" ON public.products FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "products_admin_write" ON public.products;
CREATE POLICY "products_admin_write" ON public.products FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- MECHANICS: ทุกคนดูได้, admin แก้ได้
DROP POLICY IF EXISTS "mechanics_select" ON public.mechanics;
CREATE POLICY "mechanics_select" ON public.mechanics FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "mechanics_admin_write" ON public.mechanics;
CREATE POLICY "mechanics_admin_write" ON public.mechanics FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- BOOKINGS: ใครก็จองได้ (guest ต้อง user_id = NULL), เห็นเฉพาะของตัวเอง, staff จัดการได้
DROP POLICY IF EXISTS "bookings_insert" ON public.bookings;
CREATE POLICY "bookings_insert" ON public.bookings FOR INSERT
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());
DROP POLICY IF EXISTS "bookings_select" ON public.bookings;
CREATE POLICY "bookings_select" ON public.bookings FOR SELECT
  USING (user_id = auth.uid() OR public.is_staff());
DROP POLICY IF EXISTS "bookings_staff_update" ON public.bookings;
CREATE POLICY "bookings_staff_update" ON public.bookings FOR UPDATE
  USING (public.is_staff()) WITH CHECK (public.is_staff());
DROP POLICY IF EXISTS "bookings_admin_delete" ON public.bookings;
CREATE POLICY "bookings_admin_delete" ON public.bookings FOR DELETE
  USING (public.is_admin());

-- ORDERS: ใครก็สั่งได้, เห็นเฉพาะของตัวเอง, admin เปลี่ยนสถานะได้
DROP POLICY IF EXISTS "orders_insert" ON public.orders;
CREATE POLICY "orders_insert" ON public.orders FOR INSERT
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());
DROP POLICY IF EXISTS "orders_select" ON public.orders;
CREATE POLICY "orders_select" ON public.orders FOR SELECT
  USING (user_id = auth.uid() OR public.is_staff());
DROP POLICY IF EXISTS "orders_admin_update" ON public.orders;
CREATE POLICY "orders_admin_update" ON public.orders FOR UPDATE
  USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "orders_admin_delete" ON public.orders;
CREATE POLICY "orders_admin_delete" ON public.orders FOR DELETE
  USING (public.is_admin());

-- PURCHASE CHECKLIST: staff ดู/ติ๊กได้, ลูกค้าดูของออเดอร์ตัวเองได้
DROP POLICY IF EXISTS "checklist_select" ON public.purchase_checklist;
CREATE POLICY "checklist_select" ON public.purchase_checklist FOR SELECT
  USING (
    public.is_staff()
    OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );
DROP POLICY IF EXISTS "checklist_staff_update" ON public.purchase_checklist;
CREATE POLICY "checklist_staff_update" ON public.purchase_checklist FOR UPDATE
  USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ==============================================================================
-- 4. STORAGE BUCKETS (รูปสินค้า & สลิปโอนเงิน)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('product-images', 'product-images', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('payment-slips', 'payment-slips', FALSE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- รูปสินค้า: ทุกคนดูได้ (public bucket), admin เท่านั้นที่อัปโหลด/แก้/ลบ
DROP POLICY IF EXISTS "product_images_admin_insert" ON storage.objects;
CREATE POLICY "product_images_admin_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());
DROP POLICY IF EXISTS "product_images_admin_update" ON storage.objects;
CREATE POLICY "product_images_admin_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin());
DROP POLICY IF EXISTS "product_images_admin_delete" ON storage.objects;
CREATE POLICY "product_images_admin_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());

-- สลิป: ใครก็อัปโหลดได้ (รวม guest) แต่เปิดดูได้เฉพาะ staff
DROP POLICY IF EXISTS "slips_insert" ON storage.objects;
CREATE POLICY "slips_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'payment-slips');
DROP POLICY IF EXISTS "slips_staff_select" ON storage.objects;
CREATE POLICY "slips_staff_select" ON storage.objects FOR SELECT
  USING (bucket_id = 'payment-slips' AND public.is_staff());

-- ==============================================================================
-- 5. INITIAL DATA: MECHANICS
-- ==============================================================================
INSERT INTO public.mechanics (id, name, nickname, role, role_label, description, specialties, experience, avatar, color, available, max_jobs_per_day)
VALUES
  ('mech-001', 'ช่างใหญ่', 'พี่ใหญ่', 'master', 'ช่างหัวหน้า (Master Mechanic)',
   'ทำได้ทุกอย่าง ตั้งแต่จูน ECU, ติดตั้งเทอร์โบ, เซ็ตช่วงล่าง, เปลี่ยนเบรค Big Brake Kit จนถึงงานพ่นสีและชุดแต่งรอบคัน',
   ARRAY['ECU Tuning', 'Turbo Install', 'Suspension Setup', 'Brake Kit', 'Full Body Kit', 'Engine Swap'],
   '15+ ปี', '👨‍🔧', '#DC2626', TRUE, 3),
  ('mech-002', 'ช่างทั่วไป', 'ช่างเบนซ์', 'general', 'ช่างทั่วไป (General Mechanic)',
   'งานติดตั้งทั่วไป เปลี่ยนอะไหล่, ติดตั้งท่อไอเสีย, เปลี่ยนโช้ค, ติดตั้งชุดแต่ง, เปลี่ยนผ้าเบรค และงานเซอร์วิสทั่วไป',
   ARRAY['Exhaust Install', 'Suspension Change', 'Body Kit Install', 'Brake Pad Change', 'General Service'],
   '8 ปี', '🔧', '#3B82F6', TRUE, 5),
  ('mech-003', 'ช่างฝึกหัด', 'น้องเจ', 'apprentice', 'ช่างฝึกหัด (Apprentice)',
   'ดูได้เบื้องต้น เปลี่ยน part ง่ายๆ เช่น เปลี่ยนไฟ, เปลี่ยนกรองอากาศ, เปลี่ยนน้ำมัน, ติดสติ๊กเกอร์ และเช็คสภาพรถเบื้องต้น',
   ARRAY['Oil Change', 'Air Filter', 'Light Bulbs', 'Stickers', 'Basic Inspection'],
   '2 ปี', '🧑‍🔧', '#10B981', TRUE, 8)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, nickname = EXCLUDED.nickname, role = EXCLUDED.role,
  role_label = EXCLUDED.role_label, description = EXCLUDED.description,
  specialties = EXCLUDED.specialties, experience = EXCLUDED.experience,
  avatar = EXCLUDED.avatar, color = EXCLUDED.color,
  available = EXCLUDED.available, max_jobs_per_day = EXCLUDED.max_jobs_per_day;

-- ==============================================================================
-- 6. INITIAL DATA: HONDA CIVIC TUNING PARTS (GEN 8 - GEN 11)
-- FD (Gen 8) | FB (Gen 9) | FC/FK (Gen 10) | FE/FL5 (Gen 11)
-- ==============================================================================

-- 1. กันชนหน้า-หลัง Type R FL5
INSERT INTO public.products (id, name, brand, category, price, description, compatible_gens, compatible_models, stock, image_url, status)
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
  NULL,
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
-- 7. ตั้งค่าบัญชีแอดมิน / ช่าง (ทำหลังสมัครสมาชิกผ่านหน้าเว็บแล้ว)
-- ==============================================================================
-- UPDATE public.profiles SET role = 'admin'    WHERE email = 'อีเมลเจ้าของร้าน';
-- UPDATE public.profiles SET role = 'mechanic' WHERE email = 'อีเมลช่าง';

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
