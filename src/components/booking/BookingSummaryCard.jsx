import { Calendar, Clock, Car, Star } from 'lucide-react';
import useBookingStore from '../../store/bookingStore';

export default function BookingSummaryCard({ onNext, canProceed = true }) {
  const { 
    bookingItems, 
    selectedDate, 
    paymentMethod,
    userTier,
    getTotalPrice, 
    getTotalPoints,
    getDiscount,
    getDiscountedTotal,
  } = useBookingStore();

  const hasAnyService = bookingItems.some(item => item.service);
  const totalPrice = getTotalPrice();
  const totalPoints = getTotalPoints();
  const discount = getDiscount();
  const discountedTotal = getDiscountedTotal();
  const discountAmount = totalPrice - discountedTotal;

  const tierLabels = { MEMBER: 'Thành viên', SILVER: 'Bạc', GOLD: 'Vàng', PLATINUM: 'Bạch kim' };

  // Empty state
  if (!hasAnyService && !selectedDate) {
    return (
      <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/40 mb-4 border border-white/10">
          <Car size={32} />
        </div>
        <p className="text-white/40">Chưa có thông tin đặt lịch.<br/>Vui lòng chọn dịch vụ để bắt đầu.</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 border border-white/5 rounded-2xl overflow-hidden">
      <div className="bg-white/5 px-6 py-4 border-b border-white/5">
        <h3 className="font-hero font-medium text-lg text-white tracking-tight">
          Thông tin đặt lịch
        </h3>
        <p className="text-xs text-white/40 mt-1">{bookingItems.length} xe trong đơn</p>
      </div>
      
      <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide">
        {/* Danh sách xe */}
        {bookingItems.map((item, index) => (
          <div key={item.id} className={`${index > 0 ? 'border-t border-white/5 pt-4' : ''}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1">
                  Xe {index + 1}
                </p>
                {item.service ? (
                  <>
                    <p className="font-medium text-white truncate">{item.service.name}</p>
                    <p className="text-xs text-white/60">
                      {item.service.durationMinutes ?? item.service.duration_minutes ?? item.service.duration} phút
                    </p>
                  </>
                ) : (
                  <p className="text-white/40 text-sm italic">Chưa chọn dịch vụ</p>
                )}
              </div>
              {item.service && (
                <p className="font-medium text-white text-sm whitespace-nowrap">
                  {(item.service.basePrice ?? item.service.base_price ?? item.service.price).toLocaleString('vi-VN')}đ
                </p>
              )}
            </div>
            
            {/* Giờ đã chọn */}
            {item.selectedTime && (
              <div className="flex items-center gap-2 mt-2 text-xs text-white/60">
                <Clock size={12} className="text-white/40" />
                <span>{item.selectedTime}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Date — nếu đã chọn */}
      {selectedDate && (
        <div className="px-6 pb-4 border-t border-white/5 pt-4">
          <div className="flex items-center gap-3 text-white/60">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
              <Calendar size={16} />
            </div>
            <div>
              <p className="text-xs text-white/40">Ngày đặt</p>
              <p className="font-medium text-white text-sm">{selectedDate}</p>
            </div>
          </div>
        </div>
      )}

      {/* Total */}
      {hasAnyService && (
        <div className="bg-white/5 px-6 py-5 border-t border-white/5">
          <div className="space-y-2.5 mb-5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/60">Tạm tính ({bookingItems.filter(i => i.service).length} xe):</span>
              <span className="font-medium text-white">
                {totalPrice.toLocaleString('vi-VN')}đ
              </span>
            </div>
            
            <div className={`flex justify-between items-center text-sm ${discount > 0 ? 'text-green-400' : 'text-white/60'}`}>
              <span>Chiết khấu hạng {tierLabels[userTier]} ({discount * 100}%):</span>
              <span className="font-medium">
                -{discountAmount.toLocaleString('vi-VN')}đ
              </span>
            </div>

            {/* Điểm */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/60 flex items-center gap-1">
                <Star size={14} className="text-white/40" />
                Điểm nhận được:
              </span>
              <span className="font-medium text-white">+{totalPoints}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-white/10">
              <span className="font-medium text-white">Tổng cộng:</span>
              <span className="text-2xl font-medium text-white">
                {discountedTotal.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>
          
          {onNext && (
            <button
              onClick={onNext}
              disabled={!canProceed}
              className={`w-full py-3.5 font-medium rounded-full transition-all duration-300 text-sm
                ${canProceed 
                  ? 'bg-white text-black hover:bg-neutral-200' 
                  : 'bg-white/5 text-white/40 cursor-not-allowed border border-white/10'}
              `}
            >
              {window.location.pathname === '/booking/confirm' ? 'Xác nhận đặt lịch' : 'Tiếp tục'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
