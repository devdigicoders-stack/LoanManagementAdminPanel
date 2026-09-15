import { useState, useEffect, useCallback } from 'react';
import { CalendarClock, CheckCircle, XCircle, Users, Eye, X, UserCheck, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function LeaveManagement() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // Generic API helper
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

  // Tier 1 — Reporting Manager
  const handleRMApprove = (leave) => {
    Swal.fire({
      title: 'RM Approval',
      text: `Approve ticket ${leave.ticketId || leave.id} as Reporting Manager?`,
      input: 'text', inputPlaceholder: 'Optional RM comment...',
      icon: 'question', showCancelButton: true,
      confirmButtonColor: '#10b981', cancelButtonColor: '#64748b',
      confirmButtonText: 'Approve (RM)'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try { await callApprovalAPI(leave, 'rm', 'Approved', result.value || ''); }
        catch (e) { toast.error('Error approving leave'); }
      }
    });
  };

  const handleRMReject = (leave) => {
    Swal.fire({
      title: 'RM Rejection',
      text: `Reject ticket ${leave.ticketId || leave.id} as Reporting Manager:`,
      input: 'textarea', inputPlaceholder: 'Rejection reason (required)...',
      showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
      confirmButtonText: 'Reject (RM)',
      preConfirm: (r) => { if (!r) Swal.showValidationMessage('Reason required'); return r; }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try { await callApprovalAPI(leave, 'rm', 'Rejected', result.value); }
        catch (e) { toast.error('Error rejecting leave'); }
      }
    });
  };

  // Tier 2 — HR Manager
  const handleHRApprove = (leave) => {
    Swal.fire({
      title: 'HR Final Approval',
      text: `Give final HR approval for ticket ${leave.ticketId || leave.id}?`,
      input: 'text', inputPlaceholder: 'Optional HR comment...',
      icon: 'success', showCancelButton: true,
      confirmButtonColor: '#047857', cancelButtonColor: '#64748b',
      confirmButtonText: 'Approve (HR)'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try { await callApprovalAPI(leave, 'hr', 'Approved', result.value || ''); }
        catch (e) { toast.error('Error approving leave'); }
      }
    });
  };

  const handleHRReject = (leave) => {
    Swal.fire({
      title: 'HR Rejection',
      text: `Reject ticket ${leave.ticketId || leave.id} at HR level:`,
      input: 'textarea', inputPlaceholder: 'HR rejection reason (required)...',
      showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
      confirmButtonText: 'Reject (HR)',
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
          <div class="flex justify-between border-b pb-2"><span class="font-bold text-slate-500">Leave Type:</span> <span>${req.type}</span></div>
          <div class="flex justify-between border-b pb-2"><span class="font-bold text-slate-500">Duration:</span> <span>${new Date(req.startDate).toLocaleDateString()} → ${new Date(req.endDate).toLocaleDateString()} (${req.days} Days)</span></div>
          <div class="flex justify-between border-b pb-2"><span class="font-bold text-slate-500">Applied On:</span> <span>${new Date(req.appliedDate).toLocaleDateString()}</span></div>
          <div class="border-b pb-2"><span class="font-bold text-slate-500 block mb-1">Reason:</span><p class="text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">${req.reason}</p></div>
          <div class="border-b pb-2 pt-1">
            <span class="font-bold text-slate-600 block mb-2">Approval Pipeline:</span>
            <div style="display:flex;align-items:center;gap:8px">
              <div style="flex:1;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:8px;text-align:center">
                <div style="font-size:10px;font-weight:700;color:#64748b;margin-bottom:3px">REPORTING MANAGER</div>
                <div style="font-weight:800;font-size:13px;color:${sc(rmStatus)}">${rmStatus}</div>
                ${rmBy ? `<div style="font-size:10px;color:#94a3b8">${rmBy}</div>` : ''}
                ${rmComment ? `<div style="font-size:10px;color:#475569;margin-top:3px;font-style:italic">"${rmComment}"</div>` : ''}
              </div>
              <div style="font-size:20px;color:#cbd5e1">→</div>
              <div style="flex:1;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:8px;text-align:center">
                <div style="font-size:10px;font-weight:700;color:#64748b;margin-bottom:3px">HR MANAGER</div>
                <div style="font-weight:800;font-size:13px;color:${sc(hrStatus)}">${hrStatus}</div>
                ${hrBy ? `<div style="font-size:10px;color:#94a3b8">${hrBy}</div>` : ''}
                ${hrComment ? `<div style="font-size:10px;color:#475569;margin-top:3px;font-style:italic">"${hrComment}"</div>` : ''}
              </div>
            </div>
          </div>
          <div class="flex justify-between pt-1"><span class="font-bold text-slate-500">Final Status:</span> <span class="font-bold" style="color:${sc(req.status)}">${req.status}</span></div>
        </div>
      `,
      confirmButtonColor: '#047857',
      confirmButtonText: 'Close'
    });
  };

  const pendingCount    = leaveRequests.filter(r => r.status === 'Pending').length;
  const rmApprovedCount = leaveRequests.filter(r => r.status === 'RM Approved').length;
  const approvedCount   = leaveRequests.filter(r => r.status === 'Approved').length;
  const rejectedCount   = leaveRequests.filter(r => r.status === 'Rejected').length;
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const onLeaveCount = leaveRequests.filter(r => {
    if (r.status !== 'Approved') return false;
    const start = new Date(r.startDate);
    const end = new Date(r.endDate);
    return today >= start && today <= end;
  }).length;

  return (
    <div className="w-full space-y-6 pb-10 bg-[var(--color-brand-page-bg)] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-brand-text)] mb-1">Leave Management</h1>
          <p className="text-[13px] text-[var(--color-brand-text-secondary)] font-medium">Manage employee leave requests, approvals, and balances</p>
        </div>
      </div>

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

      {/* Main Content */}
      <div className="bg-white rounded-[18px] border border-[var(--color-brand-border)] overflow-hidden shadow-sm">
        
        <div className="p-5 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-sky-pale)]">
          <h2 className="text-[16px] font-bold text-[var(--color-brand-text)]">Recent Leave Requests</h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-[var(--color-brand-border)]">
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white">Ticket ID</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white">Employee</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white">Assigned HR</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white">Leave Type</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white">Duration</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white">Applied Date</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white">Status</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-brand-border)]">
              {leaveRequests.map((req) => (
                <tr key={req.id} className="hover:bg-[var(--color-brand-hover-bg)] transition-colors group">
                  <td className="py-4 px-6">
                    <span className="font-mono text-[12.5px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {req.ticketId || `LEV-${(req.id || '').toString().slice(-4)}`}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[14px] font-bold text-[var(--color-brand-text)]">{req.employeeName}</p>
                    <p className="text-[12px] text-[var(--color-brand-text-secondary)] mt-0.5">{req.empId ? `${req.empId} • ` : ''}{req.department}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[12.5px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      {req.assignedHr || 'Admin HR'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] font-semibold text-[var(--color-brand-text)]">{req.type}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] text-[var(--color-brand-text)]">{new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()}</p>
                    <p className="text-[12px] font-bold text-[var(--color-brand-text-secondary)] mt-0.5">{req.days} Day(s)</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] text-[var(--color-brand-text-secondary)]">{new Date(req.appliedDate).toLocaleDateString()}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold
                      ${req.status === 'Approved'    ? 'bg-emerald-50 text-emerald-700' :
                        req.status === 'RM Approved' ? 'bg-blue-50 text-blue-700' :
                        req.status === 'Rejected'    ? 'bg-red-50 text-red-600' :
                        'bg-amber-50 text-amber-600'}`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View */}
                      <button
                        onClick={() => handleView(req)}
                        className="p-1.5 text-[var(--color-brand-text-secondary)] hover:text-[var(--color-brand-blue-dark)] hover:bg-[var(--color-brand-sky-light)] rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Tier 1 — RM acts on Pending */}
                      {req.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleRMApprove(req)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="RM Approve"
                          >
                            <UserCheck size={15} />
                          </button>
                          <button
                            onClick={() => handleRMReject(req)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="RM Reject"
                          >
                            <X size={15} />
                          </button>
                        </>
                      )}

                      {/* Tier 2 — HR acts on RM Approved */}
                      {req.status === 'RM Approved' && (
                        <>
                          <button
                            onClick={() => handleHRApprove(req)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                            title="HR Final Approve"
                          >
                            <ShieldCheck size={15} />
                          </button>
                          <button
                            onClick={() => handleHRReject(req)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="HR Reject"
                          >
                            <X size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {leaveRequests.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-[14px] font-bold text-[var(--color-brand-text)]">No leave requests found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
