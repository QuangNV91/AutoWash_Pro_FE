import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';

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
    { name: 'Trang chủ', id: 'hero', path: '/' },
    { name: 'Dịch vụ', onClick: () => navigate('/services'), path: '/services' },
    { name: 'Bảng giá', onClick: () => navigate('/pricing'), path: '/pricing' },
    { name: 'Liên hệ', onClick: () => navigate('/contact'), path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-dark-950/90 backdrop-blur-md shadow-lg border-b border-dark-600' : 'bg-transparent'}`}>
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-gold-400 tracking-wider">AutoWash<span className="text-text-primary">Pro</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link, idx) => {
              const active = isActive(link.path);
              return (
                <button 
                  key={idx} 
                  onClick={link.onClick ? link.onClick : () => handleNavClick(link.id)}
                  className="relative px-6 py-2.5 group transition-all"
                >
                  {/* Active Background */}
                  {active && (
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-gold-600 to-gold-400 shadow-[0_0_15px_rgba(201,152,26,0.3)] rounded-lg" 
                    />
                  )}
                  
                  {/* Hover Background (subtle) */}
                  {!active && (
                    <div 
                      className="absolute inset-0 bg-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    />
                  )}

                  <span className={`relative z-10 font-bold tracking-wider uppercase text-sm transition-colors ${
                    active ? 'text-dark-950' : 'text-text-secondary group-hover:text-gold-400'
                  }`}>
                    {link.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-500 hover:bg-gold-500/20 transition-colors"
                title="Quản lý tài khoản"
              >
                <User size={20} />
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

            {isLoggedIn && (
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.reload();
                }}
                className="px-4 py-2 text-red-400 hover:text-red-300 font-medium transition-colors text-sm border border-red-900/30 rounded-full bg-red-900/10"
              >
                Đăng xuất
              </button>
            )}
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
            {navLinks.map((link, idx) => {
              const active = isActive(link.path);
              return (
                <button 
                  key={idx} 
                  onClick={link.onClick ? link.onClick : () => handleNavClick(link.id)}
                  className={`text-left px-4 py-3 font-bold transition-colors rounded-lg ${
                    active
                      ? 'bg-gradient-to-r from-gold-600/20 to-transparent text-gold-400 border-l-4 border-gold-500'
                      : 'text-text-secondary hover:text-gold-400 hover:bg-dark-800'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-dark-600">
              {isLoggedIn ? (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full px-5 py-3 text-gold-400 font-bold text-center border border-gold-400/30 bg-gold-500/10 rounded-lg flex items-center justify-center gap-2"
                >
                  <User size={18} />
                  Quản lý tài khoản
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
              
              {isLoggedIn && (
                <button 
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.reload();
                  }}
                  className="w-full mt-2 px-5 py-3 text-red-400 text-center border border-red-900/30 bg-red-900/10 rounded-lg"
                >
                  Đăng xuất
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
