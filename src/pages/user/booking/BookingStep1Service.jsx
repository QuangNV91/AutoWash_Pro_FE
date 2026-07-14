import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import StepIndicator from '../../../components/ui/StepIndicator';
import ServiceCard from '../../../components/booking/ServiceCard';
import BookingSummaryCard from '../../../components/booking/BookingSummaryCard';
import useBookingStore from '../../../store/bookingStore';
import { getServices } from '../../../services/bookingService';
import api from '../../../services/api';
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
  const [licensePlateErrors, setLicensePlateErrors] = useState({});

  // Biển số ô tô VN: 2 chữ số tỉnh + 1-2 chữ cái + gạch ngang + 4-5 chữ số
  // VD hợp lệ: 51A-12345, 30AB-12345, 43H-1234
  // VD không hợp lệ (xe máy): 51B1-123, 29-B12345
  const CAR_PLATE_REGEX = /^[0-9]{2}[A-Z]{1,2}-[0-9]{4,5}$/;

  // Kiểm tra tàton bộ biển số trong booking (format + trùng lập)
  const validateAllPlates = (items) => {
    const newErrors = {};
    const plateCount = {};

    // Đếm số lần xuất hiện mỗi biển số
    items.forEach(item => {
      const plate = item.licensePlate.trim().toUpperCase();
      if (plate) plateCount[plate] = (plateCount[plate] || 0) + 1;
    });

    items.forEach(item => {
      const plate = item.licensePlate.trim().toUpperCase();
      if (!plate) {
        newErrors[item.id] = 'Vui lòng nhập biển số xe';
      } else if (!CAR_PLATE_REGEX.test(plate)) {
        newErrors[item.id] = 'Biển số ô tô không hợp lệ. Ví dụ đúng: 51A-12345, 30AB-12345';
      } else if (plateCount[plate] > 1) {
        // Business rule: không được đặt 2 xe cùng biển số trong 1 booking
        newErrors[item.id] = 'Biển số này đã được sử dụng cho xe khác trong lịch đặt này';
      } else {
        newErrors[item.id] = '';
      }
    });

    setLicensePlateErrors(newErrors);
    return newErrors;
  };

  const validateLicensePlate = (id, value) => {
    // Khi blur một ô, validate lại toàn bộ để phát hiện trùng lập
    const updatedItems = bookingItems.map(item =>
      item.id === id ? { ...item, licensePlate: value } : item
    );
    validateAllPlates(updatedItems);
  };

  const maxVehicles = getMaxVehicles();
  const canAddMore = bookingItems.length < maxVehicles;

  // Tính validity inline (không dùng isStep1Valid vì Zustand get() không trigger re-render)
  const step1Valid = bookingItems.length > 0 && bookingItems.every(
    item => !!item.service &&
            item.licensePlate.trim().length > 0 &&
            CAR_PLATE_REGEX.test(item.licensePlate.trim().toUpperCase()) &&
            !licensePlateErrors[item.id]
  );

  // Fetch user tier context
  useEffect(() => {
    api.get('/api/v1/bookings/context')
      .then(res => {
        if (res.data?.tierName) {
          useBookingStore.getState().setUserTier(res.data.tierName);
        }
      })
      .catch(err => {
        console.error('Error fetching booking context:', err);
      });
  }, []);

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

  const tierLabels = { MEMBER: 'Thành viên', SILVER: 'Bạc', GOLD: 'Vàng', PLATINUM: 'Kim Cương' };

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
                      onClick={() => {
                        removeItem(item.id);
                        // Re-validate sau khi xóa để clear lỗi trùng biển ở các xe còn lại
                        const remaining = bookingItems.filter(i => i.id !== item.id);
                        validateAllPlates(remaining);
                      }}
                      className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Xóa xe này"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Nhập thông tin xe */}
                <div className="mb-6 space-y-4">
                  <span className="text-white/60 font-medium text-sm block">Thông tin xe *</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Biển số xe *"
                        value={item.licensePlate}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          updateItem(item.id, { licensePlate: val });
                          // Validate toàn bộ để phát hiện trùng biển số realtime
                          const updatedItems = bookingItems.map(i =>
                            i.id === item.id ? { ...i, licensePlate: val } : i
                          );
                          validateAllPlates(updatedItems);
                        }}
                        onBlur={(e) => validateLicensePlate(item.id, e.target.value)}
                        maxLength={10}
                        className={`w-full bg-white/5 border ${
                          licensePlateErrors[item.id]
                            ? 'border-red-500/60 focus:border-red-500'
                            : 'border-white/10 focus:border-white/40'
                        } rounded-xl px-4 py-3 text-white focus:outline-none transition-colors placeholder-white/30 text-sm font-mono tracking-wider uppercase`}
                      />
                      {licensePlateErrors[item.id] && (
                        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {licensePlateErrors[item.id]}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Hãng xe (Vd: Toyota)"
                        value={item.brand}
                        onChange={(e) => updateItem(item.id, { brand: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors placeholder-white/30 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Dòng xe (Vd: Camry)"
                        value={item.model}
                        onChange={(e) => updateItem(item.id, { model: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors placeholder-white/30 text-sm"
                      />
                    </div>
                  </div>
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
