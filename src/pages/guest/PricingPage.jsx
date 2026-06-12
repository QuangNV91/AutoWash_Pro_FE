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
    <div className="min-h-screen font-body text-white/60 bg-black flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* HERO SECTION */}
        <section className="relative py-32 bg-black overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(6,182,212,0.15),transparent_50%)]"></div>
          <div className="absolute top-[20%] right-[10%] w-[30rem] h-[30rem] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10 text-center">
            <div className="mb-6">
              <span className="text-cyan-400 tracking-widest text-sm font-hero font-medium uppercase">bảng giá dịch vụ</span>
            </div>

            <h1 className="font-hero text-5xl md:text-6xl font-medium text-white leading-tight mb-6 tracking-tight">
              Giá cả minh bạch <br />
              <span className="text-white/80">
                phù hợp mọi nhu cầu
              </span>
            </h1>

            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              Chọn gói dịch vụ phù hợp với nhu cầu của bạn. Tất cả đều đi kèm cam kết chất lượng tuyệt đối.
            </p>
          </div>
        </section>

        {/* PRICING CARDS */}
        <section className="py-24 bg-neutral-950 border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-[40rem] h-[40rem] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
          <div className="container mx-auto px-6 md:px-10 max-w-6xl relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Basic */}
              <div className="bg-neutral-900/40 backdrop-blur border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all duration-300 flex flex-col group">
                <div className="p-8 flex-grow">
                  <span className="inline-block px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-medium tracking-widest uppercase rounded-sm mb-4">
                    GÓI CƠ BẢN
                  </span>
                  <h3 className="font-hero text-2xl font-medium text-white mb-2">Rửa xe cơ bản</h3>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-white text-4xl font-medium">40.000</span>
                    <span className="text-white/40 text-lg">đ</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/60 text-sm mb-6">
                    <span className="flex items-center gap-1"><Clock size={14} /> 15 phút</span>
                    <span className="flex items-center gap-1"><Star size={14} className="text-white/60" /> +40 điểm</span>
                  </div>
                  <div className="border-t border-white/10 mb-6"></div>
                  <ul className="space-y-3">
                    {[
                      "Xịt nước rửa bụi bẩn bề mặt",
                      "Phun xà bông bọt tuyết toàn thân",
                      "Rửa sạch bằng nước áp lực cao",
                      "Lau khô bằng khăn microfiber"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <span className="text-white/40 mt-0.5 text-xs">●</span>
                        <span className="text-white/70">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 pt-0">
                  <button
                    onClick={handleBookingClick}
                    className="w-full py-3 border border-white/20 text-white rounded-full hover:bg-white/10 transition-all duration-300 font-medium text-sm"
                  >
                    Đặt lịch ngay
                  </button>
                </div>
              </div>

              {/* Deep Clean — Popular */}
              <div className="bg-neutral-900/60 backdrop-blur border-2 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)] rounded-2xl overflow-hidden relative flex flex-col transform md:-translate-y-4">
                <div className="absolute top-0 left-0 right-0 bg-purple-500 text-white text-center py-1.5 text-xs font-medium tracking-widest uppercase shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  Phổ biến nhất
                </div>
                <div className="p-8 pt-12 flex-grow relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px]"></div>
                  <span className="inline-block px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-medium tracking-widest uppercase rounded-sm mb-4 relative z-10">
                    GÓI CHUYÊN SÂU
                  </span>
                  <h3 className="font-hero text-2xl font-medium text-white mb-2">Rửa xe chuyên sâu</h3>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-white text-4xl font-medium">150.000</span>
                    <span className="text-white/40 text-lg">đ</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/60 text-sm mb-6">
                    <span className="flex items-center gap-1"><Clock size={14} /> 30 phút</span>
                    <span className="flex items-center gap-1"><Star size={14} className="text-white/60" /> +150 điểm</span>
                  </div>
                  <div className="border-t border-white/10 mb-6"></div>
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
                        <span className="text-white/40 mt-0.5 text-xs">●</span>
                        <span className="text-white/70">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 pt-0 relative z-10">
                  <button
                    onClick={handleBookingClick}
                    className="w-full py-3 bg-cyan-500 text-black font-medium rounded-full hover:bg-cyan-400 transition-all duration-300 text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                  >
                    Đặt lịch ngay
                  </button>
                </div>
              </div>

              {/* Premium */}
              <div className="bg-neutral-900/40 backdrop-blur border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-all duration-300 flex flex-col group">
                <div className="p-8 flex-grow">
                  <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-medium tracking-widest uppercase rounded-sm mb-4">
                    GÓI CAO CẤP
                  </span>
                  <h3 className="font-hero text-2xl font-medium text-white mb-2">Phủ nano ceramic</h3>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-white text-4xl font-medium">300.000</span>
                    <span className="text-white/40 text-lg">đ</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/60 text-sm mb-6">
                    <span className="flex items-center gap-1"><Clock size={14} /> 60 phút</span>
                    <span className="flex items-center gap-1"><Star size={14} className="text-white/60" /> +300 điểm</span>
                  </div>
                  <div className="border-t border-white/10 mb-6"></div>
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
                        <span className="text-white/40 mt-0.5 text-xs">●</span>
                        <span className="text-white/70">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 pt-0">
                  <button
                    onClick={handleBookingClick}
                    className="w-full py-3 border border-purple-500/50 text-purple-400 rounded-full hover:bg-purple-500/10 transition-all duration-300 font-medium text-sm"
                  >
                    Đặt lịch ngay
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section id="comparison" className="py-24 bg-black relative overflow-hidden">
          <div className="absolute top-1/2 right-0 w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
          <div className="container mx-auto px-6 md:px-10 max-w-5xl relative z-10">
            <div className="text-center mb-16">
              <span className="text-cyan-400 tracking-widest text-sm font-hero font-medium uppercase mb-4 inline-block">so sánh chi tiết</span>
              <h2 className="font-hero text-4xl md:text-5xl font-medium text-white tracking-tight">Bảng so sánh gói dịch vụ</h2>
            </div>

            <div className="bg-neutral-900/50 border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-5 text-white/50 text-sm font-medium uppercase tracking-wider">Nội dung</th>
                      <th className="px-6 py-5 text-white/50 text-sm font-medium uppercase tracking-wider text-center">Cơ bản</th>
                      <th className="px-6 py-5 text-center relative bg-purple-500/5 rounded-t-lg">
                        <div className="absolute -top-0 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] font-medium px-3 py-0.5 rounded-b-lg shadow-[0_0_10px_rgba(168,85,247,0.4)]">PHỔ BIẾN</div>
                        <span className="text-white text-sm font-medium uppercase tracking-wider">Chuyên sâu</span>
                      </th>
                      <th className="px-6 py-5 text-white/50 text-sm font-medium uppercase tracking-wider text-center">Cao cấp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
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
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white/70 text-sm">{row.name}</td>
                        <td className="px-6 py-4 text-center">
                          {row.basic ? <span className="text-cyan-400 text-lg">✓</span> : <span className="text-white/20">—</span>}
                        </td>
                        <td className="px-6 py-4 text-center bg-purple-500/5">
                          {row.deep ? <span className="text-purple-400 text-lg">✓</span> : <span className="text-white/20">—</span>}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.premium ? <span className="text-cyan-400 text-lg">✓</span> : <span className="text-white/20">—</span>}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-white/5">
                      <td className="px-6 py-4 text-white font-medium text-sm">Thời gian</td>
                      <td className="px-6 py-4 text-white/70 text-sm text-center">15 phút</td>
                      <td className="px-6 py-4 text-purple-400 text-sm text-center font-medium bg-purple-500/10">30 phút</td>
                      <td className="px-6 py-4 text-white/70 text-sm text-center">60 phút</td>
                    </tr>
                    <tr className="bg-white/5">
                      <td className="px-6 py-4 text-white font-medium text-sm">Điểm tích lũy</td>
                      <td className="px-6 py-4 text-white/70 text-sm text-center">+40</td>
                      <td className="px-6 py-4 text-purple-400 text-sm text-center font-medium bg-purple-500/10">+150</td>
                      <td className="px-6 py-4 text-white/70 text-sm text-center">+300</td>
                    </tr>
                    <tr className="border-t border-white/10">
                      <td className="px-6 py-5 text-white font-medium">Giá</td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-white text-xl font-medium">40.000đ</span>
                      </td>
                      <td className="px-6 py-5 text-center bg-purple-500/10 rounded-b-lg">
                        <span className="text-purple-400 text-xl font-medium shadow-[0_0_20px_rgba(168,85,247,0.3)] block">150.000đ</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-white text-xl font-medium">300.000đ</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* LOYALTY TIER SECTION */}
        <section className="py-24 bg-neutral-950 border-t border-white/5 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-[40rem] h-[20rem] bg-purple-500/10 blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>
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
                { tier: 'Platinum', label: 'Bạch Kim', points: '3.000 điểm', discount: '15%', color: 'border-white/40', icon: <Sparkles size={24} />, iconColor: 'text-white' },
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

        {/* PROCESS TIMELINE */}
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
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/20 to-transparent"></div>
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

        {/* CTA SECTION */}
        <section className="py-20 bg-neutral-950 border-t border-white/5 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.15),transparent_50%)]"></div>
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
