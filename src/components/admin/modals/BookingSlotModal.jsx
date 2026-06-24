import { X, Trash2 } from 'lucide-react';

export default function BookingSlotModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  modalMode,
  TEN_SLOTS,
  isFormValid,
  handleDeleteBooking,
  handleNoShow
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-neutral-950 border border-white/10 rounded-2xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h2 className="text-lg font-hero text-white font-medium">
            {modalMode === 'add' ? 'Thêm đơn đặt lịch' : 'Cập nhật tiến độ'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Ngày</label>
              <input type="text" disabled value={formData.date} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/50 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Khung giờ</label>
              <input type="text" disabled value={TEN_SLOTS.find(s => s.key === formData.slotKey)?.time || ''} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/50 cursor-not-allowed" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-1.5">
              <label className="block text-xs font-medium text-white/60">Gói dịch vụ</label>
              {!isFormValid && (
                <span className="text-[10px] text-red-400">Vượt quá năng suất slot này!</span>
              )}
            </div>
            <select 
              value={formData.service}
              onChange={(e) => setFormData({...formData, service: e.target.value})}
              className={`w-full bg-neutral-900 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none appearance-none ${!isFormValid ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-cyan-500'}`}
            >
              <option value="Eco Wash">Eco Wash (15 phút)</option>
              <option value="Premium Care">Premium Care (30 phút)</option>
              <option value="Detailing & Shine">Detailing & Shine (60 phút)</option>
              <option value="Ceramic Shield">Ceramic Shield (120 phút)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Họ tên khách hàng</label>
            <input 
              type="text" 
              required
              value={formData.customer}
              onChange={(e) => setFormData({...formData, customer: e.target.value})}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none" 
              placeholder="Nhập tên khách hàng..." 
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Biển số xe (Tùy chọn)</label>
            <input 
              type="text" 
              value={formData.plate}
              onChange={(e) => setFormData({...formData, plate: e.target.value})}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white uppercase focus:border-cyan-500 focus:outline-none" 
              placeholder="Ví dụ: 30A-123.45" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Tiến độ</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none appearance-none"
              >
                <option value="PENDING">Lịch hẹn</option>
                <option value="ARRIVED">Xe đã đến</option>
                <option value="WORKING">Đang làm</option>
                <option value="COMPLETED">Hoàn thành</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Thanh toán</label>
              <select 
                value={formData.payment}
                onChange={(e) => setFormData({...formData, payment: e.target.value})}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none appearance-none"
              >
                <option value="UNPAID">Chưa thanh toán</option>
                <option value="PAID">Đã thanh toán</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/10">
            {modalMode === 'edit' && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDeleteBooking}
                  className="px-6 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} /> Hủy lịch
                </button>
                <button
                  type="button"
                  onClick={handleNoShow}
                  className="px-6 py-2.5 rounded-xl border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  No-show
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white font-medium transition-colors"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
