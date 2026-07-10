import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Clock, Star, Percent, Crown, Award, Sparkles } from 'lucide-react';
import { getServices } from '../../services/bookingService';

// Dữ liệu gói dịch vụ — đồng bộ với MOCK_SERVICES trong bookingService.js
const PRICING_PLANS = [
  {
    id: 1,
    name: 'Eco Wash',
    subtitle: 'Gói Cơ Bản',
    label: 'GÓI CƠ BẢN',
    badge: null,
    price: '50.000',
    priceRaw: 50000,
    duration: '15 phút',
    points: '+50 điểm',
    themeColor: 'cyan',
    featured: false,
    features: [
      'Xịt nước rửa bụi bẩn bề mặt ngoài',
      'Phun xà bông bọt tuyết toàn thân xe',
      'Rửa sạch bằng nước áp lực cao',
      'Lau khô bằng khăn microfiber chuyên dụng',
    ],
  },
  {
    id: 2,
    name: 'Premium Care',
    subtitle: 'Gói Chuyên Sâu',
    label: 'GÓI CHUYÊN SÂU',
    badge: 'Phổ biến nhất',
    price: '150.000',
    priceRaw: 150000,
    duration: '30 phút',
    points: '+150 điểm',
    themeColor: 'purple',
    featured: true,
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
    name: 'Detailing & Shine',
    subtitle: 'Gói Cao Cấp',
    label: 'GÓI CAO CẤP',
    badge: 'Khuyên dùng',
    price: '350.000',
    priceRaw: 350000,
    duration: '60 phút',
    points: '+350 điểm',
    themeColor: 'emerald',
    featured: false,
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
    name: 'Ceramic Shield',
    subtitle: 'Gói Siêu Cấp',
    label: 'GÓI SIÊU CẤP',
    badge: 'Ultimate',
    price: '800.000',
    priceRaw: 800000,
    duration: '120 phút',
    points: '+800 điểm',
    themeColor: 'amber',
    featured: false,
    features: [
      'Toàn bộ quy trình Detailing & Shine',
      'Tẩy sạch nhựa đường & bụi sắt bám sơn',
      'Hiệu chỉnh sơn toàn diện (Paint Correction)',
      'Phủ 2 lớp Ceramic cao cấp — bảo vệ sơn toàn diện',
      'Xử lý kháng nước, kháng bụi, kháng tia UV',
      'Bảo hành lớp phủ Ceramic trong vòng 6 tháng',
    ],
  },
];

// Màu theme tương ứng
const THEME = {
  cyan: {
    badge: 'bg-cyan-500/10 text-cyan-400',
    label: 'bg-cyan-500/10 text-cyan-400',
    border: 'border-white/10 hover:border-cyan-500/40',
    btn: 'border border-white/20 text-white hover:bg-white/10',
    accent: 'text-cyan-400',
    dot: 'bg-cyan-400',
  },
  purple: {
    badge: 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]',
    label: 'bg-purple-500/20 border border-purple-500/30 text-purple-400',
    border: 'border-2 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)]',
    btn: 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]',
    accent: 'text-purple-400',
    dot: 'bg-purple-400',
  },
  emerald: {
    badge: 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300',
    label: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400',
    border: 'border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    btn: 'border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10',
    accent: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  amber: {
    badge: 'bg-amber-500/20 border border-amber-500/30 text-amber-300',
    label: 'bg-amber-500/10 border border-amber-500/20 text-amber-400',
    border: 'border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    btn: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold hover:from-amber-400 hover:to-yellow-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    accent: 'text-amber-400',
    dot: 'bg-amber-400',
  },
};

const COMPARISON_ROWS = [
  { name: 'Rửa bụi bẩn & phun bọt tuyết', v: [true, true, true, true] },
  { name: 'Rửa áp lực cao & lau khô microfiber', v: [true, true, true, true] },
  { name: 'Rửa kỹ gầm xe & nội thất bánh xe', v: [false, true, true, true] },
  { name: 'Vệ sinh sên xích & lốc máy động cơ', v: [false, true, true, true] },
  { name: 'Hút bụi & lau dọn nội thất xe', v: [false, true, true, true] },
  { name: 'Chăm sóc chuyên sâu bề mặt sơn', v: [false, false, true, true] },
  { name: 'Tẩy ố kính & phủ Nano kính lái', v: [false, false, true, true] },
  { name: 'Đánh bóng & xóa xước nhẹ bề mặt sơn', v: [false, false, true, true] },
  { name: 'Dưỡng & bảo vệ nội thất da/nhựa', v: [false, false, true, true] },
  { name: 'Hiệu chỉnh sơn (Paint Correction)', v: [false, false, false, true] },
  { name: 'Phủ 2 lớp Ceramic — kháng nước/bụi/UV', v: [false, false, false, true] },
  { name: 'Bảo hành lớp phủ Ceramic 6 tháng', v: [false, false, false, true] },
];

const TIER_ACCENT_COL = [
  'text-cyan-400', 'text-purple-400', 'text-emerald-400', 'text-amber-400'
];
const TIER_BG_COL = [
  '', 'bg-purple-500/5', '', ''
];

export default function PricingPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const location = useLocation();
  const [apiServices, setApiServices] = useState({});

  useEffect(() => {
    getServices().then(data => {
      const map = {};
      if (Array.isArray(data)) {
        data.forEach(s => map[s.name || s.serviceName] = s);
      }
      setApiServices(map);
    }).catch(console.error);
  }, []);

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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(6,182,212,0.15),transparent_50%)]" />
          <div className="absolute top-[20%] right-[10%] w-[30rem] h-[30rem] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10 text-center">
            <div className="mb-6">
              <span className="text-cyan-400 tracking-widest text-sm font-hero font-medium uppercase">
                bảng giá dịch vụ
              </span>
            </div>
            <h1 className="font-hero text-5xl md:text-6xl font-medium text-white leading-tight mb-6 tracking-tight">
              Giá cả minh bạch <br />
              <span className="text-white/80">phù hợp mọi nhu cầu</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              Từ <span className="text-cyan-400 font-medium">Eco Wash</span> đến <span className="text-amber-400 font-medium">Ceramic Shield</span> — 4 gói dịch vụ phù hợp mọi nhu cầu, cam kết chất lượng tuyệt đối.
            </p>
          </div>
        </section>

        {/* ── PRICING CARDS (4 gói) ── */}
        <section className="py-24 bg-neutral-950 border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-[40rem] h-[40rem] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {PRICING_PLANS.map((plan) => {
                const t = THEME[plan.themeColor];
                const apiData = apiServices[plan.name];
                
                // Cập nhật giá trị hiển thị từ API nếu có
                const displayPrice = apiData ? (apiData.basePrice ?? apiData.base_price ?? apiData.priceRaw).toLocaleString('vi-VN') : plan.price;
                const displayTime = apiData ? `${apiData.durationMinutes ?? apiData.duration_minutes ?? parseInt(plan.duration)} phút` : plan.duration;
                const displayPoints = apiData ? `+${apiData.basePoints ?? apiData.base_points ?? parseInt(plan.points.replace(/\\D/g, ''))} điểm` : plan.points;

                return (
                  <div
                    key={plan.id}
                    className={`bg-neutral-900/40 backdrop-blur border rounded-2xl overflow-hidden flex flex-col transition-all duration-300 relative
                      ${plan.featured ? `md:-translate-y-4 ${t.border}` : `${t.border}`}
                    `}
                  >
                    {/* Featured Banner */}
                    {plan.badge && plan.featured && (
                      <div className={`absolute top-0 left-0 right-0 text-center py-1.5 text-xs font-semibold tracking-widest uppercase ${t.badge}`}>
                        {plan.badge}
                      </div>
                    )}

                    <div className={`p-7 flex-grow ${plan.featured ? 'pt-10' : ''}`}>
                      {/* Label & badge non-featured */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`inline-block px-3 py-1 text-xs font-medium tracking-widest uppercase rounded-sm ${t.label}`}>
                          {plan.label}
                        </span>
                        {plan.badge && !plan.featured && (
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full ${t.badge}`}>
                            {plan.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="font-hero text-xl font-medium text-white tracking-tight">{plan.name}</h3>
                      <p className={`text-xs mb-3 ${t.accent}`}>{plan.subtitle}</p>

                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-white text-3xl font-medium">{displayPrice}</span>
                        <span className="text-white/40">đ</span>
                      </div>

                      <div className={`flex items-center gap-4 text-white/60 text-sm mb-6`}>
                        <span className="flex items-center gap-1"><Clock size={13} /> {displayTime}</span>
                        <span className={`flex items-center gap-1 ${t.accent}`}><Star size={13} /> {displayPoints}</span>
                      </div>

                      <div className="border-t border-white/10 mb-5" />

                      <ul className="space-y-2.5">
                        {plan.features.map((f, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm">
                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${t.dot}`} />
                            <span className="text-white/70">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-7 pt-0">
                      <button
                        onClick={handleBookingClick}
                        className={`w-full py-3 rounded-full font-medium text-sm transition-all duration-300 ${t.btn}`}
                      >
                        Đặt lịch ngay
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── COMPARISON TABLE ── */}
        <section id="comparison" className="py-24 bg-black relative overflow-hidden">
          <div className="absolute top-1/2 right-0 w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
          <div className="container mx-auto px-4 md:px-10 max-w-6xl relative z-10">
            <div className="text-center mb-16">
              <span className="text-cyan-400 tracking-widest text-sm font-hero font-medium uppercase mb-4 inline-block">so sánh chi tiết</span>
              <h2 className="font-hero text-4xl md:text-5xl font-medium text-white tracking-tight">Bảng so sánh gói dịch vụ</h2>
            </div>

            <div className="bg-neutral-900/50 border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-5 py-5 text-white/50 text-sm font-medium uppercase tracking-wider w-1/3">Nội dung</th>
                      {PRICING_PLANS.map((p, i) => (
                        <th key={p.id} className={`px-4 py-5 text-center ${TIER_BG_COL[i]}`}>
                          {p.featured && (
                            <div className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest mb-1">PHỔ BIẾN</div>
                          )}
                          <span className={`text-xs font-semibold uppercase tracking-wider ${TIER_ACCENT_COL[i]}`}>{p.name}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {COMPARISON_ROWS.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-5 py-4 text-white/70 text-sm">{row.name}</td>
                        {row.v.map((has, ci) => (
                          <td key={ci} className={`px-4 py-4 text-center ${TIER_BG_COL[ci]}`}>
                            {has
                              ? <span className={`text-lg font-bold ${TIER_ACCENT_COL[ci]}`}>✓</span>
                              : <span className="text-white/20">—</span>
                            }
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* Thời gian */}
                    <tr className="bg-white/5">
                      <td className="px-5 py-4 text-white font-medium text-sm">Thời gian</td>
                      {PRICING_PLANS.map((p, i) => {
                        const apiData = apiServices[p.name];
                        const displayTime = apiData ? `${apiData.durationMinutes ?? apiData.duration_minutes ?? parseInt(p.duration)} phút` : p.duration;
                        return (
                          <td key={p.id} className={`px-4 py-4 text-sm text-center font-medium ${TIER_ACCENT_COL[i]} ${TIER_BG_COL[i]}`}>
                            {displayTime}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Điểm tích lũy */}
                    <tr className="bg-white/5">
                      <td className="px-5 py-4 text-white font-medium text-sm">Điểm tích lũy</td>
                      {PRICING_PLANS.map((p, i) => {
                        const apiData = apiServices[p.name];
                        const displayPoints = apiData ? `+${apiData.basePoints ?? apiData.base_points ?? parseInt(p.points.replace(/\\D/g, ''))} điểm` : p.points;
                        return (
                          <td key={p.id} className={`px-4 py-4 text-sm text-center font-medium ${TIER_ACCENT_COL[i]} ${TIER_BG_COL[i]}`}>
                            {displayPoints}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Giá */}
                    <tr className="border-t border-white/10">
                      <td className="px-5 py-5 text-white font-medium">Giá</td>
                      {PRICING_PLANS.map((p, i) => {
                        const apiData = apiServices[p.name];
                        const displayPrice = apiData ? (apiData.basePrice ?? apiData.base_price ?? p.priceRaw).toLocaleString('vi-VN') : p.price;
                        return (
                          <td key={p.id} className={`px-4 py-5 text-center ${TIER_BG_COL[i]}`}>
                            <span className={`text-lg font-medium ${TIER_ACCENT_COL[i]}`}>{displayPrice}đ</span>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ── LOYALTY TIER ── */}
        <section className="py-24 bg-neutral-950 border-t border-white/5 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-[40rem] h-[20rem] bg-purple-500/10 blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />
          <div className="container mx-auto px-6 md:px-10 max-w-5xl relative z-10">
            <div className="text-center mb-16">
              <span className="text-purple-400 tracking-widest text-sm font-hero font-medium uppercase mb-4 inline-block">ưu đãi thành viên</span>
              <h2 className="font-hero text-4xl md:text-5xl font-medium text-white tracking-tight">Tích điểm — Thăng hạng — Tiết kiệm</h2>
              <p className="text-white/60 mt-4 max-w-2xl mx-auto">
                Sử dụng dịch vụ để tích điểm, thăng hạng tự động và nhận chiết khấu hấp dẫn
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { tier: 'Member', label: 'Thành viên', points: '0 điểm', discount: '0%', color: 'border-white/10', icon: <Star size={24} />, iconColor: 'text-white/40' },
                { tier: 'Silver', label: 'Bạc', points: '500 điểm', discount: '5%', color: 'border-white/20', icon: <Award size={24} />, iconColor: 'text-white/60' },
                { tier: 'Gold', label: 'Vàng', points: '1.500 điểm', discount: '10%', color: 'border-white/30', icon: <Crown size={24} />, iconColor: 'text-white/80' },
                { tier: 'Platinum', label: 'Kim Cương', points: '3.000 điểm', discount: '15%', color: 'border-white/40', icon: <Sparkles size={24} />, iconColor: 'text-white' },
              ].map((item, idx) => (
                <div key={idx} className={`bg-neutral-900/50 border ${item.color} rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300`}>
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-white/5 flex items-center justify-center ${item.iconColor}`}>
                    {item.icon}
                  </div>
                  <h3 className="font-hero text-lg font-medium text-white mb-1">{item.label}</h3>
                  <p className="text-white/40 text-xs mb-4">{item.points}</p>
                  <div className="inline-flex items-center gap-1 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                    <Percent size={14} className="text-white/80" />
                    <span className="text-white font-medium text-sm">{item.discount}</span>
                  </div>
                  <p className="text-white/40 text-xs mt-2">chiết khấu</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS TIMELINE ── */}
        <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-10 max-w-5xl relative z-10">
            <div className="text-center mb-16">
              <span className="text-cyan-400 tracking-widest text-sm font-hero font-medium uppercase mb-4 inline-block">quy trình phục vụ</span>
              <h2 className="font-hero text-4xl md:text-5xl font-medium text-white tracking-tight">Đơn giản — Nhanh chóng</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Đặt lịch online', desc: 'Chọn gói dịch vụ, ngày giờ phù hợp trên hệ thống đặt lịch thông minh.' },
                { step: '02', title: 'Đến cửa hàng', desc: 'Mang xe đến đúng giờ hẹn. Nhân viên sẽ check-in và tiếp nhận xe.' },
                { step: '03', title: 'Thực hiện dịch vụ', desc: 'Kỹ thuật viên thực hiện theo đúng quy trình chuẩn với thiết bị hiện đại.' },
                { step: '04', title: 'Nhận xe & Thanh toán', desc: 'Kiểm tra kết quả, thanh toán tiện lợi và tích điểm thành viên.' },
              ].map((item, idx) => (
                <div key={idx} className="relative text-center group">
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/20 to-transparent" />
                  )}
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-neutral-900/80 backdrop-blur border border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300">
                    <span className="text-cyan-400 font-hero text-xl font-medium">{item.step}</span>
                  </div>
                  <h3 className="text-white font-medium mb-2">{item.title}</h3>
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleBookingClick}
                className="px-10 py-4 bg-cyan-500 text-black font-medium rounded-full hover:bg-cyan-400 transition-all inline-flex items-center gap-3 text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
              >
                Đặt lịch ngay
              </button>
              <button
                onClick={() => navigate('/services')}
                className="px-10 py-4 text-cyan-400 font-medium border border-cyan-500/50 rounded-full hover:bg-cyan-500/10 transition-all text-sm"
              >
                Xem chi tiết dịch vụ
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
