import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle, ChevronDown, ChevronUp, User, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  const contactInfo = [
    {
      icon: <MapPin size={24} />,
      title: 'Địa chỉ',
      lines: ['123 Đường Nguyễn Văn Linh', 'Quận 7, TP. Hồ Chí Minh'],
      color: 'from-gold-500/20 to-gold-600/5'
    },
    {
      icon: <Phone size={24} />,
      title: 'Hotline',
      lines: ['1900 1234', '0909 123 456'],
      color: 'from-gold-500/20 to-gold-600/5'
    },
    {
      icon: <Mail size={24} />,
      title: 'Email',
      lines: ['contact@autowashpro.com', 'support@autowashpro.com'],
      color: 'from-gold-500/20 to-gold-600/5'
    },
    {
      icon: <Clock size={24} />,
      title: 'Giờ hoạt động',
      lines: ['T2 - T7: 07:00 - 18:00', 'Chủ nhật: 08:00 - 17:00'],
      color: 'from-gold-500/20 to-gold-600/5'
    },
  ];

  const faqs = [
    {
      q: 'Tôi cần đặt lịch trước bao lâu?',
      a: 'Bạn có thể đặt lịch trước từ 1 đến 14 ngày tùy theo hạng thành viên. Hạng Member có thể đặt trước 7 ngày, Silver 10 ngày, Gold 12 ngày và Platinum lên tới 14 ngày.'
    },
    {
      q: 'Chính sách hủy lịch như thế nào?',
      a: 'Hủy trước giờ hẹn từ 2 tiếng trở lên sẽ được hoàn 75% phí. Hủy trong vòng 2 tiếng trước giờ hẹn sẽ không được hoàn tiền và bị trừ 10 điểm tích lũy. Không đến sau 30 phút sẽ mất toàn bộ cọc và bị trừ 15 điểm.'
    },
    {
      q: 'Làm thế nào để tích điểm thành viên?',
      a: 'Bạn sẽ tự động tích điểm khi sử dụng dịch vụ. Thanh toán online còn được cộng thêm 10 điểm thưởng. Điểm sẽ hết hạn sau 12 tháng không có giao dịch. Khi tích đủ điểm, bạn sẽ tự động thăng hạng để nhận ưu đãi lớn hơn.'
    },
    {
      q: 'AutoWash Pro có những phương thức thanh toán nào?',
      a: 'Chúng tôi hỗ trợ thanh toán tiền mặt tại cửa hàng và thanh toán online qua VNPAY. Thanh toán online giúp bạn nhận thêm 10 điểm thưởng cho mỗi lần sử dụng dịch vụ.'
    },
    {
      q: 'Tôi có thể xem lịch sử rửa xe ở đâu?',
      a: 'Sau khi đăng nhập, bạn có thể vào mục "Lịch sử" trong trang quản lý cá nhân để xem toàn bộ lịch sử sử dụng dịch vụ, bao gồm chi tiết gói dịch vụ, thời gian và trạng thái thanh toán.'
    },
  ];

  return (
    <div className="min-h-screen font-body text-text-secondary bg-dark-950 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* HERO SECTION */}
        <section className="relative py-32 bg-dark-950 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-gold-500/10 via-dark-950 to-dark-950"></div>
          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10 text-center">
            <div className="inline-block mb-6">
              <span className="text-gold-500 tracking-widest text-sm font-semibold uppercase">✦ Liên hệ với chúng tôi</span>
            </div>

            <h1 className="font-heading text-5xl md:text-6xl font-bold text-text-primary leading-tight mb-6">
              Kết nối với <br />
              <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
                AutoWash Pro
              </span>
            </h1>

            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ ngay để được tư vấn miễn phí!
            </p>
          </div>
        </section>

        {/* CONTACT INFO CARDS */}
        <section className="py-16 bg-dark-900 border-t border-dark-800">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, idx) => (
                <div
                  key={idx}
                  className="group bg-dark-800 border border-dark-600 rounded-2xl p-6 hover:border-gold-500/50 transition-all duration-500 relative overflow-hidden"
                >
                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-5 group-hover:bg-gold-500/20 group-hover:border-gold-500/40 transition-all duration-300">
                      {info.icon}
                    </div>
                    <h3 className="text-lg font-bold text-text-primary mb-3">{info.title}</h3>
                    {info.lines.map((line, i) => (
                      <p key={i} className="text-text-secondary text-sm leading-relaxed">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT FORM + MAP SECTION */}
        <section className="py-24 bg-dark-950">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-16">
              <span className="text-gold-500 tracking-widest text-sm font-semibold uppercase mb-4 inline-block">✦ Gửi tin nhắn</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-text-primary">Liên hệ ngay</h2>
              <p className="text-text-secondary mt-4 max-w-xl mx-auto">
                Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong thời gian sớm nhất
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-3">
                <div className="bg-dark-900 border border-dark-800 rounded-2xl p-8 md:p-10 relative overflow-hidden">
                  {/* Subtle decorative corner */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-bl-full"></div>

                  {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center relative z-10">
                      <div className="w-20 h-20 rounded-full bg-green-900/30 border border-green-500/30 flex items-center justify-center mb-6 animate-bounce">
                        <CheckCircle size={40} className="text-green-400" />
                      </div>
                      <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">Gửi thành công!</h3>
                      <p className="text-text-secondary max-w-md">
                        Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-text-primary text-sm font-semibold mb-2">
                            Họ và tên <span className="text-gold-500">*</span>
                          </label>
                          <div className="relative">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              placeholder="Nhập họ và tên"
                              className="w-full bg-dark-700 border border-dark-600 focus:border-gold-500 text-text-primary placeholder-text-muted rounded-lg pl-12 pr-4 py-3.5 outline-none transition-colors duration-200"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-text-primary text-sm font-semibold mb-2">
                            Số điện thoại <span className="text-gold-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              placeholder="0909 xxx xxx"
                              className="w-full bg-dark-700 border border-dark-600 focus:border-gold-500 text-text-primary placeholder-text-muted rounded-lg pl-12 pr-4 py-3.5 outline-none transition-colors duration-200"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-text-primary text-sm font-semibold mb-2">
                            Email
                          </label>
                          <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="email@example.com"
                              className="w-full bg-dark-700 border border-dark-600 focus:border-gold-500 text-text-primary placeholder-text-muted rounded-lg pl-12 pr-4 py-3.5 outline-none transition-colors duration-200"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-text-primary text-sm font-semibold mb-2">
                            Chủ đề
                          </label>
                          <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full bg-dark-700 border border-dark-600 focus:border-gold-500 text-text-primary rounded-lg px-4 py-3.5 outline-none transition-colors duration-200 appearance-none cursor-pointer"
                          >
                            <option value="" className="bg-dark-700">Chọn chủ đề</option>
                            <option value="tuvan" className="bg-dark-700">Tư vấn dịch vụ</option>
                            <option value="datlich" className="bg-dark-700">Hỗ trợ đặt lịch</option>
                            <option value="khieunai" className="bg-dark-700">Khiếu nại / Góp ý</option>
                            <option value="hoptac" className="bg-dark-700">Hợp tác kinh doanh</option>
                            <option value="khac" className="bg-dark-700">Khác</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-8">
                        <label className="block text-text-primary text-sm font-semibold mb-2">
                          Nội dung tin nhắn <span className="text-gold-500">*</span>
                        </label>
                        <div className="relative">
                          <MessageSquare size={18} className="absolute left-4 top-4 text-text-muted" />
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            placeholder="Mô tả chi tiết yêu cầu của bạn..."
                            className="w-full bg-dark-700 border border-dark-600 focus:border-gold-500 text-text-primary placeholder-text-muted rounded-lg pl-12 pr-4 py-3.5 outline-none transition-colors duration-200 resize-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full md:w-auto px-10 py-4 bg-gold-500 text-dark-950 font-bold rounded-full hover:bg-gold-400 transition-all duration-300 shadow-[0_0_20px_rgba(201,152,26,0.3)] hover:shadow-[0_0_30px_rgba(201,152,26,0.5)] inline-flex items-center justify-center gap-3 text-lg"
                      >
                        <Send size={20} />
                        Gửi tin nhắn
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Map + Extra Info */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Map */}
                <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden flex-grow min-h-[300px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.024!2d106.7!3d10.73!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQzJzQ4LjAiTiAxMDbCsDQyJzAwLjAiRQ!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '300px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="AutoWash Pro Location"
                    className="w-full h-full"
                  ></iframe>
                </div>

                {/* Working Hours Summary */}
                <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                      <Clock size={20} className="text-gold-400" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-text-primary">Giờ hoạt động</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { day: 'Thứ 2 — Thứ 6', hours: '07:00 — 18:00', active: true },
                      { day: 'Thứ 7', hours: '07:00 — 18:00', active: true },
                      { day: 'Chủ nhật', hours: '08:00 — 17:00', active: true },
                      { day: 'Nghỉ trưa', hours: '12:00 — 13:00', active: false },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-dark-600 last:border-0">
                        <span className="text-text-secondary text-sm">{item.day}</span>
                        <span className={`text-sm font-semibold ${item.active ? 'text-gold-400' : 'text-text-muted'}`}>
                          {item.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-green-400 text-xs font-semibold">Đang mở cửa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 bg-dark-900 border-t border-dark-800">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="text-center mb-16">
              <span className="text-gold-500 tracking-widest text-sm font-semibold uppercase mb-4 inline-block">✦ Giải đáp thắc mắc</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-text-primary">Câu hỏi thường gặp</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className={`bg-dark-800 border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === idx ? 'border-gold-500/50 shadow-[0_0_20px_rgba(201,152,26,0.1)]' : 'border-dark-600 hover:border-dark-600/80'
                    }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="text-text-primary font-semibold pr-4">{faq.q}</span>
                    <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${openFaq === idx ? 'bg-gold-500/20 text-gold-400 rotate-0' : 'bg-dark-700 text-text-muted'
                      }`}>
                      {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                  >
                    <div className="px-6 pb-6">
                      <div className="border-t border-dark-600 pt-4">
                        <p className="text-text-secondary text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 bg-dark-950 border-t border-dark-800 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/5 via-transparent to-transparent"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full">
              <Sparkles size={16} className="text-gold-400" />
              <span className="text-gold-400 text-sm font-semibold">Ưu đãi cho khách hàng mới</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-text-primary mb-6">Sẵn sàng trải nghiệm?</h2>
            <p className="text-text-secondary text-lg mb-10 max-w-2xl mx-auto">
              Đặt lịch ngay hôm nay để nhận ưu đãi giảm 20% cho lần đầu sử dụng dịch vụ tại AutoWash Pro!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/booking')}
                className="px-10 py-5 bg-gold-500 text-dark-950 font-bold rounded-full hover:bg-gold-400 shadow-[0_0_30px_rgba(201,152,26,0.4)] hover:shadow-[0_0_40px_rgba(201,152,26,0.6)] transition-all inline-flex items-center gap-3 text-lg"
              >
                Đặt lịch ngay
              </button>
              <a
                href="tel:19001234"
                className="px-10 py-5 text-gold-500 font-bold border-2 border-gold-500 rounded-full hover:bg-gold-500 hover:text-dark-950 transition-all inline-flex items-center gap-3 text-lg"
              >
                <Phone size={20} />
                Gọi ngay: 1900 1234
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
