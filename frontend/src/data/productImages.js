/**
 * รูปประจำหมวดหมู่ — ใช้เมื่อสินค้ายังไม่มีรูปของตัวเอง (image_url ว่าง)
 *
 * ทุกรูปเป็นรถ Honda จาก Unsplash (Unsplash License: ใช้เชิงพาณิชย์ได้ฟรี ไม่ต้องให้เครดิต)
 * และซูมเข้าไปที่ชิ้นส่วนตามหมวด (ท่อ / คาลิปเปอร์ / ปีก / กันชน / ล้อ / ห้องเครื่อง)
 * ด้วยพารามิเตอร์ crop=focalpoint ของ images.unsplash.com (fp-x, fp-y = ตำแหน่ง 0–1, fp-z = ซูม)
 *
 * แอดมินอัปโหลดรูปจริงของสินค้าแต่ละชิ้นได้ในหน้า Admin → จัดการสินค้า
 */

export const HONDA_PHOTOS = {
  fk8WhiteFront: '1572471372724-a7c1c9450c21',  // Civic Type R FK8 สีขาว (ลานจอดมืด)
  fk8WhiteFront2: '1540431657627-415fdd6c3cee', // Civic Type R สีขาว หน้าตรง
  fk8RedFront: '1636915873177-a0c1a48d84eb',    // Civic Type R สีแดง มุมหน้า
  fk8RedRear: '1570303278382-f5e39ff83114',     // Civic Type R สีแดง ท้ายรถ
  fk8RedRear2: '1636915860623-57b9b74133e6',    // Civic Type R สีแดง มุมท้าย
  fk8RedSide: '1636915898510-a9945727edfb',     // Civic Type R สีแดง ด้านข้าง
  fk8Blue: '1742445129873-ccd0af96c60f',        // Civic Type R สีน้ำเงิน
  fdWhiteRear: '1741243633170-eab64ccc4956',    // Civic FD สีขาว ท้ายรถ
  civicRedRims: '1678002239411-d633292ecbc4',   // Civic แต่ง ล้อแดง
  typeRWheel: '1579190796540-e0e57fcd30ae',     // ล้อ Civic Type R + คาลิปเปอร์ Brembo
  ivtecEngine: '1748581653560-14613f080fa6',    // เครื่อง Honda i-VTEC
  typeRBay: '1752774579270-523a9e91e6d4',       // ห้องเครื่อง Honda Type R แต่ง
};

const P = HONDA_PHOTOS;

// [รูป, fp-x, fp-y, ซูม] — ตำแหน่งชิ้นส่วนในแต่ละรูป
const SHOTS = {
  exhaustTypeR: [P.fk8RedRear, 0.895, 0.85, 5],     // ท่อคู่กลาง Type R
  rearBumperTypeR: [P.fk8RedRear, 0.84, 0.74, 2.5], // กันชนหลัง + ดิฟฟิวเซอร์ Type R
  rearBumperFD: [P.fdWhiteRear, 0.40, 0.50, 2.2],   // ท้าย Civic FD
  frontBumperWhite: [P.fk8WhiteFront2, 0.50, 0.65, 1.8],
  frontBumperRed: [P.fk8RedFront, 0.45, 0.60, 2.2],
  frontBumperDark: [P.fk8WhiteFront, 0.32, 0.66, 2],
  wingSide: [P.fk8RedSide, 0.88, 0.53, 3.5],        // ปีกหลัง Type R
  wingRear: [P.fk8RedRear2, 0.47, 0.50, 3],
  brakeBrembo: [P.typeRWheel, 0.18, 0.55, 1.6],     // คาลิปเปอร์ Brembo แดง
  brakeBlue: [P.fk8Blue, 0.46, 0.68, 4],
  wheelRed: [P.civicRedRims, 0.58, 0.60, 4],        // ล้อแม็กสีแดง
  wheelTypeR: [P.typeRWheel, 0.33, 0.58, 1.2],
  stanceBlue: [P.fk8Blue, 0.46, 0.62, 3],           // ซุ้มล้อ/ความสูงช่วงล่าง
  stanceRed: [P.fk8RedSide, 0.42, 0.74, 4],
  engineTypeR: [P.typeRBay, 0.50, 0.55, 1.3],       // ห้องเครื่อง Type R
  engineIvtec: [P.ivtecEngine, 0.50, 0.50, 1],      // ฝาวาล์ว i-VTEC
};

const S = SHOTS;

const CATEGORY_SHOTS = {
  bumper: [S.frontBumperWhite, S.frontBumperRed, S.frontBumperDark],
  bumperRear: [S.rearBumperTypeR],
  exhaust: [S.exhaustTypeR],
  suspension: [S.stanceBlue, S.stanceRed],
  brake: [S.brakeBrembo, S.brakeBlue],
  wheel: [S.wheelRed, S.wheelTypeR],
  spoiler: [S.wingSide, S.wingRear],
  ecu: [S.engineIvtec, S.engineTypeR],
  other: [S.engineTypeR, S.engineIvtec],
};

const shotUrl = ([id, x, y, z], w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=focalpoint` +
  `&fp-x=${x}&fp-y=${y}&fp-z=${z}&w=${w}&h=${Math.round(w * 0.75)}&q=75`;

// ใช้ตัวเลขท้ายรหัสสินค้า (prod-012 → 12) เพื่อวนรูปตามลำดับ สินค้าที่อยู่ติดกันจะได้รูปไม่ซ้ำกัน
const seedNumber = (seed = '') => {
  const digits = String(seed).match(/(\d+)(?!.*\d)/);
  if (digits) return parseInt(digits[1], 10);
  return [...String(seed)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
};

const pickShot = (category, seed, name = '') => {
  const isRear = /หลัง/.test(name) && !/หน้า/.test(name);
  if (category === 'bumper' && isRear) {
    // กันชนหลังสำหรับ Civic FD ใช้รูปท้าย FD จริง
    return /FD|Gen 8/i.test(name) ? S.rearBumperFD : S.rearBumperTypeR;
  }
  const list = CATEGORY_SHOTS[category] || CATEGORY_SHOTS.other;
  return list[seedNumber(seed) % list.length];
};

/** URL รูป Honda เต็มภาพ ตามชื่อใน HONDA_PHOTOS */
export const hondaPhoto = (key, width = 800) =>
  `https://images.unsplash.com/photo-${HONDA_PHOTOS[key]}?auto=format&fit=crop&w=${width}&q=75`;

/** รูปประจำหมวด (seed = รหัสสินค้า เพื่อให้แต่ละชิ้นได้รูปต่างกันแต่คงที่) */
export const getCategoryImage = (category, width, seed = '', name = '') =>
  shotUrl(pickShot(category, seed, name), width);

/** รูปที่จะแสดงของสินค้า: รูปจริงของสินค้าถ้ามี ไม่งั้นใช้รูปประจำหมวด */
export const getProductImage = (product, width) =>
  product?.imageUrl || getCategoryImage(product?.category, width, product?.id, product?.name);

/** รูปประจำหมวดของสินค้า (ใช้ตอนรูปจริงโหลดไม่ได้) */
export const getProductFallbackImage = (product, width) =>
  getCategoryImage(product?.category, width, product?.id, product?.name);
