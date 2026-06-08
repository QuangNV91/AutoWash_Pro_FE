# AutoWash Pro — Task List & Progress Tracker

> Cập nhật file này sau mỗi task hoàn thành.
> Format: `- [x]` = Done · `- [ ]` = Todo · `- [~]` = Đang làm

---

## Tiến độ tổng quan

| Phase | Mô tả | Trạng thái |
|---|---|---|
| Phase 0 | Setup & Foundation | ⬜ Todo |
| Phase 1 | Auth Screens | ⬜ Todo |
| Phase 2 | Booking Flow (core) | ⬜ Todo |
| Phase 3 | Appointments & Cancel | ⬜ Todo |
| Phase 4 | Loyalty & History | ⬜ Todo |
| Phase 5 | Notifications & Profile | ⬜ Todo |
| Phase 6 | Polish & Integration | ⬜ Todo |

---

## Phase 0 — Setup & Foundation

### 0.1 Khởi tạo project

- [ ] Tạo project với Vite: `npm create vite@latest autowash-pro -- --template react`
- [ ] Cài Tailwind CSS và cấu hình `tailwind.config.js`
- [ ] Cài dependencies chính:
  - `react-router-dom` — routing
  - `axios` — HTTP client
  - `zustand` — state management
  - `react-hot-toast` — toast notifications
  - `date-fns` — xử lý ngày tháng
- [ ] Tạo cấu trúc thư mục như trong `CONTEXT.md` mục 2
- [ ] Tạo file `.env` với biến `VITE_API_URL`
- [ ] Setup `tailwind.config.js` với custom colors (primary, tier, status) theo `CONTEXT.md` mục 3

### 0.2 Base setup

- [ ] Tạo Axios instance (`src/services/api.js`) với interceptors JWT (xem `CONTEXT.md` mục 9)
- [ ] Tạo `src/utils/formatters.js` — formatVND, formatDate, formatPoints
- [ ] Tạo `src/utils/constants.js` — TIERS, SERVICE_TYPES, BOOKING_STATUS, SLOT_CONFIG
- [ ] Tạo `src/utils/validators.js` — validate phone, email, biển số xe
- [ ] Setup router trong `App.jsx` với tất cả routes (xem `CONTEXT.md` mục 10)
- [ ] Tạo `ProtectedRoute` component — redirect về `/login` nếu chưa đăng nhập
- [ ] Tạo `authStore.js` (Zustand) — lưu user info, token, isAuthenticated
- [ ] Tạo `bookingStore.js` (Zustand) — lưu state qua 3 bước booking

### 0.3 Layout & UI components dùng chung

- [ ] **`PageWrapper.jsx`** — wrapper có padding + max-width cho mobile
- [ ] **`Header.jsx`** — logo trái, notification bell + avatar phải, back arrow khi cần
- [ ] **`BottomNav.jsx`** — 5 tabs: Home / Đặt lịch / Lịch hẹn / Loyalty / Tài khoản, highlight tab active
- [ ] **`Button.jsx`** — variants: primary, secondary, outline, danger; states: default, loading, disabled
- [ ] **`Input.jsx`** — label, placeholder, error message, icon prefix/suffix
- [ ] **`Badge.jsx`** — TierBadge (MEMBER/SILVER/GOLD/PLATINUM) + StatusBadge (booking status)
- [ ] **`Card.jsx`** — base card với shadow nhẹ, border-radius-2xl
- [ ] **`BottomSheet.jsx`** — overlay từ dưới lên, có backdrop, đóng khi tap ngoài
- [ ] **`StepIndicator.jsx`** — hiển thị "Bước 1 / 3" với progress bar hoặc dots
- [ ] **`LoadingSpinner.jsx`** — spinner animation cho loading state
- [ ] **`EmptyState.jsx`** — illustration + title + subtitle + optional CTA button
- [ ] **`SkeletonCard.jsx`** — skeleton loading placeholder cho danh sách

---

## Phase 1 — Auth Screens

### 1.1 Trang đăng ký (RegisterPage)

- [ ] Form fields: Họ tên, SĐT (+84 prefix), Email, Mật khẩu, Xác nhận mật khẩu, Biển số xe mặc định
- [ ] Validate: SĐT đúng định dạng VN, email hợp lệ, password tối thiểu 8 ký tự, 2 password khớp nhau, biển số đúng format (e.g. 51F-123.45)
- [ ] Gọi API `POST /auth/register`
- [ ] Loading state khi đang submit
- [ ] Thông báo thành công: "Vui lòng kiểm tra email để kích hoạt tài khoản"
- [ ] Xử lý lỗi: email/SĐT đã tồn tại → hiển thị message dưới field
- [ ] Link "Đã có tài khoản? Đăng nhập"

### 1.2 Trang đăng nhập (LoginPage)

- [ ] Form fields: Email hoặc SĐT, Mật khẩu (show/hide toggle)
- [ ] Link "Quên mật khẩu?" → ForgotPasswordPage
- [ ] Gọi API `POST /auth/login`, lưu JWT vào localStorage
- [ ] Redirect theo role: CUSTOMER → `/dashboard`, STAFF → `/staff`, ADMIN → `/admin`
- [ ] Loading state khi đang submit
- [ ] Xử lý lỗi: sai mật khẩu, tài khoản chưa kích hoạt, tài khoản bị khóa
- [ ] Link "Chưa có tài khoản? Đăng ký ngay"

### 1.3 Trang quên mật khẩu (ForgotPasswordPage)

- [ ] Input email
- [ ] Gọi API `POST /auth/forgot-password`
- [ ] Hiển thị trạng thái "Đã gửi email reset mật khẩu"

---

## Phase 2 — Booking Flow (core feature)

### 2.1 BookingStep1 — Chọn dịch vụ

- [ ] Gọi API `GET /services` để lấy danh sách dịch vụ
- [ ] Hiển thị 3 ServiceCard (skeleton khi loading)
- [ ] Mỗi card: tên dịch vụ, mô tả ngắn, thời gian, giá, điểm tích lũy
- [ ] Cho phép chọn 1 dịch vụ (radio behavior — selected state highlight blue)
- [ ] StepIndicator hiển thị "Bước 1 / 3"
- [ ] Nút "Tiếp theo" disabled cho đến khi chọn xong, khi bấm → lưu vào `bookingStore` và navigate đến Step 2

### 2.2 BookingStep2 — Chọn ngày & giờ

- [ ] **DateStrip component**: hiển thị danh sách ngày dạng horizontal scroll
  - Số ngày hiển thị dựa theo tier của user (7/10/12/14 ngày)
  - Bắt đầu từ ngày mai (không cho chọn hôm nay hoặc quá khứ)
  - Ngày được chọn: highlight blue
- [ ] Khi chọn ngày → gọi API `GET /bookings/available-slots?date=&serviceId=`
- [ ] **TimeSlotGrid component**: lưới giờ từ 07:00 – 18:00, bước 15 phút
  - Slot 12:00–13:00: disabled, label "Nghỉ trưa", màu nền vàng nhạt
  - Slot còn trống: border blue, clickable
  - Slot đã full (≥2 xe): màu xám, disabled, text "Hết chỗ"
  - Slot được chọn: filled blue, text trắng
- [ ] Loading skeleton khi đang fetch slots
- [ ] StepIndicator "Bước 2 / 3"
- [ ] Nút "Tiếp theo" disabled cho đến khi chọn đủ ngày + giờ

### 2.3 BookingStep3 — Xác nhận & Thanh toán

- [ ] **BookingSummaryCard**: hiển thị tóm tắt (dịch vụ, ngày, giờ, thời gian thực hiện)
- [ ] Input biển số xe (pre-fill từ profile nếu có, cho phép chỉnh sửa)
- [ ] Validate biển số xe không để trống
- [ ] **Payment method selector**:
  - Option "Thanh toán online (VNPAY)" — badge "Đặt cọc ngay"
  - Option "Thanh toán tại quầy" — badge "Tiền mặt"
- [ ] **Price breakdown**:
  - Giá gốc
  - Chiết khấu tier (SILVER -5% / GOLD -10% / PLATINUM -15%) — hiển thị tier badge
  - Tổng thanh toán (nổi bật)
  - Điểm sẽ nhận được
- [ ] Khi bấm "Xác nhận":
  - Nếu CASH: gọi `POST /bookings` → redirect BookingSuccessPage
  - Nếu ONLINE: gọi `POST /bookings` + `POST /payments/vnpay/create` → redirect sang VNPAY
- [ ] Loading state khi đang xử lý

### 2.4 BookingSuccessPage

- [ ] Animation success (checkmark)
- [ ] Hiển thị: mã booking, dịch vụ, ngày giờ, biển số, phương thức thanh toán
- [ ] Nếu VNPAY: hiển thị "Thanh toán thành công" + số tiền đã cọc
- [ ] Nếu CASH: hiển thị "Vui lòng mang xe đến đúng giờ"
- [ ] Nhắc nhở: "Đến trễ quá 30 phút sẽ bị hủy tự động"
- [ ] 2 CTA: "Xem lịch hẹn" (primary) · "Về trang chủ" (outline)

---

## Phase 3 — Appointments & Cancel

### 3.1 AppointmentsPage

- [ ] 2 tabs: "Sắp tới" | "Đã xong"
- [ ] **Tab Sắp tới**: hiển thị booking có status PENDING hoặc WORKING
  - BookingCard: status badge màu, dịch vụ, ngày giờ, biển số, phương thức TT
  - Nút "Xem chi tiết" → AppointmentDetailPage
  - Nút "Hủy lịch" (chỉ hiện nếu status = PENDING)
- [ ] **Tab Đã xong**: booking có status COMPLETED, CANCELLED, FAILED
  - Hiển thị lịch sử dạng list, có status badge
- [ ] Pull-to-refresh (optional)
- [ ] EmptyState khi không có lịch hẹn nào
- [ ] Loading skeleton

### 3.2 AppointmentDetailPage

- [ ] Hiển thị đầy đủ thông tin booking:
  - Mã booking, dịch vụ, ngày giờ, biển số, phương thức TT, trạng thái
- [ ] Nếu status = WORKING: hiển thị progress indicator "Đang rửa xe..."
- [ ] Nếu status = DONE: hiển thị "Xe đã xong, vui lòng đến nhận"
- [ ] Invoice section (nếu COMPLETED): giá gốc, giảm giá, thêm phụ phí, tổng tiền, điểm đã nhận
- [ ] Nút "Hủy lịch" (nếu PENDING) → mở CancelBottomSheet

### 3.3 CancelBottomSheet

- [ ] **BottomSheet component** overlay từ dưới lên
- [ ] Hiển thị thông tin booking cần hủy
- [ ] **Cancellation policy box** (nền vàng nhạt, icon warning):
  - Hủy trước 2 tiếng: hoàn 75%
  - Hủy trong 2 tiếng: không hoàn + trừ 10 điểm
  - No-show: mất cọc + trừ 15 điểm
- [ ] Countdown: "Còn X giờ Y phút đến giờ hẹn"
- [ ] Tự động tính và hiển thị: "Bạn sẽ được hoàn: Xđ" hoặc "Không được hoàn tiền"
- [ ] 2 nút: "Xác nhận hủy" (đỏ) | "Giữ lịch hẹn" (outline)
- [ ] Gọi API `DELETE /bookings/:id/cancel`
- [ ] Loading state khi đang xử lý
- [ ] Toast success/error sau khi hủy

---

## Phase 4 — Loyalty & History

### 4.1 LoyaltyPage

- [ ] Gọi API `GET /loyalty/my`
- [ ] **TierCard** (card lớn, màu theo tier):
  - Tier badge + tên tier
  - Điểm hiện tại (số lớn, bold)
  - Progress bar đến tier tiếp theo + label "Cần thêm X điểm để lên [tier]"
  - Ngày hết hạn điểm: "Điểm hết hạn sau X tháng nếu không hoạt động"
- [ ] **Tier benefits section**: 4 tier cards hàng ngang (MEMBER → PLATINUM)
  - Điểm yêu cầu, % chiết khấu
  - Highlight tier hiện tại của user
- [ ] **PointsHistory section**: 10 giao dịch gần nhất
  - Icon màu: EARN (xanh), REDEEM (xanh lam), PENALTY (đỏ), RESET (xám)
  - Tên giao dịch, lý do, ngày, số điểm +/-
- [ ] Link "Xem tất cả lịch sử điểm" → HistoryPage tab Điểm
- [ ] Nút "Đổi điểm lấy ưu đãi" (nếu hệ thống hỗ trợ)
- [ ] Loading skeleton

### 4.2 HistoryPage

- [ ] 2 tabs: "Lịch sử rửa xe" | "Lịch sử điểm"
- [ ] **Tab Lịch sử rửa xe**:
  - List các lần sử dụng dịch vụ (COMPLETED)
  - Mỗi item: dịch vụ, ngày, biển số, số tiền, điểm nhận, status badge
  - Tap để xem hóa đơn chi tiết (InvoiceDetailSheet)
- [ ] **Tab Lịch sử điểm**:
  - Timeline list toàn bộ giao dịch điểm
  - Filter theo loại: Tất cả / EARN / REDEEM / PENALTY / RESET
  - Mỗi item: icon loại, mô tả, ngày, điểm +/-
- [ ] Infinite scroll hoặc pagination
- [ ] EmptyState cho cả 2 tab

---

## Phase 5 — Notifications & Profile

### 5.1 NotificationsPage

- [ ] Gọi API `GET /notifications`
- [ ] Nút "Đánh dấu tất cả đã đọc" ở header
- [ ] Group theo ngày: "Hôm nay", "Hôm qua", "Tuần trước"
- [ ] Mỗi notification item:
  - Icon theo loại (bell / check / trophy / x / gift)
  - Tiêu đề + mô tả ngắn
  - Thời gian (relative: "2 giờ trước")
  - Unread: nền xanh nhạt + blue dot
  - Read: nền trắng
  - Tap → đánh dấu đã đọc + navigate đến trang liên quan (nếu có)
- [ ] Notification types cần handle:
  - `REMINDER` — nhắc lịch hẹn (1 tiếng trước)
  - `STATUS_UPDATE` — cập nhật trạng thái xe
  - `TIER_UPGRADE` — nâng hạng thành viên
  - `AUTO_CANCEL` — hủy tự động (no-show)
  - `PROMOTION` — khuyến mãi theo tier
- [ ] EmptyState khi không có thông báo
- [ ] Unread count badge trên BottomNav icon

### 5.2 ProfilePage

- [ ] Gọi API `GET /users/me` + `GET /loyalty/my`
- [ ] **Profile header**: avatar (initials), tên, TierBadge, SĐT
- [ ] **Stats row**: tổng số lần rửa xe | điểm hiện tại | thời gian là thành viên
- [ ] **Menu sections**:
  - Tài khoản: Chỉnh sửa thông tin · Đổi mật khẩu · Biển số xe mặc định
  - Dịch vụ: Lịch hẹn của tôi · Lịch sử · Loyalty
  - Hỗ trợ: Liên hệ cửa hàng · Điều khoản sử dụng
- [ ] Nút "Đăng xuất" (đỏ, outline) — xóa token + redirect `/login`

### 5.3 EditProfilePage

- [ ] Pre-fill form từ data `GET /users/me`
- [ ] Fields cho phép chỉnh sửa: Họ tên, SĐT, Biển số xe mặc định
- [ ] Validate trước khi submit
- [ ] Gọi API `PUT /users/me`
- [ ] Toast success: "Cập nhật thông tin thành công"
- [ ] Xử lý lỗi: SĐT đã tồn tại

---

## Phase 6 — Polish & Integration

### 6.1 UX polish

- [ ] Thêm page transition animation (fade/slide)
- [ ] Thêm haptic feedback cho mobile (nếu PWA)
- [ ] Kiểm tra toàn bộ loading states
- [ ] Kiểm tra toàn bộ error states (network error, server error, 404)
- [ ] Kiểm tra empty states
- [ ] Thêm skeleton loading cho tất cả màn hình có API call
- [ ] Responsive check trên: 360px, 390px (iPhone 14), 430px (iPhone 14 Plus)

### 6.2 Integration testing

- [ ] Test booking flow end-to-end: đặt lịch → thanh toán VNPAY → xem lịch hẹn
- [ ] Test hủy lịch: hủy sớm (hoàn tiền) và hủy muộn (không hoàn)
- [ ] Test loyalty: tích điểm sau khi hoàn thành dịch vụ
- [ ] Test slot capacity: không cho đặt khi slot đã đủ 2 xe
- [ ] Test tier discount: đăng nhập bằng tài khoản GOLD, kiểm tra giảm giá 10%

### 6.3 Build & Deploy

- [ ] Kiểm tra `.env` production
- [ ] `npm run build` không có lỗi
- [ ] Deploy lên Vercel
- [ ] Test trên production URL

---

## Ghi chú & Vấn đề cần giải quyết

> Dùng phần này để ghi lại bug, câu hỏi, hoặc quyết định kỹ thuật trong quá trình làm.

| # | Vấn đề | Trạng thái | Ghi chú |
|---|---|---|---|
| 1 | Chưa rõ format response từ `GET /bookings/available-slots` | ⬜ Cần hỏi backend | Cần biết format slot trả về để render TimeSlotGrid |
| 2 | VNPAY redirect URL sau khi thanh toán | ⬜ Cần hỏi backend | Cần biết `returnUrl` cấu hình là gì |
| 3 | Cơ chế real-time cập nhật trạng thái xe | ⬜ Cần quyết định | Dùng polling 30 giây hay WebSocket? |
| 4 | State management: Zustand vs React Context | ⬜ Cần quyết định | Zustand đơn giản hơn cho dự án này |