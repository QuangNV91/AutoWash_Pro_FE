import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { 
  Car, Star, Calendar, Clock, Award, CheckCircle, 
  MapPin, Phone, Menu, X, ArrowRight, ShieldCheck,
  Droplets, Sparkles, ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check auth
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Handle smooth scroll for anchor links
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

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen font-body text-text-secondary bg-dark-950 flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-dark-950">
          {/* Background image & overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/90 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10 flex flex-col justify-center h-full pb-32">
            <div className="flex flex-col lg:flex-row items-center gap-12 mt-12">
              {/* Left text */}
              <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
                <div className="inline-block mb-4">
                  <span className="text-gold-500 tracking-widest text-sm font-semibold uppercase">✦ Hệ thống chuyên nghiệp</span>
                </div>
                
                <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-tight mb-6">
                  Rửa xe thông minh <br />
                  <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
                    Đẳng cấp vượt trội
                  </span>
                </h1>
                
                <p className="text-lg text-text-secondary mb-10 max-w-lg leading-relaxed">
                  Hệ thống đặt lịch tự động, tích điểm thưởng, ưu đãi thành viên hấp dẫn. 
                  Tiết kiệm thời gian, trải nghiệm dịch vụ chăm sóc hoàn mỹ cho xế yêu của bạn.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button 
                    onClick={handleBookingClick}
                    className="px-8 py-4 bg-gold-500 text-dark-950 font-semibold rounded-full hover:bg-gold-400 transition-all duration-300 shadow-[0_0_20px_rgba(201,152,26,0.3)] hover:shadow-[0_0_30px_rgba(201,152,26,0.5)] flex items-center justify-center gap-2 text-lg"
                  >
                    <Calendar size={20} />
                    Đặt lịch ngay
                  </button>
                  <button 
                    onClick={() => navigate('/services')}
                    className="px-8 py-4 text-gold-500 font-semibold border border-gold-500 rounded-full hover:bg-gold-500 hover:text-dark-950 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                  >
                    Xem dịch vụ
                  </button>
                </div>
              </div>
              
              {/* Right Image/Illustration */}
              <div className="w-full lg:w-1/2 relative hidden lg:block">
                <div className="relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(201,152,26,0.15)] aspect-[4/3] group border border-dark-600/50">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent"></div>
                  
                  {/* Decorative float element */}
                  <div className="absolute bottom-8 left-8 bg-dark-900/80 backdrop-blur-md p-4 rounded-xl border border-dark-600 shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400">
                        <Star size={24} className="fill-gold-400" />
                      </div>
                      <div>
                        <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Đánh giá 5 sao</p>
                        <p className="text-sm font-bold text-text-primary">Dịch vụ tuyệt vời</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-dark-800/80 backdrop-blur-md border-t border-dark-600 py-8 z-20">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-dark-600">
                <div className="pt-4 md:pt-0">
                  <p className="font-heading text-4xl font-bold text-gold-400 mb-1">1.000+</p>
                  <p className="text-sm font-medium text-text-secondary uppercase tracking-widest">Khách hàng</p>
                </div>
                <div className="pt-4 md:pt-0">
                  <p className="font-heading text-4xl font-bold text-gold-400 mb-1">3</p>
                  <p className="text-sm font-medium text-text-secondary uppercase tracking-widest">Gói dịch vụ</p>
                </div>
                <div className="pt-4 md:pt-0 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-heading text-4xl font-bold text-gold-400">4.9</p>
                    <Star size={24} className="text-gold-400 fill-gold-400" />
                  </div>
                  <p className="text-sm font-medium text-text-secondary uppercase tracking-widest">Đánh giá</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="dich-vu" className="py-32 bg-dark-900">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-20 max-w-2xl mx-auto">
              <span className="text-gold-500 tracking-widest text-sm font-semibold uppercase">✦ Dịch vụ</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-text-primary mt-4 mb-6">Gói dịch vụ của chúng tôi</h2>
              <p className="text-text-secondary text-lg">
                Đa dạng các gói chăm sóc, phù hợp với mọi nhu cầu của bạn. Mức giá minh bạch, chất lượng hoàn hảo.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Basic Package */}
              <div className="bg-dark-800 border border-dark-600 rounded-2xl p-8 hover:border-gold-500/50 transition-all duration-300 group">
                <Droplets size={40} className="text-gold-400 mb-6" />
                <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">Rửa xe cơ bản</h3>
                <p className="text-text-secondary text-sm mb-6 min-h-[40px]">Làm sạch bề mặt ngoài, hút bụi sơ bộ bên trong nội thất.</p>
                
                <div className="border-t border-dark-600 my-6"></div>
                
                <div className="flex items-center gap-3 text-text-muted text-sm mb-6">
                  <Clock size={16} />
                  <span>15 phút thực hiện</span>
                </div>
                
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-gold-400">40.000</span>
                  <span className="text-text-secondary font-medium">đ</span>
                </div>
                
                <div className="inline-flex items-center gap-2 bg-gold-500/10 text-gold-400 px-3 py-1 rounded-full text-sm font-semibold mb-8">
                  <span>+40 điểm</span>
                </div>
                
                <button 
                  onClick={handleBookingClick}
                  className="w-full py-3 rounded-full border border-gold-500 text-gold-500 font-semibold group-hover:bg-gold-500 group-hover:text-dark-950 transition-all duration-300"
                >
                  Đặt lịch ngay
                </button>
              </div>

              {/* Advanced Package - Highlighted */}
              <div className="bg-dark-800 border-2 border-gold-500 rounded-2xl p-10 relative transform lg:-translate-y-4 shadow-[0_0_30px_rgba(201,152,26,0.15)] group">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-500 text-dark-950 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  Phổ biến nhất
                </div>
                
                <Car size={48} className="text-gold-500 mb-6" />
                <h3 className="font-heading text-3xl font-bold text-text-primary mb-3">Rửa xe chuyên sâu</h3>
                <p className="text-text-secondary text-sm mb-6 min-h-[40px]">Rửa chi tiết bọt tuyết, hút bụi kỹ, dưỡng bóng sơn & lốp xe.</p>
                
                <div className="border-t border-dark-600 my-6"></div>
                
                <div className="flex items-center gap-3 text-text-muted text-sm mb-6">
                  <Clock size={16} />
                  <span>30 phút thực hiện</span>
                </div>
                
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-bold text-gold-500">150.000</span>
                  <span className="text-text-secondary font-medium">đ</span>
                </div>
                
                <div className="inline-flex items-center gap-2 bg-gold-500/15 text-gold-400 px-3 py-1 rounded-full text-sm font-semibold mb-8 border border-gold-500/30">
                  <span>+150 điểm</span>
                </div>
                
                <button 
                  onClick={handleBookingClick}
                  className="w-full py-4 rounded-full bg-gold-500 text-dark-950 font-bold hover:bg-gold-400 shadow-[0_0_20px_rgba(201,152,26,0.3)] transition-all duration-300"
                >
                  Đặt lịch ngay
                </button>
              </div>

              {/* Premium Package */}
              <div className="bg-dark-800 border border-dark-600 rounded-2xl p-8 hover:border-gold-500/50 transition-all duration-300 group">
                <Sparkles size={40} className="text-gold-400 mb-6" />
                <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">Phủ nano</h3>
                <p className="text-text-secondary text-sm mb-6 min-h-[40px]">Quy trình cao cấp: rửa siêu chi tiết, đánh bóng và phủ bảo vệ.</p>
                
                <div className="border-t border-dark-600 my-6"></div>
                
                <div className="flex items-center gap-3 text-text-muted text-sm mb-6">
                  <Clock size={16} />
                  <span>60 phút thực hiện</span>
                </div>
                
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-gold-400">300.000</span>
                  <span className="text-text-secondary font-medium">đ</span>
                </div>
                
                <div className="inline-flex items-center gap-2 bg-gold-500/10 text-gold-400 px-3 py-1 rounded-full text-sm font-semibold mb-8">
                  <span>+300 điểm</span>
                </div>
                
                <button 
                  onClick={handleBookingClick}
                  className="w-full py-3 rounded-full border border-gold-500 text-gold-500 font-semibold group-hover:bg-gold-500 group-hover:text-dark-950 transition-all duration-300"
                >
                  Đặt lịch ngay
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="huong-dan" className="py-32 bg-dark-950 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dark-900/50 via-dark-950 to-dark-950"></div>
          
          <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
            <div className="text-center mb-20 max-w-2xl mx-auto">
              <span className="text-gold-500 tracking-widest text-sm font-semibold uppercase">✦ Hướng dẫn</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-text-primary mt-4 mb-6">Chỉ 3 bước đơn giản</h2>
              <p className="text-text-secondary text-lg">
                Trải nghiệm quy trình dịch vụ tối ưu, hoàn toàn trực tuyến và không cần chờ đợi.
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-12 relative mt-16">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] border-t border-dashed border-dark-600 -z-10"></div>
              
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center flex-1 relative px-4">
                <div className="absolute -top-12 -left-6 text-9xl font-bold text-gold-500/5 select-none font-heading -z-10">01</div>
                <div className="w-24 h-24 bg-dark-800 border border-dark-600 shadow-xl rounded-2xl flex items-center justify-center text-gold-400 mb-8 rotate-3 transition-transform hover:rotate-0 duration-300">
                  <Calendar size={40} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-text-primary mb-4">Chọn dịch vụ & giờ</h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-xs mx-auto">
                  Truy cập nền tảng, chọn gói dịch vụ mong muốn và khung giờ trống phù hợp với lịch trình của bạn.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center flex-1 relative px-4 mt-12 md:mt-0">
                <div className="absolute -top-12 -left-6 text-9xl font-bold text-gold-500/5 select-none font-heading -z-10">02</div>
                <div className="w-24 h-24 bg-dark-800 border border-dark-600 shadow-xl rounded-2xl flex items-center justify-center text-gold-400 mb-8 -rotate-3 transition-transform hover:rotate-0 duration-300">
                  <MapPin size={40} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-text-primary mb-4">Thanh toán & Xác nhận</h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-xs mx-auto">
                  Lựa chọn thanh toán trước qua ví VNPAY hoặc thanh toán trực tiếp. Nhận thông báo xác nhận tức thì.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center flex-1 relative px-4 mt-12 md:mt-0">
                <div className="absolute -top-12 -left-6 text-9xl font-bold text-gold-500/5 select-none font-heading -z-10">03</div>
                <div className="w-24 h-24 bg-dark-800 border border-dark-600 shadow-xl rounded-2xl flex items-center justify-center text-gold-400 mb-8 rotate-3 transition-transform hover:rotate-0 duration-300">
                  <Award size={40} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-text-primary mb-4">Sử dụng & Tích điểm</h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-xs mx-auto">
                  Mang xe đến đúng giờ. Sau khi hoàn thành, hệ thống tự động cộng điểm thưởng vào tài khoản của bạn.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LOYALTY SECTION */}
        <section id="loyalty" className="py-32 bg-dark-900 border-t border-dark-800">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-20 max-w-2xl mx-auto">
              <span className="text-gold-500 tracking-widest text-sm font-semibold uppercase">✦ Đặc quyền</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-text-primary mt-4 mb-6">Chương trình khách hàng thân thiết</h2>
              <p className="text-text-secondary text-lg">
                Hạng thẻ càng cao, ưu đãi chiết khấu càng lớn. Điểm tích lũy dựa trên mức chi tiêu tại hệ thống.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Member */}
              <div className="bg-dark-800 border border-dark-600 rounded-2xl p-8 flex flex-col items-center text-center hover:border-gold-500/30 transition-all duration-300">
                <ShieldCheck size={48} className="text-text-muted mb-6" />
                <h3 className="text-2xl font-bold text-text-muted mb-2 tracking-wide">MEMBER</h3>
                <p className="text-text-secondary text-sm mb-8">Mặc định đăng ký</p>
                <div className="mt-auto bg-dark-700 w-full py-3 rounded-lg border border-dark-600">
                  <p className="font-semibold text-text-secondary">Chiết khấu 0%</p>
                </div>
              </div>

              {/* Silver */}
              <div className="bg-dark-800 border border-[#C0C0C0]/40 rounded-2xl p-8 flex flex-col items-center text-center hover:border-[#C0C0C0] transition-all duration-300 shadow-[0_0_20px_rgba(192,192,192,0.05)]">
                <ShieldCheck size={48} className="text-[#C0C0C0] mb-6" />
                <h3 className="text-2xl font-bold text-[#C0C0C0] mb-2 tracking-wide">SILVER</h3>
                <p className="text-text-secondary text-sm mb-8">Từ 500 điểm</p>
                <div className="mt-auto bg-[#C0C0C0]/10 w-full py-3 rounded-lg border border-[#C0C0C0]/20">
                  <p className="font-bold text-[#C0C0C0]">Chiết khấu 5%</p>
                </div>
              </div>

              {/* Gold */}
              <div className="bg-gold-500/5 border-2 border-gold-500/60 rounded-2xl p-8 flex flex-col items-center text-center hover:border-gold-500 transition-all duration-300 shadow-[0_0_30px_rgba(201,152,26,0.15)] transform lg:-translate-y-4">
                <ShieldCheck size={48} className="text-gold-500 mb-6 drop-shadow-[0_0_10px_rgba(201,152,26,0.5)]" />
                <h3 className="text-2xl font-bold text-gold-400 mb-2 tracking-wide">GOLD</h3>
                <p className="text-gold-400/80 text-sm mb-8">Từ 1.500 điểm</p>
                <div className="mt-auto bg-gold-500/20 w-full py-3 rounded-lg border border-gold-500/40">
                  <p className="font-bold text-gold-300 text-lg">Chiết khấu 10%</p>
                </div>
              </div>

              {/* Platinum */}
              <div className="bg-dark-800 border border-purple-500/40 rounded-2xl p-8 flex flex-col items-center text-center hover:border-purple-500/80 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                <ShieldCheck size={48} className="text-purple-400 mb-6" />
                <h3 className="text-2xl font-bold text-purple-400 mb-2 tracking-wide">PLATINUM</h3>
                <p className="text-text-secondary text-sm mb-8">Từ 3.000 điểm</p>
                <div className="mt-auto bg-purple-500/10 w-full py-3 rounded-lg border border-purple-500/30">
                  <p className="font-bold text-purple-300">Chiết khấu 15%</p>
                </div>
              </div>
            </div>

            {!isLoggedIn && (
              <div className="mt-20 text-center">
                <button 
                  onClick={() => navigate('/auth/register')}
                  className="px-10 py-5 bg-gold-500 text-dark-950 font-bold rounded-full hover:bg-gold-400 shadow-[0_0_30px_rgba(201,152,26,0.4)] transition-all inline-flex items-center gap-3 text-lg"
                >
                  Tham gia ngay để nhận ưu đãi <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

