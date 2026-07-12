import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import {
  CalendarDays, Clock, LogIn, RefreshCw, CheckCircle2, Search, Coffee, ChevronLeft, ChevronRight
} from 'lucide-react'
import { updateBookingStatus } from '../../services/bookingService'
import toast from 'react-hot-toast'

const TODAY_BOOKINGS = [
  { id: 'BKG-10310', time: '08:00', plate: '30A-123.45', customer: 'Nguyễn Văn An',   service: 'Eco Wash',          duration: 15,  status: 'COMPLETED', payment: 'PAID',   price: 50000  },
  { id: 'BKG-10311', time: '08:15', plate: '51F-111.11', customer: 'Lê Hoàng Cường',  service: 'Premium Care',       duration: 30,  status: 'COMPLETED', payment: 'PAID',   price: 150000 },
  { id: 'BKG-10312', time: '09:00', plate: '29C-888.88', customer: 'Trần Thị Bình',   service: 'Detailing & Shine',  duration: 60,  status: 'WORKING',   payment: 'UNPAID', price: 350000 },
  { id: 'BKG-10313', time: '10:00', plate: '60A-999.99', customer: 'Phạm Minh Đức',   service: 'Eco Wash',          duration: 15,  status: 'ARRIVED',   payment: 'PAID',   price: 50000  },
  { id: 'BKG-10314', time: '10:30', plate: '—',          customer: 'Võ Thị Em',       service: 'Premium Care',       duration: 30,  status: 'PENDING',   payment: 'UNPAID', price: 150000 },
  { id: 'BKG-10315', time: '11:00', plate: '—',          customer: 'Đỗ Văn Phúc',     service: 'Ceramic Shield',     duration: 120, status: 'PENDING',   payment: 'PAID',   price: 800000 },
  { id: 'BKG-10316', time: '13:30', plate: '—',          customer: 'Hoàng Thị Lan',   service: 'Eco Wash',          duration: 15,  status: 'PENDING',   payment: 'UNPAID', price: 50000  },
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
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [filter, setFilter]   = useState('ALL')
  const [search, setSearch]   = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [editService, setEditService] = useState('')

  const [servicesMap, setServicesMap] = useState({
    'Eco Wash': { price: 50000, duration: 15 },
    'Premium Care': { price: 150000, duration: 30 },
    'Detailing & Shine': { price: 350000, duration: 60 },
    'Ceramic Shield': { price: 800000, duration: 120 }
  })

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const handlePrevDay = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      // Prevent going too far back if needed, but currently allowing looking back
      return newDate;
    });
  };

  const handleNextDay = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      
      const maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + 7);
      if (newDate > maxDate) {
          toast('Chỉ được xem trước tối đa 7 ngày', { icon: 'ℹ️' });
          return prev;
      }
      return newDate;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      let currentServicesMap = {
        'Eco Wash': { price: 50000, duration: 15 },
        'Premium Care': { price: 150000, duration: 30 },
        'Detailing & Shine': { price: 350000, duration: 60 },
        'Ceramic Shield': { price: 800000, duration: 120 }
      };

      try {
        const res = await api.get('/api/v1/services');
        if (res.data?.success && res.data.data && res.data.data.length > 0) {
          const newMap = {};
          res.data.data.forEach(s => {
            newMap[s.serviceName] = { price: s.basePrice, duration: s.duration };
          });
          setServicesMap(newMap);
          currentServicesMap = newMap;
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      }

      try {
        setLoadingBookings(true);
        const offset = selectedDate.getTimezoneOffset();
        const localDate = new Date(selectedDate.getTime() - (offset*60*1000));
        const dateStr = localDate.toISOString().split('T')[0];
        
        // Use the existing all bookings API since the date specific one might not exist
        const res = await api.get('/api/bookings');
        
        if (res.data?.success && res.data.data) {
          // Filter by selected date on the frontend
          const dayBookings = res.data.data.filter(b => b.bookingDate === dateStr);
          
          const formattedBookings = dayBookings.map(b => ({
            id: `BKG-${b.id}`,
            realId: b.id,
            time: b.startTime ? b.startTime.substring(0, 5) : '00:00',
            plate: b.licensePlate || '—',
            customer: b.customerName || 'Khách vãng lai',
            service: b.serviceName || 'Eco Wash',
            duration: currentServicesMap[b.serviceName]?.duration || 30,
            price: currentServicesMap[b.serviceName]?.price || 0,
            status: b.status || 'PENDING',
            payment: b.paymentMethod ? 'PAID' : 'UNPAID',
          }));
          // Filter out CANCELED or NO_SHOW statuses to prevent UI crashes
          const validStatuses = ['PENDING', 'ARRIVED', 'WORKING', 'COMPLETED'];
          setBookings(formattedBookings.filter(b => validStatuses.includes(b.status)));
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setBookings(TODAY_BOOKINGS);
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchData();
  }, [selectedDate]);

  const filtered = useMemo(() =>
    bookings.filter(b => {
      if (filter !== 'ALL' && b.status !== filter) return false
      if (search && !b.customer.toLowerCase().includes(search.toLowerCase()) &&
          !b.plate.includes(search) && !b.id.includes(search)) return false
      return true
    }), [filter, search, bookings])

  const counts = {
    total: bookings.length,
    pending:   bookings.filter(b => b.status === 'PENDING').length,
    arrived:   bookings.filter(b => b.status === 'ARRIVED').length,
    working:   bookings.filter(b => b.status === 'WORKING').length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
  }

  const openDetails = (b) => {
    setSelectedBooking(b);
    setEditService(b.service);
  };

  const handleSaveEdit = async () => {
    if (!selectedBooking) return;
    
    if (editService && editService !== selectedBooking.service && servicesMap[editService]) {
      try {
        if (selectedBooking.realId) {
          await updateBookingStatus(selectedBooking.realId, { serviceName: editService });
        }
        
        setBookings(prev => prev.map(b => {
          if (b.id !== selectedBooking.id) return b;
          return {
            ...b,
            service: editService,
            price: servicesMap[editService].price,
            duration: servicesMap[editService].duration
          };
        }));
        toast.success('Cập nhật dịch vụ thành công');
      } catch (err) {
        toast.error('Lỗi khi cập nhật dịch vụ');
      }
    }
    setSelectedBooking(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto font-body text-white">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <CalendarDays className="text-cyan-400" size={26} />
            <h1 className="font-hero text-2xl font-medium tracking-tight">
              {selectedDate.toDateString() === new Date().toDateString() ? 'Lịch hẹn hôm nay' : 'Lịch hẹn sắp tới'}
            </h1>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button 
              onClick={handlePrevDay}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <p className="text-white/80 text-sm font-mono min-w-[160px] text-center">
              {selectedDate.toLocaleDateString('vi-VN', { weekday:'long', day:'2-digit', month:'2-digit', year:'numeric' })}
            </p>
            <button 
              onClick={handleNextDay}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
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
                          onClick={() => openDetails(b)}
                          className="bg-neutral-950 border border-white/5 hover:border-white/15 rounded-xl p-4 cursor-pointer transition-all group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white tracking-widest">{b.plate}</span>
                              <span className="text-xs text-white/50 font-mono">{b.time}</span>
                            </div>
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

      {/* Edit Booking Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
          <div className="relative bg-neutral-950 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <h3 className="font-medium text-white">Chi tiết lịch hẹn</h3>
              <button onClick={() => setSelectedBooking(null)} className="text-white/40 hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">Khách hàng</span>
                  <span className="text-white font-medium">{selectedBooking.customer}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">Giờ hẹn</span>
                  <span className="text-white font-mono">{selectedBooking.time}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">Trạng thái</span>
                  <span className={`font-mono px-2 py-0.5 rounded border ${STATUS_CONFIG[selectedBooking.status].color} text-xs`}>
                    {STATUS_CONFIG[selectedBooking.status].label}
                  </span>
                </div>
              </div>

              {selectedBooking.status !== 'COMPLETED' && (
                <div>
                  <label className="text-sm text-white/70 font-medium mb-2 block">Cập nhật gói dịch vụ</label>
                  <select 
                    value={editService}
                    onChange={(e) => setEditService(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-white text-sm"
                  >
                    {Object.keys(servicesMap).map(svc => (
                      <option key={svc} value={svc}>{svc}</option>
                    ))}
                  </select>
                  {editService !== selectedBooking.service && servicesMap[editService] && (
                    <div className="mt-3 text-sm bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-xl">
                      <p className="text-cyan-400 mb-1 text-xs">Dịch vụ sẽ thay đổi, giá mới cập nhật:</p>
                      <p className="text-white font-mono">
                        {servicesMap[editService].price.toLocaleString('vi-VN')}đ 
                        <span className="text-white/50 ml-2">({servicesMap[editService].duration} phút)</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button onClick={() => setSelectedBooking(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-colors">Đóng</button>
                {selectedBooking.status !== 'COMPLETED' && editService !== selectedBooking.service && (
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-colors"
                  >
                    Lưu thay đổi
                  </button>
                )}
                {selectedBooking.status !== 'COMPLETED' && editService === selectedBooking.service && (
                  <button
                    onClick={() => {
                      const offset = selectedDate.getTimezoneOffset();
                      const localDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
                      const dateStr = localDate.toISOString().split('T')[0];
                      navigate('/staff/checkin', { state: { date: dateStr } });
                    }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    Đến Check-in
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
