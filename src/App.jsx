import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
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
import StaffBookings from './pages/staff/StaffBookings.jsx'
import StaffCheckin from './pages/staff/StaffCheckin.jsx'
import StaffPayment from './pages/staff/StaffPayment.jsx'
import StaffSchedule from './pages/staff/StaffSchedule.jsx'
import StaffStats from './pages/staff/StaffStats.jsx'
import StaffProfile from './pages/staff/StaffProfile.jsx'
import StaffNotifications from './pages/staff/StaffNotifications.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import StaffLayout from './components/staff/StaffLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import BookingSlotDashboard from './pages/admin/BookingSlotDashboard.jsx'
import StaffScheduleDashboard from './pages/admin/StaffScheduleDashboard.jsx'
import StaffManagement from './pages/admin/StaffManagement.jsx'
import AdminProfile from './pages/admin/AdminProfile.jsx'
import CustomerManagement from './pages/admin/CustomerManagement.jsx'
import PaymentManagement from './pages/admin/PaymentManagement.jsx'
import PromotionManagement from './pages/admin/PromotionManagement.jsx'
import ReportDashboard from './pages/admin/ReportDashboard.jsx'
import ServiceManagement from './pages/admin/ServiceManagement.jsx'
import SystemSettings from './pages/admin/SystemSettings.jsx'

export default function App() {
  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'font-mono text-sm',
          style: { background: '#171717', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
        }} 
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/auth/*" element={<Auth />} />
        
        {/* Protected User Routes */}
        <Route path="/booking" element={<BookingStep1Service />} />
        <Route path="/booking/datetime" element={<BookingStep2DateTime />} />
        <Route path="/booking/confirm" element={<BookingStep3Confirm />} />
        <Route path="/booking/success" element={<BookingSuccessPage />} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['USER']}><UserDashboard /></ProtectedRoute>} />
        
        {/* Protected Staff Routes */}
        <Route path="/staff/*" element={<ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}><StaffLayout /></ProtectedRoute>}>
          <Route index element={<StaffDashboard />} />
          <Route path="bookings" element={<StaffBookings />} />
          <Route path="checkin" element={<StaffCheckin />} />
          <Route path="payment" element={<StaffPayment />} />
          <Route path="schedule" element={<StaffSchedule />} />
          <Route path="stats" element={<StaffStats />} />
          <Route path="profile" element={<StaffProfile />} />
          <Route path="notifications" element={<StaffNotifications />} />
        </Route>
        
        {/* Protected Admin Routes */}
        <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="booking-schedule" element={<BookingSlotDashboard />} />
          <Route path="staffs" element={<StaffManagement />} />
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
    </>
  )
}
