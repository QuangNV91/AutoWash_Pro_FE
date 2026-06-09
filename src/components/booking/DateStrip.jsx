import React from 'react';

export default function DateStrip({ selectedDate, onSelectDate, maxDays = 7 }) {
  // Generate next 'maxDays' days
  const dates = Array.from({ length: maxDays }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d,
      dayName: i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : d.toLocaleDateString('vi-VN', { weekday: 'short' }),
      dateString: d.toISOString().split('T')[0], // yyyy-mm-dd
      dayOfMonth: d.getDate(),
      month: d.getMonth() + 1
    };
  });

  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex gap-4">
        {dates.map((item) => {
          const isSelected = selectedDate === item.dateString;
          return (
            <button
              key={item.dateString}
              onClick={() => onSelectDate(item.dateString)}
              className={`flex-shrink-0 w-24 h-28 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300
                ${isSelected 
                  ? 'border-gold-500 bg-gold-500/10 shadow-[0_0_20px_rgba(201,152,26,0.2)] text-gold-400' 
                  : 'border-dark-700 bg-dark-800 text-text-secondary hover:border-gold-500/50 hover:bg-dark-700'}
              `}
            >
              <span className={`text-xs uppercase font-semibold mb-2 ${isSelected ? 'text-gold-500' : 'text-text-muted'}`}>
                {item.dayName}
              </span>
              <span className="text-3xl font-heading font-bold mb-1">
                {item.dayOfMonth}
              </span>
              <span className="text-xs">
                Tháng {item.month}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
