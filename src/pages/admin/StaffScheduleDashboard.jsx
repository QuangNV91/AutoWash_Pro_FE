import React, { useMemo, useState, useEffect } from 'react'
import { Button, Card, Space, Table, Tag, Typography, notification, Modal, List, Select, Form } from 'antd'
import { ThunderboltOutlined, UserOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'

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
            incomplete: true,
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
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 'lr-demo-1',
      staffId: 'staff-ti',
      staffName: 'Trần Văn Tí',
      startIndex: 2, // Thứ Tư
      duration: 3,
      status: 'pending',
    },
  ])
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false)
  const [staffLeaves, setStaffLeaves] = useState({})

  const staffBadges = useMemo(
    () =>
      staffProfiles.map((staff) => (
        <Tag key={staff.id} color="default" className="rounded-full py-2 px-3 text-sm font-semibold">
          <UserOutlined /> {staff.name} <span className="ml-2 text-slate-600">{staff.weeklyHours}h</span>
        </Tag>
      )),
    [staffProfiles],
  )

  // Leave requests and handling
  const pendingCount = leaveRequests.filter((r) => r.status === 'pending').length

  const createLeaveRequest = (values) => {
    const staff = staffProfiles.find((s) => s.id === values.staffId)
    const req = {
      id: `lr-${Date.now()}`,
      staffId: values.staffId,
      staffName: staff ? staff.name : 'Unknown',
      startIndex: values.startIndex,
      duration: values.duration,
      status: 'pending',
    }
    setLeaveRequests((prev) => [req, ...prev])
    setIsNewRequestModalOpen(false)
    notification.info({
      message: 'Đã tạo đơn nghỉ',
      description: `${req.staffName} xin nghỉ ${req.duration} ngày bắt đầu ${DAYS_IN_WEEK[req.startIndex]}`,
    })
  }

  const approveLeaveRequest = (id) => {
    const req = leaveRequests.find((r) => r.id === id)
    if (!req) return

    // compute new leaves map
    const prevLeaves = staffLeaves
    const prevArr = prevLeaves[req.staffId] || []
    const s = new Set(prevArr)
    for (let i = 0; i < req.duration; i++) {
      const idx = Math.min(req.startIndex + i, DAYS_IN_WEEK.length - 1)
      s.add(idx)
    }
    const newLeaves = { ...prevLeaves, [req.staffId]: Array.from(s) }

    setStaffLeaves(newLeaves)
    setLeaveRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)))

    // regenerate schedule with new leaves applied
    createStaffSchedule({ notify: true }, newLeaves)

    notification.success({ message: 'Đã duyệt đơn nghỉ', description: `${req.staffName} được nghỉ ${req.duration} ngày.` })
  }

  const rejectLeaveRequest = (id) => {
    const req = leaveRequests.find((r) => r.id === id)
    if (!req) return
    setLeaveRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)))
    notification.info({ message: 'Đã từ chối đơn nghỉ', description: `${req.staffName} không được duyệt nghỉ` })
  }

  const createStaffSchedule = (opts = { notify: true }, leavesOverride = null) => {
    const { notify } = opts
    const leaves = leavesOverride || staffLeaves
    if (staffProfiles.length < 3) {
      if (notify) {
        notification.error({
          message: 'Không đủ nhân sự',
          description: 'Tối thiểu 3 nhân viên STAFF để tạo lịch làm việc tuần tự động.',
        })
      }
      return
    }

    const workers = staffProfiles.map((staff, index) => ({
      ...staff,
      currentHours: 0,
      currentShifts: 0,
      sortIndex: (index + rotationPointer) % staffProfiles.length,
    }))

    const newSchedule = DAYS_IN_WEEK.map((day, dayIndex) => {
      // Filter out workers who are on approved leave for this day
      const availableWorkers = workers.filter((w) => {
        const leavesFor = leaves[w.id] || []
        return !leavesFor.includes(dayIndex)
      })

      // Sort available workers by least hours then by stable sortIndex for fairness
      const sortedWorkers = availableWorkers.slice().sort((a, b) => {
        if (a.currentHours !== b.currentHours) return a.currentHours - b.currentHours
        return a.sortIndex - b.sortIndex
      })

      const morningDef = SHIFT_DEFINITIONS[0]
      const afternoonDef = SHIFT_DEFINITIONS[1]

      // Pick top 2 workers for morning
      const morningAssigned = sortedWorkers.slice(0, 2)

      // Assign morning only if at least 2 available
      let morningAssignments = []
      if (morningAssigned.length >= 2) {
        morningAssignments = morningAssigned.map((w) => ({ id: `${day}-${morningDef.key}-${w.id}`, name: w.name }))
        morningAssigned.forEach((w) => {
          w.currentHours += 5
          w.currentShifts += 1
        })
      }

      // For this request, afternoon should be done by the same two from morning (if they are available)
      let afternoonAssignments = []
      if (morningAssigned.length >= 2) {
        afternoonAssignments = morningAssigned.map((w) => ({ id: `${day}-${afternoonDef.key}-${w.id}`, name: w.name }))
        morningAssigned.forEach((w) => {
          w.currentHours += 5
          w.currentShifts += 1
        })
      }

      const shifts = [
        { key: morningDef.key, day, shiftLabel: `${morningDef.alias} • ${morningDef.label}`, assignments: morningAssignments },
        { key: afternoonDef.key, day, shiftLabel: `${afternoonDef.alias} • ${afternoonDef.label}`, assignments: afternoonAssignments },
      ]

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

    if (notify) {
      notification.success({
        message: 'Phân lịch thành công',
        description: 'Lịch làm việc tuần đã được tạo tự động cho nhân viên STAFF.',
      })
    }
  }

  useEffect(() => {
    // Automatically generate schedule on first render without a notification
    createStaffSchedule({ notify: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      render: (value, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="text-slate-700">{value}</span>
          {record.incomplete && <Tag color="error">Thiếu nhân sự</Tag>}
        </div>
      ),
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
                  Tự động sinh lịch nhân viên STAFF theo quy tắc: tối đa 2 người/ca, 1 ca/ngày.
                </Text>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Button onClick={() => setIsLeaveModalOpen(true)}>
                  Yêu cầu nghỉ ({pendingCount})
                </Button>
                <Button type="default" onClick={() => setIsNewRequestModalOpen(true)}>
                  Tạo đơn nghỉ
                </Button>
                <Button type="primary" icon={<ThunderboltOutlined />} size="large" onClick={() => createStaffSchedule()} className="rounded-3xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                  TẠO LẠI PHÂN LỊCH
                </Button>
              </div>
            </div>
          </Space>
        </Card>

        {/* Leave Requests Modal */}
        <Modal title={`Yêu cầu nghỉ (${pendingCount})`} open={isLeaveModalOpen} onCancel={() => setIsLeaveModalOpen(false)} footer={null}>
          <List
            dataSource={leaveRequests.filter((r) => r.status === 'pending')}
            locale={{ emptyText: <div>Không có đơn nghỉ nào đang chờ</div> }}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button key="approve" type="link" icon={<CheckOutlined />} onClick={() => approveLeaveRequest(item.id)}>
                    Duyệt
                  </Button>,
                  <Button key="reject" danger type="link" icon={<CloseOutlined />} onClick={() => rejectLeaveRequest(item.id)}>
                    Từ chối
                  </Button>,
                ]}
              >
                <List.Item.Meta title={item.staffName} description={`${DAYS_IN_WEEK[item.startIndex]} — ${item.duration} ngày`} />
              </List.Item>
            )}
          />
        </Modal>

        {/* New Leave Request Modal (for demo) */}
        <Modal title="Tạo đơn xin nghỉ" open={isNewRequestModalOpen} onCancel={() => setIsNewRequestModalOpen(false)} footer={null}>
          <Form layout="vertical" onFinish={createLeaveRequest} initialValues={{ duration: 1 }}>
            <Form.Item name="staffId" label="Nhân viên" rules={[{ required: true }]}>
              <Select placeholder="Chọn nhân viên">
                {staffProfiles.map((s) => (
                  <Select.Option key={s.id} value={s.id}>
                    {s.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="startIndex" label="Ngày bắt đầu (trong tuần)" rules={[{ required: true }]}>
              <Select placeholder="Chọn ngày">
                {DAYS_IN_WEEK.map((d, idx) => (
                  <Select.Option key={idx} value={idx}>
                    {d}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="duration" label="Số ngày" rules={[{ required: true }]}>
              <Select>
                <Select.Option value={1}>1 ngày</Select.Option>
                <Select.Option value={3}>3 ngày</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Gửi đơn
              </Button>
            </Form.Item>
          </Form>
        </Modal>

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
              <div>• Không giới hạn giờ làm</div>
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
                    Chưa có dữ liệu lịch làm việc. Hệ thống sẽ tự động tạo lịch khi có đủ nhân sự.
                  </div>
                ),
            }}
          />
        </Card>
      </div>
    </div>
  )
}
