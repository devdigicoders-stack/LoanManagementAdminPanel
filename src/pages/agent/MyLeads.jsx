import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Search, Filter, Phone, MapPin, CalendarCheck, FileText } from "lucide-react";
import { mockAgentLeads, statusColors, priorityColors } from "./agentData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function MyLeads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredLeads = mockAgentLeads.filter(lead => {
    const matchesSearch = lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.mobile.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>My Leads</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>View and manage all leads assigned to you.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.muted }} />
          <input
            type="text"
            placeholder="Search by Lead ID, Customer Name or Mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 h-10 rounded-xl text-[13px] outline-none transition-all"
            style={{ border: `1px solid ${tc.border}`, color: tc.text, background: tc.bg }}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.primary }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-8 pr-8 h-10 rounded-xl text-[13px] font-bold border outline-none appearance-none cursor-pointer bg-white"
              style={{ borderColor: tc.border, color: tc.text }}
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Interested">Interested</option>
              <option value="Visit Scheduled">Visit Scheduled</option>
              <option value="Documents Pending">Documents Pending</option>
              <option value="Application Submitted">Application Submitted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden w-full" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: tc.sky }}>
                {["Lead ID", "Customer Name", "Mobile", "Loan Type", "Amount", "Priority", "Status", "Next Follow-up", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, i) => {
                const sc = statusColors[lead.status] || { bg: "#F1F5F9", text: "#64748B" };
                const pc = priorityColors[lead.priority] || { bg: "#F1F5F9", text: "#64748B" };
                
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-[#FAFCFD] transition-colors">
                    <td className="px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{lead.id}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: tc.text }}>{lead.customerName}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{lead.mobile}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{lead.loanType}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: tc.text }}>₹{Number(lead.amount).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: pc.bg, color: pc.text }}>{lead.priority}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap" style={{ background: sc.bg, color: sc.text }}>{lead.status}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{lead.nextFollowup}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link to={`/agent/leads/${lead.id}`} title="View Details"
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                          style={{ background: tc.sky, color: tc.blue }}>
                          <Eye size={14} />
                        </Link>
                        <button title="Call"
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                          style={{ background: "#EEF2FF", color: "#4338CA" }}>
                          <Phone size={14} />
                        </button>
                        <Link to="/agent/visits/add" title="Schedule Visit"
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                          style={{ background: "#FEF3C7", color: "#D97706" }}>
                          <MapPin size={14} />
                        </Link>
                        <Link to="/agent/applications" title="Generate Application"
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                          style={{ background: "#DCFCE7", color: "#15803D" }}>
                          <FileText size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-4 py-12 text-center">
                    <p className="text-[14px] font-bold" style={{ color: tc.text }}>No leads found</p>
                    <p className="text-[12px] mt-1" style={{ color: tc.muted }}>Try adjusting your search or filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
