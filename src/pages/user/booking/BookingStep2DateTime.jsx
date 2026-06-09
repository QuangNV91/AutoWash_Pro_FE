import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import StepIndicator from '../../../components/ui/StepIndicator';
import BookingSummaryCard from '../../../components/booking/BookingSummaryCard';
import DateStrip from '../../../components/booking/DateStrip';
import TimeSlotGrid from '../../../components/booking/TimeSlotGrid';
import useBookingStore from '../../../store/bookingStore';
import { getAvailableSlots } from '../../../services/bookingService';
import { ArrowLeft, Car } from 'lucide-react';

export default function BookingStep2DateTime() {
  const navigate = useNavigate();
  const {
    bookingItems,
    selectedDate,
    setDate,
    updateItem,
    setItemSlots,
    setItemSlotsLoading,
    getMaxDays,
    getConflictingSlots,
    isStep2Valid,
    userTier,
  } = useBookingStore();

  const maxDays = getMaxDays();

  // Tính validity inline
  const step2Valid = !!selectedDate && bookingItems.every(item => !!item.selectedTime);

  // Redirect nếu chưa có dữ liệu bước 1
  useEffect(() => {
    const hasValidItems = bookingItems.length > 0 && bookingItems.every(item => item.service);
    if (!hasValidItems) {
      navigate('/booking');
    }
  }, [bookingItems, navigate]);

  // Gọi API lấy slot khi chọn ngày
  const fetchSlotsForAllItems = useCallback(async (date) => {
    if (!date) return;

    for (const item of bookingItems) {
      if (!item.service) continue;
      
      setItemSlotsLoading(item.id, true);
      
      try {
        const slots = await getAvailableSlots(date, item.service.id);
        setItemSlots(item.id, slots, false, null);
      } catch (err) {
        setItemSlots(item.id, [], false, 'Không thể tải khung giờ. Vui lòng thử lại.');
      }
    }
  }, [bookingItems, setItemSlots, setItemSlotsLoading]);

  // Fetch slots khi ngày thay đổi
  useEffect(() => {
    if (selectedDate) {
      fetchSlotsForAllItems(selectedDate);
    }
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateSelect = (date) => {
    setDate(date); // Sẽ reset tất cả slots và selectedTime
  };

  const handleTimeSelect = (itemId, time) => {
    const item = bookingItems.find(i => i.id === itemId);
    const newTime = item.selectedTime === time ? null : time;
    updateItem(itemId, { selectedTime: newTime });
  };

  const handleNext = () => {
    if (step2Valid) {
      navigate('/booking/confirm');
    }
  };

  const handleBack = () => {
    navigate('/booking');
  };

  // Tier labels
  const tierLabels = { MEMBER: 'Thành viên', SILVER: 'Bạc', GOLD: 'Vàng', PLATINUM: 'Bạch kim' };

  // Check nếu không có service nào
  if (bookingItems.length === 0 || !bookingItems[0].service) return null;

  return (
    <PageWrapper title="Chọn thời gian">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 relative">
          <button 
            onClick={handleBack}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-dark-800 hover:bg-dark-700 text-text-secondary transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-heading text-4xl font-bold text-text-primary text-center mb-2">Đặt lịch dịch vụ</h1>
          <p className="text-text-secondary text-center">Vui lòng chọn ngày và giờ cho từng xe.</p>
        </div>

        <StepIndicator currentStep={2} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Left Column: Date & Time Selection */}
          <div className="lg:col-span-2 space-y-10">
            {/* Date Selection — chung cho tất cả xe */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="font-heading text-2xl font-bold text-text-primary">Chọn ngày</h2>
                <span className="text-sm text-gold-500 font-medium bg-gold-500/10 px-3 py-1 rounded-full">
                  Hạng {tierLabels[userTier]} (Tối đa {maxDays} ngày tới)
                </span>
              </div>
              <DateStrip 
                selectedDate={selectedDate} 
                onSelectDate={handleDateSelect}
                maxDays={maxDays}
              />
            </div>

            {/* Time Selection — riêng cho từng xe */}
            {bookingItems.map((item, index) => {
              const conflictSlots = getConflictingSlots(item.id);
              
              return (
                <div key={item.id} className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
                  {/* Header xe */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500">
                      <Car size={20} />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-text-primary">
                        Xe {index + 1}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {item.service.name} — {item.service.duration_minutes ?? item.service.duration} phút
                      </p>
                    </div>
                    {item.selectedTime && (
                      <span className="ml-auto text-sm font-semibold text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full">
                        {item.selectedTime}
                      </span>
                    )}
                  </div>

                  {/* Slot Grid */}
                  <TimeSlotGrid
                    slots={item.availableSlots}
                    selectedTime={item.selectedTime}
                    onSelectTime={(time) => handleTimeSelect(item.id, time)}
                    conflictSlots={conflictSlots}
                    loading={item.slotsLoading}
                    error={item.slotsError}
                    hasDate={!!selectedDate}
                  />
                </div>
              );
            })}

            {/* Legend */}
            {selectedDate && (
              <div className="flex flex-wrap items-center gap-6 justify-center text-sm text-text-muted">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-dark-800 border border-dark-700"></div>
                  <span>Còn trống</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gold-500/20 border border-gold-500"></div>
                  <span className="text-gold-500">Đang chọn</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-dark-800 opacity-50 border border-dark-700"></div>
                  <span>Hết chỗ</span>
                </div>
                {bookingItems.length > 1 && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-amber-900/10 border border-amber-900/30"></div>
                    <span className="text-amber-400/60">Trùng xe khác</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Booking Summary */}
          <div className="lg:col-span-1 lg:mt-[56px]">
            <BookingSummaryCard 
              onNext={handleNext}
              canProceed={step2Valid}
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
