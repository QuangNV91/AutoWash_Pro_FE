import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import StepIndicator from '../../../components/ui/StepIndicator';
import ServiceCard from '../../../components/booking/ServiceCard';
import BookingSummaryCard from '../../../components/booking/BookingSummaryCard';
import useBookingStore, { TIER_VEHICLE_LIMITS } from '../../../store/bookingStore';
import { getServices } from '../../../services/bookingService';
import { Plus, X, Car, AlertCircle, Crown } from 'lucide-react';

export default function BookingStep1Service() {
  const navigate = useNavigate();
  const {
    bookingItems,
    addItem,
    removeItem,
    updateItem,
    isStep1Valid,
    getMaxVehicles,
    userTier,
  } = useBookingStore();

  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);

  const maxVehicles = getMaxVehicles();
  const canAddMore = bookingItems.length < maxVehicles;

  // Tính validity inline (không dùng isStep1Valid vì Zustand get() không trigger re-render)
  const step1Valid = bookingItems.length > 0 && bookingItems.every(
    item => !!item.service
  );

  // Lấy danh sách dịch vụ từ API
  useEffect(() => {
    let cancelled = false;
    setServicesLoading(true);
    setServicesError(null);

    getServices()
      .then(data => {
        if (!cancelled) {
          setServices(data);
          setServicesLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setServicesError('Không thể tải danh sách dịch vụ. Vui lòng thử lại.');
          setServicesLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  const handleNext = () => {
    if (step1Valid) {
      navigate('/booking/datetime');
    }
  };

  // Tìm tên tier tiếp theo
  const getNextTierName = () => {
    const tiers = ['MEMBER', 'SILVER', 'GOLD', 'PLATINUM'];
    const currentIdx = tiers.indexOf(userTier);
    return currentIdx < tiers.length - 1 ? tiers[currentIdx + 1] : null;
  };

  const tierLabels = { MEMBER: 'Thành viên', SILVER: 'Bạc', GOLD: 'Vàng', PLATINUM: 'Bạch kim' };

  return (
    <PageWrapper title="Chọn dịch vụ">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-text-primary text-center mb-2">Đặt lịch dịch vụ</h1>
          <p className="text-text-secondary text-center">Chọn dịch vụ và thêm xe bạn muốn đặt lịch rửa.</p>
        </div>

        <StepIndicator currentStep={1} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Left Column: Danh sách xe & Chọn dịch vụ */}
          <div className="lg:col-span-2 space-y-8">
            
            {bookingItems.map((item, index) => (
              <div key={item.id} className="bg-dark-900 border border-dark-800 rounded-2xl p-6 relative">
                {/* Header xe */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500">
                      <Car size={20} />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-text-primary">
                        Xe {index + 1}
                      </h3>
                      {item.service && (
                        <p className="text-sm text-gold-400">{item.service.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Nút xóa xe (không cho xóa xe cuối cùng) */}
                  {bookingItems.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 rounded-full bg-red-900/20 border border-red-900/30 flex items-center justify-center text-red-400 hover:bg-red-900/40 transition-colors"
                      title="Xóa xe này"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>



                {/* Chọn dịch vụ */}
                <div>
                  <span className="text-text-secondary font-semibold text-sm mb-4 block">Chọn gói dịch vụ *</span>
                  
                  {servicesLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-52 rounded-2xl bg-dark-800 animate-pulse border border-dark-700"></div>
                      ))}
                    </div>
                  ) : servicesError ? (
                    <div className="text-center py-8 border border-red-900/30 rounded-2xl bg-red-900/5">
                      <AlertCircle className="mx-auto text-red-400 mb-2" size={28} />
                      <p className="text-red-400 text-sm">{servicesError}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {services.map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          isSelected={item.service?.id === service.id}
                          onSelect={(s) => updateItem(item.id, { service: item.service?.id === s.id ? null : s })}
                          compact
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Nút thêm xe */}
            {canAddMore ? (
              <button
                onClick={addItem}
                className="w-full py-4 border-2 border-dashed border-dark-600 rounded-2xl text-text-secondary hover:border-gold-500/40 hover:text-gold-400 transition-all flex items-center justify-center gap-2 group"
              >
                <Plus size={20} className="group-hover:text-gold-400 transition-colors" />
                <span className="font-semibold">Thêm xe khác</span>
                <span className="text-sm text-text-muted ml-2">({bookingItems.length}/{maxVehicles})</span>
              </button>
            ) : (
              <div className="w-full py-4 border-2 border-dashed border-dark-700 rounded-2xl text-center">
                <div className="flex items-center justify-center gap-2 text-text-muted mb-1">
                  <Crown size={16} className="text-gold-500" />
                  <span className="font-semibold">Đã đạt giới hạn {maxVehicles} xe</span>
                </div>
                {getNextTierName() && (
                  <p className="text-xs text-text-muted">
                    Nâng lên hạng <span className="text-gold-400 font-semibold">{tierLabels[getNextTierName()]}</span> để đặt thêm xe!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Booking Summary */}
          <div className="lg:col-span-1 lg:mt-0">
            <BookingSummaryCard
              onNext={handleNext}
              canProceed={step1Valid}
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
