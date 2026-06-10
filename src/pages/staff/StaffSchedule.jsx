import React, { useState, useEffect } from 'react';
import { Table, Tag, Card } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import api from '../../services/api';

export default function StaffSchedule() {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tạm thời tạo mock data ngay đây nếu chưa cấu hình api.get('/staff/schedule') trong api.js
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        // Giả lập API call
        setTimeout(() => {
          const mockShifts = [
            { id: 1, work_date: '2026-06-10', shift_name: 'Ca Sáng', start_time: '08:00', end_time: '12:00', status: 'today' },
            { id: 2, work_date: '2026-06-11', shift_name: 'Ca Chiều', start_time: '13:00', end_time: '17:00', status: 'upcoming' },
            { id: 3, work_date: '2026-06-12', shift_name: 'Ca Tối', start_time: '18:00', end_time: '22:00', status: 'upcoming' },
          ];
          setScheduleData(mockShifts);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Lỗi khi tải lịch làm việc:", error);
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  // Định nghĩa các cột cho Ant Design Table
  const columns = [
    {
      title: 'Ngày làm việc',
      dataIndex: 'work_date',
      key: 'work_date',
      render: (text) => <span className="font-semibold text-blue-700"><CalendarOutlined className="mr-2" />{text}</span>,
    },
    {
      title: 'Ca trực',
      dataIndex: 'shift_name',
      key: 'shift_name',
      render: (text, record) => (
        <span>{text} ({record.start_time} - {record.end_time})</span>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (status) => {
        let color = status === 'today' ? 'processing' : 'default';
        let text = status === 'today' ? 'Hôm nay' : 'Sắp tới';
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Lịch điều phối phân ca</h2>
        <p className="text-gray-500">Xem và chuẩn bị cho các ca trực sắp tới của bạn.</p>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table 
          columns={columns} 
          dataSource={scheduleData} 
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
}