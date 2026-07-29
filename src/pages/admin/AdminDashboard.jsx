import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, Clock, TrendingUp, TrendingDown, DollarSign,
  Car, ShieldAlert, ArrowUpRight, CreditCard,
  Gauge, Activity, Play, Loader2, Calendar
} from 'lucide-react';
import api from '../../services/api';

const ALERTS = [];

const STATUS_CONFIG = {
  PENDING: { label: 'LỊCH HẸN', style: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  ARRIVED: { label: 'ĐÃ ĐẾN', style: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  WORKING: { label: 'ĐANG LÀM', style: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  COMPLETED: { label: 'HOÀN THÀNH', style: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
};

const PAYMENT_CONFIG = {
  UNPAID: { label: 'CHƯA TT', style: 'text-red-400 bg-red-400/10 border-red-400/20' },
  PAID: { label: 'ĐÃ TT', style: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' }
};

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-mono text-3xl font-light tracking-tight text-cyan-400 flex items-center gap-3">
      <Clock size={24} className="text-cyan-500/50" />
      {time.toLocaleTimeString('vi-VN', { hour12: false })}
    </div>
  );
};

const StatCard = ({ stat }) => {
  const Icon = stat.icon;
  return (
    <div className="bg-neutral-950 border border-white/5 hover:border-white/10 transition-all duration-300 rounded-2xl p-5 group flex flex-col justify-between">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[11px] text-white/40 font-mono tracking-widest uppercase mb-1">{stat.label}</p>
          <div className="flex items-baseline gap-1">
            <h3 className={`text-3xl font-hero tracking-tight ${stat.color}`}>{stat.value}</h3>
            <span className="text-sm font-mono text-white/40">{stat.unit}</span>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="flex justify-between items-end mt-2 pt-4 border-t border-white/5">
        <span className="text-[10px] text-white/30 font-mono tracking-wide">{stat.baseline}</span>
        <span className={`flex items-center gap-1 text-[10px] font-mono tracking-widest px-2 py-1 rounded bg-white/5 ${stat.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {stat.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {stat.change}
        </span>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('today');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/v1/dashboard?filter=${filter}`);
        if (res.data && res.data.data) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  const METRICS = [
    {
      label: filter === 'month' ? 'Doanh thu Tháng' : filter === 'week' ? 'Doanh thu Tuần' : 'Doanh thu Hôm nay',
      value: Number(data?.totalRevenue || 0).toLocaleString('vi-VN'),
      unit: 'đ', baseline: 'Cập nhật realtime', change: 'Live', isUp: true,
      icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10'
    },
    {
      label: 'Xe trong sân',
      value: data?.carsInShop || 0,
      unit: 'xe', baseline: 'Đang phục vụ / Đã đến', change: 'Live', isUp: true,
      icon: Car, color: 'text-amber-400', bg: 'bg-amber-500/10'
    },
    {
      label: 'Tiến độ',
      value: `${data?.completedBookings || 0}/${data?.totalBookingsToday || 0}`,
      unit: 'đơn', baseline: 'Hoàn thành / Tổng lịch', change: 'Live', isUp: true,
      icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10'
    },
    {
      label: 'Chờ thu tiền',
      value: data?.pendingPayments || 0,
      unit: 'xe', baseline: 'Xe đang làm / Hoàn thành', change: 'Live', isUp: false,
      icon: CreditCard, color: 'text-red-400', bg: 'bg-red-500/10'
    }
  ];

  const scheduleList = data?.todaySchedule || [];
  const breakdownList = data?.revenueBreakdown || [];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto font-body selection:bg-cyan-500/30">

      {/* HEADER & CLOCK */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Gauge className="text-cyan-400" size={28} />
            <h1 className="font-hero text-3xl font-medium text-white tracking-tight">Trung tâm Điều hành</h1>
          </div>
          <p className="text-white/40 text-sm font-mono tracking-wide">SYSTEM.DASHBOARD // Trạng thái xưởng thời gian thực</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-neutral-950 border border-white/10 p-1.5 rounded-xl flex items-center gap-1 shadow-[0_0_20px_rgba(6,182,212,0.05)]">
            <button
              onClick={() => setFilter('today')}
              className={`px-4 py-2 rounded-lg text-xs font-mono tracking-widest transition-all ${filter === 'today' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-white/50 hover:text-white'}`}
            >
              HÔM NAY
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`px-4 py-2 rounded-lg text-xs font-mono tracking-widest transition-all ${filter === 'week' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-white/50 hover:text-white'}`}
            >
              TUẦN NÀY
            </button>
            <button
              onClick={() => setFilter('month')}
              className={`px-4 py-2 rounded-lg text-xs font-mono tracking-widest transition-all ${filter === 'month' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-white/50 hover:text-white'}`}
            >
              THÁNG NÀY
            </button>
          </div>

          <div className="bg-neutral-950 border border-white/10 px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.05)] hidden lg:block">
            <LiveClock />
            <p className="text-[10px] text-white/30 text-right mt-1.5 font-mono uppercase tracking-widest">Thời gian hệ thống</p>
          </div>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {METRICS.map((stat, i) => <StatCard key={i} stat={stat} />)}
      </div>

      {/* MIDDLE SECTION: LIVE OPERATIONS & REVENUE */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* REVENUE BREAKDOWN CHART */}
        <div className="xl:col-span-2 bg-neutral-950 border border-white/5 rounded-2xl p-6 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-cyan-500/10 transition-all duration-700 pointer-events-none" />

          <div className="mb-8 pb-4 border-b border-white/5 relative">
            <h3 className="font-hero text-xl text-white font-medium tracking-tight">Cơ cấu Doanh thu</h3>
            <p className="text-xs text-white/40 font-mono mt-1">BIỂU ĐỒ THEO DỊCH VỤ TRONG {filter === 'month' ? 'THÁNG' : filter === 'week' ? 'TUẦN' : 'NGÀY'}</p>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-6 relative">
            {breakdownList.length === 0 ? (
              <div className="text-center text-white/40 font-mono text-sm py-12">Chưa có dữ liệu doanh thu.</div>
            ) : (
              breakdownList.map((item, i) => (
                <div key={i} className="group/item">
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <span className="text-sm font-medium text-white/90 block group-hover/item:text-white transition-colors">{item.name}</span>
                      <span className="text-[10px] font-mono text-white/40">{item.count} xe thực hiện</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono text-white block">{item.revenue.toLocaleString('vi-VN')}đ</span>
                      <span className={`text-[10px] font-mono ${item.text}`}>{item.percent.toFixed(1)}% tổng thu</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className={`h-full rounded-full ${item.color} group-hover/item:brightness-125 transition-all duration-1000 ease-out relative`} style={{ width: `${item.percent}%` }}>
                      <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-transparent to-white/20" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ALERTS */}
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6 flex flex-col">
          <div className="mb-6 pb-4 border-b border-white/5">
            <h3 className="font-hero text-xl text-white font-medium tracking-tight">Thông báo Hệ thống</h3>
          </div>
          <div className="flex-1 flex flex-col space-y-3">
            {ALERTS.length === 0 ? (
              <div className="text-center text-white/40 font-mono text-sm py-12">Không có thông báo mới.</div>
            ) : (
              ALERTS.map(alert => (
                <div key={alert.id} className={`flex items-start gap-4 p-4 rounded-xl border relative overflow-hidden ${alert.type === 'danger' ? 'bg-red-500/5 border-red-500/30' : 'bg-amber-500/5 border-amber-500/30'}`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${alert.type === 'danger' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
                  {alert.type === 'danger' ? <ShieldAlert className="text-red-400 mt-0.5 shrink-0" size={20} /> : <AlertTriangle className="text-amber-400 mt-0.5 shrink-0" size={20} />}
                  <div className="flex-1">
                    <p className={`text-sm font-medium tracking-wide ${alert.type === 'danger' ? 'text-red-400' : 'text-amber-400'}`}>{alert.message}</p>
                    <p className="text-[11px] font-mono mt-1 opacity-60 text-white">Lúc: {alert.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* FULL SCHEDULE TABLE */}
      <div className="bg-neutral-950 border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <Clock className="text-white/40" size={20} />
            <h3 className="font-hero text-lg font-medium text-white tracking-tight">
              Nhật ký Phục vụ {filter === 'month' ? 'Tháng Này' : filter === 'week' ? 'Tuần Này' : 'Hôm Nay'}
            </h3>
          </div>
          <button
            onClick={() => navigate('/admin/booking-schedule')}
            className="flex items-center gap-1.5 text-xs font-mono tracking-widest text-white/40 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded bg-black/50"
          >
            ĐI TỚI ĐIỀU PHỐI <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-neutral-950 z-10 shadow-md">
              <tr className="border-b border-white/5 bg-black/20">
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase">Khung giờ</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase">Biển số</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase">Dịch vụ</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase text-right">Tổng tiền</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase text-right">Thanh toán</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              {scheduleList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-white/40 font-mono text-sm">
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                scheduleList.map((booking, idx) => (
                  <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-white/60 whitespace-nowrap">{booking.time}</td>
                    <td className="px-6 py-4">
                      <div className="inline-block px-2 py-1 bg-white/5 border border-white/10 rounded text-white tracking-wider">
                        {booking.plate}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/80 font-body">{booking.service}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded text-[10px] tracking-widest border ${STATUS_CONFIG[booking.status]?.style || STATUS_CONFIG['PENDING'].style}`}>
                        {STATUS_CONFIG[booking.status]?.label || booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-white">
                      {booking.price?.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-block px-2 py-1 rounded text-[10px] tracking-widest border ${PAYMENT_CONFIG[booking.payment]?.style || PAYMENT_CONFIG['UNPAID'].style}`}>
                        {PAYMENT_CONFIG[booking.payment]?.label || booking.payment}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
