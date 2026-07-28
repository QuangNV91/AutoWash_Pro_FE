import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import StepIndicator from '../../../components/ui/StepIndicator';
import BookingSummaryCard from '../../../components/booking/BookingSummaryCard';
import useBookingStore from '../../../store/bookingStore';
import useSystemConfigStore from '../../../store/systemConfigStore';
import { checkoutBookings } from '../../../services/bookingService';
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
    getTotalPoints,
    userTier,
  } = useBookingStore();

  const rewardPointsOnlinePayment = useSystemConfigStore(state => state.rewardPointsOnlinePayment);

  const [submitProgress, setSubmitProgress] = useState(0); // 0 → N

  useEffect(() => {
    if (!bookingItems.length || !bookingItems[0].service || !selectedDate || !bookingItems[0].selectedTime) {
      navigate('/booking');
    }
  }, [bookingItems, selectedDate, navigate]);



  const handleBack = () => {
    navigate('/booking/datetime');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitResults([]);
    setSubmitProgress(1);

    try {
      const checkoutPayload = {
        bookingDate: selectedDate,
        paymentMethod: paymentMethod,
        voucherCode: "",
        items: bookingItems.map(item => ({
          serviceId: item.service.id,
          licensePlate: item.licensePlate,
          brand: item.brand || '',
          model: item.model || '',
          startTime: item.selectedTime
        }))
      };

      const res = await checkoutBookings(checkoutPayload);

      if (paymentMethod === 'ONLINE' && res.paymentRedirectUrl) {
        window.location.href = res.paymentRedirectUrl;
        return;
      }

      const results = bookingItems.map(item => ({
        itemId: item.id,
        success: true,
        bookingId: res.transactionRef || 'N/A',
        error: null
      }));
      setSubmitResults(results);

      navigate('/booking/success');

    } catch (err) {
      console.error('Lỗi checkout:', err);
      const status = err.response?.status;
      let errorMsg = err.response?.data?.message || 'Hệ thống đang bận, vui lòng thử lại';

      if (status === 401) {
        navigate('/auth/login');
        return;
      }

      const results = bookingItems.map(item => ({
        itemId: item.id,
        success: false,
        bookingId: null,
        error: errorMsg
      }));
      setSubmitResults(results);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bookingItems.length || !bookingItems[0].service) return null;

  return (
    <PageWrapper title="Xác nhận">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 relative">
          <button
            onClick={handleBack}
            disabled={isSubmitting}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors disabled:opacity-50"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-hero text-4xl font-medium text-white text-center mb-2 tracking-tight">Xác nhận đặt lịch</h1>
          <p className="text-white/60 text-center">Vui lòng kiểm tra lại thông tin và chọn phương thức thanh toán.</p>
        </div>

        <StepIndicator currentStep={3} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Tóm tắt tất cả xe */}
            <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
                  <Car size={20} />
                </div>
                <div>
                  <h2 className="font-hero text-2xl font-medium text-white tracking-tight">Chi tiết đặt lịch</h2>
                  <p className="text-sm text-white/60">
                    {bookingItems.length} xe — Ngày {selectedDate}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {bookingItems.map((item, index) => {
                  const price = item.service.basePrice ?? item.service.base_price ?? item.service.price;
                  const duration = item.service.durationMinutes ?? item.service.duration_minutes ?? item.service.duration;
                  const points = item.service.basePoints ?? item.service.base_points ?? item.service.points;
                  const result = submitResults.find(r => r.itemId === item.id);

                  return (
                    <div
                      key={item.id}
                      className={`bg-white/5 border rounded-xl p-5 ${result ? (result.success ? 'border-green-500/30' : 'border-red-500/30') : 'border-white/10'
                        }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-white/40 font-medium uppercase tracking-wider">
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
                          <h3 className="font-medium text-lg text-white">{item.service.name}</h3>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-white/60">
                            <span className="flex items-center gap-1.5">
                              <Clock size={14} className="text-white/40" />
                              {item.selectedTime} ({duration} phút)
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar size={14} className="text-white/40" />
                              {selectedDate}
                            </span>
                          </div>
                          {item.customerNote && (
                            <p className="text-xs text-white/40 mt-2 italic">📝 {item.customerNote}</p>
                          )}
                          {result && !result.success && (
                            <p className="text-xs text-red-400 mt-2">{result.error}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-lg text-white">{price.toLocaleString('vi-VN')}đ</p>
                          <p className="text-xs text-white/40">+{points} điểm</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Method */}
            {submitResults.length === 0 && (
              <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
                    <CreditCard size={20} />
                  </div>
                  <h2 className="font-hero text-2xl font-medium text-white tracking-tight">Phương thức thanh toán</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* CASH */}
                  <label className={`relative cursor-pointer rounded-xl border p-5 flex flex-col gap-3 transition-all duration-300
                    ${paymentMethod === 'CASH'
                      ? 'border-white bg-white/5'
                      : 'border-white/10 bg-white/5 hover:border-white/30'}`}
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
                      <Banknote className={paymentMethod === 'CASH' ? 'text-white' : 'text-white/40'} size={28} />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center
                        ${paymentMethod === 'CASH' ? 'border-white' : 'border-white/20'}`}>
                        {paymentMethod === 'CASH' && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                      </div>
                    </div>
                    <div>
                      <h3 className={`font-medium ${paymentMethod === 'CASH' ? 'text-white' : 'text-white/80'}`}>Thanh toán tại cửa hàng</h3>
                      <p className="text-white/60 text-sm mt-1">Tiền mặt hoặc Quẹt thẻ / Chuyển khoản khi hoàn thành.</p>
                    </div>
                  </label>

                  {/* ONLINE */}
                  <label className={`relative cursor-pointer rounded-xl border p-5 flex flex-col gap-3 transition-all duration-300
                    ${paymentMethod === 'ONLINE'
                      ? 'border-white bg-white/5'
                      : 'border-white/10 bg-white/5 hover:border-white/30'}`}
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
                      <CreditCard className={paymentMethod === 'ONLINE' ? 'text-white' : 'text-white/40'} size={28} />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center
                        ${paymentMethod === 'ONLINE' ? 'border-white' : 'border-white/20'}`}>
                        {paymentMethod === 'ONLINE' && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                      </div>
                    </div>
                    <div>
                      <h3 className={`font-medium ${paymentMethod === 'ONLINE' ? 'text-white' : 'text-white/80'}`}>Thanh toán trực tuyến</h3>
                      <p className="text-white/60 text-sm mt-1">Thanh toán qua VNPay an toàn và nhanh chóng.</p>
                      <span className="inline-block mt-2 text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded">
                        +{rewardPointsOnlinePayment} Điểm thưởng / xe
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Ghi chú cho từng xe (collapse) */}
            {submitResults.length === 0 && (
              <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6">
                <h3 className="font-hero text-lg font-medium text-white mb-4 tracking-tight">Ghi chú cho từng xe</h3>
                <div className="space-y-4">
                  {bookingItems.map((item, index) => (
                    <label key={item.id} className="block">
                      <span className="text-white/60 text-sm mb-1 block">
                        Xe {index + 1}
                      </span>
                      <input
                        type="text"
                        value={item.customerNote || ''}
                        onChange={(e) => {
                          useBookingStore.getState().updateItem(item.id, { customerNote: e.target.value });
                        }}
                        placeholder="VD: Xe mới sơn, rửa kỹ khoang máy..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/40 transition-colors placeholder-white/30 text-sm"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Summary + Submit */}
          <div className="lg:col-span-1 lg:mt-[56px] lg:sticky lg:top-28 lg:self-start z-10">
            <div className="space-y-4">
              <BookingSummaryCard />

              {/* Submit Button */}
              {submitResults.length === 0 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full py-4 font-medium rounded-full transition-all duration-300 text-base
                    ${isSubmitting
                      ? 'bg-white/10 text-white/40 cursor-wait border border-white/10'
                      : 'bg-white text-black hover:bg-neutral-200'}
                  `}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
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
                      className="w-full py-3.5 font-medium rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
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
