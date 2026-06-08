import React, { useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Col,
  Row,
  Space,
  Table,
  Tag,
  Tabs,
  Tooltip,
  Typography,
  notification,
} from 'antd'
import {
  CalendarOutlined,
  UserOutlined,
  CarOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

const DAYS_IN_WEEK = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật']

const SHIFT_DEFINITIONS = [
  { key: 'morning', label: '07:00 - 12:00', alias: 'Ca 1' },
  { key: 'afternoon', label: '13:00 - 18:00', alias: 'Ca 2' },
]

const BOOKING_STATUS = {
  PENDING: { label: 'Đang chờ', color: 'gold', icon: <ClockCircleOutlined /> },
  COMPLETED_WASH: { label: 'Hoàn thành', color: 'green', icon: <CheckCircleOutlined /> },
  CANCELLED: { label: 'Đã hủy', color: 'red', icon: <ThunderboltOutlined /> },
}

const initialBookings = [
  {
    id: 'booking-1',
    day: 'Thứ Hai',
    shiftKey: 'morning',
    customer: 'Nguyễn Văn A',
    plate: '30A-123.45',
    service: 'Rửa tiêu chuẩn',
    status: 'PENDING',
  },
  {
    id: 'booking-2',
    day: 'Thứ Ba',
    shiftKey: 'afternoon',
    customer: 'Trần Văn B',
    plate: '51K-999.99',
    service: 'Phủ Ceramic',
    status: 'COMPLETED_WASH',
  },
  {
    id: 'booking-3',
    day: 'Thứ Tư',
    shiftKey: 'morning',
    customer: 'Lê Văn C',
    plate: '43A-567.89',
    service: 'Rửa chuyên sâu',
    status: 'CANCELLED',
  },
]

const initialStaffProfiles = [
  { id: 'staff-teo', name: 'Nguyễn Văn Tèo', weeklyHours: 0, shiftsAssigned: 0 },
  { id: 'staff-ti', name: 'Trần Văn Tí', weeklyHours: 0, shiftsAssigned: 0 },
  { id: 'staff-tun', name: 'Phạm Thị Tủn', weeklyHours: 0, shiftsAssigned: 0 },
]

const computeBookingTableData = (bookings) => {
  const grouped = DAYS_IN_WEEK.map((day) => ({ day, items: bookings.filter((item) => item.day === day) }))
  return grouped.flatMap((group) => {
    if (!group.items.length) {
      return [
        {
          key: `${group.day}-empty`,
          day: group.day,
          shiftLabel: '-',
          customerInfo: 'Không có lịch hẹn',
          service: '-',
          status: null,
          rowSpan: 1,
          showDay: true,
          showShift: true,
        },
      ]
    }

    const rows = []
    group.items.forEach((item, index) => {
      const shiftDefinition = SHIFT_DEFINITIONS.find((shift) => shift.key === item.shiftKey)
      rows.push({
        key: item.id,
        day: item.day,
        shiftLabel: `${shiftDefinition.alias} • ${shiftDefinition.label}`,
        customerInfo: `${item.customer} • ${item.plate}`,
        service: item.service,
        status: item.status,
        rowSpan: group.items.length,
        showDay: index === 0,
        showShift: index === 0,
      })
    })

    return rows
  })
}

export default function BookingSlotDashboard() {
  const [activeTab, setActiveTab] = useState('booking')
  const [bookings] = useState(initialBookings)
  const [staffProfiles, setStaffProfiles] = useState(initialStaffProfiles)
  const [scheduleData, setScheduleData] = useState([])
  const [rotationPointer, setRotationPointer] = useState(0)

  const bookingTableData = useMemo(() => computeBookingTableData(bookings), [bookings])

  const staffSummaryItems = useMemo(
    () =>
      staffProfiles.map((staff) => (
        <Tag key={staff.id} color="purple" className="rounded-full py-2 px-3 text-sm font-semibold">
          <UserOutlined /> {staff.name} <Badge className="ml-2" count={`${staff.weeklyHours}h`} style={{ backgroundColor: '#fde3ff', color: '#8739ea' }} />
        </Tag>
      )),
    [staffProfiles],
  )

  const generateStaffSchedule = () => {
    if (staffProfiles.length < 3) {
      notification.error({
        message: 'Không đủ nhân sự',
        description:
          'Cần ít nhất 3 nhân viên STAFF để kích hoạt phân lịch tự động theo quy tắc làm việc 8h/ngày và 30h/tuần.',
      })
      return
    }

    const staffState = staffProfiles.map((profile, index) => ({
      ...profile,
      currentShifts: 0,
      currentHours: 0,
      lastAssignedDay: -1,
      sortIndex: (index + rotationPointer) % staffProfiles.length,
    }))

    const schedule = DAYS_IN_WEEK.map((day, dayIndex) => {
      const dayShifts = SHIFT_DEFINITIONS.map((shift, shiftIndex) => {
        const sortedStaff = staffState
          .filter((member) => member.currentHours < 30 && member.lastAssignedDay !== dayIndex && member.currentShifts < 6)
          .sort((a, b) => {
            if (a.currentHours !== b.currentHours) {
              return a.currentHours - b.currentHours
            }
            return a.sortIndex - b.sortIndex
          })

        const capacity = Math.min(sortedStaff.length, 2)
        const assignments = sortedStaff.slice(0, capacity).map((member, index) => {
          const duty = capacity === 2 ? (index === 0 ? 'CASHIER' : 'TECHNICIAN') : 'CASHIER'
          return {
            id: `${day}-${shift.key}-${member.id}`,
            name: member.name,
            duty,
          }
        })

        assignments.forEach((assignment) => {
          const worker = staffState.find((member) => member.name === assignment.name)
          if (worker) {
            worker.currentShifts += 1
            worker.currentHours += 5
            worker.lastAssignedDay = dayIndex
          }
        })

        return {
          key: `${day}-${shift.key}`,
          day,
          shiftLabel: `${shift.alias} • ${shift.label}`,
          assignments,
        }
      })

      return {
        day,
        shifts: dayShifts,
      }
    })

    const updatedProfiles = staffState.map((member) => ({
      id: member.id,
      name: member.name,
      weeklyHours: member.currentHours,
      shiftsAssigned: member.currentShifts,
    }))

    setScheduleData(schedule)
    setRotationPointer((prev) => (prev + 1) % staffProfiles.length)
    setStaffProfiles(updatedProfiles)

    notification.success({
      message: 'Phân lịch tự động hoàn tất',
      description: 'Lịch làm việc nhân viên đã được cập nhật theo tuần với vai trò chung STAFF và vị trí tự động gán.',
    })
  }

  const bookingColumns = [
    {
      title: 'Ngày trong tuần',
      dataIndex: 'day',
      key: 'day',
      render: (value, record) => ({
        children: <span className="font-semibold text-slate-800">{value}</span>,
        props: { rowSpan: record.showDay ? record.rowSpan : 0 },
      }),
    },
    {
      title: 'Khung giờ / Ca trực',
      dataIndex: 'shiftLabel',
      key: 'shiftLabel',
      render: (value, record) => ({
        children: <span className="font-medium text-slate-700">{value}</span>,
        props: { rowSpan: record.showShift ? record.rowSpan : 0 },
      }),
    },
    {
      title: 'Thông tin khách hàng & Xe',
      dataIndex: 'customerInfo',
      key: 'customerInfo',
      render: (value) => <span className="text-slate-700">{value}</span>,
    },
    {
      title: 'Gói dịch vụ',
      dataIndex: 'service',
      key: 'service',
      render: (value) => <span className="text-slate-700">{value}</span>,
    },
    {
      title: 'Trạng thái lịch hẹn',
      dataIndex: 'status',
      key: 'status',
      render: (value) => {
        if (!value) {
          return <Tag color="default">Không có</Tag>
        }
        const status = BOOKING_STATUS[value]
        return (
          <Tag icon={status.icon} color={status.color} className="font-semibold rounded-full py-2 px-3">
            {status.label}
          </Tag>
        )
      },
    },
  ]

  const createScheduleRows = useMemo(() => {
    return scheduleData.flatMap((dayBlock) => {
      return dayBlock.shifts.flatMap((shiftBlock, shiftIndex) => {
        if (!shiftBlock.assignments.length) {
          return [
            {
              key: `${dayBlock.day}-${shiftBlock.key}-empty`,
              day: dayBlock.day,
              shiftLabel: shiftBlock.shiftLabel,
              staffName: 'Chưa có nhân viên',
              duty: null,
              rowSpan: 1,
              showDay: shiftIndex === 0,
              showShift: true,
              dayRowSpan: dayBlock.shifts.reduce((acc, shift) => acc + Math.max(shift.assignments.length, 1), 0),
              shiftRowSpan: 1,
            },
          ]
        }

        return shiftBlock.assignments.map((assignment, assignmentIndex) => ({
          key: assignment.id,
          day: dayBlock.day,
          shiftLabel: shiftBlock.shiftLabel,
          staffName: assignment.name,
          duty: assignment.duty,
          showDay: shiftIndex === 0 && assignmentIndex === 0,
          showShift: assignmentIndex === 0,
          dayRowSpan: dayBlock.shifts.reduce((acc, shift) => acc + Math.max(shift.assignments.length, 1), 0),
          shiftRowSpan: shiftBlock.assignments.length,
        }))
      })
    })
  }, [scheduleData])

  const scheduleColumns = [
    {
      title: 'Ngày làm việc',
      dataIndex: 'day',
      key: 'day',
      render: (value, record) => ({
        children: <span className="font-semibold text-slate-800">{value}</span>,
        props: { rowSpan: record.showDay ? record.dayRowSpan : 0 },
      }),
    },
    {
      title: 'Ca trực',
      dataIndex: 'shiftLabel',
      key: 'shiftLabel',
      render: (value, record) => ({
        children: <span className="font-medium text-slate-700">{value}</span>,
        props: { rowSpan: record.showShift ? record.shiftRowSpan : 0 },
      }),
    },
    {
      title: 'Nhân viên trực',
      dataIndex: 'staffName',
      key: 'staffName',
      render: (value) => <span className="text-slate-700">{value}</span>,
    },
    {
      title: 'Vị trí công việc (Hệ thống tự động gán)',
      dataIndex: 'duty',
      key: 'duty',
      render: (value) => {
        if (!value) {
          return <Tag color="default">Chưa có phân công</Tag>
        }
        const label = value === 'CASHIER' ? 'Thu ngân (CASHIER)' : 'Thợ sửa xe (TECHNICIAN)'
        const color = value === 'CASHIER' ? 'green' : 'blue'
        const icon = value === 'CASHIER' ? '💰' : '🚗'
        return (
          <Tag color={color} className="font-semibold rounded-full py-2 px-3">
            <span className="mr-2">{icon}</span>
            {label}
          </Tag>
        )
      },
    },
  ]

  const scheduleBadgeItems = useMemo(
    () =>
      staffProfiles.map((staff) => (
        <Tag key={staff.id} color="default" className="rounded-full py-2 px-3 text-sm font-semibold">
          <UserOutlined /> {staff.name} <span className="ml-2 text-slate-600">{staff.weeklyHours}h</span>
        </Tag>
      )),
    [staffProfiles],
  )

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8">
      <div className="mx-auto max-w-[1280px] space-y-8">
        <Card className="rounded-[28px] border-0 bg-white px-6 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <Space direction="vertical" size={14} className="w-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3 text-xl font-semibold text-slate-900">
                  <CalendarOutlined className="text-violet-600" />
                  📅 Quản lý Lịch hẹn & Vận hành Trạm AutoWash Pro
                </div>
                <Text className="text-slate-600">
                  Hai bảng lịch tuần đồng bộ: Booking khách hàng và lịch làm việc nhân sự theo quy tắc nghiêm ngặt của trạm.
                </Text>
              </div>
              <Space size={12}>
                <Tag icon={<CarOutlined />} color="geekblue">
                  Max 2 xe/slot
                </Tag>
                <Tag icon={<ClockCircleOutlined />} color="purple">
                  5h/ca
                </Tag>
                <Tag icon={<DollarOutlined />} color="green">
                  30h/tuần/nhân sự
                </Tag>
              </Space>
            </div>
          </Space>
        </Card>

        <Card className="rounded-[28px] border-0 bg-white px-4 py-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            items={[
              {
                key: 'booking',
                label: 'Lịch Hẹn Khách Hàng',
                children: (
                  <div className="space-y-6">
                    <Row gutter={[24, 24]}>
                      <Col xs={24} lg={16}>
                        <Card className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                          <div className="flex items-center gap-3 text-slate-900">
                            <span className="rounded-2xl bg-yellow-100 p-2 text-yellow-700">
                              <ClockCircleOutlined />
                            </span>
                            <div>
                              <div className="font-semibold text-slate-900">Lịch hẹn hiện tại</div>
                              <Text className="text-slate-600">Tổng quan các booking mẫu và trạng thái phòng rửa xe.</Text>
                            </div>
                          </div>
                        </Card>
                      </Col>
                      <Col xs={24} lg={8}>
                        <Card className="rounded-[24px] border border-slate-200 bg-white p-5">
                          <div className="text-slate-900 text-sm font-semibold">Giới hạn công suất</div>
                          <Space direction="vertical" size={8} className="mt-3">
                            <Tag icon={<CarOutlined />} color="geekblue" className="rounded-full py-2 px-3">
                              2 xe cùng lúc/slot
                            </Tag>
                            <Tag icon={<ThunderboltOutlined />} color="purple" className="rounded-full py-2 px-3">
                              Chạy tự động đồng bộ với lịch nhân sự
                            </Tag>
                          </Space>
                        </Card>
                      </Col>
                    </Row>

                    <Card className="rounded-[24px] border border-slate-200 bg-white p-4">
                      <Table
                        columns={bookingColumns}
                        dataSource={bookingTableData}
                        pagination={false}
                        bordered
                        rowKey="key"
                        size="middle"
                        locale={{
                          emptyText: (
                            <div className="py-10 text-center text-slate-500">
                              Chưa có lịch hẹn khách hàng trong tuần.
                            </div>
                          ),
                        }}
                      />
                    </Card>
                  </div>
                ),
              },
              {
                key: 'staff',
                label: 'Lịch Làm Việc Tự Động',
                children: (
                  <div className="space-y-6">
                    <Row gutter={[24, 24]}>
                      <Col xs={24} lg={16}>
                        <Card className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="font-semibold text-slate-900">Lịch làm việc tuần</div>
                              <Text className="text-slate-600">
                                Mô phỏng phân công nhân viên STAFF theo quy tắc làm việc 8h/ngày và 30h/tuần.
                              </Text>
                            </div>
                            <Button
                              type="primary"
                              icon={<ThunderboltOutlined />}
                              size="large"
                              onClick={generateStaffSchedule}
                              className="rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                            >
                              KÍCH HOẠT PHÂN LỊCH TỰ ĐỘNG
                            </Button>
                          </div>
                        </Card>
                      </Col>
                      <Col xs={24} lg={8}>
                        <Card className="rounded-[24px] border border-slate-200 bg-white p-5">
                          <div className="font-semibold text-slate-900">Nhân sự STAFF</div>
                          <div className="mt-4 flex flex-wrap gap-3">{staffSummaryItems}</div>
                        </Card>
                      </Col>
                    </Row>

                    <Card className="rounded-[24px] border border-slate-200 bg-white p-4">
                      <Table
                        columns={scheduleColumns}
                        dataSource={createScheduleRows}
                        pagination={false}
                        bordered
                        rowKey="key"
                        size="middle"
                        locale={{
                          emptyText: (
                            <div className="py-10 text-center text-slate-500">
                              Chưa có dữ liệu lịch làm việc. Vui lòng nhấn nút 'KÍCH HOẠT PHÂN LỊCH TỰ ĐỘNG' để hệ thống xử lý!
                            </div>
                          ),
                        }}
                      />
                    </Card>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  )
}
