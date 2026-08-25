import { Link } from "react-router-dom";
import { MapPin, CalendarCheck, Clock, CheckCircle, XCircle, RefreshCw, Eye, Plus } from "lucide-react";
import { mockCustomerVisits } from "./agentData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function CustomerVisits() {
  const cards = [
    { label: "Today's Visits", value: 2, icon: MapPin, color: "#EEF2FF", iconColor: "#4338CA" },
    { label: "Upcoming Visits", value: 1, icon: Clock, color: "#FEF3C7", iconColor: "#D97706" },
    { label: "Completed Visits", value: 1, icon: CheckCircle, color: "#DCFCE7", iconColor: "#15803D" },
    { label: "Missed Visits", value: 0, icon: XCircle, color: "#FEE2E2", iconColor: "#DC2626" },
    { label: "Rescheduled", value: 0, icon: RefreshCw, color: "#F3E8FF", iconColor: "#7E22CE" },
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Customer Visits</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Schedule and manage customer meetings and field visits.</p>
        </div>
        <Link to="/agent/visits/add" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90" style={{ background: tc.blue }}>
          <Plus size={16} /> Schedule Visit
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
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

      <div className="rounded-2xl overflow-hidden w-full" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: tc.sky }}>
                {["Visit ID", "Lead ID", "Customer", "Mobile", "Visit Date", "Time", "Location", "Purpose", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockCustomerVisits.map((visit, i) => {
                let statusStyle = { bg: "#F1F5F9", text: "#64748B" };
                if (visit.status === "Scheduled") statusStyle = { bg: "#FEF3C7", text: "#D97706" };
                if (visit.status === "Confirmed") statusStyle = { bg: "#DBEAFE", text: "#1D4ED8" };
                if (visit.status === "Completed") statusStyle = { bg: "#DCFCE7", text: "#15803D" };
                if (visit.status === "Rescheduled") statusStyle = { bg: "#F3E8FF", text: "#7E22CE" };
                if (visit.status === "Missed" || visit.status === "Cancelled") statusStyle = { bg: "#FEE2E2", text: "#DC2626" };

                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-[#FAFCFD] transition-colors">
                    <td className="px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{visit.id}</td>
                    <td className="px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.muted }}>{visit.leadId}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: tc.text }}>{visit.customerName}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{visit.mobile}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.text }}>{visit.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.text }}>{visit.time}</td>
                    <td className="px-4 py-3 min-w-[200px]" style={{ color: tc.muted }}>{visit.location}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{visit.purpose}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap" style={{ background: statusStyle.bg, color: statusStyle.text }}>{visit.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/agent/visits/${visit.id}`} title="View Visit" className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80" style={{ background: tc.sky, color: tc.blue }}>
                        <Eye size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              
              {mockCustomerVisits.length === 0 && (
                <tr>
                  <td colSpan="10" className="px-4 py-12 text-center">
                    <p className="text-[14px] font-bold" style={{ color: tc.text }}>No visits scheduled</p>
                    <p className="text-[12px] mt-1" style={{ color: tc.muted }}>You don't have any upcoming customer visits.</p>
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
