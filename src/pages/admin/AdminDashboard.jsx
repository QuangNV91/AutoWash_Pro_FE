import { Link } from 'react-router-dom'
import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import { CalendarOutlined, CarOutlined, ThunderboltOutlined, UserOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const adminCards = [
  {
    title: 'Lịch Hẹn Khách Hàng',
    description: 'Quản lý booking và lịch khách hàng theo tuần.',
    link: '/admin/booking-schedule',
    iconBg: 'bg-violet-100 text-violet-700',
    icon: <CalendarOutlined className="text-2xl" />,
    buttonText: 'Mở lịch hẹn',
  },
  {
    title: 'Lịch Làm Việc Nhân Viên',
    description: 'Kích hoạt và theo dõi lịch làm việc tự động của STAFF.',
    link: '/admin/staff-schedule',
    iconBg: 'bg-cyan-100 text-cyan-700',
    icon: <UserOutlined className="text-2xl" />,
    buttonText: 'Mở lịch nhân viên',
  },
  {
    title: 'Dashboard tổng quan',
    description: 'Tổng quan trạng thái trạm và liên kết đến các chức năng admin.',
    link: '/admin',
    iconBg: 'bg-amber-100 text-amber-700',
    icon: <CarOutlined className="text-2xl" />,
    buttonText: 'Xem dashboard',
  },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 p-6 sm:p-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="rounded-[32px] bg-gradient-to-r from-violet-700 via-indigo-600 to-cyan-600 px-8 py-10 text-white shadow-[0_30px_80px_rgba(79,70,229,0.18)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <Title level={2} className="!mb-3 text-white">
                🛠️ Admin Package | AutoWash Pro
              </Title>
              <Text className="text-slate-100 text-lg leading-8">
                Gói AdminPage đã sẵn sàng để mở từng module riêng biệt: booking khách hàng, lịch nhân viên và bảng điều khiển tổng quan.
              </Text>
            </div>
            <div className="space-y-3">
              <Tag className="rounded-full bg-white/10 text-white border border-white/15 py-2 px-4 font-semibold">
                3 tính năng admin sẵn sàng
              </Tag>
              <Button
                type="default"
                ghost
                className="rounded-full border-white/30 text-white hover:bg-white/10"
                icon={<ThunderboltOutlined />}
              >
                Bắt đầu quản trị
              </Button>
            </div>
          </div>
        </section>

        <Row gutter={[24, 24]}>
          {adminCards.map((card) => (
            <Col key={card.title} xs={24} sm={12} xl={8}>
              <Card hoverable className="rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                <div className="flex items-start gap-4">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-lg font-semibold text-slate-900">{card.title}</div>
                    <Text className="text-slate-600">{card.description}</Text>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between gap-4">
                  <Tag color="default" className="rounded-full py-2 px-4 text-sm font-semibold text-slate-700">
                    Module riêng biệt
                  </Tag>
                  <Link to={card.link}>
                    <Button type="primary" className="rounded-full" size="middle">
                      {card.buttonText}
                    </Button>
                  </Link>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <Card className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-3 rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
                <ThunderboltOutlined /> Admin package thiết kế lại
              </div>
              <Title level={4} className="!mb-2 text-slate-900">
                Giao diện admin tinh gọn và chuyên nghiệp
              </Title>
              <Text className="text-slate-600 leading-8">
                Trang tổng quan này giúp bạn điều hướng nhanh đến các chức năng quan trọng, giữ cho từng module riêng biệt, dễ bảo trì và trực quan cho đội ngũ quản trị AutoWash Pro.
              </Text>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Tách riêng</div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">Booking & Schedule</div>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Chuẩn hoá</div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">Admin package dễ mở rộng</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="space-y-5">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Tại sao cần module admin riêng?</div>
              <div className="grid gap-4">
                <div className="flex items-start gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <span className="rounded-2xl bg-violet-100 p-3 text-violet-700">
                    <CalendarOutlined />
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900">Chia theo tính năng</div>
                    <Text className="text-slate-600">Giúp duy trì tính năng booking và schedule rõ ràng.</Text>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <span className="rounded-2xl bg-cyan-100 p-3 text-cyan-700">
                    <UserOutlined />
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900">Dễ mở rộng</div>
                    <Text className="text-slate-600">Cho phép bổ sung module mới mà không làm rối layout.</Text>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <span className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                    <CarOutlined />
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900">Vận hành chuyên nghiệp</div>
                    <Text className="text-slate-600">Giao diện sạch sẽ giúp người dùng hiểu nhanh và thao tác dễ dàng.</Text>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
