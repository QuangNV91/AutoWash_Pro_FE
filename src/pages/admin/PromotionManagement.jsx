import { useState } from 'react';
import { Tag, Plus, Ticket, Percent, Power, DollarSign } from 'lucide-react';

const PROMOS = [
  { id: 'PRM-001', code: 'SUMMER2026', type: 'PERCENT', value: 20, maxDiscount: 100000, usage: 45, limit: 100, isActive: true },
  { id: 'PRM-002', code: 'NEWBIE50K', type: 'FIXED', value: 50000, maxDiscount: 50000, usage: 120, limit: 200, isActive: true },
  { id: 'PRM-003', code: 'WASHFREE', type: 'PERCENT', value: 100, maxDiscount: 50000, usage: 50, limit: 50, isActive: false },
];

export default function PromotionManagement() {
  const [promos, setPromos] = useState(PROMOS);

  const handleToggle = (id) => {
    setPromos(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-[1400px] mx-auto font-body text-white selection:bg-cyan-500/30">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Tag className="text-cyan-400" size={28} />
            <h1 className="font-hero text-3xl font-medium tracking-tight">Voucher & Khuyến mãi</h1>
          </div>
          <p className="text-white/40 text-sm font-mono tracking-wide">SYSTEM.MARKETING // Quản lý chiến dịch ưu đãi</p>
        </div>
        <button className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-cyan-500/10 text-cyan-400 font-medium text-sm rounded-xl border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] font-mono uppercase tracking-widest">
          <Plus size={16} />
          <span>TẠO MÃ MỚI</span>
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {promos.map((promo) => {
          const isOff = !promo.isActive;
          return (
            <div key={promo.id} className={`bg-neutral-950 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all relative overflow-hidden group ${isOff ? 'grayscale opacity-50' : ''}`}>
              <div className={`absolute top-0 left-0 right-0 h-1 ${isOff ? 'bg-white/10' : 'bg-cyan-500'}`} />
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isOff ? 'bg-white/5 border-white/10' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'}`}>
                    <Ticket size={24} className={isOff ? 'text-white/40' : ''} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-mono tracking-wider font-bold text-white">{promo.code}</h3>
                    <p className="text-[10px] text-white/40 font-mono">{promo.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggle(promo.id)}
                  className={`p-2 rounded-lg border transition-colors ${isOff ? 'border-white/10 text-white/40 hover:bg-white/5' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
                >
                  <Power size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-xs text-white/40 font-mono uppercase tracking-widest">Loại ưu đãi</span>
                  <span className="text-sm font-medium text-white flex items-center gap-1">
                    {promo.type === 'PERCENT' ? <><Percent size={14} className="text-cyan-400"/> Giảm {promo.value}%</> : <><DollarSign size={14} className="text-cyan-400"/> Giảm {promo.value.toLocaleString('vi-VN')}đ</>}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-xs text-white/40 font-mono uppercase tracking-widest">Giảm tối đa</span>
                  <span className="text-sm font-mono text-white">{promo.maxDiscount.toLocaleString('vi-VN')}đ</span>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono text-white/50 mb-2 uppercase tracking-widest">
                    <span>Đã dùng: {promo.usage}</span>
                    <span>Giới hạn: {promo.limit}</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${isOff ? 'bg-white/20' : 'bg-cyan-400'}`} style={{width: `${(promo.usage/promo.limit)*100}%`}} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
