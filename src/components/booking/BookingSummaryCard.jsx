import React from 'react';
import { Calendar, Clock, Car } from 'lucide-react';
import useBookingStore from '../../store/bookingStore';

export default function BookingSummaryCard({ onNext, canProceed = true }) {
  const { selectedService, selectedDate, selectedTime, vehicleType } = useBookingStore();

  if (!selectedService && !selectedDate) {
    return (
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center">
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
        <h3 className="font-heading font-bold text-lg text-text-primary">Thông tin đặt lịch</h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Service Details */}
        {selectedService && (
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-2 font-semibold">Dịch vụ</p>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-text-primary text-lg">{selectedService.name}</p>
                <p className="text-sm text-text-secondary">{selectedService.duration} phút</p>
              </div>
              <p className="font-bold text-gold-400">
                {selectedService.price.toLocaleString('vi-VN')}đ
              </p>
            </div>
          </div>
        )}

        {/* Date & Time */}
        {(selectedDate || selectedTime) && (
          <div className="border-t border-dark-800 pt-6">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-3 font-semibold">Thời gian</p>
            <div className="space-y-3">
              {selectedDate && (
                <div className="flex items-center gap-3 text-text-secondary">
                  <div className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center text-gold-500">
                    <Calendar size={16} />
                  </div>
                  <span>{selectedDate}</span>
                </div>
              )}
              {selectedTime && (
                <div className="flex items-center gap-3 text-text-secondary">
                  <div className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center text-gold-500">
                    <Clock size={16} />
                  </div>
                  <span>{selectedTime}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vehicle Info */}
        {vehicleType && (
          <div className="border-t border-dark-800 pt-6">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-2 font-semibold">Loại xe</p>
            <p className="font-bold text-lg text-text-primary">
              {vehicleType}
            </p>
          </div>
        )}
      </div>

      {/* Total - shown at bottom if service is selected */}
      {selectedService && (
        <div className="bg-gold-500/10 px-6 py-5 border-t border-gold-500/20">
          <div className="space-y-3 mb-5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary">Tạm tính:</span>
              <span className="font-semibold text-text-primary">
                {selectedService.price.toLocaleString('vi-VN')}đ
              </span>
            </div>
            
            {/* Mock discount for UI (e.g., Silver Tier 5%) */}
            <div className="flex justify-between items-center text-sm text-green-400">
              <span>Chiết khấu hạng thẻ (5%):</span>
              <span className="font-semibold">
                -{(selectedService.price * 0.05).toLocaleString('vi-VN')}đ
              </span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gold-500/20">
              <span className="font-bold text-text-primary">Tổng cộng:</span>
              <span className="text-2xl font-bold text-gold-400">
                {(selectedService.price * 0.95).toLocaleString('vi-VN')}đ
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
