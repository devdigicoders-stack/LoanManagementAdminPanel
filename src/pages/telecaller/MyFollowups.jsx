import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, Eye, CheckCircle2, CalendarDays, MessageSquare } from "lucide-react";
import { mockFollowups } from "./telecallerData";

const tc = {
  card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  cream: "#FFF8E7", text: "#344054", muted: "#667085", border: "#D9EAF2", blue: "#1e7ba8",
};

export default function MyFollowups() {
  const summary = [
    { label: "Today's", count: 2, color: "#1e7ba8", bg: tc.sky },
    { label: "Upcoming", count: 1, color: "#15803D", bg: "#DCFCE7" },
    { label: "Completed", count: 1, color: "#4338CA", bg: "#EEF2FF" },
    { label: "Missed", count: 1, color: "#DC2626", bg: "#FEE2E2" },
    { label: "Overdue", count: 0, color: "#D97706", bg: "#FEF3C7" },
  ];

  return (
    <div className="space-y-5" style={{ color: tc.text }}>
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>My Follow-ups</h1>
        <p className="text-[13px]" style={{ color: tc.muted }}>Manage your scheduled customer follow-ups.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {summary.map((s, i) => (
          <div key={i} className="rounded-2xl p-4 text-center" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <span className="text-[24px] font-extrabold" style={{ color: s.color }}>{s.count}</span>
            <p className="text-[12px] font-bold" style={{ color: tc.muted }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: tc.sky }}>
                {["Lead ID", "Customer", "Date", "Time", "Type", "Purpose", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockFollowups.map((fu, i) => {
                const getStatusColor = (s) => {
                  if (s === "Today") return { bg: "#FEF9C3", col: "#CA8A04" };
                  if (s === "Upcoming") return { bg: tc.sky, col: tc.blue };
                  if (s === "Completed") return { bg: "#DCFCE7", col: "#15803D" };
                  if (s === "Missed") return { bg: "#FEE2E2", col: "#DC2626" };
                  return { bg: "#F1F5F9", col: "#64748B" };
                };
                const sc = getStatusColor(fu.status);

                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-[#FAFCFD] transition-colors">
                    <td className="px-4 py-3 font-bold" style={{ color: tc.blue }}>{fu.leadId}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: tc.text }}>{fu.customer}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{fu.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{fu.time}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{fu.type}</td>
                    <td className="px-4 py-3" style={{ color: tc.text }}>{fu.purpose}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap" style={{ background: sc.bg, color: sc.col }}>{fu.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link to={`/telecaller/leads/${fu.leadId}`} title="View Lead"
                          className="p-1.5 rounded-lg transition-colors" style={{ background: tc.sky, color: tc.blue }}>
                          <Eye size={13} />
                        </Link>
                        <Link to={`/telecaller/followups/complete/${fu.id}`} title="Complete"
                          className="p-1.5 rounded-lg transition-colors" style={{ background: "#DCFCE7", color: "#15803D" }}>
                          <CheckCircle2 size={13} />
                        </Link>
                        <Link to={`/telecaller/followups/reschedule/${fu.id}`} title="Reschedule"
                          className="p-1.5 rounded-lg transition-colors" style={{ background: "#FFF7ED", color: "#C2410C" }}>
                          <CalendarDays size={13} />
                        </Link>
                        <Link to="/telecaller/remarks" title="Add Remark"
                          className="p-1.5 rounded-lg transition-colors" style={{ background: "#EEF2FF", color: "#4338CA" }}>
                          <MessageSquare size={13} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
