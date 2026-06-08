import { Layout, Menu, Avatar } from 'antd'
import { HomeOutlined, CalendarOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'
import '../../styles/admin.css'

const { Header, Sider, Content } = Layout

export default function AdminLayout({ children }) {
  const location = useLocation()
  const selectedKey = location.pathname.includes('/admin/booking-schedule')
    ? 'booking'
    : location.pathname.includes('/admin/staff-schedule')
    ? 'staff'
    : 'dashboard'

  return (
    <Layout className="admin-layout" style={{ minHeight: '100vh' }}>
      <Sider className="admin-sider" width={260} breakpoint="lg" collapsedWidth="0">
        <div className="admin-brand">
          <div className="brand-mark">AW</div>
          <div className="brand-info">
            <div className="brand-title">AutoWash Pro</div>
            <div className="brand-sub">Quản lý</div>
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={[
            { key: 'dashboard', icon: <HomeOutlined />, label: <Link to="/admin">Dashboard</Link> },
            { key: 'booking', icon: <CalendarOutlined />, label: <Link to="/admin/booking-schedule">Lịch Hẹn</Link> },
            { key: 'staff', icon: <TeamOutlined />, label: <Link to="/admin/staff-schedule">Nhân sự</Link> },
            { key: 'settings', icon: <SettingOutlined />, label: <Link to="/admin">Cài đặt</Link> },
          ]}
        />
      </Sider>

      <Layout>
        <Header className="admin-header">
          <div className="admin-header-left">
            <div className="admin-breadcrumb">Bảng điều khiển</div>
          </div>

          <div className="admin-header-right">
            <Avatar style={{ backgroundColor: 'var(--accent-strong)', marginRight: 8 }}>A</Avatar>
            <div className="admin-username">Admin</div>
          </div>
        </Header>

        <Content className="admin-content">{children}</Content>
      </Layout>
    </Layout>
  )
}
