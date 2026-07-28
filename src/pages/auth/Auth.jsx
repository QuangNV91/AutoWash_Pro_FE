import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './LoginPage.jsx'
import RegisterPage from './RegisterPage.jsx'
import ForgotPasswordPage from './ForgotPasswordPage.jsx'
import VerifyPage from './VerifyPage.jsx'

export default function Auth() {
  return (
    <Routes>
      <Route index element={<Navigate to="login" replace />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="verify" element={<VerifyPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  )
}
