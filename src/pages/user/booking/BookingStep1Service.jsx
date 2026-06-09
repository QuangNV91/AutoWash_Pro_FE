import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import StepIndicator from '../../../components/ui/StepIndicator';
import ServiceCard from '../../../components/booking/ServiceCard';
import BookingSummaryCard from '../../../components/booking/BookingSummaryCard';
import useBookingStore from '../../../store/bookingStore';

const MOCK_SERVICES = [
  {
    id: 1,
    name: 'Rửa xe cơ bản',
    price: 40000,
    duration: 15,
    points: 40,
    features: [
      'Xịt nước rửa bụi bẩn bề mặt',
      'Phun xà bông bọt tuyết toàn thân xe',
      'Rửa sạch bằng nước áp lực cao',
      'Lau khô bằng khăn microfiber'
    ]
  },
  {
    id: 2,
    name: 'Rửa xe chuyên sâu',
    price: 150000,
    duration: 30,
    points: 150,
    features: [
      'Toàn bộ quy trình gói Cơ bản',
      'Vệ sinh sên xích, tra dầu bôi trơn',
      'Rửa sạch lốc máy, khu vực động cơ',
      'Vệ sinh phanh, vành xe',
      'Lau bóng nhựa, cao su',
      'Kiểm tra áp suất lốp'
    ]
  },
  {
    id: 3,
    name: 'Phủ nano ceramic',
    price: 300000,
    duration: 60,
    points: 300,
    features: [
      'Toàn bộ quy trình gói Chuyên sâu',
      'Đánh bóng bề mặt sơn bằng máy',
      'Tẩy các vết xước nhỏ, ố vàng',
      'Phủ lớp nano ceramic bảo vệ sơn',
      'Xử lý chống bám nước, bụi bẩn',
      'Kiểm tra tổng thể và bàn giao xe'
    ]
  }
];

export default function BookingStep1Service() {
  const navigate = useNavigate();
  const { selectedService, setService } = useBookingStore();

  const handleNext = () => {
    if (selectedService) {
      navigate('/booking/datetime');
    }
  };

  return (
    <PageWrapper title="Chọn dịch vụ">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-text-primary text-center mb-2">Đặt lịch dịch vụ</h1>
          <p className="text-text-secondary text-center">Vui lòng chọn gói dịch vụ phù hợp với nhu cầu của bạn.</p>
        </div>

        <StepIndicator currentStep={1} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Left Column: Service Selection */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">Chọn gói dịch vụ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {MOCK_SERVICES.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isSelected={selectedService?.id === service.id}
                  onSelect={setService}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Booking Summary */}
          <div className="lg:col-span-1 lg:mt-[56px]">
            <BookingSummaryCard 
              onNext={handleNext}
              canProceed={!!selectedService}
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
