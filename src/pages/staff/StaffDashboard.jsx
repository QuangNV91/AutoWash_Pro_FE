import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Tag, Skeleton } from 'antd';
import { ClockCircleOutlined, ToolOutlined, SmileOutlined } from '@ant-design/icons';
import api from '../../services/api';
import TaskCard from '../../components/staff/TaskCard';

export default function StaffDashboard() {
  // 1. Quản lý trạng thái dữ liệu
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Gọi API lấy danh sách xe hôm nay khi mở trang
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/staff/today-tasks');
        setTasks(response.data.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách xe:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // 3. Hàm xử lý thay đổi trạng thái xe
  const handleStatusChange = async (taskId, newStatus) => {
    // Cập nhật giao diện ngay lập tức (Optimistic UI update)
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    // Lưu ý: Sau này có API thật, bạn sẽ gọi api.patch() ở đây để lưu vào DB
  };

  // 4. Tính toán dữ liệu động cho Thẻ thống kê
  const pendingCount = tasks.filter(task => task.status === 'pending').length;

  return (
    <div className="staff-page min-h-screen bg-gray-50 pb-16">
      
      {/* KHU VỰC HERO SECTION (Premium UI) */}
      <section className="relative w-full h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        {/* Ảnh nền trạm rửa xe */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1920')] bg-cover bg-center"></div>

        {/* Lớp phủ đen mờ tạo độ sâu */}
        <div className="absolute inset-0 bg-black/75"></div>

        {/* Nội dung Banner */}
        <div className="relative z-10 text-center px-4 flex flex-col items-center mt-8">
          <span className="text-yellow-500 font-semibold tracking-widest uppercase text-xs md:text-sm mb-3">
            ✦ Bảng điều khiển nhân viên
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
            Giữ nhịp vận hành <br className="hidden md:block"/> Đơn giản & Trực quan
          </h1>
          <p className="text-gray-300 max-w-2xl text-sm md:text-base mb-8">
            Nắm bắt ca làm việc, xử lý trạng thái xe và hoàn thành dịch vụ chỉ với vài thao tác. Hiệu suất của bạn làm nên đẳng cấp của chúng ta.
          </p>

          {/* Cụm nút CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              Bắt đầu ca làm
            </button>
            <Link to="/">
              <button className="px-8 py-3 bg-transparent border-2 border-yellow-500 text-yellow-500 font-bold rounded-full hover:bg-yellow-500/10 transition-all duration-300">
                Về trang chủ
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* KHU VỰC THẺ THỐNG KÊ (Overlapping Layout) */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card className="shadow-lg rounded-xl border-0 hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-gray-500 font-medium">Ca hôm nay</span>
                <h2 className="text-2xl font-bold text-gray-800 mt-1">07:00 - 15:00</h2>
              </div>
              <Tag icon={<ClockCircleOutlined />} color="success" className="rounded-full px-3 py-1 m-0">Sẵn sàng</Tag>
            </div>
          </Card>

          <Card className="shadow-lg rounded-xl border-0 hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-gray-500 font-medium">Xe đang chờ</span>
                {/* Dữ liệu lấy động từ mảng tasks */}
                <h2 className="text-2xl font-bold text-gray-800 mt-1">{pendingCount}</h2>
              </div>
              <Tag icon={<ToolOutlined />} color="processing" className="rounded-full px-3 py-1 m-0">Xử lý nhanh</Tag>
            </div>
          </Card>

          <Card className="shadow-lg rounded-xl border-0 hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-gray-500 font-medium">Phản hồi khách</span>
                <h2 className="text-2xl font-bold text-gray-800 mt-1">98%</h2>
              </div>
              <Tag icon={<SmileOutlined />} color="cyan" className="rounded-full px-3 py-1 m-0">Tuyệt vời</Tag>
            </div>
          </Card>
          
        </div>
      </div>

      {/* KHU VỰC DANH SÁCH CÔNG VIỆC TRONG CA */}
      <div className="max-w-6xl mx-auto px-4 mt-16">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Danh sách công việc</h2>
            <p className="text-gray-500 mt-1">Các phương tiện cần được xử lý trong ca làm việc của bạn.</p>
          </div>
        </div>

        {/* Hiển thị hiệu ứng loading nếu chưa gọi API xong */}
        {loading ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <Skeleton active avatar paragraph={{ rows: 2 }} />
            <Skeleton active avatar paragraph={{ rows: 2 }} className="mt-4" />
          </div>
        ) : (
          <div className="task-list grid gap-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onStatusChange={handleStatusChange} 
                />
              ))
            ) : (
              <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-lg">Hiện tại không có xe nào trong hàng đợi.</p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}