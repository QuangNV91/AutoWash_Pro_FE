import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Power, GripVertical, Settings2, ShieldCheck, Zap, Server, Loader2 } from 'lucide-react';
import api from '../../services/api';

const THEME_COLORS = {
  cyan: { name: 'Cyan', main: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', dot: 'bg-cyan-400', shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]' },
  purple: { name: 'Purple', main: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', dot: 'bg-purple-400', shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]' },
  emerald: { name: 'Emerald', main: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-400', shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]' },
  amber: { name: 'Amber', main: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-400', shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]' },
  slate: { name: 'Slate', main: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', dot: 'bg-slate-400', shadow: 'shadow-[0_0_20px_rgba(100,116,139,0.15)]' },
};

const FALLBACK_SERVICES = [
  { id: 'SRV-01', name: 'Eco Wash', duration: 15, price: 40000, color: 'cyan', isActive: true, features: ['Rửa bọt tuyết', 'Lau khô cơ bản', 'Hút bụi sàn'] },
  { id: 'SRV-02', name: 'Premium Care', duration: 30, price: 150000, color: 'purple', isActive: true, features: ['Quy trình Eco Wash', 'Phủ sáp nhanh', 'Vệ sinh nội thất', 'Khử mùi ozone'] },
  { id: 'SRV-03', name: 'Detailing & Shine', duration: 60, price: 350000, color: 'emerald', isActive: true, features: ['Quy trình Premium Care', 'Tẩy bụi sơn', 'Dưỡng nhựa/da', 'Đánh bóng nhẹ'] },
  { id: 'SRV-04', name: 'Ceramic Shield', duration: 120, price: 800000, color: 'amber', isActive: true, features: ['Quy trình Detailing', 'Phủ Ceramic 9H', 'Bảo hành 12 tháng', 'Làm sạch khoang máy'] },
  { id: 'SRV-05', name: 'Odor Eliminator', duration: 30, price: 100000, color: 'slate', isActive: false, features: ['Xông tinh dầu', 'Vệ sinh giàn lạnh', 'Khử mùi sinh học'] },
];

// Map color & features by service name (BE doesn't store these, FE manages locally)
const SERVICE_EXTRAS = {
  'Eco Wash': { color: 'cyan', features: ['Rửa bọt tuyết', 'Lau khô cơ bản', 'Hút bụi sàn'] },
  'Premium Care': { color: 'purple', features: ['Quy trình Eco Wash', 'Phủ sáp nhanh', 'Vệ sinh nội thất', 'Khử mùi ozone'] },
  'Detailing & Shine': { color: 'emerald', features: ['Quy trình Premium Care', 'Tẩy bụi sơn', 'Dưỡng nhựa/da', 'Đánh bóng nhẹ'] },
  'Ceramic Shield': { color: 'amber', features: ['Quy trình Detailing', 'Phủ Ceramic 9H', 'Bảo hành 12 tháng', 'Làm sạch khoang máy'] },
  'Odor Eliminator': { color: 'slate', features: ['Xông tinh dầu', 'Vệ sinh giàn lạnh', 'Khử mùi sinh học'] },
};
const COLORS_ORDER = ['cyan', 'purple', 'emerald', 'amber', 'slate'];

// Transform BE response to FE format
const mapApiToLocal = (apiService) => {
  const extras = SERVICE_EXTRAS[apiService.serviceName] || {};
  return {
    id: apiService.id,
    name: apiService.serviceName,
    duration: apiService.duration,
    price: Number(apiService.basePrice),
    color: extras.color || COLORS_ORDER[apiService.id % COLORS_ORDER.length] || 'cyan',
    isActive: apiService.status === 'ACTIVE',
    features: extras.features || (apiService.description ? apiService.description.split(',').map(s => s.trim()) : ['Dịch vụ rửa xe']),
    basePoints: apiService.basePoints || 0,
    description: apiService.description || '',
  };
};

export default function ServiceManagement() {
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', duration: 15, price: 0, color: 'cyan', isActive: true, features: ['']
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Fetch all services from BE on mount
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/services');
      if (res.data?.success && res.data.data && res.data.data.length > 0) {
        setServices(res.data.data.map(mapApiToLocal));
      }
    } catch (err) {
      console.error('Fetch services failed, using fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleToggleActive = async (id) => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    try {
      if (service.isActive) {
        // Deactivate: BE doesn't have a deactivate for services, use delete then re-add
        // Actually BE has DELETE and PATCH activate. Let's use DELETE to deactivate and PATCH to activate.
        await api.delete(`/api/services/${id}`);
        showToast(`Đã tắt dịch vụ "${service.name}"`);
      } else {
        await api.patch(`/api/services/${id}/activate`);
        showToast(`Đã kích hoạt "${service.name}"`);
      }
      await fetchServices();
    } catch (err) {
      console.error('Toggle active failed:', err);
      showToast(err.response?.data?.message || 'Thao tác thất bại', 'error');
      // Fallback: update local state
      setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa vĩnh viễn dịch vụ này? Hành động này không thể hoàn tác.")) return;
    try {
      await api.delete(`/api/services/${id}`);
      showToast('Đã xóa dịch vụ thành công');
      await fetchServices();
    } catch (err) {
      console.error('Delete failed:', err);
      showToast(err.response?.data?.message || 'Xóa thất bại', 'error');
      // Fallback
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingId(null);
    setFormData({
      name: '', duration: 15, price: '', color: 'cyan', isActive: true, features: ['']
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service) => {
    setModalMode('edit');
    setEditingId(service.id);
    setFormData({ ...service, features: [...service.features] });
    setIsModalOpen(true);
  };

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const cleanFeatures = formData.features.filter(f => f.trim() !== '');
    const finalData = { ...formData, features: cleanFeatures, price: Number(formData.price) };

    // Build BE payload
    const payload = {
      serviceName: finalData.name,
      description: cleanFeatures.join(', '),
      duration: finalData.duration,
      basePrice: finalData.price,
      basePoints: Math.floor(finalData.price / 10000), // Auto-calc points
      status: finalData.isActive ? 'ACTIVE' : 'INACTIVE',
    };

    setSaving(true);
    try {
      if (modalMode === 'add') {
        await api.post('/api/services', payload);
        showToast(`Tạo dịch vụ "${finalData.name}" thành công`);
      } else {
        await api.put(`/api/services/${editingId}`, payload);
        showToast(`Cập nhật "${finalData.name}" thành công`);
      }
      // Save color + features to local map for future reference
      SERVICE_EXTRAS[finalData.name] = { color: finalData.color, features: cleanFeatures };
      setIsModalOpen(false);
      await fetchServices();
    } catch (err) {
      console.error('Save failed:', err);
      showToast(err.response?.data?.message || 'Lưu thất bại', 'error');
      // Fallback: update local
      if (modalMode === 'add') {
        const newId = `SRV-0${services.length + 1}`;
        setServices([...services, { id: newId, ...finalData }]);
      } else {
        setServices(services.map(s => s.id === editingId ? { ...s, ...finalData } : s));
      }
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-7xl mx-auto font-body text-white selection:bg-cyan-500/30">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Server className="text-cyan-400" size={24} />
            <h1 className="font-hero text-3xl font-medium tracking-tight">Cấu hình Dịch vụ</h1>
          </div>
          <p className="text-white/40 text-sm font-mono tracking-wide">SYSTEM.CATALOG.MODULES // Quản lý danh sách dịch vụ và định mức</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500/10 text-cyan-400 font-medium text-sm rounded-none border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all overflow-hidden"
        >
          <div className="absolute inset-y-0 left-0 w-1 bg-cyan-400" />
          <Plus size={16} />
          <span>KHỞI TẠO MODULE</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl border flex items-center gap-3 text-sm font-medium shadow-2xl animate-[fadeIn_0.3s_ease] ${
          toast.type === 'error' 
            ? 'bg-red-500/10 border-red-500/30 text-red-400' 
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          {toast.type === 'error' ? <X size={16} /> : <Check size={16} />}
          {toast.message}
        </div>
      )}

      {/* Services Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-cyan-400" size={32} />
          <span className="ml-3 text-white/40 font-mono text-sm">Đang tải dữ liệu từ server...</span>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service) => {
          const theme = THEME_COLORS[service.color];
          const isOff = !service.isActive;
          
          return (
            <div 
              key={service.id} 
              className={`relative flex flex-col bg-neutral-950 border border-white/10 transition-all duration-300
                ${isOff ? 'opacity-50 grayscale hover:grayscale-0' : `hover:border-white/20 hover:bg-white/[0.02] ${theme.shadow}`}
              `}
            >
              {/* Top Accent Line */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${isOff ? 'bg-white/10' : theme.dot}`} />

              {/* Card Header */}
              <div className="p-5 border-b border-white/5 flex justify-between items-start">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${isOff ? 'bg-white/20' : theme.dot} ${!isOff && 'animate-pulse'}`} />
                    <span className="font-mono text-xs text-white/40">{service.id}</span>
                  </div>
                  <h3 className={`font-hero text-xl font-medium tracking-tight ${isOff ? 'text-white/60' : 'text-white'}`}>
                    {service.name}
                  </h3>
                </div>
                <div className={`px-2 py-1 border rounded text-[10px] font-mono tracking-widest ${isOff ? 'border-white/10 text-white/40' : theme.border + ' ' + theme.main}`}>
                  {service.duration} MIN
                </div>
              </div>

              {/* Card Body - Specs */}
              <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Đơn giá / VNĐ</span>
                  <div className={`text-2xl font-light font-mono tracking-tight ${isOff ? 'text-white/40' : 'text-white'}`}>
                    {service.price.toLocaleString('vi-VN')}
                  </div>
                </div>

                <div className="h-px bg-white/5 w-full" />

                <div className="flex-1">
                  <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-3 block">Đặc tả tính năng</span>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check size={14} className={`mt-0.5 shrink-0 ${isOff ? 'text-white/20' : theme.main}`} />
                        <span className={isOff ? 'text-white/40' : 'text-white/70'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer - Actions */}
              <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
                <button 
                  onClick={() => handleToggleActive(service.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-colors
                    ${isOff 
                      ? 'border-white/10 text-white/40 hover:text-white hover:bg-white/5' 
                      : 'border-white/10 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                    }`}
                >
                  <Power size={14} />
                  {isOff ? 'OFFLINE' : 'ONLINE'}
                </button>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenEditModal(service)}
                    className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    <Settings2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-2xl bg-neutral-950 border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <Settings2 className="text-white/40" size={20} />
                <h2 className="text-lg font-mono text-white tracking-widest uppercase">
                  {modalMode === 'add' ? 'Khởi tạo Module' : 'Cấu hình Module'}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto font-mono text-sm">
              <form id="serviceForm" onSubmit={handleFormSubmit} className="space-y-6">
                
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
                onClick={() => setIsModalOpen(false)}
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
      )}
    </div>
  );
}
