import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function ReportDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/v1/dashboard?filter=month');
        if (res.data && res.data.data) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load report data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  const revenue = Number(data?.totalRevenue || 0);
  const formattedRevenue = revenue >= 1000000 ? (revenue / 1000000).toFixed(1) + 'M' : revenue.toLocaleString('vi-VN');
  
  const totalCars = data?.totalBookingsToday || 0;
  
  // Calculate unique customers from schedule
  const uniqueCustomers = new Set();
  (data?.todaySchedule || []).forEach(s => {
    if (s.customer !== 'Khach vang lai') uniqueCustomers.add(s.customer);
  });
  const newCustomers = uniqueCustomers.size;
  
  const breakdownList = data?.revenueBreakdown || [];

  const KPIS = [
    { label: 'TỔNG DOANH THU', value: formattedRevenue, color: 'text-emerald-400', border: 'border-emerald-500/20' },
    { label: 'TỔNG LƯỢT XE', value: totalCars, color: 'text-cyan-400', border: 'border-cyan-500/20' },
    { label: 'KHÁCH HÀNG', value: newCustomers, color: 'text-red-400', border: 'border-red-500/20' },
    { label: 'TỈ LỆ LẤP ĐẦY', value: Math.min(100, Math.round((totalCars / 300) * 100)) + '%', color: 'text-amber-400', border: 'border-amber-500/20' },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-[1400px] mx-auto font-body text-white selection:bg-cyan-500/30">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-cyan-400" size={28} />
            <h1 className="font-hero text-3xl font-medium tracking-tight">Báo cáo Phân tích</h1>
          </div>
          <p className="text-white/40 text-sm font-mono tracking-wide">SYSTEM.ANALYTICS // Hiệu suất kinh doanh toàn cảnh tháng này</p>
        </div>
        <div className="flex items-center gap-3 border border-white/10 bg-neutral-950 rounded-xl px-4 py-2">
          <Calendar size={16} className="text-white/40" />
          <span className="text-sm font-mono tracking-widest text-white/80">Tháng {new Date().getMonth() + 1} / {new Date().getFullYear()}</span>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((kpi, i) => (
          <div key={i} className={`bg-neutral-950 border border-white/5 rounded-2xl p-5 border-t-2 hover:bg-white/[0.02] transition-colors ${kpi.border}`}>
            <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-2">{kpi.label}</p>
            <div className="flex items-end justify-between">
              <p className={`text-3xl font-hero ${kpi.color}`}>{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* TOP SERVICES */}
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6 flex flex-col">
          <h3 className="font-hero text-lg font-medium tracking-tight mb-6">Dịch vụ thịnh hành</h3>
          <div className="flex-1 space-y-6">
            {breakdownList.length === 0 ? (
               <div className="text-center text-white/40 font-mono text-sm py-12">Chưa có dữ liệu tháng này.</div>
            ) : breakdownList.map((s, i) => {
              const rev = s.revenue >= 1000000 ? (s.revenue / 1000000).toFixed(1) + 'M' : s.revenue.toLocaleString('vi-VN');
              return (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-white">{s.name}</span>
                  <span className="text-xs font-mono text-white/60">{rev}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{width: `${Math.max(5, s.percent)}%`}} />
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
}
