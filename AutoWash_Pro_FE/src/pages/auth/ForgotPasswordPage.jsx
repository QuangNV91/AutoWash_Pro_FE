import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');

  const formik = useFormik({
    initialValues: {
      identifier: '',
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
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setApiError('');
      setSuccess('');
      
      try {
        await api.post('/auth/forgot-password', { identifier: values.identifier });
        setSuccess('Hướng dẫn khôi phục mật khẩu đã được gửi đến bạn.');
        
      } catch (err) {
        setApiError(
          err.response?.data?.message || 
          err.response?.data?.error || 
          'Không thể gửi yêu cầu. Vui lòng kiểm tra lại thông tin.'
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
            Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập một cách nhanh chóng.
          </p>
        </div>
      </div>

      {/* Right Column - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[400px]">
          <Link 
            to="/auth/login" 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={16} className="mr-2" />
            Quay lại đăng nhập
          </Link>
          
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quên mật khẩu</h2>
            <p className="text-gray-500">
              Nhập email hoặc số điện thoại của bạn, chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu.
            </p>
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
                disabled={formik.isSubmitting || success}
              />
              {formik.touched.identifier && formik.errors.identifier ? (
                <div className="mt-1 text-sm text-red-600">{formik.errors.identifier}</div>
              ) : null}
            </div>

            {success && (
              <div className="p-4 rounded-lg bg-green-50 text-green-700 text-sm font-medium border border-green-100">
                {success}
              </div>
            )}

            {!success && (
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Đang gửi yêu cầu...
                  </>
                ) : (
                  'Gửi yêu cầu khôi phục'
                )}
              </button>
            )}
          </form>

          {apiError && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100">
              {apiError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
