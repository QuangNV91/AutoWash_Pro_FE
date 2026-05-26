import { Link } from 'react-router-dom'

export default function Home() {
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
        HELLO! Đây là TRANG CHỦ (Home Page) của AutoWash Pro.
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/auth" style={buttonStyle}>
          Đăng nhập/Đăng ký
        </Link>
        <Link to="/staff" style={buttonStyle}>
          Màn hình Staff
        </Link>
        <Link to="/admin" style={buttonStyle}>
          Màn hình Admin
        </Link>
      </div>
    </div>
  )
}
