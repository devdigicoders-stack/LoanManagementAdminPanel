import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
 PhoneCall,
 Send,
 RefreshCw,
 Search,
 MessageSquare,
 FileCheck,
 CheckCircle,
 X,
 Clock,
 User,
 AlertCircle,
 Eye,
 CreditCard,
 MapPin,
 Building,
 Phone,
 Mail
} from 'lucide-react';
import toast from 'react-hot-toast';
import TablePagination from '../../components/TablePagination';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

export default function RMTelecallerDesk() {
 const [leads, setLeads] = useState([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [filterZone, setFilterZone] = useState('ALL');

 // Pagination
 const [currentPage, setCurrentPage] = useState(1);
 const [pageSize, setPageSize] = useState(10);

 // Selected Lead & Modals
 const [selectedLead, setSelectedLead] = useState(null);
 const [detailModalOpen, setDetailModalOpen] = useState(false);
 const [remarksModalOpen, setRemarksModalOpen] = useState(false);
 const [opsModalOpen, setOpsModalOpen] = useState(false);
 const [opsRemarks, setOpsRemarks] = useState('');
 const [submitting, setSubmitting] = useState(false);

 const getHeaders = () => {
 const token = localStorage.getItem('token');
 return { headers: { Authorization: `Bearer ${token}` } };
 };

 const fetchTelecallerLeads = useCallback(async () => {
 try {
 setLoading(true);
 const url = filterZone !== 'ALL'
 ? `${API_BASE}/sales/rm-leads?stage=telecaller&zone=${filterZone}&limit=100`
 : `${API_BASE}/sales/rm-leads?stage=telecaller&limit=100`;
 const res = await axios.get(url, getHeaders());
 if (res.data.success) {
 setLeads(res.data.leads || []);
 }
 } catch (err) {
 console.error(err);
 toast.error('Failed to load telecaller activity leads');
 } finally {
 setLoading(false);
 }
 }, [filterZone]);

 useEffect(() => {
 fetchTelecallerLeads();
 }, [fetchTelecallerLeads]);

 const handleForwardToOps = async (e) => {
 e.preventDefault();
 if (!selectedLead) return;
 try {
 setSubmitting(true);
 const res = await axios.put(
 `${API_BASE}/sales/${selectedLead._id}/assign-operations`,
 { operationsRemarks: opsRemarks },
 getHeaders()
 );
 if (res.data.success) {
 toast.success('File forwarded to Operations Manager for KYC Verification!');
 setOpsModalOpen(false);
 setSelectedLead(null);
 setOpsRemarks('');
 fetchTelecallerLeads();
 }
 } catch (err) {
 toast.error(err.response?.data?.message || 'Failed to forward file to Operations');
 } finally {
 setSubmitting(false);
 }
 };

 const filteredLeads = leads.filter((l) => {
 const q = search.toLowerCase();
 return (
 (l.name && l.name.toLowerCase().includes(q)) ||
 (l.mobile && l.mobile.includes(q)) ||
 (l.leadId && l.leadId.toLowerCase().includes(q)) ||
 (l.entityName && l.entityName.toLowerCase().includes(q)) ||
 (l.city && l.city.toLowerCase().includes(q)) ||
 (l.panNumber && l.panNumber.toLowerCase().includes(q))
 );
 });

 return (
 <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
 {/* ── HEADER ── */}
 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
 <div className="flex items-center gap-3">
 <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
 <PhoneCall className="w-7 h-7" />
 </div>
 <div>
 <h1 className="text-2xl font-black text-slate-800 tracking-tight">Telecaller Coordination Desk</h1>
 <p className="text-xs md:text-sm text-slate-500 font-medium">
 Zone-wise telecaller updates, remarks & customer verification &bull; Forward verified files to Operations Manager
 </p>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <button
 onClick={fetchTelecallerLeads}
 className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs md:text-sm transition"
 >
 <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
 Refresh
 </button>
 </div>
 </div>

 {/* ── METRICS SUMMARY ── */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 <div className="bg-white p-5 rounded-2xl border border-indigo-200/80 shadow-sm">
 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">With Telecaller Team ({filterZone})</p>
 <div className="flex items-center justify-between mt-2">
 <p className="text-3xl font-black text-indigo-600">{filteredLeads.length}</p>
 <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 flex items-center gap-1">
 <PhoneCall className="w-3.5 h-3.5" /> Calling Active
 </span>
 </div>
 </div>

 <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Zonal Coverage</p>
 <p className="text-base font-black text-slate-800 mt-2">{filterZone === 'ALL' ? 'All Active Zones' : `${filterZone} Zone`}</p>
 <p className="text-xs text-slate-500 mt-0.5">Filter customer files by assigned territory</p>
 </div>

 <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">RM Next Step</p>
 <p className="text-base font-black text-emerald-600 mt-2 flex items-center gap-1.5">
 <FileCheck className="w-4 h-4" /> Operations KYC Desk
 </p>
 <p className="text-xs text-slate-500 mt-0.5">RM reviews telecaller notes & forwards to Ops</p>
 </div>
 </div>

 {/* ── TABLE CARD ── */}
 <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
 <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="flex items-center gap-3 flex-1">
 <div className="relative flex-1 max-w-md">
 <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
 <input
 type="text"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Search customer, phone, lead ID, PAN, city..."
 className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs md:text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
 />
 </div>

 {/* Zone Selector */}
 <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
 <span className="text-xs font-bold text-slate-500 pl-1">Zone:</span>
 <select
 value={filterZone}
 onChange={(e) => setFilterZone(e.target.value)}
 className="bg-transparent text-slate-800 text-xs md:text-sm font-bold focus:outline-none cursor-pointer py-1.5 pr-2"
 >
 <option value="ALL">All Zones</option>
 <option value="NORTH">NORTH Zone</option>
 <option value="SOUTH">SOUTH Zone</option>
 <option value="EAST">EAST Zone</option>
 <option value="WEST">WEST Zone</option>
 <option value="CENTRAL">CENTRAL Zone</option>
 </select>
 </div>
 </div>

 <div className="text-xs font-bold text-slate-500">
 Showing <span className="text-indigo-600 font-black">{filteredLeads.length}</span> leads in progress
 </div>
 </div>

 {/* ── LEADS TABLE ── */}
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse text-xs md:text-sm">
 <thead>
 <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
 <th className="py-3.5 px-5">Lead ID & Customer</th>
 <th className="py-3.5 px-4">Contact Info</th>
 <th className="py-3.5 px-4">Requirement</th>
 <th className="py-3.5 px-4">Zone & Source</th>
 <th className="py-3.5 px-4">Telecaller Remarks & Status</th>
 <th className="py-3.5 px-5 text-center">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {loading ? (
 <tr>
 <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
 <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
 Loading telecaller progress...
 </td>
 </tr>
 ) : filteredLeads.length === 0 ? (
 <tr>
 <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
 <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500/70" />
 No active leads in telecaller queue for {filterZone === 'ALL' ? 'any zone' : `${filterZone} zone`}.
 </td>
 </tr>
 ) : (
 filteredLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((lead) => {
 const lastFollowUp = Array.isArray(lead.followUps) && lead.followUps.length > 0
 ? lead.followUps[lead.followUps.length - 1]
 : null;

 return (
 <tr key={lead._id} className="hover:bg-slate-50/70 transition">
 <td className="py-4 px-5">
 <div className="font-bold text-slate-800">{lead.name || 'Unnamed'}</div>
 <div className="text-[11px] font-mono text-indigo-600 font-bold">{lead.leadId || 'N/A'}</div>
 {lead.panNumber && (
 <div className="text-[10px] text-slate-400 font-mono">PAN: {lead.panNumber}</div>
 )}
 </td>
 <td className="py-4 px-4">
 <div className="font-semibold text-slate-700">{lead.mobile || 'N/A'}</div>
 <div className="text-[11px] text-slate-500">{lead.entityName || 'Individual'}</div>
 <div className="text-[10px] text-slate-400 flex items-center gap-0.5">
 <MapPin className="w-3 h-3 text-slate-400" />
 {lead.city ? `${lead.city}, ${lead.state || ''}` : lead.zone || 'NORTH'}
 </div>
 </td>
 <td className="py-4 px-4">
 <div className="font-extrabold text-slate-800">
 ₹{Number(lead.expectedAmount || lead.loanAmount || 0).toLocaleString()}
 </div>
 <div className="text-[11px] text-slate-500">{lead.productSubtype || 'Business Loan'}</div>
 </td>
 <td className="py-4 px-4">
 <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold text-[11px] rounded-md border border-blue-100">
 {lead.zone || 'NORTH'}
 </span>
 <div className="text-[11px] text-slate-400 mt-0.5">{lead.source || 'Field'}</div>
 </td>
 <td className="py-4 px-4 max-w-[320px]">
 <div className="bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-xl space-y-1">
 <div className="flex items-center justify-between text-[11px] text-indigo-900 font-bold">
 <span className="flex items-center gap-1">
 <PhoneCall className="w-3 h-3 text-indigo-600" />
 {lead.telecallerConfirmedBy || 'Telecaller Calling'}
 </span>
 <span className="text-[10px] text-indigo-500 font-normal">
 {lead.telecallerConfirmedAt ? new Date(lead.telecallerConfirmedAt).toLocaleDateString('en-IN') : 'In-progress'}
 </span>
 </div>
 <p className="text-xs text-slate-700 italic font-medium line-clamp-2">
 "{lead.telecallerNotes || lastFollowUp?.remarks || 'Telecaller calling customer for verification...'}"
 </p>
 </div>
 </td>
 <td className="py-4 px-5 text-center">
 <div className="flex items-center justify-center gap-1.5 flex-wrap">
 <button
 onClick={() => {
 setSelectedLead(lead);
 setDetailModalOpen(true);
 }}
 className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
 title="View Full Customer Details"
 >
 <Eye className="w-3.5 h-3.5" />
 Details
 </button>
 <button
 onClick={() => {
 setSelectedLead(lead);
 setRemarksModalOpen(true);
 }}
 className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition"
 title="View Telecaller Conversation"
 >
 <MessageSquare className="w-3.5 h-3.5" />
 Remarks
 </button>
 <button
 onClick={() => {
 setSelectedLead(lead);
 setOpsRemarks(lead.telecallerNotes ? `[Telecaller Remark]: ${lead.telecallerNotes}` : '');
 setOpsModalOpen(true);
 }}
 className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
 title="Forward to Operations"
 >
 <Send className="w-3.5 h-3.5" />
 Forward to Ops
 </button>
 </div>
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

 {/* ── MODAL 1: FULL CUSTOMER DETAILS MODAL ── */}
 {detailModalOpen && selectedLead && (
 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
 <div className="flex items-center justify-between pb-4 border-b border-slate-100">
 <div className="flex items-center gap-2.5">
 <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
 <User className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-lg font-black text-slate-800">{selectedLead.name}</h3>
 <p className="text-xs text-indigo-600 font-mono font-bold">ID: {selectedLead.leadId || 'N/A'}</p>
 </div>
 </div>
 <button
 onClick={() => setDetailModalOpen(false)}
 className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <div className="mt-5 space-y-5">
 {/* Section 1: Loan & Financial Details */}
 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
 <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
 <CreditCard className="w-4 h-4 text-indigo-600" /> Loan & Financial Request
 </h4>
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
 <div>
 <span className="text-slate-400 block font-medium">Expected Amount</span>
 <span className="font-extrabold text-slate-800 text-sm">
 ₹{Number(selectedLead.expectedAmount || selectedLead.loanAmount || 0).toLocaleString()}
 </span>
 </div>
 <div>
 <span className="text-slate-400 block font-medium">Product Type</span>
 <span className="font-bold text-slate-800">{selectedLead.productSubtype || 'Loan'}</span>
 </div>
 <div>
 <span className="text-slate-400 block font-medium">Category</span>
 <span className="font-bold text-slate-800">{selectedLead.productCategory || 'Unsecured'}</span>
 </div>
 <div>
 <span className="text-slate-400 block font-medium">Program Type</span>
 <span className="font-bold text-slate-800">{selectedLead.programType || 'FRESH'}</span>
 </div>
 <div>
 <span className="text-slate-400 block font-medium">Facility Type</span>
 <span className="font-bold text-slate-800">{selectedLead.facilityType || 'Term Loan'}</span>
 </div>
 <div>
 <span className="text-slate-400 block font-medium">Constitution</span>
 <span className="font-bold text-slate-800">{selectedLead.constitutionType || 'Individual'}</span>
 </div>
 </div>
 </div>

 {/* Section 2: Contact & Identity Info */}
 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
 <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
 <User className="w-4 h-4 text-indigo-600" /> Customer Information
 </h4>
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
 <div>
 <span className="text-slate-400 block font-medium">Primary Mobile</span>
 <span className="font-bold text-slate-800">{selectedLead.mobile || 'N/A'}</span>
 </div>
 <div>
 <span className="text-slate-400 block font-medium">Alt Mobile</span>
 <span className="font-bold text-slate-800">{selectedLead.altMobile || 'N/A'}</span>
 </div>
 <div>
 <span className="text-slate-400 block font-medium">Email</span>
 <span className="font-bold text-slate-800">{selectedLead.email || 'N/A'}</span>
 </div>
 <div>
 <span className="text-slate-400 block font-medium">PAN Number</span>
 <span className="font-mono font-bold text-slate-800">{selectedLead.panNumber || 'N/A'}</span>
 </div>
 <div>
 <span className="text-slate-400 block font-medium">Entity Name</span>
 <span className="font-bold text-slate-800">{selectedLead.entityName || 'N/A'}</span>
 </div>
 <div>
 <span className="text-slate-400 block font-medium">Source / Branch</span>
 <span className="font-bold text-slate-800">{selectedLead.source || 'Field'} ({selectedLead.branch || 'Main'})</span>
 </div>
 </div>
 </div>

 {/* Section 3: Territory & Zonal Details */}
 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
 <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
 <MapPin className="w-4 h-4 text-indigo-600" /> Location & Zone Hierarchy
 </h4>
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
 <div>
 <span className="text-slate-400 block font-medium">Assigned Zone</span>
 <span className="font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded inline-block">
 {selectedLead.zone || 'NORTH'}
 </span>
 </div>
 <div>
 <span className="text-slate-400 block font-medium">City / District</span>
 <span className="font-bold text-slate-800">{selectedLead.city || 'N/A'}</span>
 </div>
 <div>
 <span className="text-slate-400 block font-medium">State / Pincode</span>
 <span className="font-bold text-slate-800">{selectedLead.state || ''} {selectedLead.pincode || ''}</span>
 </div>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
 <button
 type="button"
 onClick={() => setDetailModalOpen(false)}
 className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition"
 >
 Close
 </button>
 <button
 type="button"
 onClick={() => {
 setDetailModalOpen(false);
 setRemarksModalOpen(true);
 }}
 className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition flex items-center gap-1.5"
 >
 <MessageSquare className="w-4 h-4" />
 View Telecaller Notes
 </button>
 <button
 type="button"
 onClick={() => {
 setDetailModalOpen(false);
 setOpsRemarks(selectedLead.telecallerNotes ? `[Telecaller Remark]: ${selectedLead.telecallerNotes}` : '');
 setOpsModalOpen(true);
 }}
 className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-emerald-500/20 flex items-center gap-2"
 >
 <Send className="w-4 h-4" />
 Forward to Operations
 </button>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* ── MODAL 2: VIEW TELECALLER REMARKS & CALL LOGS ── */}
 {remarksModalOpen && selectedLead && (
 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
 <div className="flex items-center justify-between pb-3 border-b border-slate-100">
 <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
 <PhoneCall className="w-5 h-5 text-indigo-600" />
 Telecaller Conversation & Remarks
 </h3>
 <button
 onClick={() => setRemarksModalOpen(false)}
 className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <div className="mt-4 space-y-4">
 <div className="p-3.5 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600 border border-slate-100">
 <p><strong className="text-slate-800">Customer:</strong> {selectedLead.name} ({selectedLead.mobile})</p>
 <p><strong className="text-slate-800">Requirement:</strong> ₹{Number(selectedLead.expectedAmount || 0).toLocaleString()} &bull; {selectedLead.productSubtype || 'Loan'}</p>
 <p><strong className="text-slate-800">RM Approval Status:</strong> {selectedLead.rmReviewAction || 'Approved'} {selectedLead.rmReviewRemarks && `("${selectedLead.rmReviewRemarks}")`}</p>
 </div>

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

 {Array.isArray(selectedLead.followUps) && selectedLead.followUps.length > 0 && (
 <div>
 <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Follow-up Call Timeline</label>
 <div className="space-y-2 max-h-48 overflow-y-auto">
 {selectedLead.followUps.map((f, i) => (
 <div key={i} className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 space-y-1">
 <div className="flex items-center justify-between font-bold text-slate-800 text-[11px]">
 <span>Call #{i + 1} - {f.status || 'Contacted'}</span>
 <span className="text-slate-400 font-normal">{f.scheduledAt ? new Date(f.scheduledAt).toLocaleDateString('en-IN') : ''}</span>
 </div>
 <p className="text-slate-600 italic">"{f.remarks || f.notes || 'No notes'}"</p>
 </div>
 ))}
 </div>
 </div>
 )}

 <div className="flex items-center justify-end gap-3 pt-2">
 <button
 type="button"
 onClick={() => setRemarksModalOpen(false)}
 className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition"
 >
 Close
 </button>
 <button
 type="button"
 onClick={() => {
 setRemarksModalOpen(false);
 setOpsRemarks(selectedLead.telecallerNotes ? `[Telecaller Remark]: ${selectedLead.telecallerNotes}` : '');
 setOpsModalOpen(true);
 }}
 className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-emerald-500/20 flex items-center gap-2"
 >
 <Send className="w-3.5 h-3.5" />
 Forward to Operations
 </button>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* ── MODAL: FORWARD TO OPERATIONS ── */}
 {opsModalOpen && selectedLead && (
 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
 <div className="flex items-center justify-between pb-3 border-b border-slate-100">
 <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
 <FileCheck className="w-5 h-5 text-emerald-600" />
 Forward File to Operations Manager
 </h3>
 <button
 onClick={() => setOpsModalOpen(false)}
 className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <form onSubmit={handleForwardToOps} className="mt-4 space-y-4">
 <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1 text-xs text-slate-600">
 <p><strong className="text-slate-800">Customer:</strong> {selectedLead.name} ({selectedLead.mobile})</p>
 <p><strong className="text-slate-800">Confirmed Amount:</strong> ₹{Number(selectedLead.expectedAmount || 0).toLocaleString()}</p>
 {selectedLead.telecallerNotes && (
 <p className="text-emerald-800 font-medium">
 <strong>Telecaller Note:</strong> "{selectedLead.telecallerNotes}"
 </p>
 )}
 <p className="text-emerald-700 font-semibold pt-1">
 File will be assigned to Operations Admin/Manager for KYC verification and Sales Head approval.
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
 disabled={submitting}
 className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-emerald-500/20 flex items-center gap-2"
 >
 {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
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
