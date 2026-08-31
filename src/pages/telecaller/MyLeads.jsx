import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Eye, Phone, CalendarCheck, MessageSquare, RefreshCw, FileText, ChevronDown, Plus } from "lucide-react";
import { mockLeads, statusColors, priorityColors } from "./telecallerData";

const statusOptions = ["All", "New", "Contacted", "Interested", "Follow-up", "Documents Pending", "Application Submitted", "Converted", "Lost"];
const loanTypes = ["All", "Home Loan", "Loan Against Property", "Other"];
const priorities = ["All", "Normal", "Medium", "High", "Urgent"];

export default function MyLeads() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loanFilter, setLoanFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const filtered = mockLeads.filter(lead => {
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
          <h1 className="text-2xl font-bold text-gray-900">My Leads</h1>
          <p className="text-[14px] text-gray-500 mt-1">View and manage all leads assigned to you.</p>
        </div>
        <Link to="/telecaller/leads/add"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-[14px] font-bold transition-colors shadow-sm">
          <Plus size={18} /> Add New Lead
        </Link>
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
                {["Lead ID", "Customer Details", "Loan Info", "Priority & Status", "Follow-up", "Actions"].map(h => (
                  <th key={h} className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="text-gray-300 mb-3 flex justify-center"><Filter size={40} /></div>
                    <p className="font-bold text-gray-700 text-[16px]">No leads found</p>
                    <p className="text-[13px] text-gray-500 mt-1">Try adjusting your search or filters to find what you're looking for.</p>
                  </td>
                </tr>
              ) : filtered.map((lead, i) => {
                const sc = statusColors[lead.status] || { bg: "#F3F4F6", text: "#4B5563" };
                const pc = priorityColors[lead.priority] || { bg: "#F3F4F6", text: "#4B5563" };
                return (
                  <tr key={i} className="hover:bg-gray-50/80 transition-colors group cursor-pointer">
                    {/* Lead ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[12px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-md">{lead.id}</span>
                    </td>
                    
                    {/* Customer Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-gray-900">{lead.customerName}</span>
                        <div className="flex items-center gap-1.5 mt-1 text-[12px] text-gray-500 font-medium">
                           <Phone size={12} className="text-gray-400" /> {lead.mobile}
                        </div>
                      </div>
                    </td>

                    {/* Loan Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-gray-700">₹{Number(lead.amount).toLocaleString("en-IN")}</span>
                        <span className="text-[12px] text-gray-500 mt-1 font-medium">{lead.loanType}</span>
                      </div>
                    </td>

                    {/* Priority & Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border" style={{ background: pc.bg, color: pc.text, borderColor: pc.text + '30' }}>
                          {lead.priority}
                        </span>
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold" style={{ background: sc.bg, color: sc.text }}>
                          {lead.status}
                        </span>
                      </div>
                    </td>

                    {/* Follow-up */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col text-[12px]">
                        <span className="text-gray-900 font-bold"><span className="text-gray-400 font-medium text-[11px] uppercase tracking-wider mr-1">Next:</span>{lead.nextFollowup}</span>
                        <span className="text-gray-500 mt-1"><span className="text-gray-400 font-medium text-[11px] uppercase tracking-wider mr-1">Last:</span>{lead.lastContact}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button title="View Details" className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer">
                          <Eye size={15} />
                        </button>
                        <button title="Call Customer" className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors cursor-pointer">
                          <Phone size={15} />
                        </button>
                        <button title="Add Follow-up" className="p-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-600 transition-colors cursor-pointer">
                          <CalendarCheck size={15} />
                        </button>
                        <button title="Remarks" className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors cursor-pointer">
                          <MessageSquare size={15} />
                        </button>
                        <button title="Documents" className="p-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 transition-colors cursor-pointer">
                          <FileText size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-[13px] font-bold text-gray-500">Showing <span className="text-purple-600">{filtered.length}</span> of <span className="text-gray-900">{mockLeads.length}</span> leads</p>
        </div>
      </div>
    </div>
  );
}
