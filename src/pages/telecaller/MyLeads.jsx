import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Eye, Phone, CalendarCheck, MessageSquare, RefreshCw, FileText, ChevronDown } from "lucide-react";
import { mockLeads, statusColors, priorityColors } from "./telecallerData";

const tc = {
  card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7", primary: "#8ED3F4",
  cream: "#FFF8E7", text: "#344054", muted: "#667085", border: "#D9EAF2", blue: "#1e7ba8",
};

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
    <div className="space-y-5" style={{ color: tc.text }}>
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>My Leads</h1>
        <p className="text-[13px]" style={{ color: tc.muted }}>View and manage all leads assigned to you.</p>
      </div>

      {/* Search + Filters */}
      <div className="rounded-2xl p-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.primary }} />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by Lead ID, Customer Name or Mobile Number"
              className="w-full pl-9 pr-4 h-10 rounded-xl text-[13px] font-medium border outline-none"
              style={{ borderColor: tc.border, background: tc.sky, color: tc.text }}
            />
          </div>

          {/* Filters */}
          {[
            { label: "Status", val: statusFilter, set: setStatusFilter, opts: statusOptions },
            { label: "Loan Type", val: loanFilter, set: setLoanFilter, opts: loanTypes },
            { label: "Priority", val: priorityFilter, set: setPriorityFilter, opts: priorities },
          ].map(({ label, val, set, opts }) => (
            <div key={label} className="relative">
              <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.primary }} />
              <select value={val} onChange={e => set(e.target.value)}
                className="pl-8 pr-7 h-10 rounded-xl text-[13px] font-semibold border outline-none appearance-none cursor-pointer"
                style={{ borderColor: tc.border, background: tc.cream, color: tc.text }}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: tc.muted }} />
            </div>
          ))}

          <Link to="/telecaller/leads/add"
            className="flex items-center gap-2 px-4 h-10 rounded-xl text-[13px] font-bold whitespace-nowrap transition-colors"
            style={{ background: tc.blue, color: "#fff" }}>
            + Add Lead
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: tc.sky }}>
                {["Lead ID", "Customer Name", "Mobile", "Loan Type", "Amount", "Priority", "Status", "Last Contact", "Next Follow-up", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center">
                    <p className="font-bold text-[15px] mb-1" style={{ color: tc.muted }}>No leads assigned</p>
                    <p className="text-[12px]" style={{ color: tc.primary }}>You currently don't have any leads matching this filter.</p>
                  </td>
                </tr>
              ) : filtered.map((lead, i) => {
                const sc = statusColors[lead.status] || { bg: "#F1F5F9", text: "#64748B" };
                const pc = priorityColors[lead.priority] || { bg: "#F1F5F9", text: "#64748B" };
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-[#FAFCFD] transition-colors">
                    <td className="px-4 py-3 font-bold" style={{ color: tc.blue }}>{lead.id}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: tc.text }}>{lead.customerName}</td>
                    <td className="px-4 py-3" style={{ color: tc.muted }}>{lead.mobile}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{lead.loanType}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: tc.text }}>₹{Number(lead.amount).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: pc.bg, color: pc.text }}>{lead.priority}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap" style={{ background: sc.bg, color: sc.text }}>{lead.status}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{lead.lastContact}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{lead.nextFollowup}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link to={`/telecaller/leads/${lead.id}`} title="View"
                          className="p-1.5 rounded-lg transition-colors" style={{ background: tc.sky, color: tc.blue }}>
                          <Eye size={13} />
                        </Link>
                        <Link to={`/telecaller/call/${lead.id}`} title="Call"
                          className="p-1.5 rounded-lg transition-colors" style={{ background: "#DCFCE7", color: "#15803D" }}>
                          <Phone size={13} />
                        </Link>
                        <Link to={`/telecaller/followups/add?lead=${lead.id}`} title="Follow-up"
                          className="p-1.5 rounded-lg transition-colors" style={{ background: "#FEF9C3", color: "#CA8A04" }}>
                          <CalendarCheck size={13} />
                        </Link>
                        <Link to="/telecaller/remarks" title="Remarks"
                          className="p-1.5 rounded-lg transition-colors" style={{ background: "#EEF2FF", color: "#4338CA" }}>
                          <MessageSquare size={13} />
                        </Link>
                        <Link to={`/telecaller/status/${lead.id}`} title="Update Status"
                          className="p-1.5 rounded-lg transition-colors" style={{ background: "#FFF7ED", color: "#C2410C" }}>
                          <RefreshCw size={13} />
                        </Link>
                        <Link to="/telecaller/documents" title="Documents"
                          className="p-1.5 rounded-lg transition-colors" style={{ background: "#FEF3C7", color: "#D97706" }}>
                          <FileText size={13} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: `1px solid ${tc.border}`, background: "#FAFCFD" }}>
          <p className="text-[12px] font-medium" style={{ color: tc.muted }}>Showing {filtered.length} of {mockLeads.length} leads</p>
        </div>
      </div>
    </div>
  );
}
