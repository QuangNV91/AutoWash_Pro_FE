import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { DashboardOutlined, CalendarOutlined, LogoutOutlined, CarOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

export default function StaffLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Tự động highlight menu dựa trên URL hiện tại
  const selectedKey = location.pathname.includes('/schedule') ? 'schedule' : 'dashboard';

  // Cấu hình các nút bấm trên Sidebar
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/staff/dashboard">Bảng điều khiển</Link>,
    },
    {
      key: 'schedule',
      icon: <CalendarOutlined />,
      label: <Link to="/staff/schedule">Lịch làm việc</Link>,
    },
    {
      type: 'divider', // Đường kẻ ngang phân cách
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: () => {
        // Sau này sẽ xóa Token ở localStorage chỗ này
        navigate('/'); // Tạm thời đẩy về trang chủ khách hàng
      }
    }
  ];

  return (
    <Layout className="min-h-screen">
      {/* Cột Menu Bên Trái (Sidebar) */}
      <Sider 
        breakpoint="lg" 
        collapsedWidth="0" 
        theme="dark" 
        className="shadow-xl"
      >
        <div className="h-16 flex items-center justify-center m-4 bg-gray-800 rounded-xl border border-gray-700">
          <CarOutlined className="text-yellow-500 text-2xl mr-2" />
          <h1 className="text-white text-lg font-bold font-serif tracking-widest mt-2">AUTOWASH</h1>
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[selectedKey]} 
          items={menuItems} 
          className="bg-transparent"
        />
      </Sider>

      {/* Khu vực Nội dung chính Bên Phải */}
      <Layout>
        {/* Thanh Header trên cùng */}
        <Header className="bg-white px-6 shadow-sm flex items-center justify-between z-10">
           <h2 className="text-xl font-bold text-gray-700 m-0 hidden sm:block">Khu vực Trạm Offline</h2>
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold">
               NV
             </div>
             <span className="font-medium text-gray-600">Xin chào, Kỹ thuật viên</span>
           </div>
        </Header>

        {/* Nơi hiển thị các trang con (Dashboard, Schedule, Detail) */}
        <Content className="m-0 bg-gray-50 overflow-auto">
          <Outlet /> 
        </Content>
      </Layout>
    </Layout>
  );
}