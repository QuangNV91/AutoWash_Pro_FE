import { create } from 'zustand';

const useBookingStore = create((set) => ({
  selectedService: null,
  selectedDate: null,
  selectedTime: null,
  vehicleType: '',
  customerNote: '',
  paymentMethod: 'CASH', // 'CASH' | 'ONLINE'
  discountAmount: 0,
  totalAmount: 0,
  
  // Actions
  setService: (service) => set({ selectedService: service }),
  setDateTime: (date, time) => set({ selectedDate: date, selectedTime: time }),
  setBookingDetails: (details) => set((state) => ({ ...state, ...details })),
  resetBooking: () => set({
    selectedService: null,
    selectedDate: null,
    selectedTime: null,
    vehicleType: '',
    customerNote: '',
    paymentMethod: 'CASH',
    discountAmount: 0,
    totalAmount: 0,
  })
}));

export default useBookingStore;
