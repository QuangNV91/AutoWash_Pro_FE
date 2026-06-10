import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/guest/HomePage.jsx'
import ServicesPage from './pages/guest/ServicesPage.jsx'
import PricingPage from './pages/guest/PricingPage.jsx'
import ContactPage from './pages/guest/ContactPage.jsx'
import Auth from './pages/Auth.jsx'
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
import StaffSchedule from './pages/staff/StaffSchedule';
import TaskDetail from './pages/staff/TaskDetail';

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
      <Route path="/staff" element={<StaffDashboard />} />
      <Route path="/staff/schedule" element={<StaffSchedule />} />
      <Route path="/staff/tasks" element={<TaskDetail />} />
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="booking-schedule" element={<BookingSlotDashboard />} />
        <Route path="staff-schedule" element={<StaffScheduleDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
