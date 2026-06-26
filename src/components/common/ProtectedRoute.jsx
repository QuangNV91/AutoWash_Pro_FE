import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      toast.error('Vui lòng đăng nhập để tiếp tục.');
    } else if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      toast.error('Bạn không có quyền truy cập trang này.');
    }
  }, [token, role, allowedRoles]);

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check roles if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(role)) {
      // Redirect to a safe page based on their role
      if (role === 'ADMIN') return <Navigate to="/admin" replace />;
      if (role === 'STAFF') return <Navigate to="/staff" replace />;
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
