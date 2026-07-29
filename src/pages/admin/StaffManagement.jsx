import { useState, useEffect } from 'react';
import { Users, Search, Plus, ShieldAlert, CheckCircle2, UserX, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function StaffManagement() {
  const [staffs, setStaffs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    fullName: '',
    staffType: 'WASHER'
  });

  const fetchStaffs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/staffs');
      if (res.data?.success && res.data.data) {
        setStaffs(res.data.data);
      }
    } catch (err) {
      console.error('Fetch staffs failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const handleDeactivate = async (id, currentStatus) => {
    if (currentStatus === 'INACTIVE') return;
    if (window.confirm("Bạn có chắc chắn muốn vô hiệu hóa tài khoản nhân viên này?")) {
      try {
        await api.patch(`/api/staffs/${id}/deactivate`);
        fetchStaffs();
      } catch (err) {
        console.error('Deactivate failed:', err);
        toast.error(err.response?.data?.message || 'Lỗi khi vô hiệu hóa');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/staffs', formData);
      setIsModalOpen(false);
      setFormData({
        username: '', password: '', email: '', phone: '', fullName: '', staffType: 'WASHER'
      });
      fetchStaffs();
    } catch (err) {
      console.error('Create staff failed:', err);
      toast.error(err.response?.data?.message || 'Lỗi khi tạo nhân viên');
    }
  };

  const filteredStaffs = staffs.filter(s =>
    s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.account?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-7xl mx-auto font-body text-white selection:bg-cyan-500/30">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-cyan-400" size={28} />
            <h1 className="font-hero text-3xl font-medium tracking-tight">Nhân sự</h1>
          </div>
          <p className="text-white/40 text-sm font-mono tracking-wide">Quản lý danh sách nhân viên & Tài khoản</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input
              type="text"
              placeholder="Tìm tên nhân viên..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} /> Thêm nhân viên
          </button>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs font-medium mb-1">Tổng nhân viên</p>
            <p className="text-3xl font-hero text-cyan-400">{staffs.length}</p>
          </div>
          <Users size={32} className="text-white/5" />
        </div>
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs font-medium mb-1">Đang hoạt động</p>
            <p className="text-3xl font-hero text-emerald-400">
              {staffs.filter(s => s.status === 'ACTIVE').length}
            </p>
          </div>
          <CheckCircle2 size={32} className="text-white/5" />
        </div>
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs font-medium mb-1">Đã khóa</p>
            <p className="text-3xl font-hero text-red-400">
              {staffs.filter(s => s.status === 'INACTIVE').length}
            </p>
          </div>
          <UserX size={32} className="text-white/5" />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-neutral-950 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-black/20">
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase">ID</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase">Nhân viên</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase">Tài khoản</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase">Bộ phận</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-mono tracking-widest text-white/30 uppercase text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8 text-white/40">Đang tải dữ liệu...</td></tr>
              ) : filteredStaffs.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-white/40">Không tìm thấy nhân viên</td></tr>
              ) : (
                filteredStaffs.map((staff) => (
                  <tr key={staff.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-white/40 text-xs">NV-{String(staff.id).padStart(3, '0')}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{staff.fullName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white/60 font-mono text-xs">{staff.account?.username}</div>
                      <div className="text-white/40 text-[10px] mt-0.5">{staff.account?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 bg-white/5 border border-white/10 rounded text-cyan-400 font-mono text-xs">
                        {staff.staffType || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {staff.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                          <CheckCircle2 size={12} /> Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded">
                          <ShieldAlert size={12} /> Đã khóa
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeactivate(staff.id, staff.status)}
                        disabled={staff.status === 'INACTIVE'}
                        className="px-3 py-1.5 rounded bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors text-xs disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-white/60"
                      >
                        Khóa TK
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-neutral-950 border border-white/10 rounded-2xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-lg font-hero text-white font-medium">Thêm nhân viên mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Họ và tên</label>
                <input
                  type="text" required
                  value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Tên đăng nhập</label>
                  <input
                    type="text" required
                    value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Mật khẩu</label>
                  <input
                    type="password" required
                    value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Số điện thoại</label>
                  <input
                    type="text" required
                    value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Email</label>
                  <input
                    type="email" required
                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Loại nhân viên</label>
                <select
                  value={formData.staffType} onChange={(e) => setFormData({ ...formData, staffType: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none appearance-none"
                >
                  <option value="WASHER">Nhân viên rửa xe</option>
                  <option value="MECHANIC">Thợ sửa chữa</option>
                  <option value="RECEPTIONIST">Lễ tân</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white font-medium transition-colors">
                  Hủy
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors">
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
