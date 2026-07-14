import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../../services/api'
import {
  ScanLine, LogIn, Play, CheckCircle2, ChevronLeft, Check, X
} from 'lucide-react'
import { updateBookingStatus } from '../../services/bookingService'
import toast from 'react-hot-toast'

const MOCK_BOOKINGS = [
  { id: 'BKG-10312', time: '09:00', plate: '29C-888.88', customer: 'Trần Thị Bình',   phone: '0912345678', service: 'Detailing & Shine', duration: 60,  status: 'WORKING',   payment: 'UNPAID', price: 350000, startedAt: Date.now() - 22 * 60 * 1000 },
  { id: 'BKG-10313', time: '10:00', plate: '60A-999.99', customer: 'Phạm Minh Đức',   phone: '0933444555', service: 'Eco Wash',          duration: 15,  status: 'ARRIVED',   payment: 'PAID',   price: 50000,  startedAt: null },
  { id: 'BKG-10314', time: '10:30', plate: '—',          customer: 'Võ Thị Em',       phone: '0977123456', service: 'Premium Care',       duration: 30,  status: 'PENDING',   payment: 'UNPAID', price: 150000, startedAt: null },
  { id: 'BKG-10315', time: '11:00', plate: '—',          customer: 'Đỗ Văn Phúc',     phone: '0908876543', service: 'Ceramic Shield',     duration: 120, status: 'PENDING',   payment: 'PAID',   price: 800000, startedAt: null },
]

const SERVICE_COLOR = {
  'Eco Wash': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  'Premium Care': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'Detailing & Shine': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'Ceramic Shield': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
}
const STATUS_NEXT = { PENDING: 'ARRIVED', ARRIVED: 'WORKING', WORKING: 'DONE' }
const STATUS_LABEL_NEXT = { PENDING: 'Xác nhận đã đến', ARRIVED: 'Bắt đầu rửa xe', WORKING: 'Hoàn thành' }
const STATUS_ICON_NEXT  = { PENDING: LogIn, ARRIVED: Play, WORKING: CheckCircle2 }
const STATUS_COLOR_NEXT = {
  PENDING: 'bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20',
  ARRIVED: 'bg-blue-500/10  border-blue-500/30  text-blue-400  hover:bg-blue-500/20',
  WORKING: 'bg-emerald-500   text-black hover:bg-emerald-400',
}

function WorkingTimer({ startedAt, duration }) {
  const [elapsed, setElapsed] = useState(Math.floor((Date.now() - startedAt) / 1000))
  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000)
    return () => clearInterval(t)
  }, [startedAt])
  const elMin = Math.floor(elapsed / 60)
  const elSec = elapsed % 60
  const prog  = Math.min((elMin / duration) * 100, 100)
  const over  = elMin >= duration
  return (
    <div>
      <div className="flex justify-between text-xs font-mono mb-2">
        <span className={over ? 'text-red-400 font-bold animate-pulse' : 'text-white/60'}>
          ⏱ {elMin}p {elSec.toString().padStart(2,'0')}s đã trôi
        </span>
        <span className="text-white/40">/ {duration}p</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${over ? 'bg-red-500 animate-pulse' : prog > 75 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${prog}%` }} />
      </div>
      {over && <p className="text-xs text-red-400 mt-1.5 font-mono">⚠ Quá {elMin - duration} phút định mức!</p>}
    </div>
  )
}

export default function StaffCheckin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [selected, setSelected] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [plateInput, setPlateInput] = useState('')
  const [selectedService, setSelectedService] = useState('')
  
  const [servicesMap, setServicesMap] = useState({
    'Eco Wash': { price: 50000, duration: 15 },
    'Premium Care': { price: 150000, duration: 30 },
    'Detailing & Shine': { price: 350000, duration: 60 },
    'Ceramic Shield': { price: 800000, duration: 120 }
  })

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
        const offset = new Date().getTimezoneOffset();
        const localDate = new Date(new Date().getTime() - (offset * 60 * 1000));
        let today = localDate.toISOString().split('T')[0];
        
        const savedDate = sessionStorage.getItem('staffCheckinDate');
        if (location.state?.date) {
          today = location.state.date;
          sessionStorage.setItem('staffCheckinDate', today);
        } else if (savedDate) {
          today = savedDate;
        }

        const res = await api.get('/api/bookings');
        
        if (res.data?.success && res.data.data) {
          const dayBookings = res.data.data.filter(b => b.bookingDate === today);
          
          const formattedBookings = dayBookings.map(b => ({
            id: `BKG-${b.id}`,
            realId: b.id,
            time: b.startTime ? b.startTime.substring(0, 5) : '00:00',
            plate: b.licensePlate || '—',
            customer: b.customerName || 'Khách vãng lai',
            phone: '—', // BE BookingResponse doesn't have phone, assume empty
            service: b.serviceName || 'Eco Wash',
            duration: currentServicesMap[b.serviceName]?.duration || 30,
            price: currentServicesMap[b.serviceName]?.price || 0,
            status: b.status || 'PENDING',
            payment: b.paymentStatus === 'SUCCESS' ? 'PAID' : 'UNPAID',
            startedAt: b.status === 'WORKING' ? Date.now() - 5 * 60 * 1000 : null,
          }));
          // Only show active ones in check-in page
          setBookings(formattedBookings.filter(b => ['PENDING', 'ARRIVED', 'WORKING'].includes(b.status)));
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setBookings(MOCK_BOOKINGS);
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchData();
  }, []);

  const handleAction = async (id) => {
    const b = bookings.find(x => x.id === id);
    if (!b) return;

    const next = STATUS_NEXT[b.status];
    // Bắt buộc thu tiền trước khi hoàn thành đơn (nếu chưa thanh toán)
    if (next === 'DONE' && b.payment !== 'PAID') {
      toast('Chuyển sang trang thu tiền để hoàn thành đơn', { icon: '💳' });
      setConfirmOpen(false);
      setTimeout(() => {
        navigate('/staff/payment', { state: { selectedBookingId: b.id } });
      }, 500);
      return;
    }

    const updateData = {
      status: next === 'DONE' ? 'COMPLETED' : next,
      licensePlate: selected?.status === 'PENDING' ? plateInput : undefined,
      serviceName: (selectedService && selectedService !== b.service) ? selectedService : undefined
    };

    try {
      if (b.realId) {
        await updateBookingStatus(b.realId, updateData);
      }
      
      setBookings(prev => prev.map(item => {
        if (item.id !== id) return item;
        let updatedBooking = { ...item };
        if (next) {
          updatedBooking = { ...updatedBooking, status: next === 'DONE' ? 'COMPLETED' : next, startedAt: next === 'WORKING' ? Date.now() : item.startedAt };
        }
        if (selectedService && selectedService !== item.service && servicesMap[selectedService]) {
          updatedBooking.service = selectedService;
          updatedBooking.price = servicesMap[selectedService].price;
          updatedBooking.duration = servicesMap[selectedService].duration;
        }
        if (selected?.status === 'PENDING') {
          updatedBooking.plate = plateInput || '—';
        }
        return updatedBooking;
      }));
      toast.success(next === 'DONE' ? 'Đã hoàn thành đơn hàng' : 'Cập nhật trạng thái thành công');
      setConfirmOpen(false);
    } catch (err) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  }

  const openConfirm = (b) => { 
    setSelected(b); 
    setPlateInput(b.plate !== '—' ? b.plate : ''); 
    setSelectedService(b.service);
    setConfirmOpen(true); 
  }

  const activeBooking = bookings.find(b => b.status === 'WORKING')

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto font-body text-white">

      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <button onClick={() => navigate('/staff')} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-hero text-2xl font-medium tracking-tight flex items-center gap-3">
            <ScanLine className="text-cyan-400" size={24} />
            Check-in & Cập nhật trạng thái
          </h1>
          <p className="text-white/40 text-sm font-mono mt-0.5">Quản lý tiến độ từng xe trong ca làm việc</p>
        </div>
      </div>

      {/* Active car highlight */}
      {activeBooking && (
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-2xl" />
          <div className="absolute top-3 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-mono text-blue-400 tracking-widest">ĐANG RỬA</span>
          </div>
          <div className="pl-3">
            <p className="text-xs text-white/40 font-mono mb-2">{activeBooking.id} · {activeBooking.time}</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <div>
                <div className="font-mono text-lg font-medium text-white bg-white/5 border border-white/15 px-3 py-1.5 rounded-lg inline-block tracking-widest mb-1">
                  {activeBooking.plate}
                </div>
                <p className="text-base font-medium text-white">{activeBooking.customer}</p>
                <p className={`text-sm font-medium ${SERVICE_COLOR[activeBooking.service].split(' ')[0]}`}>
                  {activeBooking.service} · {activeBooking.duration} phút
                </p>
              </div>
            </div>
            {activeBooking.startedAt && <WorkingTimer startedAt={activeBooking.startedAt} duration={activeBooking.duration} />}
            <button
              onClick={() => openConfirm(activeBooking)}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <CheckCircle2 size={16} /> Hoàn thành rửa xe
            </button>
          </div>
        </div>
      )}

      {/* Booking list */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest font-mono">Danh sách xe cần xử lý</h2>
        {bookings.filter(b => b.status !== 'DONE' && b.status !== 'COMPLETED').map(b => {
          const NextIcon = STATUS_ICON_NEXT[b.status]
          const isWorking = b.status === 'WORKING'
          return (
            <div key={b.id} className={`bg-neutral-950 border rounded-2xl p-5 transition-all ${isWorking ? 'border-blue-500/20' : 'border-white/5 hover:border-white/10'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm bg-white/5 border border-white/10 px-2.5 py-1 rounded text-white tracking-widest">{b.plate}</span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${SERVICE_COLOR[b.service]}`}>{b.service}</span>
                    <span className="text-xs font-mono text-white/30">{b.time}</span>
                  </div>
                  <p className="text-sm font-medium text-white">{b.customer}</p>
                  <p className="text-xs text-white/40 font-mono mt-0.5">{b.phone} · {b.duration}p · {b.price.toLocaleString('vi-VN')}đ</p>
                  {isWorking && b.startedAt && (
                    <div className="mt-3 max-w-xs">
                      <WorkingTimer startedAt={b.startedAt} duration={b.duration} />
                    </div>
                  )}
                </div>
                {NextIcon && (
                  <button
                    onClick={() => openConfirm(b)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all whitespace-nowrap ${STATUS_COLOR_NEXT[b.status]}`}
                  >
                    <NextIcon size={16} />
                    {STATUS_LABEL_NEXT[b.status]}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Confirm modal */}
      {confirmOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setConfirmOpen(false)} />
          <div className="relative bg-neutral-950 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <h3 className="font-medium text-white">{STATUS_LABEL_NEXT[selected.status]}</h3>
              <button onClick={() => setConfirmOpen(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">Khách hàng</span>
                  <span className="text-white font-medium">{selected.customer}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">Dịch vụ</span>
                  <select 
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    {Object.keys(servicesMap).map(svc => (
                      <option key={svc} value={svc}>{svc}</option>
                    ))}
                  </select>
                </div>
                {selectedService !== selected.service && servicesMap[selectedService] && (
                  <div className="flex justify-between items-center text-sm bg-cyan-500/10 border border-cyan-500/20 p-2 rounded-lg mt-2">
                    <span className="text-cyan-400 text-xs">Giá mới (chênh lệch):</span>
                    <span className="text-cyan-400 font-mono">
                      {servicesMap[selectedService].price.toLocaleString('vi-VN')}đ 
                      <span className="text-white/50 ml-1">({(servicesMap[selectedService].price - selected.price) > 0 ? '+' : ''}{(servicesMap[selectedService].price - selected.price).toLocaleString('vi-VN')}đ)</span>
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">Thanh toán</span>
                  <span className={selected.payment === 'PAID' ? 'text-emerald-400' : 'text-red-400'}>
                    {selected.payment === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </div>
              </div>
              {selected.status === 'PENDING' && (
                <div>
                  <label className="text-xs text-white/50 font-mono mb-1.5 block">Cập nhật biển số xe</label>
                  <input
                    value={plateInput} onChange={e => setPlateInput(e.target.value.toUpperCase())}
                    placeholder="Ví dụ: 51A-123.45"
                    className="w-full bg-black/50 border border-white/10 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-white font-mono uppercase text-sm"
                  />
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setConfirmOpen(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-colors">Hủy</button>
                <button
                  onClick={() => handleAction(selected.id)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${STATUS_COLOR_NEXT[selected.status]}`}
                >
                  <Check size={16} /> Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
