import { Link } from 'react-router-dom'

export default function SiteLayout({ children }) {
  return (
    <div className="site-layout">
      <header className="site-header">
        <div className="brand-group">
          <div className="brand-mark">AW</div>
          <div>
            <div className="brand-title">AutoWash Pro</div>
            <div className="brand-note">Quản lý dịch vụ xe chuyên nghiệp</div>
          </div>
        </div>

        <nav className="site-nav">
          <Link to="/">Trang chủ</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/staff">Staff</Link>
          <Link to="/auth/login" className="nav-button">
            Đăng nhập
          </Link>
        </nav>
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <div>AutoWash Pro © 2026</div>
        <div>Giao diện mới - Thiết kế lại từ đầu cho trải nghiệm vận hành gọn nhẹ.</div>
      </footer>
    </div>
  )
}
