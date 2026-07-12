import { Clock, AlertCircle } from 'lucide-react';

/**
 * TimeSlotGrid — Render lưới khung giờ
 * 
 * Props:
 * - slots: Array<{ time: string, available: boolean }> — từ API
 * - selectedTime: string | null
 * - onSelectTime: (time: string) => void
 * - conflictSlots: Array<{ time: string, conflictWith: string }> — xung đột client-side
 * - loading: boolean
 * - error: string | null
 * - hasDate: boolean — đã chọn ngày chưa
 */
export default function TimeSlotGrid({ 
  slots = [], 
  selectedTime, 
  onSelectTime, 
  conflictSlots = [],
  loading = false,
  error = null,
  hasDate = false,
  selectedDate = null,
}) {
  // Trạng thái chưa chọn ngày
  if (!hasDate) {
    return (
      <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/5">
        <Clock className="mx-auto h-12 w-12 text-white/20 mb-3" />
        <p className="text-white/40 text-sm">Vui lòng chọn ngày trước để xem các khung giờ trống.</p>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse border border-white/10"></div>
        ))}
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="text-center py-8 border border-red-500/20 rounded-2xl bg-red-900/10">
        <AlertCircle className="mx-auto text-red-400 mb-2" size={28} />
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  // Không có slot nào
  if (slots.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/5">
        <Clock className="mx-auto h-12 w-12 text-white/20 mb-3" />
        <p className="text-white/40 text-sm">Không có khung giờ khả dụng trong ngày này.</p>
      </div>
    );
  }

  // Tạo set lookup cho conflict slots
  const conflictMap = {};
  conflictSlots.forEach(cs => {
    conflictMap[cs.time] = cs.conflictWith;
  });

  // Calculate if selectedDate is today to lock past times
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;
  const isToday = selectedDate === todayStr;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {slots.map((slot) => {
        const isSelected = selectedTime === slot.time;
        const conflictWith = conflictMap[slot.time];
        const isConflict = !!conflictWith;
        
        // Kiểm tra xem giờ này đã trôi qua chưa (nếu là hôm nay)
        let isPastTime = false;
        if (isToday) {
          const [h, m] = slot.time.split(':').map(Number);
          const slotMinutes = h * 60 + m;
          isPastTime = slotMinutes <= currentMinutes;
        }

        const isDisabled = !slot.available || isConflict || isPastTime;

        let buttonClass = "py-3 rounded-xl border font-medium text-sm transition-all duration-300 relative overflow-hidden ";

        if (isConflict) {
          buttonClass += "bg-white/5 border-white/10 text-white/20 cursor-not-allowed";
        } else if (isPastTime) {
          buttonClass += "bg-white/5 border-white/10 text-white/20 opacity-50 cursor-not-allowed";
        } else if (!slot.available) {
          buttonClass += "bg-white/5 border-white/10 text-white/20 opacity-50 cursor-not-allowed";
        } else if (isSelected) {
          buttonClass += "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]";
        } else {
          buttonClass += "bg-transparent border-white/10 text-white/60 hover:border-white/40 hover:text-white";
        }

        return (
          <button
            key={slot.time}
            disabled={isDisabled}
            onClick={() => onSelectTime(slot.time)}
            className={buttonClass}
            title={
              isConflict ? `Trùng với ${conflictWith}` :
              isPastTime ? 'Đã qua giờ' :
              !slot.available ? 'Hết chỗ' : 'Còn trống'
            }
          >
            {slot.time}
            {isConflict && (
              <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                Trùng {conflictWith}
              </span>
            )}
            {isPastTime && !isConflict && (
              <span className="block text-[10px] font-normal opacity-70 mt-0.5">
                Đã qua
              </span>
            )}
            {!slot.available && !isConflict && !isPastTime && (
              <span className="block text-[10px] font-normal opacity-70 mt-0.5">
                Hết chỗ
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
