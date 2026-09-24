import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Eye, Phone, CalendarCheck, MessageSquare, RefreshCw, FileText, ChevronDown, Plus, CheckCircle2, Clock, ExternalLink, User, Briefcase } from "lucide-react";
import { statusColors, priorityColors } from "./telecallerData";
import SupervisorStaffFilter from "../../components/SupervisorStaffFilter";
import TablePagination from "../../components/TablePagination";

const statusOptions = ["All", "New", "Contacted", "Interested", "Follow-up", "Documents Pending", "Application Submitted", "Converted", "Lost", "Assigned", "Under Review", "Approved", "Rejected", "Disbursed"];
const loanTypes = ["All", "Home Loan", "Personal Loan", "Business Loan", "Education Loan", "Loan Against Property", "Other"];
const priorities = ["All", "Normal", "Low", "Medium", "High", "Urgent"];

export default function AssignedLeads() {
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loanFilter, setLoanFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedStaff, setSelectedStaff] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const url = selectedStaff && selectedStaff !== 'all'
          ? `${import.meta.env.VITE_API_BASE_URL}/employees/my-leads?employeeId=${selectedStaff}`
          : `${import.meta.env.VITE_API_BASE_URL}/employees/my-leads`;

        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          const normalizedLeads = (data.leads || []).map(l => ({
            id: l.leadId || l._id,
            customerName: l.name,
            mobile: l.mobile,
            loanType: l.productSubtype || l.loanPurpose || "Other",
            amount: l.expectedAmount || l.loanAmount || "0",
            status: l.status || "New",
            customerFormStatus: l.customerFormStatus || "Pending",
            customerFilledAt: l.customerFilledAt,
            workflowStage: l.workflowStage || "Field_Lead_Created",
            isRmApproved: l.workflowStage === 'RM_Telecaller_Review' || l.status === 'Contacted' || l.status === 'Under Review' || l.status === 'Interested',
            zone: l.zone || "NORTH",
            priority: l.priority || "Medium",
            source: l.source || "Employee App",
            generatorType: l.generatorType || (l.createdByName ? "Employee" : "Customer"),
            createdByDesignation: l.createdByDesignation || l.createdByRole || "",
            createdByName: l.createdByName || "",
            nextFollowup: l.nextFollowUp || "-",
            lastContact: l.updatedAt ? new Date(l.updatedAt).toLocaleDateString() : "-",
            dbId: l._id,
            sourceType: 'Lead'
          }));
          
          const normalizedApps = (data.loanApplications || []).map(l => ({
            id: l.applicationId || l._id,
            customerName: l.customer,
            mobile: l.mobile,
            loanType: l.loanType || "Other",
            amount: l.amount || "0",
            status: l.status || "Pending",
            customerFormStatus: "Completed",
            priority: "Normal",
            zone: l.zone || "NORTH",
            source: l.source || "Customer App",
            generatorType: l.generatorType || "Customer",
            createdByDesignation: l.createdByDesignation || "",
            createdByName: l.createdByName || "",
            nextFollowup: "-",
            lastContact: l.updatedAt ? new Date(l.updatedAt).toLocaleDateString() : "-",
            dbId: l._id,
            sourceType: 'LoanApplication'
          }));
          
          setLeadsData([...normalizedLeads, ...normalizedApps].sort((a,b) => new Date(b.lastContact) - new Date(a.lastContact)));
        }
      } catch (err) {
        console.error("Error fetching leads:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeads();
  }, [selectedStaff]);

  const filtered = leadsData.filter(lead => {
    const q = search.toLowerCase();
    const matchSearch = !search || lead.id.toLowerCase().includes(q) || lead.customerName.toLowerCase().includes(q) || lead.mobile.includes(q);
    const matchStatus = statusFilter === "All" || lead.status === statusFilter;
    const matchLoan = loanFilter === "All" || lead.loanType === loanFilter;
    const matchPriority = priorityFilter === "All" || lead.priority === priorityFilter;
    return matchSearch && matchStatus && matchLoan && matchPriority;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assigned Leads Queue (Alternate Distribution)</h1>
          <p className="text-[14px] text-gray-500 mt-1">Universal alternate telecaller lead stream across all 5 zones with Employee / Customer source tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <SupervisorStaffFilter onSelectStaff={setSelectedStaff} role="tele" />
          <Link to="/telecaller/documents"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-[14px] font-bold transition-colors shadow-sm">
            <FileText size={18} /> Document Verification Desk
          </Link>
        </div>
      </div>

      {/* Filters Area */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by Lead ID, Customer Name or Mobile..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
          />
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {[
            { val: statusFilter, set: setStatusFilter, opts: statusOptions },
            { val: loanFilter, set: setLoanFilter, opts: loanTypes },
            { val: priorityFilter, set: setPriorityFilter, opts: priorities },
          ].map(({ val, set, opts }, idx) => (
            <div key={idx} className="relative min-w-[140px]">
              <select value={val} onChange={e => set(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer transition-all hover:bg-gray-100">
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                {["Lead ID & Zone", "Customer Details", "Source / Generated By", "Loan Info", "Customer Link Status", "Lead Status", "Actions"].map(h => (
                  <th key={h} className="px-5 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex justify-center mb-4"><RefreshCw className="animate-spin text-purple-600" size={32} /></div>
                    <p className="font-bold text-gray-700 text-[16px]">Loading leads...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="text-gray-300 mb-3 flex justify-center"><Filter size={40} /></div>
                    <p className="font-bold text-gray-700 text-[16px]">No leads found</p>
                    <p className="text-[13px] text-gray-500 mt-1">Try adjusting your search or filters to find what you're looking for.</p>
                  </td>
                </tr>
              ) : filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((lead, i) => {
                const sc = statusColors[lead.status] || { bg: "#F3F4F6", text: "#4B5563" };
                const isFormFilled = lead.customerFormStatus === "Completed";
                const isEmployee = lead.generatorType === "Employee";

                return (
                  <tr key={i} className="hover:bg-gray-50/80 transition-colors group cursor-pointer">
                    {/* Lead ID & Zone */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-[12px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-md">{lead.id}</span>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          Zone: {lead.zone || 'NORTH'}
                        </span>
                      </div>
                    </td>
                    
                    {/* Customer Details */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-gray-900">{lead.customerName}</span>
                        <div className="flex items-center gap-1.5 mt-1 text-[12px] text-gray-500 font-medium">
                          <Phone size={12} className="text-gray-400" /> {lead.mobile}
                        </div>
                      </div>
                    </td>

                    {/* Source / Generated By */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {isEmployee ? (
                        <div className="flex flex-col items-start">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                            <Briefcase size={11} /> {lead.createdByDesignation || "Employee"}
                          </span>
                          <span className="text-[11px] text-slate-600 font-medium mt-0.5">
                            {lead.createdByName || "Staff"}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-start">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            <User size={11} /> Customer Direct
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Self Applied
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Loan Info */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-gray-700">₹{Number(lead.amount).toLocaleString("en-IN")}</span>
                        <span className="text-[12px] text-gray-500 mt-1 font-medium">{lead.loanType}</span>
                      </div>
                    </td>

                    {/* Customer Link Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                          isFormFilled 
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-300" 
                            : "bg-amber-50 text-amber-800 border border-amber-300"
                        }`}>
                          {isFormFilled ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {isFormFilled ? "Form Filled & Docs Ready" : "Form Pending (Link Sent)"}
                        </span>
                        <a 
                          href={`/api/apply/${lead.id}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[11px] text-purple-600 hover:underline flex items-center gap-0.5 font-medium"
                        >
                          View Link <ExternalLink size={10} />
                        </a>
                      </div>
                    </td>

                    {/* Lead Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded text-[11px] font-bold" style={{ background: sc.bg, color: sc.text }}>
                        {lead.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link to={`/telecaller/call/${lead.dbId}`} title="Call Customer" className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors font-bold flex items-center gap-1.5 text-xs shadow-xs">
                          <Phone size={13} /> {isFormFilled ? "Confirm Details" : "Call Customer"}
                        </Link>
                        <Link to={`/telecaller/documents`} title="Verify Documents" className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors">
                          <FileText size={15} />
                        </Link>
                        <Link to={`/telecaller/followups/add?leadId=${lead.dbId}`} title="Add Follow-up" className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition-colors">
                          <CalendarCheck size={15} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <TablePagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => setPageSize(size)}
        />
      </div>
    </div>
  );
}
