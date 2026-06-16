import React, { useState, useEffect } from 'react';
import { Table, Tag } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';


export default function StaffSchedule() {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      setTimeout(() => {
        const mockShifts = [
          { id: 1, work_date: '2026-06-10', shift_name: 'Ca Sáng', start_time: '08:00', end_time: '12:00', status: 'today' },
          { id: 2, work_date: '2026-06-11', shift_name: 'Ca Chiều', start_time: '13:00', end_time: '17:00', status: 'upcoming' },
          { id: 3, work_date: '2026-06-12', shift_name: 'Ca Tối', start_time: '18:00', end_time: '22:00', status: 'upcoming' },
        ];
        setScheduleData(mockShifts);
        setLoading(false);
      }, 800);
    };
    fetchSchedule();
  }, []);

  const columns = [
    {
      title: 'Ngày làm việc',
      dataIndex: 'work_date',
      key: 'work_date',
      render: (text) => <span className="font-bold text-gray-800"><CalendarOutlined className="mr-2 text-yellow-600" />{text}</span>,
    },
    {
      title: 'Ca trực',
      dataIndex: 'shift_name',
      key: 'shift_name',
      render: (text, record) => (
        <span className="font-medium text-gray-600">{text} <span className="text-gray-400 font-normal">({record.start_time} - {record.end_time})</span></span>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (status) => {
        if (status === 'today') {
          return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">Hôm nay</span>;
        }
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">Sắp tới</span>;
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Mini-Hero Header */}
      <div className="bg-gray-900 pt-10 pb-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-white tracking-wide">Lịch Điều Phối Phân Ca</h2>
        <p className="text-gray-400 mt-2">Xem và chuẩn bị cho các ca trực sắp tới của bạn</p>
      </div>

      {/* Table Container (Kéo lùi lên đè vào nền đen) */}
      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden p-2">
          <Table 
            columns={columns} 
            dataSource={scheduleData} 
            rowKey="id"
            loading={loading}
            pagination={false}
            className="custom-tailwind-table"
          />
        </div>
      </div>
    </div>
  );
}