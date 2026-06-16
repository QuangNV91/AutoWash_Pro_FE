import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api', // Default to 8080 per Context.MD
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// MOCK BACKEND cho mục đích demo (khi chưa có API thật)
const originalPost = api.post;
api.post = async (url, data, config) => {
  // MOCK: Đăng ký
  if (url === '/auth/register') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          let users = JSON.parse(localStorage.getItem('mock_users'));
          if (!users || users.length === 0) {
            users = [{
              id: 1,
              fullName: 'Khách hàng VIP',
              phone: '0905388789',
              password: 'password123'
            }];
          }
          
          
          // Kiểm tra xem user đã tồn tại chưa
          const exists = users.find(u => u.phone === data.phone);
          if (exists) {
            reject({ response: { data: { message: 'Số điện thoại này đã được đăng ký!' } } });
            return;
          }
          
          // Lưu user mới
          users.push({ ...data, id: Date.now() });
          localStorage.setItem('mock_users', JSON.stringify(users));
          
          resolve({ data: { success: true, message: 'Đăng ký thành công' } });
        } catch (err) {
          reject({ response: { data: { message: 'Có lỗi xảy ra khi lưu dữ liệu' } } });
        }
      }, 1000);
    });
  }
  
  // MOCK: Đăng nhập
  if (url === '/auth/login') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          let users = JSON.parse(localStorage.getItem('mock_users'));
          if (!users || users.length === 0) {
            users = [{
              id: 1,
              fullName: 'Khách hàng VIP',
              phone: '0905388789',
              password: 'password123' // default password
            }];
            localStorage.setItem('mock_users', JSON.stringify(users));
          }
          const user = users.find(u => 
            (u.phone === data.identifier || u.identifier === data.identifier) && 
            u.password === data.password
          );
          
          if (user) {
            resolve({ 
              data: { 
                success: true, 
                token: 'mock-jwt-token-' + user.id, // Fake JWT
                data: { token: 'mock-jwt-token-' + user.id } 
              } 
            });
          } else {
            reject({ response: { data: { message: 'Tài khoản hoặc mật khẩu không đúng!' } } });
          }
        } catch (err) {
          reject({ response: { data: { message: 'Có lỗi xảy ra khi xử lý đăng nhập' } } });
        }
      }, 1000);
    });
  }

  // Nếu không phải các route mock trên, gọi API thật
  return originalPost.call(api, url, data, config);
};

 // MOCK: Ghi đè api.get để lấy dữ liệu cho Staff
const originalGet = api.get;
api.get = async (url, config) => {
  
  // 1. MOCK API lấy danh sách xe trong ca hôm nay cho Staff
  if (url === '/staff/today-tasks') {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Trả về Mock Data bạn đã cấu trúc trước đó
        resolve({
          data: {
            success: true,
            data: [
              { id: 'task-1', licensePlate: '29A-123.45', service: 'Rửa xe bọt tuyết + Hút bụi', time: '08:00 - 08:30', status: 'pending' },
              { id: 'task-2', licensePlate: '30F-987.65', service: 'Phủ Ceramic gói VIP', time: '08:30 - 11:00', status: 'processing' },
              { id: 'task-3', licensePlate: '51H-456.78', service: 'Rửa xe tiêu chuẩn', time: '10:00 - 10:30', status: 'completed' },
            ]
          }
        });
      }, 800); // Giả lập mạng chậm 0.8s
    });
  }

  // Nếu không phải route mock, gọi API thật
  return originalGet.call(api, url, config);
 };
 
export default api;
