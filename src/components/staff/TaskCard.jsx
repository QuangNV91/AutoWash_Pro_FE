import React from 'react';
import { Card, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import StatusUpdateBadge from './StatusUpdateBadge';

export default function TaskCard({ task, onStatusChange }) {
  const navigate = useNavigate();

  return (
    <Card className="task-card mb-4 shadow-sm" bordered={true} hoverable>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Thông tin cơ bản */}
        <div>
          <h3 className="text-lg font-bold text-blue-800">{task.licensePlate}</h3>
          <p className="font-medium text-gray-800">{task.service}</p>
          <p className="text-sm text-gray-500">Lịch hẹn: {task.time}</p>
        </div>
        
        {/* Trạng thái và Hành động */}
        <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
          <StatusUpdateBadge status={task.status} />
          
          <Space>
            {task.status === 'pending' && (
              <Button 
                type="primary" 
                size="middle" 
                onClick={() => onStatusChange(task.id, 'processing')}
              >
                Nhận xe (Check-in)
              </Button>
            )}
            
            {task.status === 'processing' && (
              <Button 
                type="default" 
                size="middle" 
                onClick={() => navigate(`/staff/tasks/${task.id}`)}
              >
                Chi tiết & Quyết toán
              </Button>
            )}

            {task.status === 'completed' && (
              <Button 
                type="dashed" 
                size="middle" 
                onClick={() => navigate(`/staff/tasks/${task.id}`)}
              >
                Xem lại hóa đơn
              </Button>
            )}
          </Space>
        </div>
      </div>
    </Card>
  );
}