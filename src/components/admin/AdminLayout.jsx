import { Link, useLocation, Outlet } from 'react-router-dom'
import PageWrapper from '../layout/PageWrapper'
import { Home, Calendar, Users, Settings } from 'lucide-react'
import '../../styles/admin.css'

export default function AdminLayout() {
  const location = useLocation()
  const selectedKey = location.pathname.includes('/admin/booking-schedule')
    ? 'booking'
    : location.pathname.includes('/admin/staff-schedule')
    ? 'staff'
    : 'dashboard'

  const nav = [
    { key: 'dashboard', icon: <Home size={18} />, label: 'Dashboard', to: '/admin' },
    { key: 'booking', icon: <Calendar size={18} />, label: 'Lịch Hẹn', to: '/admin/booking-schedule' },
    { key: 'staff', icon: <Users size={18} />, label: 'Nhân sự', to: '/admin/staff-schedule' },
    { key: 'settings', icon: <Settings size={18} />, label: 'Cài đặt', to: '/admin' },
  ]

  return (
    <PageWrapper title="Admin">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-72 hidden lg:block">
            <div className="bg-dark-900 border border-dark-800 rounded-xl p-4 sticky top-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-md bg-gold-500 flex items-center justify-center font-bold text-dark-950">AW</div>
                <div>
                  <div className="font-semibold">AutoWash Pro</div>
                  <div className="text-sm text-text-secondary">Quản lý</div>
                </div>
              </div>

              <nav className="mt-2 space-y-1">
                {nav.map((n) => (
                  <Link key={n.key} to={n.to} className={`flex items-center gap-3 p-3 rounded-md transition-colors ${selectedKey === n.key ? 'bg-gold-500/10 border-l-4 border-gold-400 text-gold-300' : 'text-text-secondary hover:bg-dark-800'}`}>
                    <div className="text-gold-300">{n.icon}</div>
                    <div className="font-medium">{n.label}</div>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="text-lg font-semibold">Bảng điều khiển</div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-dark-800 w-10 h-10 flex items-center justify-center">A</div>
                <div className="text-sm">Admin</div>
              </div>
            </div>

            <div className="bg-dark-900 border border-dark-800 rounded-xl p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
