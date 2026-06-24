export const generateCurrentWeek = (baseDate = new Date()) => {
  const day = baseDate.getDay();
  const diff = baseDate.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(baseDate.setDate(diff));
  
  return Array.from({length: 7}).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      id: i,
      dateObj: d,
      name: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][d.getDay()],
      short: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()],
      dateStr: `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`,
      fullDate: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      isToday: new Date().toDateString() === d.toDateString()
    };
  });
};

export const TEN_SLOTS = [
  { key: '07', time: '07:00 - 08:00', label: 'SLOT 1', isBreak: false },
  { key: '08', time: '08:00 - 09:00', label: 'SLOT 2', isBreak: false },
  { key: '09', time: '09:00 - 10:00', label: 'SLOT 3', isBreak: false },
  { key: '10', time: '10:00 - 11:00', label: 'SLOT 4', isBreak: false },
  { key: '11', time: '11:00 - 12:00', label: 'SLOT 5', isBreak: false },
  { key: '12', time: '12:00 - 13:00', label: 'BREAK', isBreak: true },
  { key: '13', time: '13:00 - 14:00', label: 'SLOT 6', isBreak: false },
  { key: '14', time: '14:00 - 15:00', label: 'SLOT 7', isBreak: false },
  { key: '15', time: '15:00 - 16:00', label: 'SLOT 8', isBreak: false },
  { key: '16', time: '16:00 - 17:00', label: 'SLOT 9', isBreak: false },
  { key: '17', time: '17:00 - 18:00', label: 'SLOT 10', isBreak: false },
];

export const mapTimeToSlot = (timeStr) => {
  if (!timeStr) return '07';
  const hour = parseInt(timeStr.split(':')[0], 10);
  if (hour >= 7 && hour < 8) return '07';
  if (hour >= 8 && hour < 9) return '08';
  if (hour >= 9 && hour < 10) return '09';
  if (hour >= 10 && hour < 11) return '10';
  if (hour >= 11 && hour < 12) return '11';
  if (hour >= 13 && hour < 14) return '13';
  if (hour >= 14 && hour < 15) return '14';
  if (hour >= 15 && hour < 16) return '15';
  if (hour >= 16 && hour < 17) return '16';
  if (hour >= 17) return '17';
  return '07';
};

export const SHIFT_DEFINITIONS = [
  { key: 'morning', label: '07:00 - 12:00', alias: 'CA 1' },
  { key: 'afternoon', label: '13:00 - 18:00', alias: 'CA 2' },
];
