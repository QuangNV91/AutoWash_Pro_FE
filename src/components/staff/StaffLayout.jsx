import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, CalendarDays, ScanLine, CreditCard, 
  CalendarClock, BarChart3, User, Bell,
  LogOut, ChevronRight, Menu, X
} from 'lucide-react'
import { useState } from 'react'

const NAV_ITEMS = [
  { key: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan', to: '/staff' },
  { key: 'bookings', icon: CalendarDays, label: 'Lịch hẹn hôm nay', to: '/staff/bookings' },
  { key: 'checkin', icon: ScanLine, label: 'Check-in xe', to: '/staff/checkin' },
  { key: 'payment', icon: CreditCard, label: 'Thu tiền', to: '/staff/payment' },
  { key: 'schedule', icon: CalendarClock, label: 'Lịch trực', to: '/staff/schedule' },
  { key: 'stats', icon: BarChart3, label: 'Thống kê', to: '/staff/stats' },
  { key: 'profile', icon: User, label: 'Hồ sơ cá nhân', to: '/staff/profile' },
  { key: 'notifications', icon: Bell, label: 'Thông báo', to: '/staff/notifications' },
]

function getActiveKey(pathname) {
  if (pathname === '/staff' || pathname === '/staff/') return 'dashboard'
  const match = NAV_ITEMS.find(n => n.to !== '/staff' && pathname.startsWith(n.to))
  return match?.key || 'dashboard'
}

export default function StaffLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const selectedKey = getActiveKey(location.pathname)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/auth/login')
  }

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="px-5 pt-6 pb-4 border-b border-white/5">
        <Link to="/staff" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">AW</span>
          </div>
          <div>
            <div className="text-white font-medium text-sm tracking-tight">AutoWash Pro</div>
            <div className="text-white/40 text-xs">Staff Panel</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = selectedKey === item.key
          return (
            <Link
              key={item.key}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
            >
              <Icon size={18} className={isActive ? 'text-cyan-400' : 'text-white/40 group-hover:text-white/70'} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} className="text-cyan-400/40" />}
              {item.key === 'notifications' && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">3</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-white/5 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-dark-950 flex font-body">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-neutral-950 border-r border-white/5 fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-neutral-950/95 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-4">
        <Link to="/staff" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">AW</span>
          </div>
          <span className="text-white font-medium text-sm">Staff</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-neutral-950 border-r border-white/5 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="min-h-screen pt-16 lg:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
