import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import StepIndicator from '../../../components/ui/StepIndicator';
import BookingSummaryCard from '../../../components/booking/BookingSummaryCard';
import DateStrip from '../../../components/booking/DateStrip';
import TimeSlotGrid from '../../../components/booking/TimeSlotGrid';
import useBookingStore from '../../../store/bookingStore';
import { ArrowLeft } from 'lucide-react';

export default function BookingStep2DateTime() {
  const navigate = useNavigate();
  const { selectedService, selectedDate, selectedTime, setDateTime } = useBookingStore();

  useEffect(() => {
    // Redirect back to step 1 if no service is selected
    if (!selectedService) {
      navigate('/booking');
    }
  }, [selectedService, navigate]);

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      navigate('/booking/confirm');
    }
  };

  const handleBack = () => {
    navigate('/booking');
  };

  if (!selectedService) return null;

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
          <p className="text-text-secondary text-center">Vui lòng chọn ngày và giờ bạn muốn mang xe đến.</p>
        </div>

        <StepIndicator currentStep={2} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Left Column: Date & Time Selection */}
          <div className="lg:col-span-2 space-y-10">
            {/* Date Selection */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="font-heading text-2xl font-bold text-text-primary">Chọn ngày</h2>
                <span className="text-sm text-gold-500 font-medium bg-gold-500/10 px-3 py-1 rounded-full">
                  Thẻ Member (Tối đa 7 ngày tới)
                </span>
              </div>
              <DateStrip 
                selectedDate={selectedDate} 
                onSelectDate={(date) => setDateTime(date, null)} // Reset time when date changes
                maxDays={7}
              />
            </div>

            {/* Time Selection */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">Chọn giờ</h2>
              <TimeSlotGrid 
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectTime={(time) => setDateTime(selectedDate, time)}
                duration={selectedService.duration}
              />
              
              {/* Legend */}
              <div className="flex items-center gap-6 mt-6 justify-center text-sm text-text-muted">
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
              </div>
            </div>
          </div>

          {/* Right Column: Booking Summary */}
          <div className="lg:col-span-1 lg:mt-[56px]">
            <BookingSummaryCard 
              onNext={handleNext}
              canProceed={!!(selectedDate && selectedTime)}
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
