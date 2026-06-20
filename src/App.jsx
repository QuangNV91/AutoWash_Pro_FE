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
import StaffLayout from './components/staff/StaffLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import BookingSlotDashboard from './pages/admin/BookingSlotDashboard.jsx'
import StaffScheduleDashboard from './pages/admin/StaffScheduleDashboard.jsx'
import AdminProfile from './pages/admin/AdminProfile.jsx'
import CustomerManagement from './pages/admin/CustomerManagement.jsx'
import PaymentManagement from './pages/admin/PaymentManagement.jsx'
import PromotionManagement from './pages/admin/PromotionManagement.jsx'
import ReportDashboard from './pages/admin/ReportDashboard.jsx'
import ServiceManagement from './pages/admin/ServiceManagement.jsx'
import SystemSettings from './pages/admin/SystemSettings.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/booking" element={<BookingStep1Service />} />
      <Route path="/booking/datetime" element={<BookingStep2DateTime />} />
      <Route path="/booking/confirm" element={<BookingStep3Confirm />} />
      <Route path="/booking/success" element={<BookingSuccessPage />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/staff/*" element={<StaffLayout />}>
        <Route index element={<StaffDashboard />} />
      </Route>
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="booking-schedule" element={<BookingSlotDashboard />} />
        <Route path="staff-schedule" element={<StaffScheduleDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
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
