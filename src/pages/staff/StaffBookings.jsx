import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarDays, Clock, LogIn, RefreshCw, CheckCircle2,
  Car, Filter, Search, ChevronRight, Coffee, CreditCard, AlertTriangle
} from 'lucide-react'

const TODAY_BOOKINGS = [
  { id: 'BKG-10310', time: '08:00', plate: '30A-123.45', customer: 'Nguyễn Văn An',   service: 'Eco Wash',          duration: 15,  status: 'COMPLETED', payment: 'PAID',   price: 40000  },
  { id: 'BKG-10311', time: '08:15', plate: '51F-111.11', customer: 'Lê Hoàng Cường',  service: 'Premium Care',       duration: 30,  status: 'COMPLETED', payment: 'PAID',   price: 150000 },
  { id: 'BKG-10312', time: '09:00', plate: '29C-888.88', customer: 'Trần Thị Bình',   service: 'Detailing & Shine',  duration: 60,  status: 'WORKING',   payment: 'UNPAID', price: 350000 },
  { id: 'BKG-10313', time: '10:00', plate: '60A-999.99', customer: 'Phạm Minh Đức',   service: 'Eco Wash',          duration: 15,  status: 'ARRIVED',   payment: 'PAID',   price: 40000  },
  { id: 'BKG-10314', time: '10:30', plate: '—',          customer: 'Võ Thị Em',       service: 'Premium Care',       duration: 30,  status: 'PENDING',   payment: 'UNPAID', price: 150000 },
  { id: 'BKG-10315', time: '11:00', plate: '—',          customer: 'Đỗ Văn Phúc',     service: 'Ceramic Shield',     duration: 120, status: 'PENDING',   payment: 'PAID',   price: 800000 },
  { id: 'BKG-10316', time: '13:30', plate: '—',          customer: 'Hoàng Thị Lan',   service: 'Eco Wash',          duration: 15,  status: 'PENDING',   payment: 'UNPAID', price: 40000  },
  { id: 'BKG-10317', time: '14:00', plate: '—',          customer: 'Bùi Văn Khánh',   service: 'Premium Care',       duration: 30,  status: 'PENDING',   payment: 'PAID',   price: 150000 },
  { id: 'BKG-10318', time: '15:00', plate: '—',          customer: 'Ngô Minh Tuấn',   service: 'Detailing & Shine',  duration: 60,  status: 'PENDING',   payment: 'UNPAID', price: 350000 },
]

const STATUS_CONFIG = {
  PENDING:   { label: 'Chờ đến',  color: 'text-yellow-400  bg-yellow-500/10  border-yellow-500/20',  icon: Clock        },
  ARRIVED:   { label: 'Đã đến',   color: 'text-orange-400  bg-orange-500/10  border-orange-500/20',  icon: LogIn        },
  WORKING:   { label: 'Đang rửa', color: 'text-blue-400    bg-blue-500/10    border-blue-500/20',    icon: RefreshCw    },
  COMPLETED: { label: 'Xong',     color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
}
const SERVICE_COLOR = {
  'Eco Wash': 'text-cyan-400', 'Premium Care': 'text-purple-400',
  'Detailing & Shine': 'text-emerald-400', 'Ceramic Shield': 'text-amber-400',
}
const SLOTS = [
  { label: 'Slot 1', time: '08:00 – 09:00' }, { label: 'Slot 2', time: '09:00 – 10:00' },
  { label: 'Slot 3', time: '10:00 – 11:00' }, { label: 'Slot 4', time: '11:00 – 12:00' },
  { label: 'Nghỉ trưa', time: '12:00 – 13:00', isBreak: true },
  { label: 'Slot 5', time: '13:00 – 14:00' }, { label: 'Slot 6', time: '14:00 – 15:00' },
  { label: 'Slot 7', time: '15:00 – 16:00' }, { label: 'Slot 8', time: '16:00 – 17:00' },
  { label: 'Slot 9', time: '17:00 – 18:00' },
]

function slotHour(slot) { return parseInt(slot.time.split(':')[0]) }
function bookingHour(b)  { return parseInt(b.time.split(':')[0]) }

export default function StaffBookings() {
  const navigate = useNavigate()
  const [filter, setFilter]   = useState('ALL')
  const [search, setSearch]   = useState('')

  const filtered = useMemo(() =>
    TODAY_BOOKINGS.filter(b => {
      if (filter !== 'ALL' && b.status !== filter) return false
      if (search && !b.customer.toLowerCase().includes(search.toLowerCase()) &&
          !b.plate.includes(search) && !b.id.includes(search)) return false
      return true
    }), [filter, search])

  const counts = {
    total: TODAY_BOOKINGS.length,
    pending:   TODAY_BOOKINGS.filter(b => b.status === 'PENDING').length,
    arrived:   TODAY_BOOKINGS.filter(b => b.status === 'ARRIVED').length,
    working:   TODAY_BOOKINGS.filter(b => b.status === 'WORKING').length,
    completed: TODAY_BOOKINGS.filter(b => b.status === 'COMPLETED').length,
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto font-body text-white">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <CalendarDays className="text-cyan-400" size={26} />
            <h1 className="font-hero text-2xl font-medium tracking-tight">Lịch hẹn hôm nay</h1>
          </div>
          <p className="text-white/40 text-sm font-mono">{new Date().toLocaleDateString('vi-VN', { weekday:'long', day:'2-digit', month:'2-digit', year:'numeric' })}</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={15} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm khách, biển số, mã đơn..."
            className="bg-neutral-950 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none w-64 font-mono placeholder-white/30"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Tổng', val: counts.total,     f: 'ALL',       color: 'text-white',        border: 'border-white/10'        },
          { label: 'Chờ đến', val: counts.pending, f: 'PENDING',  color: 'text-yellow-400',   border: 'border-yellow-500/20'   },
          { label: 'Đã đến',  val: counts.arrived, f: 'ARRIVED',  color: 'text-orange-400',   border: 'border-orange-500/20'   },
          { label: 'Đang rửa',val: counts.working, f: 'WORKING',  color: 'text-blue-400',     border: 'border-blue-500/20'     },
          { label: 'Xong',   val: counts.completed,f: 'COMPLETED', color: 'text-emerald-400', border: 'border-emerald-500/20'  },
        ].map(s => (
          <button key={s.f} onClick={() => setFilter(s.f)}
            className={`bg-neutral-950 border rounded-xl p-3 text-left transition-all ${filter === s.f ? s.border + ' bg-white/5' : 'border-white/5 hover:border-white/10'}`}>
            <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-2xl font-hero font-light ${s.color}`}>{s.val}</p>
          </button>
        ))}
      </div>

      {/* Slot view */}
      <div className="space-y-4">
        {SLOTS.map(slot => {
          if (slot.isBreak) return (
            <div key="break" className="flex items-center gap-4 py-3 opacity-50">
              <div className="w-28 shrink-0 text-center">
                <span className="text-xs font-mono text-white/40 bg-white/5 border border-white/5 px-3 py-1 rounded-lg">12:00 – 13:00</span>
              </div>
              <div className="flex-1 border border-dashed border-white/10 rounded-xl p-3 flex items-center gap-2 text-white/30">
                <Coffee size={16} /> <span className="text-sm font-mono">Giờ nghỉ trưa — không tiếp nhận xe</span>
              </div>
            </div>
          )

          const slotH = slotHour(slot)
          const bookings = filtered.filter(b => bookingHour(b) === slotH)

          return (
            <div key={slot.label} className="flex gap-4">
              <div className="w-28 shrink-0 flex flex-col items-center justify-start pt-3">
                <span className="text-[10px] text-white/40 font-mono tracking-widest">{slot.label}</span>
                <span className="text-xs text-white/60 font-mono mt-0.5">{slot.time}</span>
              </div>
              <div className="flex-1 min-h-[64px]">
                {bookings.length === 0 ? (
                  <div className="border border-dashed border-white/5 rounded-xl flex items-center justify-center h-full min-h-[56px]">
                    <span className="text-xs text-white/20 font-mono">Trống</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {bookings.map(b => {
                      const Icon = STATUS_CONFIG[b.status].icon
                      return (
                        <div key={b.id}
                          onClick={() => navigate('/staff/checkin')}
                          className="bg-neutral-950 border border-white/5 hover:border-white/15 rounded-xl p-4 cursor-pointer transition-all group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-mono text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white tracking-widest">{b.plate}</span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${STATUS_CONFIG[b.status].color} flex items-center gap-1`}>
                              <Icon size={10} />{STATUS_CONFIG[b.status].label}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-white">{b.customer}</p>
                          <p className={`text-xs mt-0.5 ${SERVICE_COLOR[b.service]}`}>{b.service} · {b.duration}p</p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                            <span className={`text-[10px] font-mono ${b.payment === 'PAID' ? 'text-emerald-400' : 'text-red-400'}`}>
                              {b.payment === 'PAID' ? '✓ Đã TT' : '✗ Chưa TT'}
                            </span>
                            <span className="text-[10px] text-white/30 font-mono">{b.price.toLocaleString('vi-VN')}đ</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
