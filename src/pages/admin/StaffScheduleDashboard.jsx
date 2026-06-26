import { useState, useEffect } from 'react';
import api from '../../services/api';
import LeaveRequestModal from '../../components/admin/modals/LeaveRequestModal';
import toast from 'react-hot-toast';
import { 
  Users, AlertTriangle, Check, X, UserCheck, Plus,
  RefreshCw
} from 'lucide-react';

// ============ NATIVE DATE HELPERS ============

const generateCurrentWeek = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));
  
  return Array.from({length: 7}).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      id: i,
      dateObj: d,
      name: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][d.getDay()],
      short: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()],
      dateStr: `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`,
      fullDate: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,
      isWeekend: d.getDay() === 0 || d.getDay() === 6
    };
  });
};

const WEEK_DAYS = generateCurrentWeek();

const SHIFT_DEFINITIONS = [
  { key: 'morning', label: '07:00 - 12:00', alias: 'CA 1' },
  { key: 'afternoon', label: '13:00 - 18:00', alias: 'CA 2' },
];

const INITIAL_STAFF = [];

export default function StaffScheduleDashboard() {
  const [staffProfiles, setStaffProfiles] = useState(INITIAL_STAFF);
  const [scheduleData, setScheduleData] = useState([]);
  const [rotationPointer, setRotationPointer] = useState(0);
  const [summary, setSummary] = useState({ fullShifts: 0, missingShifts: 0, totalShifts: 0 });
  
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]); // [{ staffId, date }]

  // Modals
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [reqForm, setReqForm] = useState({ staffId: 'NV-01', startDate: WEEK_DAYS[0].fullDate, duration: 1 });

  // ============ LOGIC ============

  const pendingRequests = leaveRequests.filter(r => r.status === 'pending');
  const requestHistory = leaveRequests.filter(r => r.status !== 'pending');

  const createStaffSchedule = (opts = { notify: true }, leavesOverride = null, staffDataOverride = null) => {
    const leaves = leavesOverride || approvedLeaves;
    const currentStaffs = staffDataOverride || staffProfiles;
    if (currentStaffs.length === 0) return;
    
    let fullShifts = 0;
    let missingShifts = 0;
    let totalShifts = 0;

    const workers = currentStaffs.map((staff, index) => ({
      ...staff,
      currentHours: 0,
      currentShifts: 0,
      currentLeaves: leaves.filter(l => l.staffId === staff.id).length,
      sortIndex: (index + rotationPointer) % staffProfiles.length,
    }));

    const newSchedule = WEEK_DAYS.map((dayObj) => {
      // 1. Phân loại nhân sự nghỉ phép
      const onLeaveWorkers = workers.filter(w => leaves.some(l => l.staffId === w.id && l.date === dayObj.fullDate));
      const availableWorkers = workers.filter(w => !onLeaveWorkers.includes(w));

      // 2. Sắp xếp ưu tiên
      const sortedWorkers = availableWorkers.slice().sort((a, b) => {
        if (a.currentHours !== b.currentHours) return a.currentHours - b.currentHours;
        return a.sortIndex - b.sortIndex;
      });

      // 3. Phân CA 1 (Cần 2 người)
      const morningAssigned = sortedWorkers.slice(0, 2);
      let morningAssignments = [];
      if (morningAssigned.length > 0) {
        morningAssignments = morningAssigned.map((w) => ({ id: `${dayObj.short}-m-${w.id}`, staffId: w.id, name: w.name, avatarBg: w.avatarBg }));
        morningAssigned.forEach((w) => { w.currentHours += 5; w.currentShifts += 1; });
      }
      totalShifts++;
      if (morningAssigned.length < 2) missingShifts++; else fullShifts++;

      // 4. Phân CA 2 (Cần 2 người khác CA 1)
      const remainingWorkers = sortedWorkers.filter(w => !morningAssignments.some(m => m.staffId === w.id));
      const afternoonAssigned = remainingWorkers.slice(0, 2);
      let afternoonAssignments = [];
      if (afternoonAssigned.length > 0) {
        afternoonAssignments = afternoonAssigned.map((w) => ({ id: `${dayObj.short}-a-${w.id}`, staffId: w.id, name: w.name, avatarBg: w.avatarBg }));
        afternoonAssigned.forEach((w) => { w.currentHours += 5; w.currentShifts += 1; });
      }
      totalShifts++;
      if (afternoonAssigned.length < 2) missingShifts++; else fullShifts++;

      return { 
        day: dayObj, 
        onLeave: onLeaveWorkers.map(w => ({ id: w.id, name: w.name, avatarBg: w.avatarBg })),
        shifts: { morning: morningAssignments, afternoon: afternoonAssignments }
      };
    });

    const updatedProfiles = workers.map((worker) => ({
      ...worker,
      weeklyHours: worker.currentHours,
      shiftsAssigned: worker.currentShifts,
      leaveDays: worker.currentLeaves
    }));

    setStaffProfiles(updatedProfiles);
    setScheduleData(newSchedule);
    setSummary({ fullShifts, missingShifts, totalShifts });
    setRotationPointer((prev) => (prev + 1) % currentStaffs.length);
  };

  useEffect(() => {
    // Fetch Staffs
    const fetchStaffsAndInit = async () => {
      try {
        const staffRes = await api.get('/api/staffs');
        if (staffRes.data?.success && staffRes.data.data) {
          const colors = [
            { bg: 'bg-cyan-500', text: 'text-cyan-400' },
            { bg: 'bg-purple-500', text: 'text-purple-400' },
            { bg: 'bg-emerald-500', text: 'text-emerald-400' },
            { bg: 'bg-amber-500', text: 'text-amber-400' },
          ];
          const mappedStaffs = staffRes.data.data
            .filter(s => s.status === 'ACTIVE') // Only active staff
            .map((s, idx) => ({
              id: s.id,
              name: s.fullName,
              weeklyHours: 0,
              shiftsAssigned: 0,
              leaveDays: 0,
              avatarBg: colors[idx % colors.length].bg,
              color: colors[idx % colors.length].text
          }));
          setStaffProfiles(mappedStaffs);
          createStaffSchedule({ notify: false }, null, mappedStaffs);
        }
      } catch (err) {
        console.error('Fetch staffs failed:', err);
      }
    };
    
    fetchStaffsAndInit();
    
    // Fetch pending leave requests from API
    const fetchLeaves = async () => {
      try {
        const res = await api.get('/api/leave-requests/pending');
        if (res.data?.success && res.data.data) {
          const mappedLeaves = res.data.data.map(l => ({
            id: l.id,
            staffId: l.staff?.id || 'NV-01',
            staffName: l.staff?.fullName || l.staff?.username || 'Nhân viên',
            startDate: l.leaveDate,
            duration: 1, // BE doesn't support multi-day yet
            status: l.status.toLowerCase(),
            createdAt: l.createdAt ? new Date(l.createdAt).toLocaleString('vi-VN') : ''
          }));
          setLeaveRequests(mappedLeaves);
        }
      } catch (err) {
        console.error('Fetch pending leaves failed:', err);
      }
    };
    fetchLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApproveLeave = async (req) => {
    try {
      if (typeof req.id === 'number') {
        await api.patch(`/api/leave-requests/${req.id}/approve`);
      }
      
      const startDateObj = new Date(req.startDate);
      const newLeaves = [];
      for (let i = 0; i < req.duration; i++) {
        const d = new Date(startDateObj);
        d.setDate(startDateObj.getDate() + i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        newLeaves.push({ staffId: req.staffId, date: dateStr });
      }

      const updatedApproved = [...approvedLeaves, ...newLeaves];
      setApprovedLeaves(updatedApproved);
      
      setLeaveRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'approved', processedAt: new Date().toLocaleTimeString('vi-VN') } : r));
      createStaffSchedule({ notify: false }, updatedApproved);
    } catch (err) {
      console.error('Approve failed:', err);
      toast.error('Phê duyệt thất bại!');
    }
  };

  const handleRejectLeave = async (id) => {
    try {
      if (typeof id === 'number') {
        await api.patch(`/api/leave-requests/${id}/reject`);
      }
      setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected', processedAt: new Date().toLocaleTimeString('vi-VN') } : r));
    } catch (err) {
      console.error('Reject failed:', err);
      toast.error('Từ chối thất bại!');
    }
  };

  const submitNewLeaveRequest = (e) => {
    e.preventDefault();
    const staff = staffProfiles.find((s) => s.id === reqForm.staffId);
    const newReq = {
      id: `lr-${Date.now()}`,
      staffId: reqForm.staffId,
      staffName: staff.name,
      startDate: reqForm.startDate,
      duration: Number(reqForm.duration),
      status: 'pending',
      createdAt: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute:'2-digit', day:'2-digit', month:'2-digit' })
    };
    setLeaveRequests([newReq, ...leaveRequests]);
    setIsNewRequestModalOpen(false);
  };

  // ============ RENDER ============

  return (
    <div className="p-6 lg:p-8 space-y-8 w-full max-w-[1400px] mx-auto font-body text-white selection:bg-cyan-500/30">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-cyan-400" size={28} />
            <h1 className="font-hero text-3xl font-medium tracking-tight">Điều phối Nhân sự</h1>
          </div>
          <p className="text-white/40 text-sm font-mono tracking-wide">SYSTEM.STAFF // Quản lý ca trực & Ngày nghỉ thực tế</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 border border-white/10 rounded-xl text-sm font-medium font-mono tracking-widest bg-black/50 text-white/60">
            {WEEK_DAYS[0].dateStr} - {WEEK_DAYS[6].dateStr}
          </div>
          <button 
            onClick={() => setIsNewRequestModalOpen(true)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors font-mono uppercase tracking-widest flex items-center gap-2"
          >
            <Plus size={16}/> Đơn nghỉ
          </button>
          <button 
            onClick={() => createStaffSchedule({ notify: true })}
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-2 bg-cyan-500/10 text-cyan-400 font-medium text-sm rounded-xl border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.15)] font-mono uppercase tracking-widest"
          >
            <RefreshCw size={16} className="group-active:rotate-180 transition-transform duration-500" />
            <span>Phân Lịch</span>
          </button>
        </div>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
          <p className="text-xs text-white/40 font-mono tracking-widest uppercase mb-2">Ca đủ người</p>
          <p className="text-3xl font-hero text-emerald-400">{summary.fullShifts}</p>
          <p className="text-[10px] text-white/30 font-mono mt-2 border-t border-white/5 pt-2">Trong {summary.totalShifts} ca tuần này</p>
        </div>
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
          <p className="text-xs text-white/40 font-mono tracking-widest uppercase mb-2">Ca thiếu nhân sự</p>
          <p className={`text-3xl font-hero ${summary.missingShifts > 0 ? 'text-red-400' : 'text-white'}`}>{summary.missingShifts}</p>
          <p className="text-[10px] text-white/30 font-mono mt-2 border-t border-white/5 pt-2">
            {summary.missingShifts === 0 ? 'Đủ người toàn tuần' : 'Cần điều chỉnh hoặc thuê part-time'}
          </p>
        </div>
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
          <p className="text-xs text-white/40 font-mono tracking-widest uppercase mb-2">Đơn chờ duyệt</p>
          <p className={`text-3xl font-hero ${pendingRequests.length > 0 ? 'text-amber-400' : 'text-white'}`}>{pendingRequests.length}</p>
          <p className="text-[10px] text-white/30 font-mono mt-2 border-t border-white/5 pt-2">{requestHistory.length} đã được xử lý</p>
        </div>
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
          <p className="text-xs text-white/40 font-mono tracking-widest uppercase mb-2">Tổng ca phân công</p>
          <p className="text-3xl font-hero text-cyan-400">{summary.totalShifts * 2}</p>
          <p className="text-[10px] text-white/30 font-mono mt-2 border-t border-white/5 pt-2">TB {(summary.totalShifts * 2 / 4).toFixed(1)} ca / NV</p>
        </div>
      </div>

      {/* STAFF OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {staffProfiles.map(staff => (
          <div key={staff.id} className="bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-colors relative overflow-hidden group">
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${staff.avatarBg} opacity-50`} />
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${staff.avatarBg}/20 border border-white/10 flex items-center justify-center`}>
                <UserCheck size={20} className={staff.color} />
              </div>
              <div>
                <h4 className="font-medium text-white tracking-wide">{staff.name}</h4>
                <p className="text-[10px] font-mono text-white/40">{staff.id}</p>
              </div>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-white/5">
              <div>
                <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-1">Giờ làm</p>
                <p className="text-xl font-mono text-white">{staff.weeklyHours}h</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-1">Số ca</p>
                <p className="text-xl font-mono text-white">{staff.shiftsAssigned}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-1">Ngày nghỉ</p>
                <p className={`text-xl font-mono ${staff.leaveDays > 0 ? 'text-amber-400' : 'text-white'}`}>{staff.leaveDays}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* SCHEDULE MATRIX (Takes 2/3 width) */}
        <div className="xl:col-span-2 bg-neutral-950 border border-white/5 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <h3 className="font-hero text-lg font-medium tracking-tight">Ma trận Lịch trực Tuần</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40"><span className="w-2 h-2 rounded bg-amber-500/50"></span> Nghỉ phép</div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40"><span className="w-2 h-2 rounded bg-red-500/50"></span> Thiếu người</div>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5 bg-black/20">
                  <th className="px-5 py-4 w-[20%] text-[10px] font-mono tracking-widest text-white/30 uppercase">Ngày</th>
                  {SHIFT_DEFINITIONS.map(shift => (
                    <th key={shift.key} className="px-5 py-4 w-[40%] text-[10px] font-mono tracking-widest text-white/30 uppercase border-l border-white/5">
                      {shift.alias} — {shift.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {scheduleData.map((dayData) => (
                  <tr key={dayData.day.id} className={`border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors ${dayData.day.isWeekend ? 'bg-white/[0.02]' : ''}`}>
                    <td className="px-5 py-4 align-top">
                      <div className="font-medium text-white">{dayData.day.name}</div>
                      <div className="text-[10px] font-mono text-white/40">{dayData.day.dateStr}</div>
                      {dayData.day.isWeekend && <div className="text-[9px] text-amber-400 font-mono mt-1 border border-amber-500/30 bg-amber-500/10 px-1 py-0.5 inline-block rounded">CA CAO ĐIỂM</div>}
                    </td>
                    
                    {/* MORNING SHIFT */}
                    <td className="px-5 py-4 align-top border-l border-white/5">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-2">
                          {dayData.shifts.morning.map(staff => (
                            <div key={staff.staffId} className="flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/10 rounded">
                              <div className={`w-1.5 h-1.5 rounded-full ${staff.avatarBg}`} />
                              <span className="text-white/80 font-mono text-xs">{staff.name.split(' ').pop()}</span>
                            </div>
                          ))}
                          {dayData.shifts.morning.length < 2 && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-400 font-mono text-xs">
                              <AlertTriangle size={12} /> Thiếu {2 - dayData.shifts.morning.length}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* AFTERNOON SHIFT */}
                    <td className="px-5 py-4 align-top border-l border-white/5">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-2">
                          {dayData.shifts.afternoon.map(staff => (
                            <div key={staff.staffId} className="flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/10 rounded">
                              <div className={`w-1.5 h-1.5 rounded-full ${staff.avatarBg}`} />
                              <span className="text-white/80 font-mono text-xs">{staff.name.split(' ').pop()}</span>
                            </div>
                          ))}
                          {dayData.shifts.afternoon.length < 2 && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-400 font-mono text-xs">
                              <AlertTriangle size={12} /> Thiếu {2 - dayData.shifts.afternoon.length}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* ABSENT STAFF ROW INJECTION */}
                    {dayData.onLeave.length > 0 && (
                      <div className="absolute ml-5 mt-16 flex gap-2">
                        {/* Just visual positioning hack or better place it below the day name */}
                      </div>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LEAVE MANAGEMENT (Takes 1/3 width) */}
        <div className="space-y-6 flex flex-col">
          
          {/* PENDING REQUESTS */}
          <div className="bg-neutral-950 border border-white/5 rounded-2xl flex flex-col flex-1">
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-hero text-lg font-medium tracking-tight">Đơn nghỉ phép</h3>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-mono rounded border border-amber-500/30">
                {pendingRequests.length} CHỜ DUYỆT
              </span>
            </div>
            <div className="p-5 space-y-4 flex-1 overflow-y-auto">
              {pendingRequests.length === 0 ? (
                <div className="text-center text-white/30 font-mono text-sm py-8">Không có đơn chờ duyệt.</div>
              ) : (
                pendingRequests.map(req => {
                  const reqDateObj = new Date(req.startDate);
                  const dateStr = `${String(reqDateObj.getDate()).padStart(2,'0')}/${String(reqDateObj.getMonth()+1).padStart(2,'0')}`;
                  return (
                    <div key={req.id} className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium">{req.staffName}</h4>
                        <span className="text-[10px] font-mono text-amber-400">CHỜ DUYỆT</span>
                      </div>
                      <p className="text-xs text-white/60 font-mono mb-3">
                        Nghỉ {req.duration} ngày từ {dateStr}
                        <br/>
                        <span className="text-[10px] text-white/30 mt-1 block">Tạo: {req.createdAt}</span>
                      </p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApproveLeave(req)}
                          className="flex-1 py-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-xs font-mono transition-colors flex justify-center items-center gap-1"
                        >
                          <Check size={14}/> DUYỆT
                        </button>
                        <button 
                          onClick={() => handleRejectLeave(req.id)}
                          className="flex-1 py-1.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs font-mono transition-colors flex justify-center items-center gap-1"
                        >
                          <X size={14}/> TỪ CHỐI
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* HISTORY */}
          <div className="bg-neutral-950 border border-white/5 rounded-2xl flex flex-col flex-1">
            <div className="p-5 border-b border-white/5">
              <h3 className="font-hero text-lg font-medium tracking-tight">Lịch sử Xử lý</h3>
            </div>
            <div className="p-5 space-y-3 flex-1 overflow-y-auto max-h-[300px]">
              {requestHistory.length === 0 ? (
                <div className="text-center text-white/30 font-mono text-sm py-8">Chưa có đơn nào được xử lý.</div>
              ) : (
                requestHistory.slice().reverse().map(req => (
                  <div key={req.id} className="flex flex-col gap-1 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-white/80">{req.staffName}</span>
                      {req.status === 'approved' 
                        ? <span className="text-[10px] text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded bg-emerald-500/10">ĐÃ DUYỆT</span>
                        : <span className="text-[10px] text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded bg-red-500/10">TỪ CHỐI</span>
                      }
                    </div>
                    <span className="text-[10px] font-mono text-white/40">Nghỉ {req.duration} ngày từ {new Date(req.startDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 2. Create Leave Request Modal via Component */}
      <LeaveRequestModal
        isOpen={isNewRequestModalOpen}
        onClose={() => setIsNewRequestModalOpen(false)}
        onSubmit={submitNewLeaveRequest}
        reqForm={reqForm}
        setReqForm={setReqForm}
        staffProfiles={staffProfiles}
        WEEK_DAYS={WEEK_DAYS}
      />

    </div>
  );
}
