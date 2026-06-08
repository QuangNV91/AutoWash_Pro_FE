import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-dark-900 border-t border-dark-800 pt-16 pb-8 font-body">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Intro */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <span className="font-heading text-2xl font-bold text-gold-400 tracking-wider">AutoWash<span className="text-text-primary">Pro</span></span>
            </Link>
            <p className="text-text-secondary mb-6 text-sm leading-relaxed">
              Hệ thống rửa xe thông minh hàng đầu. Chăm sóc xế yêu của bạn với quy trình chuyên nghiệp và thiết bị hiện đại nhất.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-text-secondary hover:bg-gold-500 hover:text-dark-950 transition-colors">
                FB
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-text-secondary hover:bg-gold-500 hover:text-dark-950 transition-colors">
                IG
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-text-secondary hover:bg-gold-500 hover:text-dark-950 transition-colors">
                YT
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-bold text-text-primary mb-6">Liên kết nhanh</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-text-secondary hover:text-gold-400 text-sm transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <button onClick={() => navigate('/services')} className="text-text-secondary hover:text-gold-400 text-sm transition-colors">
                  Dịch vụ & Bảng giá
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/booking')} className="text-text-secondary hover:text-gold-400 text-sm transition-colors">
                  Đặt lịch rửa xe
                </button>
              </li>
              <li>
                <Link to="/auth/login" className="text-text-secondary hover:text-gold-400 text-sm transition-colors">
                  Đăng nhập thành viên
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading text-lg font-bold text-text-primary mb-6">Dịch vụ</h3>
            <ul className="space-y-3">
              <li className="text-text-secondary text-sm">Rửa xe cơ bản</li>
              <li className="text-text-secondary text-sm">Rửa xe chuyên sâu</li>
              <li className="text-text-secondary text-sm">Vệ sinh khoang máy</li>
              <li className="text-text-secondary text-sm">Đánh bóng & Phủ Nano</li>
              <li className="text-text-secondary text-sm">Vệ sinh nội thất</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-bold text-text-primary mb-6">Thông tin liên hệ</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-text-secondary text-sm">
                <MapPin size={18} className="text-gold-400 shrink-0 mt-0.5" />
                <span>123 Đường ABC, Quận XYZ, TP. HCM</span>
              </li>
              <li className="flex items-center gap-3 text-text-secondary text-sm">
                <Phone size={18} className="text-gold-400 shrink-0" />
                <span>1900 1234</span>
              </li>
              <li className="flex items-center gap-3 text-text-secondary text-sm">
                <Mail size={18} className="text-gold-400 shrink-0" />
                <span>contact@autowashpro.com</span>
              </li>
              <li className="flex items-start gap-3 text-text-secondary text-sm">
                <Clock size={18} className="text-gold-400 shrink-0 mt-0.5" />
                <span>
                  T2 - T7: 07:00 - 18:00<br />
                  CN: 08:00 - 17:00
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-dark-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            &copy; {new Date().getFullYear()} AutoWash Pro. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-4">
            <Link to="#" className="text-text-muted hover:text-gold-400 text-sm transition-colors">Điều khoản</Link>
            <Link to="#" className="text-text-muted hover:text-gold-400 text-sm transition-colors">Bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
