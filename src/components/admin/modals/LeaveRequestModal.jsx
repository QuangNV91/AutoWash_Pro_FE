import { X } from 'lucide-react';

export default function LeaveRequestModal({
  isOpen,
  onClose,
  onSubmit,
  reqForm,
  setReqForm,
  staffProfiles,
  WEEK_DAYS
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-neutral-950 border border-white/10 shadow-2xl flex flex-col">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h2 className="text-lg font-mono text-white tracking-widest uppercase">Tạo Đơn nghỉ phép</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          
          <div className="space-y-2">
            <label className="text-[10px] text-white/40 tracking-widest uppercase">Nhân viên</label>
            <select 
              value={reqForm.staffId}
              onChange={e => setReqForm({...reqForm, staffId: e.target.value})}
              className="w-full bg-black/50 border border-white/10 px-4 py-2.5 rounded-lg text-sm text-white focus:border-cyan-500 focus:outline-none appearance-none"
            >
              {staffProfiles.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-white/40 tracking-widest uppercase">Ngày bắt đầu</label>
            <select 
              value={reqForm.startDate}
              onChange={e => setReqForm({...reqForm, startDate: e.target.value})}
              className="w-full bg-black/50 border border-white/10 px-4 py-2.5 rounded-lg text-sm text-white focus:border-cyan-500 focus:outline-none appearance-none"
            >
              {WEEK_DAYS.map(d => <option key={d.id} value={d.fullDate}>{d.name} ({d.dateStr})</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-white/40 tracking-widest uppercase">Số ngày nghỉ</label>
            <select 
              value={reqForm.duration}
              onChange={e => setReqForm({...reqForm, duration: e.target.value})}
              className="w-full bg-black/50 border border-white/10 px-4 py-2.5 rounded-lg text-sm text-white focus:border-cyan-500 focus:outline-none appearance-none"
            >
              <option value={1}>1 Ngày</option>
              <option value={2}>2 Ngày</option>
              <option value={3}>3 Ngày</option>
            </select>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-mono text-white/40 hover:text-white transition-colors">
              HỦY
            </button>
            <button type="submit" className="px-5 py-2 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-mono tracking-widest hover:bg-cyan-500/20 transition-colors">
              GỬI ĐƠN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
