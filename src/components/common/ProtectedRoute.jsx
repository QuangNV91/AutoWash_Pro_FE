import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    toast.error('Vui lòng đăng nhập để tiếp tục.');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check roles if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user?.role)) {
      toast.error('Bạn không có quyền truy cập trang này.');
      // Redirect to a safe page based on their role
      if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />;
      if (user?.role === 'STAFF') return <Navigate to="/staff" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
