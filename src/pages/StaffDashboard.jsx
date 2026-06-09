import { Link } from 'react-router-dom'
import { Button, Card, Tag } from 'antd'
import { ClockCircleOutlined, ToolOutlined, SmileOutlined } from '@ant-design/icons'

const tasks = [
  { id: 'task-1', title: 'Chuẩn bị khu vực rửa xe', detail: '07:00 - 08:30', status: 'Sẵn sàng' },
  { id: 'task-2', title: 'Đón khách và kiểm tra xe', detail: '08:30 - 10:00', status: 'Đang thực hiện' },
  { id: 'task-3', title: 'Kiểm tra chất lượng sau rửa', detail: '10:00 - 10:30', status: 'Hoàn thành' },
]

export default function StaffDashboard() {
  return (
    <div className="staff-page">
      <section className="page-hero page-hero--staff">
        <div className="page-hero__body">
          <span className="eyebrow">Màn hình Staff</span>
          <h1>Giữ nhịp vận hành, đơn giản và trực quan.</h1>
          <p>
            Giao diện nhân viên được thiết kế để giảm thao tác, giúp bạn nhanh chóng nắm bắt ca làm và tình trạng xe. Chỉ còn những hành động cần thiết.
          </p>
          <div className="home-actions">
            <Button type="primary" size="large">
              Bắt đầu ca
            </Button>
            <Link to="/">
              <Button type="text" size="large">
                Về trang chủ
              </Button>
            </Link>
          </div>
        </div>

        <div className="staff-hero-cards">
          <Card className="status-card" bordered={false}>
            <div>
              <span>Ca hôm nay</span>
              <h2>07:00 - 15:00</h2>
            </div>
            <Tag icon={<ClockCircleOutlined />} color="success">
              Đang sẵn sàng
            </Tag>
          </Card>
          <Card className="status-card" bordered={false}>
            <div>
              <span>Xe đang chờ</span>
              <h2>4</h2>
            </div>
            <Tag icon={<ToolOutlined />} color="processing">
              Xử lý nhanh
            </Tag>
          </Card>
          <Card className="status-card" bordered={false}>
            <div>
              <span>Phản hồi khách</span>
              <h2>98%</h2>
            </div>
            <Tag icon={<SmileOutlined />} color="cyan">
              Tốt
            </Tag>
          </Card>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Danh sách công việc</h2>
            <p>Những công việc cần hoàn thành trong ca làm việc.</p>
          </div>
        </div>

        <div className="task-list">
          {tasks.map((task) => (
            <Card key={task.id} className="task-card" bordered={false}>
              <div>
                <h3>{task.title}</h3>
                <p>{task.detail}</p>
              </div>
              <Tag color={task.status === 'Hoàn thành' ? 'success' : 'default'}>{task.status}</Tag>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
