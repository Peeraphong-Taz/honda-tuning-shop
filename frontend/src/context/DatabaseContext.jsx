import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  initializeDatabase,
  dbSelect,
  dbInsert,
  dbUpdate,
  dbDelete,
  dbSetAll,
  generateId,
  MECHANICS,
  PRODUCT_CATEGORIES,
  CIVIC_GENERATIONS,
  SERVICE_TYPES,
  TIME_SLOTS,
} from '../data/mockDatabase';

const DatabaseContext = createContext();

/**
 * DatabaseProvider
 * ================
 * Provides mock database operations that mimic Supabase API patterns.
 * When connecting to Supabase, replace the db* functions with actual
 * supabase.from('table').select/insert/update/delete calls.
 *
 * Example Supabase migration:
 *   Before: const products = dbSelect('products');
 *   After:  const { data: products } = await supabase.from('products').select('*');
 */
export const DatabaseProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [purchaseChecklist, setPurchaseChecklist] = useState([]);
  const [mechanics, setMechanics] = useState(MECHANICS);
  const [loading, setLoading] = useState(true);

  // Initialize database on mount
  useEffect(() => {
    initializeDatabase();
    refreshAll();
  }, []);

  // Refresh all data from localStorage
  const refreshAll = useCallback(() => {
    setLoading(true);
    setProducts(dbSelect('products') || []);
    setOrders(dbSelect('orders') || []);
    setBookings(dbSelect('bookings') || []);
    setPurchaseChecklist(dbSelect('purchase_checklist') || []);
    setMechanics(dbSelect('mechanics') || MECHANICS);
    setLoading(false);
  }, []);

  // ===== PRODUCTS CRUD =====
  // Supabase: supabase.from('products').select('*')
  const getProducts = useCallback((filters = {}) => {
    let data = dbSelect('products') || [];

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
  }, []);

  // Supabase: supabase.from('products').select('*').eq('id', id).single()
  const getProductById = useCallback((id) => {
    const all = dbSelect('products') || [];
    return all.find(p => p.id === id) || null;
  }, []);

  // Supabase: supabase.from('products').insert(productData)
  const addProduct = useCallback((productData) => {
    const newProduct = {
      ...productData,
      id: generateId('prod'),
      createdAt: new Date().toISOString(),
      status: productData.status || 'active',
    };
    const result = dbInsert('products', newProduct);
    if (!result.error) {
      setProducts(dbSelect('products') || []);
    }
    return result;
  }, []);

  // Supabase: supabase.from('products').update(updates).eq('id', id)
  const updateProduct = useCallback((id, updates) => {
    const result = dbUpdate('products', id, updates);
    if (!result.error) {
      setProducts(dbSelect('products') || []);
    }
    return result;
  }, []);

  // Supabase: supabase.from('products').delete().eq('id', id)
  const deleteProduct = useCallback((id) => {
    const result = dbDelete('products', id);
    if (!result.error) {
      setProducts(dbSelect('products') || []);
    }
    return result;
  }, []);

  // ===== ORDERS =====
  const createOrder = useCallback((orderData) => {
    const newOrder = {
      ...orderData,
      id: generateId('ord'),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    const result = dbInsert('orders', newOrder);
    if (!result.error) {
      setOrders(dbSelect('orders') || []);

      // Also add items to purchase checklist
      if (orderData.items) {
        orderData.items.forEach(item => {
          const checkItem = {
            id: generateId('chk'),
            orderId: newOrder.id,
            productId: item.id,
            productName: item.name,
            category: item.category,
            brand: item.brand,
            quantity: item.quantity,
            price: item.price,
            checked: false,
            installedBy: null,
            installedAt: null,
            createdAt: new Date().toISOString(),
          };
          dbInsert('purchase_checklist', checkItem);
        });
        setPurchaseChecklist(dbSelect('purchase_checklist') || []);
      }
    }
    return result;
  }, []);

  const updateOrderStatus = useCallback((id, status) => {
    const result = dbUpdate('orders', id, { status });
    if (!result.error) {
      setOrders(dbSelect('orders') || []);
    }
    return result;
  }, []);

  // ===== BOOKINGS =====
  // Supabase: supabase.from('bookings').insert(bookingData)
  const createBooking = useCallback((bookingData) => {
    const newBooking = {
      ...bookingData,
      id: generateId('bk'),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    const result = dbInsert('bookings', newBooking);
    if (!result.error) {
      setBookings(dbSelect('bookings') || []);
    }
    return result;
  }, []);

  const updateBookingStatus = useCallback((id, status) => {
    const result = dbUpdate('bookings', id, { status });
    if (!result.error) {
      setBookings(dbSelect('bookings') || []);
    }
    return result;
  }, []);

  const assignMechanic = useCallback((bookingId, mechanicId) => {
    const result = dbUpdate('bookings', bookingId, { mechanicId, status: 'assigned' });
    if (!result.error) {
      setBookings(dbSelect('bookings') || []);
    }
    return result;
  }, []);

  // ===== PURCHASE CHECKLIST =====
  const toggleChecklistItem = useCallback((id) => {
    const all = dbSelect('purchase_checklist') || [];
    const item = all.find(i => i.id === id);
    if (item) {
      dbUpdate('purchase_checklist', id, {
        checked: !item.checked,
        installedAt: !item.checked ? new Date().toISOString() : null,
      });
      setPurchaseChecklist(dbSelect('purchase_checklist') || []);
    }
  }, []);

  const getChecklistByOrder = useCallback((orderId) => {
    const all = dbSelect('purchase_checklist') || [];
    return all.filter(i => i.orderId === orderId);
  }, []);

  // ===== DATABASE COMMAND (SQL-like interface) =====
  /**
   * Execute a mock database command
   * This simulates SQL-like commands for adding products to the database.
   *
   * Example commands:
   *   INSERT product name="กันชนหน้า Type R" brand="Type R" category="bumper" price=15000
   *   SELECT products WHERE category="bumper"
   *   UPDATE product id="prod-001" stock=10
   *   DELETE product id="prod-001"
   */
  const executeDbCommand = useCallback((command) => {
    try {
      const parts = command.trim().split(/\s+/);
      const action = parts[0]?.toUpperCase();
      const table = parts[1]?.toLowerCase();

      if (action === 'INSERT' && (table === 'product' || table === 'products')) {
        // Parse key=value pairs
        const params = {};
        const paramStr = command.substring(command.indexOf(table) + table.length).trim();
        const matches = paramStr.match(/(\w+)=(?:"([^"]*)"|([\w.]+))/g);

        if (matches) {
          matches.forEach(match => {
            const [key, ...valParts] = match.split('=');
            let val = valParts.join('=').replace(/"/g, '');
            // Try to parse as number
            if (!isNaN(val) && val !== '') val = Number(val);
            params[key] = val;
          });
        }

        if (!params.name) {
          return { success: false, message: 'Error: ต้องระบุชื่อสินค้า (name="...")' };
        }

        const result = addProduct({
          name: params.name,
          brand: params.brand || 'Unknown',
          category: params.category || 'other',
          price: params.price || 0,
          description: params.description || '',
          stock: params.stock || 0,
          compatibleGens: params.gens ? params.gens.split(',') : ['gen8', 'gen9', 'gen10', 'gen11'],
          compatibleModels: params.models ? params.models.split(',') : [],
          imageUrl: params.image || '',
        });

        return {
          success: !result.error,
          message: result.error
            ? `Error: ${result.error}`
            : `✅ เพิ่มสินค้า "${params.name}" เข้า database สำเร็จ!`,
          data: result.data,
        };
      }

      if (action === 'SELECT' && (table === 'products' || table === 'product')) {
        const data = getProducts();
        return {
          success: true,
          message: `พบสินค้า ${data.length} รายการ`,
          data,
        };
      }

      if (action === 'DELETE' && (table === 'product' || table === 'products')) {
        const idMatch = command.match(/id="([^"]+)"/);
        if (idMatch) {
          const result = deleteProduct(idMatch[1]);
          return {
            success: !result.error,
            message: result.error ? `Error: ${result.error}` : `✅ ลบสินค้า ID "${idMatch[1]}" สำเร็จ`,
          };
        }
        return { success: false, message: 'Error: ต้องระบุ id="..."' };
      }

      if (action === 'RESET' && table === 'database') {
        localStorage.clear();
        initializeDatabase();
        refreshAll();
        return { success: true, message: '✅ รีเซ็ต database กลับเป็นค่าเริ่มต้นสำเร็จ' };
      }

      return {
        success: false,
        message: `ไม่รู้จักคำสั่ง "${action}". คำสั่งที่ใช้ได้: INSERT, SELECT, DELETE, RESET`,
      };
    } catch (error) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }, [addProduct, deleteProduct, getProducts, refreshAll]);

  const value = {
    // Data
    products,
    orders,
    bookings,
    purchaseChecklist,
    mechanics,
    loading,

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

    // Purchase Checklist
    toggleChecklistItem,
    getChecklistByOrder,

    // DB Command
    executeDbCommand,

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
