import { create } from 'zustand';
import api from '../services/api';

const useSystemConfigStore = create((set) => ({
  maxBookingsPerSlot: 2, 
  rewardPointsOnlinePayment: 10, 

  fetchConfig: async () => {
    try {
      const res = await api.get('/api/v1/system-config');
      if (res.data) {
        set({ 
          maxBookingsPerSlot: res.data.maxConcurrentSlots || 2, 
          rewardPointsOnlinePayment: res.data.rewardPointsOnlinePayment || 10
        });
      }
    } catch (err) {
      console.error('Lỗi lấy cấu hình:', err);
    }
  },

  updateConfig: async (maxSlots, rewardPoints) => {
    try {
      const res = await api.put('/api/v1/system-config', {
        maxConcurrentSlots: maxSlots,
        rewardPointsOnlinePayment: rewardPoints
      });
      if (res.data) {
        set({
          maxBookingsPerSlot: res.data.maxConcurrentSlots,
          rewardPointsOnlinePayment: res.data.rewardPointsOnlinePayment
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Lỗi cập nhật cấu hình:', err);
      return false;
    }
  }
}));

export default useSystemConfigStore;
