import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Clock, ShieldCheck, PenTool, Award, Star } from 'lucide-react';

export default function ServicesPage() {
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
          {/* Background: gradient tối + subtle gold radial glow góc trên phải */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-500/10 via-dark-950 to-dark-950"></div>
          
          <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10 text-center">
            <div className="inline-block mb-6">
              <span className="text-gold-500 tracking-widest text-sm font-semibold uppercase">✦ Dịch vụ của chúng tôi</span>
            </div>
            
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-text-primary leading-tight mb-6">
              Trải nghiệm dịch vụ <br />
              <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
                chăm sóc xe đỉnh cao
              </span>
            </h1>
            
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Quy trình chuyên nghiệp, công nghệ hiện đại, đội ngũ tận tâm
            </p>
          </div>
        </section>

        {/* SERVICE DETAIL SECTION */}
        <section id="banggia" className="py-24 bg-dark-900 border-t border-dark-800">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            
            {/* Block 1 — Rửa xe cơ bản */}
            <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
              <div className="w-full lg:w-1/2 relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 to-transparent"></div>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <span className="inline-block px-3 py-1 bg-dark-700 text-text-muted text-xs font-bold tracking-widest rounded-sm mb-6">
                  GÓI CƠ BẢN
                </span>
                <h2 className="font-heading text-4xl font-bold text-text-primary mb-6">Rửa xe cơ bản</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <span className="text-gold-400 text-3xl font-bold">40.000đ</span>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Clock size={18} />
                    <span>15 phút</span>
                  </div>
                  <div className="px-3 py-1 bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm font-semibold rounded-full">
                    +40 điểm tích lũy
                  </div>
                </div>
                
                <div className="border-t border-dark-600 mb-8"></div>
                
                <ul className="space-y-4 mb-10">
                  {[
                    "Xịt nước rửa bụi bẩn bề mặt",
                    "Phun xà bông bọt tuyết toàn thân xe",
                    "Rửa sạch bằng nước áp lực cao",
                    "Lau khô bằng khăn microfiber"
                  ].map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-gold-500 mt-1 text-xs">✦</span>
                      <span className="text-text-secondary">{step}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleBookingClick}
                    className="px-8 py-3.5 bg-gold-500 text-dark-950 font-semibold rounded-full hover:bg-gold-400 transition-all duration-300 shadow-[0_0_20px_rgba(201,152,26,0.3)] text-center"
                  >
                    Đặt lịch ngay
                  </button>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('banggia');
                      if(el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-3.5 text-gold-500 font-semibold border border-gold-500 rounded-full hover:bg-gold-500 hover:text-dark-950 transition-all duration-300 text-center"
                  >
                    Xem bảng giá
                  </button>
                </div>
              </div>
            </div>

            {/* Block 2 — Rửa xe chuyên sâu */}
            <div className="flex flex-col-reverse lg:flex-row items-center gap-16 mb-32">
              <div className="w-full lg:w-1/2">
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-block px-3 py-1 bg-dark-700 text-text-muted text-xs font-bold tracking-widest rounded-sm">
                    GÓI CHUYÊN SÂU
                  </span>
                  <span className="inline-block px-3 py-1 bg-gold-500 text-dark-950 text-xs font-bold tracking-widest rounded-sm shadow-md">
                    PHỔ BIẾN NHẤT
                  </span>
                </div>
                <h2 className="font-heading text-4xl font-bold text-text-primary mb-6">Rửa xe chuyên sâu</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <span className="text-gold-400 text-3xl font-bold">150.000đ</span>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Clock size={18} />
                    <span>30 phút</span>
                  </div>
                  <div className="px-3 py-1 bg-gold-500/15 border border-gold-500/30 text-gold-400 text-sm font-semibold rounded-full shadow-[0_0_15px_rgba(201,152,26,0.15)]">
                    +150 điểm tích lũy
                  </div>
                </div>
                
                <div className="border-t border-dark-600 mb-8"></div>
                
                <ul className="space-y-4 mb-10">
                  {[
                    "Toàn bộ quy trình gói Cơ bản",
                    "Vệ sinh sên xích, tra dầu bôi trơn",
                    "Rửa sạch lốc máy, khu vực động cơ",
                    "Vệ sinh phanh, vành xe",
                    "Lau bóng nhựa, cao su",
                    "Kiểm tra áp suất lốp"
                  ].map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-gold-500 mt-1 text-xs">✦</span>
                      <span className="text-text-secondary">{step}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleBookingClick}
                    className="px-8 py-3.5 bg-gold-500 text-dark-950 font-semibold rounded-full hover:bg-gold-400 transition-all duration-300 shadow-[0_0_20px_rgba(201,152,26,0.3)] text-center"
                  >
                    Đặt lịch ngay
                  </button>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('banggia');
                      if(el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-3.5 text-gold-500 font-semibold border border-gold-500 rounded-full hover:bg-gold-500 hover:text-dark-950 transition-all duration-300 text-center"
                  >
                    Xem bảng giá
                  </button>
                </div>
              </div>
              <div className="w-full lg:w-1/2 relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative border border-gold-500/30 shadow-[0_0_40px_rgba(201,152,26,0.15)]">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 to-transparent"></div>
                </div>
              </div>
            </div>

            {/* Block 3 — Phủ nano */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-1/2 relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550355191-aa8a80b41353?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 to-transparent"></div>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <span className="inline-block px-3 py-1 bg-dark-700 text-text-muted text-xs font-bold tracking-widest rounded-sm mb-6">
                  GÓI CAO CẤP
                </span>
                <h2 className="font-heading text-4xl font-bold text-text-primary mb-6">Rửa xe & Phủ nano ceramic</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <span className="text-gold-400 text-3xl font-bold">300.000đ</span>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Clock size={18} />
                    <span>60 phút</span>
                  </div>
                  <div className="px-3 py-1 bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm font-semibold rounded-full">
                    +300 điểm tích lũy
                  </div>
                </div>
                
                <div className="border-t border-dark-600 mb-8"></div>
                
                <ul className="space-y-4 mb-10">
                  {[
                    "Toàn bộ quy trình gói Chuyên sâu",
                    "Đánh bóng bề mặt sơn bằng máy",
                    "Tẩy các vết xước nhỏ, ố vàng",
                    "Phủ lớp nano ceramic bảo vệ sơn",
                    "Xử lý chống bám nước, bụi bẩn",
                    "Kiểm tra tổng thể và bàn giao xe"
                  ].map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-gold-500 mt-1 text-xs">✦</span>
                      <span className="text-text-secondary">{step}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleBookingClick}
                    className="px-8 py-3.5 bg-gold-500 text-dark-950 font-semibold rounded-full hover:bg-gold-400 transition-all duration-300 shadow-[0_0_20px_rgba(201,152,26,0.3)] text-center"
                  >
                    Đặt lịch ngay
                  </button>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('banggia');
                      if(el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-3.5 text-gold-500 font-semibold border border-gold-500 rounded-full hover:bg-gold-500 hover:text-dark-950 transition-all duration-300 text-center"
                  >
                    Xem bảng giá
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className="py-24 bg-dark-950">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-16">
              <span className="text-gold-500 tracking-widest text-sm font-semibold uppercase mb-4 inline-block">✦ Ưu điểm</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-text-primary">Tại sao chọn AutoWash Pro?</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 hover:border-gold-500/50 transition-colors duration-300">
                <PenTool size={40} className="text-gold-400 mb-6" />
                <h3 className="text-lg font-bold text-text-primary mb-3">Thiết bị hiện đại</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Máy rửa áp lực cao, hóa chất chuyên dụng nhập khẩu đảm bảo an toàn cho sơn xe.
                </p>
              </div>

              <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 hover:border-gold-500/50 transition-colors duration-300">
                <Clock size={40} className="text-gold-400 mb-6" />
                <h3 className="text-lg font-bold text-text-primary mb-3">Đúng giờ</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Cam kết hoàn thành đúng thời gian đã đặt. Không để bạn phải chờ đợi lâu.
                </p>
              </div>

              <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 hover:border-gold-500/50 transition-colors duration-300">
                <Award size={40} className="text-gold-400 mb-6" />
                <h3 className="text-lg font-bold text-text-primary mb-3">Thợ lành nghề</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Đội ngũ kỹ thuật viên được đào tạo bài bản, chuyên nghiệp và tỉ mỉ trong từng chi tiết.
                </p>
              </div>

              <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 hover:border-gold-500/50 transition-colors duration-300">
                <ShieldCheck size={40} className="text-gold-400 mb-6" />
                <h3 className="text-lg font-bold text-text-primary mb-3">Bảo đảm chất lượng</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Cam kết mang lại sự hài lòng tuyệt đối. Không hài lòng hoàn tiền 100%.
                </p>
              </div>
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
            <button 
              onClick={handleBookingClick}
              className="px-10 py-5 bg-gold-500 text-dark-950 font-bold rounded-full hover:bg-gold-400 shadow-[0_0_30px_rgba(201,152,26,0.4)] hover:shadow-[0_0_40px_rgba(201,152,26,0.6)] transition-all inline-flex items-center gap-3 text-lg"
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
