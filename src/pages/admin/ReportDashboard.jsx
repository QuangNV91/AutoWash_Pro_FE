import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

export default function ReportDashboard() {
  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-[1400px] mx-auto font-body text-white selection:bg-cyan-500/30">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-cyan-400" size={28} />
            <h1 className="font-hero text-3xl font-medium tracking-tight">Báo cáo Phân tích</h1>
          </div>
          <p className="text-white/40 text-sm font-mono tracking-wide">SYSTEM.ANALYTICS // Hiệu suất kinh doanh toàn cảnh</p>
        </div>
        <div className="flex items-center gap-3 border border-white/10 bg-neutral-950 rounded-xl px-4 py-2">
          <Calendar size={16} className="text-white/40" />
          <span className="text-sm font-mono tracking-widest text-white/80">Tháng 06 / 2026</span>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'TỔNG DOANH THU', value: '145.5M', change: '+12.5%', isUp: true, color: 'text-emerald-400', border: 'border-emerald-500/20' },
          { label: 'TỔNG LƯỢT XE', value: '420', change: '+5.2%', isUp: true, color: 'text-cyan-400', border: 'border-cyan-500/20' },
          { label: 'KHÁCH HÀNG MỚI', value: '85', change: '-2.1%', isUp: false, color: 'text-red-400', border: 'border-red-500/20' },
          { label: 'TỈ LỆ TRỐNG LỊCH', value: '15%', change: '-5.0%', isUp: true, color: 'text-amber-400', border: 'border-amber-500/20' },
        ].map((kpi, i) => (
          <div key={i} className={`bg-neutral-950 border border-white/5 rounded-2xl p-5 border-t-2 hover:bg-white/[0.02] transition-colors ${kpi.border}`}>
            <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-2">{kpi.label}</p>
            <div className="flex items-end justify-between">
              <p className={`text-3xl font-hero ${kpi.color}`}>{kpi.value}</p>
              <div className={`flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded bg-white/5 ${kpi.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {kpi.isUp ? <TrendingUp size={12}/> : <TrendingUp size={12} className="rotate-180"/>} {kpi.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART MOCK 1 */}
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6 h-[400px] flex flex-col">
          <h3 className="font-hero text-lg font-medium tracking-tight mb-6">Biểu đồ Doanh thu (4 tuần)</h3>
          <div className="flex-1 flex items-end justify-between gap-2 border-b border-white/5 pb-4">
            {/* Simple CSS Bar Chart Mock */}
            {[40, 60, 45, 80, 50, 75, 90, 65, 85, 55, 70, 95].map((h, i) => (
              <div key={i} className="w-full bg-cyan-500/20 rounded-t-sm hover:bg-cyan-500/40 transition-colors relative group" style={{height: `${h}%`}}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-mono px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}M
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-mono text-white/40">
            <span>Tuần 1</span>
            <span>Tuần 2</span>
            <span>Tuần 3</span>
            <span>Tuần 4</span>
          </div>
        </div>

        {/* TOP SERVICES */}
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6 flex flex-col">
          <h3 className="font-hero text-lg font-medium tracking-tight mb-6">Dịch vụ thịnh hành</h3>
          <div className="flex-1 space-y-6">
            {[
              { name: 'Ceramic Shield', percent: 65, color: 'bg-amber-500', rev: '65.5M' },
              { name: 'Premium Care', percent: 45, color: 'bg-purple-500', rev: '45.0M' },
              { name: 'Detailing & Shine', percent: 30, color: 'bg-emerald-500', rev: '30.2M' },
              { name: 'Eco Wash', percent: 15, color: 'bg-cyan-500', rev: '15.8M' },
            ].map((s, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-white">{s.name}</span>
                  <span className="text-xs font-mono text-white/60">{s.rev}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{width: `${s.percent}%`}} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
