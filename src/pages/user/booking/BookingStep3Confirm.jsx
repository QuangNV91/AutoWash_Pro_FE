import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import StepIndicator from '../../../components/ui/StepIndicator';
import BookingSummaryCard from '../../../components/booking/BookingSummaryCard';
import useBookingStore from '../../../store/bookingStore';
import { ArrowLeft, CarFront, CreditCard, Banknote } from 'lucide-react';

export default function BookingStep3Confirm() {
  const navigate = useNavigate();
  const { 
    selectedService, 
    selectedDate, 
    selectedTime, 
    vehicleType,
    customerNote,
    paymentMethod,
    setBookingDetails,
    resetBooking
  } = useBookingStore();

  useEffect(() => {
    // Redirect back if missing information
    if (!selectedService || !selectedDate || !selectedTime) {
      navigate('/booking');
    }
  }, [selectedService, selectedDate, selectedTime, navigate]);

  const handleNext = () => {
    if (vehicleType.trim() !== '') {
      // Logic for finalizing the booking goes here
      // For now, redirect to success page
      navigate('/booking/success');
    }
  };

  const handleBack = () => {
    navigate('/booking/datetime');
  };

  if (!selectedService) return null;

  return (
    <PageWrapper title="Xác nhận">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 relative">
          <button 
            onClick={handleBack}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-dark-800 hover:bg-dark-700 text-text-secondary transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-heading text-4xl font-bold text-text-primary text-center mb-2">Xác nhận đặt lịch</h1>
          <p className="text-text-secondary text-center">Vui lòng kiểm tra lại thông tin và chọn phương thức thanh toán.</p>
        </div>

        <StepIndicator currentStep={3} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Vehicle Info Form */}
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500">
                  <CarFront size={20} />
                </div>
                <h2 className="font-heading text-2xl font-bold text-text-primary">Thông tin bổ sung</h2>
              </div>
              
              <div className="space-y-6">
                <label className="block">
                  <span className="text-text-secondary font-semibold text-sm mb-2 block">Loại xe / Dòng xe *</span>
                  <input 
                    type="text" 
                    value={vehicleType}
                    onChange={(e) => setBookingDetails({ vehicleType: e.target.value })}
                    placeholder="VD: Mazda 3, Ford Ranger, Mercedes C300..."
                    className="w-full bg-dark-800 border border-dark-600 rounded-xl px-5 py-4 text-text-primary focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-lg placeholder-text-muted"
                  />
                  <span className="text-text-muted text-xs mt-2 block">Giúp chúng tôi chuẩn bị dung dịch và thiết bị phù hợp với xe của bạn.</span>
                </label>

                <label className="block">
                  <span className="text-text-secondary font-semibold text-sm mb-2 block">Ghi chú thêm (Không bắt buộc)</span>
                  <textarea 
                    value={customerNote || ''}
                    onChange={(e) => setBookingDetails({ customerNote: e.target.value })}
                    placeholder="VD: Xe mới sơn, cẩn thận mâm xe, rửa kỹ khoang máy..."
                    rows={3}
                    className="w-full bg-dark-800 border border-dark-600 rounded-xl px-5 py-4 text-text-primary focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors placeholder-text-muted resize-none"
                  />
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500">
                  <CreditCard size={20} />
                </div>
                <h2 className="font-heading text-2xl font-bold text-text-primary">Phương thức thanh toán</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pay at Store */}
                <label className={`relative cursor-pointer rounded-xl border-2 p-5 flex flex-col gap-3 transition-all duration-300
                  ${paymentMethod === 'CASH' 
                    ? 'border-gold-500 bg-gold-500/5' 
                    : 'border-dark-700 bg-dark-800 hover:border-dark-500'}`}
                >
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="CASH"
                    checked={paymentMethod === 'CASH'}
                    onChange={(e) => setBookingDetails({ paymentMethod: e.target.value })}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-start">
                    <Banknote className={paymentMethod === 'CASH' ? 'text-gold-500' : 'text-text-muted'} size={28} />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${paymentMethod === 'CASH' ? 'border-gold-500' : 'border-dark-600'}`}>
                      {paymentMethod === 'CASH' && <div className="w-2.5 h-2.5 rounded-full bg-gold-500"></div>}
                    </div>
                  </div>
                  <div>
                    <h3 className={`font-bold ${paymentMethod === 'CASH' ? 'text-gold-500' : 'text-text-primary'}`}>Thanh toán tại cửa hàng</h3>
                    <p className="text-text-secondary text-sm mt-1">Tiền mặt hoặc Quẹt thẻ / Chuyển khoản khi hoàn thành dịch vụ.</p>
                  </div>
                </label>

                {/* Pay Online */}
                <label className={`relative cursor-pointer rounded-xl border-2 p-5 flex flex-col gap-3 transition-all duration-300
                  ${paymentMethod === 'ONLINE' 
                    ? 'border-gold-500 bg-gold-500/5' 
                    : 'border-dark-700 bg-dark-800 hover:border-dark-500'}`}
                >
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="ONLINE"
                    checked={paymentMethod === 'ONLINE'}
                    onChange={(e) => setBookingDetails({ paymentMethod: e.target.value })}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-start">
                    <CreditCard className={paymentMethod === 'ONLINE' ? 'text-gold-500' : 'text-text-muted'} size={28} />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${paymentMethod === 'ONLINE' ? 'border-gold-500' : 'border-dark-600'}`}>
                      {paymentMethod === 'ONLINE' && <div className="w-2.5 h-2.5 rounded-full bg-gold-500"></div>}
                    </div>
                  </div>
                  <div>
                    <h3 className={`font-bold ${paymentMethod === 'ONLINE' ? 'text-gold-500' : 'text-text-primary'}`}>Thanh toán trực tuyến</h3>
                    <p className="text-text-secondary text-sm mt-1">Thanh toán qua VNPay/Momo an toàn và nhanh chóng.</p>
                    <span className="inline-block mt-2 text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                      +10 Điểm thưởng
                    </span>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Booking Summary */}
          <div className="lg:col-span-1 lg:mt-[56px]">
            <BookingSummaryCard 
              onNext={handleNext}
              canProceed={vehicleType.trim().length >= 2} // Basic validation for vehicle type
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
