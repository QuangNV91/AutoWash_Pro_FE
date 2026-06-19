import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute - Bảo vệ các route yêu cầu đăng nhập và phân quyền theo role.
 *
 * @param {React.ReactNode} children - Component con cần bảo vệ
 * @param {string[]} allowedRoles - Danh sách các role được phép truy cập (VD: ['ADMIN'], ['ADMIN', 'STAFF'])
 *                                  Nếu không truyền, chỉ cần đăng nhập là được vào.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Chưa đăng nhập → chuyển về trang login
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // Đã đăng nhập nhưng role không được phép → chuyển về trang chủ
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Đã đăng nhập và có quyền → cho phép truy cập
  return children;
}
