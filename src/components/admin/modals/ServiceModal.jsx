import { Plus, X, GripVertical, Settings2, Loader2 } from 'lucide-react';

export default function ServiceModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  saving,
  modalMode,
  THEME_COLORS
}) {
  if (!isOpen) return null;

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleAddFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-body text-white">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <Settings2 className="text-white/40" size={20} />
            <h2 className="text-lg font-mono text-white tracking-widest uppercase">
              {modalMode === 'add' ? 'Khởi tạo Module' : 'Cấu hình Module'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-6 overflow-y-auto font-mono text-sm">
          <form id="serviceForm" onSubmit={onSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 tracking-widest uppercase">Tên dịch vụ</label>
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 px-4 py-2 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="e.g. Eco Wash"
                />
              </div>

              {/* Theme Color */}
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 tracking-widest uppercase">Phân loại (Màu sắc)</label>
                <div className="flex gap-3 h-[42px] items-center">
                  {Object.entries(THEME_COLORS).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({...formData, color: key})}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${config.border} border-2 
                        ${formData.color === key ? config.bg + ' scale-110' : 'border-dashed opacity-50 hover:opacity-100'}`}
                    >
                      <div className={`w-3 h-3 rounded-full ${config.dot}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 tracking-widest uppercase">Đơn giá (VNĐ)</label>
                <input 
                  type="number" required min="0" step="1000"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 px-4 py-2 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="0"
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 tracking-widest uppercase">Thời lượng (Phút)</label>
                <select 
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                  className="w-full bg-black/50 border border-white/10 px-4 py-2 text-white focus:border-cyan-500 focus:outline-none appearance-none transition-colors"
                >
                  <option value={15}>15 MIN</option>
                  <option value={30}>30 MIN</option>
                  <option value={45}>45 MIN</option>
                  <option value={60}>60 MIN</option>
                  <option value={90}>90 MIN</option>
                  <option value={120}>120 MIN</option>
                </select>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-white/40 tracking-widest uppercase">Danh sách đặc tả (Features)</label>
                <button 
                  type="button" onClick={handleAddFeature}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Plus size={14} /> Thêm dòng
                </button>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {formData.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2 items-center group">
                    <div className="text-white/20 cursor-grab px-1"><GripVertical size={14} /></div>
                    <input 
                      type="text" required
                      value={feature}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      className="flex-1 bg-black/50 border border-white/5 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                      placeholder={`Feature ${idx + 1}`}
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveFeature(idx)}
                      disabled={formData.features.length === 1}
                      className="p-2 text-white/20 hover:text-red-400 disabled:opacity-30 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end gap-4">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-mono text-white/60 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
          >
            CANCEL
          </button>
          <button 
            form="serviceForm"
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-sm font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'ĐANG LƯU...' : (modalMode === 'add' ? 'INITIALIZE' : 'SAVE_CHANGES')}
          </button>
        </div>
      </div>
    </div>
  );
}
