import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout.jsx'
import LoginForm from '../components/auth/LoginForm.jsx'
import RegisterForm from '../components/auth/RegisterForm.jsx'

export default function Auth() {
  return (
    <AuthLayout>
      <Routes>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    </AuthLayout>
  )
}
