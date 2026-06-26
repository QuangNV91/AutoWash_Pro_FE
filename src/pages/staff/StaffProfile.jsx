import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, ChevronLeft, Camera, Mail, Phone, Key, Shield, Check } from 'lucide-react'

export default function StaffProfile() {
  const navigate = useNavigate()
  const storedPhone = localStorage.getItem('username') || '0901234567';
  const [profile, setProfile] = useState({ fullName: 'Chưa cập nhật tên', email: 'chua_cap_nhat@email.com', phone: storedPhone })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [savedProfile, setSavedProfile] = useState(false)
  const [savedPwd, setSavedPwd] = useState(false)
  const [pwdError, setPwdError] = useState('')

  const handleSaveProfile = (e) => {
    e.preventDefault()
    setSavedProfile(true)
    setTimeout(() => setSavedProfile(false), 2500)
  }
  const handleSavePassword = (e) => {
    e.preventDefault()
    if (passwords.next !== passwords.confirm) { setPwdError('Mật khẩu mới không khớp'); return }
    if (passwords.next.length < 6) { setPwdError('Mật khẩu tối thiểu 6 ký tự'); return }
    setPwdError('')
    setSavedPwd(true)
    setPasswords({ current: '', next: '', confirm: '' })
    setTimeout(() => setSavedPwd(false), 2500)
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-4xl mx-auto font-body text-white">

      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <button onClick={() => navigate('/staff')} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-hero text-2xl font-medium tracking-tight flex items-center gap-3">
            <User className="text-cyan-400" size={24} />
            Hồ sơ cá nhân
          </h1>
          <p className="text-white/40 text-sm font-mono mt-0.5">Quản lý thông tin và bảo mật tài khoản</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Avatar card */}
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5">
              <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center">
                <User size={52} className="text-white/20" />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 w-9 h-9 bg-cyan-500 hover:bg-cyan-400 rounded-full flex items-center justify-center text-black transition-colors border-4 border-neutral-950">
              <Camera size={16} />
            </button>
          </div>
          <h2 className="text-lg font-semibold text-white">{profile.fullName}</h2>
          <div className="flex items-center gap-2 mt-1 text-white/50 text-sm">
            <Shield size={14} className="text-cyan-400" />
            <span>Nhân viên</span>
          </div>
          <div className="mt-4 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left">
            <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-1">Mã nhân viên</p>
            <p className="text-sm font-mono text-cyan-400 font-medium">NV-01</p>
          </div>
          <div className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left">
            <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-1">Ca mặc định</p>
            <p className="text-sm font-mono text-white">CA 1 · 07:00 – 12:00</p>
          </div>
        </div>

        {/* Forms */}
        <div className="lg:col-span-2 space-y-5">

          {/* Profile form */}
          <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6">
            {savedProfile && (
              <div className="mb-4 flex items-center gap-2 text-emerald-400 text-sm font-mono bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
                <Check size={16} /> Thông tin đã được cập nhật!
              </div>
            )}
            <h3 className="font-medium text-white mb-5 flex items-center gap-2 text-sm">
              <User size={16} className="text-cyan-400" /> Thông tin cơ bản
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs text-white/50 font-mono mb-1.5 block">Họ và tên</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    value={profile.fullName} onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full bg-black/30 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl pl-9 pr-4 py-2.5 text-sm text-white transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 font-mono mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl pl-9 pr-4 py-2.5 text-sm text-white transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/50 font-mono mb-1.5 block">Số điện thoại</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl pl-9 pr-4 py-2.5 text-sm text-white transition-colors"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold rounded-xl transition-colors">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>

          {/* Password form */}
          <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6">
            {savedPwd && (
              <div className="mb-4 flex items-center gap-2 text-emerald-400 text-sm font-mono bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
                <Check size={16} /> Mật khẩu đã được cập nhật!
              </div>
            )}
            {pwdError && (
              <div className="mb-4 text-red-400 text-sm font-mono bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                {pwdError}
              </div>
            )}
            <h3 className="font-medium text-white mb-5 flex items-center gap-2 text-sm">
              <Key size={16} className="text-cyan-400" /> Đổi mật khẩu
            </h3>
            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className="text-xs text-white/50 font-mono mb-1.5 block">Mật khẩu hiện tại</label>
                <input type="password" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white transition-colors" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 font-mono mb-1.5 block">Mật khẩu mới</label>
                  <input type="password" value={passwords.next} onChange={e => setPasswords({ ...passwords, next: e.target.value })}
                    className="w-full bg-black/30 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white transition-colors" required />
                </div>
                <div>
                  <label className="text-xs text-white/50 font-mono mb-1.5 block">Xác nhận mật khẩu mới</label>
                  <input type="password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full bg-black/30 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white transition-colors" required />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-medium rounded-xl transition-colors">
                  Cập nhật mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
