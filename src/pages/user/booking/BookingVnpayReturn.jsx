import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function BookingVnpayReturn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');

  const txnRef = searchParams.get('txnRef');
  const paymentStatus = searchParams.get('paymentStatus'); // SUCCESS, FAILED
  const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');

  useEffect(() => {
    // If we have explicit paymentStatus from our backend redirect
    if (paymentStatus === 'SUCCESS') {
      setStatus('success');
    } else if (paymentStatus === 'FAILED' || vnp_ResponseCode && vnp_ResponseCode !== '00') {
      setStatus('error');
    } else {
      setStatus('error');
    }
  }, [paymentStatus, vnp_ResponseCode]);

  return (
    <PageWrapper title="Kết quả thanh toán">
      <div className="container mx-auto px-4 max-w-2xl pt-20 pb-32">
        <div className="bg-neutral-950 border border-white/5 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          {status === 'loading' && (
            <div className="flex flex-col items-center py-10">
              <Loader2 size={48} className="animate-spin text-white/40 mb-4" />
              <p className="text-white/60">Đang xác thực giao dịch...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="relative z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/10 blur-[100px] rounded-full"></div>
              
              <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={48} className="text-green-400" />
              </div>
              
              <h1 className="font-hero text-3xl md:text-4xl font-medium text-white mb-4 tracking-tight">Thanh toán thành công!</h1>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Giao dịch của bạn đã được xác nhận. Cảm ơn bạn đã sử dụng dịch vụ tại AutoWash Pro.
              </p>

              {txnRef && (
                <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 mb-8 flex items-center gap-4">
                  <span className="text-white/40 text-sm">Mã giao dịch:</span>
                  <span className="text-white font-mono font-medium">{txnRef}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-3.5 font-medium rounded-full bg-white text-black hover:bg-neutral-200 transition-colors"
                >
                  Quản lý lịch hẹn
                </button>
                <Link 
                  to="/"
                  className="px-8 py-3.5 font-medium rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors"
                >
                  Về trang chủ
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="relative z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/10 blur-[100px] rounded-full"></div>
              
              <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6">
                <XCircle size={48} className="text-red-400" />
              </div>
              
              <h1 className="font-hero text-3xl md:text-4xl font-medium text-white mb-4 tracking-tight">Thanh toán thất bại</h1>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Giao dịch chưa được hoàn tất hoặc đã bị hủy bỏ. Lịch đặt của bạn vẫn được lưu giữ, vui lòng thanh toán lại hoặc thanh toán tại cửa hàng.
              </p>

              {txnRef && (
                <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 mb-8 flex items-center gap-4">
                  <span className="text-white/40 text-sm">Mã giao dịch:</span>
                  <span className="text-white font-mono font-medium">{txnRef}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-3.5 font-medium rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors"
                >
                  Xem lịch đã đặt
                </button>
                <Link 
                  to="/booking"
                  className="px-8 py-3.5 font-medium rounded-full bg-white text-black hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                >
                  Đặt lịch lại <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
