import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, CheckCircle2, Banknote,
  Smartphone, Building2, Check, AlertTriangle, Receipt, Gift
} from 'lucide-react'

import { useEffect } from 'react'
import api from '../../services/api'
import { updateBookingStatus } from '../../services/bookingService'
import toast from 'react-hot-toast'

const METHOD_OPTIONS = [
  { key: 'CASH',          label: 'Tiền mặt',     icon: Banknote,    color: 'text-amber-400  border-amber-500/30  bg-amber-500/10' },
  { key: 'BANK_TRANSFER', label: 'Chuyển khoản', icon: Building2,   color: 'text-blue-400   border-blue-500/30   bg-blue-500/10'  },
  { key: 'MOMO',          label: 'Ví MoMo',      icon: Smartphone,  color: 'text-pink-400   border-pink-500/30   bg-pink-500/10'  },
]
const SERVICE_COLOR = {
  'Eco Wash': 'text-cyan-400', 'Premium Care': 'text-purple-400',
  'Detailing & Shine': 'text-emerald-400', 'Ceramic Shield': 'text-amber-400',
}
const TIER_COLOR = { MEMBER: 'text-gray-400', SILVER: 'text-slate-300', GOLD: 'text-amber-400', PLATINUM: 'text-purple-400' }

export default function StaffPayment() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [selected, setSelected] = useState(null)
  const [method, setMethod]   = useState(null)
  const [paid, setPaid]       = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      let currentServicesMap = {
        'Eco Wash': { price: 50000, points: 50 },
        'Premium Care': { price: 150000, points: 150 },
        'Detailing & Shine': { price: 350000, points: 350 },
        'Ceramic Shield': { price: 800000, points: 800 }
      };

      try {
        const resServices = await api.get('/api/v1/services');
        if (resServices.data?.success && resServices.data.data) {
          const newMap = {};
          resServices.data.data.forEach(s => {
            newMap[s.serviceName] = { price: s.basePrice, points: s.basePoints || (s.basePrice / 1000) };
          });
          currentServicesMap = newMap;
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      }

      try {
        const res = await api.get('/api/bookings');
        if (res.data?.success && res.data.data) {
          const paidStr = localStorage.getItem('paidBookings');
          const paidList = paidStr ? JSON.parse(paidStr) : [];
          
          const offset = new Date().getTimezoneOffset();
          const localDate = new Date(new Date().getTime() - (offset * 60 * 1000));
          const today = localDate.toISOString().split('T')[0];

          // Filter for COMPLETED and not paid, and only show today's bookings
          // We check if paymentMethod is absent and the booking ID is not in our local paidList
          const unpaid = res.data.data.filter(b => b.status === 'COMPLETED' && !b.paymentMethod && !paidList.includes(b.id) && b.bookingDate === today);
          
          const formatted = unpaid.map(b => ({
            id: `BKG-${b.id}`,
            realId: b.id,
            time: b.startTime ? b.startTime.substring(0, 5) : '00:00',
            plate: b.licensePlate || '—',
            customer: b.customerName || 'Khách hàng',
            service: b.serviceName || 'Eco Wash',
            price: currentServicesMap[b.serviceName]?.price || 0,
            loyaltyPoints: currentServicesMap[b.serviceName]?.points || 50,
            tier: 'MEMBER',
            tierDiscount: 0
          }));
          
          setBookings(formatted);
          if (formatted.length > 0) setSelected(formatted[0]);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-white/40 gap-4">
      <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-cyan-500 rounded-full" />
      <p>Đang tải dữ liệu...</p>
    </div>
  )

  if (!selected) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-white/20 gap-4">
      <CheckCircle2 size={64} className="text-emerald-500/30" />
      <p className="text-lg font-medium text-white/40">Tất cả xe đã thanh toán!</p>
      <button onClick={() => navigate('/staff')} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white transition-colors">
        Về trang chủ
      </button>
    </div>
  )

  const discount   = Math.round(selected.price * selected.tierDiscount)
  const bonusPts   = method === 'BANK_TRANSFER' || method === 'MOMO' ? 10 : 0
  const finalPrice = selected.price - discount
  const totalPts   = selected.loyaltyPoints + bonusPts

  const handleConfirmPayment = async () => {
    if (!method || !selected) return;
    
    // Call API to mark as PAID
    try {
      // We assume there's a way to mark payment as PAID. 
      // If the backend doesn't have a specific payment endpoint, we might patch the status.
      // Assuming updateBookingStatus can update paymentStatus or paymentMethod
      await updateBookingStatus(selected.realId, { 
        status: 'COMPLETED',
        paymentMethod: method, 
        paymentStatus: 'PAID' 
      });

      // Save to local storage since backend doesn't persist paymentMethod
      const paidStr = localStorage.getItem('paidBookings');
      let paidList = paidStr ? JSON.parse(paidStr) : [];
      if (!paidList.includes(selected.realId)) {
        paidList.push(selected.realId);
        localStorage.setItem('paidBookings', JSON.stringify(paidList));
      }
      
      setPaid(true)
      setBookings(prev => prev.filter(b => b.id !== selected.id))
      setTimeout(() => {
        setPaid(false)
        setMethod(null)
        const remaining = bookings.filter(b => b.id !== selected.id)
        setSelected(remaining[0] || null)
      }, 2000)
    } catch (err) {
      toast.error('Lỗi khi cập nhật thanh toán');
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto font-body text-white">

      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <button onClick={() => navigate('/staff')} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-hero text-2xl font-medium tracking-tight flex items-center gap-3">
            <Receipt className="text-cyan-400" size={24} />
            Thu tiền & Thanh toán
          </h1>
          <p className="text-white/40 text-sm font-mono mt-0.5">{bookings.length} xe chờ thanh toán</p>
        </div>
      </div>

      {/* Success toast */}
      {paid && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-black px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-medium animate-bounce">
          <CheckCircle2 size={20} /> Đã xác nhận thanh toán thành công!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — pending list */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3">Chờ thanh toán ({bookings.length})</h2>
          {bookings.map(b => (
            <button key={b.id} onClick={() => { setSelected(b); setMethod(null) }}
              className={`w-full text-left bg-neutral-950 border rounded-2xl p-4 transition-all ${selected?.id === b.id ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-white/5 hover:border-white/10'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white tracking-widest">{b.plate}</span>
                <span className="text-[10px] text-white/30 font-mono">{b.time}</span>
              </div>
              <p className="text-sm font-medium text-white">{b.customer}</p>
              <div className="flex justify-between items-center mt-1">
                <p className={`text-xs font-medium ${SERVICE_COLOR[b.service]}`}>{b.service}</p>
                <p className="text-sm font-mono text-white">{b.price.toLocaleString('vi-VN')}đ</p>
              </div>
            </button>
          ))}
        </div>

        {/* Right — invoice */}
        <div className="lg:col-span-2 space-y-5">

          {/* Invoice card */}
          <div className="bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-start">
              <div>
                <p className="text-xs text-white/40 font-mono mb-1">{selected.id}</p>
                <h2 className="text-lg font-medium text-white">{selected.customer}</h2>
                <p className="text-xs text-white/40 font-mono">{selected.time} · {selected.plate}</p>
              </div>
              <span className={`text-xs font-mono px-2 py-1 rounded border ${TIER_COLOR[selected.tier]} bg-white/5 border-white/10`}>
                {selected.tier}
              </span>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Dịch vụ</span>
                <span className={`font-medium ${SERVICE_COLOR[selected.service]}`}>{selected.service}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Đơn giá</span>
                <span className="text-white font-mono">{selected.price.toLocaleString('vi-VN')}đ</span>
              </div>
              {selected.tierDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Chiết khấu Tier ({(selected.tierDiscount * 100).toFixed(0)}%)</span>
                  <span className="text-emerald-400 font-mono">-{discount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              {bonusPts > 0 && (
                <div className="flex justify-between text-sm text-amber-400/80">
                  <span className="flex items-center gap-1"><Gift size={13} /> Điểm thưởng TT online</span>
                  <span>+{bonusPts} điểm</span>
                </div>
              )}
              <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                <span className="font-medium text-white">Tổng thanh toán</span>
                <span className="text-2xl font-hero text-cyan-400 font-light">{finalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between text-sm">
                <span className="text-white/50 flex items-center gap-1.5"><Gift size={14} className="text-amber-400" /> Điểm tích lũy nhận được</span>
                <span className="text-amber-400 font-mono font-medium">+{totalPts} điểm</span>
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div>
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3">Phương thức thanh toán</p>
            <div className="grid grid-cols-3 gap-3">
              {METHOD_OPTIONS.map(m => {
                const Icon = m.icon
                return (
                  <button key={m.key} onClick={() => setMethod(m.key)}
                    className={`p-4 rounded-2xl border text-center transition-all ${method === m.key ? m.color : 'bg-neutral-950 border-white/5 hover:border-white/10 text-white/50'}`}>
                    <Icon size={24} className="mx-auto mb-2" />
                    <p className="text-xs font-medium">{m.label}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Confirm */}
          {!method && (
            <div className="flex items-center gap-2 text-amber-400/70 text-sm font-mono">
              <AlertTriangle size={15} /> Vui lòng chọn phương thức thanh toán
            </div>
          )}
          <button
            onClick={handleConfirmPayment}
            disabled={!method}
            className="w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-3 transition-all
              disabled:opacity-30 disabled:cursor-not-allowed
              enabled:bg-cyan-500 enabled:hover:bg-cyan-400 enabled:text-black enabled:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <Check size={20} /> Xác nhận đã thu tiền
          </button>
        </div>
      </div>
    </div>
  )
}
