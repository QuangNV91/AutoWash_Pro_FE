import api from './api';



// ============ API FUNCTIONS ============

/**
 * Lấy danh sách dịch vụ
 * GET /services
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
 * GET /bookings/available-slots?booking_date=YYYY-MM-DD&service_id=X
 */
export async function getAvailableSlots(bookingDate, serviceId) {
  try {
    const res = await api.get('/api/v1/bookings/available-slots', {
      params: { booking_date: bookingDate, service_id: serviceId },
    });
    return res.data.data || res.data;
  } catch (err) {
    console.error('getAvailableSlots API error:', err);
    throw err;
  }
}

/**
 * Gọi API checkout để tạo bookings và lấy link thanh toán (nếu ONLINE)
 * POST /api/v1/bookings/checkout
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
 * GET /api/v1/bookings/history
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
 * PATCH /api/v1/bookings/{bookingId}/cancel
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
 * PATCH /api/v1/bookings/{bookingId}/status
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
