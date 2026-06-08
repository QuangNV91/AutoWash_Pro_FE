import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, MapPin, Phone, Clock } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-dark-950 border-t border-dark-600 pt-20 pb-8">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand - 5 cols */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <Car size={32} className="text-gold-500" />
              <span className="text-2xl font-heading font-bold text-gold-400 tracking-tight">
                AutoWash Pro
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              Hệ thống đặt lịch rửa xe thông minh, mang đến trải nghiệm chăm sóc xe cao cấp và tiết kiệm thời gian nhất cho bạn.
            </p>
          </div>

          {/* Links - 3 cols */}
          <div className="md:col-span-3">
            <h4 className="text-text-primary font-bold mb-6 tracking-wide">LIÊN KẾT NHANH</h4>
            <ul className="space-y-4">
              <li><Link to="/services" className="text-text-secondary hover:text-gold-400 text-sm transition-colors">Dịch vụ & Bảng giá</Link></li>
              <li><Link to="/auth/login" className="text-text-secondary hover:text-gold-400 text-sm transition-colors">Đăng nhập</Link></li>
              <li><Link to="/auth/register" className="text-text-secondary hover:text-gold-400 text-sm transition-colors">Đăng ký thành viên</Link></li>
            </ul>
          </div>

          {/* Contact - 4 cols */}
          <div className="md:col-span-4">
            <h4 className="text-text-primary font-bold mb-6 tracking-wide">THÔNG TIN LIÊN HỆ</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="text-gold-500 shrink-0 mt-0.5" size={18} />
                <span className="text-text-secondary">123 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="text-gold-500 shrink-0" size={18} />
                <span className="text-text-secondary">Hotline: 090 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Clock className="text-gold-500 shrink-0" size={18} />
                <span className="text-text-secondary">Mở cửa: 07:00 – 18:00 (Hàng ngày)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-sm text-center md:text-left">
            © 2025 AutoWash Pro. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <span className="cursor-pointer hover:text-gold-400 transition-colors">Chính sách bảo mật</span>
            <span className="cursor-pointer hover:text-gold-400 transition-colors">Điều khoản dịch vụ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
