import React, { useState, useEffect } from 'react';
import { 
 ClipboardList, Search, Phone, Mail, CheckCircle2, XCircle, 
 Target, FolderOpen, Loader2, MessageSquare, CalendarCheck, RefreshCw, 
 X, Send, UserCheck, ShieldCheck, Clock, Check, Eye
} from 'lucide-react';
import SupervisorStaffFilter from '../../components/SupervisorStaffFilter';
import toast from 'react-hot-toast';

export default function TelecallerDashboard() {
 const rawRole = (localStorage.getItem('userRole') || '').trim().toLowerCase();
 const cleanRole = rawRole.replace(/[^a-z0-9]/g, '');
 const isReadOnlyAdmin = ['superadmin', 'admin', 'administrator', 'super_admin'].includes(cleanRole) || rawRole.includes('super admin') || rawRole === 'admin';

 const [activeFilter, setActiveFilter] = useState('All');
 const [searchQuery, setSearchQuery] = useState('');
 const [zoneFilter, setZoneFilter] = useState('ALL');
 const [selectedStaff, setSelectedStaff] = useState('all');
 const [leads, setLeads] = useState([]);
 const [loading, setLoading] = useState(true);

 // Quick Action Modal State (Call, Remarks & Update Status together)
 const [selectedLead, setSelectedLead] = useState(null);
 const [modalType, setModalType] = useState(null); // 'call_remarks', 'followup'
 const [actionStatus, setActionStatus] = useState('Interested');
 const [actionNotes, setActionNotes] = useState('');
 const [followupDate, setFollowupDate] = useState('');
 const [callOutcome, setCallOutcome] = useState('Connected');
 const [isSubmitting, setIsSubmitting] = useState(false);

 const name = localStorage.getItem(`adminName_${localStorage.getItem("userRole")}`) || "Telecaller Agent";

 useEffect(() => {
 fetchLiveLeads();
 }, [selectedStaff]);

 const fetchLiveLeads = async () => {
 try {
 setLoading(true);
 const token = localStorage.getItem('token');
 let url = `${import.meta.env.VITE_API_BASE_URL}/employees/my-leads`;
 if (selectedStaff && selectedStaff !== 'all') {
 url += `?employeeId=${selectedStaff}`;
 }
 const res = await fetch(url, {
 headers: { Authorization: `Bearer ${token}` }
 });
 if (res.ok) {
 const data = await res.json();
 const combined = [
 ...(data.leads || []).map(l => {
 const hasCalled = Boolean(l.telecallerConfirmedAt || l.telecallerNotes || (l.followUps && l.followUps.length > 0) || ['Interested', 'Contacted', 'Follow-up', 'Documents Pending', 'Lost', 'Qualified', 'Converted'].includes(l.status));
 return {
 _id: l._id,
 id: l.leadId || l._id,
 name: l.name,
 mobile: l.mobile,
 email: l.email,
 loanPurpose: l.productSubtype || l.loanPurpose || "Personal Loan",
 expectedAmount: l.expectedAmount || l.loanAmount || 500000,
 status: l.status || "New",
 workflowStage: l.workflowStage || "Field_Lead_Created",
 isRmApproved: l.workflowStage === 'RM_Telecaller_Review' || ['Contacted', 'Interested', 'Under Review'].includes(l.status),
 zone: l.zone || "NORTH",
 rmReviewedBy: l.rmReviewedBy || l.rmName || "Reporting Manager",
 rmReviewRemarks: l.rmReviewRemarks || "",
 telecallerName: l.telecallerName || "",
 remarks: l.telecallerNotes || l.remarks || "",
 telecallerNotes: l.telecallerNotes || "",
 telecallerConfirmedAt: l.telecallerConfirmedAt || null,
 telecallerConfirmedBy: l.telecallerConfirmedBy || "",
 hasCalled,
 nextFollowUp: l.nextFollowUp || "-",
 leadType: 'Lead'
 };
 }),
 ...(data.loanApplications || []).map(a => {
 const hasCalled = Boolean(a.telecallerConfirmedAt || a.telecallerNotes || ['Interested', 'Contacted', 'Under Review'].includes(a.status));
 return {
 _id: a._id,
 id: a.applicationId || a._id,
 name: a.customer,
 mobile: a.mobile,
 email: a.email,
 loanPurpose: a.loanType || "Home Loan",
 expectedAmount: a.amount || 500000,
 status: a.status || "Pending",
 workflowStage: a.workflowStage || "RM_Telecaller_Review",
 isRmApproved: true,
 zone: "NORTH",
 remarks: a.telecallerNotes || a.remarks || "",
 telecallerNotes: a.telecallerNotes || "",
 telecallerConfirmedAt: a.telecallerConfirmedAt || null,
 telecallerConfirmedBy: a.telecallerConfirmedBy || "",
 hasCalled,
 nextFollowUp: "-",
 leadType: 'LoanApplication'
 };
 })
 ];
 setLeads(combined);
 }
 } catch (err) {
 console.error(err);
 toast.error("Failed to load customer leads");
 } finally {
 setLoading(false);
 }
 };

 const openActionModal = (lead, type) => {
 setSelectedLead(lead);
 setModalType(type);
 setActionStatus(lead.status === 'New' ? 'Contacted' : lead.status);
 setActionNotes(lead.remarks || '');
 setCallOutcome('Connected');
 setFollowupDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
 };

 const closeModal = () => {
 setSelectedLead(null);
 setModalType(null);
 setActionNotes('');
 setIsSubmitting(false);
 };

 // Submit Call, Notes, Follow-up and Status change directly to Database
 const handleSaveAction = async (e) => {
 e.preventDefault();
 if (!selectedLead) return;
 if (!actionNotes.trim() && modalType === 'call_remarks') {
 return toast.error("Please add conversation remarks for Reporting Manager (RM)");
 }

 try {
 setIsSubmitting(true);
 const token = localStorage.getItem('token');
 const targetId = selectedLead._id;

 // 1. Update Lead Status & Remarks
 const statusRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads/${targetId}/status`, {
 method: "PUT",
 headers: {
 "Content-Type": "application/json",
 Authorization: `Bearer ${token}`
 },
 body: JSON.stringify({
 status: actionStatus,
 remarks: `[Telecaller Call - ${callOutcome}]: ${actionNotes}`,
 reason: actionNotes
 })
 });

 // 2. If scheduling followup or logging call outcome
 if (modalType === 'followup' || followupDate) {
 await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads/${targetId}/followup`, {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 Authorization: `Bearer ${token}`
 },
 body: JSON.stringify({
 type: "Call",
 scheduledAt: followupDate || new Date().toISOString().split('T')[0],
 status: "Scheduled",
 notes: actionNotes || `Followup scheduled for ${actionStatus}`,
 addedBy: "Telecaller"
 })
 });
 }

 if (statusRes.ok) {
 toast.success(` Lead updated to ${actionStatus} & Remarks recorded for RM!`);
 setLeads(prev => prev.map(l => 
 l._id === targetId ? { 
 ...l, 
 status: actionStatus, 
 remarks: actionNotes, 
 telecallerNotes: actionNotes,
 hasCalled: true,
 telecallerConfirmedAt: new Date(),
 nextFollowUp: followupDate || l.nextFollowUp 
 } : l
 ));
 closeModal();
 } else {
 toast.error("Failed to update status");
 }
 } catch (err) {
 toast.error("Server network error");
 } finally {
 setIsSubmitting(false);
 }
 };

 const filteredLeads = leads.filter(lead => {
 if (zoneFilter !== 'ALL' && (lead.zone || '').toUpperCase() !== zoneFilter) return false;
 if (activeFilter === 'RM_Approved' && (!lead.isRmApproved || lead.hasCalled)) return false;
 if (activeFilter === 'Completed' && !lead.hasCalled) return false;
 if (activeFilter === 'Awaiting_RM' && lead.isRmApproved) return false;
 if (activeFilter === 'Interested' && lead.status !== 'Interested' && lead.status !== 'Qualified' && lead.status !== 'Converted') return false;
 if (activeFilter === 'Follow-up' && lead.status !== 'Follow-up') return false;
 
 if (searchQuery) {
 const q = searchQuery.toLowerCase();
 return (lead.name && lead.name.toLowerCase().includes(q)) || 
 (lead.mobile && lead.mobile.includes(q)) || 
 (lead.id && lead.id.toLowerCase().includes(q)) ||
 (lead.zone && lead.zone.toLowerCase().includes(q)) ||
 (lead.loanPurpose && lead.loanPurpose.toLowerCase().includes(q));
 }
 return true;
 });

 const totalLeads = leads.length;
 const readyToCallCount = leads.filter(l => l.isRmApproved && !l.hasCalled).length;
 const completedCount = leads.filter(l => l.hasCalled).length;
 const awaitingRmCount = leads.filter(l => !l.isRmApproved).length;
 const interestedCount = leads.filter(l => ['Interested', 'Qualified', 'Converted'].includes(l.status)).length;

 return (
 <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
 {/* Top Header */}
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
 <div>
 <div className="flex items-center gap-2">
 <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
 <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Telecaller Calling Desk</h1>
 </div>
 <p className="text-[13px] font-medium text-slate-500 mt-1">
 Call customers, add verification remarks, and update lead status directly for Reporting Manager (RM).
 </p>
 </div>
 <div className="flex flex-wrap items-center gap-3">
 <SupervisorStaffFilter onSelectStaff={setSelectedStaff} role="tele" />
 <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 px-3.5 py-1.5 rounded-xl font-bold text-[13px] shadow-xs">
 <UserCheck size={16} className="text-purple-600" />
 {name}
 </div>
 </div>
 </div>

 {/* Metric Cards */}
 {/* Metric Cards - Clean & Focused */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 <div 
 onClick={() => setActiveFilter('RM_Approved')}
 className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${activeFilter === 'RM_Approved' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]' : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-300'}`}
 >
 <div className="flex justify-between items-center mb-1">
 <span className={`text-[12px] font-bold ${activeFilter === 'RM_Approved' ? 'text-emerald-200' : 'text-emerald-700'}`}>Ready to Call (Assigned by RM)</span>
 <Phone size={18} className={activeFilter === 'RM_Approved' ? 'text-white' : 'text-emerald-600'} />
 </div>
 <div className="text-2xl font-black">{readyToCallCount}</div>
 <p className={`text-[11px] mt-1 font-medium ${activeFilter === 'RM_Approved' ? 'text-emerald-100' : 'text-slate-400'}`}>Pending customer call & remarks</p>
 </div>

 <div 
 onClick={() => setActiveFilter('Completed')}
 className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${activeFilter === 'Completed' ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]' : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300'}`}
 >
 <div className="flex justify-between items-center mb-1">
 <span className={`text-[12px] font-bold ${activeFilter === 'Completed' ? 'text-blue-200' : 'text-blue-700'}`}>Done / Handed Over</span>
 <CheckCircle2 size={18} className={activeFilter === 'Completed' ? 'text-white' : 'text-blue-600'} />
 </div>
 <div className="text-2xl font-black">{completedCount}</div>
 <p className={`text-[11px] mt-1 font-medium ${activeFilter === 'Completed' ? 'text-blue-100' : 'text-slate-400'}`}>Remarks submitted & synced to RM</p>
 </div>

 <div 
 onClick={() => setActiveFilter('All')}
 className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${activeFilter === 'All' ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-[1.02]' : 'bg-white border-slate-200 text-slate-800 hover:border-purple-300'}`}
 >
 <div className="flex justify-between items-center mb-1">
 <span className={`text-[12px] font-bold ${activeFilter === 'All' ? 'text-purple-200' : 'text-slate-500'}`}>All Assigned Leads</span>
 <FolderOpen size={18} className={activeFilter === 'All' ? 'text-white' : 'text-slate-400'} />
 </div>
 <div className="text-2xl font-black">{totalLeads}</div>
 <p className={`text-[11px] mt-1 font-medium ${activeFilter === 'All' ? 'text-purple-100' : 'text-slate-400'}`}>Total assigned leads across all zones</p>
 </div>
 </div>

 {/* Filter Tabs & Search Bar */}
 <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
 <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
 {[
 { id: 'RM_Approved', label: ` Ready to Call (${readyToCallCount})` },
 { id: 'Completed', label: ` Done / Handed Over (${completedCount})` },
 { id: 'All', label: `All Assigned (${leads.length})` },
 ].map(tab => (
 <button
 key={tab.id}
 onClick={() => setActiveFilter(tab.id)}
 className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
 activeFilter === tab.id
 ? 'bg-slate-900 text-white shadow-xs'
 : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
 }`}
 >
 {tab.label}
 </button>
 ))}
 </div>

 <div className="flex items-center gap-3 w-full md:w-auto">
 {/* Zone Selector Filter */}
 <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
 <span className="text-[11px] font-bold text-slate-500 uppercase">Zone:</span>
 <select
 value={zoneFilter}
 onChange={(e) => setZoneFilter(e.target.value)}
 className="bg-transparent text-[12px] font-extrabold text-purple-900 outline-none cursor-pointer"
 >
 <option value="ALL">All Zones (Pan-India)</option>
 <option value="NORTH">North Zone</option>
 <option value="SOUTH">South Zone</option>
 <option value="EAST">East Zone</option>
 <option value="WEST">West Zone</option>
 <option value="CENTRAL">Central Zone</option>
 </select>
 </div>

 <div className="relative w-full md:w-64">
 <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
 <input 
 type="text"
 placeholder="Search name, phone, zone..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
 />
 </div>
 </div>
 </div>

 {/* Main Single-Window Leads Table */}
 <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse whitespace-nowrap">
 <thead>
 <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
 <th className="py-3.5 px-4">Customer & Contact</th>
 <th className="py-3.5 px-4">Loan Purpose & Amount</th>
 <th className="py-3.5 px-4">RM Approval Stage</th>
 <th className="py-3.5 px-4">Latest Remarks / Log</th>
 <th className="py-3.5 px-4 text-center">Calling, Remarks & Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-[13px]">
 {loading ? (
 <tr>
 <td colSpan={5} className="py-16 text-center text-slate-400">
 <Loader2 size={24} className="animate-spin mx-auto mb-2 text-purple-600" />
 Loading leads from database...
 </td>
 </tr>
 ) : filteredLeads.length === 0 ? (
 <tr>
 <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
 No leads match your search criteria.
 </td>
 </tr>
 ) : (
 filteredLeads.map((lead) => {
 const isApproved = lead.isRmApproved;
 return (
 <tr key={lead._id} className="hover:bg-slate-50/80 transition-colors">
 {/* Customer Info */}
 <td className="py-3.5 px-4 whitespace-nowrap">
 <div className="font-bold text-slate-900 leading-tight">{lead.name}</div>
 <div className="flex items-center gap-2 mt-1">
 <a href={`tel:${lead.mobile}`} className="font-mono font-bold text-blue-600 hover:underline flex items-center gap-1 text-[12px] whitespace-nowrap">
 <Phone size={11} /> {lead.mobile}
 </a>
 <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200 whitespace-nowrap">
 {lead.zone} Zone
 </span>
 </div>
 </td>

 {/* Loan info */}
 <td className="py-3.5 px-4 whitespace-nowrap">
 <div className="font-bold text-slate-800 leading-tight">
 ₹{Number(lead.expectedAmount).toLocaleString('en-IN')}
 </div>
 <div className="text-[12px] text-slate-500 mt-0.5 whitespace-nowrap">{lead.loanPurpose}</div>
 </td>

 {/* Workflow Status */}
 <td className="py-3.5 px-4 whitespace-nowrap">
 <div className="flex flex-col items-start gap-1">
 {isApproved ? (
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 whitespace-nowrap" title={lead.rmReviewRemarks ? `RM Note: ${lead.rmReviewRemarks}` : ''}>
 APPROVED BY RM ({lead.zone})
 </span>
 ) : (
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 whitespace-nowrap">
 AWAITING {lead.zone} RM REVIEW
 </span>
 )}
 <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
 Status: <b className="text-slate-800">{lead.status}</b>
 </span>
 </div>
 </td>

 {/* Remarks */}
 <td className="py-3.5 px-4 max-w-xs whitespace-nowrap">
 <p className="text-[12px] text-slate-600 truncate font-medium max-w-[220px]" title={lead.remarks}>
 {lead.remarks || <span className="text-slate-400 italic">No notes recorded yet</span>}
 </p>
 {lead.nextFollowUp && lead.nextFollowUp !== '-' && (
 <div className="text-[10px] font-bold text-amber-700 mt-0.5 flex items-center gap-1 whitespace-nowrap">
 <CalendarCheck size={10} /> Follow-up: {lead.nextFollowUp}
 </div>
 )}
 </td>

 {/* Single Unified Action Area */}
 <td className="py-3.5 px-4 text-center whitespace-nowrap">
 {isReadOnlyAdmin ? (
 <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
 <Eye size={13} /> Monitored by Admin
 </span>
 ) : lead.hasCalled ? (
 <div className="flex items-center justify-center gap-2 whitespace-nowrap">
 <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs whitespace-nowrap" title={`Called & Verified: ${lead.telecallerNotes || lead.status}`}>
 <CheckCircle2 size={13} className="text-emerald-600" /> Done / Handed Over
 </span>
 <button
 onClick={() => openActionModal(lead, 'followup')}
 className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl transition-colors shrink-0"
 title="Reschedule Callback / Follow-up"
 >
 <CalendarCheck size={14} />
 </button>
 </div>
 ) : isApproved ? (
 <div className="flex items-center justify-center gap-2 whitespace-nowrap">
 <button
 onClick={() => openActionModal(lead, 'call_remarks')}
 className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap"
 title="Call Customer & Log Remarks"
 >
 <Phone size={13} /> Call & Log
 </button>
 <button
 onClick={() => openActionModal(lead, 'followup')}
 className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl transition-colors shrink-0"
 title="Schedule Follow-up"
 >
 <CalendarCheck size={14} />
 </button>
 </div>
 ) : (
 <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl inline-block whitespace-nowrap" title="RM approval required before calling customer">
 RM Review Pending
 </span>
 )}
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* ALL-IN-ONE POPUP MODAL: Call, Remarks & Status Update in ONE Place */}
 {selectedLead && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
 <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
 {/* Modal Header */}
 <div className="p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center">
 <div>
 <h3 className="font-bold text-base flex items-center gap-2">
 <Phone size={18} /> Customer Calling & Verification Desk
 </h3>
 <p className="text-xs text-purple-100 mt-0.5">
 {selectedLead.name} • {selectedLead.mobile} • {selectedLead.loanPurpose}
 </p>
 </div>
 <button onClick={closeModal} className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors">
 <X size={18} />
 </button>
 </div>

 {/* Modal Form */}
 <form onSubmit={handleSaveAction} className="p-6 space-y-4">
 {/* Quick Dial Bar */}
 <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex justify-between items-center">
 <div>
 <p className="text-[11px] font-bold text-emerald-800 uppercase">Customer Number</p>
 <p className="text-[16px] font-mono font-extrabold text-emerald-950">{selectedLead.mobile}</p>
 </div>
 <a
 href={`tel:${selectedLead.mobile}`}
 className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
 >
 <Phone size={14} /> Dial Customer Now
 </a>
 </div>

 {/* Call Outcome & Status */}
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-[12px] font-bold text-slate-700 mb-1">Call Outcome *</label>
 <select
 value={callOutcome}
 onChange={(e) => setCallOutcome(e.target.value)}
 className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-purple-500"
 >
 <option value="Connected">Connected & Discussed</option>
 <option value="Not Connected">Not Answering / Ringing</option>
 <option value="Busy">Busy / Waiting</option>
 <option value="Call Back Requested">Call Back Requested</option>
 <option value="Switched Off">Switched Off</option>
 </select>
 </div>

 <div>
 <label className="block text-[12px] font-bold text-slate-700 mb-1">Update Status (For RM) *</label>
 <select
 value={actionStatus}
 onChange={(e) => setActionStatus(e.target.value)}
 className="w-full px-3 py-2 bg-purple-50 border border-purple-200 rounded-xl text-xs font-bold text-purple-900 outline-none focus:bg-white focus:ring-2 focus:ring-purple-500"
 >
 <option value="Interested">Interested (Proceed to RM/Ops)</option>
 <option value="Contacted">Contacted & Discussion in Progress</option>
 <option value="Follow-up">Follow-up Needed</option>
 <option value="Documents Pending">Documents Pending</option>
 <option value="Lost">Not Interested / Lost</option>
 </select>
 </div>
 </div>

 {/* Follow-up Date */}
 <div>
 <label className="block text-[12px] font-bold text-slate-700 mb-1">Next Callback / Follow-up Date</label>
 <input
 type="date"
 value={followupDate}
 onChange={(e) => setFollowupDate(e.target.value)}
 className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-purple-500"
 />
 </div>

 {/* Calling Remarks & Notes */}
 <div>
 <label className="block text-[12px] font-bold text-slate-700 mb-1">
 Customer Calling Remarks & Notes for Reporting Manager (RM) <span className="text-rose-600">*</span>
 </label>
 <textarea
 rows={3}
 required
 placeholder="Enter detailed customer feedback (e.g. Customer confirmed required amount ₹5L, salary 45k, KYC documents ready for verification)..."
 value={actionNotes}
 onChange={(e) => setActionNotes(e.target.value)}
 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 outline-none resize-none focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all"
 />
 </div>

 {/* Modal Footer */}
 <div className="flex justify-end items-center gap-2.5 pt-2">
 <button
 type="button"
 onClick={closeModal}
 className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={isSubmitting}
 className="flex items-center gap-1.5 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50"
 >
 {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
 {isSubmitting ? "Submitting..." : "Save & Update RM"}
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
}
