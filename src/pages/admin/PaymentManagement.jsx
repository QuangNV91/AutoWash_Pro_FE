import { useState } from 'react';
import { Search, Download, CheckCircle2, AlertCircle, Receipt } from 'lucide-react';

const PAYMENTS = [
  { id: 'INV-260614-01', date: '14/06/2026 14:30', customer: 'Nguyễn Văn An', service: 'Premium Care', amount: 150000, method: 'BANK_TRANSFER', status: 'PAID' },
  { id: 'INV-260614-02', date: '14/06/2026 15:00', customer: 'Trần Thị Bình', service: 'Eco Wash', amount: 50000, method: 'CASH', status: 'UNPAID' },
  { id: 'INV-260614-03', date: '14/06/2026 13:00', customer: 'Lê Hoàng Cường', service: 'Ceramic Shield', amount: 800000, method: 'MOMO', status: 'PAID' },
  { id: 'INV-260614-04', date: '14/06/2026 11:00', customer: 'Phạm Minh Đức', service: 'Detailing & Shine', amount: 350000, method: 'CASH', status: 'PAID' },
];

const METHOD_CONFIG = {
  CASH: { label: 'TIỀN MẶT', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  BANK_TRANSFER: { label: 'CHUYỂN KHOẢN', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  MOMO: { label: 'VÍ MOMO', color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
};

const STATUS_CONFIG = {
  PAID: { label: 'ĐÃ THU', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', icon: CheckCircle2 },
  UNPAID: { label: 'CHƯA THU', color: 'text-red-400 bg-red-500/10 border-red-500/30', icon: AlertCircle },
};

export default function PaymentManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-[1400px] mx-auto font-body text-white selection:bg-cyan-500/30">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Receipt className="text-cyan-400" size={28} />
            <h1 className="font-hero text-3xl font-medium tracking-tight">Đối soát & Thanh toán</h1>
          </div>
          <p className="text-white/40 text-sm font-mono tracking-wide">SYSTEM.FINANCE // Quản lý dòng tiền và hóa đơn</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input 
              type="text" 
              placeholder="Tìm mã hóa đơn..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none font-mono"
            />
          </div>
          <button className="px-4 py-2 bg-neutral-950 border border-white/10 rounded-xl text-white/60 hover:text-white transition-colors flex items-center gap-2">
            <Download size={16} /> Xuất file
          </button>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-2">Đã thu hôm nay</p>
          <p className="text-3xl font-hero text-emerald-400">1.300.000<span className="text-sm ml-1 text-white/40">đ</span></p>
        </div>
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
          <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-2">Chờ thu (Công nợ)</p>
          <p className="text-3xl font-hero text-red-400">50.000<span className="text-sm ml-1 text-white/40">đ</span></p>
        </div>
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
          <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-2">Tiền mặt</p>
          <p className="text-2xl font-hero text-white">350.000<span className="text-sm ml-1 text-white/40">đ</span></p>
        </div>
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
          <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-2">Chuyển khoản / Ví</p>
          <p className="text-2xl font-hero text-white">950.000<span className="text-sm ml-1 text-white/40">đ</span></p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-neutral-950 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-black/20">
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase">Mã Hóa đơn</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase">Ngày giờ</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase">Khách hàng</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase">Tổng tiền</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase text-center">Phương thức</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {PAYMENTS.map((payment) => {
                const StatusIcon = STATUS_CONFIG[payment.status].icon;
                return (
                  <tr key={payment.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-cyan-400 text-xs">{payment.id}</td>
                    <td className="px-6 py-4 text-white/60 font-mono text-xs">{payment.date}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{payment.customer}</div>
                      <div className="text-[10px] text-white/40 mt-0.5">{payment.service}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-white">{payment.amount.toLocaleString('vi-VN')}đ</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-[9px] font-mono tracking-widest border ${METHOD_CONFIG[payment.method].color}`}>
                        {METHOD_CONFIG[payment.method].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono tracking-widest border ${STATUS_CONFIG[payment.status].color}`}>
                        <StatusIcon size={12} /> {STATUS_CONFIG[payment.status].label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
