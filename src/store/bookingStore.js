import { create } from 'zustand';

// Giới hạn xe theo Tier
const TIER_VEHICLE_LIMITS = {
  MEMBER: 2,
  SILVER: 3,
  GOLD: 4,
  PLATINUM: 5,
};

// Giới hạn ngày đặt trước theo Tier
const TIER_MAX_DAYS = {
  MEMBER: 7,
  SILVER: 10,
  GOLD: 12,
  PLATINUM: 14,
};

// Chiết khấu theo Tier
const TIER_DISCOUNTS = {
  MEMBER: 0,
  SILVER: 0.05,
  GOLD: 0.10,
  PLATINUM: 0.15,
};

const generateId = () => crypto.randomUUID ? crypto.randomUUID() : `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const createEmptyItem = () => ({
  id: generateId(),
  service: null,
  selectedTime: null,
  customerNote: '',
  availableSlots: [],
  slotsLoading: false,
  slotsError: null,
});

const useBookingStore = create((set, get) => ({
  // === Cart Items ===
  bookingItems: [createEmptyItem()],

  // === Thông tin chung ===
  selectedDate: null,
  paymentMethod: 'CASH',
  userTier: 'MEMBER',

  // === Kết quả submit ===
  submitResults: [],
  isSubmitting: false,

  // === Getters ===
  getMaxVehicles: () => TIER_VEHICLE_LIMITS[get().userTier] || 2,
  getMaxDays: () => TIER_MAX_DAYS[get().userTier] || 7,
  getDiscount: () => TIER_DISCOUNTS[get().userTier] || 0,

  getTotalPrice: () => {
    const items = get().bookingItems;
    return items.reduce((sum, item) => sum + (item.service?.base_price ?? item.service?.price ?? 0), 0);
  },

  getTotalPoints: () => {
    const items = get().bookingItems;
    const basePoints = items.reduce((sum, item) => sum + (item.service?.base_points ?? item.service?.points ?? 0), 0);
    const onlineBonus = get().paymentMethod === 'ONLINE' ? 10 * items.filter(i => i.service).length : 0;
    return basePoints + onlineBonus;
  },

  getDiscountedTotal: () => {
    const total = get().getTotalPrice();
    const discount = get().getDiscount();
    return Math.round(total * (1 - discount));
  },

  // Tính slot xung đột client-side cho 1 item
  getConflictingSlots: (itemId) => {
    const { bookingItems } = get();
    const conflictSlots = []; // { time: string, conflictWith: string (vehicleName) }

    const currentItem = bookingItems.find(i => i.id === itemId);
    if (!currentItem) return conflictSlots;

    const otherItems = bookingItems.filter(i => i.id !== itemId && i.selectedTime && i.service);

    for (const other of otherItems) {
      const otherStartMinutes = timeToMinutes(other.selectedTime);
      const otherDuration = other.service.duration_minutes;

      // Chỉ block chính xác các block 15p mà Xe kia ĐANG CHIẾM
      // Không trừ đi thời lượng của xe hiện tại (cho phép xếp lịch linh hoạt hơn, garage có thể có nhiều khoang)
      const rangeStart = otherStartMinutes;
      const rangeEnd = otherStartMinutes + otherDuration;

      for (let m = rangeStart; m < rangeEnd; m += 15) {
        if (m >= 0 && m < 18 * 60) {
          conflictSlots.push({
            time: minutesToTime(m),
            conflictWith: `Xe ${bookingItems.indexOf(other) + 1}`,
          });
        }
      }
    }

    return conflictSlots;
  },

  // === Actions ===
  addItem: () => {
    const { bookingItems, getMaxVehicles } = get();
    if (bookingItems.length >= getMaxVehicles()) return;
    set({ bookingItems: [...bookingItems, createEmptyItem()] });
  },

  removeItem: (itemId) => {
    const { bookingItems } = get();
    if (bookingItems.length <= 1) return;
    set({ bookingItems: bookingItems.filter(i => i.id !== itemId) });
  },

  updateItem: (itemId, updates) => {
    set(state => ({
      bookingItems: state.bookingItems.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    }));
  },

  setItemSlots: (itemId, slots, loading = false, error = null) => {
    set(state => ({
      bookingItems: state.bookingItems.map(item =>
        item.id === itemId
          ? { ...item, availableSlots: slots, slotsLoading: loading, slotsError: error }
          : item
      ),
    }));
  },

  setItemSlotsLoading: (itemId, loading) => {
    set(state => ({
      bookingItems: state.bookingItems.map(item =>
        item.id === itemId ? { ...item, slotsLoading: loading } : item
      ),
    }));
  },

  setDate: (date) => {
    // Reset tất cả slot giờ khi đổi ngày
    set(state => ({
      selectedDate: date,
      bookingItems: state.bookingItems.map(item => ({
        ...item,
        selectedTime: null,
        availableSlots: [],
        slotsError: null,
      })),
    }));
  },

  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setUserTier: (tier) => set({ userTier: tier }),

  setSubmitResults: (results) => set({ submitResults: results }),
  setIsSubmitting: (val) => set({ isSubmitting: val }),

  // Reset toàn bộ
  resetCart: () => set({
    bookingItems: [createEmptyItem()],
    selectedDate: null,
    paymentMethod: 'CASH',
    submitResults: [],
    isSubmitting: false,
  }),

  // Reset nhưng giữ ngày (cho "Đặt lịch xe khác")
  resetKeepDate: () => set(state => ({
    bookingItems: [createEmptyItem()],
    paymentMethod: 'CASH',
    submitResults: [],
    isSubmitting: false,
    // selectedDate giữ nguyên
  })),

  // Kiểm tra bước 1 valid
  isStep1Valid: () => {
    const { bookingItems } = get();
    return bookingItems.length > 0 && bookingItems.every(
      item => !!item.service
    );
  },

  // Kiểm tra bước 2 valid
  isStep2Valid: () => {
    const { bookingItems, selectedDate } = get();
    return !!selectedDate && bookingItems.every(item => !!item.selectedTime);
  },
}));

// === Helper functions ===
function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export { TIER_VEHICLE_LIMITS, TIER_MAX_DAYS, TIER_DISCOUNTS };
export default useBookingStore;
