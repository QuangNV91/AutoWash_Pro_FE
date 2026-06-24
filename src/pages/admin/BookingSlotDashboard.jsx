import { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import { Clock, CheckCircle2, ChevronLeft, ChevronRight,
  Plus, Edit2, Car, CreditCard, LogIn, RefreshCw, X, Trash2, CalendarDays
} from 'lucide-react';
import BookingSlotModal from '../../components/admin/modals/BookingSlotModal';

const SERVICE_CONFIG = {
  'Eco Wash': { duration: 15, badge: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  'Premium Care': { duration: 30, badge: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  'Detailing & Shine': { duration: 60, badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  'Ceramic Shield': { duration: 120, badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
};

const WORK_STATUS = {
  PENDING: { label: 'Lịch hẹn', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: Clock },
  ARRIVED: { label: 'Đã đến', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20', icon: LogIn },
  WORKING: { label: 'Đang làm', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: RefreshCw },
  COMPLETED: { label: 'Hoàn thành', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2 },
};

const PAYMENT_STATUS = {
  UNPAID: { label: 'Chưa thanh toán', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
  PAID: { label: 'Đã thanh toán', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' }
};

const TEN_SLOTS = [
  { key: 'slot-1', time: '08:00 - 09:00', label: 'Slot 01' },
  { key: 'slot-2', time: '09:00 - 10:00', label: 'Slot 02' },
  { key: 'slot-3', time: '10:00 - 11:00', label: 'Slot 03' },
  { key: 'slot-4', time: '11:00 - 12:00', label: 'Slot 04' },
  { key: 'slot-break', time: '12:00 - 13:00', label: 'Nghỉ trưa', isBreak: true },
  { key: 'slot-5', time: '13:00 - 14:00', label: 'Slot 05' },
  { key: 'slot-6', time: '14:00 - 15:00', label: 'Slot 06' },
  { key: 'slot-7', time: '15:00 - 16:00', label: 'Slot 07' },
  { key: 'slot-8', time: '16:00 - 17:00', label: 'Slot 08' },
  { key: 'slot-9', time: '17:00 - 18:00', label: 'Slot 09' },
  { key: 'slot-10', time: '18:00 - 19:00', label: 'Slot 10' },
];

// Helper functions for date
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

const generateWeekDays = (startDate) => {
  const days = [];
  const start = new Date(startDate);
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const shortNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  
  for (let i = 0; i < 7; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    days.push({
      id: shortNames[current.getDay()],
      name: dayNames[current.getDay()],
      dateStr: String(current.getDate()).padStart(2, '0'),
      fullDate: formatDate(current),
      isToday: formatDate(current) === formatDate(new Date())
    });
  }
  return days;
};

// Initial state data
const today = new Date();
const todayStr = formatDate(today);

const mapTimeToSlot = (timeStr) => {
  if (!timeStr) return 'slot-1';
  const hour = parseInt(timeStr.split(':')[0], 10);
  if (hour === 8) return 'slot-1';
  if (hour === 9) return 'slot-2';
  if (hour === 10) return 'slot-3';
  if (hour === 11) return 'slot-4';
  if (hour === 13) return 'slot-5';
  if (hour === 14) return 'slot-6';
  if (hour === 15) return 'slot-7';
  if (hour === 16) return 'slot-8';
  if (hour === 17) return 'slot-9';
  if (hour === 18) return 'slot-10';
  return 'slot-1'; // fallback
};

export default function BookingSlotDashboard() {
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/bookings');
      if (res.data?.success && res.data.data) {
        const mapped = res.data.data.map(b => ({
          id: `BKG-${b.id}`,
          realId: b.id,
          customerId: b.customerId,
          date: b.bookingDate,
          slotKey: mapTimeToSlot(b.startTime),
          customer: b.customerName || 'Vãng lai',
          plate: b.licensePlate || 'N/A',
          service: b.serviceName || 'Eco Wash',
          status: b.status || 'PENDING',
          payment: b.paymentMethod ? 'PAID' : 'UNPAID'
        }));
        // Filter out CANCELLED and FAILED
        setBookings(mapped.filter(b => b.status !== 'CANCELLED' && b.status !== 'FAILED'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Week navigation
  const handlePrevWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };
  
  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentWeekStart(getStartOfWeek(now));
    setSelectedDate(formatDate(now));
  };

  const weekDays = useMemo(() => generateWeekDays(currentWeekStart), [currentWeekStart]);
  const selectedDayObj = weekDays.find(d => d.fullDate === selectedDate) || weekDays[0];

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingBookingId, setEditingBookingId] = useState(null);
  
  const [formData, setFormData] = useState({
    date: '', slotKey: '', service: 'Eco Wash', customer: '', plate: '', status: 'PENDING', payment: 'UNPAID'
  });

  // Calculate Capacity Logic
  const calculateAllocation = (slotBookings) => {
    let staff1 = 0;
    let staff2 = 0;
    
    // Process each booking
    for (const b of slotBookings) {
      const duration = SERVICE_CONFIG[b.service]?.duration || 0;
      if (duration === 120) {
        staff1 += 60;
        staff2 += 60;
      } else {
        if (staff1 + duration <= 60) {
          staff1 += duration;
        } else if (staff2 + duration <= 60) {
          staff2 += duration;
        } else {
          return { staff1, staff2, isValid: false }; // Cannot fit
        }
      }
    }
    
    return { 
      staff1, 
      staff2, 
      isValid: staff1 <= 60 && staff2 <= 60,
      isFull: staff1 === 60 && staff2 === 60,
      hasCeramic: slotBookings.some(b => b.service === 'Ceramic Shield')
    };
  };

  const currentDayBookings = useMemo(() => bookings.filter((b) => b.date === selectedDate), [bookings, selectedDate]);

  const summary = useMemo(() => {
    return {
      total: currentDayBookings.length,
      working: currentDayBookings.filter(b => ['WORKING', 'ARRIVED'].includes(b.status)).length,
      completed: currentDayBookings.filter(b => b.status === 'COMPLETED').length,
      unpaid: currentDayBookings.filter(b => b.payment === 'UNPAID').length
    };
  }, [currentDayBookings]);

  const computedDayData = useMemo(() => {
    return TEN_SLOTS.map((slot) => {
      if (slot.isBreak) return { ...slot, isBreak: true };
      
      const slotBookings = currentDayBookings.filter((b) => b.slotKey === slot.key);
      const allocation = calculateAllocation(slotBookings);
      
      return { 
        ...slot, 
        bookingsList: slotBookings, 
        allocation
      };
    });
  }, [currentDayBookings]);

  // Form Validation (Instant check on capacity)
  const isFormValid = useMemo(() => {
    if (!formData.service) return true;
    const existingBookings = bookings.filter(b => b.date === formData.date && b.slotKey === formData.slotKey && b.id !== editingBookingId);
    existingBookings.push(formData); // Test add
    const { isValid } = calculateAllocation(existingBookings);
    return isValid;
  }, [formData, bookings, editingBookingId]);

  const handleOpenAddModal = (slotKey) => {
    setModalMode('add');
    setEditingBookingId(null);
    setFormData({
      date: selectedDate,
      slotKey: slotKey,
      service: 'Eco Wash',
      customer: '',
      plate: '',
      status: 'PENDING',
      payment: 'UNPAID'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (bookingItem) => {
    setModalMode('edit');
    setEditingBookingId(bookingItem.id);
    setFormData({ ...bookingItem });
    setIsModalOpen(true);
  };

  const handleDeleteBooking = async () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn đặt lịch này?")) {
      const booking = bookings.find(b => b.id === editingBookingId);
      if (booking?.realId && booking?.customerId) {
        try {
          await api.patch(`/api/bookings/${booking.realId}/cancel?customerId=${booking.customerId}`);
        } catch (err) {
          console.error('Cancel error:', err);
          alert(err.response?.data?.message || 'Lỗi khi hủy lịch');
          return;
        }
      }
      setBookings((prev) => prev.filter((b) => b.id !== editingBookingId));
      setIsModalOpen(false);
    }
  };

  const handleNoShow = async () => {
    if (window.confirm("Đánh dấu khách hàng này không đến (No-show) và phạt điểm?")) {
      const booking = bookings.find(b => b.id === editingBookingId);
      if (booking?.realId) {
        try {
          await api.post(`/api/bookings/${booking.realId}/no-show`);
        } catch (err) {
          console.error('No-show error:', err);
          alert(err.response?.data?.message || 'Lỗi khi đánh dấu No-show. Lưu ý chỉ có thể đánh dấu PENDING và quá 30p.');
          return;
        }
      }
      setBookings((prev) => prev.filter((b) => b.id !== editingBookingId));
      setIsModalOpen(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      alert("Không đủ năng suất phục vụ cho gói dịch vụ này trong khung giờ hiện tại.");
      return;
    }

    if (modalMode === 'add') {
      setBookings((prev) => [...prev, { id: `BKG-${Math.floor(Math.random()*10000)}`, ...formData }]);
    } else {
      setBookings((prev) => prev.map((b) => (b.id === editingBookingId ? { ...b, ...formData } : b)));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-7xl mx-auto font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-hero text-3xl font-medium text-white tracking-tight">Lịch hẹn & Điều phối</h1>
          <p className="text-white/40 mt-1 text-sm flex items-center gap-2">
            <CalendarDays size={14}/> Ngày {selectedDayObj.dateStr}/{selectedDayObj.fullDate.split('-')[1]} - {selectedDayObj.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleToday}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-colors"
          >
            Hôm nay
          </button>
          <div className="flex items-center gap-2 bg-neutral-950 border border-white/5 rounded-xl p-1">
            <button
              onClick={handlePrevWeek}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="px-4 text-sm font-medium text-white w-32 text-center whitespace-nowrap">
              Tuần này
            </div>
            <button
              onClick={handleNextWeek}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Week overview pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {weekDays.map((day) => {
          const hasBookings = bookings.some(b => b.date === day.fullDate);
          const isSelected = selectedDate === day.fullDate;
          
          return (
            <button
              key={day.fullDate}
              onClick={() => setSelectedDate(day.fullDate)}
              className={`relative flex flex-col items-center min-w-[80px] p-3 rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  : day.isToday 
                    ? 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                    : 'bg-neutral-950 border-white/5 text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-xs font-medium mb-1">{day.name}</span>
              <span className={`text-xl font-hero ${isSelected || day.isToday ? 'text-white' : ''}`}>{day.dateStr}</span>
              {hasBookings && (
                <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs font-medium mb-1">Tổng lịch hẹn</p>
            <p className="text-2xl font-hero text-white">{summary.total}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
            <Car size={20} />
          </div>
        </div>
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-blue-400/60 text-xs font-medium mb-1">Đang xử lý</p>
            <p className="text-2xl font-hero text-blue-400">{summary.working}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <RefreshCw size={20} />
          </div>
        </div>
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-emerald-400/60 text-xs font-medium mb-1">Đã hoàn thành</p>
            <p className="text-2xl font-hero text-emerald-400">{summary.completed}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
        </div>
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-red-400/60 text-xs font-medium mb-1">Chưa thanh toán</p>
            <p className="text-2xl font-hero text-red-400">{summary.unpaid}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
            <CreditCard size={20} />
          </div>
        </div>
      </div>

      {/* Slots List */}
      <div className="space-y-6">
        {computedDayData.map((slot) => {
          if (slot.isBreak) {
            return (
              <div key={slot.key} className="flex flex-col lg:flex-row gap-6 opacity-60">
                <div className="w-full lg:w-48 shrink-0">
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5 h-full flex flex-col justify-center">
                    <span className="text-xs text-white/40 font-mono">BREAK</span>
                    <h3 className="text-xl font-hero text-white/60 tracking-tight mt-1">{slot.time}</h3>
                  </div>
                </div>
                <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-center border-dashed">
                  <p className="text-white/40 text-sm font-medium tracking-widest uppercase">Giờ nghỉ trưa toàn ca</p>
                </div>
              </div>
            );
          }

          return (
            <div key={slot.key} className="flex flex-col lg:flex-row gap-6">
              {/* Slot Time & Capacity Bar */}
              <div className="w-full lg:w-48 shrink-0">
                <div className={`bg-neutral-950 border border-white/5 rounded-2xl p-5 h-full relative overflow-hidden group ${slot.allocation.hasCeramic ? 'border-amber-500/30' : ''}`}>
                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-white/40 font-mono">{slot.label}</span>
                    {slot.allocation.hasCeramic && <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Ceramic Shield Locked" />}
                  </div>
                  <h3 className="text-xl font-hero text-white tracking-tight mt-1">{slot.time}</h3>
                  
                  <div className="mt-4 space-y-2">
                    {/* NV1 Progress */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-white/60 w-6">NV1</span>
                      <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${slot.allocation.staff1 === 60 ? 'bg-red-500' : slot.allocation.staff1 > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${(slot.allocation.staff1 / 60) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-white/40 w-8 text-right">{slot.allocation.staff1}p</span>
                    </div>
                    {/* NV2 Progress */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-white/60 w-6">NV2</span>
                      <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${slot.allocation.staff2 === 60 ? 'bg-red-500' : slot.allocation.staff2 > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${(slot.allocation.staff2 / 60) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-white/40 w-8 text-right">{slot.allocation.staff2}p</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slot Bookings Grid */}
              <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                {slot.bookingsList.map((item) => {
                  const StatusIcon = WORK_STATUS[item.status].icon;
                  const isCeramic = item.service === 'Ceramic Shield';
                  return (
                    <div key={item.id} className={`bg-neutral-950 border rounded-2xl p-5 relative group hover:border-white/10 transition-colors ${isCeramic ? 'border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]' : 'border-white/5'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="inline-flex items-center px-2 py-1 rounded bg-white/5 border border-white/10 font-mono text-xs text-white font-medium">
                          {item.plate ? item.plate.toUpperCase() : "CHƯA CÓ BKS"}
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded border ${SERVICE_CONFIG[item.service]?.badge}`}>
                          {item.service} ({SERVICE_CONFIG[item.service]?.duration}p)
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-white font-medium">{item.customer}</p>
                        <p className="text-xs text-white/40 mt-0.5">Mã đơn: {item.id}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${WORK_STATUS[item.status].color}`}>
                          <StatusIcon size={12} />
                          {WORK_STATUS[item.status].label}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${PAYMENT_STATUS[item.payment].color}`}>
                          {PAYMENT_STATUS[item.payment].label}
                        </span>
                      </div>

                      <button 
                        onClick={() => handleOpenEditModal(item)}
                        className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  );
                })}

                {!slot.allocation.isFull && (
                  <button
                    onClick={() => handleOpenAddModal(slot.key)}
                    className="bg-neutral-950/50 border-2 border-dashed border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-white/40 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all min-h-[160px] cursor-pointer"
                  >
                    <Plus size={24} className="mb-2" />
                    <span className="text-sm font-medium">Thêm xe vào khung giờ</span>
                    <span className="text-xs mt-1">
                      Còn trống {60 - slot.allocation.staff1}p (NV1) / {60 - slot.allocation.staff2}p (NV2)
                    </span>
                  </button>
                )}
                
                {slot.allocation.hasCeramic && slot.bookingsList.length === 1 && (
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 flex flex-col items-center justify-center text-amber-500/60 min-h-[160px]">
                    <Shield size={24} className="mb-2 opacity-50" />
                    <span className="text-sm font-medium text-center">Khung giờ bị khóa</span>
                    <span className="text-xs mt-1 text-center px-4">Gói Ceramic Shield chiếm dụng 100% nhân lực hiện tại</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Overlay via Component */}
      <BookingSlotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
        modalMode={modalMode}
        TEN_SLOTS={TEN_SLOTS}
        isFormValid={isFormValid}
        handleDeleteBooking={handleDeleteBooking}
        handleNoShow={handleNoShow}
      />
    </div>
  );
}