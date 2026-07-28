import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, User, Phone, Mail } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .trim()
        .required('Vui lòng nhập Họ và tên')
        .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
        .max(50, 'Họ và tên không được vượt quá 50 ký tự')
        .matches(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/, 'Họ và tên chỉ được chứa chữ cái và khoảng trắng'),
      email: Yup.string()
        .email('Email không hợp lệ')
        .required('Vui lòng nhập Email'),
      phone: Yup.string()
        .required('Vui lòng nhập Số điện thoại')
        .matches(/^0[0-9]{9,10}$/, 'Số điện thoại không hợp lệ'),
      password: Yup.string()
        .required('Vui lòng nhập mật khẩu')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setApiError('');
      setSuccess('');
      
      try {
        const payload = {
          fullName: values.fullName,
          phone: values.phone,
          email: values.email,
          password: values.password
        };
        const response = await api.post('/auth/register', payload);
        
        setSuccess('Đăng ký thành công! Đang chuyển hướng đến trang xác thực...');

        setTimeout(() => {
          navigate('/auth/verify', { 
            state: { 
              phone: values.phone, 
              code: response.data.verificationCode 
            } 
          });
        }, 1200);

      } catch (err) {
        setApiError(
          err.response?.data?.message || 
          err.response?.data?.error || 
          'Đăng ký thất bại. Vui lòng thử lại.'
        );
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex min-h-screen w-full bg-black font-body">
      {/* Left Column - 60% */}
      <div className="hidden lg:flex w-[60%] relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center">
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(168,85,247,0.15),transparent_50%)]"></div>
        
        {/* Logo */}
        <div className="absolute top-8 left-12 z-20">
          <Link to="/" className="flex items-center gap-2">
            <svg viewBox="0 0 256 256" className="h-6 w-6" fill="#ffffff">
              <path d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z" />
            </svg>
            <span className="text-white text-base font-normal tracking-tight">autowash pro</span>
          </Link>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full px-12 lg:px-24">
          <h1 className="font-hero text-5xl lg:text-6xl font-medium text-white leading-tight mb-2 tracking-tight">
            Hệ thống đặt lịch
            <br />
            <span className="text-white/70">
              rửa xe thông minh
            </span>
          </h1>
          <p className="text-lg text-white/60 max-w-lg mt-4 mb-8 leading-relaxed">
            Trải nghiệm dịch vụ chăm sóc xe cao cấp, tiết kiệm thời gian và tích lũy vô vàn ưu đãi đặc quyền dành riêng cho bạn.
          </p>
          
          <div className="flex flex-col gap-3 text-white/60 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-white/40">●</span>
              <span>Đặt lịch online 24/7</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/40">●</span>
              <span>Tích điểm ưu đãi</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/40">●</span>
              <span>Thanh toán dễ dàng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - 40% */}
      <div className="w-full lg:w-[40%] bg-neutral-950 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden max-h-screen">
        <div className="absolute top-1/2 right-0 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        <div className="w-full max-w-[420px] relative z-10">
          <div className="text-center lg:text-left mb-8">
            <h2 className="font-hero text-3xl font-medium text-white mb-2 tracking-tight">Đăng ký tài khoản</h2>
            <p className="text-white/60">Bắt đầu trải nghiệm dịch vụ chăm sóc xe</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-white/80 mb-2">
                Họ và tên
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  {...formik.getFieldProps('fullName')}
                  placeholder="VD: Nguyễn Văn A"
                  className={`bg-white/5 border ${
                    formik.touched.fullName && formik.errors.fullName
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/10 focus:border-cyan-400'
                  } text-white placeholder-white/30 rounded-lg pl-11 pr-4 py-3 w-full outline-none transition-colors duration-200`}
                  disabled={formik.isSubmitting || success}
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              </div>
              {formik.touched.fullName && formik.errors.fullName ? (
                <div className="mt-2 text-sm text-red-400">{formik.errors.fullName}</div>
              ) : null}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  {...formik.getFieldProps('email')}
                  placeholder="VD: nguyenvana@gmail.com"
                  className={`bg-white/5 border ${
                    formik.touched.email && formik.errors.email
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/10 focus:border-cyan-400'
                  } text-white placeholder-white/30 rounded-lg pl-11 pr-4 py-3 w-full outline-none transition-colors duration-200`}
                  disabled={formik.isSubmitting || success}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <div className="mt-2 text-sm text-red-400">{formik.errors.email}</div>
              ) : null}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">
                Số điện thoại (ID đăng nhập)
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  {...formik.getFieldProps('phone')}
                  placeholder="090 123 4567"
                  className={`bg-white/5 border ${
                    formik.touched.phone && formik.errors.phone
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/10 focus:border-cyan-400'
                  } text-white placeholder-white/30 rounded-lg pl-11 pr-4 py-3 w-full outline-none transition-colors duration-200`}
                  disabled={formik.isSubmitting || success}
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              </div>
              {formik.touched.phone && formik.errors.phone ? (
                <div className="mt-2 text-sm text-red-400">{formik.errors.phone}</div>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  {...formik.getFieldProps('password')}
                  placeholder="Ít nhất 6 ký tự"
                  className={`bg-white/5 border ${
                    formik.touched.password && formik.errors.password
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/10 focus:border-cyan-400'
                  } text-white placeholder-white/30 rounded-lg px-4 py-3 w-full outline-none transition-colors duration-200 pr-12`}
                  disabled={formik.isSubmitting || success}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1 transition-colors"
                  disabled={formik.isSubmitting || success}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="mt-2 text-sm text-red-400">{formik.errors.password}</div>
              ) : null}
            </div>

            {success && (
              <div className="mt-5 p-3 rounded-lg bg-green-900/20 border border-green-500/20 text-green-400 text-sm font-medium text-center">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={formik.isSubmitting || success}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-medium px-8 py-3.5 rounded-full transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4 text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
            >
              {formik.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Đang xử lý...
                </>
              ) : (
                'Đăng ký ngay'
              )}
            </button>
          </form>

          {apiError && (
            <div className="mt-5 p-3 rounded-lg bg-red-900/20 border border-red-500/20 text-red-400 text-sm font-medium text-center">
              {apiError}
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="text-sm text-white/40">hoặc</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          <p className="mt-6 text-center text-sm text-white/60">
            Đã có tài khoản?{' '}
            <Link to="/auth/login" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
