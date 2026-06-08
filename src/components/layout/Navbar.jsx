import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Car, Calendar, Menu, X } from 'lucide-react';

export default function Navbar() {
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

  const handleBookingClick = () => {
    if (isLoggedIn) {
      navigate('/booking');
    } else {
      navigate('/auth/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const handleNavClick = (link) => {
    setIsMenuOpen(false);
    
    // If it requires navigation to a different page
    if (link.path && location.pathname !== link.path) {
      if (link.id) {
        navigate(`${link.path}#${link.id}`);
      } else {
        navigate(link.path);
      }
      return;
    }
    
    // Otherwise, scroll to the section
    if (link.id) {
      const element = document.getElementById(link.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Trang chủ', id: 'hero', path: '/' },
    { name: 'Dịch vụ', id: '', path: '/services' },
    { name: 'Bảng giá', id: 'banggia', path: '/services' },
    { name: 'Hướng dẫn', id: 'huong-dan', path: '/' },
    { name: 'Ưu đãi', id: 'loyalty', path: '/' },
    { name: 'Liên hệ', id: 'contact', path: '/' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-dark-950/80 backdrop-blur-md shadow-lg border-b border-dark-600 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center max-w-7xl">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer z-50" 
          onClick={() => {
            if (location.pathname !== '/') navigate('/');
            else handleNavClick({ id: 'hero', path: '/' });
          }}
        >
          <Car size={32} className="text-gold-500" />
          <span className="text-2xl font-heading font-bold text-gold-400 tracking-tight">
            AutoWash Pro
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6 font-medium">
            {navLinks.map((link) => (
              <li key={link.name}>
                <button 
                  onClick={() => handleNavClick(link)}
                  className="text-text-secondary hover:text-gold-400 transition-colors focus:outline-none"
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 ml-4">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="px-6 py-2.5 text-text-secondary border border-dark-600 rounded-full hover:text-gold-400 transition-colors"
              >
                Đăng xuất
              </button>
            ) : (
              <button 
                onClick={() => navigate('/auth/login')}
                className="px-6 py-2.5 text-gold-500 border border-gold-500 rounded-full hover:bg-gold-500 hover:text-dark-950 transition-all duration-300"
              >
                Đăng nhập
              </button>
            )}
            <button 
              onClick={handleBookingClick}
              className="px-6 py-2.5 bg-gold-500 text-dark-950 font-semibold rounded-full hover:bg-gold-400 shadow-[0_0_20px_rgba(201,152,26,0.3)] hover:shadow-[0_0_30px_rgba(201,152,26,0.5)] transition-all duration-300 flex items-center gap-2"
            >
              <Calendar size={18} />
              Đặt lịch ngay
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-text-primary p-2 z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-dark-950/95 backdrop-blur-xl z-40 flex flex-col pt-24 px-6 pb-6">
          <ul className="flex flex-col gap-6 font-medium text-lg">
            {navLinks.map((link) => (
              <li key={link.name}>
                <button 
                  onClick={() => handleNavClick(link)}
                  className="w-full text-left text-text-secondary hover:text-gold-400 transition-colors pb-4 border-b border-dark-800"
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4 mt-8">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="w-full px-6 py-3.5 text-text-secondary border border-dark-600 rounded-full text-center hover:bg-dark-800 transition-colors"
              >
                Đăng xuất
              </button>
            ) : (
              <button 
                onClick={() => navigate('/auth/login')}
                className="w-full px-6 py-3.5 text-gold-500 border border-gold-500 rounded-full text-center hover:bg-gold-500/10 transition-colors"
              >
                Đăng nhập
              </button>
            )}
            <button 
              onClick={handleBookingClick}
              className="w-full px-6 py-3.5 bg-gold-500 text-dark-950 font-semibold rounded-full text-center shadow-[0_0_20px_rgba(201,152,26,0.3)] transition-all"
            >
              Đặt lịch ngay
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
