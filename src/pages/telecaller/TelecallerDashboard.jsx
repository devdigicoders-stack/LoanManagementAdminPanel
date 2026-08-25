import { Link } from "react-router-dom";
import {
  Target, Phone, CalendarCheck, Clock, Star, FolderOpen,
  TrendingUp, XCircle, Activity, ChevronRight, Eye, Plus, BarChart2
} from "lucide-react";
import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import { mockLeads, statusColors } from "./telecallerData";

const tc = {
  bg: "#FAFCFD",
  card: "#FFFFFF",
  sky: "#DFF3FF",
  skyMid: "#BFE7F7",
  primary: "#8ED3F4",
  cream: "#FFF8E7",
  text: "#344054",
  muted: "#667085",
  border: "#D9EAF2",
  blue: "#1e7ba8",
};

const summaryCards = [
  { label: "My Total Leads",      value: 6,  sub: "Total leads assigned to you",             icon: Target,       color: "#DFF3FF", iconColor: "#1e7ba8" },
  { label: "New Leads",           value: 1,  sub: "Leads that need first contact",           icon: Plus,         color: "#FFF8E7", iconColor: "#D97706" },
  { label: "Today's Calls",       value: 4,  sub: "Customer calls scheduled for today",      icon: Phone,        color: "#EEF2FF", iconColor: "#4338CA" },
  { label: "Pending Follow-ups",  value: 2,  sub: "Follow-ups requiring action",             icon: Clock,        color: "#FEF3C7", iconColor: "#D97706" },
  { label: "Interested Leads",    value: 1,  sub: "Customers interested in the loan",        icon: Star,         color: "#DCFCE7", iconColor: "#15803D" },
  { label: "Documents Pending",   value: 1,  sub: "Customers whose documents are pending",   icon: FolderOpen,   color: "#FEF9C3", iconColor: "#CA8A04" },
  { label: "Converted Leads",     value: 0,  sub: "Successfully converted leads",            icon: TrendingUp,   color: "#D1FAE5", iconColor: "#059669" },
  { label: "Lost Leads",          value: 1,  sub: "Leads marked as lost",                   icon: XCircle,      color: "#FEE2E2", iconColor: "#DC2626" },
];

const todayActivity = [
  { label: "Calls Scheduled",      value: 10, color: "#1e7ba8" },
  { label: "Calls Completed",      value: 7,  color: "#15803D" },
  { label: "Follow-ups Pending",   value: 3,  color: "#D97706" },
  { label: "Pending Calls",        value: 3,  color: "#4338CA" },
  { label: "Documents Collected",  value: 2,  color: "#059669" },
];

const quickActions = [
  { label: "My Leads",          path: "/telecaller/leads",       bg: "#DFF3FF",  col: "#1e7ba8" },
  { label: "Add New Lead",      path: "/telecaller/leads/add",   bg: "#FFF8E7",  col: "#D97706" },
  { label: "Today's Follow-ups",path: "/telecaller/followups",   bg: "#EEF2FF",  col: "#4338CA" },
  { label: "Add Remark",        path: "/telecaller/remarks",     bg: "#DCFCE7",  col: "#15803D" },
  { label: "Upload Document",   path: "/telecaller/documents",   bg: "#FEF9C3",  col: "#CA8A04" },
];

export default function TelecallerDashboard() {
  const name = localStorage.getItem(`adminName_${localStorage.getItem("userRole")}`) || "Telecaller";

  const chartOptions = {
    chart: { type: "areaspline", backgroundColor: "transparent", height: 200, margin: [20, 0, 20, 0] },
    title: { text: "" },
    xAxis: { visible: false },
    yAxis: { visible: false },
    plotOptions: {
      areaspline: { fillOpacity: 0.2, marker: { enabled: false } }
    },
    series: [{
      name: "Calls",
      data: [12, 18, 15, 22, 28, 20, 34],
      color: tc.blue,
      fillColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [[0, "rgba(30, 123, 168, 0.4)"], [1, "rgba(30, 123, 168, 0)"]]
      }
    }],
    credits: { enabled: false },
    tooltip: { outside: true }
  };

  return (
    <div className="space-y-6" style={{ color: tc.text }}>

      {/* Header */}
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>My Dashboard</h1>
        <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>
          Welcome back, <strong>{name}</strong> — Manage your assigned leads, follow-ups and customer interactions.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="rounded-2xl p-4 flex flex-col gap-2"
              style={{ background: tc.card, border: `1px solid ${tc.border}`, boxShadow: "0 1px 6px rgba(142,211,244,0.08)" }}>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: card.color }}>
                  <Icon size={17} style={{ color: card.iconColor }} />
                </div>
                <span className="text-[24px] font-extrabold" style={{ color: tc.text }}>{card.value}</span>
              </div>
              <div>
                <p className="text-[13px] font-bold" style={{ color: tc.text }}>{card.label}</p>
                <p className="text-[11px]" style={{ color: tc.muted }}>{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Today's Activity */}
        <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <div className="flex items-center gap-2 mb-4">
            <Activity size={17} style={{ color: tc.primary }} />
            <h2 className="text-[15px] font-extrabold" style={{ color: tc.text }}>Today's Activity</h2>
          </div>
          <div className="space-y-3">
            {todayActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: a.color }} />
                  <span className="text-[13px] font-semibold" style={{ color: tc.text }}>{a.label}</span>
                </div>
                <span className="text-[13px] font-extrabold px-3 py-0.5 rounded-full" style={{ background: tc.sky, color: tc.blue }}>{a.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl p-5" style={{ background: tc.cream, border: `1px solid ${tc.border}` }}>
          <h2 className="text-[15px] font-extrabold mb-4" style={{ color: tc.text }}>Quick Actions</h2>
          <div className="flex flex-col gap-2">
            {quickActions.map((a, i) => (
              <Link key={i} to={a.path}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl transition-all hover:opacity-90"
                style={{ background: a.bg, border: `1px solid ${tc.border}` }}>
                <span className="text-[13px] font-bold" style={{ color: a.col }}>{a.label}</span>
                <ChevronRight size={15} style={{ color: a.col }} />
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="rounded-2xl p-5 flex flex-col justify-between" style={{ background: tc.sky, border: `1px solid ${tc.skyMid}` }}>
          <div>
            <h2 className="text-[15px] font-extrabold mb-1" style={{ color: tc.blue }}>This Month Activity</h2>
            <p className="text-[12px] font-medium mb-4" style={{ color: tc.blue }}>Visual trend of your calls</p>
          </div>
          <div className="-mx-5 -mb-5 mt-auto">
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="rounded-2xl" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${tc.border}` }}>
          <h2 className="text-[15px] font-extrabold" style={{ color: tc.text }}>Recent Assigned Leads</h2>
          <Link to="/telecaller/leads" className="text-[12px] font-bold flex items-center gap-1" style={{ color: tc.blue }}>
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: tc.sky }}>
                {["Lead ID", "Customer Name", "Mobile", "Loan Type", "Amount", "Status", "Next Follow-up", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockLeads.slice(0, 5).map((lead, i) => {
                const sc = statusColors[lead.status] || { bg: "#F1F5F9", text: "#64748B" };
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-[#FAFCFD] transition-colors">
                    <td className="px-4 py-3 font-bold" style={{ color: tc.blue }}>{lead.id}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.text }}>{lead.customerName}</td>
                    <td className="px-4 py-3" style={{ color: tc.muted }}>{lead.mobile}</td>
                    <td className="px-4 py-3" style={{ color: tc.muted }}>{lead.loanType}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.text }}>₹{Number(lead.amount).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: sc.bg, color: sc.text }}>{lead.status}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{lead.nextFollowup}</td>
                    <td className="px-4 py-3">
                      <Link to={`/telecaller/leads/${lead.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors"
                        style={{ background: tc.sky, color: tc.blue }}>
                        <Eye size={12} /> View
                      </Link>
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
