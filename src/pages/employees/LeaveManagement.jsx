import { useState, useEffect, useCallback } from 'react';
import { CalendarClock, CheckCircle, XCircle, Users, Eye, Check, X } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function LeaveManagement() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/employees/leaves', {
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

  const handleApprove = (leave) => {
    Swal.fire({
      title: 'Approve Leave?',
      text: 'Are you sure you want to approve this leave request?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Approve'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`http://localhost:5000/api/employees/${leave.employeeId}/leaves/${leave.id}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'Approved' })
          });
          if (res.ok) {
            toast.success('Leave request approved successfully');
            fetchLeaves();
          } else {
            toast.error('Failed to approve leave');
          }
        } catch (error) {
          console.error(error);
          toast.error('Error approving leave');
        }
      }
    });
  };

  const handleReject = (leave) => {
    Swal.fire({
      title: 'Reject Leave',
      text: 'Please provide a reason for rejecting this leave:',
      input: 'textarea',
      inputPlaceholder: 'Type your reason here...',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Reject Leave',
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage('Rejection reason is required');
        }
        return reason;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`http://localhost:5000/api/employees/${leave.employeeId}/leaves/${leave.id}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'Rejected', adminComment: result.value })
          });
          if (res.ok) {
            toast.success('Leave request rejected');
            fetchLeaves();
          } else {
            toast.error('Failed to reject leave');
          }
        } catch (error) {
          console.error(error);
          toast.error('Error rejecting leave');
        }
      }
    });
  };

  const handleView = (req) => {
    Swal.fire({
      title: `Leave Details - ${req.employeeName}`,
      html: `
        <div class="text-left text-sm space-y-3 mt-4">
          <div class="flex justify-between border-b pb-2"><span class="font-bold text-slate-500">Department:</span> <span>${req.department}</span></div>
          <div class="flex justify-between border-b pb-2"><span class="font-bold text-slate-500">Leave Type:</span> <span>${req.type}</span></div>
          <div class="flex justify-between border-b pb-2"><span class="font-bold text-slate-500">Duration:</span> <span>${new Date(req.startDate).toLocaleDateString()} to ${new Date(req.endDate).toLocaleDateString()} (${req.days} Days)</span></div>
          <div class="flex justify-between border-b pb-2"><span class="font-bold text-slate-500">Applied On:</span> <span>${new Date(req.appliedDate).toLocaleDateString()}</span></div>
          <div class="border-b pb-2">
            <span class="font-bold text-slate-500 block mb-1">Reason:</span> 
            <p class="text-slate-700 bg-slate-50 p-2 rounded">${req.reason}</p>
          </div>
          ${req.adminComment ? `<div class="border-b pb-2">
            <span class="font-bold text-slate-500 block mb-1">Admin Comment:</span> 
            <p class="text-slate-700 bg-slate-50 p-2 rounded">${req.adminComment}</p>
          </div>` : ''}
          <div class="flex justify-between pt-2"><span class="font-bold text-slate-500">Current Status:</span> <span class="font-bold ${req.status === 'Approved' ? 'text-emerald-600' : req.status === 'Rejected' ? 'text-red-600' : 'text-amber-600'}">${req.status}</span></div>
        </div>
      `,
      confirmButtonColor: '#8ED3F4',
      confirmButtonText: 'Close'
    });
  };

  const pendingCount = leaveRequests.filter(r => r.status === 'Pending').length;
  const approvedCount = leaveRequests.filter(r => r.status === 'Approved').length;
  const rejectedCount = leaveRequests.filter(r => r.status === 'Rejected').length;
  
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[14px] border border-[var(--color-brand-border)] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-[12px] bg-amber-50 flex items-center justify-center shrink-0">
            <CalendarClock size={20} className="text-amber-600" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-0.5">Pending Requests</h4>
            <h3 className="text-xl font-extrabold text-[var(--color-brand-text)]">{pendingCount}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[14px] border border-[var(--color-brand-border)] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-[12px] bg-emerald-50 flex items-center justify-center shrink-0">
            <CheckCircle size={20} className="text-emerald-600" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-0.5">Approved</h4>
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
            <h4 className="text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-0.5">Employees on Leave</h4>
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
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white">Employee</th>
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
                    <p className="text-[14px] font-bold text-[var(--color-brand-text)]">{req.employeeName}</p>
                    <p className="text-[12px] text-[var(--color-brand-text-secondary)] mt-0.5">{req.department}</p>
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
                      ${req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                        req.status === 'Rejected' ? 'bg-red-50 text-red-600' : 
                        'bg-amber-50 text-amber-600'}`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleView(req)}
                        className="p-1.5 text-[var(--color-brand-text-secondary)] hover:text-[var(--color-brand-blue-dark)] hover:bg-[var(--color-brand-sky-light)] rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      
                      {req.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(req)}
                            className="p-1.5 text-[var(--color-brand-text-secondary)] hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => handleReject(req)}
                            className="p-1.5 text-[var(--color-brand-text-secondary)] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Reject"
                          >
                            <X size={16} />
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
