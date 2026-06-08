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
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Column - Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-primary flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            <polygon fill="currentColor" points="0,100 100,0 100,100" />
          </svg>
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">AutoWash Pro</h1>
          <p className="text-lg text-blue-100 max-w-md">
            Hệ thống đặt lịch rửa xe thông minh, tiện lợi và chuyên nghiệp hàng đầu.
          </p>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[400px]">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
            <p className="text-gray-500">Chào mừng bạn trở lại hệ thống</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                Email / Số điện thoại
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                {...formik.getFieldProps('identifier')}
                placeholder="Nhập email hoặc số điện thoại"
                className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors ${
                  formik.touched.identifier && formik.errors.identifier
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary'
                }`}
                disabled={formik.isSubmitting}
              />
              {formik.touched.identifier && formik.errors.identifier ? (
                <div className="mt-1 text-sm text-red-600">{formik.errors.identifier}</div>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  {...formik.getFieldProps('password')}
                  placeholder="Nhập mật khẩu"
                  className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors pr-12 ${
                    formik.touched.password && formik.errors.password
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary'
                  }`}
                  disabled={formik.isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  disabled={formik.isSubmitting}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="mt-1 text-sm text-red-600">{formik.errors.password}</div>
              ) : null}
            </div>

            <div className="flex items-center justify-end">
              <Link to="/auth/forgot-password" className="text-sm font-medium text-primary hover:text-blue-800 transition-colors">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
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
            <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100">
              {apiError}
            </div>
          )}

          <p className="mt-8 text-center text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Link to="/auth/register" className="font-medium text-primary hover:text-blue-800 transition-colors">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
