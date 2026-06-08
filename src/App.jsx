import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import StaffDashboard from './pages/StaffDashboard.jsx'
import { AdminDashboard, BookingSlotDashboard, StaffScheduleDashboard } from './pages/admin'
import SiteLayout from './components/SiteLayout.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/staff" element={<SiteLayout><StaffDashboard /></SiteLayout>} />
      <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/booking-schedule" element={<AdminLayout><BookingSlotDashboard /></AdminLayout>} />
      <Route path="/admin/staff-schedule" element={<AdminLayout><StaffScheduleDashboard /></AdminLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
