import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Tag, Divider, message, List } from 'antd';
import { CheckCircleOutlined, LeftOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../services/api';
// Import Component Modal thêm phụ phí
import ExtraCostModal from '../../components/staff/ExtraCostModal';

export default function TaskDetail() {
  const { taskId } = useParams(); // Lấy ID xe từ URL
  const navigate = useNavigate();
  
  // State quản lý dữ liệu và trạng thái loading
  const [taskDetail, setTaskDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // State quản lý việc hiển thị Modal phụ phí
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Giả lập lấy chi tiết xe từ API dựa vào taskId
    const fetchTaskDetail = () => {
      setLoading(true);
      setTimeout(() => {
        setTaskDetail({
          id: taskId,
          licensePlate: '30F-987.65',
          customerName: 'Nguyễn Văn A',
          phone: '0901234567',
          serviceName: 'Phủ Ceramic gói VIP',
          bookingTime: '08:30 - 11:00',
          basePrice: 1500000,
          status: 'processing', // pending, processing, completed
          extraCosts: [
            { id: 1, name: 'Tẩy ố kính lái', price: 300000 },
          ]
        });
        setLoading(false);
      }, 500);
    };
    fetchTaskDetail();
  }, [taskId]);

  // Hàm xử lý xuất hóa đơn
  const handleCheckout = () => {
    setSubmitting(true);
    // Giả lập API Call (PATCH) lên server để hoàn thành dịch vụ
    setTimeout(() => {
      message.success(`Đã hoàn thành và xuất hóa đơn cho xe ${taskDetail.licensePlate}`);
      setSubmitting(false);
      navigate('/staff/dashboard'); // Quay lại màn hình chính sau khi check-out
    }, 1000);
  };

  // Hàm xử lý nhận dữ liệu từ Modal và cập nhật vào State
  const handleAddExtraCost = (values) => {
    const newCost = {
      id: Date.now(), // Sinh ID tạm thời
      name: values.name,
      price: values.price
    };
    
    // Cập nhật lại mảng phụ phí trong state
    setTaskDetail(prev => ({
      ...prev,
      extraCosts: [...prev.extraCosts, newCost]
    }));
    
    setIsModalVisible(false); // Đóng modal
    message.success('Đã thêm phụ phí thành công!');
  };

  if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;
  if (!taskDetail) return <div className="p-6">Không tìm thấy thông tin xe!</div>;

  // Tự động tính lại tổng tiền mỗi khi taskDetail.extraCosts thay đổi
  const totalExtra = taskDetail.extraCosts.reduce((sum, item) => sum + item.price, 0);
  const totalAmount = taskDetail.basePrice + totalExtra;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Button 
        type="link" 
        icon={<LeftOutlined />} 
        onClick={() => navigate(-1)}
        className="mb-4 pl-0"
      >
        Quay lại danh sách
      </Button>

      <Card bordered={false} className="shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Chi tiết dịch vụ: {taskDetail.licensePlate}</h2>
          <Tag color="processing" className="text-sm px-3 py-1">Đang xử lý</Tag>
        </div>

        <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Khách hàng">{taskDetail.customerName}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{taskDetail.phone}</Descriptions.Item>
          <Descriptions.Item label="Gói dịch vụ chính">
            <span className="font-semibold">{taskDetail.serviceName}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian đặt">{taskDetail.bookingTime}</Descriptions.Item>
          <Descriptions.Item label="Giá gốc">
            {taskDetail.basePrice.toLocaleString('vi-VN')} VNĐ
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Vật tư / Dịch vụ phát sinh</Divider>
        
        <List
          size="small"
          bordered
          dataSource={taskDetail.extraCosts}
          renderItem={item => (
            <List.Item className="flex justify-between hover:bg-gray-50">
              <span>{item.name}</span>
              <span className="font-semibold">{item.price.toLocaleString('vi-VN')} VNĐ</span>
            </List.Item>
          )}
          footer={
            <div className="text-right">
              <Button 
                type="dashed" 
                icon={<PlusOutlined />} 
                size="small"
                onClick={() => setIsModalVisible(true)} // Mở Modal khi click
              >
                Thêm phụ phí
              </Button>
            </div>
          }
        />

        <Divider />

        <div className="flex flex-col sm:flex-row justify-end items-end sm:items-center gap-6">
          <div className="text-right">
            <span className="text-gray-500 mr-2">Tổng thanh toán:</span>
            <span className="text-2xl font-bold text-red-600">
              {totalAmount.toLocaleString('vi-VN')} VNĐ
            </span>
          </div>
          <Button 
            type="primary" 
            size="large" 
            icon={<CheckCircleOutlined />}
            loading={submitting}
            onClick={handleCheckout}
          >
            Hoàn thành (Check-out)
          </Button>
        </div>
      </Card>

      {/* Nhúng Component Modal vào cuối trang */}
      <ExtraCostModal 
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleAddExtraCost}
      />
    </div>
  );
}