import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
// import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Layout from './components/Layout'
import Dashboard from './pages/admin/Dashboard'

import Inventory from './pages/admin/Inventory'
import Categoryproducts from './pages/Categoryproducts'
import Category from './pages/admin/Category'
import OrdersManagement from './pages/admin/OrdersManagement'
import AdminLogsPanel from './components/AdminLogsPanel'

import Profile from './pages/Profile'
import { useSelector } from 'react-redux'
import ProtectedRoute from "./components/ProtectedRoute";
import AdminOtp from './pages/AdminOtp'
import ForgetPass from './pages/ForgetPass'
import ResetPassword from './pages/ResetPassword'
import UserOtp from './pages/UserOtp'
import { useState } from 'react'
import useAuthInit from '../hooks/useAuthInit'


function AuthLayout({ children }) {
  const location = useLocation();
  const authPages = ["/login", "/signup", "/admin-otp", "/forget-pass", "/verifyUserOtp", "/reset-password"];

  if (authPages.includes(location.pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fa] p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg">
          {children}
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

function AuthToast({ toast }) {
  const location = useLocation();
  const authPages = ["/login", "/signup", "/admin-otp", "/forget-pass", "/verifyUserOtp", "/reset-password"];

  if (!toast || !authPages.includes(location.pathname)) return null;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-slate-800 text-white px-5 py-2 rounded-full shadow-lg text-sm">
        {toast}
      </div>
    </div>
  );
}


function App() {
  const currentUser = useSelector(state => state.auth.user)
  const [toast, setToast] = useState(null);  // ✅ already added

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };


  useAuthInit()

  return (
    <div>
      <BrowserRouter>

        <AuthToast toast={toast} />
        <AuthLayout>
          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login showToast={showToast} />} />
            <Route path="/signup" element={<Signup showToast={showToast} />} />

            <Route path="/admin-otp" element={<AdminOtp showToast={showToast} />} />
            <Route path="/forget-pass" element={<ForgetPass showToast={showToast} />} />
            <Route path="/reset-password" element={<ResetPassword showToast={showToast} />} />
            <Route path="/verifyUserOtp" element={<UserOtp showToast={showToast} />} />



            <Route path="/products" element={<Products />} />
            <Route path="/category/:categoryname" element={<Categoryproducts />} />

            {/* ── Admin Routes (Admin role only) ──────────────────────────────── */}
            {/* Sidebar shows: Dashboard, Inventory, Category, Orders, Profile    */}
            <Route
              element={
                <ProtectedRoute user={currentUser} requiredRole="admin">
                  <Layout user={currentUser} />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/profile" element={<Profile />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/inventory" element={<Inventory />} />
              <Route path="/admin/category" element={<Category />} />
              <Route path="/admin/ordersManagement" element={<OrdersManagement />} />
              <Route path="/admin/logs" element={<AdminLogsPanel title="Admin Logs" defaultTab="order" />} />
            </Route>

            {/* ── User Routes (regular user only) ─────────────────────────────── */}
            {/* Sidebar shows: Profile, Orders, Wishlist only                     */}

            <Route
              element={
                <ProtectedRoute user={currentUser}>
                  <Layout user={currentUser} />
                </ProtectedRoute>
              }
            >
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/user/orders" element={<Orders />} />
              <Route path="/user/wishlist" element={<Wishlist />} />
              <Route path="/user/cart" element={<Cart />} />
            </Route>
          </Routes>
        </AuthLayout>
      </BrowserRouter>
    </div>
  );
}

export default App;