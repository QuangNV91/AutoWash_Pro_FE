import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronLeft, Car, CalendarDays, AlertTriangle, CheckCircle2, Info, Check } from 'lucide-react'

const ALL_NOTIFS = [
  { id: 'N1', type: 'booking',  read: false, time: '10 phút trước', title: 'Lịch hẹn mới được thêm vào ca của bạn', body: 'BKG-10319 · Khách hàng Trần Văn B · Eco Wash · 14:00 hôm nay.' },
  { id: 'N2', type: 'alert',    read: false, time: '25 phút trước', title: 'Xe 29C-888.88 sắp trễ giờ định mức',     body: 'Detailing & Shine đã chạy 55 phút / định mức 60 phút. Vui lòng kiểm tra tiến độ.' },
  { id: 'N3', type: 'schedule', read: false, time: '1 giờ trước',   title: 'Lịch trực tuần sau đã được phân công',   body: 'Bạn được xếp CA 1 (07:00–12:00) vào Thứ Hai, Thứ Tư và Thứ Sáu tuần tới.' },
  { id: 'N4', type: 'booking',  read: true,  time: '2 giờ trước',   title: 'Khách hàng hủy lịch hẹn BKG-10308',     body: 'Phạm Minh Đức đã hủy lịch Premium Care lúc 11:00. Slot đã được mở lại.' },
  { id: 'N5', type: 'info',     read: true,  time: 'Hôm qua',       title: 'Đơn xin nghỉ phép đã được duyệt',       body: 'Quản lý đã duyệt đơn nghỉ 1 ngày của bạn vào Thứ Tư 18/06/2026.' },
  { id: 'N6', type: 'info',     read: true,  time: 'Hôm qua',       title: 'Bạn đã hoàn thành xuất sắc 5 xe trong ca', body: 'Chúc mừng! Hiệu suất ca hôm qua của bạn được đánh giá 5.0 điểm.' },
]

const TYPE_CONFIG = {
  booking:  { icon: Car,          color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20'    },
  alert:    { icon: AlertTriangle, color: 'text-amber-400',  bg: 'bg-amber-500/10',   border: 'border-amber-500/20'   },
  schedule: { icon: CalendarDays, color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20'  },
  info:     { icon: Info,         color: 'text-white/50',    bg: 'bg-white/5',        border: 'border-white/10'       },
}

export default function StaffNotifications() {
  const navigate = useNavigate()
  const [notifs, setNotifs] = useState(ALL_NOTIFS)
  const unreadCount = notifs.filter(n => !n.read).length

  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  const markOne = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-3xl mx-auto font-body text-white">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/staff')} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-hero text-2xl font-medium tracking-tight flex items-center gap-3">
              <Bell className="text-cyan-400" size={24} />
              Thông báo
              {unreadCount > 0 && (
                <span className="text-sm font-normal text-white bg-red-500 px-2 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </h1>
            <p className="text-white/40 text-sm font-mono mt-0.5">{unreadCount} chưa đọc</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAll}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white transition-colors">
            <Check size={15} /> Đọc tất cả
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="space-y-3">
        {notifs.map(n => {
          const Cfg  = TYPE_CONFIG[n.type]
          const Icon = Cfg.icon
          return (
            <div
              key={n.id}
              onClick={() => markOne(n.id)}
              className={`relative flex gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                n.read ? 'bg-neutral-950 border-white/5 opacity-70 hover:opacity-100' : `bg-neutral-950 ${Cfg.border} hover:border-white/15`
              }`}
            >
              {/* Unread dot */}
              {!n.read && <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-red-500" />}

              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${Cfg.bg} ${Cfg.border} border`}>
                <Icon size={18} className={Cfg.color} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium mb-0.5 ${n.read ? 'text-white/70' : 'text-white'}`}>{n.title}</p>
                <p className="text-xs text-white/40 leading-relaxed">{n.body}</p>
                <p className="text-[10px] text-white/25 font-mono mt-2">{n.time}</p>
              </div>
            </div>
          )
        })}
      </div>

      {unreadCount === 0 && (
        <div className="text-center py-8">
          <CheckCircle2 size={40} className="text-emerald-500/30 mx-auto mb-3" />
          <p className="text-white/30 text-sm">Tất cả thông báo đã được đọc</p>
        </div>
      )}
    </div>
  )
}
