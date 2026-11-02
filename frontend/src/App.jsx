import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Service from './pages/Service';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin & Mechanic Pages (Separated)
import AdminDashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageBookings from './pages/admin/ManageBookings';
import MechanicDashboard from './pages/mechanic/MechanicDashboard';

export const App = () => {
  return (
    <AuthProvider>
      <DatabaseProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-[#0F1115] text-slate-100 selection:bg-red-600 selection:text-white">
              <Navbar />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/service" element={<Service />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* User Protected Routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Protected Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly>
                        <Navigate to="/admin/dashboard" replace />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <ProtectedRoute adminOnly>
                        <ManageProducts />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/bookings"
                    element={
                      <ProtectedRoute adminOnly>
                        <ManageBookings />
                      </ProtectedRoute>
                    }
                  />

                  {/* Mechanic Protected Routes */}
                  <Route
                    path="/mechanic"
                    element={
                      <ProtectedRoute mechanicOnly>
                        <Navigate to="/mechanic/dashboard" replace />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/mechanic/dashboard"
                    element={
                      <ProtectedRoute mechanicOnly>
                        <MechanicDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </DatabaseProvider>
    </AuthProvider>
  );
};

export default App;
