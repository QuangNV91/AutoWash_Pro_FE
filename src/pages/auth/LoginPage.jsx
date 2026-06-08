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
      identifier: '',
      password: '',
    },
    validationSchema: Yup.object({
      identifier: Yup.string()
        .required('Vui lòng nhập Email hoặc Số điện thoại')
        .test('is-email-or-phone', 'Email hoặc Số điện thoại không hợp lệ', (value) => {
          if (!value) return true;
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const phoneRegex = /^0[0-9]{9,10}$/;
          return emailRegex.test(value) || phoneRegex.test(value);
        }),
      password: Yup.string().required('Vui lòng nhập mật khẩu'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setApiError('');
      
      try {
        const response = await api.post('/auth/login', {
          identifier: values.identifier,
          password: values.password
        });
        
        const token = response.data?.token || response.data?.data?.token;
        
        if (token) {
          localStorage.setItem('token', token);
          navigate('/dashboard');
        } else {
          setApiError('Phản hồi từ server không chứa token');
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
    <div className="flex min-h-screen w-full bg-dark-950 font-body">
      {/* Cột trái - 60% */}
      <div className="hidden lg:flex w-[60%] relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center">
        {/* Overlay gradient tối */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/90 via-dark-950/70 to-transparent"></div>
        
        {/* Logo góc trên trái */}
        <div className="absolute top-8 left-12 z-20">
          <Link to="/" className="text-2xl font-heading font-bold text-gold-400">
            AutoWash Pro
          </Link>
        </div>

        {/* Nội dung chính cột trái */}
        <div className="relative z-10 flex flex-col justify-center h-full px-12 lg:px-24">
          <h1 className="font-heading text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-2">
            Hệ thống đặt lịch
            <br />
            <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
              rửa xe thông minh
            </span>
          </h1>
          <p className="text-lg text-text-secondary max-w-lg mt-4 mb-8">
            Trải nghiệm dịch vụ chăm sóc xe cao cấp, tiết kiệm thời gian và tích lũy vô vàn ưu đãi đặc quyền dành riêng cho bạn.
          </p>
          
          <div className="flex flex-col gap-3 text-text-secondary">
            <div className="flex items-center gap-2">
              <span className="text-gold-400">✦</span>
              <span>Đặt lịch online 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold-400">✦</span>
              <span>Tích điểm ưu đãi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold-400">✦</span>
              <span>Thanh toán VNPAY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải - 40% */}
      <div className="w-full lg:w-[40%] bg-dark-900 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-[420px]">
          <div className="text-center lg:text-left mb-8">
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-2">Đăng nhập</h2>
            <p className="text-text-secondary">Chào mừng bạn trở lại</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-text-secondary mb-2">
                Email / Số điện thoại
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                {...formik.getFieldProps('identifier')}
                placeholder="Nhập email hoặc số điện thoại"
                className={`bg-dark-700 border ${
                  formik.touched.identifier && formik.errors.identifier
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-dark-600 focus:border-gold-500'
                } text-text-primary placeholder-text-muted rounded-lg px-4 py-3 w-full outline-none transition-colors duration-200`}
                disabled={formik.isSubmitting}
              />
              {formik.touched.identifier && formik.errors.identifier ? (
                <div className="mt-2 text-sm text-red-400">{formik.errors.identifier}</div>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  {...formik.getFieldProps('password')}
                  placeholder="Nhập mật khẩu"
                  className={`bg-dark-700 border ${
                    formik.touched.password && formik.errors.password
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-dark-600 focus:border-gold-500'
                  } text-text-primary placeholder-text-muted rounded-lg px-4 py-3 w-full outline-none transition-colors duration-200 pr-12`}
                  disabled={formik.isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-400 hover:text-gold-300 p-1 transition-colors"
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
              <Link to="/auth/forgot-password" className="text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-gold-500 hover:bg-gold-400 text-dark-950 font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(201,152,26,0.3)] hover:shadow-[0_0_30px_rgba(201,152,26,0.5)] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {formik.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {apiError && (
            <div className="mt-5 p-3 rounded-lg bg-red-900/30 border border-red-600/30 text-red-400 text-sm font-medium text-center">
              {apiError}
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 border-t border-dark-600"></div>
            <span className="text-sm text-text-muted">hoặc</span>
            <div className="flex-1 border-t border-dark-600"></div>
          </div>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Chưa có tài khoản?{' '}
            <Link to="/auth/register" className="font-medium text-gold-400 hover:text-gold-300 underline transition-colors">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
