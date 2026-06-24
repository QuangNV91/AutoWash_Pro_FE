import { useState } from 'react';
import { Users, Search, Filter, Shield, Phone, Car } from 'lucide-react';

const CUSTOMERS = [
  { id: 'CUST-001', name: 'Lê Hoàng Cường', phone: '0901234567', plate: '51F-111.11', tier: 'PLATINUM', points: 1500, spent: 15000000, lastVisit: '12/06/2026' },
  { id: 'CUST-002', name: 'Nguyễn Văn An', phone: '0988777666', plate: '30A-123.45', tier: 'GOLD', points: 800, spent: 8500000, lastVisit: '14/06/2026' },
  { id: 'CUST-003', name: 'Trần Thị Bình', phone: '0912345678', plate: '29C-888.88', tier: 'SILVER', points: 200, spent: 2500000, lastVisit: '10/06/2026' },
  { id: 'CUST-004', name: 'Phạm Minh Đức', phone: '0933444555', plate: '60A-999.99', tier: 'MEMBER', points: 50, spent: 600000, lastVisit: '14/06/2026' },
];

const TIER_COLORS = {
  PLATINUM: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  GOLD: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  SILVER: 'text-slate-300 bg-slate-500/10 border-slate-500/30',
  MEMBER: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
};

export default function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-[1400px] mx-auto font-body text-white selection:bg-cyan-500/30">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-cyan-400" size={28} />
            <h1 className="font-hero text-3xl font-medium tracking-tight">Hồ sơ Khách hàng</h1>
          </div>
          <p className="text-white/40 text-sm font-mono tracking-wide">SYSTEM.CRM // Quản lý data và định danh</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input 
              type="text" 
              placeholder="Tìm tên, SĐT, biển số..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none font-mono"
            />
          </div>
          <button className="px-4 py-2 bg-neutral-950 border border-white/10 rounded-xl text-white/60 hover:text-white transition-colors flex items-center gap-2">
            <Filter size={16} /> Lọc
          </button>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-1">Tổng khách hàng</p>
            <p className="text-3xl font-hero text-cyan-400">1,248</p>
          </div>
          <Users size={32} className="text-white/5" />
        </div>
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-1">Khách quay lại (Retention)</p>
            <p className="text-3xl font-hero text-emerald-400">68%</p>
          </div>
          <Shield size={32} className="text-white/5" />
        </div>
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-1">Doanh thu trung bình/Khách</p>
            <p className="text-3xl font-hero text-purple-400">1.2M</p>
          </div>
          <Car size={32} className="text-white/5" />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-neutral-950 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-black/20">
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase">Khách hàng</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase">Liên hệ</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase">Biển số</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase">Hạng thẻ</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase text-right">Tổng chi tiêu</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase text-right">Tương tác cuối</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {CUSTOMERS.map((customer) => (
                <tr key={customer.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs text-white/60">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{customer.name}</div>
                        <div className="text-[10px] font-mono text-white/40">{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-white/60 font-mono text-xs">
                      <Phone size={12} /> {customer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 bg-white/5 border border-white/10 rounded text-white tracking-wider font-mono text-xs">
                      {customer.plate}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-mono tracking-widest border ${TIER_COLORS[customer.tier]}`}>
                      {customer.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-white">{customer.spent.toLocaleString('vi-VN')}đ</div>
                    <div className="text-[10px] font-mono text-cyan-400 mt-0.5">{customer.points} Pts</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-white/60 font-mono text-xs">{customer.lastVisit}</div>
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
