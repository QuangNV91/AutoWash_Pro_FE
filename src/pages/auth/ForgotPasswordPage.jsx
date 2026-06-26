import { useState } from 'react';
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
    <div className="flex min-h-screen w-full bg-black font-body">
      {/* Left Column - 60% */}
      <div className="hidden lg:flex w-[60%] relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center">
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),transparent_50%)]"></div>
        
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
            Khôi phục mật khẩu <br />
            <span className="text-white/70">
              nhanh chóng
            </span>
          </h1>
          <p className="text-lg text-white/60 max-w-lg mt-4 mb-8 leading-relaxed">
            Đừng lo lắng, hệ thống của chúng tôi sẽ giúp bạn lấy lại quyền truy cập một cách an toàn và dễ dàng.
          </p>
        </div>
      </div>

      {/* Right Column - 40% */}
      <div className="w-full lg:w-[40%] bg-neutral-950 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden max-h-screen">
        <div className="absolute top-1/2 right-0 w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        <div className="w-full max-w-[420px] relative z-10">
          <Link 
            to="/auth/login" 
            className="inline-flex items-center text-sm font-medium text-white/40 hover:text-cyan-400 transition-colors mb-8"
          >
            <ArrowLeft size={16} className="mr-2" />
            Quay lại đăng nhập
          </Link>
          
          <div className="text-center lg:text-left mb-8">
            <h2 className="font-hero text-3xl font-medium text-white mb-2 tracking-tight">Quên mật khẩu</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Nhập email hoặc số điện thoại của bạn, chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-white/80 mb-2">
                Email / Số điện thoại
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                {...formik.getFieldProps('identifier')}
                placeholder="Nhập email hoặc số điện thoại"
                className={`bg-white/5 border ${
                  formik.touched.identifier && formik.errors.identifier
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/10 focus:border-cyan-400'
                } text-white placeholder-white/30 rounded-lg px-4 py-3.5 w-full outline-none transition-colors duration-200`}
                disabled={formik.isSubmitting || success}
              />
              {formik.touched.identifier && formik.errors.identifier ? (
                <div className="mt-2 text-sm text-red-400">{formik.errors.identifier}</div>
              ) : null}
            </div>

            {success && (
              <div className="mt-5 p-4 rounded-lg bg-green-900/20 border border-green-500/20 text-green-400 text-sm font-medium">
                {success}
              </div>
            )}

            {!success && (
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-medium px-8 py-3.5 rounded-full transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4 text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
              >
                {formik.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Đang gửi yêu cầu...
                  </>
                ) : (
                  'Gửi yêu cầu khôi phục'
                )}
              </button>
            )}
          </form>

          {apiError && (
            <div className="mt-5 p-3 rounded-lg bg-red-900/20 border border-red-500/20 text-red-400 text-sm font-medium text-center">
              {apiError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
