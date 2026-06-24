import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import StepIndicator from '../../../components/ui/StepIndicator';
import ServiceCard from '../../../components/booking/ServiceCard';
import BookingSummaryCard from '../../../components/booking/BookingSummaryCard';
import useBookingStore from '../../../store/bookingStore';
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
          <h1 className="font-hero text-4xl font-medium text-white text-center mb-2 tracking-tight">Đặt lịch dịch vụ</h1>
          <p className="text-white/60 text-center">Chọn dịch vụ và thêm xe bạn muốn đặt lịch rửa.</p>
        </div>

        <StepIndicator currentStep={1} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Left Column: Danh sách xe & Chọn dịch vụ */}
          <div className="lg:col-span-2 space-y-8">
            
            {bookingItems.map((item, index) => (
              <div key={item.id} className="bg-neutral-950 border border-white/5 rounded-2xl p-6 relative">
                {/* Header xe */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
                      <Car size={20} />
                    </div>
                    <div>
                      <h3 className="font-hero text-xl font-medium text-white tracking-tight">
                        Xe {index + 1}
                      </h3>
                      {item.service && (
                        <p className="text-sm text-white/60">{item.service.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Nút xóa xe (không cho xóa xe cuối cùng) */}
                  {bookingItems.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Xóa xe này"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Chọn dịch vụ */}
                <div>
                  <span className="text-white/60 font-medium text-sm mb-4 block">Chọn gói dịch vụ *</span>
                  
                  {servicesLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-52 rounded-2xl bg-white/5 animate-pulse border border-white/10"></div>
                      ))}
                    </div>
                  ) : servicesError ? (
                    <div className="text-center py-8 border border-red-500/20 rounded-2xl bg-red-900/10">
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
                className="w-full py-4 border border-dashed border-white/20 rounded-2xl text-white/60 hover:border-white/40 hover:text-white transition-all flex items-center justify-center gap-2 group bg-white/5"
              >
                <Plus size={20} className="group-hover:text-white transition-colors" />
                <span className="font-medium">Thêm xe khác</span>
                <span className="text-sm text-white/40 ml-2">({bookingItems.length}/{maxVehicles})</span>
              </button>
            ) : (
              <div className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-center bg-white/5">
                <div className="flex items-center justify-center gap-2 text-white/60 mb-1">
                  <Crown size={16} className="text-white/80" />
                  <span className="font-medium">Đã đạt giới hạn {maxVehicles} xe</span>
                </div>
                {getNextTierName() && (
                  <p className="text-xs text-white/40">
                    Nâng lên hạng <span className="text-white font-medium">{tierLabels[getNextTierName()]}</span> để đặt thêm xe!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Booking Summary */}
          <div className="lg:col-span-1 lg:mt-0 lg:sticky lg:top-28 lg:self-start z-10">
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
