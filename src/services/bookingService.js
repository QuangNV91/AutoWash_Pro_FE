import api from './api';

// ============ MOCK DATA ============
// Sẽ xóa khi có Backend thật

const MOCK_SERVICES = [
  {
    id: 1,
    name: 'Eco Wash',
    subtitle: 'Gói Cơ Bản',
    badge: 'Tiết Kiệm',
    themeColor: 'cyan',
    base_price: 40000,
    duration_minutes: 15,
    base_points: 40,
    features: [
      'Xịt nước rửa bụi bẩn bề mặt ngoài',
      'Phun xà bông bọt tuyết toàn thân xe',
      'Rửa sạch bằng nước áp lực cao',
      'Lau khô bằng khăn microfiber chuyên dụng',
    ],
  },
  {
    id: 2,
    name: 'Premium Care',
    subtitle: 'Gói Chuyên Sâu',
    badge: 'Phổ Biến Nhất',
    themeColor: 'purple',
    base_price: 150000,
    duration_minutes: 30,
    base_points: 150,
    features: [
      'Toàn bộ quy trình Eco Wash',
      'Rửa kỹ gầm xe & rửa nội thất bánh xe',
      'Vệ sinh sên xích, tra dầu bôi trơn',
      'Rửa sạch lốc máy & khu vực động cơ',
      'Hút bụi & lau dọn nội thất xe cơ bản',
      'Kiểm tra áp suất lốp tiêu chuẩn',
    ],
  },
  {
    id: 3,
    name: 'Detailing & Shine',
    subtitle: 'Gói Cao Cấp',
    badge: 'Khuyên Dùng',
    themeColor: 'emerald',
    base_price: 350000,
    duration_minutes: 60,
    base_points: 350,
    features: [
      'Toàn bộ quy trình Premium Care',
      'Chăm sóc chuyên sâu bề mặt sơn xe',
      'Tẩy ố kính & phủ Nano kính lái chống bám nước',
      'Đánh bóng & xóa xước nhẹ bề mặt sơn',
      'Dưỡng & bảo vệ nội thất da, nhựa cao cấp',
      'Kiểm tra tổng thể và bàn giao xe',
    ],
  },
  {
    id: 4,
    name: 'Ceramic Shield',
    subtitle: 'Gói Siêu Cấp',
    badge: 'Ultimate',
    themeColor: 'amber',
    base_price: 800000,
    duration_minutes: 120,
    base_points: 800,
    features: [
      'Toàn bộ quy trình Detailing & Shine',
      'Tẩy sạch nhựa đường & bụi sắt bám sơn',
      'Hiệu chỉnh sơn toàn diện (Multi-stage Paint Correction)',
      'Phủ 2 lớp Ceramic cao cấp — bảo vệ sơn toàn diện',
      'Xử lý kháng nước, kháng bụi, kháng tia UV',
      'Bảo hành lớp phủ Ceramic trong vòng 6 tháng',
    ],
  },
];

function generateMockSlots(dateStr, serviceId) {
  const service = MOCK_SERVICES.find(s => s.id === serviceId);
  const duration = service?.duration_minutes || 15;
  const slots = [];
  let hour = 7;
  let minute = 0;

  // Helper function to check if a specific 15-min block is globally available
  // Uses date and time ONLY, so it's perfectly consistent across ALL services
  const isBlockAvailable = (blockMinutes) => {
    // Để tránh các "lỗ hổng" 15 phút gây khó hiểu (ví dụ 10:45 trống nhưng 11:00 hết chỗ do 11:45 bận),
    // ta gom nhóm availability theo block 60 phút. Nếu một giờ nào đó bận, toàn bộ 60p đó sẽ bận.
    const hourChunk = Math.floor(blockMinutes / 60);
    const seed = (dateStr.charCodeAt(dateStr.length - 1) + hourChunk) % 5;
    return seed !== 0; // ~80% available, seed 0 means booked
  };

  while (hour < 18) {
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const totalMinutes = hour * 60 + minute;

    // Bỏ qua giờ nghỉ trưa 12:00 - 13:00
    const isBreak = totalMinutes >= 720 && totalMinutes < 780;

    // Kiểm tra slot có đủ thời gian trước 18:00 không
    const endMinutes = totalMinutes + duration;
    const fitsBeforeClose = endMinutes <= 1080; // 18:00

    // Không vượt qua giờ nghỉ (nếu slot bắt đầu trước 12:00 nhưng kết thúc sau 12:00)
    const crossesBreak = totalMinutes < 720 && endMinutes > 720;

    if (!isBreak && fitsBeforeClose && !crossesBreak) {
      // Check ALL 15-minute blocks required for this service's duration
      let available = true;
      for (let m = totalMinutes; m < endMinutes; m += 15) {
        if (!isBlockAvailable(m)) {
          available = false;
          break;
        }
      }

      slots.push({ time, available });
    }

    minute += 15;
    if (minute >= 60) {
      minute = 0;
      hour++;
    }
  }

  return slots;
}

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
    const res = await api.patch(`/api/v1/bookings/${bookingId}/status`, updateData);
    return res.data;
  } catch (err) {
    console.error('updateBookingStatus API error:', err);
    throw err;
  }
}
