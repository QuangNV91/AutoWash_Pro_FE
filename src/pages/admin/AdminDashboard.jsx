import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, DollarSign, Car, Clock, CheckCircle2,
  Calendar, Users, ArrowUpRight, BarChart3, Droplets
} from 'lucide-react';

// ============ MOCK DATA ============

const STATS = [
  {
    label: 'Doanh thu hôm nay',
    value: '2.450.000đ',
    change: '+12%',
    trend: 'up',
    icon: DollarSign,
    color: 'emerald',
  },
  {
    label: 'Booking hôm nay',
    value: '18',
    change: '+3',
    trend: 'up',
    icon: Calendar,
    color: 'cyan',
  },
  {
    label: 'Xe đang chờ',
    value: '4',
    change: '',
    trend: 'neutral',
    icon: Clock,
    color: 'amber',
  },
  {
    label: 'Đã hoàn thành',
    value: '14',
    change: '+2',
    trend: 'up',
    icon: CheckCircle2,
    color: 'purple',
  },
];

const RECENT_BOOKINGS = [
  { id: 'BKG-10312', customer: 'Nguyễn Văn An', service: 'Premium Care', time: '09:00', status: 'WORKING', price: 150000 },
  { id: 'BKG-10311', customer: 'Trần Thị Bình', service: 'Eco Wash', time: '09:15', status: 'PENDING', price: 40000 },
  { id: 'BKG-10310', customer: 'Lê Hoàng Cường', service: 'Detailing & Shine', time: '08:00', status: 'COMPLETED', price: 350000 },
  { id: 'BKG-10309', customer: 'Phạm Minh Đức', service: 'Ceramic Shield', time: '07:00', status: 'COMPLETED', price: 800000 },
  { id: 'BKG-10308', customer: 'Võ Thị Em', service: 'Premium Care', time: '07:30', status: 'COMPLETED', price: 150000 },
];

const SERVICE_POPULARITY = [
  { name: 'Eco Wash', count: 142, percent: 40, color: 'bg-cyan-500' },
  { name: 'Premium Care', count: 98, percent: 28, color: 'bg-purple-500' },
  { name: 'Detailing & Shine', count: 73, percent: 21, color: 'bg-emerald-500' },
  { name: 'Ceramic Shield', count: 38, percent: 11, color: 'bg-amber-500' },
];

const WEEKLY_REVENUE = [
  { day: 'T2', value: 1800000, height: 60 },
  { day: 'T3', value: 2200000, height: 73 },
  { day: 'T4', value: 1950000, height: 65 },
  { day: 'T5', value: 2800000, height: 93 },
  { day: 'T6', value: 3000000, height: 100 },
  { day: 'T7', value: 2450000, height: 82 },
  { day: 'CN', value: 1200000, height: 40 },
];

const STAFF_ON_DUTY = [
  { name: 'Nguyễn Văn Tèo', shift: 'Ca 1 (07:00-12:00)', status: 'active' },
  { name: 'Trần Văn Tí', shift: 'Ca 1 (07:00-12:00)', status: 'active' },
];

// ============ SUB COMPONENTS ============

const StatCard = ({ stat }) => {
  const Icon = stat.icon;
  const colorMap = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  const iconBg = colorMap[stat.color] || colorMap.cyan;

  return (
    <div className="bg-neutral-950 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${iconBg}`}>
          <Icon size={20} />
        </div>
        {stat.trend === 'up' && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
            <TrendingUp size={12} />
            {stat.change}
          </span>
        )}
        {stat.trend === 'down' && (
          <span className="flex items-center gap-1 text-xs font-medium text-red-400 bg-red-400/10 px-2 py-1 rounded-lg">
            <TrendingDown size={12} />
            {stat.change}
          </span>
        )}
      </div>
      <p className="text-2xl font-medium text-white tracking-tight">{stat.value}</p>
      <p className="text-sm text-white/40 mt-1">{stat.label}</p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    PENDING: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    WORKING: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    COMPLETED: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    CANCELLED: 'text-red-400 bg-red-400/10 border-red-400/20',
  };
  const labels = {
    PENDING: 'Chờ xác nhận',
    WORKING: 'Đang rửa',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${config[status] || config.PENDING}`}>
      {labels[status] || status}
    </span>
  );
};

// ============ MAIN COMPONENT ============

export default function AdminDashboard() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-hero text-3xl font-medium text-white tracking-tight">Dashboard</h1>
          <p className="text-white/40 mt-1 text-sm capitalize">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/booking-schedule')}
            className="px-5 py-2.5 bg-white text-black text-sm font-medium rounded-full hover:bg-neutral-200 transition-colors flex items-center gap-2"
          >
            <Calendar size={16} />
            Xem lịch hẹn
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <StatCard key={i} stat={stat} />
        ))}
      </div>

      {/* Charts + Recent Bookings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Revenue Chart */}
        <div className="lg:col-span-2 bg-neutral-950 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-hero text-lg font-medium text-white tracking-tight">Doanh thu tuần này</h3>
              <p className="text-sm text-white/40 mt-0.5">Tổng: 15.400.000đ</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-3 py-1.5 rounded-lg">
              <TrendingUp size={14} />
              +8.2%
            </div>
          </div>

          <div className="flex items-end justify-between gap-3 h-48">
            {WEEKLY_REVENUE.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative group">
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-medium px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {(item.value / 1000000).toFixed(1)}M
                  </div>
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      item.day === 'T7' ? 'bg-white' : 'bg-white/15 hover:bg-white/25'
                    }`}
                    style={{ height: `${item.height * 1.8}px` }}
                  />
                </div>
                <span className={`text-xs font-medium ${item.day === 'T7' ? 'text-white' : 'text-white/40'}`}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Service Popularity */}
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-hero text-lg font-medium text-white tracking-tight">Gói dịch vụ phổ biến</h3>
            <BarChart3 size={18} className="text-white/20" />
          </div>

          <div className="space-y-5">
            {SERVICE_POPULARITY.map((service, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">{service.name}</span>
                  <span className="text-sm font-medium text-white">{service.count} lượt</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${service.color}`}
                    style={{ width: `${service.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <p className="text-xs text-white/30">Tổng lượt sử dụng tháng này: <span className="text-white/60 font-medium">351</span></p>
          </div>
        </div>
      </div>

      {/* Recent Bookings + Staff On Duty */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 bg-neutral-950 border border-white/5 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h3 className="font-hero text-lg font-medium text-white tracking-tight">Booking gần đây</h3>
            <button
              onClick={() => navigate('/admin/booking-schedule')}
              className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors"
            >
              Xem tất cả <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-medium text-white/30 uppercase tracking-wider px-6 py-3">Mã đơn</th>
                  <th className="text-left text-xs font-medium text-white/30 uppercase tracking-wider px-4 py-3">Khách hàng</th>
                  <th className="text-left text-xs font-medium text-white/30 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Dịch vụ</th>
                  <th className="text-left text-xs font-medium text-white/30 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Giờ</th>
                  <th className="text-left text-xs font-medium text-white/30 uppercase tracking-wider px-4 py-3">Trạng thái</th>
                  <th className="text-right text-xs font-medium text-white/30 uppercase tracking-wider px-6 py-3">Giá</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_BOOKINGS.map((booking) => (
                  <tr key={booking.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5">
                      <span className="text-sm font-mono text-white/60">{booking.id}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-medium text-white">{booking.customer}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-sm text-white/60">{booking.service}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-white/60">{booking.time}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="text-sm font-medium text-white">{booking.price.toLocaleString('vi-VN')}đ</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff On Duty + Quick Info */}
        <div className="space-y-6">
          {/* Staff On Duty */}
          <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-hero text-lg font-medium text-white tracking-tight">Nhân viên đang trực</h3>
              <Users size={18} className="text-white/20" />
            </div>
            <div className="space-y-3">
              {STAFF_ON_DUTY.map((staff, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{staff.name}</p>
                    <p className="text-xs text-white/40">{staff.shift}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6">
            <h3 className="font-hero text-lg font-medium text-white tracking-tight mb-5">Tổng quan tháng</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">Tổng booking</span>
                <span className="text-sm font-medium text-white">351</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">Doanh thu tháng</span>
                <span className="text-sm font-medium text-white">42.8M đ</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">Khách hàng mới</span>
                <span className="text-sm font-medium text-white">28</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">Tỉ lệ hủy</span>
                <span className="text-sm font-medium text-emerald-400">3.2%</span>
              </div>
              <div className="h-px bg-white/5 my-1" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">Điểm đánh giá TB</span>
                <span className="text-sm font-medium text-amber-400">⭐ 4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}