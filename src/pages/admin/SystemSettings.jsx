import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Server, Globe, Power, Lock } from 'lucide-react';

export default function SystemSettings() {
  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-[1400px] mx-auto font-body text-white selection:bg-cyan-500/30">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Settings className="text-cyan-400" size={28} />
            <h1 className="font-hero text-3xl font-medium tracking-tight">Cấu hình Hệ thống</h1>
          </div>
          <p className="text-white/40 text-sm font-mono tracking-wide">SYSTEM.PREFERENCES // Quản lý thông số vận hành lõi</p>
        </div>
        <button className="px-6 py-2.5 bg-cyan-500/10 text-cyan-400 font-medium text-sm rounded-xl border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] font-mono uppercase tracking-widest flex items-center gap-2">
          <Save size={16} /> LƯU THAY ĐỔI
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT NAV (Mock) */}
        <div className="space-y-2">
          {[
            { id: 'general', label: 'Cài đặt chung', icon: Globe, active: true },
            { id: 'security', label: 'Bảo mật & Phân quyền', icon: Shield, active: false },
            { id: 'notifications', label: 'Cấu hình Thông báo', icon: Bell, active: false },
            { id: 'maintenance', label: 'Bảo trì máy chủ', icon: Server, active: false },
          ].map(tab => (
            <button key={tab.id} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab.active ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
              <tab.icon size={18} className={tab.active ? 'text-cyan-400' : ''} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* SETTINGS CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6 space-y-6">
            <h3 className="font-hero text-lg font-medium tracking-tight border-b border-white/5 pb-4">Thông tin Cơ sở</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 tracking-widest uppercase">Tên Xưởng / Cửa hàng</label>
                <input type="text" defaultValue="AutoWash Pro Premium" className="w-full bg-black/50 border border-white/10 px-4 py-2.5 rounded-lg text-sm text-white focus:border-cyan-500 focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 tracking-widest uppercase">Hotline CSKH</label>
                <input type="text" defaultValue="1900 8888" className="w-full bg-black/50 border border-white/10 px-4 py-2.5 rounded-lg text-sm text-white focus:border-cyan-500 focus:outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-white/40 tracking-widest uppercase">Địa chỉ</label>
              <input type="text" defaultValue="123 Nguyễn Văn Linh, Quận 7, TP.HCM" className="w-full bg-black/50 border border-white/10 px-4 py-2.5 rounded-lg text-sm text-white focus:border-cyan-500 focus:outline-none" />
            </div>
          </div>

          <div className="bg-neutral-950 border border-white/5 rounded-2xl p-6 space-y-6">
            <h3 className="font-hero text-lg font-medium tracking-tight border-b border-white/5 pb-4">Quy tắc Tự động</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Tự động duyệt Lịch hẹn</h4>
                  <p className="text-[10px] font-mono text-white/40">Bỏ qua bước duyệt thủ công nếu khách đặt trước 2 tiếng và xưởng còn trống.</p>
                </div>
                <div className="w-12 h-6 bg-cyan-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Cảnh báo Công nợ</h4>
                  <p className="text-[10px] font-mono text-white/40">Gửi SMS cho khách nếu sau 24h chưa thanh toán hóa đơn.</p>
                </div>
                <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer border border-white/20">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white/40 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 flex items-start justify-between">
            <div>
              <h3 className="font-hero text-lg font-medium text-red-400 tracking-tight mb-1">Chế độ Bảo trì (Maintenance Mode)</h3>
              <p className="text-xs text-white/40 font-mono">Đóng toàn bộ hệ thống đặt lịch của khách hàng. Chỉ Admin truy cập được.</p>
            </div>
            <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-xs font-mono font-medium hover:bg-red-500/20 transition-colors">
              KÍCH HOẠT
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
