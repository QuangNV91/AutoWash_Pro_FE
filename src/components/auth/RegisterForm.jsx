import { useState } from 'react'
import { Link } from 'react-router-dom'

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 11c4.1 0 7.5 2.1 7.5 4.7 0 .7-.6 1.3-1.3 1.3H5.8c-.7 0-1.3-.6-1.3-1.3C4.5 16.1 7.9 14 12 14Z"
        fill="currentColor"
      />
    </svg>
  )
}

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

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 14h16l-1.4-4.2A2 2 0 0 0 16.7 8H7.3a2 2 0 0 0-1.9 1.8L4 14Zm0 0v4h2v-2h12v2h2v-4M7 18a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm10 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
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

export default function RegisterForm() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    licensePlate: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const updateField = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  return (
    <div className="auth-form">
      <header className="auth-form__header">
        <h2>Tao tai khoan moi</h2>
        <p>Bat dau trai nghiem dich vu cham soc xe cao cap.</p>
      </header>

      <form onSubmit={(event) => event.preventDefault()}>
        <label className="auth-field">
          <span>HO VA TEN</span>
          <div className="auth-field__input-wrap">
            <input type="text" placeholder="Nguyen Van A" value={form.fullName} onChange={updateField('fullName')} />
            <i>
              <UserIcon />
            </i>
          </div>
        </label>

        <label className="auth-field">
          <span>SO DIEN THOAI (ID DANG NHAP)</span>
          <div className="auth-field__input-wrap">
            <input type="tel" placeholder="090 123 4567" value={form.phone} onChange={updateField('phone')} />
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
              value={form.password}
              onChange={updateField('password')}
            />
            <button type="button" className="auth-eye-btn" onClick={() => setShowPassword((value) => !value)}>
              <EyeIcon />
            </button>
          </div>
        </label>

        <button type="submit" className="auth-submit">
          Dang ky ngay <span aria-hidden="true">→</span>
        </button>
      </form>

      <p className="auth-switch">
        Da co tai khoan? <Link to="/auth/login">Dang nhap</Link>
      </p>
    </div>
  )
}
