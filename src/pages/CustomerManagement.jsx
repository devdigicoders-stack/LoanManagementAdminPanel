import React, { useState, useMemo, useEffect } from "react";
import Swal from "sweetalert2";
import {
 ChevronRight,
 Users,
 UserCheck,
 UserMinus,
 ShieldAlert,
 ShieldCheck,
 UserX,
 Filter,
 Download,
 Mail,
 Phone,
 Calendar,
 MapPin,
 User,
 FileText,
 Briefcase,
 Eye,
 Ban,
 Unlock,
 Clock,
 Search,
 Trash2,
 Building2,
 CheckCircle2,
 UserPlus,
 ArrowRightLeft,
 X,
 Info
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CustomerManagement() {
 const navigate = useNavigate();
 const [customers, setCustomers] = useState([]);
 const [fieldAgents, setFieldAgents] = useState([]);
 const [isLoading, setIsLoading] = useState(true);

 // Assign Modal state
 const [selectedCustomerForAssign, setSelectedCustomerForAssign] = useState(null);
 const [selectedAgentId, setSelectedAgentId] = useState("");
 const [isAssigning, setIsAssigning] = useState(false);

 // Fetch Customers & Field Agents
 const fetchCustomers = async () => {
 setIsLoading(true);
 try {
 const token = localStorage.getItem('token');
 const [custRes, staffRes] = await Promise.all([
 fetch(`${import.meta.env.VITE_API_BASE_URL}/users?type=customer`, {
 headers: { 'Authorization': `Bearer ${token}` }
 }),
 fetch(`${import.meta.env.VITE_API_BASE_URL}/users?type=staff`, {
 headers: { 'Authorization': `Bearer ${token}` }
 })
 ]);

 if (custRes.ok) {
 const data = await custRes.json();
 const list = Array.isArray(data) ? data : (data.users || []);
 setCustomers(list.map(c => ({ ...c, id: c.userId || c._id })));
 }

 if (staffRes.ok) {
 const staffData = await staffRes.json();
 const staffList = Array.isArray(staffData) ? staffData : (staffData.users || []);
 setFieldAgents(staffList);
 }
 } catch (error) {
 console.error("Error fetching customers:", error);
 } finally {
 setIsLoading(false);
 }
 };

 useEffect(() => {
 fetchCustomers();
 }, []);

 // Filters state
 const [searchTerm, setSearchTerm] = useState("");
 const [statusFilter, setStatusFilter] = useState("All Status");
 const [kycFilter, setKycFilter] = useState("All KYC Status");
 const [assignmentFilter, setAssignmentFilter] = useState("All");
 const [selectedListTab, setSelectedListTab] = useState("All Customers");

 // Pagination
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 8;

 // Filter Logic
 const filteredCustomers = useMemo(() => {
 return customers.filter(cust => {
 const name = cust.name || '';
 const email = cust.email || '';
 const id = cust.userId || cust.id || '';
 const phone = cust.phone || '';
 const agent = cust.assignedTo || '';

 const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 email.toLowerCase().includes(searchTerm.toLowerCase()) ||
 id.toLowerCase().includes(searchTerm.toLowerCase()) ||
 phone.includes(searchTerm) ||
 agent.toLowerCase().includes(searchTerm.toLowerCase());

 const matchesStatus = statusFilter === 'All Status' || cust.status === statusFilter;
 const matchesKyc = kycFilter === 'All KYC Status' || cust.kycStatus === kycFilter;
 
 const isAssigned = !!cust.assignedTo;
 const matchesAssignment = assignmentFilter === 'All' ||
 (assignmentFilter === 'Assigned' && isAssigned) ||
 (assignmentFilter === 'Unassigned' && !isAssigned);

 const matchesTab = selectedListTab === "All Customers" ||
 (selectedListTab === "Assigned" && isAssigned) ||
 (selectedListTab === "Unassigned" && !isAssigned) ||
 (selectedListTab === "KYC Verified" && cust.kycStatus === "Verified") ||
 (selectedListTab === "KYC Pending" && cust.kycStatus === "Pending") ||
 (selectedListTab === "Blocked" && cust.status === "Blocked");

 return matchesSearch && matchesStatus && matchesKyc && matchesAssignment && matchesTab;
 });
 }, [customers, searchTerm, statusFilter, kycFilter, assignmentFilter, selectedListTab]);

 // Pagination Logic
 const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
 const currentItems = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

 // Dynamic KPIs
 const totalCount = customers.length;
 const verifiedCount = customers.filter(c => c.kycStatus === 'Verified').length;
 const pendingKycCount = customers.filter(c => c.kycStatus === 'Pending').length;
 const assignedCount = customers.filter(c => !!c.assignedTo).length;
 const unassignedCount = customers.filter(c => !c.assignedTo).length;
 const blockedCount = customers.filter(c => c.status === 'Blocked').length;

 const dynamicTopKpis = [
 { label: "Total Customers", value: totalCount, icon: Users, color: "text-[#489b0d]", bg: "bg-[#489b0d]/10" },
 { label: "KYC Verified", value: verifiedCount, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
 { label: "KYC Pending", value: pendingKycCount, icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50" },
 { label: "Assigned to Agents", value: assignedCount, icon: UserCheck, color: "text-blue-600", bg: "bg-blue-50" },
 { label: "Unassigned", value: unassignedCount, icon: UserMinus, color: "text-purple-600", bg: "bg-purple-50" },
 { label: "Blocked Accounts", value: blockedCount, icon: UserX, color: "text-red-500", bg: "bg-red-50" },
 ];

 const handleToggleBlock = async (e, id, currentStatus) => {
 e.stopPropagation();
 const newStatus = currentStatus === "Blocked" ? "Active" : "Blocked";
 const confirmMsg = currentStatus === "Blocked" ? "Are you sure you want to unblock this customer?" : "Are you sure you want to block this customer?";
 Swal.fire({
 title: 'Confirmation',
 text: confirmMsg,
 icon: 'question',
 showCancelButton: true,
 confirmButtonColor: '#489b0d',
 cancelButtonColor: '#d33',
 confirmButtonText: 'Yes, proceed!'
 }).then(async (result) => {
 if (result.isConfirmed) {
 try {
 const token = localStorage.getItem('token');
 const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}/status`, {
 method: 'PUT',
 headers: {
 'Content-Type': 'application/json',
 'Authorization': `Bearer ${token}`
 },
 body: JSON.stringify({ status: newStatus })
 });
 const data = await response.json();
 if (response.ok) {
 setCustomers(prev => prev.map(c => (c.id === id || c._id === id || c.userId === id) ? { ...c, status: newStatus } : c));
 Swal.fire('Updated!', data.message || `Customer status updated to ${newStatus}.`, 'success');
 } else {
 Swal.fire('Error!', data.message || 'Failed to update status.', 'error');
 }
 } catch (error) {
 Swal.fire('Error!', error.message || 'An error occurred.', 'error');
 }
 }
 });
 };

 const handleOpenAssignModal = (e, customer) => {
 e.stopPropagation();
 setSelectedCustomerForAssign(customer);
 setSelectedAgentId(customer.assignedToId || "");
 };

 const handleSaveAssignment = async () => {
 if (!selectedCustomerForAssign) return;
 const selectedAgent = fieldAgents.find(a => (a._id === selectedAgentId || a.id === selectedAgentId));
 
 setIsAssigning(true);
 try {
 const token = localStorage.getItem('token');
 const custId = selectedCustomerForAssign.userId || selectedCustomerForAssign._id || selectedCustomerForAssign.id;
 const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${custId}/assign`, {
 method: 'PUT',
 headers: {
 'Content-Type': 'application/json',
 'Authorization': `Bearer ${token}`
 },
 body: JSON.stringify({
 assignedTo: selectedAgent ? `${selectedAgent.name} (${selectedAgent.role || selectedAgent.designation})` : null,
 assignedToId: selectedAgent ? (selectedAgent._id || selectedAgent.id) : null
 })
 });

 const data = await res.json();
 if (res.ok) {
 toast.success(`Customer assigned to ${selectedAgent ? selectedAgent.name : 'Unassigned'} successfully!`);
 setCustomers(prev => prev.map(c => {
 if (c.id === custId || c._id === custId || c.userId === custId) {
 return {
 ...c,
 assignedTo: selectedAgent ? `${selectedAgent.name} (${selectedAgent.role || selectedAgent.designation})` : null,
 assignedToId: selectedAgent ? (selectedAgent._id || selectedAgent.id) : null
 };
 }
 return c;
 }));
 setSelectedCustomerForAssign(null);
 } else {
 toast.error(data.message || 'Failed to assign customer');
 }
 } catch (err) {
 toast.error('Network error during assignment');
 } finally {
 setIsAssigning(false);
 }
 };

 // Render Dynamic Avatar Helper (NO dummy unsplash image!)
 const renderAvatar = (user) => {
 if (user?.avatar && typeof user.avatar === 'string' && (user.avatar.startsWith('http') || user.avatar.startsWith('data:'))) {
 return (
 <img
 src={user.avatar}
 alt={user.name}
 className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
 />
 );
 }
 const initials = (user?.name || 'C').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
 const bgColors = [
 'bg-blue-600',
 'bg-emerald-600',
 'bg-purple-600',
 'bg-teal-600',
 'bg-amber-600',
 'bg-rose-600',
 'bg-indigo-600'
 ];
 const colorIndex = (user?.name || 'A').charCodeAt(0) % bgColors.length;

 return (
 <div className={`w-10 h-10 rounded-full ${bgColors[colorIndex]} text-white flex items-center justify-center font-bold text-[13px] shadow-sm shrink-0 uppercase tracking-tight`}>
 {initials}
 </div>
 );
 };

 // Reset page when filters change
 useMemo(() => { setCurrentPage(1); }, [searchTerm, statusFilter, kycFilter, assignmentFilter, selectedListTab]);

 return (
 <div className="w-full space-y-6 pb-12">
 {/* Page Header */}
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
 <div>
 <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-1">
 Customer / Borrower Management
 </h1>
 <div className="flex items-center text-[12px] font-medium text-slate-500">
 <Link to="/" className="hover:text-[#489b0d] transition-colors">
 Dashboard
 </Link>
 <ChevronRight size={14} className="mx-1" />
 <span className="text-slate-800 font-bold">Borrowers & Customers</span>
 </div>
 </div>
 <div className="flex items-center gap-3 w-full md:w-auto">
 <div className="relative flex-1 md:w-72">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
 <input
 type="text"
 placeholder="Search by customer name, phone, ID, agent..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all"
 />
 </div>
 <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[12px] font-bold">
 <Info size={14} className="text-emerald-600" /> App & Web Registrations
 </div>
 </div>
 </div>

 {/* Top KPIs Row */}
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
 {dynamicTopKpis.map((kpi, idx) => (
 <div
 key={idx}
 className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-sm flex flex-col justify-between min-h-[105px] hover:shadow-md transition-shadow"
 >
 <div className="flex items-start justify-between mb-2">
 <p className="text-[12px] font-semibold text-slate-500 tracking-wide">
 {kpi.label}
 </p>
 <div
 className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${kpi.bg} ${kpi.color}`}
 >
 <kpi.icon size={16} strokeWidth={2.5} />
 </div>
 </div>
 <div>
 <h3 className="text-2xl font-black text-slate-800 leading-none">
 {kpi.value}
 </h3>
 </div>
 </div>
 ))}
 </div>

 {/* Main Container */}
 <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
 {/* Filter Tabs */}
 <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar bg-slate-50/50">
 {[
 "All Customers",
 "Assigned",
 "Unassigned",
 "KYC Verified",
 "KYC Pending",
 "Blocked"
 ].map((tab) => (
 <button
 key={tab}
 onClick={() => setSelectedListTab(tab)}
 className={`px-5 py-3 text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
 selectedListTab === tab
 ? "border-[#489b0d] text-[#489b0d] bg-white"
 : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
 }`}
 >
 {tab}
 </button>
 ))}
 </div>

 {/* Filters Bar */}
 <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/40">
 <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
 <select
 value={kycFilter}
 onChange={(e) => setKycFilter(e.target.value)}
 className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[12px] font-bold text-slate-700 focus:outline-none focus:border-[#489b0d] min-w-[130px] shrink-0 cursor-pointer"
 >
 <option value="All KYC Status">️ All KYC Status</option>
 <option value="Verified">Verified</option>
 <option value="Pending">Pending</option>
 <option value="Blocked">Blocked</option>
 </select>

 <select
 value={assignmentFilter}
 onChange={(e) => setAssignmentFilter(e.target.value)}
 className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[12px] font-bold text-slate-700 focus:outline-none focus:border-[#489b0d] min-w-[140px] shrink-0 cursor-pointer"
 >
 <option value="All"> All Assignments</option>
 <option value="Assigned">Assigned to Field Agent</option>
 <option value="Unassigned">Unassigned</option>
 </select>

 <select
 value={statusFilter}
 onChange={(e) => setStatusFilter(e.target.value)}
 className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[12px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d] min-w-[120px] shrink-0 cursor-pointer"
 >
 <option value="All Status">All Status</option>
 <option value="Active">Active</option>
 <option value="Inactive">Inactive</option>
 <option value="Blocked">Blocked</option>
 </select>
 </div>

 <div className="flex items-center gap-3 w-full md:w-auto">
 <span className="text-[12px] font-semibold text-slate-500">
 Showing {currentItems.length} of {filteredCustomers.length} customers
 </span>
 </div>
 </div>

 {/* Customers Table */}
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-black text-slate-600 uppercase tracking-wider">
 <th className="py-3.5 px-4">Customer</th>
 <th className="py-3.5 px-4">Assigned Field Agent / Officer</th>
 <th className="py-3.5 px-4">KYC Status</th>
 <th className="py-3.5 px-4">Active Loans</th>
 <th className="py-3.5 px-4">Total Disbursed Amount</th>
 <th className="py-3.5 px-4">Status</th>
 <th className="py-3.5 px-4 text-center">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {isLoading ? (
 <tr>
 <td colSpan="7" className="py-12 text-center text-slate-500 font-semibold text-[13px]">
 Loading customer directory...
 </td>
 </tr>
 ) : currentItems.length === 0 ? (
 <tr>
 <td colSpan="7" className="py-12 text-center text-slate-400 font-medium text-[13px]">
 No customers found matching the criteria.
 </td>
 </tr>
 ) : (
 currentItems.map((cust) => (
 <tr
 key={cust.id}
 onClick={() => navigate(`/user-profile/${cust.id}`)}
 className="cursor-pointer transition-colors hover:bg-slate-50/80 group"
 >
 {/* Customer */}
 <td className="py-3.5 px-4">
 <div className="flex items-center gap-3">
 {renderAvatar(cust)}
 <div>
 <p className="text-[13px] font-bold text-slate-800 group-hover:text-[#489b0d] transition-colors leading-tight">
 {cust.name}
 </p>
 <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
 {cust.userId || cust.id} • {cust.phone || 'No Phone'}
 </p>
 <p className="text-[11px] text-slate-500">{cust.email}</p>
 </div>
 </div>
 </td>

 {/* Assigned Field Agent */}
 <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
 {cust.assignedTo ? (
 <div className="flex items-center gap-2">
 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
 <User size={12} /> {cust.assignedTo}
 </span>
 <button
 onClick={(e) => handleOpenAssignModal(e, cust)}
 className="text-[11px] font-bold text-[#489b0d] hover:underline"
 title="Reassign Agent"
 >
 Reassign
 </button>
 </div>
 ) : (
 <div className="flex items-center gap-2">
 <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
 Unassigned
 </span>
 <button
 onClick={(e) => handleOpenAssignModal(e, cust)}
 className="px-2.5 py-1 bg-[#489b0d] hover:bg-[#3e850b] text-white rounded text-[11px] font-bold shadow-xs transition-colors"
 >
 + Assign Agent
 </button>
 </div>
 )}
 </td>

 {/* KYC Status */}
 <td className="py-3.5 px-4">
 {cust.kycStatus === "Verified" && (
 <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
 <ShieldCheck size={12} /> Verified
 </span>
 )}
 {cust.kycStatus === "Pending" && (
 <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
 <Clock size={12} /> Pending
 </span>
 )}
 {cust.kycStatus === "Blocked" && (
 <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-md">
 <Ban size={12} /> Blocked
 </span>
 )}
 </td>

 {/* Active Loans */}
 <td className="py-3.5 px-4">
 <span className="text-[13px] font-bold text-slate-800">
 {cust.activeLoans || 0}
 </span>{" "}
 <span className="text-[11px] font-medium text-slate-500">
 Active
 </span>
 </td>

 {/* Total Loan Amount */}
 <td className="py-3.5 px-4">
 <p className="text-[13px] font-black text-slate-800">
 {cust.totalLoanAmount || "₹0"}
 </p>
 </td>

 {/* Status */}
 <td className="py-3.5 px-4">
 {cust.status === "Active" ? (
 <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
 <CheckCircle2 size={11} /> Active
 </span>
 ) : (
 <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
 <Ban size={11} /> {cust.status || 'Inactive'}
 </span>
 )}
 </td>

 {/* Actions */}
 <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
 <div className="flex items-center justify-center gap-2">
 <button
 onClick={() => navigate(`/user-profile/${cust.id}`)}
 className="p-1.5 text-slate-500 hover:text-[#489b0d] hover:bg-slate-100 rounded-md transition-colors"
 title="View Customer Profile"
 >
 <Eye size={15} />
 </button>
 <button
 onClick={(e) => handleToggleBlock(e, cust.id, cust.status)}
 className={`p-1.5 rounded-md transition-colors ${
 cust.status === "Blocked"
 ? "text-emerald-600 hover:bg-emerald-50"
 : "text-amber-600 hover:bg-amber-50"
 }`}
 title={cust.status === "Blocked" ? "Unblock Customer" : "Block Customer"}
 >
 {cust.status === "Blocked" ? <Unlock size={15} /> : <Ban size={15} />}
 </button>
 </div>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>

 {/* Pagination Bar */}
 <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-slate-500 font-medium">
 <div>
 Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} entries
 </div>
 <div className="flex items-center gap-1">
 <button
 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
 disabled={currentPage === 1}
 className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-[12px]"
 >
 Previous
 </button>
 {Array.from({ length: totalPages }).map((_, i) => (
 <button
 key={i}
 onClick={() => setCurrentPage(i + 1)}
 className={`w-8 h-8 rounded-lg font-bold text-[12px] transition-colors ${
 currentPage === i + 1
 ? "bg-[#489b0d] text-white"
 : "border border-slate-200 text-slate-600 hover:bg-slate-50"
 }`}
 >
 {i + 1}
 </button>
 ))}
 <button
 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
 disabled={currentPage === totalPages}
 className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-[12px]"
 >
 Next
 </button>
 </div>
 </div>
 </div>

 {/* Assign Field Agent Modal */}
 {selectedCustomerForAssign && (
 <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
 <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in duration-150">
 <div className="flex items-center justify-between border-b border-slate-100 pb-3">
 <div className="flex items-center gap-2">
 <ArrowRightLeft size={18} className="text-[#489b0d]" />
 <h3 className="text-[16px] font-bold text-slate-800">Assign Field Agent</h3>
 </div>
 <button
 onClick={() => setSelectedCustomerForAssign(null)}
 className="text-slate-400 hover:text-slate-600 p-1"
 >
 <X size={18} />
 </button>
 </div>

 <div>
 <p className="text-[13px] text-slate-600">
 Customer: <strong className="text-slate-800">{selectedCustomerForAssign.name}</strong> ({selectedCustomerForAssign.userId || selectedCustomerForAssign.id})
 </p>
 <p className="text-[12px] text-slate-400 mt-0.5">Phone: {selectedCustomerForAssign.phone}</p>
 </div>

 <div>
 <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
 Select Field Agent / Loan Officer:
 </label>
 <select
 value={selectedAgentId}
 onChange={(e) => setSelectedAgentId(e.target.value)}
 className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d]"
 >
 <option value="">-- Remove Assignment (Set Unassigned) --</option>
 {fieldAgents.map((agent) => (
 <option key={agent._id || agent.id} value={agent._id || agent.id}>
 {agent.name} ({agent.role || agent.designation} - {agent.zone || 'NORTH'})
 </option>
 ))}
 </select>
 </div>

 <div className="flex items-center justify-end gap-3 pt-2">
 <button
 onClick={() => setSelectedCustomerForAssign(null)}
 className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold text-[12px] hover:bg-slate-50"
 >
 Cancel
 </button>
 <button
 onClick={handleSaveAssignment}
 disabled={isAssigning}
 className="px-5 py-2 bg-[#489b0d] hover:bg-[#3e850b] text-white rounded-lg font-bold text-[12px] shadow-sm transition-all disabled:opacity-50"
 >
 {isAssigning ? 'Saving...' : 'Confirm Assignment'}
 </button>
 </div>
 </div>
 </div>
 )}

 </div>
 );
}
