import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import { User, Calendar, History, Star, Settings, LogOut, Car, Clock, MapPin, ChevronRight, CheckCircle2, Clock3, Loader2 } from 'lucide-react';
import { getBookingHistory, cancelBooking } from '../../services/bookingService';
import toast from 'react-hot-toast';

// MOCK DATA
const MOCK_USER = {
  fullName: 'Khách hàng VIP',
  phone: '0905388789',
  tier: 'SILVER',
  points: 1250,
  nextTierPoints: 2000,
  nextTier: 'GOLD',
};

const MOCK_BOOKINGS = [
  {
    id: 'BKG-10293',
    serviceName: 'Rửa xe chuyên sâu',
    vehicleType: 'Mazda 3',
    date: '2026-06-15',
    time: '09:00',
    status: 'PENDING',
    price: 150000,
    paymentMethod: 'ONLINE',
    paymentStatus: 'PAID',
    createdAt: '2026-06-08T10:30:00Z'
  },
  {
    id: 'BKG-10255',
    serviceName: 'Rửa xe cơ bản',
    vehicleType: 'Honda CRV',
    date: '2026-06-01',
    time: '14:30',
    status: 'COMPLETED',
    price: 40000,
    paymentMethod: 'CASH',
    paymentStatus: 'PAID',
    createdAt: '2026-05-30T16:20:00Z'
  }
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings'); // bookings, history, profile
  const [user, setUser] = useState(MOCK_USER);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState({ isOpen: false, booking: null, policy: null });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const data = await getBookingHistory();
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // DEBUG
  useEffect(() => {
    console.log("Bookings fetched:", bookings);
  }, [bookings]);

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      'PENDING': { color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', text: 'Chờ xác nhận', icon: <Clock3 size={14} /> },
      'WORKING': { color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', text: 'Đang phục vụ', icon: <Clock3 size={14} /> },
      'COMPLETED': { color: 'text-green-400 bg-green-400/10 border-green-400/20', text: 'Đã hoàn thành', icon: <CheckCircle2 size={14} /> },
      'CANCELLED': { color: 'text-red-400 bg-red-400/10 border-red-400/20', text: 'Đã hủy', icon: null },
    };

    const config = statusConfig[status] || statusConfig['PENDING'];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth/login');
  };

  const calculateCancelPolicy = (date, time) => {
    // Giả lập thời gian hiện tại (có thể thay đổi để test)
    const now = new Date();
    const bookingDateTime = new Date(`${date}T${time}:00`);
    const diffHours = (bookingDateTime - now) / (1000 * 60 * 60);

    if (diffHours >= 2) {
      return { type: 'REFUND', refundPercent: 75, penaltyPoints: 0, message: 'Hủy trước 2 tiếng: Hoàn 75% tiền cọc, không phạt điểm.' };
    } else {
      return { type: 'NO_REFUND', refundPercent: 0, penaltyPoints: 10, message: 'Hủy sát giờ (< 2 tiếng): Không hoàn tiền, trừ 10 điểm loyalty.' };
    }
  };

  const openCancelModal = (booking) => {
    const policy = calculateCancelPolicy(booking.date, booking.time);
    setCancelModal({ isOpen: true, booking, policy });
  };

  const confirmCancel = async () => {
    const { booking, policy } = cancelModal;

    try {
      if (booking.bookingId) {
        await cancelBooking(booking.bookingId);
      }
      
      // Cập nhật state bookings
      setBookings(prev => prev.map(b => {
        const isMatch = (b.bookingId && b.bookingId === booking.bookingId) || (!b.bookingId && b.id === booking.id);
        return isMatch ? { ...b, status: 'CANCELLED' } : b;
      }));

      // Cập nhật điểm user nếu bị phạt
      if (policy.penaltyPoints > 0) {
        setUser(prev => ({ ...prev, points: Math.max(0, prev.points - policy.penaltyPoints) }));
      }

      toast.success('Hủy lịch thành công');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi hủy lịch');
    } finally {
      setCancelModal({ isOpen: false, booking: null, policy: null });
    }
  };

  const TIERS = [
    { id: 'MEMBER', label: 'Thành viên', points: 0 },
    { id: 'SILVER', label: 'Bạc', points: 1000 },
    { id: 'GOLD', label: 'Vàng', points: 2000 },
    { id: 'DIAMOND', label: 'Kim Cương', points: 5000 },
  ];

  let currentTierIndex = 0;
  for (let i = 0; i < TIERS.length; i++) {
    if (user.points >= TIERS[i].points) {
      currentTierIndex = i;
    }
  }

  let progressPercent = 100;
  if (currentTierIndex < TIERS.length - 1) {
    const currentTier = TIERS[currentTierIndex];
    const nextTier = TIERS[currentTierIndex + 1];
    const tierProgress = (user.points - currentTier.points) / (nextTier.points - currentTier.points);
    const sectionWidth = 100 / (TIERS.length - 1);
    progressPercent = (currentTierIndex * sectionWidth) + (tierProgress * sectionWidth);
  }

  return (
    <PageWrapper title="Quản lý tài khoản">
      <div className="container mx-auto px-4 max-w-6xl pt-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            {/* User Card */}
            <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <User size={32} />
                </div>
                <div>
                  <h2 className="font-medium text-white text-lg">{user.fullName}</h2>
                  <p className="text-white/60 text-sm">{user.phone}</p>
                </div>
              </div>

              <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 text-white/5">
                  <Star size={80} />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-white/40 uppercase tracking-wider font-medium">Hạng thẻ</span>
                    <span className="text-xs text-white font-medium bg-white/10 px-2 py-0.5 rounded">{user.tier}</span>
                  </div>
                  <div className="text-2xl font-medium text-white mb-6">{user.points.toLocaleString('vi-VN')} <span className="text-sm font-normal text-white/60">Điểm</span></div>

                  {/* Progress Bar Container */}
                  <div className="px-3 mt-2 mb-10">
                    <div className="relative w-full h-8">
                      {/* Background Bar */}
                      <div className="absolute top-1.5 left-0 w-full h-1 bg-white/5 rounded-full"></div>

                      {/* Active Bar */}
                      <div
                        className="absolute top-1.5 left-0 h-1 bg-white rounded-full transition-all duration-1000"
                        style={{ width: `${progressPercent}%` }}
                      ></div>

                      {/* Checkpoints */}
                      {TIERS.map((tier, idx) => {
                        const isAchieved = user.points >= tier.points;
                        const isCurrent = currentTierIndex === idx;
                        const positionPercent = idx * (100 / (TIERS.length - 1));

                        return (
                          <div
                            key={tier.id}
                            className="absolute top-0 flex flex-col items-center"
                            style={{ left: `${positionPercent}%`, transform: 'translateX(-50%)' }}
                          >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors z-10 relative ${isAchieved
                                ? 'bg-white border-white'
                                : 'bg-black border-white/20'
                              }`}>
                              {isAchieved && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                            </div>
                            <div className="absolute top-6 w-20 flex justify-center text-center">
                              <span className={`text-[10px] font-medium ${isCurrent ? 'text-white' : isAchieved ? 'text-white/80' : 'text-white/40'}`}>
                                {tier.label}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {currentTierIndex < TIERS.length - 1 ? (
                    <p className="text-[10px] text-white/40 text-center mt-2">
                      Cần thêm <span className="text-white">{TIERS[currentTierIndex + 1].points - user.points}</span> điểm để lên hạng {TIERS[currentTierIndex + 1].label}
                    </p>
                  ) : (
                    <p className="text-[10px] text-white text-center mt-2 font-medium">
                      Bạn đã đạt hạng cao nhất!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-neutral-950 border border-white/5 rounded-2xl overflow-hidden">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors border-l-2
                  ${activeTab === 'bookings' ? 'bg-white/5 border-white text-white' : 'border-transparent text-white/60 hover:bg-white/5 hover:text-white'}`}
              >
                <div className="flex items-center gap-3">
                  <Calendar size={18} />
                  <span className="font-medium">Lịch hẹn của tôi</span>
                </div>
                <ChevronRight size={16} />
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors border-l-2
                  ${activeTab === 'history' ? 'bg-white/5 border-white text-white' : 'border-transparent text-white/60 hover:bg-white/5 hover:text-white'}`}
              >
                <div className="flex items-center gap-3">
                  <History size={18} />
                  <span className="font-medium">Lịch sử dịch vụ</span>
                </div>
                <ChevronRight size={16} />
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors border-l-2
                  ${activeTab === 'profile' ? 'bg-white/5 border-white text-white' : 'border-transparent text-white/60 hover:bg-white/5 hover:text-white'}`}
              >
                <div className="flex items-center gap-3">
                  <Settings size={18} />
                  <span className="font-medium">Cài đặt tài khoản</span>
                </div>
                <ChevronRight size={16} />
              </button>

              <div className="h-px bg-white/5 w-full my-2"></div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-6 py-4 text-left transition-colors text-red-400 hover:bg-white/5"
              >
                <LogOut size={18} />
                <span className="font-medium">Đăng xuất</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">

            {activeTab === 'bookings' && (
              <div className="space-y-6">
                {/* Debug Dump */}
                {bookings.length > 0 && <div style={{ display: 'none' }} id="debug-bookings">{JSON.stringify(bookings)}</div>}
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h2 className="font-hero text-2xl font-medium text-white tracking-tight">Lịch hẹn sắp tới</h2>
                    <p className="text-white/60 mt-1">Quản lý các dịch vụ bạn đã đặt trước.</p>
                  </div>
                  <button
                    onClick={() => navigate('/booking')}
                    className="hidden sm:block px-6 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-neutral-200 transition-colors"
                  >
                    Đặt lịch mới
                  </button>
                </div>

                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-12 text-white/60">
                      <Loader2 size={32} className="animate-spin mb-4" />
                      <p>Đang tải dữ liệu...</p>
                    </div>
                  ) : bookings.filter(b => b.status === 'PENDING' || b.status === 'WORKING').length === 0 ? (
                    <div className="bg-neutral-950 border border-white/5 rounded-2xl p-12 text-center">
                      <p className="text-white/60 mb-4">Bạn chưa có lịch hẹn nào sắp tới.</p>
                      <button
                        onClick={() => navigate('/booking')}
                        className="px-6 py-2 border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white/10 transition-colors"
                      >
                        Đặt lịch ngay
                      </button>
                    </div>
                  ) : bookings.filter(b => b.status === 'PENDING' || b.status === 'WORKING').map((booking, index) => (
                    <div key={(booking.bookingId || booking.id) + '-' + index} className="bg-neutral-950 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-xs text-white/40">{booking.id}</span>
                            <StatusBadge status={booking.status} />
                          </div>
                          <h3 className="font-medium text-lg text-white">{booking.serviceName}</h3>
                          <div className="flex items-center gap-2 mt-1 text-white/60">
                            <Car size={14} className="text-white/40" />
                            <span className="text-sm">{booking.vehicleType}</span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-sm text-white/40 mb-1">Tổng thanh toán</p>
                          <p className="font-medium text-lg text-white">{booking.price.toLocaleString('vi-VN')}đ</p>
                          <p className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded inline-block mt-1">
                            {booking.paymentMethod === 'ONLINE' ? 'Đã thanh toán Online' : 'Thanh toán tại cửa hàng'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-black rounded-xl p-4 flex flex-col sm:flex-row gap-4 sm:gap-8 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60">
                            <Calendar size={18} />
                          </div>
                          <div>
                            <p className="text-xs text-white/40">Ngày đặt</p>
                            <p className="font-medium text-white">{booking.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60">
                            <Clock size={18} />
                          </div>
                          <div>
                            <p className="text-xs text-white/40">Thời gian</p>
                            <p className="font-medium text-white">{booking.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <p className="text-xs text-white/40">Chi nhánh</p>
                            <p className="font-medium text-white">AutoWash Pro Center</p>
                          </div>
                        </div>
                      </div>

                      {booking.status === 'PENDING' && (
                        <div className="mt-4 flex justify-end gap-3">
                          <button
                            onClick={() => openCancelModal(booking)}
                            className="px-5 py-2 text-sm font-medium rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            Hủy lịch
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="mb-2">
                  <h2 className="font-hero text-2xl font-medium text-white tracking-tight">Lịch sử dịch vụ</h2>
                  <p className="text-white/60 mt-1">Danh sách các dịch vụ bạn đã sử dụng trước đây.</p>
                </div>

                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-12 text-white/60">
                      <Loader2 size={32} className="animate-spin mb-4" />
                      <p>Đang tải dữ liệu...</p>
                    </div>
                  ) : bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED' || b.status === 'PAYMENT_FAILED').map((booking, index) => (
                    <div key={(booking.bookingId || booking.id) + '-' + index} className="bg-neutral-950 border border-white/5 rounded-2xl p-6 opacity-75 hover:opacity-100 transition-opacity">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-xs text-white/40">{booking.id}</span>
                            <StatusBadge status={booking.status} />
                          </div>
                          <h3 className="font-medium text-lg text-white">{booking.serviceName}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={14} className="text-white/40" />
                              <span>{booking.date} {booking.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Car size={14} className="text-white/40" />
                              <span>{booking.vehicleType}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-medium text-lg text-white">{booking.price.toLocaleString('vi-VN')}đ</p>
                          {booking.status === 'CANCELLED' && booking.penaltyPoints > 0 && (
                            <p className="text-xs text-red-400 mt-1">Đã trừ {booking.penaltyPoints} điểm</p>
                          )}
                          <button
                            onClick={() => navigate('/booking')}
                            className="mt-2 text-sm text-white hover:text-white/80 font-medium transition-colors underline"
                          >
                            Đặt lại dịch vụ này
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="font-hero text-2xl font-medium text-white tracking-tight">Cài đặt tài khoản</h2>
                  <p className="text-white/60 mt-1">Quản lý thông tin cá nhân và bảo mật của bạn.</p>
                </div>

                <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-8 border-b border-white/5">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white text-3xl">
                        <User size={40} />
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors">
                        <Settings size={16} />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white mb-1">{user.fullName}</h3>
                      <p className="text-white/60 text-sm">Cập nhật ảnh đại diện và chi tiết cá nhân của bạn ở đây.</p>
                    </div>
                  </div>

                  <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); toast.success('Đã cập nhật thông tin thành công!'); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Họ và tên</label>
                        <input
                          type="text"
                          defaultValue={user.fullName}
                          className="w-full bg-black/50 border border-white/10 focus:border-white/30 focus:outline-none rounded-xl px-4 py-3 text-white text-sm transition-colors"
                          placeholder="Nhập họ và tên"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Số điện thoại</label>
                        <input
                          type="tel"
                          defaultValue={user.phone}
                          className="w-full bg-black/50 border border-white/10 focus:border-white/30 focus:outline-none rounded-xl px-4 py-3 text-white text-sm transition-colors"
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-white/80">Email</label>
                        <input
                          type="email"
                          defaultValue="khachhangvip@gmail.com"
                          className="w-full bg-black/50 border border-white/10 focus:border-white/30 focus:outline-none rounded-xl px-4 py-3 text-white text-sm transition-colors"
                          placeholder="Nhập địa chỉ email"
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
                      <button
                        type="button"
                        className="px-6 py-2.5 rounded-xl border border-white/10 text-white/80 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-sm font-medium transition-colors"
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModal.isOpen && cancelModal.booking && cancelModal.policy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setCancelModal({ isOpen: false, booking: null, policy: null })}></div>
          <div className="relative bg-neutral-950 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-medium text-white mb-4 font-hero tracking-tight">Xác nhận hủy lịch</h3>

            <div className="bg-black border border-white/5 rounded-xl p-4 mb-4">
              <p className="text-sm text-white/60 mb-1">Dịch vụ: <span className="font-medium text-white">{cancelModal.booking.serviceName}</span></p>
              <p className="text-sm text-white/60">Thời gian: <span className="font-medium text-white">{cancelModal.booking.date} {cancelModal.booking.time}</span></p>
            </div>

            <div className={`p-4 rounded-xl border mb-6 ${cancelModal.policy.type === 'REFUND'
                ? 'bg-green-900/10 border-green-500/20 text-green-400'
                : 'bg-red-900/10 border-red-500/20 text-red-400'
              }`}>
              <p className="text-sm font-medium">{cancelModal.policy.message}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCancelModal({ isOpen: false, booking: null, policy: null })}
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-white/60 hover:bg-white/5 hover:text-white transition-colors font-medium text-sm"
              >
                Đóng
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors text-sm"
              >
                Chấp nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
