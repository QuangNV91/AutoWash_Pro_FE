import { useEffect, useCallback } from 'react';
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

  const tierLabels = { MEMBER: 'Thành viên', SILVER: 'Bạc', GOLD: 'Vàng', PLATINUM: 'Kim Cương' };

  if (bookingItems.length === 0 || !bookingItems[0].service) return null;

  return (
    <PageWrapper title="Chọn thời gian">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 relative">
          <button
            onClick={handleBack}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-hero text-4xl font-medium text-white text-center mb-2 tracking-tight">Đặt lịch dịch vụ</h1>
          <p className="text-white/60 text-center">Vui lòng chọn ngày và giờ cho từng xe.</p>
        </div>

        <StepIndicator currentStep={2} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Left Column: Date & Time Selection */}
          <div className="lg:col-span-2 space-y-10">
            {/* Date Selection — chung cho tất cả xe */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="font-hero text-2xl font-medium text-white tracking-tight">Chọn ngày</h2>
                <span className="text-sm text-white/80 font-medium bg-white/10 px-3 py-1 rounded-full border border-white/10">
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
                <div key={item.id} className="bg-neutral-950 border border-white/5 rounded-2xl p-6">
                  {/* Header xe */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
                      <Car size={20} />
                    </div>
                    <div>
                      <h3 className="font-hero text-xl font-medium text-white tracking-tight">
                        Xe {index + 1}
                      </h3>
                      <p className="text-sm text-white/60">
                        {item.service.name} — {item.service.durationMinutes ?? item.service.duration_minutes ?? item.service.duration} phút
                      </p>
                    </div>
                    {item.selectedTime && (
                      <span className="ml-auto text-sm font-medium text-white bg-white/10 px-3 py-1 rounded-full">
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
                    selectedDate={selectedDate}
                  />
                </div>
              );
            })}

            {/* Legend */}
            {selectedDate && (
              <div className="flex flex-wrap items-center gap-6 justify-center text-sm text-white/40">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-transparent border border-white/20"></div>
                  <span>Còn trống</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white border border-white"></div>
                  <span className="text-white">Đang chọn</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white/5 border border-white/10 opacity-50"></div>
                  <span>Hết chỗ</span>
                </div>
                {bookingItems.length > 1 && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white/10 border border-white/20"></div>
                    <span className="text-white/40">Trùng xe khác</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Booking Summary */}
          <div className="lg:col-span-1 lg:mt-[56px] lg:sticky lg:top-28 lg:self-start z-10">
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
