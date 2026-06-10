import React from 'react';
import { Layout, Row, Col, Button, Tag, Card, Typography, Space } from 'antd';
import {
  AppstoreOutlined,
  DashboardOutlined,
  LineChartOutlined,
  RocketOutlined,
  FieldTimeOutlined,
  CalendarOutlined,
  UserOutlined,
  CarOutlined,
  StarOutlined,
  ClusterOutlined,
  FileProtectOutlined,
  AimOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import './AdminDashboard.css';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

// --- Mock Data ---
const stats = [
  {
    key: '1',
    label: 'Total Modules',
    value: '03',
    icon: <AppstoreOutlined />,
    color: 'green',
  },
  {
    key: '2',
    label: 'Performance',
    value: '97%',
    icon: <LineChartOutlined />,
    color: 'orange',
  },
  {
    key: '3',
    label: 'Response Time',
    value: '0.8s',
    icon: <RocketOutlined />,
    color: 'blue',
  },
];

const quickActions = [
  {
    title: 'Lịch Hẹn Khách Hàng',
    tag: 'Ưu tiên',
    desc: 'Lịch hẹn khách hàng, Lịch hẹn',
    icon: <CalendarOutlined />,
    color: 'green',
    link: 'Mở lịch hẹn/nhân viên/Xem dashboard',
  },
  {
    title: 'Lịch Làm Việc Nhân Viên',
    tag: 'Ưu tiên',
    desc: 'Lịch Làm việc nhân viên: tiền nhân viên.',
    icon: <UserOutlined />,
    color: 'orange',
    link: 'Mở lịch hẹn/nhân viên/Xem dashboard',
  },
  {
    title: 'Dashboard tổng quan',
    tag: 'Ưu tiên',
    desc: 'Dashboard tổng quan định hướng và thình của tổng quan.',
    icon: <CarOutlined />,
    color: 'blue',
    link: 'Mở lịch hẹn/nhân viên/Xem dashboard',
  },
];

const developInfo = [
  { label: 'Tốc độ', value: 'Professional nhuyễn trường', icon: <FieldTimeOutlined /> },
  { label: 'Tốc độ', value: 'Professional typographiss', icon: <AimOutlined /> },
  { label: 'Cấu trúc', value: 'Cấu trúc của phần mành', icon: <ClusterOutlined /> },
];

const benefits = [
  { text: 'Lần tương linn á: công hàng, ohart', icon: <FileProtectOutlined /> },
  { text: 'Vậy thuộc hình cất nát', icon: <ClusterOutlined /> },
  { text: 'Giaan ảnh ích cốt lõi', icon: <StarOutlined /> },
  { text: 'Tàm từ cáo tỷ hiện sinh hàng', icon: <AimOutlined /> },
];

// --- Sub-components ---
const StatCard = ({ item }) => (
  <Card className="aw-stat-card" bordered={false}>
    <div className={`aw-stat-icon-wrapper aw-stat-icon-${item.color}`}>
      {item.icon}
    </div>
    <div className="aw-stat-content">
      <Title level={1} className="aw-stat-value">
        {item.value}
      </Title>
      <Text type="secondary" className="aw-stat-label">
        {item.label}
      </Text>
    </div>
  </Card>
);

const QuickActionCard = ({ action }) => (
  <Card
    className="aw-action-card"
    bordered={false}
    bodyStyle={{ padding: 0 }} // We'll manage padding via CSS
  >
    <div className="aw-action-card-inner">
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Space split>
          <Tag className="aw-tag-eyebrow">Ưu tiên</Tag>
        </Space>
        
        <Title level={4} className="aw-action-title">
          {action.title}
        </Title>
        <Paragraph type="secondary" className="aw-action-desc">
          {action.desc}
        </Paragraph>
        
        <div className={`aw-action-icon-circle aw-action-icon-${action.color}`}>
          {action.icon}
        </div>
      </Space>
    </div>
    <div className="aw-action-card-footer">
      <Button type="link" icon={<ArrowRightOutlined />} className="aw-action-link">
        {action.link}
      </Button>
    </div>
  </Card>
);

// --- Main Component ---
const AdminDashboard = () => {
  return (
    <Layout className="aw-dashboard-layout">
      <Content className="aw-content">
        
        {/* --- Hero & Stats Section (HomePage-like style) --- */}
        <div className="relative overflow-hidden bg-dark-950 text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/80 to-transparent"></div>

          <Content style={{ position: 'relative', zIndex: 10, padding: '48px 24px' }}>
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="lg:w-2/3">
                  <Tag className="inline-block mb-4 bg-amber-100/10 text-amber-300 border-0">Admin Center</Tag>
                  <Title level={1} style={{ color: '#fff', margin: '10px 0' }}>
                    AutoWash Pro Admin
                  </Title>
                  <Paragraph style={{ color: '#e5e7eb', maxWidth: 720 }}>
                    Trung tâm điều hành cho phép bạn quản lý lịch, nhân sự và hiệu suất trạm một cách nhanh gọn và trực quan.
                  </Paragraph>
                  <Space size="middle" style={{ marginTop: 18 }}>
                    <Button type="primary" size="large" className="bg-amber-400 border-0 text-dark-950">
                      Khám phá ngay
                    </Button>
                    <Button size="large" className="text-white border border-white/20">
                      Xem hướng dẫn
                    </Button>
                  </Space>
                </div>

                <div className="lg:w-1/3 w-full">
                  <div className="bg-white/5 rounded-xl p-4 backdrop-blur-md">
                    <div className="grid grid-cols-1 gap-4">
                      {stats.map((item) => (
                        <div key={item.key}>
                          <StatCard item={item} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Content>
        </div>

        {/* --- Quick Actions Section --- */}
        <div className="aw-actions-section">
          <Title level={2} className="aw-section-title">
            Chức năng nhanh
          </Title>
          <Row gutter={[24, 24]}>
            {quickActions.map(action => (
              <Col xs={24} md={12} lg={8} key={action.title}>
                <QuickActionCard action={action} />
              </Col>
            ))}
          </Row>
        </div>

        {/* --- Info Grids Section --- */}
        <div className="aw-info-section">
          <Row gutter={[32, 32]}>
            {/* Định hướng phát triển */}
            <Col xs={24} lg={12}>
              <Card className="aw-info-card" bordered={false}>
                <Title level={3} className="aw-card-title">
                  Định hướng phát triển
                </Title>
                <Row gutter={[16, 24]} className="aw-info-grid">
                  {developInfo.map((info, index) => (
                    <Col span={12} key={index} className="aw-info-item">
                      <div className="aw-info-icon-wrapper">
                        {info.icon}
                      </div>
                      <div className="aw-info-text">
                        <Text strong className="aw-info-label">
                          {info.label}
                        </Text>
                        <Paragraph type="secondary" className="aw-info-value">
                          {info.value}
                        </Paragraph>
                      </div>
                    </Col>
                  ))}
                   <Col span={12} className="aw-info-item aw-info-item-empty">
                      {/* Placeholder for structure */}
                      <ClusterOutlined className="aw-info-icon-placeholder" />
                      <div className="aw-info-text">
                        <Text strong className="aw-info-label">Cấu trúc</Text>
                        <Paragraph type="secondary" className="aw-info-value">Cấu trúc của phần mành</Paragraph>
                      </div>
                   </Col>
                </Row>
              </Card>
            </Col>
            
            {/* Lợi ích cốt lõi */}
            <Col xs={24} lg={12}>
              <Card className="aw-info-card" bordered={false}>
                <Title level={3} className="aw-card-title">
                  Lợi ích cốt lõi
                </Title>
                <Space direction="vertical" size={20} className="aw-benefits-list">
                  {benefits.map((benefit, index) => (
                    <div className="aw-benefit-item" key={index}>
                      <div className="aw-benefit-icon-wrapper">
                        {benefit.icon}
                      </div>
                      <Text className="aw-benefit-text">
                        {benefit.text}
                      </Text>
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Bottom grid label (as seen in image) */}
        <div className="aw-bottom-label">
           <Text type="secondary">Dashboard_bottom_grid</Text>
        </div>

      </Content>
    </Layout>
  );
};

export default AdminDashboard;