import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const formik = useFormik({
    initialValues: {
      phone: '',
      password: '',
    },
    validationSchema: Yup.object({
      phone: Yup.string()
        .required('Vui lòng nhập Số điện thoại')
        .matches(/^0[0-9]{9,10}$/, 'Số điện thoại không hợp lệ'),
      password: Yup.string().required('Vui lòng nhập mật khẩu'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setApiError('');

      try {
        const response = await api.post('/auth/login', {
          phone: values.phone,
          password: values.password
        });

        const data = response?.data || response;
        const token = data?.token;
        const role = data?.role;
        const username = data?.username;

        if (token) {
          localStorage.setItem('token', token);
          if (role) localStorage.setItem('role', role);
          if (username) localStorage.setItem('username', username);
          
          if (role === 'ADMIN') {
            navigate('/admin');
          } else if (role === 'STAFF') {
            navigate('/staff');
          } else {
            navigate('/');
          }
        } else {
          setApiError('Đăng nhập thành công nhưng không tìm thấy token.');
        }
      } catch (err) {
        setApiError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
        );
      } finally {
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(6,182,212,0.15),transparent_50%)]"></div>

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
      <div className="w-full lg:w-[40%] bg-neutral-950 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        <div className="w-full max-w-[420px] relative z-10">
          <div className="text-center lg:text-left mb-8">
            <h2 className="font-hero text-3xl font-medium text-white mb-2 tracking-tight">Đăng nhập</h2>
            <p className="text-white/60">Chào mừng bạn trở lại</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">
                Số điện thoại (ID đăng nhập)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                {...formik.getFieldProps('phone')}
                placeholder="Nhập số điện thoại của bạn"
                className={`bg-white/5 border ${formik.touched.phone && formik.errors.phone
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/10 focus:border-cyan-400'
                  } text-white placeholder-white/30 rounded-lg px-4 py-3 w-full outline-none transition-colors duration-200`}
                disabled={formik.isSubmitting}
              />
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
                  placeholder="Nhập mật khẩu"
                  className={`bg-white/5 border ${formik.touched.password && formik.errors.password
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/10 focus:border-cyan-400'
                    } text-white placeholder-white/30 rounded-lg px-4 py-3 w-full outline-none transition-colors duration-200 pr-12`}
                  disabled={formik.isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1 transition-colors"
                  disabled={formik.isSubmitting}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="mt-2 text-sm text-red-400">{formik.errors.password}</div>
              ) : null}
            </div>

            <div className="flex items-center justify-end">
              <Link to="/auth/forgot-password" className="text-sm font-medium text-white/60 hover:text-cyan-400 transition-colors">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-cyan-500 text-black hover:bg-cyan-400 font-medium px-8 py-3.5 rounded-full transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2 text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
            >
              {formik.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
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
            Chưa có tài khoản?{' '}
            <Link to="/auth/register" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
