import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import StepIndicator from '../../../components/ui/StepIndicator';
import BookingSummaryCard from '../../../components/booking/BookingSummaryCard';
import useBookingStore from '../../../store/bookingStore';
import { createBooking, createPaymentSession } from '../../../services/bookingService';
import { ArrowLeft, CreditCard, Banknote, Car, Calendar, Clock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function BookingStep3Confirm() {
  const navigate = useNavigate();
  const {
    bookingItems,
    selectedDate,
    paymentMethod,
    setPaymentMethod,
    isSubmitting,
    setIsSubmitting,
    submitResults,
    setSubmitResults,
    getDiscountedTotal,
    getTotalPoints,
    getDiscount,
    userTier,
  } = useBookingStore();

  const [submitProgress, setSubmitProgress] = useState(0); // 0 → N

  useEffect(() => {
    if (!bookingItems.length || !bookingItems[0].service || !selectedDate || !bookingItems[0].selectedTime) {
      navigate('/booking');
    }
  }, [bookingItems, selectedDate, navigate]);

  const tierLabels = { MEMBER: 'Thành viên', SILVER: 'Bạc', GOLD: 'Vàng', PLATINUM: 'Bạch kim' };
  const discount = getDiscount();

  const handleBack = () => {
    navigate('/booking/datetime');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitResults([]);
    setSubmitProgress(0);

    const results = [];
    const successBookingIds = [];

    // Gọi POST /bookings lần lượt cho từng xe
    for (let i = 0; i < bookingItems.length; i++) {
      const item = bookingItems[i];
      setSubmitProgress(i + 1);

      try {
        const res = await createBooking({
          service_id: item.service.id,
          booking_date: selectedDate,
          start_time: item.selectedTime,
          payment_method: paymentMethod,
        });

        const bookingId = res.data?.booking_id || res.booking_id || `BKG-${Date.now()}`;
        results.push({ itemId: item.id, success: true, bookingId, error: null });
        successBookingIds.push(bookingId);
      } catch (err) {
        const status = err.response?.status;
        let errorMsg = 'Lỗi không xác định';

        if (status === 409) {
          errorMsg = 'Khung giờ này vừa hết chỗ, vui lòng chọn giờ khác';
        } else if (status === 401) {
          navigate('/auth/login');
          return;
        } else if (status === 400) {
          errorMsg = err.response?.data?.message || 'Dữ liệu không hợp lệ';
        } else if (status === 500) {
          errorMsg = 'Hệ thống đang bận, vui lòng thử lại';
        }

        results.push({ itemId: item.id, success: false, bookingId: null, error: errorMsg });
      }
    }

    setSubmitResults(results);

    // Xử lý thanh toán ONLINE
    if (paymentMethod === 'ONLINE' && successBookingIds.length > 0) {
      try {
        const paymentRes = await createPaymentSession(successBookingIds, getDiscountedTotal());
        const vnpayUrl = paymentRes.data?.vnpay_url || paymentRes.vnpay_url;
        if (vnpayUrl) {
          window.location.href = vnpayUrl;
          return;
        }
      } catch (err) {
        console.error('Lỗi tạo payment session:', err);
      }
    }

    setIsSubmitting(false);

    // Nếu tất cả thành công (CASH) → chuyển sang success
    const allSuccess = results.every(r => r.success);
    if (allSuccess) {
      navigate('/booking/success');
    }
    // Nếu partial failure → giữ nguyên trang để user xem kết quả
  };

  if (!bookingItems.length || !bookingItems[0].service) return null;

  return (
    <PageWrapper title="Xác nhận">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 relative">
          <button 
            onClick={handleBack}
            disabled={isSubmitting}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-dark-800 hover:bg-dark-700 text-text-secondary transition-colors disabled:opacity-50"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-heading text-4xl font-bold text-text-primary text-center mb-2">Xác nhận đặt lịch</h1>
          <p className="text-text-secondary text-center">Vui lòng kiểm tra lại thông tin và chọn phương thức thanh toán.</p>
        </div>

        <StepIndicator currentStep={3} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tóm tắt tất cả xe */}
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500">
                  <Car size={20} />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-text-primary">Chi tiết đặt lịch</h2>
                  <p className="text-sm text-text-secondary">
                    {bookingItems.length} xe — Ngày {selectedDate}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {bookingItems.map((item, index) => {
                  const price = item.service.base_price ?? item.service.price;
                  const duration = item.service.duration_minutes ?? item.service.duration;
                  const points = item.service.base_points ?? item.service.points;
                  const result = submitResults.find(r => r.itemId === item.id);

                  return (
                    <div 
                      key={item.id} 
                      className={`bg-dark-800 border rounded-xl p-5 ${
                        result ? (result.success ? 'border-green-500/30' : 'border-red-500/30') : 'border-dark-700'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">
                              Xe {index + 1}
                            </span>

                            {/* Status result */}
                            {result && (
                              result.success ? (
                                <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                                  <CheckCircle2 size={12} /> Thành công
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded">
                                  <AlertCircle size={12} /> Thất bại
                                </span>
                              )
                            )}
                          </div>
                          <h3 className="font-bold text-lg text-text-primary">{item.service.name}</h3>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-text-secondary">
                            <span className="flex items-center gap-1.5">
                              <Clock size={14} className="text-gold-500" />
                              {item.selectedTime} ({duration} phút)
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar size={14} className="text-gold-500" />
                              {selectedDate}
                            </span>
                          </div>
                          {item.customerNote && (
                            <p className="text-xs text-text-muted mt-2 italic">📝 {item.customerNote}</p>
                          )}
                          {result && !result.success && (
                            <p className="text-xs text-red-400 mt-2">{result.error}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gold-400">{price.toLocaleString('vi-VN')}đ</p>
                          <p className="text-xs text-text-muted">+{points} điểm</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Method */}
            {submitResults.length === 0 && (
              <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500">
                    <CreditCard size={20} />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-text-primary">Phương thức thanh toán</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* CASH */}
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
                      onChange={() => setPaymentMethod('CASH')}
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
                      <p className="text-text-secondary text-sm mt-1">Tiền mặt hoặc Quẹt thẻ / Chuyển khoản khi hoàn thành.</p>
                    </div>
                  </label>

                  {/* ONLINE */}
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
                      onChange={() => setPaymentMethod('ONLINE')}
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
                      <p className="text-text-secondary text-sm mt-1">Thanh toán qua VNPay an toàn và nhanh chóng.</p>
                      <span className="inline-block mt-2 text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                        +10 Điểm thưởng / xe
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Ghi chú cho từng xe (collapse) */}
            {submitResults.length === 0 && (
              <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
                <h3 className="font-heading text-lg font-bold text-text-primary mb-4">Ghi chú cho từng xe</h3>
                <div className="space-y-4">
                  {bookingItems.map((item, index) => (
                    <label key={item.id} className="block">
                      <span className="text-text-secondary text-sm mb-1 block">
                        Xe {index + 1}
                      </span>
                      <input
                        type="text"
                        value={item.customerNote || ''}
                        onChange={(e) => {
                          useBookingStore.getState().updateItem(item.id, { customerNote: e.target.value });
                        }}
                        placeholder="VD: Xe mới sơn, rửa kỹ khoang máy..."
                        className="w-full bg-dark-800 border border-dark-600 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-gold-500 transition-colors placeholder-text-muted text-sm"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Summary + Submit */}
          <div className="lg:col-span-1 lg:mt-[56px]">
            <div className="sticky top-24 space-y-4">
              <BookingSummaryCard />

              {/* Submit Button */}
              {submitResults.length === 0 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full py-4 font-bold rounded-full transition-all duration-300 text-lg
                    ${isSubmitting
                      ? 'bg-dark-800 text-text-muted cursor-wait border border-dark-600'
                      : 'bg-gold-500 text-dark-950 hover:bg-gold-400 shadow-[0_0_20px_rgba(201,152,26,0.3)]'}
                  `}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={20} className="animate-spin" />
                      Đang xử lý xe {submitProgress}/{bookingItems.length}...
                    </span>
                  ) : (
                    `Xác nhận đặt ${bookingItems.length} xe`
                  )}
                </button>
              ) : (
                // Partial failure: hiển thị nút thử lại
                submitResults.some(r => !r.success) && (
                  <div className="space-y-3">
                    <p className="text-sm text-red-400 text-center">
                      Một số xe chưa đặt được. Vui lòng kiểm tra và thử lại.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitResults([]);
                        navigate('/booking/datetime');
                      }}
                      className="w-full py-3 font-bold rounded-full border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-dark-950 transition-colors"
                    >
                      Chọn lại giờ cho xe bị lỗi
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
