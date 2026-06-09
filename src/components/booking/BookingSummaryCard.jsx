import React from 'react';
import { Calendar, Clock, Car, Star } from 'lucide-react';
import useBookingStore, { TIER_DISCOUNTS } from '../../store/bookingStore';

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
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center sticky top-24">
        <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center text-dark-600 mb-4">
          <Car size={32} />
        </div>
        <p className="text-text-muted">Chưa có thông tin đặt lịch.<br/>Vui lòng chọn dịch vụ để bắt đầu.</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden sticky top-24">
      <div className="bg-dark-800 px-6 py-4 border-b border-dark-700">
        <h3 className="font-heading font-bold text-lg text-text-primary">
          Thông tin đặt lịch
        </h3>
        <p className="text-xs text-text-muted mt-1">{bookingItems.length} xe trong đơn</p>
      </div>
      
      <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide">
        {/* Danh sách xe */}
        {bookingItems.map((item, index) => (
          <div key={item.id} className={`${index > 0 ? 'border-t border-dark-800 pt-4' : ''}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-1">
                  Xe {index + 1}
                </p>
                {item.service ? (
                  <>
                    <p className="font-bold text-text-primary truncate">{item.service.name}</p>
                    <p className="text-xs text-text-secondary">
                      {item.service.duration_minutes ?? item.service.duration} phút
                    </p>
                  </>
                ) : (
                  <p className="text-text-muted text-sm italic">Chưa chọn dịch vụ</p>
                )}
              </div>
              {item.service && (
                <p className="font-bold text-gold-400 text-sm whitespace-nowrap">
                  {(item.service.base_price ?? item.service.price).toLocaleString('vi-VN')}đ
                </p>
              )}
            </div>
            
            {/* Giờ đã chọn */}
            {item.selectedTime && (
              <div className="flex items-center gap-2 mt-2 text-xs text-text-secondary">
                <Clock size={12} className="text-gold-500" />
                <span>{item.selectedTime}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Date — nếu đã chọn */}
      {selectedDate && (
        <div className="px-6 pb-4 border-t border-dark-800 pt-4">
          <div className="flex items-center gap-3 text-text-secondary">
            <div className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center text-gold-500">
              <Calendar size={16} />
            </div>
            <div>
              <p className="text-xs text-text-muted">Ngày đặt</p>
              <p className="font-semibold text-text-primary text-sm">{selectedDate}</p>
            </div>
          </div>
        </div>
      )}

      {/* Total */}
      {hasAnyService && (
        <div className="bg-gold-500/10 px-6 py-5 border-t border-gold-500/20">
          <div className="space-y-2.5 mb-5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary">Tạm tính ({bookingItems.filter(i => i.service).length} xe):</span>
              <span className="font-semibold text-text-primary">
                {totalPrice.toLocaleString('vi-VN')}đ
              </span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between items-center text-sm text-green-400">
                <span>Chiết khấu hạng {tierLabels[userTier]} ({discount * 100}%):</span>
                <span className="font-semibold">
                  -{discountAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>
            )}

            {/* Điểm */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary flex items-center gap-1">
                <Star size={14} className="text-gold-400" />
                Điểm nhận được:
              </span>
              <span className="font-semibold text-gold-400">+{totalPoints}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gold-500/20">
              <span className="font-bold text-text-primary">Tổng cộng:</span>
              <span className="text-2xl font-bold text-gold-400">
                {discountedTotal.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>
          
          {onNext && (
            <button
              onClick={onNext}
              disabled={!canProceed}
              className={`w-full py-3.5 font-bold rounded-full transition-all duration-300
                ${canProceed 
                  ? 'bg-gold-500 text-dark-950 hover:bg-gold-400 shadow-[0_0_20px_rgba(201,152,26,0.3)]' 
                  : 'bg-dark-800 text-text-muted cursor-not-allowed border border-dark-600'}
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
