import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, FileText, CheckCircle2, XCircle, Eye, Bell, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function LoanApplicationDetails() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchApplicationDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/loans/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setApplication(data);
      } else {
        toast.error('Failed to load application details');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error loading application');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const handleDocumentAction = (docId, action) => {
    Swal.fire({
      title: `Confirm ${action}?`,
      text: `Are you sure you want to ${action.toLowerCase()} this document?`,
      icon: action === 'Approve' ? 'success' : 'warning',
      showCancelButton: true,
      confirmButtonColor: action === 'Approve' ? '#489b0d' : '#ef4444',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: `Yes, ${action}!`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/loans/${id}/documents/${docId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status: action === 'Approve' ? 'Approved' : 'Rejected' })
          });
          if (res.ok) {
            toast.success(`Document ${action.toLowerCase()}d successfully.`);
            fetchApplicationDetails();
          } else {
            toast.error(`Failed to ${action.toLowerCase()} document.`);
          }
        } catch (error) {
          toast.error("Error updating document.");
        }
      }
    });
  };

  const handleSendReminder = (docId) => {
    Swal.fire({
      title: 'Send Reminder?',
      text: 'Send a notification to the customer to re-upload this document?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Yes, Send!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/loans/${id}/remind`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ message: "Please re-upload your rejected document.", docId })
          });
          if (res.ok) {
            toast.success('Reminder sent successfully!');
          } else {
            toast.error('Failed to send reminder.');
          }
        } catch (error) {
          toast.error('Error sending reminder.');
        }
      }
    });
  };

  if (loading) {
    return <div className="p-10 text-center font-bold text-slate-500">Loading Application...</div>;
  }

  if (!application) {
    return <div className="p-10 text-center font-bold text-slate-500">Application Not Found</div>;
  }

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Application Details</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <Link to="/loans" className="cursor-pointer hover:text-[#489b0d] transition-colors">Applications</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">{application.applicationId}</span>
          </div>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-[15px] font-bold text-slate-800 mb-4 border-b pb-2">Applicant Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Customer Name</p>
            <p className="text-[14px] font-bold text-slate-700">{application.customer}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Contact</p>
            <p className="text-[14px] font-bold text-slate-700">{application.mobile}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Loan Requirement</p>
            <p className="text-[14px] font-bold text-[#489b0d]">{application.loanType} - ₹{application.amount}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Application Status</p>
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${application.status === 'Approved' ? 'bg-[#489b0d]/10 text-[#489b0d]' : application.status === 'Rejected' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
              {application.status}
            </span>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
            <FileText size={18} className="text-[#489b0d]" /> Uploaded Documents
          </h2>
          <span className="text-[11px] font-bold text-slate-400 px-2 py-1 bg-slate-100 rounded">
            {application.documents?.length || 0} Files
          </span>
        </div>
        
        <div className="p-4">
          {(!application.documents || application.documents.length === 0) ? (
            <div className="text-center py-10">
              <p className="text-slate-500 font-medium text-[13px]">No documents uploaded for this application.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {application.documents.map(doc => (
                <div key={doc._id} className="border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow bg-slate-50/50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${doc.status === 'Approved' ? 'bg-green-100 text-green-600' : doc.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-800">{doc.type}</p>
                        <p className="text-[11px] font-semibold text-slate-500">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${doc.status === 'Approved' ? 'bg-[#489b0d]/10 text-[#489b0d]' : doc.status === 'Rejected' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                      {doc.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 pt-3 border-t border-slate-100">
                    <a 
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:text-indigo-500 hover:bg-indigo-50 hover:border-indigo-200 transition-colors text-[11px] font-bold"
                    >
                      <Eye size={14} /> View
                    </a>

                    {doc.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleDocumentAction(doc._id, 'Approve')}
                          className="h-8 px-3 flex items-center justify-center gap-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:text-[#489b0d] hover:bg-[#489b0d]/10 hover:border-[#489b0d]/30 transition-colors tooltip-trigger"
                          title="Approve"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDocumentAction(doc._id, 'Reject')}
                          className="h-8 px-3 flex items-center justify-center gap-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors tooltip-trigger"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}

                    {doc.status === 'Rejected' && (
                      <button 
                        onClick={() => handleSendReminder(doc._id)}
                        className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:text-blue-500 hover:bg-blue-50 hover:border-blue-200 transition-colors text-[11px] font-bold"
                      >
                        <Bell size={14} /> Reminder
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
