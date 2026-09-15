import { useState, useEffect, useMemo } from 'react';
import { 
  Search, UserPlus, Link2, Check, Hourglass, Edit, Eye, 
  Trash2, Phone, User, DollarSign, AlertCircle, X, 
  Send, Users, CheckCircle2, Filter, Sparkles, UserCheck, ChevronDown,
  Lock, Unlock, KeyRound
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function ManageEmployees() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchTerm, setSearchTerm] = useState(location.state?.initialSearch || '');
  const [copiedId, setCopiedId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Staff lists for assignment
  const [staffData, setStaffData] = useState({ hrs: [], telecallers: [] });

  // Filters
  const [hrFilter, setHrFilter] = useState('all'); // 'all', 'unassigned', or specific hrId
  const [onboardingFilter, setOnboardingFilter] = useState('all'); // 'all', 'Done', 'Pending'
  const [onlyMyAssigned, setOnlyMyAssigned] = useState(false);
  const [lateLockFilter, setLateLockFilter] = useState('all'); // 'all', 'locked', 'pendingQuery'

  // Modals state
  const [assignHrModal, setAssignHrModal] = useState({ isOpen: false, employee: null, selectedHrId: '' });
  const [assignTelecallerModal, setAssignTelecallerModal] = useState({ isOpen: false, employee: null, selectedTelecallerId: '', notes: '' });
  const [unblockModalState, setUnblockModalState] = useState({ isOpen: false, employee: null, hrRemark: '', isProcessing: false });
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);
  const [hrSearchText, setHrSearchText] = useState('');
  const [isHrDropdownOpen, setIsHrDropdownOpen] = useState(false);
  const [telecallerSearchText, setTelecallerSearchText] = useState('');
  const [isTelecallerDropdownOpen, setIsTelecallerDropdownOpen] = useState(false);

  // Current user info
  const currentUserRole = (localStorage.getItem('userRole') || '').toLowerCase();
  const currentUserName = localStorage.getItem(`adminName_${localStorage.getItem('userRole')}`) || localStorage.getItem('userName') || '';
  const isMasterAdmin = ['super admin', 'admin', 'superadmin'].includes(currentUserRole);
  const isHR = ['hr', 'hr admin', 'human resources'].some(r => currentUserRole.includes(r));

  // Fetch assignable staff (HRs & Telecallers)
  const fetchStaffDirectory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/assignable-staff`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStaffData({
          hrs: Array.isArray(data.hrs) ? data.hrs : [],
          telecallers: Array.isArray(data.telecallers) ? data.telecallers : []
        });
      }
    } catch (error) {
      console.error('Failed to fetch staff directory:', error);
    }
  };

  // Fetch employees from backend
  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      let url = `${import.meta.env.VITE_API_BASE_URL}/employees`;
      const params = new URLSearchParams();

      if (searchTerm) params.append('search', searchTerm);
      if (hrFilter !== 'all') params.append('assignedHRId', hrFilter);
      if (onboardingFilter !== 'all') params.append('onboardingStatus', onboardingFilter);
      if (onlyMyAssigned) params.append('myAssigned', 'true');

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        let formatted = Array.isArray(data) ? data.map(emp => ({
          id: emp._id,
          empId: emp.empId,
          name: emp.name,
          email: emp.email,
          mobile: emp.mobile || '',
          role: emp.role,
          designation: emp.designation,
          status: emp.status,
          isLateLocked: !!emp.isLateLocked,
          lateLockReason: emp.lateLockReason || '',
          hrLoginApprovedDate: emp.hrLoginApprovedDate || '',
          hrApprovedBy: emp.hrApprovedBy || '',
          unblockRequest: emp.unblockRequest || { status: 'None', queryText: '' },
          onboarding: emp.onboardingStatus || 'Pending',
          assignedHRId: emp.assignedHRId || null,
          assignedHRName: emp.assignedHRName || null,
          assignedHRAt: emp.assignedHRAt || null,
          assignedTelecallerId: emp.assignedTelecallerId || null,
          assignedTelecallerName: emp.assignedTelecallerName || null,
          telecallerChaserNotes: emp.telecallerChaserNotes || '',
          documents: emp.documents || [],
          grossMonthly: emp.grossMonthly || 0
        })) : [];

        if (currentUserRole === 'hr admin' && !onlyMyAssigned && hrFilter === 'all') {
          formatted = formatted.filter(emp => {
             const r = (emp.role || '').toLowerCase();
             return !['super admin', 'admin'].includes(r);
          });
        }

        setEmployees(formatted);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffDirectory();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEmployees();
    }, 350);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, hrFilter, onboardingFilter, onlyMyAssigned]);

  const getRoleBadgeStyle = (role) => {
    switch(role) {
      case 'SECURED EXEC': return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'HR':
      case 'HR Admin': return 'bg-purple-50 text-purple-700 border border-purple-100';
      case 'UNSECURED LOAN MANAGER': return 'bg-teal-50 text-teal-600 border border-teal-100';
      case 'AGENT MANAGER': return 'bg-orange-50 text-orange-600 border border-orange-100';
      case 'AGENT EXEC': return 'bg-pink-50 text-pink-600 border border-pink-100';
      case 'SECURED LOAN MANAGER': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'REPORTING MANAGER': return 'bg-red-50 text-red-600 border border-red-100';
      case 'TELECALLER': 
      case 'Tele callers operator':
      case 'SENIOR TELECALLER': return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
      default: return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  const handleCopyLink = (empId) => {
    const link = `${window.location.origin}/onboarding/${empId}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Onboarding link copied! Share with employee via WhatsApp/Email.", {
        style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' },
        iconTheme: { primary: '#22c55e', secondary: '#fff' },
      });
      setCopiedId(empId);
      setTimeout(() => setCopiedId(null), 3000);
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  const handleStatusToggle = (id, currentStatus) => {
    const actionText = currentStatus === 'Active' ? 'Deactivate' : 'Activate';
    
    Swal.fire({
      title: `${actionText} Employee?`,
      text: `Are you sure you want to ${actionText.toLowerCase()} this employee?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: currentStatus === 'Active' ? '#ef4444' : '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: `Yes, ${actionText}`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${id}/status`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (res.ok) {
            const updatedEmployee = await res.json();
            setEmployees(employees.map(emp => 
              emp.id === id ? { ...emp, status: updatedEmployee.status } : emp
            ));
            toast.success(`Employee ${actionText.toLowerCase()}d successfully`);
          } else {
            toast.error('Failed to change status');
          }
        } catch (error) {
          toast.error('Server error');
        }
      }
    });
  };

  const handleApproveLateLogin = (id, empName) => {
    Swal.fire({
      title: 'Approve Late Login?',
      text: `Are you sure you want to unblock ${empName} and approve their login for today?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Unblock & Approve'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${id}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ unlockLate: true })
          });

          if (res.ok) {
            const updated = await res.json();
            setEmployees(employees.map(emp =>
              emp.id === id ? {
                ...emp,
                status: 'Active',
                isLateLocked: false,
                lateLockReason: '',
                hrLoginApprovedDate: updated.hrLoginApprovedDate,
                unblockRequest: {
                  ...emp.unblockRequest,
                  status: 'Approved',
                  hrRemark: 'Unblocked by HR'
                }
              } : emp
            ));
            toast.success(`${empName}'s late login approved & ID unblocked!`);
          } else {
            toast.error('Failed to unblock employee');
          }
        } catch (error) {
          toast.error('Server error');
        }
      }
    });
  };

  const handleProcessUnblockQuery = async (employeeId, action, remark = '') => {
    try {
      setUnblockModalState(prev => ({ ...prev, isProcessing: true }));
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${employeeId}/process-unblock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action, hrRemark: remark })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Action saved successfully!');
        setEmployees(prev => prev.map(emp => {
          if (emp.id === employeeId) {
            return {
              ...emp,
              isLateLocked: action === 'Approved' ? false : emp.isLateLocked,
              lateLockReason: action === 'Approved' ? '' : emp.lateLockReason,
              status: action === 'Approved' ? 'Active' : emp.status,
              unblockRequest: {
                ...emp.unblockRequest,
                status: action === 'Approved' ? 'Approved' : 'Rejected',
                hrRemark: remark
              }
            };
          }
          return emp;
        }));
        setUnblockModalState({ isOpen: false, employee: null, hrRemark: '', isProcessing: false });
      } else {
        toast.error(data.message || 'Failed to process unblock request');
        setUnblockModalState(prev => ({ ...prev, isProcessing: false }));
      }
    } catch (err) {
      toast.error('Server error processing request');
      setUnblockModalState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const handleAdminResetPassword = (emp) => {
    Swal.fire({
      title: `Reset Password for ${emp.name}`,
      html: `
        <div style="text-align: left; font-size: 13px; color: #475569; margin-bottom: 8px;">
          <p><strong>Employee ID:</strong> ${emp.empId}</p>
          <p><strong>Email / Login ID:</strong> ${emp.email}</p>
          <p style="margin-top: 10px; color: #166534; background: #f0fdf4; padding: 6px 10px; border-radius: 6px; border: 1px solid #bbf7d0;">
            🔑 <em>No previous password required. Enter a new password below to instantly update.</em>
          </p>
        </div>
      `,
      input: 'password',
      inputLabel: 'Enter New Password',
      inputPlaceholder: 'Minimum 6 characters',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Update Password',
      preConfirm: (password) => {
        if (!password || password.trim().length < 4) {
          Swal.showValidationMessage('Password must be at least 4 characters');
          return false;
        }
        return password.trim();
      }
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${emp.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password: result.value })
          });

          if (res.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Password Updated!',
              html: `Password for <strong>${emp.name}</strong> has been successfully changed.<br/><span style="color: #64748b; font-size: 12px;">Employee can now login using their new password.</span>`,
              confirmButtonColor: '#10b981'
            });
          } else {
            toast.error('Failed to update password');
          }
        } catch (error) {
          toast.error('Server error updating password');
        }
      }
    });
  };

  const handleDeleteEmployee = (id) => {
    Swal.fire({
      title: 'Delete Employee?',
      text: "This action cannot be undone! The employee will be permanently removed.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (res.ok) {
            setEmployees(employees.filter(emp => emp.id !== id));
            toast.success('Employee deleted successfully');
          } else {
            toast.error('Failed to delete employee');
          }
        } catch (error) {
          toast.error('Server error');
        }
      }
    });
  };

  // Assign HR submission
  const handleSaveHrAssignment = async () => {
    if (!assignHrModal.employee) return;
    setIsSubmittingModal(true);
    try {
      const token = localStorage.getItem('token');
      const selectedHrObj = staffData.hrs.find(h => h._id === assignHrModal.selectedHrId);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${assignHrModal.employee.id}/assign-hr`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          hrId: assignHrModal.selectedHrId || null,
          hrName: selectedHrObj ? selectedHrObj.name : null
        })
      });

      if (res.ok) {
        toast.success(selectedHrObj ? `Assigned to HR ${selectedHrObj.name}` : 'HR assignment removed');
        setEmployees(prev => prev.map(emp => 
          emp.id === assignHrModal.employee.id ? {
            ...emp,
            assignedHRId: assignHrModal.selectedHrId || null,
            assignedHRName: selectedHrObj ? selectedHrObj.name : null
          } : emp
        ));
        setAssignHrModal({ isOpen: false, employee: null, selectedHrId: '' });
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to assign HR');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error updating HR assignment');
    } finally {
      setIsSubmittingModal(false);
    }
  };

  // Assign Telecaller Chaser submission
  const handleSaveTelecallerAssignment = async () => {
    if (!assignTelecallerModal.employee) return;
    setIsSubmittingModal(true);
    try {
      const token = localStorage.getItem('token');
      const selectedTelecallerObj = staffData.telecallers.find(t => t._id === assignTelecallerModal.selectedTelecallerId);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${assignTelecallerModal.employee.id}/assign-onboarding-chaser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          telecallerId: assignTelecallerModal.selectedTelecallerId || null,
          telecallerName: selectedTelecallerObj ? selectedTelecallerObj.name : null,
          notes: assignTelecallerModal.notes
        })
      });

      if (res.ok) {
        toast.success(selectedTelecallerObj ? `Assigned to Telecaller ${selectedTelecallerObj.name}` : 'Telecaller chaser unassigned');
        setEmployees(prev => prev.map(emp => 
          emp.id === assignTelecallerModal.employee.id ? {
            ...emp,
            assignedTelecallerId: assignTelecallerModal.selectedTelecallerId || null,
            assignedTelecallerName: selectedTelecallerObj ? selectedTelecallerObj.name : null,
            telecallerChaserNotes: assignTelecallerModal.notes
          } : emp
        ));
        setAssignTelecallerModal({ isOpen: false, employee: null, selectedTelecallerId: '', notes: '' });
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to assign telecaller');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error assigning telecaller chaser');
    } finally {
      setIsSubmittingModal(false);
    }
  };

  // Quick reminder to employee
  const handleSendReminder = async (empId, empName) => {
    toast.loading(`Sending reminder to ${empName}...`, { id: 'remind-emp' });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${empId}/remind-employee`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success(`Reminder sent to ${empName} successfully!`, { id: 'remind-emp' });
      } else {
        toast.error('Could not send reminder.', { id: 'remind-emp' });
      }
    } catch (error) {
      toast.error('Server error sending reminder', { id: 'remind-emp' });
    }
  };

  // Counts for KPI pills
  const totalCount = employees.length;
  const unassignedHrCount = useMemo(() => employees.filter(e => !e.assignedHRId).length, [employees]);
  const pendingOnboardingCount = useMemo(() => employees.filter(e => e.onboarding !== 'Done').length, [employees]);
  const pendingQueriesCount = useMemo(() => employees.filter(e => e.isLateLocked || e.unblockRequest?.status === 'Pending').length, [employees]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      if (lateLockFilter === 'locked') {
        return emp.isLateLocked;
      }
      if (lateLockFilter === 'pendingQuery') {
        return emp.unblockRequest?.status === 'Pending' || emp.isLateLocked;
      }
      return true;
    });
  }, [employees, lateLockFilter]);

  return (
    <div className="w-full bg-slate-50/50 min-h-screen pb-16">
      
      {/* Top Header Card */}
      <div className="bg-white border-b border-gray-200/80 px-6 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                <Users size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Employees & HR Delegation</h1>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Assign HRs to employees, review late login queries, delegate pending onboardings, and manage staff.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* HR quick filter toggle */}
            {isHR && isMasterAdmin && (
              <div className="inline-flex p-1 bg-gray-100 rounded-lg border border-gray-200 text-xs font-semibold">
                <button
                  onClick={() => setOnlyMyAssigned(false)}
                  className={`px-3 py-1.5 rounded-md transition-all ${!onlyMyAssigned ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  All Employees
                </button>
                <button
                  onClick={() => setOnlyMyAssigned(true)}
                  className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${onlyMyAssigned ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <UserCheck size={13} />
                  My Assigned Only
                </button>
              </div>
            )}

            <button 
              onClick={() => navigate('/employees/add')}
              className="flex items-center gap-2 bg-[#6b21a8] hover:bg-[#581c87] text-white px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors shadow-sm"
            >
              <UserPlus size={15} />
              Add Employee
            </button>
          </div>
        </div>

        {/* Quick KPI summary counters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
          <div 
            onClick={() => setLateLockFilter('all')}
            className={`border rounded-lg p-3 cursor-pointer transition-all ${lateLockFilter === 'all' ? 'bg-white border-gray-300 ring-2 ring-purple-100' : 'bg-gray-50 border-gray-200/70 hover:bg-white'}`}
          >
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Total Listed</span>
            <span className="text-lg font-bold text-gray-900 mt-0.5 block">{totalCount}</span>
          </div>

          {/* Pending Unlock Queries / Late Blocked KPI Pill */}
          <div 
            onClick={() => setLateLockFilter(lateLockFilter === 'pendingQuery' ? 'all' : 'pendingQuery')}
            className={`border rounded-lg p-3 cursor-pointer transition-all ${lateLockFilter === 'pendingQuery' ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200' : 'bg-white border-gray-200/70 hover:border-rose-200'}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                <Lock size={12} /> Unlock Queries
              </span>
              {pendingQueriesCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold text-rose-900">{pendingQueriesCount}</span>
              {pendingQueriesCount > 0 && (
                <span className="text-[10px] font-extrabold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">Needs HR Action</span>
              )}
            </div>
          </div>

          <div 
            onClick={() => setHrFilter(hrFilter === 'unassigned' ? 'all' : 'unassigned')}
            className={`border rounded-lg p-3 cursor-pointer transition-all ${hrFilter === 'unassigned' ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200' : 'bg-white border-gray-200/70 hover:border-amber-200'}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Unassigned HR</span>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
            <span className="text-lg font-bold text-amber-900 mt-0.5 block">{unassignedHrCount}</span>
          </div>

          <div 
            onClick={() => setOnboardingFilter(onboardingFilter === 'PendingOrSubmitted' ? 'all' : 'PendingOrSubmitted')}
            className={`border rounded-lg p-3 cursor-pointer transition-all ${onboardingFilter === 'PendingOrSubmitted' ? 'bg-orange-50 border-orange-300 ring-2 ring-orange-200' : 'bg-white border-gray-200/70 hover:border-orange-200'}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-orange-700 uppercase tracking-wider">Pending Onboarding</span>
              <span className="w-2 h-2 rounded-full bg-orange-500" />
            </div>
            <span className="text-lg font-bold text-orange-900 mt-0.5 block">{pendingOnboardingCount}</span>
          </div>

          <div 
            onClick={() => navigate('/hr/payroll')}
            className="bg-white border border-gray-200/70 hover:border-green-300 rounded-lg p-3 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-green-700 uppercase tracking-wider">Payroll & Salary</span>
              <DollarSign size={14} className="text-green-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span className="text-xs font-semibold text-gray-500 mt-1 block">Open Payroll &rarr;</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="px-6 my-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Search by name, ID, role, HR, telecaller..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-[13px] text-gray-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all shadow-sm placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter by HR */}
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-sm text-xs">
            <User size={13} className="text-gray-400" />
            <span className="text-gray-500 font-medium">HR:</span>
            <select
              value={hrFilter}
              onChange={(e) => setHrFilter(e.target.value)}
              className="bg-transparent text-gray-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All HRs</option>
              <option value="unassigned">Unassigned Only</option>
              {staffData.hrs.map(h => (
                <option key={h._id} value={h._id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Onboarding Status */}
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-sm text-xs">
            <Hourglass size={13} className="text-gray-400" />
            <span className="text-gray-500 font-medium">Onboarding:</span>
            <select
              value={onboardingFilter}
              onChange={(e) => setOnboardingFilter(e.target.value)}
              className="bg-transparent text-gray-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All</option>
              <option value="PendingOrSubmitted">Pending / Chasing</option>
              <option value="Done">Completed</option>
            </select>
          </div>

          {/* Filter by Unlock Query Status */}
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-sm text-xs">
            <Lock size={13} className="text-gray-400" />
            <span className="text-gray-500 font-medium">Unlock Queries:</span>
            <select
              value={lateLockFilter}
              onChange={(e) => setLateLockFilter(e.target.value)}
              className="bg-transparent text-gray-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pendingQuery">Pending Queries / Locked ({pendingQueriesCount})</option>
              <option value="locked">All Locked IDs</option>
            </select>
          </div>

          {(hrFilter !== 'all' || onboardingFilter !== 'all' || lateLockFilter !== 'all' || searchTerm || onlyMyAssigned) && (
            <button
              onClick={() => {
                setHrFilter('all');
                setOnboardingFilter('all');
                setLateLockFilter('all');
                setSearchTerm('');
                setOnlyMyAssigned(false);
              }}
              className="text-xs text-purple-700 hover:text-purple-900 font-semibold px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Employees Table */}
      <div className="px-6">
        <div className="border border-gray-200/80 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Role & Designation</th>
                  <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Assigned HR</th>
                  <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Onboarding & Chaser</th>
                  <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status & Login Lock</th>
                  <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map((emp) => {
                  const isDone = emp.onboarding === 'Done';
                  const hasHR = !!emp.assignedHRName;
                  const hasChaser = !!emp.assignedTelecallerName;

                  return (
                    <tr key={emp.id} className="hover:bg-purple-50/20 transition-colors">
                      {/* Employee Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {emp.name?.charAt(0).toUpperCase() || 'E'}
                          </div>
                          <div>
                            <p 
                              className="text-[13px] font-bold text-gray-900 cursor-pointer hover:text-purple-600 transition-colors"
                              onClick={() => navigate(`/employees/${emp.id}`)}
                            >
                              {emp.name}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{emp.email}</p>
                            {emp.mobile && (
                              <p className="text-[11px] text-gray-500 font-mono flex items-center gap-1 mt-0.5">
                                <Phone size={10} className="text-gray-400" /> {emp.mobile}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Employee ID */}
                      <td className="py-3.5 px-4">
                        <span className="text-[12px] font-mono font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                          {emp.empId}
                        </span>
                      </td>

                      {/* Role & Designation */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${getRoleBadgeStyle(emp.role)}`}>
                            {emp.role}
                          </span>
                          <p className="text-[12px] text-gray-600 font-medium mt-1">{emp.designation}</p>
                        </div>
                      </td>

                      {/* Assigned HR */}
                      <td className="py-3.5 px-4">
                        {hasHR ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-md text-xs font-semibold">
                              <UserCheck size={13} className="text-purple-600" />
                              <span>{emp.assignedHRName}</span>
                            </div>
                            {(isMasterAdmin || isHR) && (
                              <button
                                onClick={() => setAssignHrModal({ isOpen: true, employee: emp, selectedHrId: emp.assignedHRId || '' })}
                                className="text-[11px] text-gray-400 hover:text-purple-600 underline font-medium"
                                title="Change Assigned HR"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[11px] font-medium">
                              Unassigned
                            </span>
                            {(isMasterAdmin || isHR) && (
                              <button
                                onClick={() => setAssignHrModal({ isOpen: true, employee: emp, selectedHrId: '' })}
                                className="px-2 py-1 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 rounded transition-colors"
                              >
                                + Assign HR
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Onboarding & Chaser */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5">
                          {isDone ? (
                            <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[11px] font-bold w-fit">
                              <CheckCircle2 size={13} />
                              <span>Completed</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded text-[11px] font-bold w-fit">
                              <Hourglass size={13} />
                              <span>Pending Onboarding</span>
                            </div>
                          )}

                          {/* Telecaller Chaser delegation */}
                          {!isDone && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {hasChaser ? (
                                <div 
                                  title={emp.telecallerChaserNotes ? `Instructions: ${emp.telecallerChaserNotes}` : 'Telecaller chasing pending documents'}
                                  className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-[10px] font-bold cursor-help"
                                >
                                  <Phone size={10} />
                                  <span>Chaser: {emp.assignedTelecallerName}</span>
                                </div>
                              ) : null}

                              {(isHR || isMasterAdmin) && (
                                <button
                                  onClick={() => setAssignTelecallerModal({
                                    isOpen: true,
                                    employee: emp,
                                    selectedTelecallerId: emp.assignedTelecallerId || '',
                                    notes: emp.telecallerChaserNotes || ''
                                  })}
                                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-1.5 py-0.5 rounded transition-colors"
                                >
                                  {hasChaser ? 'Change Chaser' : '+ Assign Telecaller'}
                                </button>
                              )}

                              <button
                                onClick={() => handleSendReminder(emp.id, emp.name)}
                                title="Send reminder email"
                                className="text-[10px] font-bold text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-1.5 py-0.5 rounded transition-colors"
                              >
                                Remind
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status Toggle & Late Lock Indicator */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleStatusToggle(emp.id, emp.status)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'}`}
                              title={emp.status === 'Active' ? 'Deactivate Employee' : 'Activate Employee'}
                            >
                              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emp.status === 'Active' ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                            <span className={`text-[11px] font-bold ${emp.status === 'Active' ? 'text-emerald-600' : 'text-gray-400'}`}>
                              {emp.status}
                            </span>
                          </div>

                          {/* Pending Unblock Query Badge (Highest Priority) */}
                          {emp.unblockRequest?.status === 'Pending' ? (
                            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300/80 rounded-lg px-2 py-1 w-fit shadow-xs">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                              <div className="flex flex-col">
                                <span className="text-[10px] font-extrabold text-amber-900 flex items-center gap-1">
                                  <span>Login Query:</span>
                                  <span className="text-amber-700 underline font-normal truncate max-w-[120px]" title={emp.unblockRequest.queryText}>
                                    "{emp.unblockRequest.queryText}"
                                  </span>
                                </span>
                              </div>
                              {(isHR || isMasterAdmin) && (
                                <button
                                  onClick={() => setUnblockModalState({ isOpen: true, employee: emp, hrRemark: '' })}
                                  className="ml-1 text-[10px] font-black text-white bg-amber-600 hover:bg-amber-700 px-2 py-0.5 rounded shadow-xs flex items-center gap-1 transition-all"
                                  title="Review Query & Unblock"
                                >
                                  <Unlock size={10} /> Review & Unblock
                                </button>
                              )}
                            </div>
                          ) : emp.isLateLocked ? (
                            /* Late Locked without pending query */
                            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded px-1.5 py-1 w-fit">
                              <Lock size={12} className="text-red-600 shrink-0" />
                              <span className="text-[10px] font-extrabold text-red-700" title={emp.lateLockReason}>
                                Late Blocked
                              </span>
                              {(isHR || isMasterAdmin) && (
                                <button
                                  onClick={() => handleApproveLateLogin(emp.id, emp.name)}
                                  className="ml-1 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2 py-0.5 rounded shadow-sm flex items-center gap-1 transition-all"
                                  title="Unblock and approve late login for today"
                                >
                                  <Unlock size={10} /> Unblock
                                </button>
                              )}
                            </div>
                          ) : emp.unblockRequest?.status === 'Approved' && emp.hrLoginApprovedDate ? (
                            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded w-fit">
                              <CheckCircle2 size={11} />
                              <span>Approved for Today ({emp.hrApprovedBy || 'HR'})</span>
                            </div>
                          ) : null}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copy Link */}
                          {!isDone && (
                            copiedId === emp.id ? (
                              <button 
                                className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-[11px] font-medium"
                              >
                                <Check size={12} /> Copied
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleCopyLink(emp.id)}
                                title="Copy public onboarding form link"
                                className="flex items-center gap-1 p-1.5 border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 rounded transition-colors"
                              >
                                <Link2 size={14} />
                              </button>
                            )
                          )}

                          {/* Manage Payroll & Salary */}
                          <button
                            onClick={() => navigate('/hr/payroll', { state: { initialSearch: emp.name } })}
                            title="Manage Salary & Payroll for this employee"
                            className="flex items-center justify-center p-1.5 border border-gray-200 text-gray-600 hover:text-green-600 hover:border-green-200 hover:bg-green-50/50 rounded transition-colors"
                          >
                            <DollarSign size={14} />
                          </button>

                          {/* View Profile */}
                          <button 
                            onClick={() => navigate(`/employees/${emp.id}`)}
                            className="flex items-center justify-center p-1.5 border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 rounded transition-colors"
                            title="View Profile & Documents"
                          >
                            <Eye size={14} />
                          </button>

                          {/* Quick Reset Password (HR, Admin, Super Admin) */}
                          {(isMasterAdmin || isHR) && (
                            <button
                              onClick={() => handleAdminResetPassword(emp)}
                              title="Reset Employee Password (No previous password required)"
                              className="flex items-center justify-center p-1.5 border border-amber-200 bg-amber-50/70 text-amber-700 hover:bg-amber-100 hover:border-amber-300 rounded transition-colors"
                            >
                              <KeyRound size={14} />
                            </button>
                          )}

                          {/* Edit Employee */}
                          <button 
                            onClick={() => navigate(`/employees/${emp.id}/edit`)}
                            className="flex items-center justify-center p-1.5 border border-gray-200 text-gray-600 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50/50 rounded transition-colors"
                            title="Edit Employee"
                          >
                            <Edit size={14} />
                          </button>

                          {/* Delete Employee */}
                          <button 
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="flex items-center justify-center p-1.5 border border-gray-200 text-gray-600 hover:text-red-500 hover:border-red-200 hover:bg-red-50/50 rounded transition-colors"
                            title="Delete Employee"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-7 h-7 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-500 text-xs font-medium">Loading employee directory...</p>
                      </div>
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center">
                      <p className="text-gray-500 text-sm font-medium">No employees found matching the filters.</p>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= MODAL: ASSIGN HR ================= */}
      {assignHrModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                  <UserCheck size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Assign HR to Employee</h3>
                  <p className="text-[11px] text-gray-500">Select which HR will manage this employee</p>
                </div>
              </div>
              <button 
                onClick={() => setAssignHrModal({ isOpen: false, employee: null, selectedHrId: '' })}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Target employee card */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/70">
                <p className="text-xs font-bold text-gray-900">{assignHrModal.employee?.name}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{assignHrModal.employee?.role} &bull; {assignHrModal.employee?.empId}</p>
                <p className="text-[11px] text-gray-400">{assignHrModal.employee?.email}</p>
              </div>

              {/* HR Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select HR Specialist
                </label>
                
                <div className="relative">
                  {/* Selected Value Display */}
                  <div 
                    onClick={() => setIsHrDropdownOpen(!isHrDropdownOpen)}
                    className="w-full bg-white border border-gray-200 hover:border-purple-300 rounded-xl px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-colors"
                  >
                    {assignHrModal.selectedHrId ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                          {staffData.hrs.find(h => h._id === assignHrModal.selectedHrId)?.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800">
                          {staffData.hrs.find(h => h._id === assignHrModal.selectedHrId)?.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500 font-medium">None / Unassigned</span>
                    )}
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${isHrDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Dropdown Menu */}
                  {isHrDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="p-2 border-b border-gray-50">
                        <div className="relative">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text"
                            placeholder="Search HR by name or email..."
                            value={hrSearchText}
                            onChange={(e) => setHrSearchText(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-gray-50 border-none rounded-lg py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-purple-100 focus:outline-none"
                          />
                        </div>
                      </div>
                      
                      <div className="max-h-56 overflow-y-auto">
                        <div
                          onClick={() => {
                            setAssignHrModal(prev => ({ ...prev, selectedHrId: '' }));
                            setIsHrDropdownOpen(false);
                            setHrSearchText('');
                          }}
                          className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between ${!assignHrModal.selectedHrId ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
                        >
                          <div>
                            <p className="text-xs font-bold text-gray-700">None / Unassigned</p>
                            <p className="text-[11px] text-gray-400">Remove current HR assignment</p>
                          </div>
                          {!assignHrModal.selectedHrId && <Check size={16} className="text-purple-600" />}
                        </div>

                        {staffData.hrs.filter(h => h.name.toLowerCase().includes(hrSearchText.toLowerCase()) || h.email.toLowerCase().includes(hrSearchText.toLowerCase())).map(h => (
                          <div
                            key={h._id}
                            onClick={() => {
                              setAssignHrModal(prev => ({ ...prev, selectedHrId: h._id }));
                              setIsHrDropdownOpen(false);
                              setHrSearchText('');
                            }}
                            className={`px-4 py-3 border-t border-gray-50 cursor-pointer transition-colors flex items-center justify-between ${assignHrModal.selectedHrId === h._id ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-purple-200 text-purple-800 font-bold text-xs flex items-center justify-center">
                                {h.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-900">{h.name}</p>
                                <p className="text-[11px] text-gray-500">{h.email}</p>
                              </div>
                            </div>
                            {assignHrModal.selectedHrId === h._id && <Check size={16} className="text-purple-600" />}
                          </div>
                        ))}
                        
                        {staffData.hrs.filter(h => h.name.toLowerCase().includes(hrSearchText.toLowerCase()) || h.email.toLowerCase().includes(hrSearchText.toLowerCase())).length === 0 && (
                          <p className="text-xs text-gray-400 italic p-4 text-center">No HRs found matching "{hrSearchText}"</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setAssignHrModal({ isOpen: false, employee: null, selectedHrId: '' })}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                disabled={isSubmittingModal}
                onClick={handleSaveHrAssignment}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow transition-colors disabled:opacity-50"
              >
                {isSubmittingModal ? 'Saving...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ASSIGN TELECALLER CHASER ================= */}
      {assignTelecallerModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Phone size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Assign Onboarding Chaser</h3>
                  <p className="text-[11px] text-gray-500">Delegate document follow-up to a telecaller</p>
                </div>
              </div>
              <button 
                onClick={() => setAssignTelecallerModal({ isOpen: false, employee: null, selectedTelecallerId: '', notes: '' })}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Candidate preview */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/70">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-900">{assignTelecallerModal.employee?.name}</p>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    Onboarding Pending
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 font-mono mt-0.5">Mobile: {assignTelecallerModal.employee?.mobile || 'N/A'}</p>
                <p className="text-[11px] text-gray-400">{assignTelecallerModal.employee?.email}</p>
              </div>

              {/* Telecaller Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Telecaller
                </label>
                <div className="relative">
                  {/* Selected Value Display */}
                  <div 
                    onClick={() => setIsTelecallerDropdownOpen(!isTelecallerDropdownOpen)}
                    className="w-full bg-white border border-gray-200 hover:border-indigo-300 rounded-xl px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-colors"
                  >
                    {assignTelecallerModal.selectedTelecallerId ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                          {staffData.telecallers.find(t => t._id === assignTelecallerModal.selectedTelecallerId)?.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800">
                          {staffData.telecallers.find(t => t._id === assignTelecallerModal.selectedTelecallerId)?.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500 font-medium">None / Unassigned</span>
                    )}
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${isTelecallerDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Dropdown Menu */}
                  {isTelecallerDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="p-2 border-b border-gray-50">
                        <div className="relative">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text"
                            placeholder="Search Telecaller by name or email..."
                            value={telecallerSearchText}
                            onChange={(e) => setTelecallerSearchText(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-gray-50 border-none rounded-lg py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                          />
                        </div>
                      </div>
                      
                      <div className="max-h-56 overflow-y-auto">
                        <div
                          onClick={() => {
                            setAssignTelecallerModal(prev => ({ ...prev, selectedTelecallerId: '' }));
                            setIsTelecallerDropdownOpen(false);
                            setTelecallerSearchText('');
                          }}
                          className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between ${!assignTelecallerModal.selectedTelecallerId ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                        >
                          <div>
                            <p className="text-xs font-bold text-gray-700">None / Unassigned</p>
                            <p className="text-[11px] text-gray-400">Remove current telecaller assignment</p>
                          </div>
                          {!assignTelecallerModal.selectedTelecallerId && <Check size={16} className="text-indigo-600" />}
                        </div>

                        {staffData.telecallers.filter(t => t.name.toLowerCase().includes(telecallerSearchText.toLowerCase()) || (t.email && t.email.toLowerCase().includes(telecallerSearchText.toLowerCase()))).map(t => (
                          <div
                            key={t._id}
                            onClick={() => {
                              setAssignTelecallerModal(prev => ({ ...prev, selectedTelecallerId: t._id }));
                              setIsTelecallerDropdownOpen(false);
                              setTelecallerSearchText('');
                            }}
                            className={`px-4 py-3 border-t border-gray-50 cursor-pointer transition-colors flex items-center justify-between ${assignTelecallerModal.selectedTelecallerId === t._id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-indigo-200 text-indigo-800 font-bold text-xs flex items-center justify-center">
                                {t.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-900">{t.name}</p>
                                <p className="text-[11px] text-gray-500">{t.role || 'Telecaller'}{t.mobile ? ` - ${t.mobile}` : ''}</p>
                              </div>
                            </div>
                            {assignTelecallerModal.selectedTelecallerId === t._id && <Check size={16} className="text-indigo-600" />}
                          </div>
                        ))}
                        
                        {staffData.telecallers.filter(t => t.name.toLowerCase().includes(telecallerSearchText.toLowerCase()) || (t.email && t.email.toLowerCase().includes(telecallerSearchText.toLowerCase()))).length === 0 && (
                          <p className="text-xs text-gray-400 italic p-4 text-center">No Telecallers found matching "{telecallerSearchText}"</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions / Notes for Telecaller */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Follow-up Instructions / Notes
                </label>
                <textarea
                  rows={3}
                  value={assignTelecallerModal.notes}
                  onChange={(e) => setAssignTelecallerModal(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g. Call candidate to submit Aadhaar & cancelled cheque by 5 PM."
                  className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none focus:border-indigo-400 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setAssignTelecallerModal({ isOpen: false, employee: null, selectedTelecallerId: '', notes: '' })}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                disabled={isSubmittingModal}
                onClick={handleSaveTelecallerAssignment}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow transition-colors disabled:opacity-50"
              >
                {isSubmittingModal ? 'Saving...' : 'Assign Telecaller'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HR UNBLOCK QUERY & APPROVAL MODAL */}
      {/* ========================================================================= */}
      {unblockModalState.isOpen && unblockModalState.employee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-6 text-white relative">
              <button
                onClick={() => setUnblockModalState({ isOpen: false, employee: null, hrRemark: '', isProcessing: false })}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-1.5 transition-colors"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <Unlock size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Review Login Unlock Query</h3>
                  <p className="text-xs text-purple-200">Employee Login Approval & ID Unblock</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              
              {/* Employee Info Card */}
              <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Employee:</span>
                  <span className="font-bold text-gray-900 text-sm">{unblockModalState.employee.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Employee ID:</span>
                  <span className="font-mono font-bold text-gray-800 bg-white px-2 py-0.5 rounded border border-gray-200">
                    {unblockModalState.employee.empId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Role & Designation:</span>
                  <span className="font-semibold text-gray-800">{unblockModalState.employee.role} - {unblockModalState.employee.designation}</span>
                </div>
                {unblockModalState.employee.mobile && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Mobile:</span>
                    <span className="font-mono font-medium text-gray-700">{unblockModalState.employee.mobile}</span>
                  </div>
                )}
              </div>

              {/* Employee Query / Reason */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <AlertCircle size={14} className="text-amber-600" />
                  <span>Employee Query / Reason for Unblock</span>
                </label>
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 font-medium leading-relaxed">
                  {unblockModalState.employee.unblockRequest?.queryText || unblockModalState.employee.lateLockReason || 'Requesting HR to unblock ID for login.'}
                </div>
              </div>

              {/* HR Remark */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">HR Remark / Comment (Optional)</label>
                <input
                  type="text"
                  value={unblockModalState.hrRemark}
                  onChange={(e) => setUnblockModalState(prev => ({ ...prev, hrRemark: e.target.value }))}
                  placeholder="e.g. Approved for today after manager consultation"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={unblockModalState.isProcessing}
                onClick={() => handleProcessUnblockQuery(unblockModalState.employee.id, 'Rejected', unblockModalState.hrRemark)}
                className="px-4 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-all disabled:opacity-50"
              >
                Reject Query
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUnblockModalState({ isOpen: false, employee: null, hrRemark: '', isProcessing: false })}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 bg-white border border-gray-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={unblockModalState.isProcessing}
                  onClick={() => handleProcessUnblockQuery(unblockModalState.employee.id, 'Approved', unblockModalState.hrRemark)}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Unlock size={14} />
                  <span>{unblockModalState.isProcessing ? 'Processing...' : 'Approve & Unblock ID'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
