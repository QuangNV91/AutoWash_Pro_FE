import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Car, Star, Calendar, Clock, Award, CheckCircle,
  MapPin, Phone, Menu, X, ArrowRight, ShieldCheck,
  Droplets, Sparkles
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check auth
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Handle scroll for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle smooth scroll for anchor links
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
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
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  const navLinks = [
    { name: 'Trang chủ', id: 'hero' },
    { name: 'Dịch vụ', id: 'services' },
    { name: 'Bảng giá', id: 'services' }, // Pointing to services where prices are
    { name: 'Liên hệ', id: 'contact' },
  ];

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gray-50 flex flex-col">
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${isScrolled ? 'shadow-md py-3' : 'py-5'
          }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center max-w-7xl">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection('hero')}
          >
            <div className="bg-primary text-white p-2 rounded-lg">
              <Car size={24} />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              AutoWash Pro
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6 font-medium text-gray-600">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="hover:text-primary transition-colors focus:outline-none"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 ml-4">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.reload();
                  }}
                  className="px-5 py-2.5 text-gray-500 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Đăng xuất
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="px-5 py-2.5 text-primary font-medium border border-primary rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => navigate('/auth/register')}
                    className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Đăng ký
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-600 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 py-4 px-4 flex flex-col gap-4">
            <ul className="flex flex-col gap-4 font-medium text-gray-600">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="w-full text-left py-2 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 mt-2 border-t border-gray-100 pt-4">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.reload();
                  }}
                  className="w-full px-5 py-3 text-gray-500 font-medium border border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors"
                >
                  Đăng xuất
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="w-full px-5 py-3 text-primary font-medium border border-primary rounded-lg text-center"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => navigate('/auth/register')}
                    className="w-full px-5 py-3 bg-primary text-white font-medium rounded-lg text-center"
                  >
                    Đăng ký
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow pt-20">
        {/* HERO SECTION */}
        <section id="hero" className="bg-white py-12 md:py-20 lg:py-28 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-50 opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-50 opacity-50 blur-3xl"></div>

          <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Left text */}
              <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-primary font-medium text-sm mb-6 border border-blue-100">
                  <Star size={16} className="fill-primary" />
                  <span>Dịch vụ chăm sóc xe hàng đầu</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                  Đặt lịch rửa xe <span className="text-primary">thông minh</span> <br className="hidden lg:block" />
                  Nhanh chóng, Tiện lợi
                </h1>

                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
                  Hệ thống đặt lịch tự động, tích điểm thưởng, ưu đãi thành viên hấp dẫn.
                  Tiết kiệm thời gian, trải nghiệm dịch vụ đẳng cấp cho xế yêu của bạn.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button
                    onClick={handleBookingClick}
                    className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 text-lg"
                  >
                    <Calendar size={20} />
                    Đặt lịch ngay
                  </button>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="px-8 py-4 text-gray-700 font-bold bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-lg"
                  >
                    Xem dịch vụ
                  </button>
                </div>

                {/* Stats */}
                <div className="mt-12 flex items-center gap-6 md:gap-12 pt-8 border-t border-gray-100 w-full justify-center lg:justify-start">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">1000+</p>
                    <p className="text-sm font-medium text-gray-500 mt-1">Khách hàng</p>
                  </div>
                  <div className="w-px h-12 bg-gray-200"></div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">3</p>
                    <p className="text-sm font-medium text-gray-500 mt-1">Gói dịch vụ</p>
                  </div>
                  <div className="w-px h-12 bg-gray-200"></div>
                  <div>
                    <div className="flex items-center gap-1 text-3xl font-bold text-gray-900">
                      4.9 <Star size={24} className="fill-yellow-400 text-yellow-400 -mt-1" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 mt-1">Đánh giá</p>
                  </div>
                </div>
              </div>

              {/* Right Image/Illustration */}
              <div className="w-full lg:w-1/2 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-200 aspect-[4/3] group">
                  {/* Using a solid colored placeholder with an icon as a mockup since we don't have actual images */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                    <Car size={120} className="text-primary opacity-20 transform group-hover:scale-110 transition-transform duration-700" />
                  </div>

                  {/* Decorative UI elements overlay */}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <CheckCircle size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Lịch đặt mới</p>
                        <p className="text-sm font-bold text-gray-800">Xe 30A-123.xx (15:00)</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-primary">
                        <Award size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Tích lũy</p>
                        <p className="text-sm font-bold text-primary">+150 điểm</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gói dịch vụ của chúng tôi</h2>
              <p className="text-gray-600 text-lg">
                Đa dạng các gói chăm sóc, phù hợp với mọi nhu cầu của bạn. Mức giá minh bạch, chất lượng hoàn hảo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Basic Package */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-primary mb-6">
                  <Droplets size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Rửa xe cơ bản</h3>
                <p className="text-gray-500 mb-6 min-h-[48px]">Làm sạch bề mặt ngoài, hút bụi sơ bộ bên trong nội thất.</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-gray-900">40.000</span>
                  <span className="text-gray-500 font-medium">đ</span>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-600 font-medium">
                    <Clock size={18} className="text-primary" /> 15 phút thực hiện
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 font-medium">
                    <Award size={18} className="text-primary" /> Tích lũy <span className="text-primary font-bold">+40</span> điểm
                  </li>
                </ul>

                <button
                  onClick={handleBookingClick}
                  className="w-full py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-bold hover:border-primary hover:text-primary transition-colors"
                >
                  Đặt lịch ngay
                </button>
              </div>

              {/* Advanced Package - Highlighted */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-primary p-8 relative transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                  Phổ biến nhất
                </div>
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white mb-6 shadow-md">
                  <Car size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Rửa xe chuyên sâu</h3>
                <p className="text-gray-500 mb-6 min-h-[48px]">Rửa chi tiết bọt tuyết, hút bụi kỹ, dưỡng bóng sơn & lốp xe.</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-primary">150.000</span>
                  <span className="text-gray-500 font-medium">đ</span>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <Clock size={18} className="text-primary" /> 30 phút thực hiện
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 font-medium">
                    <Award size={18} className="text-primary" /> Tích lũy <span className="text-primary font-bold">+150</span> điểm
                  </li>
                </ul>

                <button
                  onClick={handleBookingClick}
                  className="w-full py-3.5 rounded-lg bg-primary text-white font-bold hover:bg-blue-700 transition-colors shadow-md"
                >
                  Đặt lịch ngay
                </button>
              </div>

              {/* Premium Package */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                  <Sparkles size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Phủ nano</h3>
                <p className="text-gray-500 mb-6 min-h-[48px]">Quy trình cao cấp: rửa siêu chi tiết, đánh bóng và phủ lớp bảo vệ Nano.</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-gray-900">300.000</span>
                  <span className="text-gray-500 font-medium">đ</span>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-600 font-medium">
                    <Clock size={18} className="text-purple-600" /> 60 phút thực hiện
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 font-medium">
                    <Award size={18} className="text-purple-600" /> Tích lũy <span className="text-purple-600 font-bold">+300</span> điểm
                  </li>
                </ul>

                <button
                  onClick={handleBookingClick}
                  className="w-full py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-bold hover:border-purple-600 hover:text-purple-600 transition-colors"
                >
                  Đặt lịch ngay
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* LOYALTY SECTION */}
        <section className="py-20 bg-primary text-white relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-20 -mt-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-20 -mb-20"></div>

          <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">

              {/* Left Content */}
              <div className="w-full lg:w-5/12">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium text-sm mb-6 uppercase tracking-wider">
                  Đặc quyền thành viên
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Chương trình khách hàng thân thiết
                </h2>
                <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                  Trở thành thành viên của AutoWash Pro để được tích điểm sau mỗi lần sử dụng dịch vụ.
                  Hạng thẻ càng cao, ưu đãi chiết khấu càng lớn.
                </p>
                {!isLoggedIn && (
                  <button
                    onClick={() => navigate('/auth/register')}
                    className="px-8 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-2"
                  >
                    Đăng ký thành viên miễn phí <ArrowRight size={20} />
                  </button>
                )}
              </div>

              {/* Right Tier Cards */}
              <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Member */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex flex-col items-center text-center hover:bg-white/15 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mb-4 shadow-inner">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-200 mb-1 tracking-wide">MEMBER</h3>
                  <p className="text-blue-200 text-sm mb-4">Mặc định khi đăng ký</p>
                  <div className="mt-auto bg-white/10 w-full py-2 rounded-lg">
                    <p className="font-medium text-white">Chiết khấu 0%</p>
                  </div>
                </div>

                {/* Silver */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex flex-col items-center text-center hover:bg-white/15 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-400 flex items-center justify-center text-gray-700 mb-4 shadow-inner border border-gray-300">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-100 mb-1 tracking-wide">SILVER</h3>
                  <p className="text-blue-200 text-sm mb-4">Từ 500 điểm</p>
                  <div className="mt-auto bg-white/10 w-full py-2 rounded-lg">
                    <p className="font-bold text-white">Chiết khấu 5%</p>
                  </div>
                </div>

                {/* Gold */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-yellow-400/50 flex flex-col items-center text-center hover:bg-white/15 transition-colors relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-500 flex items-center justify-center text-yellow-800 mb-4 shadow-inner border border-yellow-300">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-1 tracking-wide">GOLD</h3>
                  <p className="text-blue-200 text-sm mb-4">Từ 1.500 điểm</p>
                  <div className="mt-auto bg-yellow-400/20 w-full py-2 rounded-lg border border-yellow-400/30">
                    <p className="font-bold text-yellow-300">Chiết khấu 10%</p>
                  </div>
                </div>

                {/* Platinum */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-400/50 flex flex-col items-center text-center hover:bg-white/15 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-500 flex items-center justify-center text-purple-900 mb-4 shadow-inner border border-purple-300">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-purple-300 mb-1 tracking-wide">PLATINUM</h3>
                  <p className="text-blue-200 text-sm mb-4">Từ 3.000 điểm</p>
                  <div className="mt-auto bg-purple-500/20 w-full py-2 rounded-lg border border-purple-400/30">
                    <p className="font-bold text-purple-200">Chiết khấu 15%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Chỉ 3 bước đơn giản</h2>
              <p className="text-gray-600 text-lg">
                Trải nghiệm quy trình dịch vụ tối ưu, không cần chờ đợi.
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-1 bg-gray-100 -z-10"></div>

              {/* Step 1 */}
              <div className="flex flex-col items-center text-center w-full md:w-1/3 bg-white z-10 px-4">
                <div className="w-20 h-20 bg-blue-50 border-4 border-white shadow-lg rounded-full flex items-center justify-center text-2xl font-bold text-primary mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Chọn dịch vụ & giờ</h3>
                <p className="text-gray-500 max-w-xs">
                  Truy cập ứng dụng, chọn gói dịch vụ mong muốn và khung giờ phù hợp với lịch trình của bạn.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center w-full md:w-1/3 bg-white z-10 px-4">
                <div className="w-20 h-20 bg-blue-50 border-4 border-white shadow-lg rounded-full flex items-center justify-center text-2xl font-bold text-primary mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Thanh toán tiện lợi</h3>
                <p className="text-gray-500 max-w-xs">
                  Lựa chọn thanh toán trước qua các cổng thanh toán online hoặc thanh toán trực tiếp tại quầy.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center w-full md:w-1/3 bg-white z-10 px-4">
                <div className="w-20 h-20 bg-blue-50 border-4 border-white shadow-lg rounded-full flex items-center justify-center text-2xl font-bold text-primary mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sử dụng & Tích điểm</h3>
                <p className="text-gray-500 max-w-xs">
                  Mang xe đến đúng giờ. Điểm thưởng sẽ được tự động cộng vào tài khoản sau khi hoàn thành.
                </p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <button
                onClick={handleBookingClick}
                className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:-translate-y-1 inline-flex items-center gap-2"
              >
                <Calendar size={20} />
                Đặt lịch rửa xe ngay hôm nay
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="contact" className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

            {/* Brand */}
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-primary text-white p-2 rounded-lg">
                  <Car size={24} />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">
                  AutoWash Pro
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Hệ thống đặt lịch rửa xe thông minh, mang đến trải nghiệm chăm sóc xe cao cấp và tiết kiệm thời gian nhất cho bạn.
              </p>
              <div className="flex items-center gap-4">
                {/* Social placeholders */}
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <span className="font-bold text-white">f</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <span className="font-bold text-white">in</span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Liên kết nhanh</h4>
              <ul className="space-y-4">
                <li><button onClick={() => scrollToSection('hero')} className="hover:text-primary transition-colors">Trang chủ</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-primary transition-colors">Dịch vụ & Bảng giá</button></li>
                <li><Link to="/auth/login" className="hover:text-primary transition-colors">Đăng nhập</Link></li>
                <li><Link to="/auth/register" className="hover:text-primary transition-colors">Đăng ký thành viên</Link></li>
              </ul>
            </div>

            {/* Services (Footer) */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Dịch vụ</h4>
              <ul className="space-y-4">
                <li className="text-gray-400">Rửa xe cơ bản</li>
                <li className="text-gray-400">Rửa xe chuyên sâu</li>
                <li className="text-gray-400">Phủ Nano cao cấp</li>
                <li className="text-gray-400">Vệ sinh nội thất</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Liên hệ</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="text-primary shrink-0 mt-1" size={20} />
                  <span className="text-gray-400">123 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-primary shrink-0" size={20} />
                  <span className="text-gray-400">Hotline: 090 123 4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="text-primary shrink-0" size={20} />
                  <span className="text-gray-400">Mở cửa: 07:00 – 18:00 (Hàng ngày)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © 2025 AutoWash Pro. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
              <a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
