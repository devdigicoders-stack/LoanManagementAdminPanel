import { useState } from 'react';
import { CalendarClock, CheckCircle, XCircle, Users, Eye, Check, X } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function LeaveManagement() {
  // Mock data for leave requests
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 'LR-1001', employee: 'Ravi Kumar', department: 'Sales', type: 'Sick Leave', startDate: '2023-11-20', endDate: '2023-11-21', days: 2, reason: 'Viral fever and weakness', status: 'Pending', appliedDate: '2023-11-19' },
    { id: 'LR-1002', employee: 'Priya Singh', department: 'HR', type: 'Casual Leave', startDate: '2023-12-01', endDate: '2023-12-05', days: 5, reason: 'Family function out of station', status: 'Approved', appliedDate: '2023-11-15' },
    { id: 'LR-1003', employee: 'Amit Sharma', department: 'Operations', type: 'Earned Leave', startDate: '2023-11-10', endDate: '2023-11-12', days: 3, reason: 'Personal work', status: 'Rejected', appliedDate: '2023-11-05' },
    { id: 'LR-1004', employee: 'Neha Gupta', department: 'Accounts', type: 'Emergency Leave', startDate: '2023-11-22', endDate: '2023-11-22', days: 1, reason: 'Medical emergency at home', status: 'Pending', appliedDate: '2023-11-21' },
  ]);

  const handleApprove = (id) => {
    Swal.fire({
      title: 'Approve Leave?',
      text: 'Are you sure you want to approve this leave request?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Approve'
    }).then((result) => {
      if (result.isConfirmed) {
        setLeaveRequests(leaveRequests.map(req => 
          req.id === id ? { ...req, status: 'Approved' } : req
        ));
        toast.success('Leave request approved successfully');
      }
    });
  };

  const handleReject = (id) => {
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
    }).then((result) => {
      if (result.isConfirmed) {
        setLeaveRequests(leaveRequests.map(req => 
          req.id === id ? { ...req, status: 'Rejected' } : req
        ));
        toast.success('Leave request rejected');
      }
    });
  };

  const handleView = (req) => {
    Swal.fire({
      title: `Leave Details - ${req.employee}`,
      html: `
        <div class="text-left text-sm space-y-3 mt-4">
          <div class="flex justify-between border-b pb-2"><span class="font-bold text-slate-500">Department:</span> <span>${req.department}</span></div>
          <div class="flex justify-between border-b pb-2"><span class="font-bold text-slate-500">Leave Type:</span> <span>${req.type}</span></div>
          <div class="flex justify-between border-b pb-2"><span class="font-bold text-slate-500">Duration:</span> <span>${req.startDate} to ${req.endDate} (${req.days} Days)</span></div>
          <div class="flex justify-between border-b pb-2"><span class="font-bold text-slate-500">Applied On:</span> <span>${req.appliedDate}</span></div>
          <div class="border-b pb-2">
            <span class="font-bold text-slate-500 block mb-1">Reason:</span> 
            <p class="text-slate-700 bg-slate-50 p-2 rounded">${req.reason}</p>
          </div>
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
  const onLeaveCount = 8; // Mock value

  return (
    <div className="w-full space-y-6 pb-10 bg-[var(--color-brand-page-bg)] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)] mb-1">Leave Management</h1>
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
            <h3 className="text-2xl font-extrabold text-[var(--color-brand-text)]">{pendingCount}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[14px] border border-[var(--color-brand-border)] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-[12px] bg-emerald-50 flex items-center justify-center shrink-0">
            <CheckCircle size={20} className="text-emerald-600" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-0.5">Approved</h4>
            <h3 className="text-2xl font-extrabold text-[var(--color-brand-text)]">{approvedCount}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[14px] border border-[var(--color-brand-border)] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-[12px] bg-red-50 flex items-center justify-center shrink-0">
            <XCircle size={20} className="text-red-500" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-0.5">Rejected</h4>
            <h3 className="text-2xl font-extrabold text-[var(--color-brand-text)]">{rejectedCount}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[14px] border border-[var(--color-brand-border)] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-[12px] bg-[var(--color-brand-sky-light)] flex items-center justify-center shrink-0">
            <Users size={20} className="text-[var(--color-brand-blue-dark)]" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-0.5">Employees on Leave</h4>
            <h3 className="text-2xl font-extrabold text-[var(--color-brand-text)]">{onLeaveCount}</h3>
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
                    <p className="text-[14px] font-bold text-[var(--color-brand-text)]">{req.employee}</p>
                    <p className="text-[12px] text-[var(--color-brand-text-secondary)] mt-0.5">{req.department}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] font-semibold text-[var(--color-brand-text)]">{req.type}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] text-[var(--color-brand-text)]">{req.startDate} to {req.endDate}</p>
                    <p className="text-[12px] font-bold text-[var(--color-brand-text-secondary)] mt-0.5">{req.days} Day(s)</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] text-[var(--color-brand-text-secondary)]">{req.appliedDate}</p>
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
                            onClick={() => handleApprove(req.id)}
                            className="p-1.5 text-[var(--color-brand-text-secondary)] hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => handleReject(req.id)}
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
