import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setIsMenuOpen(false);
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const navLinks = [
    { name: 'Trang chủ', id: 'hero' },
    { name: 'Dịch vụ', onClick: () => navigate('/services') },
    { name: 'Bảng giá', onClick: () => navigate('/services#banggia') },
    { name: 'Liên hệ', id: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-dark-950/90 backdrop-blur-md shadow-lg border-b border-dark-600' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-gold-400 tracking-wider">AutoWash<span className="text-text-primary">Pro</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, idx) => (
              <button 
                key={idx} 
                onClick={link.onClick ? link.onClick : () => handleNavClick(link.id)}
                className="text-text-secondary hover:text-gold-400 font-medium transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.reload();
                }}
                className="px-5 py-2.5 text-text-secondary hover:text-gold-400 font-medium transition-colors"
              >
                Đăng xuất
              </button>
            ) : (
              <button 
                onClick={() => navigate('/auth/login')}
                className="px-5 py-2.5 text-gold-400 border border-gold-400 rounded-full hover:bg-gold-400 hover:text-dark-950 font-medium transition-all"
              >
                Đăng nhập
              </button>
            )}
            <button 
              onClick={() => navigate('/booking')}
              className="px-5 py-2.5 bg-gold-500 text-dark-950 font-bold rounded-full hover:bg-gold-400 transition-all"
            >
              Đặt lịch ngay
            </button>
          </div>

          <button 
            className="md:hidden text-text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-dark-950/95 backdrop-blur-md border-b border-dark-600 px-4 py-6 shadow-xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link, idx) => (
              <button 
                key={idx} 
                onClick={link.onClick ? link.onClick : () => handleNavClick(link.id)}
                className="text-text-secondary text-left py-2 hover:text-gold-400 font-medium transition-colors"
              >
                {link.name}
              </button>
            ))}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-dark-600">
              {isLoggedIn ? (
                <button 
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.reload();
                  }}
                  className="w-full px-5 py-3 text-text-secondary text-center border border-dark-600 rounded-lg"
                >
                  Đăng xuất
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/auth/login')}
                  className="w-full px-5 py-3 text-gold-400 text-center border border-gold-400 rounded-lg"
                >
                  Đăng nhập
                </button>
              )}
              <button 
                onClick={() => navigate('/booking')}
                className="w-full px-5 py-3 bg-gold-500 text-dark-950 font-bold rounded-lg"
              >
                Đặt lịch ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
