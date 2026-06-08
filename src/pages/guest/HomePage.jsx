import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Clock, ShieldCheck, PenTool, Award, Star } from 'lucide-react';

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
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section id="hero" className="relative h-screen flex items-center bg-dark-950 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/80 to-transparent"></div>
          
          <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
            <div className="w-full lg:w-1/2">
              <span className="inline-block mb-4 text-gold-500 tracking-widest text-sm font-semibold uppercase">
                ✦ Hệ thống chuyên nghiệp
              </span>
              
              <h1 className="font-heading text-6xl md:text-7xl font-bold text-text-primary leading-tight mb-6">
                Rửa xe thông minh <br />
                <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
                  Đẳng cấp vượt trội
                </span>
              </h1>
              
              <p className="text-lg text-text-secondary max-w-lg leading-relaxed mb-10">
                Trải nghiệm dịch vụ chăm sóc xế yêu hoàn hảo với công nghệ hiện đại, đặt lịch nhanh chóng và đội ngũ kỹ thuật viên tận tâm.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleBookingClick}
                  className="px-8 py-4 bg-gold-500 text-dark-950 font-bold rounded-full hover:bg-gold-400 transition-all duration-300 shadow-[0_0_20px_rgba(201,152,26,0.3)] text-center text-lg"
                >
                  Đặt lịch ngay
                </button>
                <button 
                  onClick={() => navigate('/services')}
                  className="px-8 py-4 text-gold-500 font-bold border-2 border-gold-500 rounded-full hover:bg-gold-500 hover:text-dark-950 transition-all duration-300 text-center text-lg"
                >
                  Xem dịch vụ
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-12 bg-dark-900 border-y border-dark-800">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-dark-800">
              <div className="text-center px-4">
                <p className="text-4xl font-bold text-gold-400 mb-2">1000+</p>
                <p className="text-text-secondary text-sm uppercase tracking-wider">Khách hàng</p>
              </div>
              <div className="text-center px-4">
                <p className="text-4xl font-bold text-gold-400 mb-2">3</p>
                <p className="text-text-secondary text-sm uppercase tracking-wider">Gói dịch vụ</p>
              </div>
              <div className="text-center px-4">
                <p className="text-4xl font-bold text-gold-400 mb-2">4.9/5</p>
                <p className="text-text-secondary text-sm uppercase tracking-wider">Đánh giá</p>
              </div>
              <div className="text-center px-4">
                <p className="text-4xl font-bold text-gold-400 mb-2">24/7</p>
                <p className="text-text-secondary text-sm uppercase tracking-wider">Hỗ trợ</p>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES PREVIEW */}
        <section className="py-24 bg-dark-950">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-16">
              <span className="text-gold-500 tracking-widest text-sm font-semibold uppercase mb-4 inline-block">✦ Dịch vụ nổi bật</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-text-primary">Chăm sóc toàn diện</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Rửa xe cơ bản',
                  price: '40.000đ',
                  time: '15 phút',
                  desc: 'Rửa sạch bụi bẩn bề mặt, phun bọt tuyết toàn thân xe và lau khô bằng khăn microfiber.',
                  img: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=2069&auto=format&fit=crop'
                },
                {
                  title: 'Rửa xe chuyên sâu',
                  price: '150.000đ',
                  time: '30 phút',
                  desc: 'Bao gồm gói cơ bản, vệ sinh sên xích, lốc máy, phanh và kiểm tra áp suất lốp.',
                  img: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop',
                  popular: true
                },
                {
                  title: 'Phủ nano ceramic',
                  price: '300.000đ',
                  time: '60 phút',
                  desc: 'Đánh bóng, tẩy xước sơn và phủ lớp nano bảo vệ chống bám nước, bụi bẩn hoàn hảo.',
                  img: 'https://images.unsplash.com/photo-1550355191-aa8a80b41353?q=80&w=2070&auto=format&fit=crop'
                }
              ].map((service, idx) => (
                <div key={idx} className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden hover:border-gold-500/30 transition-all duration-300 group">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <div className={`absolute inset-0 bg-[url('${service.img}')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent"></div>
                    {service.popular && (
                      <div className="absolute top-4 right-4 bg-gold-500 text-dark-950 text-xs font-bold px-3 py-1 rounded-full">
                        PHỔ BIẾN NHẤT
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="font-heading text-2xl font-bold text-text-primary mb-2">{service.title}</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-gold-400 font-bold">{service.price}</span>
                      <span className="text-text-muted">•</span>
                      <span className="text-text-secondary text-sm flex items-center gap-1">
                        <Clock size={14} /> {service.time}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm mb-8 leading-relaxed">
                      {service.desc}
                    </p>
                    <button 
                      onClick={() => navigate('/services')}
                      className="w-full py-3 border border-gold-500/50 text-gold-500 rounded-full hover:bg-gold-500 hover:text-dark-950 transition-colors font-semibold"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
