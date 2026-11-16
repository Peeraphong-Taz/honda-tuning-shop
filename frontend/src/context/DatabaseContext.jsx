import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  initializeDatabase,
  dbSelect,
  dbInsert,
  dbUpdate,
  dbDelete,
  generateId,
  MECHANICS,
  PRODUCT_CATEGORIES,
  CIVIC_GENERATIONS,
  SERVICE_TYPES,
  TIME_SLOTS,
} from '../data/mockDatabase';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { fromDb, fromDbList, toDb } from '../lib/mappers';
import { useAuth } from './AuthContext';

const DatabaseContext = createContext();

const errMsg = (error) => (error ? error.message || String(error) : null);

/**
 * DatabaseProvider
 * ================
 * - ถ้าตั้งค่า Supabase แล้ว (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) → อ่าน/เขียน Supabase จริง
 * - ถ้ายังไม่ตั้งค่า → ใช้ฐานข้อมูลจำลองใน localStorage (โหมด demo)
 *
 * ทุกฟังก์ชันที่เขียนข้อมูลเป็น async และคืนค่า { data, error }
 */
export const DatabaseProvider = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [purchaseChecklist, setPurchaseChecklist] = useState([]);
  const [mechanics, setMechanics] = useState(MECHANICS);
  const [loading, setLoading] = useState(true);

  // ===== LOADERS =====
  const loadProducts = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setProducts(dbSelect('products') || []);
      return;
    }
    const { data, error } = await supabase.from('products').select('*').order('id');
    if (error) console.error('[DB] load products:', error.message);
    else setProducts(fromDbList(data));
  }, []);

  const loadOrders = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setOrders(dbSelect('orders') || []);
      return;
    }
    if (!user) { setOrders([]); return; }
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) console.error('[DB] load orders:', error.message);
    else setOrders(fromDbList(data));
  }, [user]);

  const loadBookings = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setBookings(dbSelect('bookings') || []);
      return;
    }
    if (!user) { setBookings([]); return; }
    const { data, error } = await supabase.from('bookings').select('*').order('date', { ascending: true });
    if (error) console.error('[DB] load bookings:', error.message);
    else setBookings(fromDbList(data));
  }, [user]);

  const loadChecklist = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setPurchaseChecklist(dbSelect('purchase_checklist') || []);
      return;
    }
    if (!user) { setPurchaseChecklist([]); return; }
    const { data, error } = await supabase.from('purchase_checklist').select('*').order('created_at');
    if (error) console.error('[DB] load checklist:', error.message);
    else setPurchaseChecklist(fromDbList(data));
  }, [user]);

  const loadMechanics = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setMechanics(dbSelect('mechanics') || MECHANICS);
      return;
    }
    const { data, error } = await supabase.from('mechanics').select('*').order('id');
    if (error) console.error('[DB] load mechanics:', error.message);
    else if (data?.length) setMechanics(fromDbList(data));
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadProducts(), loadOrders(), loadBookings(), loadChecklist(), loadMechanics()]);
    setLoading(false);
  }, [loadProducts, loadOrders, loadBookings, loadChecklist, loadMechanics]);

  // Initialize on mount + reload private data when the logged-in user changes
  useEffect(() => {
    if (!isSupabaseConfigured) initializeDatabase();
    refreshAll();
  }, [refreshAll]);

  // ===== PRODUCTS =====
  const getProducts = useCallback((filters = {}) => {
    let data = products;
    if (filters.category && filters.category !== 'all') {
      data = data.filter(p => p.category === filters.category);
    }
    if (filters.gen) {
      data = data.filter(p => p.compatibleGens?.includes(filters.gen));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    if (filters.status) {
      data = data.filter(p => p.status === filters.status);
    }
    return data;
  }, [products]);

  const getProductById = useCallback((id) => products.find(p => p.id === id) || null, [products]);

  const addProduct = useCallback(async (productData) => {
    const newProduct = {
      ...productData,
      id: generateId('prod'),
      status: productData.status || 'active',
    };

    if (!isSupabaseConfigured) {
      const result = dbInsert('products', { ...newProduct, createdAt: new Date().toISOString() });
      if (!result.error) await loadProducts();
      return result;
    }

    const { data, error } = await supabase.from('products').insert(toDb('products', newProduct)).select().single();
    if (!error) await loadProducts();
    return { data: fromDb(data), error: errMsg(error) };
  }, [loadProducts]);

  const updateProduct = useCallback(async (id, updates) => {
    if (!isSupabaseConfigured) {
      const result = dbUpdate('products', id, updates);
      if (!result.error) await loadProducts();
      return result;
    }
    const { id: _ignore, ...rest } = updates;
    const { data, error } = await supabase.from('products').update(toDb('products', rest)).eq('id', id).select().single();
    if (!error) await loadProducts();
    return { data: fromDb(data), error: errMsg(error) };
  }, [loadProducts]);

  const deleteProduct = useCallback(async (id) => {
    if (!isSupabaseConfigured) {
      const result = dbDelete('products', id);
      if (!result.error) await loadProducts();
      return result;
    }
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) await loadProducts();
    return { data: { id }, error: errMsg(error) };
  }, [loadProducts]);

  // ===== ORDERS =====
  const createOrder = useCallback(async (orderData) => {
    const newOrder = {
      ...orderData,
      id: generateId('ord'),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    if (!isSupabaseConfigured) {
      const result = dbInsert('orders', newOrder);
      if (!result.error && orderData.items) {
        orderData.items.forEach(item => {
          dbInsert('purchase_checklist', {
            id: generateId('chk'),
            orderId: newOrder.id,
            productId: item.productId || item.id,
            productName: item.name,
            category: item.category,
            brand: item.brand,
            quantity: item.quantity,
            price: item.price,
            checked: false,
            installedBy: null,
            installedAt: null,
            createdAt: new Date().toISOString(),
          });
        });
      }
      await Promise.all([loadOrders(), loadChecklist()]);
      return { data: newOrder, error: result.error };
    }

    // Supabase: ราคา/ยอดรวม และเช็คลิสต์ติดตั้ง คำนวณใหม่ฝั่ง DB ด้วย trigger
    // ไม่ใช้ .select() เพราะลูกค้าที่ไม่ได้ล็อกอินไม่มีสิทธิ์อ่านออเดอร์กลับ
    const row = toDb('orders', { ...newOrder, userId: user?.id || null });
    const { error } = await supabase.from('orders').insert(row);
    if (!error) await Promise.all([loadOrders(), loadChecklist()]);
    return { data: error ? null : newOrder, error: errMsg(error) };
  }, [user, loadOrders, loadChecklist]);

  const updateOrderStatus = useCallback(async (id, status) => {
    if (!isSupabaseConfigured) {
      const result = dbUpdate('orders', id, { status });
      if (!result.error) await loadOrders();
      return result;
    }
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (!error) await loadOrders();
    return { data: { id, status }, error: errMsg(error) };
  }, [loadOrders]);

  // ===== BOOKINGS =====
  const createBooking = useCallback(async (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: generateId('bk'),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    if (!isSupabaseConfigured) {
      const result = dbInsert('bookings', newBooking);
      if (!result.error) await loadBookings();
      return { data: newBooking, error: result.error };
    }

    const row = toDb('bookings', { ...newBooking, userId: user?.id || null });
    const { error } = await supabase.from('bookings').insert(row);
    if (!error) await loadBookings();
    return { data: error ? null : newBooking, error: errMsg(error) };
  }, [user, loadBookings]);

  const updateBooking = useCallback(async (id, updates) => {
    if (!isSupabaseConfigured) {
      const result = dbUpdate('bookings', id, updates);
      if (!result.error) await loadBookings();
      return result;
    }
    const { error } = await supabase.from('bookings').update(toDb('bookings', updates)).eq('id', id);
    if (!error) await loadBookings();
    return { data: { id, ...updates }, error: errMsg(error) };
  }, [loadBookings]);

  const updateBookingStatus = useCallback((id, status) => updateBooking(id, { status }), [updateBooking]);

  const assignMechanic = useCallback(
    (bookingId, mechanicId) => updateBooking(bookingId, { mechanicId, status: 'assigned' }),
    [updateBooking]
  );

  const saveIntakeChecklist = useCallback(
    (bookingId, checklistData) => updateBooking(bookingId, {
      intakeChecklist: checklistData,
      status: 'in_progress',
      intakeAt: new Date().toISOString(),
    }),
    [updateBooking]
  );

  // ===== PURCHASE CHECKLIST =====
  const toggleChecklistItem = useCallback(async (id) => {
    const item = purchaseChecklist.find(i => i.id === id);
    if (!item) return { data: null, error: 'ไม่พบรายการ' };
    const updates = {
      checked: !item.checked,
      installedAt: !item.checked ? new Date().toISOString() : null,
    };

    if (!isSupabaseConfigured) {
      const result = dbUpdate('purchase_checklist', id, updates);
      await loadChecklist();
      return result;
    }
    const { error } = await supabase.from('purchase_checklist').update(toDb('purchase_checklist', updates)).eq('id', id);
    if (!error) await loadChecklist();
    return { data: { id, ...updates }, error: errMsg(error) };
  }, [purchaseChecklist, loadChecklist]);

  const getChecklistByOrder = useCallback(
    (orderId) => purchaseChecklist.filter(i => i.orderId === orderId),
    [purchaseChecklist]
  );

  const value = {
    // Data
    products,
    orders,
    bookings,
    purchaseChecklist,
    mechanics,
    loading,
    isSupabase: isSupabaseConfigured,

    // Constants
    PRODUCT_CATEGORIES,
    CIVIC_GENERATIONS,
    SERVICE_TYPES,
    TIME_SLOTS,

    // Products
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,

    // Orders
    createOrder,
    updateOrderStatus,

    // Bookings
    createBooking,
    updateBookingStatus,
    assignMechanic,
    saveIntakeChecklist,

    // Purchase Checklist
    toggleChecklistItem,
    getChecklistByOrder,

    // Utilities
    refreshAll,
    generateId,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
