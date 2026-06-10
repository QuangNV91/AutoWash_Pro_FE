import api from './api';

// ============ MOCK DATA ============
// Sẽ xóa khi có Backend thật

const MOCK_SERVICES = [
  {
    id: 1,
    name: 'Rửa xe cơ bản',
    base_price: 40000,
    duration_minutes: 15,
    base_points: 40,
    features: [
      'Xịt nước rửa bụi bẩn bề mặt',
      'Phun xà bông bọt tuyết toàn thân xe',
      'Rửa sạch bằng nước áp lực cao',
      'Lau khô bằng khăn microfiber',
    ],
  },
  {
    id: 2,
    name: 'Rửa xe chuyên sâu',
    base_price: 150000,
    duration_minutes: 30,
    base_points: 150,
    features: [
      'Toàn bộ quy trình gói Cơ bản',
      'Vệ sinh sên xích, tra dầu bôi trơn',
      'Rửa sạch lốc máy, khu vực động cơ',
      'Vệ sinh phanh, vành xe',
      'Lau bóng nhựa, cao su',
      'Kiểm tra áp suất lốp',
    ],
  },
  {
    id: 3,
    name: 'Phủ nano ceramic',
    base_price: 300000,
    duration_minutes: 60,
    base_points: 300,
    features: [
      'Toàn bộ quy trình gói Chuyên sâu',
      'Đánh bóng bề mặt sơn bằng máy',
      'Tẩy các vết xước nhỏ, ố vàng',
      'Phủ lớp nano ceramic bảo vệ sơn',
      'Xử lý chống bám nước, bụi bẩn',
      'Kiểm tra tổng thể và bàn giao xe',
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
    // Generate a consistent pseudo-random state for this block
    const seed = (dateStr.charCodeAt(dateStr.length - 1) + blockMinutes) % 7;
    return seed !== 0; // ~85% available, seed 0 means booked
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
    const res = await api.get('/services');
    return res.data.data || res.data;
  } catch (err) {
    // Fallback to mock khi chưa có Backend
    console.warn('[MOCK] Sử dụng dữ liệu dịch vụ giả lập');
    return new Promise(resolve => {
      setTimeout(() => resolve(MOCK_SERVICES), 600);
    });
  }
}

/**
 * Lấy slot trống cho 1 ngày + 1 dịch vụ
 * GET /bookings/available-slots?booking_date=YYYY-MM-DD&service_id=X
 */
export async function getAvailableSlots(bookingDate, serviceId) {
  try {
    const res = await api.get('/bookings/available-slots', {
      params: { booking_date: bookingDate, service_id: serviceId },
    });
    return res.data.data || res.data;
  } catch (err) {
    // Fallback to mock
    console.warn('[MOCK] Sử dụng dữ liệu slot giả lập');
    return new Promise(resolve => {
      setTimeout(() => resolve(generateMockSlots(bookingDate, serviceId)), 500);
    });
  }
}

/**
 * Tạo 1 booking
 * POST /bookings
 */
export async function createBooking(bookingData) {
  try {
    const res = await api.post('/bookings', bookingData);
    return res.data;
  } catch (err) {
    // Fallback mock cho CASH
    if (bookingData.payment_method === 'CASH') {
      console.warn('[MOCK] Tạo booking giả lập');
      return new Promise(resolve => {
        setTimeout(() => resolve({
          success: true,
          data: {
            booking_id: `BKG-${Date.now().toString().slice(-5)}`,
            status: 'PENDING',
          },
        }), 800);
      });
    }
    // Re-throw nếu không phải mock scenario
    throw err;
  }
}

/**
 * Tạo payment session cho nhiều bookings (VNPAY)
 * POST /payments/vnpay/create
 */
export async function createPaymentSession(bookingIds, totalAmount) {
  try {
    const res = await api.post('/payments/vnpay/create', {
      booking_ids: bookingIds,
      total_amount: totalAmount,
    });
    return res.data;
  } catch (err) {
    // Mock fallback
    console.warn('[MOCK] Tạo payment session giả lập');
    return new Promise(resolve => {
      setTimeout(() => resolve({
        success: true,
        data: {
          vnpay_url: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?mock=true&amount=${totalAmount}`,
        },
      }), 500);
    });
  }
}
