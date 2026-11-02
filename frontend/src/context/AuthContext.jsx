import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

/**
 * AuthProvider — Mock Authentication
 * ===================================
 * Uses localStorage for mock auth. When your friend connects Supabase,
 * replace with supabase.auth.signInWithPassword() etc.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user from localStorage (mock session)
    const storedUser = localStorage.getItem('honda_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('honda_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
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

    const mockUser = {
      id: `user-${Date.now()}`,
      name: name,
      email: credentials.email,
      role: role,
    };
    localStorage.setItem('honda_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return { success: true, user: mockUser };
  };

  const register = async (userData) => {
    // Mock registration
    // Supabase: const { data, error } = await supabase.auth.signUp(userData)
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

  const logout = () => {
    // Supabase: await supabase.auth.signOut()
    localStorage.removeItem('honda_user');
    setUser(null);
  };

  // Quick login helpers for demo
  const loginAsAdmin = () => {
    const adminUser = { id: 'admin-001', name: 'Admin', email: 'admin@honda.com', role: 'admin' };
    localStorage.setItem('honda_user', JSON.stringify(adminUser));
    setUser(adminUser);
  };

  const loginAsMechanic = () => {
    const mechUser = { id: 'mech-001', name: 'ช่างใหญ่', email: 'mechanic@honda.com', role: 'mechanic' };
    localStorage.setItem('honda_user', JSON.stringify(mechUser));
    setUser(mechUser);
  };

  const loginAsCustomer = () => {
    const custUser = { id: 'cust-001', name: 'ลูกค้าตัวอย่าง', email: 'customer@honda.com', role: 'customer' };
    localStorage.setItem('honda_user', JSON.stringify(custUser));
    setUser(custUser);
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
        login,
        register,
        logout,
        loginAsAdmin,
        loginAsMechanic,
        loginAsCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
