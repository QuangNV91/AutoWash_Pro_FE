import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/guest/HomePage.jsx'
import ServicesPage from './pages/guest/ServicesPage.jsx'
import PricingPage from './pages/guest/PricingPage.jsx'
import ContactPage from './pages/guest/ContactPage.jsx'
import Auth from './pages/Auth.jsx'
import StaffDashboard from './pages/StaffDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/staff" element={<StaffDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
