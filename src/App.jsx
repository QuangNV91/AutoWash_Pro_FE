import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/guest/HomePage.jsx'
import ServicesPage from './pages/guest/ServicesPage.jsx'
import PricingPage from './pages/guest/PricingPage.jsx'
import ContactPage from './pages/guest/ContactPage.jsx'
import Auth from './pages/auth/Auth.jsx'
import BookingStep1Service from './pages/user/booking/BookingStep1Service.jsx'
import BookingStep2DateTime from './pages/user/booking/BookingStep2DateTime.jsx'
import BookingStep3Confirm from './pages/user/booking/BookingStep3Confirm.jsx'
import BookingSuccessPage from './pages/user/booking/BookingSuccessPage.jsx'
import UserDashboard from './pages/user/UserDashboard.jsx'
import StaffDashboard from './pages/staff/StaffDashboard.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import BookingSlotDashboard from './pages/admin/BookingSlotDashboard.jsx'
import StaffScheduleDashboard from './pages/admin/StaffScheduleDashboard.jsx'
import ServiceManagement from './pages/admin/ServiceManagement.jsx'
import CustomerManagement from './pages/admin/CustomerManagement.jsx'
import PaymentManagement from './pages/admin/PaymentManagement.jsx'
import PromotionManagement from './pages/admin/PromotionManagement.jsx'
import ReportDashboard from './pages/admin/ReportDashboard.jsx'
import SystemSettings from './pages/admin/SystemSettings.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      {/* === Public Routes - Ai cũng vào được === */}
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/auth/*" element={<Auth />} />

      {/* === User Routes - Phải đăng nhập mới vào được === */}
      <Route path="/booking" element={<ProtectedRoute><BookingStep1Service /></ProtectedRoute>} />
      <Route path="/booking/datetime" element={<ProtectedRoute><BookingStep2DateTime /></ProtectedRoute>} />
      <Route path="/booking/confirm" element={<ProtectedRoute><BookingStep3Confirm /></ProtectedRoute>} />
      <Route path="/booking/success" element={<ProtectedRoute><BookingSuccessPage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />

      {/* === Staff Routes - Chỉ STAFF và ADMIN mới vào được === */}
      <Route path="/staff" element={<ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}><StaffDashboard /></ProtectedRoute>} />

      {/* === Admin Routes - Chỉ ADMIN mới vào được === */}
      <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="booking-schedule" element={<BookingSlotDashboard />} />
        <Route path="staff-schedule" element={<StaffScheduleDashboard />} />
        <Route path="services" element={<ServiceManagement />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="payments" element={<PaymentManagement />} />
        <Route path="promotions" element={<PromotionManagement />} />
        <Route path="reports" element={<ReportDashboard />} />
        <Route path="settings" element={<SystemSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

