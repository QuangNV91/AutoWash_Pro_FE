import { useState, useEffect } from 'react';
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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-neutral-950/90 backdrop-blur-md shadow-lg border-b border-white/5' : 'bg-neutral-950/80 backdrop-blur-sm'}`}>
      <div className="w-full px-6 md:px-10 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <svg viewBox="0 0 256 256" className="h-5 w-5" fill="#ffffff">
              <path d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z" />
            </svg>
            <span className="text-white text-sm font-normal tracking-tight">autowash pro</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, idx) => {
              const active = isActive(link.path);
              return (
                <button
                  key={idx}
                  onClick={link.onClick ? link.onClick : () => handleNavClick(link.id)}
                  className={`px-5 py-2 rounded-full text-sm font-normal transition-colors ${active ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.name}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative group hidden md:block">
                <button
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Quản lý tài khoản"
                >
                  <User size={18} />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:translate-y-0 translate-y-2 bg-neutral-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden py-2">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full text-left px-5 py-3 text-white text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    Quản lý lịch hẹn
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      window.location.reload();
                    }}
                    className="w-full text-left px-5 py-3 text-red-400 text-sm hover:bg-red-500/10 transition-colors flex items-center gap-2 border-t border-white/5"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/auth/login')}
                className="px-6 py-2.5 text-white border border-white/20 rounded-full hover:bg-white hover:text-black font-medium transition-all text-sm"
              >
                Đăng nhập
              </button>
            )}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-neutral-950/95 backdrop-blur-md border-b border-white/10 px-4 py-6 shadow-xl">
          <div className="flex flex-col gap-2">
            {navLinks.map((link, idx) => {
              const active = isActive(link.path);
              return (
                <button
                  key={idx}
                  onClick={link.onClick ? link.onClick : () => handleNavClick(link.id)}
                  className={`text-left px-4 py-3 font-normal transition-colors rounded-lg text-sm ${active
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.name}
                </button>
              );
            })}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
              {isLoggedIn ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full px-5 py-3 text-white font-medium text-sm text-center border border-white/20 bg-white/5 rounded-full flex items-center justify-center gap-2"
                >
                  <User size={18} />
                  quản lý tài khoản
                </button>
              ) : (
                <button
                  onClick={() => navigate('/auth/login')}
                  className="w-full px-5 py-3 text-white text-sm font-medium text-center border border-white/20 rounded-full"
                >
                  đăng nhập
                </button>
              )}
              <button
                onClick={() => navigate('/booking')}
                className="w-full px-5 py-3 bg-white text-black text-sm font-medium rounded-full"
              >
                đặt lịch ngay
              </button>

              {isLoggedIn && (
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.reload();
                  }}
                  className="w-full mt-2 px-5 py-3 text-white/50 hover:text-red-400 text-sm font-medium text-center"
                >
                  đăng xuất
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

