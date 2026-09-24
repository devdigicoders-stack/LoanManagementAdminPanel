import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
 TrendingUp,
 Clock,
 Briefcase,
 Users,
 CheckCircle,
 AlertTriangle,
 RefreshCw,
 Search,
 Eye,
 Check,
 X,
 Send,
 PhoneCall,
 FileCheck,
 ShieldCheck,
 Building2,
 ChevronRight,
 ArrowRight,
 UserCheck,
 AlertCircle,
 MessageSquare,
 Calendar,
 User
} from 'lucide-react';
import toast from 'react-hot-toast';
import TablePagination from '../../components/TablePagination';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

export default function RMDashboard() {
 const [searchParams, setSearchParams] = useSearchParams();
 const initialTab = searchParams.get('tab') || 'pending';

 const [metrics, setMetrics] = useState({
 pendingReview: 0,
 withTelecaller: 0,
 customerConfirmed: 0,
 holdCases: 0,
 disbursed: 0,
 totalActive: 0,
 disbursedAmount: 0,
 fieldTeamCount: 0
 });
 const [loadingMetrics, setLoadingMetrics] = useState(true);

 // Active Tab: 'pending' (Field Leads waiting RM review) | 'telecaller' (With Telecaller & Remarks) | 'completed' (Ready for Ops) | 'hold' (HOLD Cases)
 const [activeTab, setActiveTab] = useState(initialTab);
 const [leads, setLeads] = useState([]);
 const [loadingLeads, setLoadingLeads] = useState(false);
 const [searchQuery, setSearchQuery] = useState('');

 // Pagination
 const [currentPage, setCurrentPage] = useState(1);
 const [pageSize, setPageSize] = useState(10);

 // Modals / Action State
 const [selectedLead, setSelectedLead] = useState(null);
 const [reviewModalOpen, setReviewModalOpen] = useState(false);
 const [reviewAction, setReviewAction] = useState('Approved'); // 'Approved' | 'Rejected'
 const [reviewRemarks, setReviewRemarks] = useState('');
 const [selectedTelecaller, setSelectedTelecaller] = useState('');
 const [telecallersList, setTelecallersList] = useState([]);
 const [actionLoading, setActionLoading] = useState(false);

 // Assign Ops Modal
 const [opsModalOpen, setOpsModalOpen] = useState(false);
 const [opsRemarks, setOpsRemarks] = useState('');

 // Telecaller Details & Remarks Modal
 const [telecallerDetailModalOpen, setTelecallerDetailModalOpen] = useState(false);

 useEffect(() => {
 const tabParam = searchParams.get('tab');
 if (tabParam && ['pending', 'telecaller', 'completed', 'hold'].includes(tabParam)) {
 setActiveTab(tabParam);
 }
 }, [searchParams]);

 const handleTabChange = (tab) => {
 setActiveTab(tab);
 setSearchParams({ tab });
 };

 const getHeaders = () => {
 const token = localStorage.getItem('token');
 return { headers: { Authorization: `Bearer ${token}` } };
 };

 // Fetch Metrics
 const fetchMetrics = useCallback(async () => {
 try {
 setLoadingMetrics(true);
 const res = await axios.get(`${API_BASE}/sales/rm-metrics`, getHeaders());
 if (res.data.success) {
 setMetrics(res.data.metrics);
 }
 } catch (err) {
 console.error('Error fetching RM metrics:', err);
 } finally {
 setLoadingMetrics(false);
 }
 }, []);

 // Fetch Leads for the current active tab
 const fetchLeads = useCallback(async (stage) => {
 try {
 setLoadingLeads(true);
 const res = await axios.get(`${API_BASE}/sales/rm-leads?stage=${stage}&limit=50`, getHeaders());
 if (res.data.success) {
 let fetchedLeads = res.data.leads || [];
 if (fetchedLeads.length === 0 && stage === 'pending') {
 // Check fallback for any active field leads
 try {
 const fallbackRes = await axios.get(`${API_BASE}/sales/rm-leads?stage=all&limit=50`, getHeaders());
 if (fallbackRes.data.success && fallbackRes.data.leads?.length > 0) {
 fetchedLeads = fallbackRes.data.leads.filter(l => 
 l.workflowStage === 'Field_Lead_Created' || 
 !l.workflowStage || 
 ['New', 'Unassigned', 'Pending', 'Application Pending', 'Draft'].includes(l.status)
 );
 }
 } catch (e) {
 console.log('RM fallback query info:', e);
 }
 }
 setLeads(fetchedLeads);
 }
 } catch (err) {
 console.error('Error fetching RM leads:', err);
 } finally {
 setLoadingLeads(false);
 }
 }, []);

 useEffect(() => {
 fetchMetrics();
 fetchLeads(activeTab);
 // Fetch available Telecallers
 const fetchTelecallers = async () => {
 try {
 const res = await axios.get(`${API_BASE}/employees?role=Telecaller`, getHeaders());
 if (res.data && Array.isArray(res.data)) {
 setTelecallersList(res.data.filter(e => (e.role || '').toLowerCase().includes('tele')));
 }
 } catch (err) {
 // Fallback default list
 setTelecallersList([
 { _id: '6ab37458aba3ce8c0eabedd8', name: 'Pooja Sharma (Telecaller 1)' },
 { _id: '6ab3952dd2a0b1be4c3dde0e', name: 'Neha Gupta (Telecaller 2)' }
 ]);
 }
 };
 fetchTelecallers();
 }, [fetchMetrics, fetchLeads, activeTab]);

 // Handle RM Review (Approve to Telecaller OR Reject)
 const handleReviewSubmit = async (e) => {
 e.preventDefault();
 if (!selectedLead) return;
 try {
 setActionLoading(true);
 const chosenTc = telecallersList.find(t => t._id === selectedTelecaller);
 const res = await axios.put(
 `${API_BASE}/sales/${selectedLead._id}/rm-review`,
 { 
 action: reviewAction, 
 remarks: reviewRemarks,
 telecallerId: selectedTelecaller || null,
 telecallerName: chosenTc ? chosenTc.name : (selectedTelecaller ? 'Assigned Telecaller' : 'Telecaller Desk')
 },
 getHeaders()
 );
 if (res.data.success) {
 alert(res.data.message || 'Lead review updated!');
 setReviewModalOpen(false);
 setSelectedLead(null);
 setReviewRemarks('');
 setSelectedTelecaller('');
 fetchMetrics();
 fetchLeads(activeTab);
 }
 } catch (err) {
 alert(err.response?.data?.message || 'Failed to submit review');
 } finally {
 setActionLoading(false);
 }
 };

 // Handle Assign to Operations
 const handleAssignToOps = async (e) => {
 e.preventDefault();
 if (!selectedLead) return;
 try {
 setActionLoading(true);
 const res = await axios.put(
 `${API_BASE}/sales/${selectedLead._id}/assign-operations`,
 { operationsRemarks: opsRemarks },
 getHeaders()
 );
 if (res.data.success) {
 alert(res.data.message || 'File successfully assigned to Operations Admin/Manager for KYC Verification!');
 setOpsModalOpen(false);
 setSelectedLead(null);
 setOpsRemarks('');
 fetchMetrics();
 fetchLeads(activeTab);
 }
 } catch (err) {
 alert(err.response?.data?.message || 'Failed to assign file to Operations');
 } finally {
 setActionLoading(false);
 }
 };

 const filteredLeads = leads.filter((item) => {
 if (!searchQuery.trim()) return true;
 const q = searchQuery.toLowerCase();
 const name = (item.name || item.customName || '').toLowerCase();
 const mob = (item.mobile || item.mobNo || '');
 const id = (item.leadId || '').toLowerCase();
 const entity = (item.entityName || '').toLowerCase();
 return name.includes(q) || mob.includes(q) || id.includes(q) || entity.includes(q);
 });

 return (
 <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
 {/* ── HEADER ── */}
 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
 <div>
 <div className="flex items-center gap-2.5">
 <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
 <ShieldCheck className="w-6 h-6" />
 </div>
 <div>
 <h1 className="text-2xl font-black text-slate-800 tracking-tight">Reporting Manager (RM) Command Desk</h1>
 <p className="text-xs md:text-sm text-slate-500 font-medium">
 Review Field Leads &bull; Telecaller Conversation & Remarks &bull; Forward File to Operations Desk
 </p>
 </div>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <button
 onClick={() => {
 fetchMetrics();
 fetchLeads(activeTab);
 }}
 className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition"
 >
 <RefreshCw className={`w-4 h-4 ${loadingMetrics ? 'animate-spin' : ''}`} />
 Refresh
 </button>
 </div>
 </div>

 {/* ── WORKFLOW KPI METRICS ── */}
 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
 {/* 1. Pending RM Review */}
 <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Field Team (RO/RE)</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{metrics.fieldTeamCount || 0}</p>
          <p className="text-[11px] font-semibold text-purple-600 mt-1">Active Field Officers</p>
        </div>
 </div>

 {/* ── WORKFLOW STAGE TABS ── */}
 <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
 <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
 {/* Tab buttons */}
 <div className="flex flex-wrap items-center gap-2">
 <button
 onClick={() => handleTabChange('pending')}
 className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
 activeTab === 'pending'
 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
 : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
 }`}
 >
 <Clock className="w-4 h-4" />
 1. Lead Review Desk (All New Leads)
 {metrics.pendingReview > 0 && (
 <span className="bg-white text-blue-700 text-xs px-2 py-0.5 rounded-full font-black">
 {metrics.pendingReview}
 </span>
 )}
 </button>

 <button
 onClick={() => handleTabChange('telecaller')}
 className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
 activeTab === 'telecaller'
 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
 : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
 }`}
 >
 <PhoneCall className="w-4 h-4" />
 2. Telecaller Conversation & Remarks
 {metrics.withTelecaller > 0 && (
 <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-black">
 {metrics.withTelecaller}
 </span>
 )}
 </button>

 <button
 onClick={() => handleTabChange('completed')}
 className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
 activeTab === 'completed'
 ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
 : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
 }`}
 >
 <FileCheck className="w-4 h-4" />
 3. Verified Leads &bull; Forward to Operations
 {metrics.customerConfirmed > 0 && (
 <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-black">
 {metrics.customerConfirmed}
 </span>
 )}
 </button>

 <button
 onClick={() => handleTabChange('hold')}
 className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
 activeTab === 'hold'
 ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
 : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
 }`}
 >
 <AlertTriangle className="w-4 h-4" />
 4. HOLD Radar
 {metrics.holdCases > 0 && (
 <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full font-black">
 {metrics.holdCases}
 </span>
 )}
 </button>
 </div>

 {/* Search box */}
 <div className="relative min-w-[240px]">
 <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search by name, phone, ID..."
 className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs md:text-sm rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
 />
 </div>
 </div>

 {/* ── LEADS TABLE ── */}
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse text-xs md:text-sm">
 <thead>
 <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
 <th className="py-3 px-4">Lead ID / Customer</th>
 <th className="py-3 px-4">Contact & Entity</th>
 <th className="py-3 px-4">Loan Requirement</th>
 {activeTab === 'telecaller' ? (
 <th className="py-3 px-4">Telecaller Conversation & Remark</th>
 ) : activeTab === 'completed' ? (
 <th className="py-3 px-4">Telecaller Confirmation Notes</th>
 ) : (
 <th className="py-3 px-4">Zone / Source</th>
 )}
 <th className="py-3 px-4">Current Stage</th>
 <th className="py-3 px-4 text-center">Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {loadingLeads ? (
 <tr>
 <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
 <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
 Loading leads data...
 </td>
 </tr>
 ) : filteredLeads.length === 0 ? (
 <tr>
 <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
 No leads found in this workflow stage.
 </td>
 </tr>
 ) : (
 filteredLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((lead) => {
 const lastFollowUp = Array.isArray(lead.followUps) && lead.followUps.length > 0
 ? lead.followUps[lead.followUps.length - 1]
 : null;

 return (
 <tr key={lead._id} className="hover:bg-slate-50/60 transition">
 {/* Customer */}
 <td className="py-3.5 px-4">
 <div className="font-bold text-slate-800">{lead.name || 'Unnamed'}</div>
 <div className="text-[11px] font-mono text-blue-600 font-bold">{lead.leadId || 'N/A'}</div>
 </td>

 {/* Contact & Entity */}
 <td className="py-3.5 px-4">
 <div className="font-semibold text-slate-700">{lead.mobile || 'N/A'}</div>
 <div className="text-[11px] text-slate-500">{lead.entityName || lead.productSubtype || 'Individual'}</div>
 </td>

 {/* Loan Requirement */}
 <td className="py-3.5 px-4">
 <div className="font-bold text-slate-800">
 ₹{Number(lead.expectedAmount || lead.loanAmount || 0).toLocaleString()}
 </div>
 <div className="text-[11px] text-slate-500">{lead.productSubtype || 'Business Loan'}</div>
 </td>

 {/* Zone / Telecaller Conversation column */}
 {activeTab === 'telecaller' ? (
 <td className="py-3.5 px-4 max-w-[320px]">
 <div className="bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-xl space-y-1">
 <div className="flex items-center justify-between text-[11px] text-indigo-900 font-bold">
 <span className="flex items-center gap-1">
 <PhoneCall className="w-3 h-3 text-indigo-600" />
 {lead.telecallerConfirmedBy || 'Assigned Telecaller'}
 </span>
 {lead.telecallerConfirmedAt && (
 <span className="text-[10px] text-indigo-500 font-normal">
 {new Date(lead.telecallerConfirmedAt).toLocaleDateString('en-IN')}
 </span>
 )}
 </div>
 <p className="text-xs text-slate-700 line-clamp-2 italic font-medium">
 "{lead.telecallerNotes || lastFollowUp?.remarks || 'Telecaller calling customer for verification...'}"
 </p>
 </div>
 </td>
 ) : activeTab === 'completed' ? (
 <td className="py-3.5 px-4 max-w-[300px]">
 <div className="bg-emerald-50/70 border border-emerald-100 p-2 rounded-xl">
 <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
 <CheckCircle className="w-3 h-3 text-emerald-600" />
 Customer Verified by Telecaller
 </div>
 <p className="text-xs text-slate-700 mt-1 italic font-medium">
 "{lead.telecallerNotes || 'Customer confirmed requirements. Documents verified.'}"
 </p>
 </div>
 </td>
 ) : (
 <td className="py-3.5 px-4">
 <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[11px] rounded-md">
 {lead.zone || 'All'}
 </span>
 <div className="text-[11px] text-slate-400 mt-0.5">{lead.source || 'Field'}</div>
 </td>
 )}

 {/* Current Stage */}
 <td className="py-3.5 px-4">
 {lead.isHoldAlertActive ? (
 <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg">
 <AlertTriangle className="w-3 h-3 text-rose-600" />
 HOLD: {lead.holdReason?.substring(0, 20) || 'Offer Held'}...
 </span>
 ) : activeTab === 'pending' ? (
 <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-lg">
 <Clock className="w-3 h-3" />
 Waiting RM Approval
 </span>
 ) : activeTab === 'telecaller' ? (
 <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-lg">
 <PhoneCall className="w-3 h-3" />
 Calling in Progress
 </span>
 ) : activeTab === 'completed' ? (
 <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg">
 <CheckCircle className="w-3 h-3" />
 Ready for Operations
 </span>
 ) : (
 <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
 {lead.workflowStage || lead.status}
 </span>
 )}
 </td>

 {/* Actions */}
 <td className="py-3.5 px-4 text-center">
 {activeTab === 'pending' && (
 <button
 onClick={() => {
 setSelectedLead(lead);
 setReviewAction('Approved');
 setReviewRemarks('');
 setReviewModalOpen(true);
 }}
 className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
 >
 <CheckCircle className="w-3.5 h-3.5" />
 Review & Forward to Telecaller
 </button>
 )}

 {activeTab === 'telecaller' && (
 <div className="flex items-center justify-center gap-2">
 <button
 onClick={() => {
 setSelectedLead(lead);
 setTelecallerDetailModalOpen(true);
 }}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition"
 >
 <MessageSquare className="w-3.5 h-3.5" />
 View Remarks
 </button>
 <button
 onClick={() => {
 setSelectedLead(lead);
 setOpsRemarks(lead.telecallerNotes ? `[Telecaller Remark]: ${lead.telecallerNotes}` : '');
 setOpsModalOpen(true);
 }}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
 >
 <Send className="w-3.5 h-3.5" />
 Forward to Ops
 </button>
 </div>
 )}

 {activeTab === 'completed' && (
 <button
 onClick={() => {
 setSelectedLead(lead);
 setOpsRemarks(lead.telecallerNotes ? `[Telecaller Remark]: ${lead.telecallerNotes}` : '');
 setOpsModalOpen(true);
 }}
 className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
 >
 <Send className="w-3.5 h-3.5" />
 Forward to Operation Manager
 </button>
 )}

 {activeTab === 'hold' && (
 <div className="flex items-center justify-center gap-2">
 <span className="text-xs text-rose-600 font-bold">Escalated to RM & Field</span>
 </div>
 )}
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>

 {/* Table Pagination */}
 <TablePagination
   currentPage={currentPage}
   totalItems={filteredLeads.length}
   pageSize={pageSize}
   onPageChange={(page) => setCurrentPage(page)}
   onPageSizeChange={(size) => setPageSize(size)}
 />

 </div>

 {/* ── MODAL 1: RM REVIEW & APPROVAL (Forward to Telecaller) ── */}
 {reviewModalOpen && selectedLead && (
 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
 <div className="flex items-center justify-between pb-3 border-b border-slate-100">
 <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
 <ShieldCheck className="w-5 h-5 text-blue-600" />
 RM Lead Review & Forward Desk
 </h3>
 <button
 onClick={() => setReviewModalOpen(false)}
 className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
 <div className="p-3.5 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
 <p>
 <strong className="text-slate-800">Customer:</strong> {selectedLead.name} ({selectedLead.mobile})
 </p>
 <p>
 <strong className="text-slate-800">Requirement:</strong> ₹{Number(selectedLead.expectedAmount || 0).toLocaleString()} &bull; {selectedLead.productSubtype || 'Loan'}
 </p>
 <p>
 <strong className="text-slate-800">Entity:</strong> {selectedLead.entityName || 'Individual'} &bull; Zone: {selectedLead.zone || 'All'}
 </p>
 </div>

 <div>
 <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Review Decision</label>
 <div className="grid grid-cols-2 gap-3">
 <button
 type="button"
 onClick={() => setReviewAction('Approved')}
 className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
 reviewAction === 'Approved'
 ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20'
 : 'border-slate-200 text-slate-600 hover:bg-slate-50'
 }`}
 >
 <CheckCircle className="w-4 h-4 text-emerald-600" />
 Approve & Forward to Telecaller
 </button>

 <button
 type="button"
 onClick={() => setReviewAction('Rejected')}
 className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
 reviewAction === 'Rejected'
 ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20'
 : 'border-slate-200 text-slate-600 hover:bg-slate-50'
 }`}
 >
 <X className="w-4 h-4 text-rose-600" />
 Reject Lead
 </button>
 </div>
 </div>

 {reviewAction === 'Approved' && (
 <div>
 <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
 Choose & Assign Telecaller <span className="text-emerald-600 font-normal">(Optional / Auto)</span>
 </label>
 <select
 value={selectedTelecaller}
 onChange={(e) => setSelectedTelecaller(e.target.value)}
 className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
 >
 <option value="">-- Auto Assign to Telecaller Calling Desk --</option>
 {telecallersList.map(tc => (
 <option key={tc._id} value={tc._id}>
 {tc.name} {tc.empId ? `(${tc.empId})` : ''}
 </option>
 ))}
 </select>
 </div>
 )}

 <div>
 <label className="block text-xs font-bold text-slate-700 uppercase mb-1">RM Review Remarks / Notes *</label>
 <textarea
 rows="3"
 required
 value={reviewRemarks}
 onChange={(e) => setReviewRemarks(e.target.value)}
 placeholder="Add verification notes or instructions for Telecaller..."
 className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
 ></textarea>
 </div>

 <div className="flex items-center justify-end gap-3 pt-2">
 <button
 type="button"
 onClick={() => setReviewModalOpen(false)}
 className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition"
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={actionLoading}
 className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-blue-500/20 flex items-center gap-2"
 >
 {actionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
 {reviewAction === 'Approved' ? 'Forward to Telecaller' : 'Reject Lead'}
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 {/* ── MODAL 2: VIEW TELECALLER REMARKS & CALL HISTORY ── */}
 {telecallerDetailModalOpen && selectedLead && (
 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
 <div className="flex items-center justify-between pb-3 border-b border-slate-100">
 <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
 <PhoneCall className="w-5 h-5 text-indigo-600" />
 Telecaller Conversation & Remarks History
 </h3>
 <button
 onClick={() => setTelecallerDetailModalOpen(false)}
 className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <div className="mt-4 space-y-4">
 <div className="p-3.5 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
 <p><strong className="text-slate-800">Customer:</strong> {selectedLead.name} ({selectedLead.mobile})</p>
 <p><strong className="text-slate-800">Requirement:</strong> ₹{Number(selectedLead.expectedAmount || 0).toLocaleString()} &bull; {selectedLead.productSubtype || 'Loan'}</p>
 <p><strong className="text-slate-800">RM Approval Status:</strong> {selectedLead.rmReviewAction || 'Approved'} {selectedLead.rmReviewRemarks && `("${selectedLead.rmReviewRemarks}")`}</p>
 </div>

 {/* Telecaller Main Notes */}
 <div>
 <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Telecaller Verification Remark</label>
 <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-slate-800 font-medium">
 {selectedLead.telecallerNotes || 'No verification note entered yet.'}
 {selectedLead.telecallerConfirmedBy && (
 <div className="text-[11px] text-indigo-600 font-bold mt-1">
 Logged by: {selectedLead.telecallerConfirmedBy} &bull; {selectedLead.telecallerConfirmedAt ? new Date(selectedLead.telecallerConfirmedAt).toLocaleString('en-IN') : ''}
 </div>
 )}
 </div>
 </div>

 {/* Follow-up / Call Logs */}
 {Array.isArray(selectedLead.followUps) && selectedLead.followUps.length > 0 && (
 <div>
 <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Follow-up Call Timeline</label>
 <div className="space-y-2 max-h-48 overflow-y-auto">
 {selectedLead.followUps.map((f, i) => (
 <div key={i} className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 space-y-1">
 <div className="flex items-center justify-between font-bold text-slate-800 text-[11px]">
 <span>Call #{i + 1} - {f.status || 'Contacted'}</span>
 <span className="text-slate-400 font-normal">{f.date ? new Date(f.date).toLocaleDateString('en-IN') : ''}</span>
 </div>
 <p className="text-slate-600 italic">"{f.remarks || 'No notes'}"</p>
 </div>
 ))}
 </div>
 </div>
 )}

 <div className="flex items-center justify-end gap-3 pt-2">
 <button
 type="button"
 onClick={() => setTelecallerDetailModalOpen(false)}
 className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition"
 >
 Close
 </button>
 <button
 type="button"
 onClick={() => {
 setTelecallerDetailModalOpen(false);
 setOpsRemarks(selectedLead.telecallerNotes ? `[Telecaller Remark]: ${selectedLead.telecallerNotes}` : '');
 setOpsModalOpen(true);
 }}
 className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-emerald-500/20 flex items-center gap-2"
 >
 <Send className="w-3.5 h-3.5" />
 Forward File to Operations
 </button>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* ── MODAL 3: FORWARD FILE TO OPERATIONS MANAGER ── */}
 {opsModalOpen && selectedLead && (
 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
 <div className="flex items-center justify-between pb-3 border-b border-slate-100">
 <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
 <FileCheck className="w-5 h-5 text-emerald-600" />
 Forward File to Operations Desk
 </h3>
 <button
 onClick={() => setOpsModalOpen(false)}
 className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <form onSubmit={handleAssignToOps} className="mt-4 space-y-4">
 <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1 text-xs text-slate-600">
 <p>
 <strong className="text-slate-800">Customer:</strong> {selectedLead.name} ({selectedLead.mobile})
 </p>
 <p>
 <strong className="text-slate-800">Confirmed Amount:</strong> ₹{Number(selectedLead.expectedAmount || 0).toLocaleString()}
 </p>
 {selectedLead.telecallerNotes && (
 <p className="text-emerald-800 font-medium">
 <strong>Telecaller Remark:</strong> "{selectedLead.telecallerNotes}"
 </p>
 )}
 <p className="text-emerald-700 font-semibold pt-1">
 File will be forwarded to Operations Admin/Manager for KYC verification and Sales Head approval.
 </p>
 </div>

 <div>
 <label className="block text-xs font-bold text-slate-700 uppercase mb-1">RM Handover Remarks for Operations</label>
 <textarea
 rows="3"
 value={opsRemarks}
 onChange={(e) => setOpsRemarks(e.target.value)}
 placeholder="Special instructions for Operations KYC verification..."
 className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
 ></textarea>
 </div>

 <div className="flex items-center justify-end gap-3 pt-2">
 <button
 type="button"
 onClick={() => setOpsModalOpen(false)}
 className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition"
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={actionLoading}
 className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-emerald-500/20 flex items-center gap-2"
 >
 {actionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
 Forward to Operations Manager
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
}
