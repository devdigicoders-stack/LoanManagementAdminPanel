import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, Edit2, Check, X, ShieldAlert, Send, CheckCircle2, 
  Clock, XCircle, AlertCircle, User, Users, Wallet, CreditCard, 
  TrendingUp, Award, DollarSign, ArrowRight, ShieldCheck, Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function Payroll() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') === 'my-salary' ? 'my-salary' : 'employees';

  const [activeTab, setActiveTab] = useState(initialTab); // 'employees', 'my-salary'
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState(location.state?.initialSearch || '');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || localStorage.getItem('admin') || '{}');
    } catch {
      return {};
    }
  })();

  const rawRole = (currentUser.role || '').toLowerCase();
  const cleanRole = rawRole.replace(/[^a-z0-9]/g, '');
  const isMasterAdmin = ['superadmin', 'admin', 'administrator'].includes(cleanRole);
  const isHrHead = cleanRole.includes('hrhead') || cleanRole.includes('hradmin') || cleanRole === 'hr';
  const isHrExecutive = !isMasterAdmin && !isHrHead && cleanRole.includes('executive');
  const isHrManager = !isMasterAdmin && !isHrHead && !isHrExecutive && cleanRole.includes('manager');

  const fetchPayrollData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payroll`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      } else {
        toast.error('Failed to load payroll data');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error');
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, []);

  // Self Employee record
  const selfEmployee = employees.find(emp => 
    emp.isSelf || 
    emp.id === currentUser._id || 
    emp.id === currentUser.id || 
    (emp.email && emp.email === currentUser.email) ||
    (emp.name === currentUser.name && isHrExecutive)
  ) || {
    name: currentUser.name || 'My Account',
    role: currentUser.role || 'HR Executive',
    department: currentUser.department || 'Human Resources',
    payroll: {
      grossMonthly: 25000,
      grossYearly: 300000,
      transport: 2000,
      perfBonus: 3000,
      achievement: 1500,
      incentives: 2500,
      approvalStatus: 'Approved'
    }
  };

  // Other staff / Hired employees (exclude own self row in staff table)
  const hiredStaffList = employees.filter(emp => {
    const isSelfRow = emp.isSelf || 
                      emp.id === currentUser._id || 
                      emp.id === currentUser.id || 
                      (emp.email && emp.email === currentUser.email);
    return !isSelfRow;
  });

  const filteredStaff = hiredStaffList.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (emp) => {
    setEditingId(emp.id);
    setEditFormData({ ...emp.payroll });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSaveClick = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payroll/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });
      
      if (res.ok) {
        if (isHrExecutive) {
          toast.success("Salary submitted for HR Manager / Head approval");
        } else {
          toast.success("Payroll updated successfully");
        }
        fetchPayrollData();
        setEditingId(null);
      } else {
        toast.error("Failed to update payroll");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating payroll");
    }
  };

  const handleApprovePayroll = async (id, empName) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payroll/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success(`Salary approved for ${empName}`);
        fetchPayrollData();
      } else {
        toast.error("Failed to approve salary");
      }
    } catch (e) {
      toast.error("Server error while approving");
    }
  };

  const handleRejectPayroll = (id, empName) => {
    Swal.fire({
      title: `Reject Salary for ${empName}?`,
      input: 'text',
      inputPlaceholder: 'Enter rejection reason / remarks...',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Reject Salary',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payroll/${id}/reject`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ reason: result.value || 'Rejected by Manager' })
          });
          if (res.ok) {
            toast.success(`Salary rejected for ${empName}`);
            fetchPayrollData();
          } else {
            toast.error("Failed to reject salary");
          }
        } catch (e) {
          toast.error("Server error while rejecting");
        }
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  const formatCurrency = (val) => {
    return `₹${Number(val || 0).toLocaleString('en-IN')}`;
  };

  const getRoleBadgeStyle = (role) => {
    switch(role) {
      case 'SECURED EXEC': return 'bg-blue-50 text-blue-600';
      case 'HR': return 'bg-purple-100 text-purple-600';
      case 'UNSECURED LOAN MANAGER': return 'bg-teal-50 text-teal-600';
      case 'AGENT MANAGER': return 'bg-orange-50 text-orange-600';
      case 'AGENT EXEC': return 'bg-pink-50 text-pink-600';
      case 'SECURED LOAN MANAGER': return 'bg-amber-50 text-amber-600';
      case 'REPORTING MANAGER': return 'bg-red-50 text-red-600';
      case 'TELECALLER': return 'bg-fuchsia-50 text-fuchsia-600';
      case 'SENIOR TELECALLER': return 'bg-indigo-50 text-indigo-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusBadge = (status, submittedByName, rejectionReason) => {
    if (status === 'Pending Approval') {
      return (
        <span 
          title={submittedByName ? `Submitted by ${submittedByName} for approval` : 'Pending Manager Approval'}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200"
        >
          <Clock size={12} /> Pending Mgr Approval
        </span>
      );
    }
    if (status === 'Rejected') {
      return (
        <span 
          title={rejectionReason ? `Reason: ${rejectionReason}` : 'Rejected'}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200"
        >
          <XCircle size={12} /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 size={12} /> Approved
      </span>
    );
  };

  const myMonthly = selfEmployee.payroll?.grossMonthly || 0;
  const myTransport = selfEmployee.payroll?.transport || 0;
  const myBonus = selfEmployee.payroll?.perfBonus || 0;
  const myAchievement = selfEmployee.payroll?.achievement || 0;
  const myIncentives = selfEmployee.payroll?.incentives || 0;
  const myTotalMonthly = myMonthly + myTransport + myBonus + myAchievement + myIncentives;
  const myYearlyCTC = (selfEmployee.payroll?.grossYearly || (myTotalMonthly * 12));

  return (
    <div className="w-full bg-[#f4f7fb] min-h-screen pb-12">
      
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isHrExecutive ? "Salary & Payroll Management" : "Payroll Management"}
            </h1>
            <p className="text-[14px] text-gray-500 font-medium">
              {isHrExecutive 
                ? "Track your personal salary breakdown and manage/decide salary for candidates hired by you (requires Manager Approval)."
                : "Manage employee compensation, track personal salary, and review pending approval requests."}
            </p>
          </div>

          {isHrExecutive && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold shadow-sm">
              <ShieldAlert size={16} className="text-amber-600 shrink-0" />
              <span>Hired employee salary updates require <strong>HR Manager / Head Approval</strong>.</span>
            </div>
          )}
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-3 mt-6 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('employees')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'employees'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users size={16} />
            {isHrExecutive ? "Hired Staff Salary (Decide / Manage)" : "Employee Salaries"}
            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${activeTab === 'employees' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {hiredStaffList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('my-salary')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'my-salary'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Wallet size={16} />
            My Salary Breakdown (Track Only)
          </button>
        </div>
      </div>

      {/* ──────────────── TAB 1: HIRED STAFF / EMPLOYEE SALARY ──────────────── */}
      {activeTab === 'employees' && (
        <div className="animate-in fade-in duration-200">
          {/* Search Bar */}
          <div className="px-6 mb-6">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search hired staff by name, ID, role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-[14px] text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 transition-shadow shadow-sm placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="px-6">
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hired Employee</th>
                      <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Approval Status</th>
                      <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Gross Monthly</th>
                      <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Gross Yearly</th>
                      <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Transport</th>
                      <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Perf. Bonus</th>
                      <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Achievement</th>
                      <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Incentives</th>
                      <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredStaff.map((emp) => {
                      const isEditing = editingId === emp.id;
                      const isPending = emp.payroll?.approvalStatus === 'Pending Approval';
                      const canApprove = (isHrManager || isHrHead || isMasterAdmin) && isPending;
                      
                      return (
                        <tr key={emp.id} className={`hover:bg-gray-50/50 transition-colors ${isEditing ? 'bg-blue-50/30' : ''}`}>
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-[13px] font-bold text-gray-800">{emp.name}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5">{emp.id}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${getRoleBadgeStyle(emp.role)}`}>
                              {emp.role}
                            </span>
                          </td>

                          {/* Approval Status */}
                          <td className="py-3 px-4">
                            {getStatusBadge(emp.payroll?.approvalStatus, emp.payroll?.submittedByName, emp.payroll?.rejectionReason)}
                          </td>
                          
                          {/* Editing Fields vs View Mode */}
                          <td className="py-3 px-4">
                            {isEditing ? (
                              <input type="number" name="grossMonthly" value={editFormData.grossMonthly} onChange={handleChange} className="w-24 border border-gray-300 rounded px-2 py-1 text-[13px] focus:outline-none focus:border-blue-500 font-medium" />
                            ) : (
                              <p className="text-[13px] font-bold text-gray-600">{formatCurrency(emp.payroll?.grossMonthly)}</p>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {isEditing ? (
                              <input type="number" name="grossYearly" value={editFormData.grossYearly} onChange={handleChange} className="w-24 border border-gray-300 rounded px-2 py-1 text-[13px] focus:outline-none focus:border-blue-500 font-medium" />
                            ) : (
                              <p className="text-[13px] font-bold text-gray-600">{formatCurrency(emp.payroll?.grossYearly)}</p>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {isEditing ? (
                              <input type="number" name="transport" value={editFormData.transport} onChange={handleChange} className="w-20 border border-gray-300 rounded px-2 py-1 text-[13px] focus:outline-none focus:border-blue-500 font-medium" />
                            ) : (
                              <p className="text-[13px] font-bold text-gray-600">{formatCurrency(emp.payroll?.transport)}</p>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {isEditing ? (
                              <input type="number" name="perfBonus" value={editFormData.perfBonus} onChange={handleChange} className="w-20 border border-gray-300 rounded px-2 py-1 text-[13px] focus:outline-none focus:border-blue-500 font-medium" />
                            ) : (
                              <p className="text-[13px] font-bold text-gray-600">{formatCurrency(emp.payroll?.perfBonus)}</p>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {isEditing ? (
                              <input type="number" name="achievement" value={editFormData.achievement} onChange={handleChange} className="w-20 border border-gray-300 rounded px-2 py-1 text-[13px] focus:outline-none focus:border-blue-500 font-medium" />
                            ) : (
                              <p className="text-[13px] font-bold text-gray-600">{formatCurrency(emp.payroll?.achievement)}</p>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {isEditing ? (
                              <input type="number" name="incentives" value={editFormData.incentives} onChange={handleChange} className="w-20 border border-gray-300 rounded px-2 py-1 text-[13px] focus:outline-none focus:border-blue-500 font-medium" />
                            ) : (
                              <p className="text-[13px] font-bold text-gray-600">{formatCurrency(emp.payroll?.incentives)}</p>
                            )}
                          </td>
                          
                          {/* Action buttons */}
                          <td className="py-3 px-4 text-center">
                            {isEditing ? (
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => handleSaveClick(emp.id)} 
                                  className="flex items-center gap-1.5 bg-[#16a34a] hover:bg-green-700 text-white px-3 py-1.5 rounded text-[12px] font-bold transition-colors shadow-sm"
                                >
                                  {isHrExecutive ? (
                                    <><Send size={13} /> Submit for Approval</>
                                  ) : (
                                    <><Check size={14} strokeWidth={3} /> Save</>
                                  )}
                                </button>
                                <button onClick={handleCancelClick} className="flex items-center gap-1 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded text-[12px] font-bold transition-colors">
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1.5">
                                {canApprove && (
                                  <>
                                    <button 
                                      onClick={() => handleApprovePayroll(emp.id, emp.name)}
                                      className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-colors shadow-sm"
                                      title="Approve Salary Structure"
                                    >
                                      <Check size={12} strokeWidth={3} /> Approve
                                    </button>
                                    <button 
                                      onClick={() => handleRejectPayroll(emp.id, emp.name)}
                                      className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2 py-1.5 rounded-md text-[11px] font-bold transition-colors"
                                      title="Reject Salary"
                                    >
                                      <X size={12} strokeWidth={2.5} />
                                    </button>
                                  </>
                                )}
                                <button 
                                  onClick={() => handleEditClick(emp)} 
                                  className="inline-flex items-center justify-center gap-1.5 border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md text-[12px] font-bold transition-colors"
                                >
                                  <Edit2 size={12} strokeWidth={2.5} /> {isHrExecutive ? "Decide Salary" : "Edit"}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {filteredStaff.length === 0 && (
                      <tr>
                        <td colSpan="10" className="py-12 text-center text-gray-500 text-sm font-medium">
                          No hired employee payroll records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 2: MY SALARY BREAKDOWN (TRACK ONLY) ──────────────── */}
      {activeTab === 'my-salary' && (
        <div className="px-6 animate-in fade-in duration-200 space-y-6">
          
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Monthly</span>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{formatCurrency(myMonthly)}</h3>
              </div>
              <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-500" /> Base Monthly Fixed
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Allowances & Incentives</span>
                <h3 className="text-2xl font-black text-blue-600 mt-1">{formatCurrency(myTransport + myBonus + myAchievement + myIncentives)}</h3>
              </div>
              <p className="text-xs text-slate-500 mt-3">Transport + Bonus + Incentives</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Monthly CTC</span>
                <h3 className="text-2xl font-black text-emerald-600 mt-1">{formatCurrency(myTotalMonthly)}</h3>
              </div>
              <p className="text-xs text-slate-500 mt-3">Monthly Total Earnings</p>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-md flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Annual CTC</span>
                <h3 className="text-2xl font-black text-white mt-1">{formatCurrency(myYearlyCTC)}</h3>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-white/10 px-2.5 py-1 rounded-lg w-fit mt-3">
                <ShieldCheck size={13} /> Active & Verified
              </span>
            </div>
          </div>

          {/* Salary Breakdown Details */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 mb-6 gap-2">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">My Detailed Compensation Breakdown</h3>
                <p className="text-xs text-slate-500 font-medium">Track all fixed components and performance allowances allocated to you</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Logged in as: {currentUser.name || 'HR Executive'} ({currentUser.role || 'HR Executive'})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Earnings Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Monthly Earnings & Allowances</h4>
                <div className="space-y-2 border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 text-sm">
                    <span className="text-slate-600 font-medium">Gross Monthly Base</span>
                    <span className="font-bold text-slate-800">{formatCurrency(myMonthly)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 text-sm">
                    <span className="text-slate-600 font-medium">Transport Allowance</span>
                    <span className="font-bold text-slate-800">{formatCurrency(myTransport)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 text-sm">
                    <span className="text-slate-600 font-medium">Performance Bonus</span>
                    <span className="font-bold text-slate-800">{formatCurrency(myBonus)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 text-sm">
                    <span className="text-slate-600 font-medium">Target Achievement Bonus</span>
                    <span className="font-bold text-slate-800">{formatCurrency(myAchievement)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 text-sm">
                    <span className="text-slate-600 font-medium">Monthly Incentives</span>
                    <span className="font-bold text-slate-800">{formatCurrency(myIncentives)}</span>
                  </div>
                </div>
              </div>

              {/* Annual Summary & Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Policy & Disbursement Terms</h4>
                <div className="border border-slate-100 rounded-xl p-5 bg-blue-50/40 space-y-3">
                  <div className="flex items-start gap-3">
                    <Sparkles size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Monthly Payout Schedule</h5>
                      <p className="text-xs text-slate-600 mt-0.5">Salary is processed on the last working day of every month directly to your registered bank account.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-2 border-t border-blue-100">
                    <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">HR Manager / Head Governance</h5>
                      <p className="text-xs text-slate-600 mt-0.5">Your salary structure is governed and approved directly by your HR Manager / Head. For revision requests, reach out to your reporting manager.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
