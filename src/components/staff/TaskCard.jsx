import React from 'react';
import { Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import StatusUpdateBadge from './StatusUpdateBadge';

export default function TaskCard({ task, onStatusChange }) {
  const navigate = useNavigate();

  // Hàm tạo màu viền trái nổi bật tùy theo trạng thái của xe
  const getStatusBorder = (status) => {
    switch (status) {
      case 'completed': return 'border-l-4 border-l-green-500';
      case 'processing': return 'border-l-4 border-l-blue-500';
      case 'pending':
      default: return 'border-l-4 border-l-yellow-400';
    }
  };

  return (
    // Thẻ div thay cho <Card> mặc định, sử dụng toàn bộ class của Tailwind để tạo kiểu Premium
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-gray-100 p-5 ${getStatusBorder(task.status)}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* Khối Thông tin cơ bản */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">{task.licensePlate}</h3>
            <StatusUpdateBadge status={task.status} />
          </div>
          <p className="font-medium text-gray-600 text-base">{task.service}</p>
          
          <div className="text-sm text-gray-400 mt-2 flex items-center gap-1">
            {/* SVG icon Đồng hồ từ thư viện Heroicons */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Lịch hẹn: <span className="font-semibold text-gray-500">{task.time}</span>
          </div>
        </div>
        
        {/* Khối Nút Hành động */}
        <div className="flex flex-col items-start md:items-end w-full md:w-auto mt-2 md:mt-0">
          <Space>
            {task.status === 'pending' && (
              <Button 
                type="primary" 
                size="large" 
                className="bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg px-6 shadow-md shadow-blue-200"
                onClick={() => onStatusChange(task.id, 'processing')}
              >
                Nhận xe (Check-in)
              </Button>
            )}
            
            {task.status === 'processing' && (
              <Button 
                type="primary" 
                size="large" 
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg px-6 shadow-md shadow-yellow-200 border-none"
                onClick={() => navigate(`/staff/tasks/${task.id}`)}
              >
                Chi tiết & Quyết toán
              </Button>
            )}

            {task.status === 'completed' && (
              <Button 
                type="default" 
                size="large" 
                className="text-gray-600 font-medium rounded-lg px-6 hover:border-gray-400"
                onClick={() => navigate(`/staff/tasks/${task.id}`)}
              >
                Xem lại hóa đơn
              </Button>
            )}
          </Space>
        </div>

      </div>
    </div>
  );
}