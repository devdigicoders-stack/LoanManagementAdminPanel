import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  MessageSquare
} from "lucide-react";

export default function LeadDetails() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");

  const fetchLeadDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/leads/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // format dates
        data.createdOn = new Date(data.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        setLead(data);
      } else {
        toast.error('Failed to fetch lead details');
      }
    } catch (error) {
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  const updateLeadStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/leads/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setLead({ ...lead, status: newStatus });
        toast.success(`Lead status updated to ${newStatus}`);
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Server error');
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-slate-500 font-bold">Loading Lead Details...</div>;
  }

  if (!lead) {
    return <div className="p-10 text-center text-slate-500 font-bold">Lead not found!</div>;
  }

  const statusOptions = [
    { label: 'New', value: 'New', color: 'text-[#489b0d]', activeBg: 'bg-[#489b0d]/10' },
    { label: 'Contacted', value: 'Contacted', color: 'text-blue-500', activeBg: 'bg-blue-50' },
    { label: 'Qualified', value: 'Qualified', color: 'text-purple-500', activeBg: 'bg-purple-50' },
    { label: 'Converted', value: 'Converted', color: 'text-green-600', activeBg: 'bg-green-50' },
  ];

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* Top Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="shrink-0">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Lead Details: {lead.leadId}</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500 whitespace-nowrap">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">
              Lead & Work Management
            </span>
            <ChevronRight size={14} className="mx-1 shrink-0" />
            <Link to="/leads" className="hover:text-[#489b0d] transition-colors">All Leads</Link>
            <ChevronRight size={14} className="mx-1 shrink-0" />
            <span className="text-[#489b0d] font-bold">{lead.name}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col md:flex-row">
        {/* Sidebar Actions */}
        <div className="w-full md:w-[220px] bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-5 shrink-0 flex flex-col gap-1">
          <div className="mb-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Update Status</p>
            <div className="space-y-1.5">
              {statusOptions.map(option => {
                const isActive = lead.status === option.value;
                return (
                  <button 
                    key={option.value}
                    onClick={() => updateLeadStatus(option.value)} 
                    className={`flex items-center gap-2 text-[13px] font-bold py-2 px-3 w-full rounded transition-colors cursor-pointer text-left
                      ${isActive ? `${option.activeBg} ${option.color}` : 'text-slate-600 hover:bg-slate-100'}
                    `}
                  >
                    <CheckCircle2 size={16} className={isActive ? option.color : 'text-slate-400'} /> {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-2 pt-5 border-t border-slate-200">
            <button 
              onClick={() => updateLeadStatus('Lost')} 
              className={`flex items-center gap-2 text-[13px] font-bold py-2 px-3 transition-colors cursor-pointer w-full text-left rounded
                ${lead.status === 'Lost' ? 'bg-red-50 text-red-600' : 'text-red-500 hover:bg-slate-100'}`}
            >
              <XCircle size={16} className={lead.status === 'Lost' ? 'text-red-600' : 'text-red-400'} /> Mark as Lost
            </button>
            <button onClick={() => setActiveTab('Notes')} className="flex items-center justify-center gap-2 mt-4 w-full py-2.5 border border-[#489b0d]/20 bg-[#489b0d]/5 text-[#489b0d] rounded-lg text-[13px] font-bold hover:bg-[#489b0d]/10 transition-colors cursor-pointer shadow-sm">
              <MessageSquare size={16} /> Add Note
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 flex-1 bg-white">
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-5">
                <h4 className="text-[14px] font-extrabold text-slate-800 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#489b0d]"></div>
                  Contact Information
                </h4>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 rounded-md">
                    <Mail size={16} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-1">Email</p>
                    <p className="text-[14px] font-bold text-slate-800">{lead.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 rounded-md">
                    <Phone size={16} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-1">Phone</p>
                    <p className="text-[14px] font-bold text-slate-800">{lead.mobile || 'N/A'}</p>
                    {lead.altMobile && <p className="text-[12px] font-semibold text-slate-500 mt-1">Alt: {lead.altMobile}</p>}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 rounded-md">
                    <MapPin size={16} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-1">Address</p>
                    <p className="text-[14px] font-bold text-slate-800 leading-relaxed max-w-sm">{lead.address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Status & Loan Info */}
              <div className="space-y-5">
                <h4 className="text-[14px] font-extrabold text-slate-800 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#489b0d]"></div>
                  Lead Details
                </h4>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-1">Created On</p>
                    <p className="text-[14px] font-bold text-slate-800">{lead.createdOn}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-1">Next Follow Up</p>
                    <p className="text-[14px] font-bold text-slate-800">{lead.nextFollowUp || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-1">Source</p>
                    <p className="text-[14px] font-bold text-slate-800">{lead.source}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-1">Expected Loan Amount</p>
                    <p className="text-[16px] font-black text-[#489b0d]">{lead.expectedAmount || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[11px] font-semibold text-slate-500 mb-1">Loan Purpose</p>
                    <p className="text-[14px] font-bold text-slate-800">{lead.loanPurpose}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[11px] font-semibold text-slate-500 mb-1">Remarks</p>
                    <p className="text-[13px] font-medium text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-100">{lead.remarks || 'No remarks provided.'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "Notes" && (
            <div className="space-y-4">
              <h4 className="text-[14px] font-extrabold text-slate-800 mb-4">Notes & Follow-ups</h4>
              <p className="text-sm text-slate-500">Coming soon... Here you can add notes and view past follow-ups.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
