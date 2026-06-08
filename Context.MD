# AutoWash Pro — Frontend Project Context

> **Đọc file này trước mỗi phiên làm việc.**
> Đây là nguồn sự thật duy nhất về dự án. Không được tự suy diễn thêm ngoài những gì được mô tả ở đây.

---

## 1. Tổng quan dự án

| Thông tin | Chi tiết |
|---|---|
| Tên dự án | AutoWash Pro |
| Mô tả | Hệ thống quản lý đặt lịch và chăm sóc xe máy thông minh |
| Mô hình | O2O (Online-to-Offline) — đặt lịch online, phục vụ offline |
| Ngôn ngữ UI | Tiếng Việt |
| Nền tảng | Web app, desktop-first, min-width 1280px |
| Frontend stack | React + Tailwind CSS |
| Deploy | Vercel |
| Backend | Spring Boot RESTful API (Java) |
| Database | Microsoft SQL Server |
| Auth | JWT (hết hạn sau 24 giờ), BCrypt password |
| Thanh toán | VNPAY Sandbox (HMAC-SHA512) |

---

## 2. Kiến trúc & Cấu trúc thư mục

```
autowash-pro/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.jsx                  # Entry point
│   ├── App.jsx                   # Router setup
│   ├── index.css                 # Tailwind directives
│   │
│   ├── pages/                    # Màn hình theo từng actor
│   │   ├── guest/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ServicesPage.jsx
│   │   │   └── PricingPage.jsx
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ForgotPasswordPage.jsx
│   │   ├── user/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── booking/
│   │   │   │   ├── BookingStep1Service.jsx
│   │   │   │   ├── BookingStep2DateTime.jsx
│   │   │   │   ├── BookingStep3Confirm.jsx
│   │   │   │   └── BookingSuccessPage.jsx
│   │   │   ├── appointments/
│   │   │   │   ├── AppointmentsPage.jsx
│   │   │   │   └── AppointmentDetailPage.jsx
│   │   │   ├── loyalty/
│   │   │   │   └── LoyaltyPage.jsx
│   │   │   ├── history/
│   │   │   │   └── HistoryPage.jsx
│   │   │   ├── notifications/
│   │   │   │   └── NotificationsPage.jsx
│   │   │   └── profile/
│   │   │       ├── ProfilePage.jsx
│   │   │       └── EditProfilePage.jsx
│   │   ├── staff/                # Scope sau
│   │   └── admin/                # Scope sau
│   │
│   ├── components/               # Component tái sử dụng
│   │   ├── layout/
│   │   │   ├── BottomNav.jsx
│   │   │   ├── Header.jsx
│   │   │   └── PageWrapper.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── BottomSheet.jsx
│   │   │   ├── StepIndicator.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── booking/
│   │   │   ├── ServiceCard.jsx
│   │   │   ├── DateStrip.jsx
│   │   │   ├── TimeSlotGrid.jsx
│   │   │   └── BookingSummaryCard.jsx
│   │   ├── loyalty/
│   │   │   ├── TierCard.jsx
│   │   │   ├── PointsProgress.jsx
│   │   │   └── PointTransactionItem.jsx
│   │   └── notifications/
│   │       └── NotificationItem.jsx
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useBooking.js
│   │   └── useNotifications.js
│   │
│   ├── services/                 # Axios API calls
│   │   ├── api.js                # Axios instance + interceptors
│   │   ├── authService.js
│   │   ├── bookingService.js
│   │   ├── serviceService.js
│   │   ├── loyaltyService.js
│   │   └── notificationService.js
│   │
│   ├── store/                    # State management (Zustand hoặc Context)
│   │   ├── authStore.js
│   │   └── bookingStore.js
│   │
│   ├── utils/
│   │   ├── formatters.js         # Format tiền tệ, ngày giờ
│   │   ├── validators.js         # Validate form inputs
│   │   └── constants.js          # Hằng số dùng chung
│   │
│   └── assets/
│       ├── images/
│       └── icons/
│
├── .env                          # Biến môi trường
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 3. Design System & Màu sắc

### Màu sắc chính

```js
// tailwind.config.js — extend colors
colors: {
  primary: {
    50:  '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#1A56DB',   // primary default
    700: '#1D4ED8',
    900: '#1E3A8A',
  },
  tier: {
    member:   '#6B7280',  // gray
    silver:   '#9CA3AF',  // silver gray
    gold:     '#F59E0B',  // amber
    platinum: '#8B5CF6',  // purple
  },
  status: {
    pending:   '#F59E0B',  // yellow
    working:   '#3B82F6',  // blue
    done:      '#10B981',  // green
    completed: '#10B981',  // green
    cancelled: '#6B7280',  // gray
    failed:    '#EF4444',  // red
  }
}
```

### Typography

- Font: Inter hoặc system-ui
- Heading: font-semibold
- Body: font-normal, text-gray-700
- Caption/label: text-sm, text-gray-500

### Spacing & Border Radius

- Card border-radius: rounded-2xl (16px)
- Button border-radius: rounded-xl (12px)
- Input border-radius: rounded-lg (8px)
- Màu nền trang: bg-gray-50

### Bottom Navigation

5 tabs: Home (`/`) · Đặt lịch (`/booking`) · Lịch hẹn (`/appointments`) · Loyalty (`/loyalty`) · Tài khoản (`/profile`)

---

## 4. Actors & Phân quyền

| Actor | Role trong JWT | Phạm vi |
|---|---|---|
| Guest | (chưa đăng nhập) | Xem trang chủ, dịch vụ, giá, đăng ký/đăng nhập |
| User | `CUSTOMER` | Đặt lịch, thanh toán, loyalty, lịch sử, profile |
| Staff | `STAFF` | Check-in, cập nhật trạng thái, hóa đơn |
| Admin | `ADMIN` | Dashboard, quản lý toàn bộ |

> **Scope hiện tại: Chỉ làm phần Guest + User.**

---

## 5. Dịch vụ (Services)

| Gói dịch vụ | Giá | Thời gian | Điểm tích lũy |
|---|---|---|---|
| Rửa xe cơ bản | 40.000đ | 15 phút | +40 điểm |
| Rửa xe chuyên sâu / bảo dưỡng | 150.000đ | 30 phút | +150 điểm |
| Rửa xe kết hợp đánh bóng / phủ nano | 300.000đ | 60 phút | +300 điểm |

---

## 6. Business Rules — BẮT BUỘC implement đúng

### 6.1 Giờ hoạt động & Slot

- Mở cửa: **07:00 – 18:00** hàng ngày
- Nghỉ trưa: **12:00 – 13:00** — khóa hoàn toàn, không cho đặt
- Tối đa **2 xe xử lý đồng thời** tại bất kỳ thời điểm nào
- Slot hiển thị theo bước **15 phút** (07:00, 07:15, 07:30, ...)
- Slot full = disabled + màu xám + text "Hết chỗ"

### 6.2 Giới hạn đặt trước theo Tier

| Tier | Đặt trước tối đa |
|---|---|
| MEMBER | 7 ngày |
| SILVER | 10 ngày |
| GOLD | 12 ngày |
| PLATINUM | 14 ngày |

### 6.3 Chiết khấu theo Tier

| Tier | Điểm yêu cầu | Chiết khấu |
|---|---|---|
| MEMBER | 0 | 0% |
| SILVER | 500 | 5% |
| GOLD | 1.500 | 10% |
| PLATINUM | 3.000 | 15% |

### 6.4 Quy tắc hủy lịch

| Thời điểm hủy | Hoàn tiền | Phạt điểm |
|---|---|---|
| Trước giờ hẹn ≥ 2 tiếng | Hoàn 75% | Không phạt |
| Trước giờ hẹn < 2 tiếng | Không hoàn | Trừ 10 điểm |
| No-show (không đến sau 30 phút) | Mất toàn bộ cọc | Trừ 15 điểm |

### 6.5 Loyalty Points

- Tích điểm khi: sử dụng dịch vụ (theo gói), thanh toán online (+10 điểm thưởng thêm)
- Điểm **hết hạn sau 12 tháng** không phát sinh giao dịch
- Thăng hạng **tự động** khi đủ điểm ngưỡng
- Loại giao dịch điểm: `EARN` · `REDEEM` · `PENALTY` · `RESET`

### 6.6 Vòng đời Booking

```
PENDING → WORKING → DONE → COMPLETED
                         → CANCELLED (user hủy)
         → FAILED (no-show, cron job xử lý sau 30 phút)
```

---

## 7. API Endpoints (Backend Spring Boot)

### Base URL

```
Development: http://localhost:8080/api
Production:  https://api.autowash.pro/api
```

### Auth

```
POST   /auth/register          Đăng ký tài khoản mới
POST   /auth/login             Đăng nhập, trả về JWT
POST   /auth/refresh           Làm mới token
POST   /auth/forgot-password   Gửi email reset mật khẩu
```

### User / Profile

```
GET    /users/me               Lấy thông tin cá nhân
PUT    /users/me               Cập nhật thông tin cá nhân
PUT    /users/me/password      Đổi mật khẩu
```

### Services

```
GET    /services               Danh sách tất cả gói dịch vụ
GET    /services/:id           Chi tiết gói dịch vụ
```

### Booking

```
GET    /bookings/available-slots?date=&serviceId=   Lấy slot trống
POST   /bookings               Tạo đặt lịch mới
GET    /bookings/my            Danh sách lịch hẹn của user
GET    /bookings/:id           Chi tiết một lịch hẹn
DELETE /bookings/:id/cancel    Hủy lịch hẹn
```

### Loyalty

```
GET    /loyalty/my             Điểm + tier hiện tại của user
GET    /loyalty/transactions   Lịch sử giao dịch điểm
POST   /loyalty/redeem         Đổi điểm lấy ưu đãi
```

### Notifications

```
GET    /notifications          Danh sách thông báo
PUT    /notifications/read-all Đánh dấu tất cả đã đọc
PUT    /notifications/:id/read Đánh dấu một thông báo đã đọc
```

### Payment

```
POST   /payments/vnpay/create  Tạo link thanh toán VNPAY
GET    /payments/vnpay/return  IPN callback từ VNPAY
```

---

## 8. Request / Response Format

### Headers (mọi request cần auth)

```js
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Response format chuẩn

```json
{
  "success": true,
  "message": "Thành công",
  "data": { ... }
}
```

### Error format

```json
{
  "success": false,
  "message": "Slot đã đầy, vui lòng chọn giờ khác",
  "errorCode": "SLOT_FULL"
}
```

---

## 9. Axios Instance (src/services/api.js)

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
});

// Tự động gắn JWT vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Tự động redirect về /login nếu token hết hạn
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

---

## 10. Routing (App.jsx)

```jsx
// Các route của User
/                    → HomePage (Guest)
/services            → ServicesPage (Guest)
/login               → LoginPage (Guest)
/register            → RegisterPage (Guest)

/dashboard           → DashboardPage (User, protected)
/booking             → BookingStep1Service (User, protected)
/booking/datetime    → BookingStep2DateTime (User, protected)
/booking/confirm     → BookingStep3Confirm (User, protected)
/booking/success     → BookingSuccessPage (User, protected)
/appointments        → AppointmentsPage (User, protected)
/appointments/:id    → AppointmentDetailPage (User, protected)
/loyalty             → LoyaltyPage (User, protected)
/history             → HistoryPage (User, protected)
/notifications       → NotificationsPage (User, protected)
/profile             → ProfilePage (User, protected)
/profile/edit        → EditProfilePage (User, protected)
```

---

## 11. Booking Flow — State giữa các bước

Dùng **Zustand store** hoặc **React Context** để truyền dữ liệu qua 3 bước booking:

```js
// bookingStore.js
{
  selectedService: null,    // { id, name, price, duration, points }
  selectedDate: null,       // "2025-06-10"
  selectedTime: null,       // "09:00"
  licensePlate: "",         // "51F-123.45"
  paymentMethod: "CASH",    // "ONLINE" | "CASH"
  discountAmount: 0,
  totalAmount: 0,
}
```

---

## 12. Formatting Helpers (src/utils/formatters.js)

```js
// Format tiền tệ VNĐ
export const formatVND = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
// → "40.000 ₫"

// Format ngày tháng tiếng Việt
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('vi-VN', {
    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
  });
// → "Thứ Ba, 10/06/2025"

// Format điểm loyalty
export const formatPoints = (pts) =>
  pts >= 0 ? `+${pts} điểm` : `${pts} điểm`;
```

---

## 13. Tier Badge Component

```jsx
const tierConfig = {
  MEMBER:   { label: 'Thành viên', color: 'bg-gray-100 text-gray-600' },
  SILVER:   { label: 'Bạc',        color: 'bg-gray-200 text-gray-700' },
  GOLD:     { label: 'Vàng',       color: 'bg-amber-100 text-amber-700' },
  PLATINUM: { label: 'Bạch kim',   color: 'bg-purple-100 text-purple-700' },
};

export const TierBadge = ({ tier }) => {
  const { label, color } = tierConfig[tier] || tierConfig.MEMBER;
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {label}
    </span>
  );
};
```

---

## 14. Booking Status Badge

```jsx
const statusConfig = {
  PENDING:   { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' },
  WORKING:   { label: 'Đang rửa',     color: 'bg-blue-100 text-blue-700' },
  DONE:      { label: 'Hoàn thành',   color: 'bg-green-100 text-green-700' },
  COMPLETED: { label: 'Đã thanh toán',color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Đã hủy',       color: 'bg-gray-100 text-gray-500' },
  FAILED:    { label: 'Thất bại',     color: 'bg-red-100 text-red-600' },
};
```

---

## 15. Lưu ý khi viết code

- **Luôn dùng Tailwind classes**, không dùng inline style hay CSS modules
- **Mobile-first**: mọi component thiết kế cho màn hình 360px–430px trước
- **Không hardcode text tiếng Anh** trên UI — tất cả hiển thị tiếng Việt
- **Loading state** bắt buộc cho mọi API call (skeleton hoặc spinner)
- **Error state** bắt buộc — hiển thị message lỗi từ API
- **Empty state** cho danh sách rỗng — có illustration + CTA
- **Không dùng `any` trong TypeScript** nếu dự án migrate sang TS sau
- **Commit message** dạng: `feat(booking): add step 2 datetime picker`