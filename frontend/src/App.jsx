import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/public/Home';
import ProductDetail from './pages/public/ProductDetail';
import Admin from './pages/admin/Admin';
import Orders from './pages/admin/Orders';
import Inventory from './pages/admin/Inventory';
import OrderDetail from './pages/admin/OrderDetail';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import Profile from './pages/user/Profile';
import MyOrders from './pages/user/MyOrders';
import CustomerOrderDetail from './pages/user/CustomerOrderDetail';
import Shop from './pages/public/Shop';
import Warranty from './pages/public/Warranty';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import ComplaintDetail from './pages/technician/ComplaintDetail';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';
import Technicians from './pages/admin/Technicians';
import ActiveWarranties from './pages/admin/ActiveWarranties';
import DeliveredOrders from './pages/admin/DeliveredOrders';
import Customers from './pages/admin/Customers';
import Complaints from './pages/admin/Complaints';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';

import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';
import MaintenanceWrapper from './components/MaintenanceWrapper';
import './App.css';

function App() {
  React.useEffect(() => {
    // Sanitize session: If either user or token is missing, clear both.
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if ((user && !token) || (!user && token)) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, []);

  return (
    <SettingsProvider>
      <CartProvider>
        <Router>
          <MaintenanceWrapper>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/warranty" element={<Warranty />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected Technician Routes */}
              <Route
                path="/technician"
                element={
                  <ProtectedRoute allowedRoles={['technician', 'admin']}>
                    <TechnicianDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/technician/complaint/:id"
                element={
                  <ProtectedRoute allowedRoles={['technician', 'admin']}>
                    <ComplaintDetail />
                  </ProtectedRoute>
                }
              />

              <Route path="/product/:id" element={<ProductDetail />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <OrderDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Inventory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/technicians"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Technicians />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/warranties"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ActiveWarranties />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/delivered"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DeliveredOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/customers"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Customers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/complaints"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Complaints />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />

              {/* Protected User Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-order/:id"
                element={
                  <ProtectedRoute>
                    <CustomerOrderDetail />
                  </ProtectedRoute>
                }
              />

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* Fallback to Home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </MaintenanceWrapper>
        </Router>
      </CartProvider>
    </SettingsProvider>
  );
}

export default App;
