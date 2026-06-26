import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Clock, ShieldCheck, PenTool, Award } from 'lucide-react';

// Dữ liệu dịch vụ chi tiết — đồng bộ với bookingService.js
const SERVICE_BLOCKS = [
  {
    id: 1,
    label: 'GÓI CƠ BẢN',
    badgeText: null,
    name: 'Eco Wash',
    subtitle: 'Nhanh gọn, sạch bóng — lý tưởng cho người bận rộn',
    price: '40.000đ',
    duration: '15 phút',
    points: '+40 điểm tích lũy',
    themeColor: 'cyan',
    imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=2069&auto=format&fit=crop',
    direction: 'normal',
    features: [
      'Xịt nước rửa bụi bẩn bề mặt ngoài',
      'Phun xà bông bọt tuyết toàn thân xe',
      'Rửa sạch bằng nước áp lực cao',
      'Lau khô bằng khăn microfiber chuyên dụng',
    ],
  },
  {
    id: 2,
    label: 'GÓI CHUYÊN SÂU',
    badgeText: 'PHỔ BIẾN NHẤT',
    name: 'Premium Care',
    subtitle: 'Dành cho xe đi mưa nhiều, cần rửa kỹ càng',
    price: '150.000đ',
    duration: '30 phút',
    points: '+150 điểm tích lũy',
    themeColor: 'purple',
    imageUrl: '/images/premium_care.png',
    direction: 'reverse',
    features: [
      'Toàn bộ quy trình Eco Wash',
      'Rửa kỹ gầm xe & nội thất bánh xe',
      'Vệ sinh sên xích, tra dầu bôi trơn',
      'Rửa sạch lốc máy & khu vực động cơ',
      'Hút bụi & lau dọn nội thất xe cơ bản',
      'Kiểm tra áp suất lốp tiêu chuẩn',
    ],
  },
  {
    id: 3,
    label: 'GÓI CAO CẤP',
    badgeText: 'KHUYÊN DÙNG',
    name: 'Detailing & Shine',
    subtitle: 'Chăm sóc toàn diện sơn xe, kính & nội thất',
    price: '350.000đ',
    duration: '60 phút',
    points: '+350 điểm tích lũy',
    themeColor: 'emerald',
    imageUrl: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=2070&auto=format&fit=crop',
    direction: 'normal',
    features: [
      'Toàn bộ quy trình Premium Care',
      'Chăm sóc chuyên sâu bề mặt sơn xe',
      'Tẩy ố kính & phủ Nano kính lái chống bám nước',
      'Đánh bóng & xóa xước nhẹ bề mặt sơn',
      'Dưỡng & bảo vệ nội thất da, nhựa cao cấp',
      'Kiểm tra tổng thể và bàn giao xe',
    ],
  },
  {
    id: 4,
    label: 'GÓI SIÊU CẤP',
    badgeText: 'CERAMIC SHIELD',
    name: 'Ceramic Shield',
    subtitle: 'Bảo vệ sơn xe toàn diện — kháng nước, bụi, tia UV',
    price: '800.000đ',
    duration: '120 phút',
    points: '+800 điểm tích lũy',
    themeColor: 'amber',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2069&auto=format&fit=crop',
    direction: 'reverse',
    features: [
      'Toàn bộ quy trình Detailing & Shine',
      'Tẩy sạch nhựa đường & bụi sắt bám sơn',
      'Hiệu chỉnh sơn toàn diện (Multi-stage Paint Correction)',
      'Phủ 2 lớp Ceramic cao cấp — bảo vệ sơn toàn diện',
      'Xử lý kháng nước, kháng bụi, kháng tia UV',
      'Bảo hành lớp phủ Ceramic trong vòng 6 tháng',
    ],
  },
];

// Màu theme theo từng gói
const THEME = {
  cyan: {
    labelClass: 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400',
    badgeClass: 'bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]',
    pointsClass: 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
    dot: 'text-cyan-400',
    btnPrimary: 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]',
    btnSecondary: 'text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/10',
    glowBg: 'bg-cyan-500/10',
    borderGlow: 'border-cyan-500/30',
  },
  purple: {
    labelClass: 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400',
    badgeClass: 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]',
    pointsClass: 'bg-purple-500/20 border border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    dot: 'text-purple-400',
    btnPrimary: 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]',
    btnSecondary: 'text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/10',
    glowBg: 'bg-purple-500/10',
    borderGlow: 'border-purple-500/30',
  },
  emerald: {
    labelClass: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400',
    badgeClass: 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]',
    pointsClass: 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    dot: 'text-emerald-400',
    btnPrimary: 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]',
    btnSecondary: 'text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/10',
    glowBg: 'bg-emerald-500/10',
    borderGlow: 'border-emerald-500/30',
  },
  amber: {
    labelClass: 'bg-amber-500/10 border border-amber-500/20 text-amber-400',
    badgeClass: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.5)]',
    pointsClass: 'bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    dot: 'text-amber-400',
    btnPrimary: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold hover:from-amber-400 hover:to-yellow-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    btnSecondary: 'text-amber-400 border border-amber-500/50 hover:bg-amber-500/10',
    glowBg: 'bg-amber-500/10',
    borderGlow: 'border-amber-500/30',
  },
};

export default function ServicesPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const handleBookingClick = () => {
    navigate(isLoggedIn ? '/booking' : '/auth/login');
  };

  return (
    <div className="min-h-screen font-body text-white/60 bg-black flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* ── HERO ── */}
        <section className="relative py-32 bg-black overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),transparent_50%)]" />
          <div className="absolute top-[10%] left-[10%] w-[30rem] h-[30rem] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10 text-center">
            <div className="mb-6">
              <span className="text-cyan-400 tracking-widest text-sm font-hero font-medium uppercase">dịch vụ của chúng tôi</span>
            </div>
            <h1 className="font-hero text-5xl md:text-6xl font-medium text-white tracking-tight leading-tight mb-6">
              Trải nghiệm dịch vụ <br />
              <span className="text-white/80">chăm sóc xe đỉnh cao</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              Từ <span className="text-cyan-400 font-medium">Eco Wash</span> đến <span className="text-amber-400 font-medium">Ceramic Shield</span> — quy trình chuyên nghiệp, công nghệ hiện đại, đội ngũ tận tâm
            </p>
          </div>
        </section>

        {/* ── SERVICE DETAIL BLOCKS ── */}
        <section className="py-24 bg-neutral-950 border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 right-0 w-[40rem] h-[40rem] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
          <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10 space-y-32">

            {SERVICE_BLOCKS.map((svc) => {
              const t = THEME[svc.themeColor];
              const isReverse = svc.direction === 'reverse';

              return (
                <div
                  key={svc.id}
                  id={`service-${svc.id}`}
                  className={`flex flex-col ${isReverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}
                >
                  {/* Image */}
                  <div className="w-full lg:w-1/2 relative">
                    <div className={`aspect-[4/3] rounded-2xl overflow-hidden relative border ${t.borderGlow}`}>
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                        style={{ backgroundImage: `url('${svc.imageUrl}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent" />
                      {/* Glow overlay */}
                      <div className={`absolute bottom-0 left-0 right-0 h-1/3 ${t.glowBg} blur-2xl opacity-40 pointer-events-none`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2">
                    {/* Labels */}
                    <div className="flex items-center gap-3 flex-wrap mb-4">
                      <span className={`inline-block px-3 py-1 text-xs font-medium tracking-widest uppercase rounded-sm ${t.labelClass}`}>
                        {svc.label}
                      </span>
                      {svc.badgeText && (
                        <span className={`inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-sm ${t.badgeClass}`}>
                          {svc.badgeText}
                        </span>
                      )}
                    </div>

                    <h2 className="font-hero text-4xl font-medium text-white mb-2">{svc.name}</h2>
                    {svc.subtitle && (
                      <p className={`text-sm mb-6 ${t.pointsClass.split(' ')[2] ?? 'text-white/60'}`} style={{ color: 'rgba(255,255,255,0.55)' }}>{svc.subtitle}</p>
                    )}

                    {/* Price row */}
                    <div className="flex items-center gap-5 flex-wrap mb-8">
                      <span className="text-white text-3xl font-medium">{svc.price}</span>
                      <div className="flex items-center gap-2 text-white/60">
                        <Clock size={18} />
                        <span>{svc.duration}</span>
                      </div>
                      <div className={`px-3 py-1 text-sm font-medium rounded-full ${t.pointsClass}`}>
                        {svc.points}
                      </div>
                    </div>

                    <div className="border-t border-white/10 mb-8" />

                    <ul className="space-y-4 mb-10">
                      {svc.features.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className={`mt-1 text-xs ${t.dot}`}>◆</span>
                          <span className="text-white/80">{step}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleBookingClick}
                        className={`px-8 py-3 font-medium rounded-full transition-all duration-300 text-sm text-center ${t.btnPrimary}`}
                      >
                        Đặt lịch ngay
                      </button>
                      <button
                        onClick={() => navigate('/pricing')}
                        className={`px-8 py-3 font-medium rounded-full transition-all duration-300 text-sm text-center ${t.btnSecondary}`}
                      >
                        Xem bảng giá
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── WHY CHOOSE US ── */}
        <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-[40rem] h-[20rem] bg-cyan-500/10 blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10">
            <div className="text-center mb-16">
              <span className="text-cyan-400 tracking-widest text-sm font-hero font-medium uppercase mb-4 inline-block">ưu điểm</span>
              <h2 className="font-hero text-4xl md:text-5xl font-medium text-white">Tại sao chọn AutoWash Pro?</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: <PenTool size={28} />, title: 'Thiết bị hiện đại', desc: 'Máy rửa áp lực cao, hóa chất chuyên dụng đảm bảo an toàn cho sơn xe.' },
                { icon: <Clock size={28} />, title: 'Đúng giờ', desc: 'Cam kết hoàn thành đúng thời gian đã đặt. Không để bạn chờ đợi lâu.' },
                { icon: <Award size={28} />, title: 'Thợ lành nghề', desc: 'Đội ngũ kỹ thuật viên được đào tạo bài bản, chuyên nghiệp và tỉ mỉ.' },
                { icon: <ShieldCheck size={28} />, title: 'Bảo đảm chất lượng', desc: 'Cam kết mang lại sự hài lòng tuyệt đối. Không hài lòng hoàn tiền 100%.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-neutral-900/40 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-cyan-500/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)] transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:bg-cyan-500/20 transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="font-hero text-lg font-medium text-white mb-3">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 bg-neutral-950 border-t border-white/5 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.15),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10">
            <h2 className="font-hero text-4xl md:text-5xl font-medium text-white tracking-tight mb-6">Sẵn sàng trải nghiệm?</h2>
            <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
              Hãy để AutoWash Pro chăm sóc xế yêu của bạn một cách tốt nhất. Đặt lịch ngay hôm nay để nhận ưu đãi!
            </p>
            <button
              onClick={handleBookingClick}
              className="px-10 py-4 bg-cyan-500 text-black font-medium rounded-full hover:bg-cyan-400 transition-all inline-flex items-center gap-3 text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
            >
              Đặt lịch ngay
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
