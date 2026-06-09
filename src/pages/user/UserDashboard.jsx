import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import { User, Calendar, History, Star, Settings, LogOut, Car, Clock, MapPin, ChevronRight, CheckCircle2, Clock3 } from 'lucide-react';

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
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [cancelModal, setCancelModal] = useState({ isOpen: false, booking: null, policy: null });

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
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
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

  const confirmCancel = () => {
    const { booking, policy } = cancelModal;
    
    // Cập nhật state bookings
    setBookings(prev => prev.map(b => 
      b.id === booking.id ? { ...b, status: 'CANCELLED' } : b
    ));

    // Cập nhật điểm user nếu bị phạt
    if (policy.penaltyPoints > 0) {
      setUser(prev => ({ ...prev, points: Math.max(0, prev.points - policy.penaltyPoints) }));
    }

    setCancelModal({ isOpen: false, booking: null, policy: null });
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
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gold-500/10 border-2 border-gold-500/20 flex items-center justify-center text-gold-500">
                  <User size={32} />
                </div>
                <div>
                  <h2 className="font-bold text-text-primary text-lg">{user.fullName}</h2>
                  <p className="text-text-secondary text-sm">{user.phone}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-dark-800 to-dark-950 border border-dark-700 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 text-dark-800 opacity-50">
                  <Star size={80} />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Hạng thẻ</span>
                    <span className="text-xs text-gold-400 font-bold bg-gold-500/10 px-2 py-0.5 rounded">{user.tier}</span>
                  </div>
                  <div className="text-2xl font-bold text-gold-500 mb-6">{user.points.toLocaleString('vi-VN')} <span className="text-sm font-normal text-text-secondary">Điểm</span></div>
                  
                  {/* Progress Bar Container */}
                  <div className="px-3 mt-2 mb-10">
                    <div className="relative w-full h-8">
                      {/* Background Bar */}
                      <div className="absolute top-1.5 left-0 w-full h-1 bg-dark-950 rounded-full"></div>
                      
                      {/* Active Bar */}
                      <div 
                        className="absolute top-1.5 left-0 h-1 bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-1000"
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
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center bg-dark-800 transition-colors z-10 relative ${
                              isAchieved 
                                ? 'border-gold-400 shadow-[0_0_8px_rgba(201,152,26,0.5)]' 
                                : 'border-dark-700'
                            }`}>
                              {isAchieved && <div className="w-1.5 h-1.5 rounded-full bg-gold-400"></div>}
                            </div>
                            <div className="absolute top-6 w-20 flex justify-center text-center">
                              <span className={`text-[10px] font-bold ${isCurrent ? 'text-gold-400' : isAchieved ? 'text-text-primary' : 'text-dark-600'}`}>
                                {tier.label}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {currentTierIndex < TIERS.length - 1 ? (
                    <p className="text-[10px] text-text-muted text-center mt-2">
                      Cần thêm <span className="text-gold-400">{TIERS[currentTierIndex + 1].points - user.points}</span> điểm để lên hạng {TIERS[currentTierIndex + 1].label}
                    </p>
                  ) : (
                    <p className="text-[10px] text-gold-400 text-center mt-2 font-semibold">
                      Bạn đã đạt hạng cao nhất!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors border-l-2
                  ${activeTab === 'bookings' ? 'bg-dark-800 border-gold-500 text-gold-400' : 'border-transparent text-text-secondary hover:bg-dark-800 hover:text-text-primary'}`}
              >
                <div className="flex items-center gap-3">
                  <Calendar size={18} />
                  <span className="font-semibold">Lịch hẹn của tôi</span>
                </div>
                <ChevronRight size={16} />
              </button>
              
              <button 
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors border-l-2
                  ${activeTab === 'history' ? 'bg-dark-800 border-gold-500 text-gold-400' : 'border-transparent text-text-secondary hover:bg-dark-800 hover:text-text-primary'}`}
              >
                <div className="flex items-center gap-3">
                  <History size={18} />
                  <span className="font-semibold">Lịch sử dịch vụ</span>
                </div>
                <ChevronRight size={16} />
              </button>

              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors border-l-2
                  ${activeTab === 'profile' ? 'bg-dark-800 border-gold-500 text-gold-400' : 'border-transparent text-text-secondary hover:bg-dark-800 hover:text-text-primary'}`}
              >
                <div className="flex items-center gap-3">
                  <Settings size={18} />
                  <span className="font-semibold">Cài đặt tài khoản</span>
                </div>
                <ChevronRight size={16} />
              </button>

              <div className="h-px bg-dark-800 w-full my-2"></div>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-6 py-4 text-left transition-colors text-red-400 hover:bg-dark-800"
              >
                <LogOut size={18} />
                <span className="font-semibold">Đăng xuất</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-text-primary">Lịch hẹn sắp tới</h2>
                    <p className="text-text-secondary mt-1">Quản lý các dịch vụ bạn đã đặt trước.</p>
                  </div>
                  <button 
                    onClick={() => navigate('/booking')}
                    className="hidden sm:block px-6 py-2 bg-gold-500 text-dark-950 font-bold rounded-full hover:bg-gold-400 transition-colors"
                  >
                    Đặt lịch mới
                  </button>
                </div>

                <div className="space-y-4">
                  {bookings.filter(b => b.status === 'PENDING' || b.status === 'WORKING').length === 0 ? (
                    <div className="bg-dark-900 border border-dark-800 rounded-2xl p-12 text-center">
                      <p className="text-text-secondary mb-4">Bạn chưa có lịch hẹn nào sắp tới.</p>
                      <button 
                        onClick={() => navigate('/booking')}
                        className="px-6 py-2 border border-gold-500 text-gold-500 font-bold rounded-full hover:bg-gold-500 hover:text-dark-950 transition-colors"
                      >
                        Đặt lịch ngay
                      </button>
                    </div>
                  ) : bookings.filter(b => b.status === 'PENDING' || b.status === 'WORKING').map(booking => (
                    <div key={booking.id} className="bg-dark-900 border border-dark-800 hover:border-dark-700 rounded-2xl p-6 transition-all">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-xs text-text-muted">{booking.id}</span>
                            <StatusBadge status={booking.status} />
                          </div>
                          <h3 className="font-bold text-lg text-text-primary">{booking.serviceName}</h3>
                          <div className="flex items-center gap-2 mt-1 text-text-secondary">
                            <Car size={14} className="text-gold-500" />
                            <span className="text-sm">{booking.vehicleType}</span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-sm text-text-muted mb-1">Tổng thanh toán</p>
                          <p className="font-bold text-lg text-gold-400">{booking.price.toLocaleString('vi-VN')}đ</p>
                          <p className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded inline-block mt-1">
                            {booking.paymentMethod === 'ONLINE' ? 'Đã thanh toán Online' : 'Thanh toán tại cửa hàng'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-dark-950 rounded-xl p-4 flex flex-col sm:flex-row gap-4 sm:gap-8 border border-dark-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-text-secondary">
                            <Calendar size={18} />
                          </div>
                          <div>
                            <p className="text-xs text-text-muted">Ngày đặt</p>
                            <p className="font-semibold text-text-primary">{booking.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-text-secondary">
                            <Clock size={18} />
                          </div>
                          <div>
                            <p className="text-xs text-text-muted">Thời gian</p>
                            <p className="font-semibold text-text-primary">{booking.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-text-secondary">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <p className="text-xs text-text-muted">Chi nhánh</p>
                            <p className="font-semibold text-text-primary">AutoWash Pro Center</p>
                          </div>
                        </div>
                      </div>
                      
                      {booking.status === 'PENDING' && (
                        <div className="mt-4 flex justify-end gap-3">
                          <button 
                            onClick={() => openCancelModal(booking)}
                            className="px-5 py-2 text-sm font-semibold rounded-lg border border-red-900/30 text-red-400 hover:text-red-300 hover:bg-red-900/10 transition-colors"
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
                  <h2 className="font-heading text-2xl font-bold text-text-primary">Lịch sử dịch vụ</h2>
                  <p className="text-text-secondary mt-1">Danh sách các dịch vụ bạn đã sử dụng trước đây.</p>
                </div>

                <div className="space-y-4">
                  {bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED').map(booking => (
                    <div key={booking.id} className="bg-dark-900 border border-dark-800 rounded-2xl p-6 opacity-75 hover:opacity-100 transition-opacity">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-xs text-text-muted">{booking.id}</span>
                            <StatusBadge status={booking.status} />
                          </div>
                          <h3 className="font-bold text-lg text-text-primary">{booking.serviceName}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={14} className="text-gold-500" />
                              <span>{booking.date} {booking.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Car size={14} className="text-gold-500" />
                              <span>{booking.vehicleType}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-bold text-lg text-gold-400">{booking.price.toLocaleString('vi-VN')}đ</p>
                          {booking.status === 'CANCELLED' && booking.penaltyPoints > 0 && (
                            <p className="text-xs text-red-400 mt-1">Đã trừ {booking.penaltyPoints} điểm</p>
                          )}
                          <button 
                            onClick={() => navigate('/booking')}
                            className="mt-2 text-sm text-gold-500 hover:text-gold-400 font-semibold transition-colors underline"
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
              <div className="bg-dark-900 border border-dark-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-64">
                <Settings size={48} className="text-dark-600 mb-4" />
                <h3 className="font-bold text-xl text-text-primary mb-2">Tính năng đang phát triển</h3>
                <p className="text-text-secondary">Phần cài đặt thông tin cá nhân sẽ sớm ra mắt.</p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModal.isOpen && cancelModal.booking && cancelModal.policy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={() => setCancelModal({ isOpen: false, booking: null, policy: null })}></div>
          <div className="relative bg-dark-900 border border-dark-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-text-primary mb-4 font-heading">Xác nhận hủy lịch</h3>
            
            <div className="bg-dark-950 border border-dark-800 rounded-xl p-4 mb-4">
              <p className="text-sm text-text-secondary mb-1">Dịch vụ: <span className="font-semibold text-text-primary">{cancelModal.booking.serviceName}</span></p>
              <p className="text-sm text-text-secondary">Thời gian: <span className="font-semibold text-gold-400">{cancelModal.booking.date} {cancelModal.booking.time}</span></p>
            </div>

            <div className={`p-4 rounded-xl border mb-6 ${
              cancelModal.policy.type === 'REFUND' 
                ? 'bg-green-900/10 border-green-500/20 text-green-400' 
                : 'bg-red-900/10 border-red-500/20 text-red-400'
            }`}>
              <p className="text-sm font-medium">{cancelModal.policy.message}</p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setCancelModal({ isOpen: false, booking: null, policy: null })}
                className="flex-1 py-2.5 rounded-lg border border-dark-600 text-text-secondary hover:bg-dark-800 transition-colors font-medium"
              >
                Đóng
              </button>
              <button 
                onClick={confirmCancel}
                className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
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
