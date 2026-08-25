import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, Eye, Search, Plus, CalendarX2, CheckCircle2, Clock } from "lucide-react";
import { mockFollowups } from "./agentData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function MyFollowups() {
  const [filter, setFilter] = useState("All");

  const cards = [
    { label: "Today's Follow-ups", value: 2, icon: CalendarCheck, color: "#EEF2FF", iconColor: "#4338CA" },
    { label: "Upcoming", value: 1, icon: Clock, color: "#FEF3C7", iconColor: "#D97706" },
    { label: "Completed", value: 1, icon: CheckCircle2, color: "#DCFCE7", iconColor: "#15803D" },
    { label: "Missed / Overdue", value: 0, icon: CalendarX2, color: "#FEE2E2", iconColor: "#DC2626" },
  ];

  return (
    <div className="space-y-6 w-full">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Follow-up Management</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Track customer follow-ups after calls, meetings and field visits.</p>
        </div>
        <Link to="/agent/followups/add" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90" style={{ background: tc.blue }}>
          <Plus size={16} /> Add Follow-up
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="rounded-2xl p-4 flex flex-col gap-2" style={{ background: tc.card, border: `1px solid ${tc.border}`, boxShadow: "0 1px 6px rgba(142,211,244,0.08)" }}>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: card.color }}>
                  <Icon size={17} style={{ color: card.iconColor }} />
                </div>
                <span className="text-[20px] font-extrabold" style={{ color: tc.text }}>{card.value}</span>
              </div>
              <div>
                <p className="text-[12px] font-bold" style={{ color: tc.text }}>{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden w-full" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${tc.border}` }}>
          <div className="relative max-w-sm w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.muted }} />
            <input type="text" placeholder="Search follow-ups..." className="w-full h-9 pl-9 pr-3 rounded-lg text-[12px] outline-none" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-9 px-3 rounded-lg text-[12px] outline-none font-bold bg-white" style={{ border: `1px solid ${tc.border}`, color: tc.text }}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: tc.sky }}>
                {["Lead ID", "Customer", "Date", "Time", "Type", "Purpose", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockFollowups.filter(f => filter === "All" || f.status === filter).map((fu, i) => {
                let statusStyle = { bg: "#F1F5F9", text: "#64748B" };
                if (fu.status === "Pending") statusStyle = { bg: "#FEF3C7", text: "#D97706" };
                if (fu.status === "Completed") statusStyle = { bg: "#DCFCE7", text: "#15803D" };

                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-[#FAFCFD] transition-colors">
                    <td className="px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{fu.leadId}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: tc.text }}>{fu.customerName}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.text }}>{fu.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.text }}>{fu.time}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{fu.type}</td>
                    <td className="px-4 py-3 min-w-[200px]" style={{ color: tc.muted }}>{fu.purpose}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap" style={{ background: statusStyle.bg, color: statusStyle.text }}>{fu.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {fu.status === "Pending" ? (
                        <Link to={`/agent/followups/complete/${fu.id}`} className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all hover:opacity-90 w-fit whitespace-nowrap" style={{ background: tc.primary, color: tc.blue }}>
                          Complete
                        </Link>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg text-[11px] font-bold opacity-50" style={{ background: tc.border, color: tc.muted }}>
                          Done
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {mockFollowups.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center">
                    <p className="text-[14px] font-bold" style={{ color: tc.text }}>No follow-ups found</p>
                    <p className="text-[12px] mt-1" style={{ color: tc.muted }}>You currently have no scheduled follow-ups.</p>
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
