import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    textAlign: 'center',
    padding: 24,
  }

  const buttonStyle = {
    display: 'inline-block',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #ddd',
    textDecoration: 'none',
    fontWeight: 600,
  }

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: 28, fontWeight: 800 }}>
        HELLO! Đây là MÀN HÌNH QUẢN TRỊ CỦA ADMIN (Quản trị viên).
      </div>

      <Link to="/" style={buttonStyle}>
        Về Trang chủ
      </Link>
    </div>
  )
}
