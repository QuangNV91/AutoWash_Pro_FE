
export default function DateStrip({ selectedDate, onSelectDate, maxDays = 7 }) {
  const dates = Array.from({ length: maxDays }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return {
      date: d,
      dayName: i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : d.toLocaleDateString('vi-VN', { weekday: 'short' }),
      dateString: `${year}-${month}-${day}`,
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
              className={`flex-shrink-0 w-24 h-28 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300
                ${isSelected
                  ? 'border-white bg-white/10 text-white'
                  : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:bg-white/10'}
              `}
            >
              <span className={`text-xs uppercase font-medium mb-2 ${isSelected ? 'text-white' : 'text-white/40'}`}>
                {item.dayName}
              </span>
              <span className="text-3xl font-hero font-medium mb-1">
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
