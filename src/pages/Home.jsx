import { Link } from 'react-router-dom'
import { Button, Card, Col, Row, Tag, Typography, Space } from 'antd'
import { 
  CalendarOutlined, 
  CarOutlined, 
  UserOutlined, 
  ArrowRightOutlined, 
  CheckCircleFilled,
  SafetyCertificateOutlined 
} from '@ant-design/icons'
import './Home.css'

const { Title, Paragraph, Text } = Typography

const homeTiles = [
  {
    title: 'Quản lý lịch hẹn thông minh',
    description: 'Tự động sắp xếp, tìm kiếm nâng cao và tối ưu hóa thời gian trống của trạm chỉ trong một màn hình điều hướng.',
    icon: <CalendarOutlined />,
    badge: 'Realtime',
    colorClass: 'card-icon--blue'
  },
  {
    title: 'Điều phối nhân sự tự động',
    description: 'Theo dõi ca trực, đánh giá hiệu suất của STAFF và phân chia công việc tự động dựa trên lượng xe tại trạm.',
    icon: <UserOutlined />,
    badge: 'Automation',
    colorClass: 'card-icon--teal'
  },
  {
    title: 'Vận hành hiệu năng cao',
    description: 'Hệ thống báo cáo trực quan, giảm thiểu 85% thao tác thủ công, giúp chủ doanh nghiệp bứt phá doanh thu.',
    icon: <CarOutlined />,
    badge: 'Analytics',
    colorClass: 'card-icon--amber'
  },
]

export default function Home() {
  return (
    <div className="home-wrapper">
      {/* --- HERO SECTION --- */}
      <section className="hero-container">
        <Row gutter={[48, 48]} align="middle">
          {/* Khối chữ bên trái */}
          <Col xs={24} lg={13} className="hero-left-content">
            <Space direction="vertical" size={24}>
              <div className="announcement-badge">
                <Tag color="processing" className="custom-tag">Phiên bản 2.0</Tag>
                <Text className="badge-text">Đã tối ưu hóa trải nghiệm UI/UX toàn diện</Text>
              </div>
              
              <Title level={1} className="hero-main-title">
                Hệ thống điều hành <br />
                <span className="gradient-text">Rửa xe thông minh</span> thế hệ mới.
              </Title>
              
              <Paragraph className="hero-sub-paragraph">
                AutoWash Pro đập tan mọi rào cản vận hành truyền thống. Thiết kế tối giản, 
                luồng dữ liệu thời gian thực giúp cả Quản trị viên (Admin) và Nhân viên (Staff) tăng hiệu suất tối đa.
              </Paragraph>
              
              <div className="hero-cta-group">
                <Link to="/auth/login">
                  <Button type="primary" size="large" className="cta-btn-primary">
                    Đăng nhập hệ thống
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button size="large" className="cta-btn-secondary">
                    Mở Admin
                  </Button>
                </Link>
                <Link to="/staff" className="cta-link-text">
                  Mở Staff <ArrowRightOutlined className="moving-arrow" />
                </Link>
              </div>

              <div className="hero-trust-badges">
                <Space size="large">
                  <span className="trust-item"><CheckCircleFilled /> Tối ưu UI/UX</span>
                  <span className="trust-item"><CheckCircleFilled /> Khởi động nhanh</span>
                  <span className="trust-item"><CheckCircleFilled /> Bảo mật an toàn</span>
                </Space>
              </div>
            </Space>
          </Col>

          {/* Khối Dashboard mô phỏng bên phải (Khắc phục lỗi xẹp card trong ảnh cũ) */}
          <Col xs={24} lg={11} className="hero-right-visual">
            <div className="glass-card-container">
              <Card className="premium-metric-card" bordered={false}>
                <div className="metric-card-top">
                  <div className="platform-branding">
                    <SafetyCertificateOutlined className="brand-icon" />
                    <div>
                      <Title level={5} className="brand-name">AutoWash Engine</Title>
                      <Text className="brand-status">Hệ thống đang chạy ổn định</Text>
                    </div>
                  </div>
                  <Tag color="cyan" className="live-pulse-tag">Live</Tag>
                </div>
                
                <Title level={3} className="metric-card-headline">
                  Tương tác đơn giản, rõ ràng và thân thiện.
                </Title>
                
                <div className="metric-divider" />
                
                <Row gutter={16} className="metric-grid-data">
                  <Col span={12}>
                    <div className="data-box">
                      <span className="data-num">03</span>
                      <span className="data-title">Module cốt lõi</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="data-box">
                      <span className="data-num">97%</span>
                      <span className="data-title">Hoàn thiện UX</span>
                    </div>
                  </Col>
                </Row>
              </Card>
              <div className="decorative-glow-1"></div>
              <div className="decorative-glow-2"></div>
            </div>
          </Col>
        </Row>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="features-container">
        <div className="features-header-center">
          <span className="section-eyebrow">Giải pháp toàn diện</span>
          <Title level={2} className="section-main-heading">Hệ thống vận hành thông minh</Title>
          <Paragraph className="section-sub-heading">
            Tận hưởng giải pháp quản lý khép kín được tinh chỉnh chuẩn xác cho từng vai trò trong hệ thống.
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {homeTiles.map((tile) => (
            <Col key={tile.title} xs={24} md={12} lg={8}>
              <Card className="modern-feature-card" bordered={false} styles={{ body: { padding: 40 } }}>
                <div className="card-top-flex">
                  <div className={`card-icon-sphere ${tile.colorClass}`}>
                    {tile.icon}
                  </div>
                  <Tag className="card-mini-badge">{tile.badge}</Tag>
                </div>
                <Title level={4} className="card-heading-title">
                  {tile.title}
                </Title>
                <Paragraph className="card-content-desc">
                  {tile.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  )
}