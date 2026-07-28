# API Call Checklist

Below is a checklist of all the API endpoints being called across your components and services, including their roles and purposes. You can use this file to track testing or review your integrations.

## Services & Stores

### `src/store/systemConfigStore.js`
- [ ] `GET /api/v1/system-config` - **Lấy cấu hình hệ thống** (ví dụ: số xe tối đa, số ngày đặt trước, điểm phạt).
- [ ] `PUT /api/v1/system-config` - **Cập nhật cấu hình hệ thống** (dành cho Admin lưu cài đặt mới).

### `src/services/bookingService.js`
- [ ] `GET /api/v1/services` - **Lấy danh sách dịch vụ** rửa xe và chăm sóc xe.
- [ ] `GET /api/v1/bookings/available-slots` - **Lấy khung giờ còn trống** cho một ngày và một dịch vụ cụ thể để hiển thị lúc đặt lịch.
- [ ] `POST /api/v1/bookings/checkout` - **Tạo đơn đặt lịch hẹn** mới và trả về URL thanh toán (nếu chọn VNPay).
- [ ] `GET /api/v1/bookings/history` - **Lấy lịch sử lịch hẹn** của người dùng đang đăng nhập.

---

## Auth Pages

### `src/pages/auth/LoginPage.jsx`
- [ ] `POST /auth/login` - **Đăng nhập** bằng số điện thoại/email và mật khẩu.

### `src/pages/auth/RegisterPage.jsx`
- [ ] `POST /auth/register` - **Đăng ký tài khoản** khách hàng mới.

### `src/pages/auth/VerifyPage.jsx`
- [ ] `POST /auth/verify-phone` - **Xác thực OTP** để kích hoạt số điện thoại hoặc tài khoản.

### `src/pages/auth/ForgotPasswordPage.jsx`
- [ ] `POST /auth/forgot-password` - **Yêu cầu lấy lại mật khẩu** (gửi OTP/link khôi phục).

---

## User Pages

### `src/pages/user/UserDashboard.jsx`
- [ ] `GET /api/loyalty/my` - **Lấy thông tin điểm thưởng** và hạng thành viên (tier) của người dùng hiện tại.
- [ ] `GET /api/loyalty/transactions` - **Lấy lịch sử giao dịch điểm thưởng** (tích điểm/trừ điểm) của người dùng.

### `src/pages/user/booking/BookingStep1Service.jsx`
- [ ] `GET /api/v1/bookings/context` - **Lấy bối cảnh đặt lịch** (ví dụ: giới hạn số lượng xe cho phép đặt tùy theo hạng thành viên).

---

## Staff Pages

### `src/pages/staff/StaffDashboard.jsx`
- [ ] `GET /api/services/active` - **Lấy danh sách các dịch vụ đang hoạt động** để hiển thị lên bảng điều khiển nhân viên.
- [ ] `GET /api/bookings/date?date=${today}` - **Lấy danh sách lịch hẹn trong ngày hôm nay** để nhân viên theo dõi khối lượng công việc.

### `src/pages/staff/StaffBookings.jsx`
- [ ] `GET /api/v1/services` - **Lấy danh sách dịch vụ** (hỗ trợ hiển thị filter hoặc options).
- [ ] `GET /api/bookings` - **Lấy toàn bộ danh sách lịch hẹn** để quản lý.

### `src/pages/staff/StaffCheckin.jsx`
- [ ] `GET /api/v1/services` - **Lấy danh sách dịch vụ** để tham chiếu tên/loại dịch vụ khi nhận xe.
- [ ] `GET /api/bookings` - **Lấy danh sách lịch hẹn** để tiến hành thủ tục check-in (nhận xe khách).

### `src/pages/staff/StaffPayment.jsx`
- [ ] `GET /api/v1/services` - **Lấy danh sách dịch vụ** tham chiếu giá tiền.
- [ ] `GET /api/bookings` - **Lấy danh sách lịch hẹn** để xử lý thanh toán/thu tiền tại quầy cho các đơn thanh toán tiền mặt/chuyển khoản.

### `src/pages/staff/StaffSchedule.jsx`
- [ ] `GET /api/staffs` - **Lấy thông tin của nhân viên** (thường là để đối chiếu dữ liệu cá nhân).
- [ ] `GET /api/shifts` - **Lấy danh sách các ca làm việc** của trung tâm.
- [ ] `GET /api/leave-requests/staff/${id}` - **Lấy danh sách đơn xin nghỉ phép** cá nhân của nhân viên đó.
- [ ] `POST /api/leave-requests` - **Gửi yêu cầu xin nghỉ phép** mới.

---

## Admin Pages

### `src/pages/admin/AdminDashboard.jsx`
- [ ] `GET /api/v1/dashboard?filter=${filter}` - **Lấy dữ liệu thống kê tổng quan** (doanh thu, tổng số đơn, tỷ lệ hoàn thành, v.v.) theo thời gian.

### `src/pages/admin/ReportDashboard.jsx`
- [ ] `GET /api/v1/dashboard?filter=month` - **Lấy dữ liệu thống kê chi tiết theo tháng** để vẽ biểu đồ và báo cáo.

### `src/pages/admin/PaymentManagement.jsx`
- [ ] `GET /api/v1/dashboard/payments` - **Lấy danh sách và thống kê các giao dịch thanh toán** (dòng tiền ra/vào).

### `src/pages/admin/ServiceManagement.jsx`
- [ ] `GET /api/services` - **Lấy danh sách toàn bộ dịch vụ** để quản lý.
- [ ] `POST /api/services` - **Thêm mới một dịch vụ** hệ thống.
- [ ] `PUT /api/services/${editingId}` - **Cập nhật thông tin dịch vụ** (giá, thời gian, tên).
- [ ] `DELETE /api/services/${id}` - **Xóa một dịch vụ** khỏi hệ thống.

### `src/pages/admin/StaffManagement.jsx`
- [ ] `GET /api/staffs` - **Lấy danh sách toàn bộ nhân sự** (Staff/Admin).
- [ ] `POST /api/staffs` - **Thêm nhân viên mới** vào hệ thống.

### `src/pages/admin/StaffScheduleDashboard.jsx`
- [ ] `GET /api/staffs` - **Lấy danh sách nhân viên** để lên lịch và phân ca.
- [ ] `GET /api/leave-requests/pending` - **Lấy danh sách các đơn xin phép đang chờ duyệt** để Admin xử lý duyệt/từ chối.

### `src/pages/admin/BookingSlotDashboard.jsx`
- [ ] `GET /api/bookings` - **Lấy toàn bộ lịch hẹn** phục vụ cho việc điều phối hiển thị lên Dashboard dưới dạng lưới các Slot (Khung giờ).
- [ ] `POST /api/bookings/${booking.realId}/no-show` - **Đánh dấu vắng mặt (No-show)** cho khách hàng không mang xe đến khi đã quá giờ hẹn.
