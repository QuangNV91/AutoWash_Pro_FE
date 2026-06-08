import React, { useMemo, useState } from 'react'
import { Button, Card, Space, Table, Tag, Typography, notification } from 'antd'
import { ThunderboltOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const DAYS_IN_WEEK = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật']

const SHIFT_DEFINITIONS = [
  { key: 'morning', label: '07:00 - 12:00', alias: 'Ca 1' },
  { key: 'afternoon', label: '13:00 - 18:00', alias: 'Ca 2' },
]

const initialStaffProfiles = [
  { id: 'staff-teo', name: 'Nguyễn Văn Tèo', weeklyHours: 0, shiftsAssigned: 0 },
  { id: 'staff-ti', name: 'Trần Văn Tí', weeklyHours: 0, shiftsAssigned: 0 },
  { id: 'staff-tun', name: 'Phạm Thị Tủn', weeklyHours: 0, shiftsAssigned: 0 },
]

const getDutyTag = (duty) => {
  if (duty === 'CASHIER') {
    return (
      <Tag color="green" className="font-semibold rounded-full py-2 px-3">
        💰 Thu ngân (CASHIER)
      </Tag>
    )
  }

  return (
    <Tag color="blue" className="font-semibold rounded-full py-2 px-3">
      🚗 Thợ sửa xe (TECHNICIAN)
    </Tag>
  )
}

const buildStaffScheduleRows = (scheduleData) => {
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
            dayRowSpan: dayBlock.shifts.reduce((sum, shift) => sum + Math.max(shift.assignments.length, 1), 0),
            shiftRowSpan: 1,
            showDay: shiftIndex === 0,
            showShift: true,
          },
        ]
      }

      return shiftBlock.assignments.map((assignment, assignmentIndex) => ({
        key: assignment.id,
        day: dayBlock.day,
        shiftLabel: shiftBlock.shiftLabel,
        staffName: assignment.name,
        duty: assignment.duty,
        dayRowSpan: dayBlock.shifts.reduce((sum, shift) => sum + Math.max(shift.assignments.length, 1), 0),
        shiftRowSpan: shiftBlock.assignments.length,
        showDay: shiftIndex === 0 && assignmentIndex === 0,
        showShift: assignmentIndex === 0,
      }))
    })
  })
}

export default function StaffScheduleDashboard() {
  const [staffProfiles, setStaffProfiles] = useState(initialStaffProfiles)
  const [scheduleData, setScheduleData] = useState([])
  const [rotationPointer, setRotationPointer] = useState(0)

  const staffBadges = useMemo(
    () =>
      staffProfiles.map((staff) => (
        <Tag key={staff.id} color="default" className="rounded-full py-2 px-3 text-sm font-semibold">
          <UserOutlined /> {staff.name} <span className="ml-2 text-slate-600">{staff.weeklyHours}h</span>
        </Tag>
      )),
    [staffProfiles],
  )

  const createStaffSchedule = () => {
    if (staffProfiles.length < 3) {
      notification.error({
        message: 'Không đủ nhân sự',
        description: 'Tối thiểu 3 nhân viên STAFF để tạo lịch làm việc tuần tự động.',
      })
      return
    }

    const workers = staffProfiles.map((staff, index) => ({
      ...staff,
      currentHours: 0,
      currentShifts: 0,
      lastAssignedDay: -1,
      sortIndex: (index + rotationPointer) % staffProfiles.length,
    }))

    const newSchedule = DAYS_IN_WEEK.map((day, dayIndex) => {
      const shifts = SHIFT_DEFINITIONS.map((shift) => {
        const available = workers
          .filter((worker) => worker.currentHours < 30 && worker.lastAssignedDay !== dayIndex)
          .sort((a, b) => {
            if (a.currentHours !== b.currentHours) {
              return a.currentHours - b.currentHours
            }
            return a.sortIndex - b.sortIndex
          })

        const assigned = available.slice(0, Math.min(2, available.length))
        const assignments = assigned.map((worker, index) => {
          const duty = assigned.length === 2 ? (index === 0 ? 'CASHIER' : 'TECHNICIAN') : 'CASHIER'
          return { id: `${day}-${shift.key}-${worker.id}`, name: worker.name, duty }
        })

        assigned.forEach((worker) => {
          worker.currentHours += 5
          worker.currentShifts += 1
          worker.lastAssignedDay = dayIndex
        })

        return { key: shift.key, day, shiftLabel: `${shift.alias} • ${shift.label}`, assignments }
      })

      return { day, shifts }
    })

    const updatedProfiles = workers.map((worker) => ({
      id: worker.id,
      name: worker.name,
      weeklyHours: worker.currentHours,
      shiftsAssigned: worker.currentShifts,
    }))

    setStaffProfiles(updatedProfiles)
    setScheduleData(newSchedule)
    setRotationPointer((prev) => (prev + 1) % staffProfiles.length)

    notification.success({
      message: 'Phân lịch thành công',
      description: 'Lịch làm việc tuần đã được tạo tự động cho nhân viên STAFF.',
    })
  }

  const scheduleRows = useMemo(() => buildStaffScheduleRows(scheduleData), [scheduleData])

  const columns = [
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
      render: (value) => (value ? getDutyTag(value) : <Tag color="default">Chưa có phân công</Tag>),
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <Card className="rounded-[28px] border-0 bg-white px-6 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <Space direction="vertical" size={16} className="w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Title level={2} className="!mb-0 text-slate-900">
                  🛠️ Lịch Làm Việc Nhân Viên STAFF
                </Title>
                <Text className="text-slate-600">
                  Tự động sinh lịch nhân viên STAFF theo quy tắc: tối đa 2 người/ca, 1 ca/ngày, và 30h/tuần.
                </Text>
              </div>
              <Button type="primary" icon={<ThunderboltOutlined />} size="large" onClick={createStaffSchedule} className="rounded-3xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                KÍCH HOẠT PHÂN LỊCH TỰ ĐỘNG
              </Button>
            </div>
          </Space>
        </Card>

        <Card className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Text className="block text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">Tổng quan nhân sự</Text>
              <div className="mt-3 flex flex-wrap gap-3">{staffBadges}</div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <div className="font-semibold text-slate-800">Luật vận hành</div>
              <div>• 2 nhân viên/ca</div>
              <div>• 1 ca/ngày mỗi nhân viên</div>
              <div>• Tối đa 6 ca/tuần (30h)</div>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={scheduleRows}
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
    </div>
  )
}
