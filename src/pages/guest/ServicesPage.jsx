import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Clock, ShieldCheck, PenTool, Award } from 'lucide-react';

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
    <div className="min-h-screen font-body text-white/60 bg-black flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* HERO SECTION */}
        <section className="relative py-32 bg-black overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),transparent_50%)]"></div>
          <div className="absolute top-[10%] left-[10%] w-[30rem] h-[30rem] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10 text-center">
            <div className="mb-6">
              <span className="text-cyan-400 tracking-widest text-sm font-hero font-medium uppercase">dịch vụ của chúng tôi</span>
            </div>
            
            <h1 className="font-hero text-5xl md:text-6xl font-medium text-white tracking-tight leading-tight mb-6">
              Trải nghiệm dịch vụ <br />
              <span className="text-white/80">
                chăm sóc xe đỉnh cao
              </span>
            </h1>
            
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              Quy trình chuyên nghiệp, công nghệ hiện đại, đội ngũ tận tâm
            </p>
          </div>
        </section>

        {/* SERVICE DETAIL SECTION */}
        <section className="py-24 bg-neutral-950 border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 right-0 w-[40rem] h-[40rem] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
          <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10">
            
            {/* Block 1 — Rửa xe cơ bản */}
            <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
              <div className="w-full lg:w-1/2 relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative border border-white/10">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent"></div>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <span className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium tracking-widest uppercase rounded-sm mb-6">
                  GÓI CƠ BẢN
                </span>
                <h2 className="font-hero text-4xl font-medium text-white mb-6">Rửa xe cơ bản</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <span className="text-white text-3xl font-medium">40.000đ</span>
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock size={18} />
                    <span>15 phút</span>
                  </div>
                  <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium rounded-full shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                    +40 điểm tích lũy
                  </div>
                </div>
                
                <div className="border-t border-white/10 mb-8"></div>
                
                <ul className="space-y-4 mb-10">
                  {[
                    "Xịt nước rửa bụi bẩn bề mặt",
                    "Phun xà bông bọt tuyết toàn thân xe",
                    "Rửa sạch bằng nước áp lực cao",
                    "Lau khô bằng khăn microfiber"
                  ].map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-cyan-400 mt-1 text-xs">◆</span>
                      <span className="text-white/80">{step}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleBookingClick}
                    className="px-8 py-3 bg-cyan-500 text-black font-medium rounded-full hover:bg-cyan-400 transition-all duration-300 text-sm text-center shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                  >
                    Đặt lịch ngay
                  </button>
                  <button 
                    onClick={() => navigate('/pricing')}
                    className="px-8 py-3 text-cyan-400 font-medium border border-cyan-500/50 rounded-full hover:bg-cyan-500/10 transition-all duration-300 text-sm text-center"
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
                  <span className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium tracking-widest uppercase rounded-sm">
                    GÓI CHUYÊN SÂU
                  </span>
                  <span className="inline-block px-3 py-1 bg-purple-500 text-white text-xs font-medium tracking-widest uppercase rounded-sm shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                    PHỔ BIẾN NHẤT
                  </span>
                </div>
                <h2 className="font-hero text-4xl font-medium text-white mb-6">Rửa xe chuyên sâu</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <span className="text-white text-3xl font-medium">150.000đ</span>
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock size={18} />
                    <span>30 phút</span>
                  </div>
                  <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 text-sm font-medium rounded-full shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    +150 điểm tích lũy
                  </div>
                </div>
                
                <div className="border-t border-white/10 mb-8"></div>
                
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
                      <span className="text-purple-400 mt-1 text-xs">◆</span>
                      <span className="text-white/80">{step}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleBookingClick}
                    className="px-8 py-3 bg-cyan-500 text-black font-medium rounded-full hover:bg-cyan-400 transition-all duration-300 text-sm text-center shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                  >
                    Đặt lịch ngay
                  </button>
                  <button 
                    onClick={() => navigate('/pricing')}
                    className="px-8 py-3 text-cyan-400 font-medium border border-cyan-500/50 rounded-full hover:bg-cyan-500/10 transition-all duration-300 text-sm text-center"
                  >
                    Xem bảng giá
                  </button>
                </div>
              </div>
              <div className="w-full lg:w-1/2 relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative border border-white/10">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent"></div>
                </div>
              </div>
            </div>

            {/* Block 3 — Phủ nano */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-1/2 relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative border border-white/10">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent"></div>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <span className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium tracking-widest uppercase rounded-sm mb-6 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  GÓI CAO CẤP
                </span>
                <h2 className="font-hero text-4xl font-medium text-white mb-6 group-hover:text-purple-400 transition-colors">Rửa xe & Phủ nano ceramic</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <span className="text-white text-3xl font-medium">300.000đ</span>
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock size={18} />
                    <span>60 phút</span>
                  </div>
                  <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 text-sm font-medium rounded-full shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    +300 điểm tích lũy
                  </div>
                </div>
                
                <div className="border-t border-white/10 mb-8"></div>
                
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
                      <span className="text-purple-400 mt-1 text-xs">◆</span>
                      <span className="text-white/80">{step}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleBookingClick}
                    className="px-8 py-3 bg-purple-500 text-white font-medium rounded-full hover:bg-purple-400 transition-all duration-300 text-sm text-center shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                  >
                    Đặt lịch ngay
                  </button>
                  <button 
                    onClick={() => navigate('/pricing')}
                    className="px-8 py-3 text-purple-400 font-medium border border-purple-500/50 rounded-full hover:bg-purple-500/10 transition-all duration-300 text-sm text-center"
                  >
                    Xem bảng giá
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-[40rem] h-[20rem] bg-cyan-500/10 blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
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

        {/* CTA SECTION */}
        <section className="py-20 bg-neutral-950 border-t border-white/5 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.15),transparent_50%)]"></div>
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
