import { useNavigate } from 'react-router-dom'
import { BarChart3, ChevronLeft, TrendingUp, TrendingDown, Car, Clock, Star, Zap, Award } from 'lucide-react'

const STATS = {
  today:   { cars: 6, hours: 5, avgTime: 32, rating: 4.9 },
  week:    { cars: 24, hours: 35, avgTime: 29, rating: 4.8 },
  month:   { cars: 98, hours: 140, avgTime: 31, rating: 4.85 },
}
const SERVICE_BREAKDOWN = [
  { name: 'Eco Wash',          count: 12, pct: 12, color: 'bg-cyan-500',    text: 'text-cyan-400'    },
  { name: 'Premium Care',      count: 34, pct: 35, color: 'bg-purple-500',  text: 'text-purple-400'  },
  { name: 'Detailing & Shine', count: 42, pct: 43, color: 'bg-emerald-500', text: 'text-emerald-400' },
  { name: 'Ceramic Shield',    count: 10, pct: 10, color: 'bg-amber-500',   text: 'text-amber-400'   },
]
const RECENT = [
  { date: '20/06', car: '29C-888.88', service: 'Detailing & Shine', time: 58, ok: true  },
  { date: '20/06', car: '30A-123.45', service: 'Eco Wash',          time: 14, ok: true  },
  { date: '19/06', car: '51F-111.11', service: 'Premium Care',       time: 33, ok: false },
  { date: '19/06', car: '60A-999.99', service: 'Ceramic Shield',     time: 122,ok: true  },
  { date: '18/06', car: '29C-000.11', service: 'Eco Wash',          time: 15, ok: true  },
]

export default function StaffStats() {
  const navigate = useNavigate()
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto font-body text-white">

      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <button onClick={() => navigate('/staff')} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-hero text-2xl font-medium tracking-tight flex items-center gap-3">
            <BarChart3 className="text-cyan-400" size={24} />
            Thống kê cá nhân
          </h1>
          <p className="text-white/40 text-sm font-mono mt-0.5">NV-01 · Nguyễn Văn Tèo</p>
        </div>
      </div>

      {/* Period tabs — always show month for simplicity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Today */}
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-5">
          <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mb-4">Hôm nay</p>
          <div className="space-y-4">
            {[
              { label: 'Xe phục vụ', value: STATS.today.cars, unit: 'xe', icon: Car, color: 'text-cyan-400' },
              { label: 'Giờ làm việc', value: `${STATS.today.hours}h`, unit: '', icon: Clock, color: 'text-white' },
              { label: 'TG trung bình/xe', value: `${STATS.today.avgTime}p`, unit: '', icon: Zap, color: 'text-amber-400' },
              { label: 'Đánh giá', value: STATS.today.rating, unit: '/5', icon: Star, color: 'text-yellow-400' },
            ].map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/50">
                    <Icon size={14} className="text-white/30" />
                    <span className="text-sm">{s.label}</span>
                  </div>
                  <span className={`text-lg font-mono font-medium ${s.color}`}>{s.value}{s.unit}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Week */}
        <div className="bg-neutral-950 border border-cyan-500/10 rounded-2xl p-5">
          <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest mb-4">Tuần này</p>
          <div className="space-y-4">
            {[
              { label: 'Xe phục vụ', value: STATS.week.cars, unit: 'xe', icon: Car, color: 'text-cyan-400' },
              { label: 'Giờ làm việc', value: `${STATS.week.hours}h`, unit: '', icon: Clock, color: 'text-white' },
              { label: 'TG trung bình/xe', value: `${STATS.week.avgTime}p`, unit: '', icon: Zap, color: 'text-amber-400' },
              { label: 'Đánh giá', value: STATS.week.rating, unit: '/5', icon: Star, color: 'text-yellow-400' },
            ].map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/50">
                    <Icon size={14} className="text-white/30" />
                    <span className="text-sm">{s.label}</span>
                  </div>
                  <span className={`text-lg font-mono font-medium ${s.color}`}>{s.value}{s.unit}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Month */}
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-5">
          <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mb-4">Tháng này</p>
          <div className="space-y-4">
            {[
              { label: 'Xe phục vụ', value: STATS.month.cars, unit: 'xe', icon: Car, color: 'text-cyan-400' },
              { label: 'Giờ làm việc', value: `${STATS.month.hours}h`, unit: '', icon: Clock, color: 'text-white' },
              { label: 'TG trung bình/xe', value: `${STATS.month.avgTime}p`, unit: '', icon: Zap, color: 'text-amber-400' },
              { label: 'Đánh giá', value: STATS.month.rating, unit: '/5', icon: Star, color: 'text-yellow-400' },
            ].map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/50">
                    <Icon size={14} className="text-white/30" />
                    <span className="text-sm">{s.label}</span>
                  </div>
                  <span className={`text-lg font-mono font-medium ${s.color}`}>{s.value}{s.unit}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Service breakdown */}
      <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6">
        <h3 className="font-medium text-white mb-5 flex items-center gap-2">
          <Award size={18} className="text-white/40" /> Phân bổ dịch vụ (tháng này)
        </h3>
        <div className="space-y-4">
          {SERVICE_BREAKDOWN.map((s, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white/70">{s.name}</span>
                <div className="flex items-center gap-3">
                  <span className={`font-mono ${s.text}`}>{s.count} xe</span>
                  <span className="text-white/30 font-mono text-xs w-10 text-right">{s.pct}%</span>
                </div>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%`, transition: 'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent history */}
      <div className="bg-neutral-950 border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <h3 className="font-medium text-white text-sm">Xe gần đây</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="border-b border-white/5 bg-black/20">
                {['Ngày', 'Biển số', 'Dịch vụ', 'Thời gian', 'Kết quả'].map(h => (
                  <th key={h} className="px-5 py-3 text-[10px] font-mono tracking-widest text-white/30 text-left uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT.map((r, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-xs text-white/40 font-mono">{r.date}</td>
                  <td className="px-5 py-3"><span className="font-mono text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white">{r.car}</span></td>
                  <td className="px-5 py-3 text-sm text-white/70">{r.service}</td>
                  <td className="px-5 py-3 text-sm font-mono text-white">{r.time}p</td>
                  <td className="px-5 py-3">
                    <span className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${r.ok ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10'}`}>
                      {r.ok ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {r.ok ? 'Đúng giờ' : 'Trễ hẹn'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
