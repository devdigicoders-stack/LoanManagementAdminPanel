import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
 ChevronRight,
 Filter,
 Eye,
 ArrowRight,
 Mail,
 Phone,
 MapPin,
 CheckCircle2,
 XCircle,
 FileText,
 UserCheck,
 Download,
 AlertCircle,
 Calendar,
 Briefcase,
 Check,
 X,
 MessageSquare,
 FolderOpen,
 ShieldCheck,
 UserPlus,
 RefreshCw,
 Search,
 CircleDollarSign,
 FileCheck,
 BadgePercent,
 Layers,
 ArrowUpRight
} from "lucide-react";

// Sub-components / Views embedded inside the Loan Applications Hub
import DocumentCenter from "./DocumentCenter";
import ActiveLoans from "./ActiveLoans";
import EMICollections from "./EMICollections";
import ManageOffers from "./ManageOffers";

export default function ManageApplications() {
 const [searchParams, setSearchParams] = useSearchParams();
 const currentView = searchParams.get("view") || "applications"; // 'applications' | 'active' | 'documents' | 'collections' | 'offers'

 const [applications, setApplications] = useState([]);
 const [selectedAppId, setSelectedAppId] = useState(null);
 const [loading, setLoading] = useState(true);
 const [employees, setEmployees] = useState([]);
 const [searchQuery, setSearchQuery] = useState("");

 const [filterLoanType, setFilterLoanType] = useState("All Loan Types");
 const [filterStatus, setFilterStatus] = useState("All Status");

 const handleViewChange = (newView) => {
 if (newView === "applications") {
 setSearchParams({});
 } else {
 setSearchParams({ view: newView });
 }
 };

 const fetchEmployees = async () => {
 try {
 const token = localStorage.getItem('token');
 const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees`, {
 headers: { 'Authorization': `Bearer ${token}` }
 });
 if (response.ok) {
 const data = await response.json();
 setEmployees(data);
 }
 } catch (error) {
 console.error("Error fetching employees:", error);
 }
 };

 const fetchApplications = async () => {
 try {
 setLoading(true);
 const token = localStorage.getItem('token');
 const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/loans`, {
 headers: { 'Authorization': `Bearer ${token}` }
 });
 const data = await response.json();
 
 if (!response.ok) {
 toast.error(data.message || 'Failed to load applications');
 setLoading(false);
 return;
 }

 // Map MongoDB _id to id for frontend compatibility
 const mappedData = data.map(app => ({
 ...app,
 id: app.applicationId,
 _id: app._id,
 appliedOn: new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
 avatar: app.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.customer)}&background=random`
 }));
 setApplications(mappedData);
 } catch (error) {
 console.error("Error fetching applications:", error);
 toast.error("Failed to load applications");
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchApplications();
 fetchEmployees();
 }, []);

 const filteredApps = applications.filter(app => {
 const matchType = filterLoanType === "All Loan Types" || app.loanType === filterLoanType;
 const matchStatus = filterStatus === "All Status" || app.status === filterStatus;
 const matchQuery = !searchQuery || 
 (app.customer && app.customer.toLowerCase().includes(searchQuery.toLowerCase())) ||
 (app.id && app.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
 (app.mobile && app.mobile.includes(searchQuery));
 return matchType && matchStatus && matchQuery;
 });

 const getStatusBadge = (status) => {
 switch (status) {
 case "Pending":
 return <span className="text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-md text-[11px] font-bold">Pending</span>;
 case "Assigned":
 return <span className="text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md text-[11px] font-bold">Assigned</span>;
 case "Approved":
 return <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md text-[11px] font-bold">Approved</span>;
 case "Under Review":
 return <span className="text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md text-[11px] font-bold">Under Review</span>;
 case "Rejected":
 return <span className="text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md text-[11px] font-bold">Rejected</span>;
 case "Disbursed":
 return <span className="text-purple-600 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-md text-[11px] font-bold">Disbursed</span>;
 default:
 return <span className="text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md text-[11px] font-bold">{status}</span>;
 }
 };

 return (
 <div className="w-full h-full flex flex-col space-y-6 pb-12">
 {/* ── TOP HEADER WITH HUB DROPDOWN SELECTOR ── */}
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
 <div>
 <div className="flex items-center gap-2">
 <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
 <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
 Loan Applications Hub
 </h1>
 </div>
 <div className="flex items-center text-[12px] font-medium text-slate-500 mt-1 whitespace-nowrap">
 <span className="text-slate-500">Master Loan Origination & Portfolio Overview (Read-Only)</span>
 </div>
 </div>

 {/* ── DROPDOWN NAVIGATION SELECTOR (Replaces top tabs & standalone sidebar items) ── */}
 <div className="flex flex-wrap items-center gap-3">
 <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
 <Layers size={16} className="text-purple-600 shrink-0" />
 <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Loan Section:</span>
 <select
 value={currentView}
 onChange={(e) => handleViewChange(e.target.value)}
 className="bg-transparent text-[13px] font-extrabold text-slate-900 outline-none cursor-pointer pr-2"
 >
 <option value="applications"> All Loan Applications ({applications.length})</option>
 <option value="active"> Active Disbursed Loans</option>
 <option value="documents"> Customer Document Desk</option>
 <option value="collections"> EMI & Repayment Collections</option>
 <option value="offers">️ Sanction & Settlement Offers</option>
 </select>
 </div>

 <button 
 onClick={fetchApplications}
 className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
 title="Refresh Data"
 >
 <RefreshCw size={16} className={loading ? "animate-spin text-purple-600" : ""} />
 </button>
 </div>
 </div>

 {/* ── CONDITIONAL VIEW RENDERING BASED ON DROPDOWN ── */}
 {currentView === "documents" && (
 <div className="animate-in fade-in duration-200">
 <DocumentCenter />
 </div>
 )}

 {currentView === "active" && (
 <div className="animate-in fade-in duration-200">
 <ActiveLoans />
 </div>
 )}

 {currentView === "collections" && (
 <div className="animate-in fade-in duration-200">
 <EMICollections />
 </div>
 )}

 {currentView === "offers" && (
 <div className="animate-in fade-in duration-200">
 <ManageOffers />
 </div>
 )}

 {currentView === "applications" && (
 <div className="space-y-4 animate-in fade-in duration-200">
 {/* Filters Bar */}
 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
 <div className="relative w-full sm:w-72">
 <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
 <input
 type="text"
 placeholder="Search by ID, customer name, mobile..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:ring-2 focus:ring-purple-500"
 />
 </div>

 <div className="flex items-center gap-3 w-full sm:w-auto">
 <select 
 value={filterLoanType}
 onChange={(e) => setFilterLoanType(e.target.value)}
 className="h-9 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none bg-slate-50 cursor-pointer"
 >
 <option value="All Loan Types">All Loan Types</option>
 <option value="Personal Loan">Personal Loan</option>
 <option value="Home Loan">Home Loan</option>
 <option value="Business Loan">Business Loan</option>
 <option value="Education Loan">Education Loan</option>
 </select>

 <select 
 value={filterStatus}
 onChange={(e) => setFilterStatus(e.target.value)}
 className="h-9 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none bg-slate-50 cursor-pointer"
 >
 <option value="All Status">All Status</option>
 <option value="Pending">Pending</option>
 <option value="Assigned">Assigned</option>
 <option value="Under Review">Under Review</option>
 <option value="Approved">Approved</option>
 <option value="Rejected">Rejected</option>
 <option value="Disbursed">Disbursed</option>
 </select>
 </div>
 </div>

 {/* Main Applications Table */}
 <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse whitespace-nowrap">
 <thead>
 <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
 <th className="py-3.5 px-6">Application ID</th>
 <th className="py-3.5 px-6">Customer Name & Contact</th>
 <th className="py-3.5 px-6">Loan Type & Amount</th>
 <th className="py-3.5 px-6">Status</th>
 <th className="py-3.5 px-6">Applied On</th>
 <th className="py-3.5 px-6 text-center">View Application</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-xs">
 {loading ? (
 <tr>
 <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
 <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-purple-600" />
 Loading loan applications...
 </td>
 </tr>
 ) : filteredApps.length === 0 ? (
 <tr>
 <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
 No applications found.
 </td>
 </tr>
 ) : (
 filteredApps.map((app) => (
 <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
 <td className="py-4 px-6 whitespace-nowrap">
 <span className="font-mono font-bold text-slate-800">{app.id}</span>
 </td>
 <td className="py-4 px-6 whitespace-nowrap">
 <div className="flex items-center gap-3">
 <img src={app.avatar} alt={app.customer} className="w-8 h-8 rounded-full border border-slate-200 shrink-0" />
 <div>
 <p className="font-bold text-slate-900">{app.customer}</p>
 <p className="text-[11px] font-medium text-slate-500">{app.mobile}</p>
 </div>
 </div>
 </td>
 <td className="py-4 px-6 whitespace-nowrap">
 <p className="font-bold text-slate-800">{app.loanType}</p>
 <p className="text-[12px] font-black text-emerald-700">₹{Number(app.amount).toLocaleString('en-IN')}</p>
 </td>
 <td className="py-4 px-6 whitespace-nowrap">
 {getStatusBadge(app.status)}
 </td>
 <td className="py-4 px-6 whitespace-nowrap text-slate-600 font-medium">
 {app.appliedOn}
 </td>
 <td className="py-4 px-6 text-center whitespace-nowrap">
 <Link 
 to={`/loans/${app._id}`}
 className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-xs border border-purple-200 transition inline-flex items-center gap-1.5 shadow-2xs"
 title="View Full Application Details"
 >
 <Eye size={13} /> View File
 </Link>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
