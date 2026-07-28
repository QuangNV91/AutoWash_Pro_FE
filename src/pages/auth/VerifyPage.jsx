import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Loader2, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');

  const phone = location.state?.phone || '';
  const expectedCode = location.state?.code || '';

  useEffect(() => {
    if (!phone) {
      toast.error('Không tìm thấy thông tin đăng ký. Vui lòng đăng ký lại.');
      navigate('/auth/register');
    } else if (expectedCode) {
      toast.success(`(Mã OTP test của bạn là: ${expectedCode})`, { duration: 30000 });
    }
  }, [phone, expectedCode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || code.length < 6) {
      setApiError('Vui lòng nhập đủ 6 số OTP');
      return;
    }

    setIsSubmitting(true);
    setApiError('');
    setSuccess('');

    try {
      const response = await api.post('/auth/verify-phone', {
        phone: phone,
        code: code
      });
      
      setSuccess('Xác thực thành công! Đang chuyển hướng...');
      
      const data = response?.data || response;
      const token = data?.token || data?.data?.token;
      const role = data?.role || data?.data?.role;
      
      // Since verify-phone returns a token, we can log them in automatically
      if (token) {
        localStorage.setItem('token', token);
        if (role) localStorage.setItem('role', role);
        
        setTimeout(() => {
          if (role === 'ADMIN') navigate('/admin');
          else if (role === 'STAFF') navigate('/staff');
          else navigate('/');
        }, 1500);
      } else {
        setTimeout(() => {
          navigate('/auth/login');
        }, 1500);
      }
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Xác thực thất bại. Vui lòng kiểm tra lại mã.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-black font-body">
      <div className="hidden lg:flex w-[60%] relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.15),transparent_50%)]"></div>
        <div className="absolute top-8 left-12 z-20">
          <Link to="/" className="flex items-center gap-2">
            <svg viewBox="0 0 256 256" className="h-6 w-6" fill="#ffffff">
              <path d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z" />
            </svg>
            <span className="text-white text-base font-normal tracking-tight">autowash pro</span>
          </Link>
        </div>
      </div>

      <div className="w-full lg:w-[40%] bg-neutral-950 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden max-h-screen">
        <div className="absolute top-1/2 right-0 w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        <div className="w-full max-w-[420px] relative z-10">
          <div className="text-center lg:text-left mb-8">
            <h2 className="font-hero text-3xl font-medium text-white mb-2 tracking-tight">Xác thực tài khoản</h2>
            <p className="text-white/60">Nhập mã OTP đã được gửi đến số {phone}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-white/80 mb-2">
                Mã xác thực OTP
              </label>
              <div className="relative">
                <input
                  id="code"
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Nhập 6 số OTP"
                  className="bg-white/5 border border-white/10 focus:border-emerald-400 text-white placeholder-white/30 rounded-lg pl-11 pr-4 py-3 w-full outline-none transition-colors duration-200 tracking-[0.5em] text-center font-mono text-lg"
                  disabled={isSubmitting || success}
                />
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              </div>
            </div>

            {success && (
              <div className="mt-5 p-3 rounded-lg bg-emerald-900/20 border border-emerald-500/20 text-emerald-400 text-sm font-medium text-center">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || success}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-8 py-3.5 rounded-full transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4 text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Đang xác thực...
                </>
              ) : (
                'Xác nhận OTP'
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
            Trở lại đăng nhập?{' '}
            <Link to="/auth/login" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
              Tại đây
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
