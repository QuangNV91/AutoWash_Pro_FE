import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import useBookingStore from '../../../store/bookingStore';
import { CheckCircle2, Calendar, Clock, Car, MapPin } from 'lucide-react';

export default function BookingSuccessPage() {
  const navigate = useNavigate();
  const { 
    selectedService, 
    selectedDate, 
    selectedTime, 
    vehicleType,
    customerNote,
    resetBooking
  } = useBookingStore();

  // If user accesses this page directly without booking data, redirect home
  useEffect(() => {
    if (!selectedService || !selectedDate || !selectedTime) {
      navigate('/');
    }
    
    // Optional: Clean up state when leaving the success page (e.g., on unmount)
    // return () => resetBooking();
  }, [selectedService, selectedDate, selectedTime, navigate]);

  if (!selectedService) return null;

  return (
    <PageWrapper title="Đặt lịch thành công">
      <div className="container mx-auto px-4 max-w-3xl pt-10 pb-20">
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/10 blur-[100px] rounded-full"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={56} className="text-green-500" />
            </div>
            
            <h1 className="font-heading text-4xl font-bold text-text-primary mb-4">Đặt lịch thành công!</h1>
            <p className="text-text-secondary mb-10 max-w-md mx-auto">
              Cảm ơn bạn đã tin tưởng AutoWash Pro. Dưới đây là thông tin chi tiết về lịch hẹn của bạn.
            </p>

            <div className="w-full bg-dark-800 border border-dark-700 rounded-2xl p-6 md:p-8 text-left mb-10">
              <h2 className="text-sm uppercase tracking-widest text-text-muted font-semibold mb-6 border-b border-dark-600 pb-3">Chi tiết lịch hẹn</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="text-gold-500 mt-1"><Car size={20} /></div>
                  <div>
                    <p className="text-text-muted text-sm mb-1">Dịch vụ & Xe</p>
                    <p className="text-text-primary font-bold">{selectedService.name}</p>
                    <p className="text-text-secondary mt-1 bg-dark-900 inline-block px-3 py-1 rounded border border-dark-600 font-semibold">{vehicleType}</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="text-gold-500 mt-1"><Calendar size={20} /></div>
                  <div>
                    <p className="text-text-muted text-sm mb-1">Thời gian</p>
                    <p className="text-text-primary font-bold">{selectedDate}</p>
                    <p className="text-text-secondary flex items-center gap-1 mt-1">
                      <Clock size={14} /> {selectedTime}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 md:col-span-2 mt-2 pt-6 border-t border-dark-700">
                  <div className="text-gold-500 mt-1"><MapPin size={20} /></div>
                  <div>
                    <p className="text-text-muted text-sm mb-1">Địa điểm</p>
                    <p className="text-text-primary font-bold">AutoWash Pro Center</p>
                    <p className="text-text-secondary mt-1">123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button 
                onClick={() => {
                  resetBooking();
                  navigate('/');
                }}
                className="px-8 py-3.5 font-bold rounded-full border border-dark-600 text-text-secondary hover:bg-dark-800 hover:text-text-primary transition-colors"
              >
                Về trang chủ
              </button>
              <button 
                onClick={() => {
                  resetBooking();
                  navigate('/dashboard');
                }}
                className="px-8 py-3.5 font-bold rounded-full bg-gold-500 text-dark-950 hover:bg-gold-400 transition-colors shadow-[0_0_20px_rgba(201,152,26,0.3)]"
              >
                Xem quản lý lịch hẹn
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
