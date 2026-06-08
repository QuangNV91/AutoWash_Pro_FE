import { useState } from 'react'
import { Link } from 'react-router-dom'

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M8.2 3h7.6c1.2 0 2.2 1 2.2 2.2v13.6c0 1.2-1 2.2-2.2 2.2H8.2A2.2 2.2 0 0 1 6 18.8V5.2C6 4 7 3 8.2 3Zm3.8 15.5a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 6c4.8 0 8.8 3 10 6-1.2 3-5.2 6-10 6s-8.8-3-10-6c1.2-3 5.2-6 10-6Zm0 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function LoginForm() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="auth-form">
      <header className="auth-form__header">
        <h2>Dang nhap</h2>
        <p>Truy cap he thong quan ly cham soc xe cua ban.</p>
      </header>

      <form onSubmit={(event) => event.preventDefault()}>
        <label className="auth-field">
          <span>SO DIEN THOAI (ID DANG NHAP)</span>
          <div className="auth-field__input-wrap">
            <input
              type="tel"
              placeholder="090 123 4567"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <i>
              <PhoneIcon />
            </i>
          </div>
        </label>

        <label className="auth-field">
          <span>MAT KHAU</span>
          <div className="auth-field__input-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button type="button" className="auth-eye-btn" onClick={() => setShowPassword((value) => !value)}>
              <EyeIcon />
            </button>
          </div>
        </label>

        <button type="submit" className="auth-submit">
          Dang nhap ngay <span aria-hidden="true">→</span>
        </button>
      </form>

      <p className="auth-switch">
        Chua co tai khoan? <Link to="/auth/register">Dang ky</Link>
      </p>
    </div>
  )
}
