import api from './api';
import { mapTimeToSlot } from '../utils/scheduleUtils';

/**
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
