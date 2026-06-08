import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, User, Phone } from 'lucide-react';
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
      phone: '',
      password: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .trim()
        .required('Vui lòng nhập Họ và tên'),
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
        await api.post('/auth/register', values);
        setSuccess('Đăng ký thành công! Đang chuyển hướng...');
        
        setTimeout(() => {
          navigate('/auth/login');
        }, 1500);
        
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
            Trở thành thành viên để trải nghiệm dịch vụ chăm sóc xe cao cấp và tiện lợi.
          </p>
        </div>
      </div>

      {/* Right Column - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto max-h-screen">
        <div className="w-full max-w-[400px]">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký tài khoản</h2>
            <p className="text-gray-500">Tham gia hệ thống AutoWash Pro</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  {...formik.getFieldProps('fullName')}
                  placeholder="VD: Nguyễn Văn A"
                  className={`w-full pl-11 pr-4 py-3 rounded-lg border outline-none transition-colors ${
                    formik.touched.fullName && formik.errors.fullName
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary'
                  }`}
                  disabled={formik.isSubmitting || success}
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {formik.touched.fullName && formik.errors.fullName ? (
                <div className="mt-1 text-sm text-red-600">{formik.errors.fullName}</div>
              ) : null}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại (ID đăng nhập)
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  {...formik.getFieldProps('phone')}
                  placeholder="090 123 4567"
                  className={`w-full pl-11 pr-4 py-3 rounded-lg border outline-none transition-colors ${
                    formik.touched.phone && formik.errors.phone
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary'
                  }`}
                  disabled={formik.isSubmitting || success}
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {formik.touched.phone && formik.errors.phone ? (
                <div className="mt-1 text-sm text-red-600">{formik.errors.phone}</div>
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
                  placeholder="Ít nhất 6 ký tự"
                  className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors pr-12 ${
                    formik.touched.password && formik.errors.password
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary'
                  }`}
                  disabled={formik.isSubmitting || success}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  disabled={formik.isSubmitting || success}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="mt-1 text-sm text-red-600">{formik.errors.password}</div>
              ) : null}
            </div>

            {success && (
              <div className="mt-4 p-3 rounded-lg bg-green-50 text-green-600 text-sm font-medium text-center border border-green-100">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={formik.isSubmitting || success}
              className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {formik.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Đang xử lý...
                </>
              ) : (
                'Đăng ký ngay'
              )}
            </button>
          </form>

          {apiError && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100">
              {apiError}
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link to="/auth/login" className="font-medium text-primary hover:text-blue-800 transition-colors">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
