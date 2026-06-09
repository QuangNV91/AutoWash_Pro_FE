import React, { useMemo, useState, useEffect } from 'react'
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  notification,
  Tooltip,
  Tag,
  Divider
} from 'antd'
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  LoginOutlined,
  PlusOutlined,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
  EditOutlined
} from '@ant-design/icons'

const { Option } = Select

const DAYS_IN_WEEK = [
  { id: 'T2', name: 'Thứ Hai', eng: 'Monday', dateStr: '08' },
  { id: 'T3', name: 'Thứ Ba', eng: 'Tuesday', dateStr: '09' },
  { id: 'T4', name: 'Thứ Tư', eng: 'Wednesday', dateStr: '10' },
  { id: 'T5', name: 'Thứ Năm', eng: 'Thursday', dateStr: '11' },
  { id: 'T6', name: 'Thứ Sáu', eng: 'Friday', dateStr: '12' },
  { id: 'T7', name: 'Thứ Bảy', eng: 'Saturday', dateStr: '13' },
  { id: 'CN', name: 'Chủ Nhật', eng: 'Sunday', dateStr: '14' },
]

const TEN_SLOTS = [
  { key: 'slot-1', time: '08:00 - 09:00', label: 'Slot 01' },
  { key: 'slot-2', time: '09:00 - 10:00', label: 'Slot 02' },
  { key: 'slot-3', time: '10:00 - 11:00', label: 'Slot 03' },
  { key: 'slot-4', time: '11:00 - 12:00', label: 'Slot 04' },
  { key: 'slot-5', time: '13:00 - 14:00', label: 'Slot 05' },
  { key: 'slot-6', time: '14:00 - 15:00', label: 'Slot 06' },
  { key: 'slot-7', time: '15:00 - 16:00', label: 'Slot 07' },
  { key: 'slot-8', time: '16:00 - 17:00', label: 'Slot 08' },
  { key: 'slot-9', time: '17:00 - 18:00', label: 'Slot 09' },
  { key: 'slot-10', time: '18:00 - 19:00', label: 'Slot 10' },
]

const SERVICE_CONFIG = {
  'Rửa bình thường': { duration: 15, color: '#2db7f5' },
  'Rửa tiêu chuẩn': { duration: 30, color: '#108ee9' },
  'Gói cao cấp': { duration: 60, color: '#87d068' }
}

const WORK_STATUS = {
  BOOKED: { label: 'Lịch hẹn', color: 'blue', icon: <ClockCircleOutlined /> },
  ARRIVED: { label: 'Xe đã đến', color: 'orange', icon: <LoginOutlined /> },
  PROCESSING: { label: 'Đang làm việc', color: 'purple', icon: <SyncOutlined spin /> },
  DONE: { label: 'Hoàn thành', color: 'green', icon: <CheckCircleOutlined /> },
}

const PAYMENT_STATUS = {
  UNPAID: { label: 'Chưa thanh toán', color: 'error' },
  PAID: { label: 'Đã thanh toán', color: 'success' }
}

const initialBookings = [
  { id: 'b-1', day: 'Thứ Hai', slotKey: 'slot-1', customer: 'Nguyễn Văn A', plate: '30A-123.45', service: 'Rửa tiêu chuẩn', status: 'BOOKED', payment: 'UNPAID' },
  { id: 'b-2', day: 'Thứ Hai', slotKey: 'slot-1', customer: 'Đặng Quốc Bảo', plate: '29C-888.88', service: 'Gói cao cấp', status: 'PROCESSING', payment: 'PAID' },
  { id: 'b-3', day: 'Thứ Hai', slotKey: 'slot-3', customer: 'Trần Văn B', plate: '51K-999.99', service: 'Rửa bình thường', status: 'DONE', payment: 'PAID' },
]

export default function CalendarPageSchedule() {
  const [bookings, setBookings] = useState(initialBookings)
  const [currentDayIndex, setCurrentDayIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const selectedDayObj = DAYS_IN_WEEK[currentDayIndex] || DAYS_IN_WEEK[0]

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [targetSlotKey, setTargetSlotKey] = useState('')
  const [editingBookingId, setEditingBookingId] = useState(null)
  const [form] = Form.useForm()

  const handleOpenAddModal = (slotKey) => {
    setModalMode('add')
    setTargetSlotKey(slotKey)
    setEditingBookingId(null)
    form.resetFields()
    form.setFieldsValue({ day: selectedDayObj.name, slotKey: slotKey, status: 'BOOKED', payment: 'UNPAID' })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (bookingItem) => {
    setModalMode('edit')
    setEditingBookingId(bookingItem.id)
    form.resetFields()
    form.setFieldsValue({ ...bookingItem })
    setIsModalOpen(true)
  }

  const handleFormSubmit = (values) => {
    const currentDayBookings = bookings.filter((b) => b.day === values.day && b.slotKey === values.slotKey && b.id !== editingBookingId)
    const currentAllocatedTime = currentDayBookings.reduce((sum, b) => sum + (SERVICE_CONFIG[b.service]?.duration || 0), 0)
    const newServiceTime = SERVICE_CONFIG[values.service]?.duration || 0

    if (currentAllocatedTime + newServiceTime > 120) {
      notification.error({
        message: 'Không thể xếp lịch!',
        description: `Tổng thời gian vượt quá năng suất của 2 nhân viên (Tối đa 120 phút/Slot). Hiện tại đã dùng ${currentAllocatedTime} phút, gói mới yêu cầu thêm ${newServiceTime} phút.`,
      })
      return
    }

    if (modalMode === 'add') {
      setBookings((prev) => [...prev, { id: `b-${Date.now()}`, ...values }])
      notification.success({ message: 'Ghi nhận đơn đặt lịch thành công!' })
    } else {
      setBookings((prev) => prev.map((b) => (b.id === editingBookingId ? { ...b, ...values } : b)))
      notification.success({ message: 'Cập nhật tiến độ đơn hàng thành công!' })
    }
    setIsModalOpen(false)
  }

  const navigateCalendar = (direction) => {
    if (direction === 'prev' && currentDayIndex > 0) {
      setCurrentDayIndex(prev => prev - 1)
    } else if (direction === 'next' && currentDayIndex < DAYS_IN_WEEK.length - 1) {
      setCurrentDayIndex(prev => prev + 1)
    }
  }

  const computedDayData = useMemo(() => {
    const currentDayBookings = bookings.filter((b) => b.day === selectedDayObj.name)
    return TEN_SLOTS.map((slot) => {
      const slotBookings = currentDayBookings.filter((b) => b.slotKey === slot.key)
      const totalMinutes = slotBookings.reduce((sum, b) => sum + (SERVICE_CONFIG[b.service]?.duration || 0), 0)
      return { 
        ...slot, 
        bookingsList: slotBookings, 
        usedMinutes: totalMinutes,
        isFull: totalMinutes >= 120
      }
    })
  }, [bookings, selectedDayObj.name])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: isMobile ? '12px' : '40px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', fontFamily: 'sans-serif' }}>
      
      <div style={{ width: '100%', maxWidth: isMobile ? '100%' : '1400px', position: 'relative', transition: 'all 0.3s' }}>
        
        {/* THANH KHUYÊN SẮT GÁY LỊCH */}
        <div style={{ position: 'absolute', top: '-16px', left: 0, right: 0, height: '24px', backgroundColor: '#92400e', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', display: 'flex', justifyContent: 'space-around', padding: isMobile ? '0 16px' : '0 100px', zIndex: 30 }}>
          {[...Array(isMobile ? 4 : 7)].map((_, i) => (
            <div key={i} style={{ width: '16px', height: '40px', backgroundColor: '#cbd5e1', borderRadius: '9999px', marginTop: '-12px', border: '1px solid #94a3b8', zIndex: 40 }} />
          ))}
        </div>

        {/* NỀN GIẤY LỚP SAU */}
        <div style={{ position: 'absolute', left: '10px', right: '10px', top: '10px', height: '100%', backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', transform: 'translateY(10px)', zIndex: 10 }} />

        {/* TỜ LỊCH CHÍNH KHỔ LỚN */}
        <div style={{ position: 'relative', backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', border: '1px solid #e5e7eb', zIndex: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          {/* HEADER LỊCH BLOC ĐỎ */}
          <div style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: isMobile ? '16px' : '28px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button 
              disabled={currentDayIndex === 0}
              onClick={() => navigateCalendar('prev')}
              icon={<LeftOutlined />}
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', height: '40px', width: '40px' }}
            />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: isMobile ? '10px' : '14px', trackingWidest: '0.15em', fontFamily: 'monospace', textTransform: 'uppercase', color: '#fca5a5', margin: 0, fontWeight: 'bold' }}>HỆ THỐNG ĐIỀU PHỐI & GIÁM SÁT TRẠM RỬA XE</p>
              <h3 style={{ fontSize: isMobile ? '18px' : '32px', fontWeight: 800, color: '#ffffff', margin: '6px 0 0 0' }}>THÁNG 06 • 2026</h3>
            </div>
            <Button 
              disabled={currentDayIndex === DAYS_IN_WEEK.length - 1}
              onClick={() => navigateCalendar('next')}
              icon={<RightOutlined />}
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', height: '40px', width: '40px' }}
            />
          </div>

          {/* SỐ BẢNG NGÀY TRUNG TÂM */}
          <div style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', padding: isMobile ? '20px' : '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ fontSize: isMobile ? '64px' : '120px', fontWeight: 900, color: '#dc2626', lineHeight: 1, fontFamily: 'Georgia, serif' }}>
              {selectedDayObj.dateStr}
            </div>
            <div style={{ fontSize: isMobile ? '14px' : '22px', fontWeight: 'bold', color: '#111827', marginTop: '12px', textTransform: 'uppercase' }}>
              {selectedDayObj.name}
            </div>
            
            <div style={{ position: isMobile ? 'static' : 'absolute', right: '40px', bottom: '24px', textAlign: isMobile ? 'center' : 'right', marginTop: isMobile ? '16px' : '0' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Năng suất nhân sự vận hành:</div>
              <div style={{ fontSize: '15px', color: '#111827', fontWeight: 'bold', marginTop: '4px' }}>
                <UserOutlined /> 2 Nhân viên sẵn sàng (120 phút/Slot)
              </div>
            </div>
          </div>

          {/* NỘI DUNG RUỘT LỊCH DỌC 10 KHUNG GIỜ */}
          <div style={{ padding: isMobile ? '16px' : '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {computedDayData.map((slot) => {
              return (
                <div key={slot.key} style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'flex-start', gap: isMobile ? '12px' : '32px', borderBottom: '2px solid #f3f4f6', paddingBottom: '24px' }}>
                  
                  {/* TIÊU ĐỀ SLOT VÀ THANH ĐO NĂNG SUẤT */}
                  <div style={{ width: isMobile ? '100%' : '180px', flexShrink: 0 }}>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#9ca3af', fontWeight: 'bold' }}>{slot.label}</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '2px 0' }}>{slot.time}</div>
                    
                    <div style={{ marginTop: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>
                        <span>Đã dùng: {slot.usedMinutes}p</span>
                        <span>Max: 120p</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min((slot.usedMinutes / 120) * 100, 100)}%`, height: '100%', backgroundColor: slot.usedMinutes >= 120 ? '#ef4444' : slot.usedMinutes > 60 ? '#f59e0b' : '#10b981', transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  </div>

                  {/* THÔNG TIN XE HOẶC ĐĂNG KÝ TRONG SLOT */}
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : (slot.bookingsList.length >= 2 ? '1fr 1fr' : '1fr'), gap: '16px' }}>
                    
                    {slot.bookingsList.map((item) => (
                      <div key={item.id} style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', gap: '12px' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ padding: '4px 10px', backgroundColor: '#0f172a', color: '#ffffff', fontFamily: 'monospace', fontSize: '13px', fontWeight: 'bold', borderRadius: '6px' }}>
                            {item.plate ? item.plate.toUpperCase() : "CHƯA CÓ BKS"}
                          </span>
                          <Tag color={SERVICE_CONFIG[item.service]?.color || 'default'}>
                            {item.service} ({SERVICE_CONFIG[item.service]?.duration} phút)
                          </Tag>
                        </div>

                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>
                          Khách hàng: <span style={{ color: '#0284c7' }}>{item.customer}</span>
                        </div>

                        <Divider style={{ margin: '4px 0' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <Tag icon={WORK_STATUS[item.status]?.icon} color={WORK_STATUS[item.status]?.color || 'default'}>
                              {WORK_STATUS[item.status]?.label || item.status}
                            </Tag>
                            <Tag color={PAYMENT_STATUS[item.payment]?.color || 'default'}>
                              {PAYMENT_STATUS[item.payment]?.label || item.payment}
                            </Tag>
                          </div>

                          <Button 
                            type="primary" 
                            size="small"
                            ghost
                            icon={<EditOutlined />}
                            onClick={() => handleOpenEditModal(item)}
                            style={{ borderRadius: '6px' }}
                          >
                            Cập nhật
                          </Button>
                        </div>
                      </div>
                    ))}

                    {!slot.isFull && (
                      <button
                        type="button"
                        onClick={() => handleOpenAddModal(slot.key)}
                        style={{ width: '100%', minHeight: '110px', padding: '16px', border: '2px dashed #cbd5e1', borderRadius: '12px', backgroundColor: 'transparent', fontSize: '14px', fontWeight: '600', color: '#64748b', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <PlusOutlined style={{ fontSize: '16px' }} />
                        <span>Thêm xe vào khung giờ</span>
                        <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#94a3b8' }}>Thời gian còn trống: {120 - slot.usedMinutes} phút</span>
                      </button>
                    )}
                  </div>

                </div>
              )
            })}
          </div>

        </div>
      </div>

      {/* POPUP BIỂU MẪU */}
      <Modal
        title={modalMode === 'add' ? 'Thêm đơn đặt lịch trạm' : 'Cập nhật Tiến độ & Thanh toán'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        centered
        destroyOnClose
        width={450}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} style={{ paddingTop: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Form.Item name="day" label="Ngày" rules={[{ required: true }]}>
              <Select disabled={modalMode === 'edit'}>
                {DAYS_IN_WEEK.map(d => <Option key={d.id} value={d.name}>{d.name}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="slotKey" label="Khung giờ" rules={[{ required: true }]}>
              <Select disabled={modalMode === 'edit'}>
                {TEN_SLOTS.map(s => <Option key={s.key} value={s.key}>{s.time}</Option>)}
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="service" label="Dịch vụ lựa chọn" rules={[{ required: true }]}>
            <Select placeholder="Chọn gói rửa">
              <Option value="Rửa bình thường">Rửa bình thường (15 phút)</Option>
              <Option value="Rửa tiêu chuẩn">Rửa tiêu chuẩn (30 phút)</Option>
              <Option value="Gói cao cấp">Gói cao cấp (60 phút / 1 tiếng)</Option>
            </Select>
          </Form.Item>

          <Form.Item name="customer" label="Họ tên khách hàng" rules={[{ required: true, message: 'Nhập tên khách' }]}>
            <Input placeholder="Nhập tên khách hàng..." />
          </Form.Item>

          <Form.Item name="plate" label="Biển số xe (BKS)" help="Có thể bỏ trống lúc đặt lịch hẹn, điền khi xe tới quán">
            <Input style={{ textTransform: 'uppercase' }} placeholder="Ví dụ: 30A-123.45" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Form.Item name="status" label="Tiến độ công việc" rules={[{ required: true }]}>
              <Select>
                <Option value="BOOKED">1. Lịch hẹn đặt trước</Option>
                <Option value="ARRIVED">2. Xe đã đến quán</Option>
                <Option value="PROCESSING">3. Đang làm việc</Option>
                <Option value="DONE">4. Làm việc xong</Option>
              </Select>
            </Form.Item>

            <Form.Item name="payment" label="Trạng thái thanh toán" rules={[{ required: true }]}>
              <Select>
                <Option value="UNPAID">Chưa thanh toán</Option>
                <Option value="PAID">Đã thanh toán</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}