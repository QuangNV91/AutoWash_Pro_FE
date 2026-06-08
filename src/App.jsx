import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import StaffDashboard from './pages/StaffDashboard.jsx'
import { AdminDashboard, BookingSlotDashboard, StaffScheduleDashboard } from './pages/admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/staff" element={<StaffDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/booking-schedule" element={<BookingSlotDashboard />} />
      <Route path="/admin/staff-schedule" element={<StaffScheduleDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
