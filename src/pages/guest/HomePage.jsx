import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Footer from '../../components/layout/Footer';
import { Clock, ShieldCheck, PenTool, Award, Star, User } from 'lucide-react';

export default function HomePage() {
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

      <main className="flex-grow">
        {/* ═══ HERO SECTION — Securify-style fullscreen ═══ */}
        <section id="hero" className="relative h-screen w-full overflow-hidden bg-black">

          {/* Background image — dark car */}
          <img
            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />

          {/* Background glows - Cyber aesthetic */}
          <div className="absolute top-[20%] left-[10%] w-[40rem] h-[40rem] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"></div>

          {/* ── Floating Pill Navbar ── */}
          <nav className="absolute z-20 px-6 md:px-10 pt-6 top-0 left-0 right-0">
            <div className="flex items-center justify-between gap-4">
              {/* Left pill — logo + brand */}
              <Link
                to="/"
                className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur rounded-full pl-4 pr-6 py-3"
              >
                {/* SVG Logo */}
                <svg viewBox="0 0 256 256" className="h-5 w-5" fill="#ffffff">
                  <path d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z" />
                </svg>
                <span className="text-white text-sm font-normal tracking-tight">autowash pro</span>
              </Link>

              {/* Center pill — nav links (hidden on mobile) */}
              <div className="hidden md:flex items-center gap-1 bg-neutral-900/90 backdrop-blur rounded-full px-3 py-2">
                {[
                  { label: 'Trang chủ', path: '/' },
                  { label: 'Dịch vụ', path: '/services' },
                  { label: 'Bảng giá', path: '/pricing' },
                  { label: 'Liên hệ', path: '/contact' },
                ].map((link) => (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full"
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Right buttons — Auth & CTA */}
              <div className="flex items-center gap-3">
                {isLoggedIn ? (
                  <div className="relative group hidden md:block">
                    <button
                      className="w-11 h-11 rounded-full bg-neutral-900/90 backdrop-blur border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Quản lý tài khoản"
                    >
                      <User size={18} />
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:translate-y-0 translate-y-2 bg-neutral-900/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden py-2">
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full text-left px-5 py-3 text-white text-sm hover:bg-white/10 transition-colors"
                      >
                        Quản lý lịch hẹn
                      </button>
                      <button
                        onClick={() => {
                          localStorage.removeItem('token');
                          window.location.reload();
                        }}
                        className="w-full text-left px-5 py-3 text-red-400 text-sm hover:bg-red-500/10 transition-colors border-t border-white/5"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="hidden md:flex bg-neutral-900/90 backdrop-blur text-white text-sm font-medium rounded-full px-6 py-3 hover:bg-white/10 transition-colors"
                  >
                    Đăng nhập
                  </button>
                )}

              </div>
            </div>
          </nav>

          {/* ── Foreground content ── */}
          <div className="relative h-full w-full">

            {/* Three giant staggered headline words */}
            <h1 className="hero-title absolute text-white font-medium text-[14vw] md:text-[10vw] left-4 md:left-10 top-[10%]">
              chăm sóc
            </h1>
            <h1 className="hero-title absolute text-white font-medium text-[14vw] md:text-[10vw] right-4 md:right-10 top-[38%] text-right">
              xế yêu
            </h1>
            <h1 className="hero-title absolute text-white font-medium text-[14vw] md:text-[10vw] left-[18%] md:left-[28%] top-[68%]">
              hoàn hảo
            </h1>

            {/* Description paragraph */}
            <p className="absolute left-6 md:left-10 top-[46%] max-w-[240px] text-[15px] leading-snug text-white/90">
              hệ thống đặt lịch rửa xe thông minh, tích điểm thăng hạng, chăm sóc xế yêu đẳng cấp mỗi ngày
            </p>

            {/* Stat block — top-right */}
            <div className="absolute right-6 md:right-24 top-[14%]">
              <div className="flex items-center gap-3 justify-end">
                <div className="hidden md:block h-px w-24 bg-white/40 rotate-[20deg]" />
                <span className="text-4xl md:text-5xl font-medium tracking-tight text-white">+1000</span>
              </div>
              <p className="text-xs md:text-sm text-white/70 mt-1 text-right">khách hàng tin dùng</p>
            </div>

            {/* Bottom gradient overlay */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black" />

            {/* Stat block — bottom-left */}
            <div className="absolute left-6 md:left-20 bottom-20 md:bottom-24">
              <div className="flex items-center gap-3">
                <span className="text-4xl md:text-5xl font-medium tracking-tight text-white">4.9/5</span>
                <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
              </div>
              <p className="text-xs md:text-sm text-white/70 mt-1">đánh giá hài lòng</p>
            </div>

            {/* Stat block — bottom-right */}
            <div className="absolute right-6 md:right-20 bottom-16 md:bottom-20">
              <div className="flex items-center gap-3 justify-end">
                <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
                <span className="text-4xl md:text-5xl font-medium tracking-tight text-white">4 gói</span>
              </div>
              <p className="text-xs md:text-sm text-white/70 mt-1 text-right">dịch vụ chuyên nghiệp</p>
            </div>
          </div>
        </section>

        {/* SERVICES PREVIEW */}
        <section className="py-24 bg-black relative overflow-hidden">
          <div className="absolute top-1/2 right-0 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

          <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10">
            <div className="mb-16">
              <p className="text-sm text-cyan-400 tracking-widest uppercase mb-3 font-hero font-medium">dịch vụ nổi bật</p>
              <h2 className="font-hero text-4xl md:text-5xl font-medium text-white tracking-tight">Chăm sóc toàn diện</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Eco Wash',
                  price: '40.000đ',
                  time: '15 phút',
                  desc: 'Nhanh gọn, sạch bóng — lý tưởng cho người bận rộn',
                  img: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=2069&auto=format&fit=crop'
                },
                {
                  title: 'Premium Care',
                  price: '150.000đ',
                  time: '30 phút',
                  desc: 'Dành cho xe đi mưa nhiều, cần rửa kỹ càng',
                  img: '/images/premium_care.png',
                  popular: true
                },
                {
                  title: 'Detailing & Shine',
                  price: '350.000đ',
                  time: '60 phút',
                  desc: 'Chăm sóc toàn diện sơn xe, kính & nội thất',
                  img: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=2070&auto=format&fit=crop'
                }
              ].map((service, idx) => (
                <div key={idx} className="bg-neutral-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all duration-300 group">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url(${service.img})` }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent"></div>
                    {service.popular && (
                      <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                        Phổ biến nhất
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-hero text-xl font-medium text-white mb-2 group-hover:text-cyan-400 transition-colors">{service.title}</h3>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-white font-medium">{service.price}</span>
                      <span className="text-white/30">•</span>
                      <span className="text-white/60 text-sm flex items-center gap-1">
                        <Clock size={14} /> {service.time}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm mb-6 leading-relaxed">{service.desc}</p>
                    <button
                      onClick={() => navigate('/services')}
                      className="w-full py-3 border border-white/20 text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="py-24 bg-neutral-950 border-t border-white/5 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-[40rem] h-[20rem] bg-purple-500/10 blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

          <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10">
            <div className="mb-16">
              <p className="text-sm text-purple-400 tracking-widest uppercase mb-3 font-hero font-medium">ưu điểm vượt trội</p>
              <h2 className="font-hero text-4xl md:text-5xl font-medium text-white tracking-tight">Tại sao chọn AutoWash Pro?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: <PenTool size={28} />, title: 'Thiết bị hiện đại', desc: 'Máy rửa áp lực cao, hóa chất nhập khẩu đảm bảo an toàn cho sơn xe.' },
                { icon: <Clock size={28} />, title: 'Đúng giờ cam kết', desc: 'Hoàn thành đúng thời gian đã hẹn. Không để bạn chờ đợi lâu.' },
                { icon: <Award size={28} />, title: 'Thợ lành nghề', desc: 'Đội ngũ kỹ thuật viên đào tạo bài bản, tỉ mỉ từng chi tiết.' },
                { icon: <ShieldCheck size={28} />, title: 'Bảo đảm chất lượng', desc: 'Cam kết hài lòng tuyệt đối. Không hài lòng — hoàn tiền 100%.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-neutral-900/40 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(168,85,247,0.1)] transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5 group-hover:bg-purple-500/20 transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="font-hero text-lg font-medium text-white mb-3">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS TIMELINE */}
        <section className="py-24 bg-black relative">
          <div className="container mx-auto px-6 md:px-10 max-w-5xl relative z-10">
            <div className="text-center mb-16">
              <p className="text-sm text-cyan-400 tracking-widest uppercase mb-3 font-hero font-medium">quy trình</p>
              <h2 className="font-hero text-4xl md:text-5xl font-medium text-white tracking-tight">4 bước đơn giản</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Đặt lịch online', desc: 'Chọn gói dịch vụ và thời gian phù hợp trên hệ thống.' },
                { step: '02', title: 'Đến cửa hàng', desc: 'Mang xe đến đúng giờ hẹn, nhân viên check-in nhanh chóng.' },
                { step: '03', title: 'Thực hiện dịch vụ', desc: 'Kỹ thuật viên thực hiện đúng quy trình chuẩn chuyên nghiệp.' },
                { step: '04', title: 'Nhận xe & Thanh toán', desc: 'Kiểm tra kết quả, thanh toán và tích điểm thành viên.' },
              ].map((item, idx) => (
                <div key={idx} className="relative text-center group">
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
                  )}
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:border-cyan-500 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-all duration-300">
                    <span className="font-hero text-xl font-medium text-cyan-400">{item.step}</span>
                  </div>
                  <h3 className="font-hero text-white font-medium mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 bg-neutral-950 border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-[20%] w-[20rem] h-[20rem] bg-cyan-500/10 blur-[100px] pointer-events-none"></div>
          <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10">
            <div className="mb-16">
              <p className="text-sm text-cyan-400 tracking-widest uppercase mb-3 font-hero font-medium">khách hàng nói gì</p>
              <h2 className="font-hero text-4xl md:text-5xl font-medium text-white tracking-tight">Đánh giá từ khách hàng</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Nguyễn Văn An', role: 'Thành viên Gold', rating: 5, text: 'Dịch vụ rửa xe chuyên sâu rất tuyệt vời. Xe sạch bóng, nhân viên nhiệt tình. Tôi đã là khách quen hơn 1 năm.', avatar: 'A' },
                { name: 'Trần Thị Bích', role: 'Thành viên Platinum', rating: 5, text: 'Hệ thống đặt lịch online rất tiện lợi. Không phải chờ đợi, đến đúng giờ là có người phục vụ ngay.', avatar: 'B' },
                { name: 'Lê Minh Đức', role: 'Thành viên Silver', rating: 5, text: 'Phủ nano ceramic giúp xe bóng đẹp suốt cả tháng. Giá cả hợp lý so với chất lượng nhận được.', avatar: 'D' },
              ].map((review, idx) => (
                <div key={idx} className="bg-neutral-900/40 backdrop-blur border border-white/10 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300">
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-cyan-400 fill-cyan-400" />
                    ))}
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-6 italic">"{review.text}"</p>
                  <div className="flex items-center gap-3 border-t border-white/10 pt-5">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white font-medium text-sm">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{review.name}</p>
                      <p className="text-white/40 text-xs">{review.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LOYALTY PROGRAM */}
        <section className="py-24 bg-black relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-[40rem] h-[40rem] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

          <div className="container mx-auto px-6 md:px-10 max-w-6xl relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-1/2">
                <p className="text-sm text-purple-400 tracking-widest uppercase mb-3 font-hero font-medium">chương trình thành viên</p>
                <h2 className="font-hero text-4xl md:text-5xl font-medium text-white tracking-tight mb-6">
                  Tích điểm — Thăng hạng
                </h2>
                <p className="text-white/60 leading-relaxed mb-8">
                  Mỗi lần sử dụng dịch vụ, bạn sẽ tự động tích điểm và thăng hạng thành viên. Hạng càng cao — chiết khấu càng lớn, quyền lợi càng nhiều.
                </p>
                <div className="space-y-3 mb-10">
                  {[
                    { tier: 'Silver', points: '500 điểm', discount: '5%' },
                    { tier: 'Gold', points: '1.500 điểm', discount: '10%' },
                    { tier: 'Platinum', points: '3.000 điểm', discount: '15%' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-neutral-900/40 backdrop-blur border border-white/10 rounded-xl px-5 py-4 hover:border-purple-500/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <Award size={18} className="text-purple-400" />
                        <span className="font-hero font-medium text-white">{item.tier}</span>
                        <span className="text-white/40 text-sm">({item.points})</span>
                      </div>
                      <span className="text-white font-medium text-sm">Giảm {item.discount}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/pricing')}
                  className="px-8 py-3 border border-white/20 text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium"
                >
                  Xem chi tiết bảng giá
                </button>
              </div>
              <div className="w-full lg:w-1/2">
                <div className="bg-gradient-to-br from-purple-900/20 to-neutral-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[50px] rounded-bl-full"></div>
                  <h3 className="font-hero text-2xl font-medium text-white mb-6 relative z-10 flex items-center gap-3">
                    <Award className="text-purple-400" />
                    Quyền lợi thành viên
                  </h3>
                  <ul className="space-y-5 relative z-10">
                    {[
                      'Chiết khấu lên đến 15% mọi dịch vụ',
                      'Đặt lịch trước tối đa 14 ngày',
                      'Cộng 10 điểm thưởng khi thanh toán online',
                      'Thăng hạng tự động khi đủ điểm',
                      'Ưu đãi độc quyền cho hạng Platinum',
                      'Hỗ trợ ưu tiên qua hotline riêng',
                    ].map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-purple-400 mt-0.5 text-xs">◆</span>
                        <span className="text-white/80 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 bg-neutral-950 border-t border-white/5 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.15),transparent_50%)]"></div>
          <div className="container mx-auto px-6 relative z-10">
            <h2 className="font-hero text-4xl md:text-5xl font-medium text-white tracking-tight mb-6">Sẵn sàng trải nghiệm?</h2>
            <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
              Đặt lịch ngay hôm nay để trải nghiệm dịch vụ chăm sóc xe đẳng cấp tại AutoWash Pro!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleBookingClick}
                className="px-10 py-4 bg-cyan-500 text-black font-medium rounded-full hover:bg-cyan-400 transition-all text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
              >
                Đặt lịch ngay
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-10 py-4 border border-cyan-500/50 text-cyan-400 rounded-full hover:bg-cyan-500/10 transition-all text-sm font-medium"
              >
                Liên hệ tư vấn
              </button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
