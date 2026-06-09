import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Clock, Star, Percent, Crown, Award, Sparkles } from 'lucide-react';

export default function PricingPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const handleBookingClick = () => {
    if (isLoggedIn) {
      navigate('/booking');
    } else {
      navigate('/auth/login');
    }
  };

  return (
    <div className="min-h-screen font-body text-text-secondary bg-dark-950 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* HERO SECTION */}
        <section className="relative py-32 bg-dark-950 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gold-500/10 via-dark-950 to-dark-950"></div>
          <div className="absolute top-20 left-20 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10 text-center">
            <div className="inline-block mb-6">
              <span className="text-gold-500 tracking-widest text-sm font-semibold uppercase">✦ Bảng giá dịch vụ</span>
            </div>

            <h1 className="font-heading text-5xl md:text-6xl font-bold text-text-primary leading-tight mb-6">
              Giá cả minh bạch <br />
              <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
                phù hợp mọi nhu cầu
              </span>
            </h1>

            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Chọn gói dịch vụ phù hợp với nhu cầu của bạn. Tất cả đều đi kèm cam kết chất lượng tuyệt đối.
            </p>
          </div>
        </section>

        {/* PRICING CARDS */}
        <section className="py-24 bg-dark-900 border-t border-dark-800">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Basic */}
              <div className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden hover:border-gold-500/30 transition-all duration-300 flex flex-col">
                <div className="p-8 flex-grow">
                  <span className="inline-block px-3 py-1 bg-dark-700 text-text-muted text-xs font-bold tracking-widest rounded-sm mb-4">
                    GÓI CƠ BẢN
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-text-primary mb-2">Rửa xe cơ bản</h3>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-gold-400 text-4xl font-bold">40.000</span>
                    <span className="text-text-muted text-lg">đ</span>
                  </div>
                  <div className="flex items-center gap-4 text-text-secondary text-sm mb-6">
                    <span className="flex items-center gap-1"><Clock size={14} /> 15 phút</span>
                    <span className="flex items-center gap-1"><Star size={14} className="text-gold-400" /> +40 điểm</span>
                  </div>
                  <div className="border-t border-dark-600 mb-6"></div>
                  <ul className="space-y-3">
                    {[
                      "Xịt nước rửa bụi bẩn bề mặt",
                      "Phun xà bông bọt tuyết toàn thân",
                      "Rửa sạch bằng nước áp lực cao",
                      "Lau khô bằng khăn microfiber"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <span className="text-gold-500 mt-0.5 text-xs">✦</span>
                        <span className="text-text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 pt-0">
                  <button
                    onClick={handleBookingClick}
                    className="w-full py-3.5 text-gold-500 font-semibold border border-gold-500 rounded-full hover:bg-gold-500 hover:text-dark-950 transition-all duration-300"
                  >
                    Đặt lịch ngay
                  </button>
                </div>
              </div>

              {/* Deep Clean — Popular */}
              <div className="bg-dark-800 border border-gold-500 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(201,152,26,0.15)] relative flex flex-col">
                <div className="absolute top-0 left-0 right-0 bg-gold-500 text-dark-950 text-center py-2 text-xs font-bold tracking-widest uppercase">
                  Phổ biến nhất
                </div>
                <div className="p-8 pt-14 flex-grow">
                  <span className="inline-block px-3 py-1 bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-bold tracking-widest rounded-sm mb-4">
                    GÓI CHUYÊN SÂU
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-text-primary mb-2">Rửa xe chuyên sâu</h3>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-gold-400 text-4xl font-bold">150.000</span>
                    <span className="text-text-muted text-lg">đ</span>
                  </div>
                  <div className="flex items-center gap-4 text-text-secondary text-sm mb-6">
                    <span className="flex items-center gap-1"><Clock size={14} /> 30 phút</span>
                    <span className="flex items-center gap-1"><Star size={14} className="text-gold-400" /> +150 điểm</span>
                  </div>
                  <div className="border-t border-dark-600 mb-6"></div>
                  <ul className="space-y-3">
                    {[
                      "Toàn bộ quy trình gói Cơ bản",
                      "Vệ sinh sên xích, tra dầu bôi trơn",
                      "Rửa sạch lốc máy, khu vực động cơ",
                      "Vệ sinh phanh, vành xe",
                      "Lau bóng nhựa, cao su",
                      "Kiểm tra áp suất lốp"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <span className="text-gold-500 mt-0.5 text-xs">✦</span>
                        <span className="text-text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 pt-0">
                  <button
                    onClick={handleBookingClick}
                    className="w-full py-3.5 bg-gold-500 text-dark-950 font-bold rounded-full hover:bg-gold-400 transition-all duration-300 shadow-[0_0_20px_rgba(201,152,26,0.3)]"
                  >
                    Đặt lịch ngay
                  </button>
                </div>
              </div>

              {/* Premium */}
              <div className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden hover:border-gold-500/30 transition-all duration-300 flex flex-col">
                <div className="p-8 flex-grow">
                  <span className="inline-block px-3 py-1 bg-dark-700 text-text-muted text-xs font-bold tracking-widest rounded-sm mb-4">
                    GÓI CAO CẤP
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-text-primary mb-2">Phủ nano ceramic</h3>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-gold-400 text-4xl font-bold">300.000</span>
                    <span className="text-text-muted text-lg">đ</span>
                  </div>
                  <div className="flex items-center gap-4 text-text-secondary text-sm mb-6">
                    <span className="flex items-center gap-1"><Clock size={14} /> 60 phút</span>
                    <span className="flex items-center gap-1"><Star size={14} className="text-gold-400" /> +300 điểm</span>
                  </div>
                  <div className="border-t border-dark-600 mb-6"></div>
                  <ul className="space-y-3">
                    {[
                      "Toàn bộ quy trình gói Chuyên sâu",
                      "Đánh bóng bề mặt sơn bằng máy",
                      "Tẩy các vết xước nhỏ, ố vàng",
                      "Phủ lớp nano ceramic bảo vệ sơn",
                      "Xử lý chống bám nước, bụi bẩn",
                      "Kiểm tra tổng thể và bàn giao xe"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <span className="text-gold-500 mt-0.5 text-xs">✦</span>
                        <span className="text-text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 pt-0">
                  <button
                    onClick={handleBookingClick}
                    className="w-full py-3.5 text-gold-500 font-semibold border border-gold-500 rounded-full hover:bg-gold-500 hover:text-dark-950 transition-all duration-300"
                  >
                    Đặt lịch ngay
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section id="comparison" className="py-24 bg-dark-950">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center mb-16">
              <span className="text-gold-500 tracking-widest text-sm font-semibold uppercase mb-4 inline-block">✦ So sánh chi tiết</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-text-primary">Bảng so sánh gói dịch vụ</h2>
            </div>

            <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-dark-700">
                      <th className="px-6 py-5 text-text-muted text-sm font-semibold uppercase tracking-wider">Nội dung</th>
                      <th className="px-6 py-5 text-text-muted text-sm font-semibold uppercase tracking-wider text-center">Cơ bản</th>
                      <th className="px-6 py-5 text-center relative">
                        <div className="absolute -top-0 left-1/2 -translate-x-1/2 bg-gold-500 text-dark-950 text-[10px] font-bold px-3 py-0.5 rounded-b-lg">PHỔ BIẾN</div>
                        <span className="text-gold-400 text-sm font-semibold uppercase tracking-wider">Chuyên sâu</span>
                      </th>
                      <th className="px-6 py-5 text-text-muted text-sm font-semibold uppercase tracking-wider text-center">Cao cấp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700/50">
                    {[
                      { name: 'Rửa bụi bẩn bề mặt', basic: true, deep: true, premium: true },
                      { name: 'Phun bọt tuyết', basic: true, deep: true, premium: true },
                      { name: 'Lau khô microfiber', basic: true, deep: true, premium: true },
                      { name: 'Vệ sinh sên xích & lốc máy', basic: false, deep: true, premium: true },
                      { name: 'Vệ sinh phanh & vành xe', basic: false, deep: true, premium: true },
                      { name: 'Kiểm tra áp suất lốp', basic: false, deep: true, premium: true },
                      { name: 'Đánh bóng bề mặt sơn', basic: false, deep: false, premium: true },
                      { name: 'Tẩy xước & ố vàng', basic: false, deep: false, premium: true },
                      { name: 'Phủ nano ceramic', basic: false, deep: false, premium: true },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-dark-800/50 transition-colors">
                        <td className="px-6 py-4 text-text-secondary text-sm">{row.name}</td>
                        <td className="px-6 py-4 text-center">
                          {row.basic ? <span className="text-gold-400 text-lg">✓</span> : <span className="text-text-muted">—</span>}
                        </td>
                        <td className="px-6 py-4 text-center bg-gold-500/5">
                          {row.deep ? <span className="text-gold-400 text-lg">✓</span> : <span className="text-text-muted">—</span>}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.premium ? <span className="text-gold-400 text-lg">✓</span> : <span className="text-text-muted">—</span>}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-dark-800/30">
                      <td className="px-6 py-4 text-text-primary font-bold text-sm">Thời gian</td>
                      <td className="px-6 py-4 text-text-secondary text-sm text-center">15 phút</td>
                      <td className="px-6 py-4 text-gold-400 text-sm text-center font-semibold bg-gold-500/5">30 phút</td>
                      <td className="px-6 py-4 text-text-secondary text-sm text-center">60 phút</td>
                    </tr>
                    <tr className="bg-dark-800/30">
                      <td className="px-6 py-4 text-text-primary font-bold text-sm">Điểm tích lũy</td>
                      <td className="px-6 py-4 text-text-secondary text-sm text-center">+40</td>
                      <td className="px-6 py-4 text-gold-400 text-sm text-center font-semibold bg-gold-500/5">+150</td>
                      <td className="px-6 py-4 text-text-secondary text-sm text-center">+300</td>
                    </tr>
                    <tr className="border-t border-dark-600">
                      <td className="px-6 py-5 text-text-primary font-bold">Giá</td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-gold-400 text-xl font-bold">40.000đ</span>
                      </td>
                      <td className="px-6 py-5 text-center bg-gold-500/5">
                        <span className="text-gold-400 text-xl font-bold">150.000đ</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-gold-400 text-xl font-bold">300.000đ</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* LOYALTY TIER SECTION */}
        <section className="py-24 bg-dark-900 border-t border-dark-800">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center mb-16">
              <span className="text-gold-500 tracking-widest text-sm font-semibold uppercase mb-4 inline-block">✦ Ưu đãi thành viên</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-text-primary">Tích điểm — Thăng hạng — Tiết kiệm</h2>
              <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
                Sử dụng dịch vụ để tích điểm, thăng hạng tự động và nhận chiết khấu hấp dẫn
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { tier: 'Member', label: 'Thành viên', points: '0 điểm', discount: '0%', color: 'border-dark-600', icon: <Star size={28} />, iconColor: 'text-text-muted', bgGlow: '' },
                { tier: 'Silver', label: 'Bạc', points: '500 điểm', discount: '5%', color: 'border-[#C0C0C0]/30', icon: <Award size={28} />, iconColor: 'text-[#C0C0C0]', bgGlow: '' },
                { tier: 'Gold', label: 'Vàng', points: '1.500 điểm', discount: '10%', color: 'border-gold-500/40', icon: <Crown size={28} />, iconColor: 'text-gold-400', bgGlow: 'shadow-[0_0_20px_rgba(201,152,26,0.1)]' },
                { tier: 'Platinum', label: 'Bạch Kim', points: '3.000 điểm', discount: '15%', color: 'border-purple-500/30', icon: <Sparkles size={28} />, iconColor: 'text-purple-300', bgGlow: 'shadow-[0_0_20px_rgba(168,139,250,0.1)]' },
              ].map((item, idx) => (
                <div key={idx} className={`bg-dark-800 border ${item.color} rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 ${item.bgGlow}`}>
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-dark-700 flex items-center justify-center ${item.iconColor}`}>
                    {item.icon}
                  </div>
                  <h3 className="font-heading text-lg font-bold text-text-primary mb-1">{item.label}</h3>
                  <p className="text-text-muted text-xs mb-4">{item.points}</p>
                  <div className="inline-flex items-center gap-1 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full">
                    <Percent size={14} className="text-gold-400" />
                    <span className="text-gold-400 font-bold text-lg">{item.discount}</span>
                  </div>
                  <p className="text-text-muted text-xs mt-2">chiết khấu</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS TIMELINE */}
        <section className="py-24 bg-dark-950 border-t border-dark-800">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center mb-16">
              <span className="text-gold-500 tracking-widest text-sm font-semibold uppercase mb-4 inline-block">✦ Quy trình phục vụ</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-text-primary">Đơn giản — Nhanh chóng</h2>
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
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-gold-500/40 to-transparent"></div>
                  )}
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-dark-800 border border-dark-600 flex items-center justify-center group-hover:border-gold-500/50 group-hover:bg-gold-500/10 transition-all duration-300">
                    <span className="text-gold-400 font-heading text-xl font-bold">{item.step}</span>
                  </div>
                  <h3 className="text-text-primary font-bold mb-2">{item.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 bg-dark-900 border-t border-dark-800 text-center">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-text-primary mb-6">Sẵn sàng trải nghiệm?</h2>
            <p className="text-text-secondary text-lg mb-10 max-w-2xl mx-auto">
              Hãy để AutoWash Pro chăm sóc xế yêu của bạn một cách tốt nhất. Đặt lịch ngay hôm nay để nhận ưu đãi!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleBookingClick}
                className="px-10 py-5 bg-gold-500 text-dark-950 font-bold rounded-full hover:bg-gold-400 shadow-[0_0_30px_rgba(201,152,26,0.4)] hover:shadow-[0_0_40px_rgba(201,152,26,0.6)] transition-all inline-flex items-center gap-3 text-lg"
              >
                Đặt lịch ngay
              </button>
              <button
                onClick={() => navigate('/services')}
                className="px-10 py-5 text-gold-500 font-bold border-2 border-gold-500 rounded-full hover:bg-gold-500 hover:text-dark-950 transition-all text-lg"
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
