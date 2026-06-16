import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Divider, message } from 'antd'; // Đã gỡ bỏ List ở đây
import { CheckCircleOutlined, LeftOutlined, PlusOutlined, CarOutlined } from '@ant-design/icons';
// import api from '../../services/api';
import ExtraCostModal from '../../components/staff/ExtraCostModal';

export default function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  
  const [taskDetail, setTaskDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
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
          status: 'processing',
          extraCosts: [
            { id: 1, name: 'Tẩy ố kính lái', price: 300000 },
          ]
        });
        setLoading(false);
      }, 500);
    };
    fetchTaskDetail();
  }, [taskId]);

  const handleCheckout = () => {
    setSubmitting(true);
    setTimeout(() => {
      message.success(`Đã hoàn thành và xuất hóa đơn cho xe ${taskDetail.licensePlate}`);
      setSubmitting(false);
      navigate('/staff/dashboard');
    }, 1000);
  };

  const handleAddExtraCost = (values) => {
    const newCost = { id: Date.now(), name: values.name, price: values.price };
    setTaskDetail(prev => ({ ...prev, extraCosts: [...prev.extraCosts, newCost] }));
    setIsModalVisible(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-xl text-gray-500 animate-pulse">Đang tải dữ liệu...</div></div>;
  if (!taskDetail) return <div className="p-6 text-center text-red-500">Không tìm thấy thông tin xe!</div>;

  const totalExtra = taskDetail.extraCosts.reduce((sum, item) => sum + item.price, 0);
  const totalAmount = taskDetail.basePrice + totalExtra;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Nút Back */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-yellow-600 font-medium transition-colors mb-6"
        >
          <LeftOutlined className="mr-2" /> Quay lại bảng điều khiển
        </button>

        {/* Khung Hóa đơn / Chi tiết chính */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          
          {/* Header của Khung */}
          <div className="bg-gray-900 px-8 py-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 text-xl">
                <CarOutlined />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white tracking-wider">{taskDetail.licensePlate}</h2>
                <span className="text-yellow-500 text-sm">Đang xử lý dịch vụ</span>
              </div>
            </div>
          </div>

          {/* Nội dung chi tiết */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-sm text-gray-400 mb-1">Khách hàng</p>
                <p className="text-lg font-semibold text-gray-800">{taskDetail.customerName} <span className="text-sm font-normal text-gray-500 ml-2">({taskDetail.phone})</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Thời gian đặt</p>
                <p className="text-lg font-medium text-gray-800">{taskDetail.bookingTime}</p>
              </div>
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Gói dịch vụ chính</p>
                  <p className="text-xl font-bold text-blue-900">{taskDetail.serviceName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-1">Giá gốc</p>
                  <p className="text-xl font-bold text-gray-800">{taskDetail.basePrice.toLocaleString('vi-VN')} đ</p>
                </div>
              </div>
            </div>

            <Divider className="border-gray-200" />
            
            {/* Khu vực phụ phí */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-700">Vật tư / Dịch vụ phát sinh</h3>
                <Button 
                  type="dashed" 
                  icon={<PlusOutlined />} 
                  onClick={() => setIsModalVisible(true)}
                  className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                >
                  Thêm phụ phí
                </Button>
              </div>
              
              {/* Danh sách phụ phí code bằng thẻ div thuần (thay cho List cũ) */}
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mt-4">
                {taskDetail.extraCosts && taskDetail.extraCosts.length > 0 ? (
                  taskDetail.extraCosts.map((item, index) => (
                    <div 
                      key={item.id || index} 
                      className="px-4 py-3 hover:bg-gray-50 transition-colors flex justify-between border-b border-gray-100 last:border-0"
                    >
                      <span className="font-medium text-gray-600">{item.name}</span>
                      <span className="font-semibold text-gray-800">{item.price.toLocaleString('vi-VN')} đ</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-400">
                    Chưa có phụ phí phát sinh
                  </div>
                )}
              </div>
            </div>

            {/* Khu vực Tổng thanh toán & Nút Checkout */}
            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold mb-1">Tổng thanh toán</p>
                <p className="text-4xl font-bold text-red-600">{totalAmount.toLocaleString('vi-VN')} <span className="text-2xl text-red-500">VNĐ</span></p>
              </div>
              
              <Button 
                type="primary" 
                size="large" 
                icon={<CheckCircleOutlined />}
                loading={submitting}
                onClick={handleCheckout}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold h-14 px-8 text-lg rounded-xl shadow-lg shadow-yellow-200 border-none w-full md:w-auto"
              >
                Hoàn thành (Check-out)
              </Button>
            </div>
            
          </div>
        </div>
      </div>

      <ExtraCostModal 
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleAddExtraCost}
      />
    </div>
  );
}