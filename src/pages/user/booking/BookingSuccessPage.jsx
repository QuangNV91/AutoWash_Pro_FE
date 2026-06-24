import { useNavigate, Link } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import useBookingStore from '../../../store/bookingStore';
import { CheckCircle2, Clock, Car, MapPin, Star, Plus } from 'lucide-react';

export default function BookingSuccessPage() {
  const navigate = useNavigate();
  const { 
    bookingItems,
    selectedDate, 
    submitResults,
    paymentMethod,
    getTotalPoints,
    getDiscountedTotal,
    resetCart,
    resetKeepDate,
  } = useBookingStore();

  if (!bookingItems.length || !bookingItems[0].service) return null;

  const successCount = submitResults.filter(r => r.success).length;
  const totalPoints = getTotalPoints();
  const totalPrice = getDiscountedTotal();

  return (
    <PageWrapper title="Đặt lịch thành công">
      <div className="container mx-auto px-4 max-w-3xl pt-10 pb-20">
        <div className="bg-neutral-950 border border-white/5 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/5 blur-[100px] rounded-full"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={48} className="text-green-400" />
            </div>
            
            <h1 className="font-hero text-4xl font-medium text-white mb-4 tracking-tight">Đặt lịch thành công!</h1>
            <p className="text-white/60 mb-10 max-w-md mx-auto">
              Cảm ơn bạn đã tin tưởng AutoWash Pro. 
              {successCount > 1 
                ? ` Đã đặt thành công ${successCount} xe.`
                : ' Dưới đây là thông tin chi tiết về lịch hẹn của bạn.'}
            </p>

            {/* Chi tiết từng xe */}
            <div className="w-full space-y-4 mb-10">
              {bookingItems.map((item, index) => {
                const result = submitResults.find(r => r.itemId === item.id);
                const price = item.service.base_price ?? item.service.price;
                const duration = item.service.duration_minutes ?? item.service.duration;
                const points = item.service.base_points ?? item.service.points;

                return (
                  <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xs uppercase tracking-widest text-white/40 font-medium">
                        Xe {index + 1}
                      </h2>
                      {result && (
                        <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded">
                          #{result.bookingId}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex gap-4">
                        <div className="text-white/40 mt-1"><Car size={20} /></div>
                        <div>
                          <p className="text-white/40 text-sm mb-1">Dịch vụ</p>
                          <p className="text-white font-medium">{item.service.name}</p>
                          <p className="text-white/60 text-sm mt-1">{duration} phút</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="text-white/40 mt-1"><Clock size={20} /></div>
                        <div>
                          <p className="text-white/40 text-sm mb-1">Thời gian</p>
                          <p className="text-white font-medium">{selectedDate}</p>
                          <p className="text-white/60 flex items-center gap-1 mt-1 text-sm">
                            {item.selectedTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tổng kết */}
            <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Tổng xe</p>
                  <p className="text-2xl font-medium text-white">{successCount}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Tổng tiền</p>
                  <p className="text-2xl font-medium text-white">{totalPrice.toLocaleString('vi-VN')}đ</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Điểm nhận</p>
                  <p className="text-2xl font-medium text-white flex items-center justify-center gap-1">
                    <Star size={18} className="text-white/40" /> +{totalPoints}
                  </p>
                </div>
              </div>
              
              {/* Địa điểm */}
              <div className="flex gap-4 mt-6 pt-6 border-t border-white/5">
                <div className="text-white/40 mt-1"><MapPin size={20} /></div>
                <div className="text-left">
                  <p className="text-white/40 text-sm mb-1">Địa điểm</p>
                  <p className="text-white font-medium">AutoWash Pro Center</p>
                  <p className="text-white/60 text-sm mt-1">123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM</p>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="mt-4 pt-4 border-t border-white/5 text-left">
                <p className="text-sm text-white/60 flex items-center gap-2">
                  <span className="text-white/40">Thanh toán:</span> 
                  {paymentMethod === 'ONLINE' ? 'Đã thanh toán Online' : 'Thanh toán tại cửa hàng'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button 
                onClick={() => {
                  navigate('/');
                  setTimeout(() => resetCart(), 100);
                }}
                className="px-8 py-3.5 font-medium rounded-full border border-white/10 text-white/60 hover:bg-white/5 hover:text-white transition-colors text-sm"
              >
                Về trang chủ
              </button>
              <button 
                onClick={() => {
                  navigate('/dashboard');
                  setTimeout(() => resetCart(), 100);
                }}
                className="px-8 py-3.5 font-medium rounded-full bg-white text-black hover:bg-neutral-200 transition-colors text-sm"
              >
                Quản lý lịch hẹn
              </button>
              <Link 
                to="/booking"
                onClick={() => {
                  resetKeepDate();
                }}
                className="px-8 py-3.5 font-medium rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Plus size={16} />
                Đặt lịch xe khác
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
