import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarClock, CheckCircle, XCircle, Users, Eye, X, UserCheck, ShieldCheck, Plus, Calendar, FileText, Send, Clock, ListChecks } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function LeaveManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applyForm, setApplyForm] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    type: 'Casual Leave',
    reason: ''
  });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRoleStr = (localStorage.getItem('userRole') || currentUser.role || '').toLowerCase();
  const currentUserId = (currentUser._id || currentUser.id || '').toString();
  const currentEmpId = (currentUser.empId || '').toString().toLowerCase();
  const currentEmail = (currentUser.email || localStorage.getItem('userEmail') || '').toLowerCase();
  const currentName = (currentUser.name || '').toLowerCase().trim();

  // Role categorization
  const isSuperAdmin = ['super admin', 'superadmin'].includes(userRoleStr);
  const isAdmin = ['admin', 'administrator'].includes(userRoleStr);
  const isHrHead = ['hr head', 'hrhead', 'hr_head'].includes(userRoleStr);
  const isHrManager = ['hr manager', 'hrmanager', 'hr_manager'].includes(userRoleStr);
  const isHrExecutive = ['hr executive', 'hrexecutive', 'hr_executive'].includes(userRoleStr);

  // Only HR Head, Admin, or SuperAdmin can see team approval management; all other roles (RM, ARM, Telecaller, RE/RO, Employees) ONLY see My Leaves
  const canManageTeamLeaves = isSuperAdmin || isAdmin || isHrHead || isHrManager;

  // Tab State: 'my-leaves' or 'team-requests'
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(() => {
    if (!canManageTeamLeaves) return 'my-leaves';
    return tabParam === 'team-requests' ? 'team-requests' : 'my-leaves';
  });

  useEffect(() => {
    if (!canManageTeamLeaves) {
      setActiveTab('my-leaves');
    } else if (tabParam === 'team-requests') {
      setActiveTab('team-requests');
    } else {
      setActiveTab('my-leaves');
    }
  }, [tabParam, canManageTeamLeaves]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams(newTab === 'my-leaves' ? { tab: 'my-leaves' } : {});
  };

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/leaves`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setLeaveRequests(data);
      } else {
        toast.error('Failed to fetch leave requests');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyForm.startDate || !applyForm.endDate) {
      toast.error('Please select start and end dates');
      return;
    }
    if (!applyForm.reason.trim()) {
      toast.error('Please enter a reason for leave');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const payload = {
        ...applyForm,
        employeeId: currentUserId,
        empId: currentEmpId,
        email: currentEmail,
        employeeName: currentName
      };

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/apply-leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Leave ticket raised successfully!');
        setShowApplyModal(false);
        setApplyForm({
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          type: 'Casual Leave',
          reason: ''
        });
        fetchLeaves();
      } else {
        toast.error(data.message || 'Failed to submit leave request');
      }
    } catch (error) {
      toast.error('Server error while applying for leave');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // Generic API helper for Approvals & Rejections
  const callApprovalAPI = async (leave, approverRole, action, comment) => {
    const token = localStorage.getItem('token');
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/employees/${leave.employeeId}/leaves/${leave.id}/status`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ approverRole, action, comment })
      }
    );
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message || `Leave ${action} successfully`);
      fetchLeaves();
    } else {
      toast.error(data.message || `Failed to ${action.toLowerCase()} leave`);
    }
  };

  // Tier 1 — Reporting Manager Review / Step 1
  const handleRMApprove = (leave) => {
    Swal.fire({
      title: 'Review & Recommend (RM)',
      text: `Accept and recommend ticket ${leave.ticketId || leave.id} for HR Head approval?`,
      input: 'text', inputPlaceholder: 'Optional RM review comment...',
      icon: 'question', showCancelButton: true,
      confirmButtonColor: '#2563eb', cancelButtonColor: '#64748b',
      confirmButtonText: 'Accept & Forward to HR Head'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try { await callApprovalAPI(leave, 'rm', 'Approved', result.value || ''); }
        catch (e) { toast.error('Error reviewing leave'); }
      }
    });
  };

  const handleRMReject = (leave) => {
    Swal.fire({
      title: 'Reject Leave (RM)',
      text: `Reject ticket ${leave.ticketId || leave.id} as Reporting Manager:`,
      input: 'textarea', inputPlaceholder: 'Rejection reason (required)...',
      showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
      confirmButtonText: 'Reject Leave',
      preConfirm: (r) => { if (!r) Swal.showValidationMessage('Reason required'); return r; }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try { await callApprovalAPI(leave, 'rm', 'Rejected', result.value); }
        catch (e) { toast.error('Error rejecting leave'); }
      }
    });
  };

  // Tier 2 — HR Head / Superadmin Final Grant
  const handleHRApprove = (leave) => {
    Swal.fire({
      title: 'Final Grant (Approve)',
      text: `Grant final approval for ticket ${leave.ticketId || leave.id}?`,
      input: 'text', inputPlaceholder: 'Optional approval note...',
      icon: 'success', showCancelButton: true,
      confirmButtonColor: '#047857', cancelButtonColor: '#64748b',
      confirmButtonText: 'Grant Leave'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try { await callApprovalAPI(leave, 'hr', 'Approved', result.value || ''); }
        catch (e) { toast.error('Error granting leave'); }
      }
    });
  };

  const handleHRReject = (leave) => {
    Swal.fire({
      title: 'Final Rejection',
      text: `Reject ticket ${leave.ticketId || leave.id}:`,
      input: 'textarea', inputPlaceholder: 'Rejection reason (required)...',
      showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
      confirmButtonText: 'Reject',
      preConfirm: (r) => { if (!r) Swal.showValidationMessage('Reason required'); return r; }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try { await callApprovalAPI(leave, 'hr', 'Rejected', result.value); }
        catch (e) { toast.error('Error rejecting leave'); }
      }
    });
  };

  const handleView = (req) => {
    const rmStatus  = req.rmApproval?.status  || 'Pending';
    const hrStatus  = req.hrApproval?.status  || 'Pending';
    const rmBy      = req.rmApproval?.approvedBy || '';
    const hrBy      = req.hrApproval?.approvedBy || '';
    const rmComment = req.rmApproval?.comment  || '';
    const hrComment = req.hrApproval?.comment  || '';
    const sc = (s) => s === 'Approved' ? '#047857' : s === 'Rejected' ? '#dc2626' : '#d97706';
    Swal.fire({
      title: `Leave Ticket — ${req.ticketId || 'LEV'}`,
      html: `
        <div class="text-left text-sm space-y-3 mt-4">
          <div class="flex justify-between border-b pb-2"><span class="font-bold text-slate-500">Employee:</span> <span class="font-semibold">${req.employeeName} (${req.empId || '-'})</span></div>
          <div class="flex justify-between border-b pb-2"><span class="font-bold text-slate-500">Designation / Role:</span> <span class="font-semibold">${req.employeeRole || req.department || '-'}</span></div>
          <div class="flex justify-between border-b pb-2"><span class="font-bold text-slate-500">Leave Type:</span> <span>${req.type}</span></div>
          <div class="flex justify-between border-b pb-2"><span class="font-bold text-slate-500">Duration:</span> <span>${new Date(req.startDate).toLocaleDateString()} → ${new Date(req.endDate).toLocaleDateString()} (${req.days} Days)</span></div>
          <div class="flex justify-between border-b pb-2"><span class="font-bold text-slate-500">Applied On:</span> <span>${new Date(req.appliedDate).toLocaleDateString()}</span></div>
          <div class="border-b pb-2"><span class="font-bold text-slate-500 block mb-1">Reason:</span><p class="text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">${req.reason}</p></div>
          <div class="border-b pb-2 pt-1">
            <span class="font-bold text-slate-600 block mb-2">Multi-Tier Approval Pipeline:</span>
            <div style="display:flex;align-items:center;gap:8px">
              <div style="flex:1;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:8px;text-align:center">
                <div style="font-size:10px;font-weight:700;color:#64748b;margin-bottom:3px">STAGE 1: REPORTING MANAGER</div>
                <div style="font-weight:800;font-size:13px;color:${sc(rmStatus)}">${rmStatus === 'Approved' ? 'Accepted & Forwarded' : rmStatus}</div>
                ${rmBy ? `<div style="font-size:10px;color:#94a3b8">${rmBy}</div>` : ''}
                ${rmComment ? `<div style="font-size:10px;color:#475569;margin-top:3px;font-style:italic">"${rmComment}"</div>` : ''}
              </div>
              <div style="font-size:20px;color:#cbd5e1">→</div>
              <div style="flex:1;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:8px;text-align:center">
                <div style="font-size:10px;font-weight:700;color:#64748b;margin-bottom:3px">STAGE 2: HR HEAD / ADMIN</div>
                <div style="font-weight:800;font-size:13px;color:${sc(hrStatus)}">${hrStatus === 'Approved' ? 'Final Granted' : hrStatus}</div>
                ${hrBy ? `<div style="font-size:10px;color:#94a3b8">${hrBy}</div>` : ''}
                ${hrComment ? `<div style="font-size:10px;color:#475569;margin-top:3px;font-style:italic">"${hrComment}"</div>` : ''}
              </div>
            </div>
          </div>
          <div class="flex justify-between pt-1"><span class="font-bold text-slate-500">Live Status:</span> <span class="font-bold" style="color:${sc(req.status)}">${req.status === 'RM Approved' ? 'RM Accepted (Awaiting HR Head)' : req.status}</span></div>
        </div>
      `,
      confirmButtonColor: '#047857',
      confirmButtonText: 'Close'
    });
  };

  // Determine if a record belongs to current user
  const isSelfLeave = (req) => {
    if (isHrExecutive) return true; // Backend already scopes to this executive
    if (req.employeeId && currentUserId && req.employeeId.toString() === currentUserId) return true;
    if (req.empId && currentEmpId && req.empId.toString().toLowerCase() === currentEmpId) return true;
    if (req.employeeEmail && currentEmail && req.employeeEmail.toLowerCase() === currentEmail) return true;
    if (req.employeeName && currentName && req.employeeName.toLowerCase().trim() === currentName) return true;
    return false;
  };

  // Filter leaves based on active tab
  const displayedLeaves = leaveRequests.filter((req) => {
    if (isHrExecutive) return true;
    if (activeTab === 'my-leaves') {
      return isSelfLeave(req);
    }
    // Team Requests tab: show leaves belonging to others/subordinates
    return true;
  });

  const pendingCount    = displayedLeaves.filter(r => r.status === 'Pending').length;
  const rmApprovedCount = displayedLeaves.filter(r => r.status === 'RM Approved').length;
  const approvedCount   = displayedLeaves.filter(r => r.status === 'Approved').length;
  const rejectedCount   = displayedLeaves.filter(r => r.status === 'Rejected').length;
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const onLeaveCount = displayedLeaves.filter(r => {
    if (r.status !== 'Approved') return false;
    const start = new Date(r.startDate);
    const end = new Date(r.endDate);
    return today >= start && today <= end;
  }).length;

  const isReadOnlyMode = isHrExecutive || activeTab === 'my-leaves';

  return (
    <div className="w-full space-y-6 pb-10 bg-[var(--color-brand-page-bg)] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-brand-text)] mb-1">
            {isHrExecutive || activeTab === 'my-leaves' ? 'My Leaves' : 'Leave Management'}
          </h1>
          <p className="text-[13px] text-[var(--color-brand-text-secondary)] font-medium">
            {isHrExecutive || activeTab === 'my-leaves'
              ? 'Track your applied leave requests, live approval status, and remarks'
              : 'Review team leave requests, provide management recommendations, and grant approvals'}
          </p>
        </div>
        
        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#489b0d] hover:bg-[#3e850b] text-white rounded-[12px] text-[13px] font-bold transition-all shadow-sm active:scale-95 cursor-pointer w-fit"
        >
          <Plus size={16} /> Apply for Leave
        </button>
      </div>

      {/* Role Tab Switcher (Only For HR Manager, HR Head, Admin) */}
      {canManageTeamLeaves && (
        <div className="flex items-center gap-2 border-b border-[var(--color-brand-border)] pb-2">
          <button
            onClick={() => handleTabChange('my-leaves')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
              activeTab === 'my-leaves'
                ? 'bg-[#489b0d] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Clock size={16} /> My Leaves
          </button>
          <button
            onClick={() => handleTabChange('team-requests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
              activeTab === 'team-requests'
                ? 'bg-[#489b0d] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Users size={16} /> Team Leave Approvals
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-[14px] border border-[var(--color-brand-border)] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-[12px] bg-amber-50 flex items-center justify-center shrink-0">
            <CalendarClock size={20} className="text-amber-600" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-0.5">Pending</h4>
            <h3 className="text-xl font-extrabold text-[var(--color-brand-text)]">{pendingCount}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[14px] border border-blue-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-[12px] bg-blue-50 flex items-center justify-center shrink-0">
            <UserCheck size={20} className="text-blue-600" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-0.5">RM Approved</h4>
            <h3 className="text-xl font-extrabold text-blue-700">{rmApprovedCount}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[14px] border border-[var(--color-brand-border)] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-[12px] bg-emerald-50 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} className="text-emerald-600" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-0.5">Fully Approved</h4>
            <h3 className="text-xl font-extrabold text-[var(--color-brand-text)]">{approvedCount}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[14px] border border-[var(--color-brand-border)] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-[12px] bg-red-50 flex items-center justify-center shrink-0">
            <XCircle size={20} className="text-red-500" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-0.5">Rejected</h4>
            <h3 className="text-xl font-extrabold text-[var(--color-brand-text)]">{rejectedCount}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[14px] border border-[var(--color-brand-border)] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-[12px] bg-[var(--color-brand-sky-light)] flex items-center justify-center shrink-0">
            <Users size={20} className="text-[var(--color-brand-blue-dark)]" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-0.5">On Leave Today</h4>
            <h3 className="text-xl font-extrabold text-[var(--color-brand-text)]">{onLeaveCount}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[18px] border border-[var(--color-brand-border)] overflow-hidden shadow-sm">
        
        <div className="p-5 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-sky-pale)] flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[var(--color-brand-text)]">
            {isReadOnlyMode ? 'My Leave Applications & Live Updates' : 'Team Leave Requests & Approvals'}
          </h2>
          {isReadOnlyMode && (
            <span className="text-[12px] font-semibold text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200">
              Read Only • Live Status
            </span>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            <thead>
              <tr className="border-b border-[var(--color-brand-border)]">
                <th className="py-3.5 px-5 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white whitespace-nowrap">Ticket ID</th>
                <th className="py-3.5 px-5 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white whitespace-nowrap">Employee</th>
                <th className="py-3.5 px-5 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white whitespace-nowrap">Assigned Approver</th>
                <th className="py-3.5 px-5 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white whitespace-nowrap">Leave Type</th>
                <th className="py-3.5 px-5 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white whitespace-nowrap">Duration</th>
                <th className="py-3.5 px-5 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white whitespace-nowrap">Applied Date</th>
                <th className="py-3.5 px-5 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white whitespace-nowrap">Status</th>
                <th className="py-3.5 px-5 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-brand-border)]">
              {displayedLeaves.map((req) => {
                const self = isSelfLeave(req);

                return (
                  <tr key={req.id} className="hover:bg-[var(--color-brand-hover-bg)] transition-colors group">
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="font-mono text-[12px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80 inline-block whitespace-nowrap">
                        {req.ticketId || `LEV-${(req.id || '').toString().slice(-4)}`}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <p className="text-[13.5px] font-bold text-[var(--color-brand-text)] leading-tight">{req.employeeName}</p>
                      <p className="text-[11.5px] text-[var(--color-brand-text-secondary)] mt-0.5">{req.empId ? `${req.empId} • ` : ''}{req.department || req.employeeRole}</p>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="text-[12px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md inline-block">
                        {req.assignedHr || 'Reporting Manager'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <p className="text-[13px] font-semibold text-[var(--color-brand-text)]">{req.type}</p>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <p className="text-[12.5px] text-[var(--color-brand-text)] font-medium leading-tight">{new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()}</p>
                      <p className="text-[11.5px] font-bold text-[var(--color-brand-text-secondary)] mt-0.5">{req.days} Day(s)</p>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <p className="text-[12.5px] text-[var(--color-brand-text-secondary)]">{new Date(req.appliedDate).toLocaleDateString()}</p>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap
                        ${req.status === 'Approved'    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          req.status === 'RM Approved' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          req.status === 'Rejected'    ? 'bg-red-50 text-red-600 border border-red-200' :
                          'bg-amber-50 text-amber-600 border border-amber-200'}`}
                      >
                        {req.status === 'RM Approved' ? 'RM Accepted' : req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* View details / live updates button */}
                        <button
                          onClick={() => handleView(req)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-700 rounded-md text-[11.5px] font-bold transition-all border border-emerald-200 active:scale-95 cursor-pointer whitespace-nowrap"
                          title="View Live Approval Progress & Remarks"
                        >
                          <Eye size={13} className="shrink-0" />
                          <span>View</span>
                        </button>

                        {/* If viewing My Leaves or HR Executive, or own application: No approval actions */}
                        {!isReadOnlyMode && !self && (
                          <>
                            {/* ── STAGE 1: PENDING LEAVES ── */}
                            {req.status === 'Pending' && (
                              <>
                                {/* Case A: If HR Manager reviewing HR Executive leave */}
                                {isHrManager && (
                                  <>
                                    <button
                                      onClick={() => handleRMApprove(req)}
                                      className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-[12px] font-bold transition-colors cursor-pointer"
                                      title="Review and forward to HR Head for final approval"
                                    >
                                      <UserCheck size={14} /> Review (Accept)
                                    </button>
                                    <button
                                      onClick={() => handleRMReject(req)}
                                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                      title="Reject Leave"
                                    >
                                      <X size={16} />
                                    </button>
                                  </>
                                )}

                                {/* Case B: If HR Head / Admin reviewing directly */}
                                {(isHrHead || isSuperAdmin || isAdmin) && (
                                  <>
                                    <button
                                      onClick={() => handleHRApprove(req)}
                                      className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md text-[12px] font-bold transition-colors cursor-pointer"
                                      title="Directly Grant Leave (Final Approval)"
                                    >
                                      <ShieldCheck size={14} /> Grant Leave
                                    </button>
                                    <button
                                      onClick={() => handleHRReject(req)}
                                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                      title="Reject Leave"
                                    >
                                      <X size={16} />
                                    </button>
                                  </>
                                )}
                              </>
                            )}

                            {/* ── STAGE 2: RM APPROVED LEAVES (Awaiting HR Head / Admin Grant) ── */}
                            {req.status === 'RM Approved' && (
                              <>
                                {(isHrHead || isSuperAdmin || isAdmin) ? (
                                  <>
                                    <button
                                      onClick={() => handleHRApprove(req)}
                                      className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[12px] font-bold transition-colors shadow-xs cursor-pointer"
                                      title="Grant Final Approval"
                                    >
                                      <ShieldCheck size={14} /> Grant Leave
                                    </button>
                                    <button
                                      onClick={() => handleHRReject(req)}
                                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                      title="Reject Leave"
                                    >
                                      <X size={16} />
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                    Awaiting HR Head
                                  </span>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {displayedLeaves.length === 0 && (
            <div className="p-12 text-center">
              <CalendarClock size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="text-[14px] font-bold text-[var(--color-brand-text)]">
                {isReadOnlyMode ? 'No leave records found' : 'No team leave requests found'}
              </p>
              <p className="text-[12px] text-slate-400 mt-1">
                {isReadOnlyMode 
                  ? 'Click "Apply for Leave" to raise a new leave ticket'
                  : 'All team leave requests will appear here for review'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[var(--color-brand-sky-pale)] border-b border-[var(--color-brand-border)] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-brand-text)] flex items-center gap-2">
                  <Calendar className="text-[#489b0d]" size={20} /> Apply for Leave
                </h3>
                <p className="text-[12px] text-slate-500 mt-0.5">Submit leave ticket for automatic multi-tier approval</p>
              </div>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors shadow-xs"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
              {/* Notice Banner */}
              <div className="bg-emerald-50 border border-emerald-200/70 rounded-xl p-3 text-[12px] text-emerald-900 flex items-start gap-2.5">
                <Clock size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Automated Hierarchy Routing:</strong> Your ticket will automatically route to your reporting manager (Manager/Head/Admin). You will be able to view live status updates once reviewed.
                </p>
              </div>

              {/* Leave Type */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={applyForm.type}
                  onChange={(e) => setApplyForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d]"
                  required
                >
                  <option value="Casual Leave">Casual Leave (CL)</option>
                  <option value="Sick Leave">Sick Leave (SL)</option>
                  <option value="Earned Leave">Earned Leave (EL)</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                  <option value="Half Day">Half Day Leave</option>
                </select>
              </div>

              {/* Date Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={applyForm.startDate}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      setApplyForm(prev => ({
                        ...prev,
                        startDate: newStart,
                        endDate: prev.endDate < newStart ? newStart : prev.endDate
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={applyForm.endDate}
                    min={applyForm.startDate}
                    onChange={(e) => setApplyForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d]"
                    required
                  />
                </div>
              </div>

              {/* Live Duration Calculation */}
              {applyForm.startDate && applyForm.endDate && (
                <div className="flex justify-between items-center bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80 text-[12px]">
                  <span className="text-slate-500 font-medium">Calculated Duration:</span>
                  <span className="font-extrabold text-[#489b0d]">
                    {Math.max(1, Math.ceil((new Date(applyForm.endDate) - new Date(applyForm.startDate)) / (1000 * 60 * 60 * 24)) + 1)} Day(s)
                  </span>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                  Reason for Leave <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={applyForm.reason}
                  onChange={(e) => setApplyForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Please describe reason for leave request..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] resize-none"
                  required
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#489b0d] hover:bg-[#3e850b] text-white font-bold text-[13px] shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send size={15} /> Submit Leave Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function CalendarCheckIcon(props) {
  return <Calendar {...props} />;
}
