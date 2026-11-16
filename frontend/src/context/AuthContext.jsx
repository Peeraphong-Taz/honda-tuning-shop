import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

const THAI_AUTH_ERRORS = {
  'Invalid login credentials': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  'Email not confirmed': 'กรุณายืนยันอีเมลก่อน (เช็คกล่องจดหมายของคุณ)',
  'User already registered': 'อีเมลนี้สมัครสมาชิกแล้ว',
};

const authError = (error) => new Error(THAI_AUTH_ERRORS[error.message] || error.message);

/**
 * AuthProvider
 * ============
 * - Supabase mode: ใช้ Supabase Auth (อีเมล + รหัสผ่าน) และอ่าน role จากตาราง profiles
 * - Demo mode (ยังไม่ตั้งค่า Supabase): ล็อกอินจำลองใน localStorage เหมือนเดิม
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ดึง profile (ชื่อ + role) ของผู้ใช้ที่ล็อกอินอยู่
  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) return null;
    const { data } = await supabase
      .from('profiles')
      .select('name, email, phone, role')
      .eq('id', authUser.id)
      .maybeSingle();

    return {
      id: authUser.id,
      email: authUser.email,
      name: data?.name || authUser.user_metadata?.name || authUser.email?.split('@')[0],
      phone: data?.phone || '',
      carModel: authUser.user_metadata?.carModel || '',
      role: data?.role || 'customer',
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const storedUser = localStorage.getItem('honda_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem('honda_user');
        }
      }
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const profile = await loadProfile(session?.user);
      if (active) {
        setUser(profile);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // อย่า await ใน callback นี้ (คำแนะนำของ supabase-js) — โหลด profile แยกออกไป
      setTimeout(async () => {
        const profile = await loadProfile(session?.user);
        if (active) setUser(profile);
      }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const login = async (credentials) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      if (error) throw authError(error);
      const profile = await loadProfile(data.user);
      setUser(profile);
      return { success: true, user: profile };
    }

    // ===== Demo mode =====
    const email = credentials.email?.toLowerCase() || '';
    let role = 'customer';
    let name = credentials.email?.split('@')[0] || 'User';

    if (email.includes('admin')) {
      role = 'admin';
      name = 'แอดมินเจ้าของร้าน';
    } else if (email.includes('mechanic') || email.includes('tech') || email.includes('tuner')) {
      role = 'mechanic';
      name = 'ช่างใหญ่ (Master Tuner)';
    }

    const mockUser = { id: `user-${Date.now()}`, name, email: credentials.email, role };
    localStorage.setItem('honda_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return { success: true, user: mockUser };
  };

  const register = async (userData) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: { name: userData.name, carModel: userData.carModel },
        },
      });
      if (error) throw authError(error);

      // ถ้าเปิด "Confirm email" ใน Supabase จะยังไม่มี session จนกว่าจะกดยืนยันในอีเมล
      if (!data.session) {
        return { success: true, needsConfirmation: true };
      }
      const profile = await loadProfile(data.user);
      setUser(profile);
      return { success: true, user: profile };
    }

    // ===== Demo mode =====
    const mockUser = {
      id: `user-${Date.now()}`,
      name: userData.name || 'New User',
      email: userData.email,
      role: 'customer',
    };
    localStorage.setItem('honda_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return { success: true, user: mockUser };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('honda_user');
    }
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isMechanic = user?.role === 'mechanic' || user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isMechanic,
        isDemoAuth: !isSupabaseConfigured,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
