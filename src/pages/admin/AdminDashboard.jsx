import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, Clock, TrendingUp, TrendingDown, DollarSign, 
  Car, ShieldAlert, ArrowUpRight, CreditCard,
  Gauge, Activity, Play
} from 'lucide-react';

// ============ MOCK DATA ============

const ALERTS = [
  { id: 1, type: 'danger', message: 'CẢNH BÁO: Xe 51F-111.11 đã hoàn thành hơn 15 phút nhưng chưa thanh toán.', time: '14:20' },
  { id: 2, type: 'warning', message: 'VẬN HÀNH: Slot 15:00 - 16:00 đang trống 100%, có thể nhận thêm khách vãng lai.', time: '14:30' }
];

const METRICS = [
  { label: 'Doanh thu', value: '3.450.000', unit: 'đ', baseline: 'Hôm qua: 3.100.000đ', change: '+11.2%', isUp: true, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Xe trong sân', value: '3', unit: 'xe', baseline: 'Sức chứa an toàn: 8', change: 'Ổn định', isUp: true, icon: Car, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { label: 'Tiến độ ngày', value: '18/24', unit: 'slot', baseline: 'Hoàn thành / Tổng lịch', change: '75%', isUp: true, icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { label: 'Chờ thu tiền', value: '2', unit: 'xe', baseline: 'Tổng giá trị: 840.000đ', change: 'Cần chú ý', isUp: false, icon: CreditCard, color: 'text-red-400', bg: 'bg-red-500/10' }
];

const REVENUE_BREAKDOWN = [
  { name: 'Ceramic Shield', revenue: 1600000, count: 2, percent: 46, color: 'bg-amber-500', text: 'text-amber-400' },
  { name: 'Detailing & Shine', revenue: 1050000, count: 3, percent: 30, color: 'bg-emerald-500', text: 'text-emerald-400' },
  { name: 'Premium Care', revenue: 600000, count: 4, percent: 18, color: 'bg-purple-500', text: 'text-purple-400' },
  { name: 'Eco Wash', revenue: 200000, count: 5, percent: 6, color: 'bg-cyan-500', text: 'text-cyan-400' },
];

const LIVE_STAFF = [
  { 
    id: 'NV-01', name: 'Nguyễn Văn Tèo', status: 'WORKING', 
    car: '30A-123.45', service: 'Premium Care', 
    progress: 75, timeElapsed: '22', timeTotal: '30',
    accent: 'bg-cyan-500'
  },
  { 
    id: 'NV-02', name: 'Trần Văn Tí', status: 'WORKING', 
    car: '29C-888.88', service: 'Eco Wash', 
    progress: 33, timeElapsed: '5', timeTotal: '15',
    accent: 'bg-purple-500'
  }
];

const TODAY_SCHEDULE = [
  { id: 'BKG-10310', time: '13:00 - 14:00', plate: '51F-111.11', customer: 'Lê Hoàng Cường', service: 'Ceramic Shield', status: 'COMPLETED', payment: 'UNPAID', price: 800000 },
  { id: 'BKG-10311', time: '14:00 - 15:00', plate: '30A-123.45', customer: 'Nguyễn Văn An', service: 'Premium Care', status: 'WORKING', payment: 'PAID', price: 150000 },
  { id: 'BKG-10312', time: '14:00 - 15:00', plate: '29C-888.88', customer: 'Trần Thị Bình', service: 'Eco Wash', status: 'WORKING', payment: 'UNPAID', price: 40000 },
  { id: 'BKG-10313', time: '15:00 - 16:00', plate: '60A-999.99', customer: 'Phạm Minh Đức', service: 'Detailing & Shine', status: 'ARRIVED', payment: 'PAID', price: 350000 },
  { id: 'BKG-10314', time: '16:00 - 17:00', plate: 'Chưa cập nhật', customer: 'Võ Thị Em', service: 'Premium Care', status: 'PENDING', payment: 'UNPAID', price: 150000 },
];

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

// ============ SUB COMPONENTS ============

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
          {stat.isUp ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
          {stat.change}
        </span>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============

export default function AdminDashboard() {
  const navigate = useNavigate();

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
        <div className="bg-neutral-950 border border-white/10 px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.05)]">
          <LiveClock />
          <p className="text-[10px] text-white/30 text-right mt-1.5 font-mono uppercase tracking-widest">Thời gian hệ thống</p>
        </div>
      </div>

      {/* ALERTS BAR */}
      <div className="space-y-3">
        {ALERTS.map(alert => (
          <div key={alert.id} className={`flex items-start gap-4 p-4 rounded-xl border relative overflow-hidden ${alert.type === 'danger' ? 'bg-red-500/5 border-red-500/30' : 'bg-amber-500/5 border-amber-500/30'}`}>
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${alert.type === 'danger' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
            {alert.type === 'danger' ? <ShieldAlert className="text-red-400 mt-0.5 shrink-0" size={20}/> : <AlertTriangle className="text-amber-400 mt-0.5 shrink-0" size={20}/>}
            <div className="flex-1">
              <p className={`text-sm font-medium tracking-wide ${alert.type === 'danger' ? 'text-red-400' : 'text-amber-400'}`}>{alert.message}</p>
              <p className="text-[11px] font-mono mt-1 opacity-60 text-white">Ghi nhận lúc: {alert.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {METRICS.map((stat, i) => <StatCard key={i} stat={stat} />)}
      </div>

      {/* MIDDLE SECTION: LIVE OPERATIONS & REVENUE */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LIVE STAFF */}
        <div className="xl:col-span-2 bg-neutral-950 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div>
              <h3 className="font-hero text-xl text-white font-medium tracking-tight">Trạng thái Xưởng</h3>
              <p className="text-xs text-white/40 font-mono mt-1">SLOT HIỆN TẠI: 14:00 - 15:00</p>
            </div>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono tracking-widest text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/> LIVE
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LIVE_STAFF.map(staff => (
              <div key={staff.id} className="bg-black/40 border border-white/10 rounded-xl p-5 relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1 h-full ${staff.accent}`} />
                
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <span className="text-[10px] text-white/40 font-mono tracking-widest">{staff.id}</span>
                    <h4 className="text-white font-medium tracking-wide mt-0.5">{staff.name}</h4>
                  </div>
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono tracking-widest text-blue-400">
                    <Play size={10} className="fill-blue-400" /> WORKING
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                    <Car size={18} className="text-white/40" />
                    <div>
                      <span className="text-sm text-white font-mono block">{staff.car}</span>
                      <span className="text-[11px] text-white/50">{staff.service}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-white/50 mb-2">
                      <span>Đã làm: {staff.timeElapsed}p</span>
                      <span>Định mức: {staff.timeTotal}p</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${staff.accent}`} style={{width: `${staff.progress}%`}} />
                    </div>
                    <p className={`text-[10px] mt-2 text-right font-mono tracking-wide ${staff.accent.replace('bg-', 'text-')}`}>
                      Dự kiến xong: {staff.timeTotal - staff.timeElapsed} phút nữa
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REVENUE BREAKDOWN */}
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6 flex flex-col">
          <div className="mb-6 pb-4 border-b border-white/5">
            <h3 className="font-hero text-xl text-white font-medium tracking-tight">Cơ cấu Doanh thu</h3>
            <p className="text-xs text-white/40 font-mono mt-1">THEO DỊCH VỤ TRONG NGÀY</p>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-6">
            {REVENUE_BREAKDOWN.map((item, i) => (
              <div key={i}>
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <span className="text-sm text-white/80 block">{item.name}</span>
                    <span className="text-[10px] font-mono text-white/40">{item.count} xe thực hiện</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono text-white block">{item.revenue.toLocaleString('vi-VN')}đ</span>
                    <span className={`text-[10px] font-mono ${item.text}`}>{item.percent}% tổng thu</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FULL SCHEDULE TABLE */}
      <div className="bg-neutral-950 border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <Clock className="text-white/40" size={20} />
            <h3 className="font-hero text-lg font-medium text-white tracking-tight">Nhật ký Phục vụ</h3>
          </div>
          <button
            onClick={() => navigate('/admin/booking-schedule')}
            className="flex items-center gap-1.5 text-xs font-mono tracking-widest text-white/40 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded bg-black/50"
          >
            ĐI TỚI ĐIỀU PHỐI <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
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
              {TODAY_SCHEDULE.map((booking, idx) => (
                <tr key={booking.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-white/60">{booking.time}</td>
                  <td className="px-6 py-4">
                    <div className="inline-block px-2 py-1 bg-white/5 border border-white/10 rounded text-white tracking-wider">
                      {booking.plate}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/80 font-body">{booking.service}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-[10px] tracking-widest border ${STATUS_CONFIG[booking.status].style}`}>
                      {STATUS_CONFIG[booking.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-white">
                    {booking.price.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-block px-2 py-1 rounded text-[10px] tracking-widest border ${PAYMENT_CONFIG[booking.payment].style}`}>
                      {PAYMENT_CONFIG[booking.payment].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}