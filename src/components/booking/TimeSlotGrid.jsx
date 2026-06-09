import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';

export default function TimeSlotGrid({ selectedDate, selectedTime, onSelectTime, duration = 15 }) {
  // Generate time slots from 07:00 to 18:00 with 15m intervals
  const timeSlots = useMemo(() => {
    const slots = [];
    let currentHour = 7;
    let currentMinute = 0;

    while (currentHour < 18) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Determine if it's break time (12:00 - 13:00)
      const isBreakTime = currentHour === 12;
      
      // Simulate some random booked slots if not break time (just for UI mock)
      // In real app, this would come from API based on selectedDate
      const isBooked = !isBreakTime && Math.random() > 0.85; 

      slots.push({
        time: timeString,
        isBreakTime,
        isBooked,
        available: !isBreakTime && !isBooked
      });

      currentMinute += 15;
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour += 1;
      }
    }
    return slots;
  }, [selectedDate]); // Regenerate mock data when date changes

  if (!selectedDate) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-dark-700 rounded-2xl bg-dark-900/50">
        <Clock className="mx-auto h-12 w-12 text-dark-600 mb-3" />
        <p className="text-text-muted">Vui lòng chọn ngày trước để xem các khung giờ trống.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {timeSlots.map((slot) => {
        const isSelected = selectedTime === slot.time;
        
        let buttonClass = "py-3 rounded-xl border font-semibold text-sm transition-all duration-300 ";
        
        if (slot.isBreakTime) {
          buttonClass += "bg-dark-900 border-dark-800 text-dark-600 cursor-not-allowed";
        } else if (slot.isBooked) {
          buttonClass += "bg-dark-800 border-dark-700 text-text-muted opacity-50 cursor-not-allowed";
        } else if (isSelected) {
          buttonClass += "bg-gold-500/20 border-gold-500 text-gold-400 shadow-[0_0_15px_rgba(201,152,26,0.3)]";
        } else {
          buttonClass += "bg-dark-800 border-dark-700 text-text-secondary hover:border-gold-500/40 hover:text-gold-400";
        }

        return (
          <button
            key={slot.time}
            disabled={!slot.available}
            onClick={() => onSelectTime(slot.time)}
            className={buttonClass}
            title={slot.isBreakTime ? "Giờ nghỉ trưa" : slot.isBooked ? "Hết chỗ" : "Còn trống"}
          >
            {slot.time}
            {(slot.isBreakTime || slot.isBooked) && (
              <span className="block text-[10px] font-normal opacity-70 mt-0.5">
                {slot.isBreakTime ? 'Nghỉ trưa' : 'Hết chỗ'}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
