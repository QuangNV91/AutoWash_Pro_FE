import React from 'react';
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
}) {
  // Trạng thái chưa chọn ngày
  if (!hasDate) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-dark-700 rounded-2xl bg-dark-900/50">
        <Clock className="mx-auto h-12 w-12 text-dark-600 mb-3" />
        <p className="text-text-muted">Vui lòng chọn ngày trước để xem các khung giờ trống.</p>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-dark-800 animate-pulse border border-dark-700"></div>
        ))}
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="text-center py-8 border border-red-900/30 rounded-2xl bg-red-900/5">
        <AlertCircle className="mx-auto text-red-400 mb-2" size={28} />
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  // Không có slot nào
  if (slots.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-dark-700 rounded-2xl bg-dark-900/50">
        <Clock className="mx-auto h-12 w-12 text-dark-600 mb-3" />
        <p className="text-text-muted">Không có khung giờ khả dụng trong ngày này.</p>
      </div>
    );
  }

  // Tạo set lookup cho conflict slots
  const conflictMap = {};
  conflictSlots.forEach(cs => {
    conflictMap[cs.time] = cs.conflictWith;
  });

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {slots.map((slot) => {
        const isSelected = selectedTime === slot.time;
        const conflictWith = conflictMap[slot.time];
        const isConflict = !!conflictWith;
        const isDisabled = !slot.available || isConflict;

        let buttonClass = "py-3 rounded-xl border font-semibold text-sm transition-all duration-300 ";

        if (isConflict) {
          buttonClass += "bg-amber-900/10 border-amber-900/30 text-amber-400/60 cursor-not-allowed";
        } else if (!slot.available) {
          buttonClass += "bg-dark-800 border-dark-700 text-text-muted opacity-50 cursor-not-allowed";
        } else if (isSelected) {
          buttonClass += "bg-gold-500/20 border-gold-500 text-gold-400 shadow-[0_0_15px_rgba(201,152,26,0.3)]";
        } else {
          buttonClass += "bg-dark-800 border-dark-700 text-text-secondary hover:border-gold-500/40 hover:text-gold-400";
        }

        return (
          <button
            key={slot.time}
            disabled={isDisabled}
            onClick={() => onSelectTime(slot.time)}
            className={buttonClass}
            title={
              isConflict ? `Trùng với ${conflictWith}` :
              !slot.available ? 'Hết chỗ' : 'Còn trống'
            }
          >
            {slot.time}
            {isConflict && (
              <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                Trùng {conflictWith}
              </span>
            )}
            {!slot.available && !isConflict && (
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
