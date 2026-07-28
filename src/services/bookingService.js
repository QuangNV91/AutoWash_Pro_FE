import api from './api';
import { mapTimeToSlot } from '../utils/scheduleUtils';

/**
 * Lấy danh sách dịch vụ
 */
export async function getServices() {
  try {
    const res = await api.get('/api/v1/services');
    return res.data.data || res.data;
  } catch (err) {
    console.error('getServices API error:', err);
    throw err;
  }
}

/**
 * Lấy slot trống cho 1 ngày + 1 dịch vụ
 */
export async function getAvailableSlots(bookingDate, serviceId) {
  try {
    const res = await api.get('/api/v1/bookings/available-slots', {
      params: { booking_date: bookingDate, service_id: serviceId },
    });
    const slots = res.data.data || res.data;

    return slots;
  } catch (err) {
    console.error('getAvailableSlots API error:', err);
    throw err;
  }
}

/**
 * Gọi API checkout để tạo bookings và lấy link thanh toán (nếu ONLINE)
 */
export async function checkoutBookings(checkoutData) {
  try {
    const res = await api.post('/api/v1/bookings/checkout', checkoutData);
    return res.data;
  } catch (err) {
    console.error('Checkout API error:', err);
    throw err;
  }
}

/**
 * Lấy danh sách lịch hẹn của user đang đăng nhập
 */
export async function getBookingHistory() {
  try {
    const res = await api.get('/api/v1/bookings/history');
    return res.data.data || res.data;
  } catch (err) {
    console.error('getBookingHistory API error:', err);
    throw err;
  }
}

/**
 * Hủy lịch hẹn
 */
export async function cancelBooking(bookingId) {
  try {
    const res = await api.patch(`/api/v1/bookings/${bookingId}/cancel`);
    return res.data;
  } catch (err) {
    console.error('cancelBooking API error:', err);
    throw err;
  }
}

/**
 * Cập nhật trạng thái và dịch vụ cho lịch hẹn (Dành cho Staff/Admin)
 */
export async function updateBookingStatus(bookingId, updateData) {
  try {
    const res = await api.patch(`/api/v1/bookings/${bookingId}/status`, updateData, { params: updateData });
    return res.data;
  } catch (err) {
    console.error('updateBookingStatus API error:', err);
    throw err;
  }
}
