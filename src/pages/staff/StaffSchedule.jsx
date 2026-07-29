import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { CalendarClock, ChevronLeft, Plus, Check, X, Clock, Sun, Sunset } from 'lucide-react'

const today = new Date()
const getWeekDays = () => {
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(today.setDate(diff))
  const names = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i)
    return {
      name: names[d.getDay()], short: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()],
      date: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`,
      fullDate: `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`,
      isToday: d.toDateString() === new Date().toDateString(),
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    }
  })
}
const WEEK = getWeekDays()
const mySchedule = {}
const leaveHistory = []

export default function StaffSchedule() {
  const navigate = useNavigate()
  const [leaveModal, setLeaveModal] = useState(false)
  const [form, setForm] = useState({ date: WEEK[0].fullDate, shiftId: '', reason: '' })
  const [submitted, setSubmitted] = useState(false)

  const [myLeaves, setMyLeaves] = useState([])
  const [staffId, setStaffId] = useState(null)
  const [shifts, setShifts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const initData = async () => {
      try {
        const username = localStorage.getItem('username');
        if (!username) return;

        const staffRes = await api.get('/api/staffs');
        const staffList = staffRes.data?.data || [];
        const me = staffList.find(s => s.username === username);

        if (me) {
          setStaffId(me.id);
          const leaveRes = await api.get(`/api/leave-requests/staff/${me.id}`);
          if (leaveRes.data?.data) {
            setMyLeaves(leaveRes.data.data);
          }
        }

        const shiftRes = await api.get('/api/shifts');
        if (shiftRes.data?.data) {
          setShifts(shiftRes.data.data);
          if (shiftRes.data.data.length > 0) {
            setForm(prev => ({ ...prev, shiftId: shiftRes.data.data[0].id }));
          }
        }
      } catch (err) {
        console.error('Error fetching schedule data:', err);
      }
    };
    initData();
  }, []);

  const totalShifts = 0
  const totalHours = 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!staffId || !form.shiftId) {
      setError('Vui lòng chọn ca làm việc');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/api/leave-requests', {
        staffId: staffId,
        shiftId: Number(form.shiftId),
        leaveDate: form.date,
        reason: form.reason
      });

      setSubmitted(true)
      setLeaveModal(false)

      const leaveRes = await api.get(`/api/leave-requests/staff/${staffId}`);
      if (leaveRes.data?.data) {
        setMyLeaves(leaveRes.data.data);
      }

      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Gửi thất bại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto font-body text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/staff')} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-hero text-2xl font-medium tracking-tight flex items-center gap-3">
              <CalendarClock className="text-cyan-400" size={24} />
              Lịch trực cá nhân
            </h1>
            <p className="text-white/40 text-sm font-mono mt-0.5">Tuần {WEEK[0].date} – {WEEK[6].date}</p>
          </div>
        </div>
        <button onClick={() => setLeaveModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white/70 hover:text-white transition-colors">
          <Plus size={16} /> Xin nghỉ
        </button>
      </div>

      {/* Toast */}
      {submitted && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-3 flex items-center gap-3 text-emerald-400 text-sm font-medium">
          <Check size={16} /> Đơn xin nghỉ đã được gửi — chờ quản lý duyệt.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Ca tuần này', value: totalShifts, color: 'text-cyan-400' },
          { label: 'Giờ làm', value: `${totalHours}h`, color: 'text-white' },
          { label: 'Ngày nghỉ', value: myLeaves.filter(l => l.status?.toUpperCase() === 'APPROVED').length, color: 'text-amber-400' },
        ].map((s, i) => (
          <div key={i} className="bg-neutral-950 border border-white/5 rounded-2xl p-4">
            <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-3xl font-hero font-light ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Schedule grid */}
      <div className="bg-neutral-950 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-white/5 bg-black/20">
                <th className="px-5 py-4 text-[10px] font-mono tracking-widest text-white/30 text-left w-[22%]">Ngày</th>
                {shifts.map(s => (
                  <th key={s.id} className="px-5 py-4 text-[10px] font-mono tracking-widest text-white/30 text-left border-l border-white/5">
                    {s.shiftName} · {s.startTime.substring(0, 5)} - {s.endTime.substring(0, 5)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WEEK.map(day => {
                const dayShifts = mySchedule[day.fullDate] || []
                const leave = myLeaves.find(l => l.leaveDate === day.fullDate && l.status?.toUpperCase() === 'APPROVED')
                return (
                  <tr key={day.fullDate} className={`border-b border-white/5 last:border-0 transition-colors ${day.isToday ? 'bg-cyan-500/5' : day.isWeekend ? 'bg-white/[0.01]' : ''}`}>
                    <td className="px-5 py-4">
                      <div className={`font-medium ${day.isToday ? 'text-cyan-400' : 'text-white/80'}`}>{day.name}</div>
                      <div className="text-[10px] font-mono text-white/40">{day.date}</div>
                      {day.isToday && <div className="text-[9px] text-cyan-400 font-mono mt-1">HÔM NAY</div>}
                      {day.isWeekend && !day.isToday && <div className="text-[9px] text-amber-400/70 font-mono mt-1">CAO ĐIỂM</div>}
                    </td>
                    {shifts.map(s => {
                      const hasShift = dayShifts.includes(s.id)
                      return (
                        <td key={s.id} className="px-5 py-4 border-l border-white/5">
                          {leave ? (
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded">NGHỈ PHÉP</span>
                          ) : hasShift ? (
                            <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />{s.startTime.substring(0, 5)}
                            </span>
                          ) : (
                            <span className="text-[10px] text-white/20 font-mono">—</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave history */}
      <div className="bg-neutral-950 border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <h3 className="font-medium text-white text-sm flex items-center gap-2"><Clock size={16} className="text-white/40" /> Lịch sử đơn nghỉ</h3>
        </div>
        <div className="p-5 space-y-3">
          {myLeaves.length > 0 ? myLeaves.map(l => (
            <div key={l.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div>
                <p className="text-sm font-medium text-white">{l.leaveDate} · {l.shift?.shiftName}</p>
                <p className="text-xs text-white/40 font-mono mt-0.5">{l.reason}</p>
              </div>
              <span className={`text-[10px] font-mono px-2.5 py-1 rounded border ${l.status === 'APPROVED' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                  : l.status === 'REJECTED' ? 'text-red-400 bg-red-500/10 border-red-500/30'
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                }`}>
                {l.status === 'APPROVED' ? 'ĐÃ DUYỆT' : l.status === 'REJECTED' ? 'TỪ CHỐI' : 'CHỜ DUYỆT'}
              </span>
            </div>
          )) : (
            <div className="text-center py-6 text-white/40 text-sm font-mono">Chưa có lịch sử nghỉ phép</div>
          )}
        </div>
      </div>

      {/* Leave modal */}
      {leaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setLeaveModal(false)} />
          <div className="relative bg-neutral-950 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="font-medium text-white">Gửi đơn xin nghỉ phép</h3>
              <button onClick={() => setLeaveModal(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs text-white/50 font-mono mb-1.5 block">Ngày bắt đầu nghỉ</label>
                <select value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white appearance-none">
                  {WEEK.map(d => <option key={d.fullDate} value={d.fullDate}>{d.name} ({d.date})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 font-mono mb-1.5 block">Chọn Ca nghỉ</label>
                <select value={form.shiftId} onChange={e => setForm({ ...form, shiftId: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white appearance-none">
                  {shifts.map(s => <option key={s.id} value={s.id}>{s.shiftName} ({s.startTime} - {s.endTime})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 font-mono mb-1.5 block">Lý do</label>
                <input required value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
                  placeholder="Lý do nghỉ phép..."
                  className="w-full bg-black/50 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30" />
              </div>
              {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setLeaveModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-colors">Hủy</button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center">
                  {loading ? 'Đang gửi...' : 'Gửi đơn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
