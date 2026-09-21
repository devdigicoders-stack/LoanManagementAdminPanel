import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Phone, Mail, MapPin, Briefcase, 
  FileText, Calendar, CheckCircle2, ShieldAlert,
  Activity, Award, Clock, X, Edit
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          // Map DB structure to UI needs
          setEmployee({
            id: data._id,
            empId: data.empId,
            name: data.name,
            department: data.division || 'General',
            designation: data.designation,
            status: data.status,
            joinDate: new Date(data.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            email: data.email,
            phone: data.mobile || 'Not provided',
            manager: data.reportsToManagerName || data.reportsToHeadName || data.reportingManager || 'Management',
            location: data.city || data.state || 'Not specified',
            raw: data // Keep raw data for extensive tabs
          });
        } else {
          toast.error('Failed to load employee details');
          navigate('/employees');
        }
      } catch (error) {
        toast.error('Server error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployee();
  }, [id, navigate]);

  const handleDocumentAction = async (docId, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${id}/documents/${docId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Document marked as ${status}`);
        const data = await res.json();
        setEmployee(prev => ({
          ...prev,
          raw: { ...prev.raw, documents: prev.raw.documents.map(d => d._id === docId ? data.document : d) }
        }));
      } else {
        toast.error('Failed to update status');
      }
    } catch (e) {
      toast.error('Server error');
    }
  };

  const handleAddAttendance = () => {
    Swal.fire({
      title: 'Add Attendance Record',
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-[12px] font-bold text-[var(--color-brand-text)] mb-1">Date</label>
            <input type="date" id="att-date" class="w-full border p-2 rounded-lg text-sm" max="${new Date().toISOString().split('T')[0]}" required>
          </div>
          <div>
            <label class="block text-[12px] font-bold text-[var(--color-brand-text)] mb-1">Status</label>
            <select id="att-status" class="w-full border p-2 rounded-lg text-sm">
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Half Day">Half Day</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[12px] font-bold text-[var(--color-brand-text)] mb-1">Check In</label>
              <input type="time" id="att-in" class="w-full border p-2 rounded-lg text-sm">
            </div>
            <div>
              <label class="block text-[12px] font-bold text-[var(--color-brand-text)] mb-1">Check Out</label>
              <input type="time" id="att-out" class="w-full border p-2 rounded-lg text-sm">
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save Record',
      preConfirm: () => {
        return {
          date: document.getElementById('att-date').value,
          status: document.getElementById('att-status').value,
          checkIn: document.getElementById('att-in').value || '-',
          checkOut: document.getElementById('att-out').value || '-',
          hours: 'N/A' // Could calculate based on time
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${id}/attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(result.value)
          });
          if (res.ok) {
            const data = await res.json();
            setEmployee(prev => ({ ...prev, raw: { ...prev.raw, attendance: data.attendance } }));
            toast.success('Attendance recorded');
          }
        } catch (e) {
          toast.error('Server error');
        }
      }
    });
  };

  const handleUpdateLeaveStatus = async (leaveId, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${id}/leaves/${leaveId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const data = await res.json();
        setEmployee(prev => ({ ...prev, raw: { ...prev.raw, leaves: data.leaves } }));
        toast.success(`Leave ${status}`);
      }
    } catch (e) {
      toast.error('Server error');
    }
  };

  const handleSendReminderToHR = async () => {
    if (!employee || !employee.raw) return;

    const pendingDocs = employee.raw.documents?.filter(d => d.status === 'Pending' || d.status === 'Re-upload Required') || [];
    
    if (pendingDocs.length === 0) {
      toast.success('No documents need action.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${id}/remind-hr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ pendingDocs })
      });
      if (res.ok) {
        toast.success('Reminder sent to HR successfully!');
      } else {
        toast.error('Failed to send reminder');
      }
    } catch (e) {
      toast.error('Server error');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'activity', label: 'Activity & Candidates', icon: Briefcase },
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'professional', label: 'Professional', icon: Award },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'leave', label: 'Leave', icon: Calendar },
  ];



  return (
    <div className="w-full space-y-6 pb-10 bg-[var(--color-brand-page-bg)] min-h-screen">
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/employees')}
          className="w-10 h-10 flex items-center justify-center rounded-[12px] border border-[var(--color-brand-border)] bg-white text-[var(--color-brand-text-secondary)] hover:bg-[var(--color-brand-sky-light)] hover:text-[var(--color-brand-blue-dark)] transition-colors shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)] mb-1">Employee Details</h1>
          <p className="text-[13px] text-[var(--color-brand-text-secondary)] font-medium">Viewing complete profile for {employee ? employee.empId : '...'}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-slate-500">Loading details...</div>
      ) : employee ? (
        <>
      {/* Profile Card */}
      <div className="bg-white rounded-[18px] border border-[var(--color-brand-border)] overflow-hidden shadow-sm">
        <div className="h-24 bg-[var(--color-brand-sky-pale)]"></div>
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-10 mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-[var(--color-brand-sky-light)] flex items-center justify-center text-[var(--color-brand-blue-dark)] font-bold text-3xl shadow-sm shrink-0">
              {employee.name.charAt(0)}
            </div>
            <div className="flex-1 pb-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-brand-text)] flex items-center gap-2">
                    {employee.name}
                    <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase">
                      {employee.status}
                    </span>
                  </h2>
                  <p className="text-[14px] text-[var(--color-brand-text-secondary)] font-medium mt-1">
                    {employee.designation} • {employee.department}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/employees/${id}/edit`)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#489b0d] hover:bg-[#3e850b] text-white rounded-lg text-[13px] font-bold transition-colors shadow-xs"
                  >
                    <Edit size={15} /> Edit Employee
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--color-brand-border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-gray-light)] flex items-center justify-center text-[var(--color-brand-text-secondary)] shrink-0"><Phone size={16}/></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-brand-text-secondary)] uppercase tracking-wider">Mobile</p>
                <p className="text-[13px] font-bold text-[var(--color-brand-text)]">{employee.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-gray-light)] flex items-center justify-center text-[var(--color-brand-text-secondary)] shrink-0"><Mail size={16}/></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-brand-text-secondary)] uppercase tracking-wider">Email</p>
                <p className="text-[13px] font-bold text-[var(--color-brand-text)]">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-gray-light)] flex items-center justify-center text-[var(--color-brand-text-secondary)] shrink-0"><MapPin size={16}/></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-brand-text-secondary)] uppercase tracking-wider">Location</p>
                <p className="text-[13px] font-bold text-[var(--color-brand-text)]">{employee.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-gray-light)] flex items-center justify-center text-[var(--color-brand-text-secondary)] shrink-0"><Calendar size={16}/></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-brand-text-secondary)] uppercase tracking-wider">Joined On</p>
                <p className="text-[13px] font-bold text-[var(--color-brand-text)]">{employee.joinDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-56 shrink-0 space-y-1.5 bg-white p-3 rounded-[18px] border border-[var(--color-brand-border)] shadow-sm h-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[12px] text-[13px] font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-[var(--color-brand-sky-light)] text-[var(--color-brand-blue-dark)] shadow-sm border border-[var(--color-brand-border)]' 
                  : 'text-[var(--color-brand-text-secondary)] hover:bg-[var(--color-brand-gray-light)] hover:text-[var(--color-brand-text)]'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-[var(--color-brand-blue-dark)]' : ''} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-white rounded-[18px] border border-[var(--color-brand-border)] shadow-sm overflow-hidden min-h-[400px]">
          <div className="p-5 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-sky-pale)]">
            <h2 className="text-[16px] font-bold text-[var(--color-brand-text)] capitalize">
              {tabs.find(t => t.id === activeTab)?.label} Details
            </h2>
          </div>
          
          <div className="p-6">
            {activeTab === 'overview' && (() => {
              // Calculate Attendance
              const totalAttendance = employee.raw.attendance?.length || 0;
              const presentCount = employee.raw.attendance?.filter(a => a.status === 'Present').length || 0;
              const attendancePerc = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;
              
              // Calculate Leaves Available (Assuming 15 total allowed)
              const approvedLeavesDays = employee.raw.leaves?.filter(l => l.status === 'Approved').reduce((acc, curr) => {
                  const start = new Date(curr.startDate);
                  const end = new Date(curr.endDate);
                  const diffTime = Math.abs(end - start);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
                  return acc + (isNaN(diffDays) ? 0 : diffDays);
              }, 0) || 0;
              const leavesAvailable = Math.max(0, 15 - approvedLeavesDays);

              // Calculate Pending Documents
              const totalPendingDocs = employee.raw.documents?.filter(d => d.status === 'Pending' || d.status === 'Re-upload Required' || d.status === 'Rejected').length || 0;

              return (
              <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[var(--color-brand-page-bg)] p-5 rounded-[14px] border border-[var(--color-brand-border)]">
                    <h3 className="text-[14px] font-bold text-[var(--color-brand-text)] mb-4 flex items-center gap-2"><Briefcase size={16} className="text-[var(--color-brand-blue-dark)]"/> Professional Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Employee ID</span><span className="text-[13px] font-bold">{employee.empId}</span></div>
                      <div className="flex justify-between"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Department</span><span className="text-[13px] font-bold">{employee.department}</span></div>
                      <div className="flex justify-between"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Designation</span><span className="text-[13px] font-bold">{employee.designation}</span></div>
                      <div className="flex justify-between"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Reporting Manager</span><span className="text-[13px] font-bold">{employee.manager}</span></div>
                    </div>
                  </div>
                  
                  <div className="bg-[var(--color-brand-page-bg)] p-5 rounded-[14px] border border-[var(--color-brand-border)]">
                    <h3 className="text-[14px] font-bold text-[var(--color-brand-text)] mb-4 flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600"/> Quick Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Attendance (Overall)</span><span className={`text-[13px] font-bold ${attendancePerc >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>{totalAttendance > 0 ? `${attendancePerc}%` : 'N/A'}</span></div>
                      <div className="flex justify-between"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Leaves Available</span><span className="text-[13px] font-bold text-amber-600">{leavesAvailable} Days</span></div>
                      <div className="flex justify-between"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Actionable Documents</span><span className={`text-[13px] font-bold ${totalPendingDocs > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{totalPendingDocs}</span></div>
                      <div className="flex justify-between"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Last Performance</span><span className="text-[13px] font-bold">{employee.raw.performance || 'N/A'}</span></div>
                    </div>
                  </div>
                </div>
              </div>
              );
            })()}

            {activeTab === 'activity' && (() => {
              const stats = employee.raw.recruitmentStats || {
                totalAssigned: 0, applied: 0, reviewed: 0, interview: 0, shortlisted: 0, hired: 0, rejected: 0
              };
              const candidates = employee.raw.assignedCandidates || [];

              return (
                <div className="space-y-6 animate-in fade-in">
                  {/* Performance / Tracking Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                      <p className="text-[11px] font-bold text-slate-500 uppercase">Assigned</p>
                      <p className="text-xl font-extrabold text-slate-800 mt-0.5">{stats.totalAssigned}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-center">
                      <p className="text-[11px] font-bold text-blue-600 uppercase">Applied</p>
                      <p className="text-xl font-extrabold text-blue-800 mt-0.5">{stats.applied}</p>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200 text-center">
                      <p className="text-[11px] font-bold text-indigo-600 uppercase">Reviewed</p>
                      <p className="text-xl font-extrabold text-indigo-800 mt-0.5">{stats.reviewed}</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
                      <p className="text-[11px] font-bold text-amber-600 uppercase">Interview</p>
                      <p className="text-xl font-extrabold text-amber-800 mt-0.5">{stats.interview}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-center">
                      <p className="text-[11px] font-bold text-purple-600 uppercase">Shortlisted</p>
                      <p className="text-xl font-extrabold text-purple-800 mt-0.5">{stats.shortlisted}</p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
                      <p className="text-[11px] font-bold text-emerald-600 uppercase">Hired</p>
                      <p className="text-xl font-extrabold text-emerald-800 mt-0.5">{stats.hired}</p>
                    </div>
                    <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-center">
                      <p className="text-[11px] font-bold text-rose-600 uppercase">Rejected</p>
                      <p className="text-xl font-extrabold text-rose-800 mt-0.5">{stats.rejected}</p>
                    </div>
                  </div>

                  {/* Candidate Pipeline Table */}
                  <div className="bg-white rounded-xl border border-[var(--color-brand-border)] overflow-hidden shadow-xs">
                    <div className="p-4 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-sky-pale)] flex justify-between items-center">
                      <div>
                        <h3 className="text-[14px] font-bold text-[var(--color-brand-text)]">Handled Candidates & Job Applications</h3>
                        <p className="text-[11px] text-slate-500">Live recruitment activity and status tracking for this executive</p>
                      </div>
                      <span className="text-[12px] font-bold text-[#489b0d] bg-emerald-50 px-3 py-1 rounded-full">
                        {candidates.length} Total Applicants
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[var(--color-brand-border)] bg-slate-50/50">
                            <th className="py-3 px-4 text-[11px] font-bold text-slate-600 uppercase">Candidate</th>
                            <th className="py-3 px-4 text-[11px] font-bold text-slate-600 uppercase">Job Role</th>
                            <th className="py-3 px-4 text-[11px] font-bold text-slate-600 uppercase">Zone</th>
                            <th className="py-3 px-4 text-[11px] font-bold text-slate-600 uppercase">Contact</th>
                            <th className="py-3 px-4 text-[11px] font-bold text-slate-600 uppercase">Status</th>
                            <th className="py-3 px-4 text-[11px] font-bold text-slate-600 uppercase">Last Updated</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-brand-border)]">
                          {candidates.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="py-10 text-center text-slate-400 font-medium text-[13px]">
                                No candidates currently assigned or processed by this executive.
                              </td>
                            </tr>
                          ) : (
                            candidates.map((cand) => (
                              <tr key={cand._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 px-4">
                                  <p className="text-[13px] font-bold text-slate-800">{cand.name}</p>
                                  <p className="text-[11px] text-slate-400">{cand.applicationNo || 'App No: -'}</p>
                                </td>
                                <td className="py-3 px-4">
                                  <p className="text-[12px] font-bold text-slate-700">{cand.jobId?.title || 'Job Opening'}</p>
                                  <p className="text-[11px] text-slate-400">{cand.jobId?.department || 'Recruitment'}</p>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                                    {cand.zone || 'NORTH'}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <p className="text-[12px] font-semibold text-slate-700">{cand.phone}</p>
                                  <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{cand.email}</p>
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    cand.status === 'Hired' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                    cand.status === 'Shortlisted' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                    cand.status === 'Interview' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                    cand.status === 'Reviewed' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                                    cand.status === 'Rejected' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                                    'bg-blue-100 text-blue-800 border border-blue-200'
                                  }`}>
                                    {cand.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-[12px] text-slate-500 font-medium">
                                  {new Date(cand.updatedAt || cand.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'short', year: 'numeric'
                                  })}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeTab === 'documents' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[14px] font-bold text-[var(--color-brand-text)]">Uploaded Documents</h3>
                  <button 
                    onClick={handleSendReminderToHR}
                    className="flex items-center gap-2 text-[12px] font-bold text-white bg-[var(--color-brand-blue-primary)] px-4 py-2 rounded-lg hover:bg-[var(--color-brand-blue-dark)] transition-colors"
                  >
                    <ShieldAlert size={14} />
                    Send Reminder to HR
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {employee.raw.documents && employee.raw.documents.length > 0 ? (
                    employee.raw.documents.map((uploadedDoc) => (
                      <div key={uploadedDoc._id} className="bg-[var(--color-brand-page-bg)] p-4 rounded-[14px] border border-[var(--color-brand-border)] flex items-start gap-4">
                        <div className="w-10 h-10 rounded-[10px] bg-white border border-[var(--color-brand-border)] flex items-center justify-center shrink-0 text-[var(--color-brand-blue-dark)]">
                          <FileText size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-[13px] font-bold text-[var(--color-brand-text)]" title={uploadedDoc.name}>{uploadedDoc.name.length > 25 ? uploadedDoc.name.substring(0, 25) + '...' : uploadedDoc.name}</h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              uploadedDoc.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' :
                              (uploadedDoc.status === 'Rejected' || uploadedDoc.status === 'Re-upload Required') ? 'bg-red-50 text-red-600' :
                              'bg-amber-50 text-amber-600'
                            }`}>
                              {uploadedDoc.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--color-brand-text-secondary)] font-medium mb-3 capitalize">{uploadedDoc.key} • Uploaded {new Date(uploadedDoc.uploadedAt).toLocaleDateString()}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-auto">
                            <button onClick={() => setSelectedDoc(uploadedDoc)} className="text-[11px] font-bold text-[var(--color-brand-blue-dark)] hover:underline">Review Document</button>
                            
                            {uploadedDoc.status === 'Pending' && (
                              <>
                                <span className="text-slate-300">•</span>
                                <button onClick={() => handleDocumentAction(uploadedDoc._id, 'Verified')} className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Verify</button>
                                <span className="text-slate-300">•</span>
                                <button onClick={() => handleDocumentAction(uploadedDoc._id, 'Rejected')} className="text-[11px] font-bold text-red-600 hover:text-red-700 transition-colors">Reject</button>
                              </>
                            )}
                            
                            {(uploadedDoc.status === 'Rejected' || uploadedDoc.status === 'Re-upload Required') && (
                              <>
                                <span className="text-slate-300">•</span>
                                <button onClick={() => handleDocumentAction(uploadedDoc._id, 'Re-upload Required')} className="text-[11px] font-bold text-amber-600 hover:text-amber-700 transition-colors" title="Sends notification to employee">Request Re-upload</button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 py-10 text-center text-slate-500 text-[13px]">No documents uploaded yet.</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'personal' && (
              <div className="space-y-5 animate-in fade-in">
                {/* Personal Information */}
                <div className="bg-[var(--color-brand-page-bg)] p-5 rounded-[14px] border border-[var(--color-brand-border)]">
                  <h3 className="text-[14px] font-bold text-[var(--color-brand-text)] mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Father's Name</span><span className="text-[13px] font-semibold">{employee.raw.fathersName || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Mother's Name</span><span className="text-[13px] font-semibold">{employee.raw.mothersName || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Father's Mobile</span><span className="text-[13px] font-semibold">{employee.raw.fathersMobile || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Marital Status</span><span className="text-[13px] font-semibold">{employee.raw.maritalStatus || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Driving Licence</span><span className="text-[13px] font-semibold">{employee.raw.drivingLicence || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Vehicle Number</span><span className="text-[13px] font-semibold">{employee.raw.vehicleNumber || 'N/A'}</span></div>
                  </div>
                </div>

                {/* Address Details */}
                <div className="bg-[var(--color-brand-page-bg)] p-5 rounded-[14px] border border-[var(--color-brand-border)]">
                  <h3 className="text-[14px] font-bold text-[var(--color-brand-text)] mb-4">Address Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Present Address</span><span className="text-[13px] font-semibold">{employee.raw.presentAddress || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Permanent Address</span><span className="text-[13px] font-semibold">{employee.raw.permanentAddress || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Landmark</span><span className="text-[13px] font-semibold">{employee.raw.landmark || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">City / District</span><span className="text-[13px] font-semibold">{employee.raw.district || employee.raw.city || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">State</span><span className="text-[13px] font-semibold">{employee.raw.state || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Pincode</span><span className="text-[13px] font-semibold">{employee.raw.pincode || 'N/A'}</span></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'professional' && (
              <div className="space-y-5 animate-in fade-in">
                {/* Bank Details */}
                <div className="bg-[var(--color-brand-page-bg)] p-5 rounded-[14px] border border-[var(--color-brand-border)]">
                  <h3 className="text-[14px] font-bold text-[var(--color-brand-text)] mb-4">Bank Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Bank Name</span><span className="text-[13px] font-semibold">{employee.raw.bankName || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Account Holder</span><span className="text-[13px] font-semibold">{employee.raw.bankAccName || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Account Type</span><span className="text-[13px] font-semibold">{employee.raw.bankAccType || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Account Number</span><span className="text-[13px] font-semibold">{employee.raw.bankAccNum || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">IFSC Code</span><span className="text-[13px] font-semibold">{employee.raw.bankIfsc || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Branch</span><span className="text-[13px] font-semibold">{employee.raw.bankBranch || 'N/A'}</span></div>
                  </div>
                </div>

                {/* Qualification */}
                <div className="bg-[var(--color-brand-page-bg)] p-5 rounded-[14px] border border-[var(--color-brand-border)]">
                  <h3 className="text-[14px] font-bold text-[var(--color-brand-text)] mb-4">Education Qualification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Qualification Type</span><span className="text-[13px] font-semibold">{employee.raw.qual1Type || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Institution</span><span className="text-[13px] font-semibold">{employee.raw.qual1Inst || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">District</span><span className="text-[13px] font-semibold">{employee.raw.qual1Dist || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Passing Year</span><span className="text-[13px] font-semibold">{employee.raw.qual1Year || 'N/A'}</span></div>
                    <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Percentage / CGPA</span><span className="text-[13px] font-semibold">{employee.raw.qual1Perc || 'N/A'}</span></div>
                  </div>
                </div>

                {/* Previous Experience */}
                <div className="bg-[var(--color-brand-page-bg)] p-5 rounded-[14px] border border-[var(--color-brand-border)]">
                  <h3 className="text-[14px] font-bold text-[var(--color-brand-text)] mb-4">Previous Experience</h3>
                  {employee.raw.expCompany ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 mb-4">
                        <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Company</span><span className="text-[13px] font-semibold">{employee.raw.expCompany}</span></div>
                        <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Position</span><span className="text-[13px] font-semibold">{employee.raw.expPosition || 'N/A'}</span></div>
                        <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Duration</span><span className="text-[13px] font-semibold">{employee.raw.expStart ? `${employee.raw.expStart} → ${employee.raw.expEnd || 'Present'}` : 'N/A'}</span></div>
                        <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Gross Salary</span><span className="text-[13px] font-semibold">{employee.raw.expGross ? `₹${employee.raw.expGross}` : 'N/A'}</span></div>
                        <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Monthly Salary</span><span className="text-[13px] font-semibold">{employee.raw.expMonthly ? `₹${employee.raw.expMonthly}` : 'N/A'}</span></div>
                        <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Reason for Leaving</span><span className="text-[13px] font-semibold">{employee.raw.expReason || 'N/A'}</span></div>
                      </div>
                      <div className="border-t border-[var(--color-brand-border)] pt-4">
                        <p className="text-[12px] font-bold text-[var(--color-brand-text-secondary)] mb-3 uppercase tracking-wide">Reporting Manager</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-8">
                          <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Name</span><span className="text-[13px] font-semibold">{employee.raw.expRmName || 'N/A'}</span></div>
                          <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Designation</span><span className="text-[13px] font-semibold">{employee.raw.expRmDesig || 'N/A'}</span></div>
                          <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Mobile</span><span className="text-[13px] font-semibold">{employee.raw.expRmMobile || 'N/A'}</span></div>
                          <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Email</span><span className="text-[13px] font-semibold">{employee.raw.expRmEmail || 'N/A'}</span></div>
                          <div className="flex flex-col"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Branch</span><span className="text-[13px] font-semibold">{employee.raw.expRmBranch || 'N/A'}</span></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-[13px] text-[var(--color-brand-text-secondary)]">No previous experience recorded.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[14px] font-bold text-[var(--color-brand-text)]">Attendance Log</h3>
                  <button onClick={handleAddAttendance} className="text-[12px] font-bold text-white bg-[var(--color-brand-blue-primary)] px-4 py-2 rounded-lg hover:bg-[var(--color-brand-blue-dark)] transition-colors">
                    Add Record
                  </button>
                </div>
                
                <div className="overflow-x-auto border border-[var(--color-brand-border)] rounded-[14px]">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[var(--color-brand-sky-pale)] border-b border-[var(--color-brand-border)]">
                      <tr>
                        <th className="py-3 px-4 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase">Date</th>
                        <th className="py-3 px-4 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase">Check In</th>
                        <th className="py-3 px-4 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase">Check Out</th>
                        <th className="py-3 px-4 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-brand-border)]">
                      {employee.raw.attendance && employee.raw.attendance.length > 0 ? (
                        employee.raw.attendance.map((att, i) => (
                          <tr key={i} className="hover:bg-[var(--color-brand-hover-bg)]">
                            <td className="py-3 px-4 text-[13px] font-semibold">{att.date}</td>
                            <td className="py-3 px-4 text-[13px]">{att.checkIn}</td>
                            <td className="py-3 px-4 text-[13px]">{att.checkOut}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-[11px] font-bold ${
                                att.status === 'Present' ? 'bg-emerald-50 text-emerald-600' :
                                att.status === 'Absent' ? 'bg-red-50 text-red-600' :
                                'bg-orange-50 text-orange-500'
                              }`}>
                                {att.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="4" className="py-6 text-center text-[13px] text-gray-500">No attendance records found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'leave' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[14px] font-bold text-[var(--color-brand-text)]">Leave Requests</h3>
                </div>
                
                <div className="space-y-4">
                  {employee.raw.leaves && employee.raw.leaves.length > 0 ? (
                    employee.raw.leaves.map((leave, i) => (
                      <div key={leave._id || i} className="bg-[var(--color-brand-page-bg)] p-4 rounded-[14px] border border-[var(--color-brand-border)]">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[11px] font-bold bg-[var(--color-brand-gray-light)] px-2 py-0.5 rounded uppercase text-[var(--color-brand-text-secondary)] mb-1 block w-max">{leave.type}</span>
                            <h4 className="text-[13px] font-bold text-[var(--color-brand-text)]">{leave.startDate} to {leave.endDate}</h4>
                          </div>
                          <span className={`px-2 py-1 rounded text-[11px] font-bold ${
                            leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                            leave.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {leave.status}
                          </span>
                        </div>
                        <p className="text-[12px] text-[var(--color-brand-text-secondary)] mb-3">{leave.reason || 'No reason provided'}</p>
                        
                        {leave.status === 'Pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdateLeaveStatus(leave._id, 'Approved')} className="text-[11px] font-bold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-md hover:bg-emerald-100 transition-colors">Approve</button>
                            <button onClick={() => handleUpdateLeaveStatus(leave._id, 'Rejected')} className="text-[11px] font-bold bg-red-50 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-100 transition-colors">Reject</button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-[13px] text-gray-500">No leave requests found.</div>
                  )}
                </div>
              </div>
            )}

            {activeTab !== 'overview' && activeTab !== 'documents' && activeTab !== 'personal' && activeTab !== 'professional' && activeTab !== 'attendance' && activeTab !== 'leave' && (
              <div className="flex flex-col items-center justify-center py-16 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-[var(--color-brand-sky-light)] flex items-center justify-center mb-4 text-[var(--color-brand-blue-dark)]">
                  <Activity size={24} />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-brand-text)]">Information Available</h3>
                <p className="text-[13px] text-[var(--color-brand-text-secondary)] mt-1">Detailed {activeTab} information would be displayed here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document View Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[18px] max-w-lg w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-[var(--color-brand-border)] flex justify-between items-center bg-[var(--color-brand-sky-pale)]">
              <h3 className="font-bold text-[var(--color-brand-text)] flex items-center gap-2"><FileText size={18} className="text-[var(--color-brand-blue-dark)]"/> Document Metadata</h3>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-5">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center shrink-0 text-[var(--color-brand-blue-dark)]">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-tight break-all">{selectedDoc.name}</h4>
                    <p className="text-[12px] text-slate-500 mt-1 capitalize">{selectedDoc.key}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-[13px] text-slate-500 font-medium">Upload Date</span>
                    <span className="text-[13px] font-bold text-slate-700">{new Date(selectedDoc.uploadedAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-[13px] text-slate-500 font-medium">Current Status</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      selectedDoc.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' :
                      (selectedDoc.status === 'Rejected' || selectedDoc.status === 'Re-upload Required') ? 'bg-red-50 text-red-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {selectedDoc.status}
                    </span>
                  </div>
                </div>

                {/* Document Link */}
                <div className="bg-[var(--color-brand-page-bg)] rounded-xl mt-2 p-8 flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-brand-border)]">
                  {selectedDoc.fileUrl ? (
                    <a 
                      href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${selectedDoc.fileUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-[var(--color-brand-blue-primary)] hover:bg-[var(--color-brand-blue-dark)] text-white px-6 py-3 rounded-xl font-bold text-[14px] shadow-sm transition-colors flex items-center gap-2"
                    >
                       <FileText size={18} /> Open Document in New Tab
                    </a>
                  ) : (
                    <div className="text-center">
                       <FileText size={36} className="mx-auto text-[var(--color-brand-blue-light)] mb-2 opacity-50" />
                       <p className="text-[var(--color-brand-text-secondary)] font-semibold text-[13px]">No File Attached (Old Record)</p>
                    </div>
                  )}
                </div>

              </div>
              <div className="mt-8 flex justify-end gap-3">
                {selectedDoc.status === 'Pending' && (
                  <>
                    <button onClick={() => { handleDocumentAction(selectedDoc._id, 'Verified'); setSelectedDoc(null); }} className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-colors shadow-sm">Verify</button>
                    <button onClick={() => { handleDocumentAction(selectedDoc._id, 'Rejected'); setSelectedDoc(null); }} className="bg-red-50 border border-red-200 text-red-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors shadow-sm">Reject</button>
                  </>
                )}
                {(selectedDoc.status === 'Rejected' || selectedDoc.status === 'Re-upload Required') && (
                  <button onClick={() => { handleDocumentAction(selectedDoc._id, 'Re-upload Required'); setSelectedDoc(null); }} className="bg-amber-50 border border-amber-200 text-amber-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-100 transition-colors shadow-sm">Request Re-upload</button>
                )}
                <button onClick={() => setSelectedDoc(null)} className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors border border-slate-200 shadow-sm">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      </>
      ) : null}
    </div>
  );
}
