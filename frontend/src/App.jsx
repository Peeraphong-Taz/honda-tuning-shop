import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Core Pages (Eagerly loaded for instant first paint)
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Service from './pages/Service';
import Login from './pages/Login';
import Register from './pages/Register';

// Heavy Pages (Lazy loaded on demand to speed up initial site load)
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageProducts = lazy(() => import('./pages/admin/ManageProducts'));
const ManageBookings = lazy(() => import('./pages/admin/ManageBookings'));
const MechanicDashboard = lazy(() => import('./pages/mechanic/MechanicDashboard'));

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
  </div>
);

export const App = () => {
  return (
    <AuthProvider>
      <DatabaseProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-slate-100 selection:bg-red-600 selection:text-white">
              <Navbar />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
                <Suspense fallback={<PageLoader />}>
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
              </Suspense>
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
