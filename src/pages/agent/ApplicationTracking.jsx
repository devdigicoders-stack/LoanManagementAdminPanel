import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Search, Plus, Eye, Clock } from "lucide-react";
import { mockApplications, applicationStatusColors } from "./agentData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function ApplicationTracking() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApps = mockApplications.filter(app => {
    return app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
           app.leadId.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Application Tracking</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Track the processing status of applications generated from your leads.</p>
        </div>
        <Link to="/agent/applications/new" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90" style={{ background: tc.blue }}>
          <Plus size={16} /> Create Application
        </Link>
      </div>

      <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="relative max-w-sm w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.muted }} />
          <input 
            type="text" 
            placeholder="Search by ID, Lead ID or Customer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl text-[13px] outline-none transition-all" 
            style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} 
          />
        </div>
        
        <div className="text-[11px] font-bold p-2 rounded-lg" style={{ background: tc.cream, color: "#D97706" }}>
          * Read-only view
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden w-full" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: tc.sky }}>
                {["Application ID", "Lead ID", "Customer", "Loan Type", "Amount", "Submitted Date", "Current Status", "Last Updated", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app, i) => {
                const sc = applicationStatusColors[app.status] || { bg: "#F1F5F9", text: "#64748B" };

                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-[#FAFCFD] transition-colors">
                    <td className="px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{app.id}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: tc.muted }}>{app.leadId}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: tc.text }}>{app.customerName}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{app.loanType}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: tc.text }}>₹{Number(app.amount).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.text }}>{app.submittedDate}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap" style={{ background: sc.bg, color: sc.text }}>{app.status}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{app.lastUpdated}</td>
                    <td className="px-4 py-3">
                      <button title="View Status" className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80" style={{ background: tc.sky, color: tc.blue }}>
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-4 py-12 text-center">
                    <p className="text-[14px] font-bold" style={{ color: tc.text }}>No applications found</p>
                    <p className="text-[12px] mt-1" style={{ color: tc.muted }}>You haven't generated any applications that match your search.</p>
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
