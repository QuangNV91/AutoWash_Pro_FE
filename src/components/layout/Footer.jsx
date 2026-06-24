import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-neutral-950 border-t border-white/5 pt-16 pb-8 font-body">
      <div className="container mx-auto px-6 md:px-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Intro */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <svg viewBox="0 0 256 256" className="h-5 w-5" fill="#ffffff">
                <path d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z" />
              </svg>
              <span className="text-white text-sm font-normal tracking-tight">autowash pro</span>
            </Link>
            <p className="text-white/60 mb-6 text-sm leading-relaxed">
              Hệ thống rửa xe thông minh hàng đầu. Chăm sóc xế yêu của bạn với quy trình chuyên nghiệp và thiết bị hiện đại nhất.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white hover:text-black transition-colors text-xs font-medium">
                FB
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white hover:text-black transition-colors text-xs font-medium">
                IG
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white hover:text-black transition-colors text-xs font-medium">
                YT
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-hero text-lg font-medium text-white mb-6">Liên kết nhanh</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-white/60 hover:text-white text-sm transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <button onClick={() => navigate('/services')} className="text-white/60 hover:text-white text-sm transition-colors">
                  Dịch vụ & Bảng giá
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/booking')} className="text-white/60 hover:text-white text-sm transition-colors">
                  Đặt lịch rửa xe
                </button>
              </li>
              <li>
                <Link to="/auth/login" className="text-white/60 hover:text-white text-sm transition-colors">
                  Đăng nhập thành viên
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-hero text-lg font-medium text-white mb-6">Dịch vụ</h3>
            <ul className="space-y-3">
              <li className="text-white/60 text-sm">Rửa xe cơ bản</li>
              <li className="text-white/60 text-sm">Rửa xe chuyên sâu</li>
              <li className="text-white/60 text-sm">Vệ sinh khoang máy</li>
              <li className="text-white/60 text-sm">Đánh bóng & Phủ Nano</li>
              <li className="text-white/60 text-sm">Vệ sinh nội thất</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-hero text-lg font-medium text-white mb-6">Thông tin liên hệ</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin size={18} className="text-white/40 shrink-0 mt-0.5" />
                <span>123 Đường ABC, Quận XYZ, TP. HCM</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Phone size={18} className="text-white/40 shrink-0" />
                <span>1900 1234</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Mail size={18} className="text-white/40 shrink-0" />
                <span>contact@autowashpro.com</span>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <Clock size={18} className="text-white/40 shrink-0 mt-0.5" />
                <span>
                  T2 - T7: 07:00 - 18:00<br />
                  CN: 08:00 - 17:00
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} autowash pro. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-4">
            <Link to="#" className="text-white/40 hover:text-white text-sm transition-colors">Điều khoản</Link>
            <Link to="#" className="text-white/40 hover:text-white text-sm transition-colors">Bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
