import { Link } from "react-router-dom";
import {
  Target, MapPin, CalendarCheck, Clock, Star, FolderOpen,
  FileText, TrendingUp, Activity, ChevronRight, Eye, Plus
} from "lucide-react";
import React from "react";
import Highcharts from "highcharts";
import HighchartsReactPkg from "highcharts-react-official";
const HighchartsReact = HighchartsReactPkg.default || HighchartsReactPkg;
import { mockAgentLeads, statusColors } from "./agentData";

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
  { label: "My Total Leads",          value: 5,  sub: "Total leads assigned to you",             icon: Target,       color: "#DFF3FF", iconColor: "#1e7ba8" },
  { label: "New Leads",               value: 1,  sub: "Leads that need first contact",           icon: Plus,         color: "#FFF8E7", iconColor: "#D97706" },
  { label: "Today's Visits",          value: 2,  sub: "Customer visits scheduled today",         icon: MapPin,       color: "#EEF2FF", iconColor: "#4338CA" },
  { label: "Upcoming Visits",         value: 1,  sub: "Customer meetings scheduled later",       icon: Clock,        color: "#DCFCE7", iconColor: "#15803D" },
  { label: "Pending Follow-ups",      value: 3,  sub: "Follow-ups requiring action",             icon: CalendarCheck,color: "#FEF3C7", iconColor: "#D97706" },
  { label: "Documents Pending",       value: 1,  sub: "Customers whose documents are pending",   icon: FolderOpen,   color: "#FEF9C3", iconColor: "#CA8A04" },
  { label: "Applications Generated",  value: 3,  sub: "Applications submitted for review",       icon: FileText,     color: "#F3E8FF", iconColor: "#7E22CE" },
  { label: "Converted Leads",         value: 0,  sub: "Successfully converted leads",            icon: TrendingUp,   color: "#D1FAE5", iconColor: "#059669" },
];

const todayActivity = [
  { label: "Visits Scheduled",       value: 2,  color: "#1e7ba8" },
  { label: "Visits Completed",       value: 1,  color: "#15803D" },
  { label: "Customer Meetings",      value: 1,  color: "#7E22CE" },
  { label: "Follow-ups Pending",     value: 3,  color: "#D97706" },
  { label: "Documents Collected",    value: 0,  color: "#CA8A04" },
];

const quickActions = [
  { label: "My Leads",          path: "/agent/leads",       bg: "#DFF3FF",  col: "#1e7ba8" },
  { label: "Schedule Visit",    path: "/agent/visits/add",  bg: "#FFF8E7",  col: "#D97706" },
  { label: "Today's Visits",    path: "/agent/visits",      bg: "#EEF2FF",  col: "#4338CA" },
  { label: "Add Follow-up",     path: "/agent/followups",   bg: "#DCFCE7",  col: "#15803D" },
  { label: "Upload Document",   path: "/agent/documents",   bg: "#FEF9C3",  col: "#CA8A04" },
  { label: "Add Remark",        path: "/agent/remarks",     bg: "#F3E8FF",  col: "#7E22CE" },
];

export default function AgentDashboard() {
  const name = localStorage.getItem(`adminName_${localStorage.getItem("userRole")}`) || "Agent Operator";

  const chartOptions = {
    chart: { type: 'spline', backgroundColor: 'transparent', height: 280 },
    title: { text: '' },
    xAxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], lineColor: tc.border },
    yAxis: { title: { text: '' }, gridLineColor: tc.border },
    series: [
      { name: 'Visits', data: [1, 3, 2, 4, 1, 5, 2], color: tc.primary },
      { name: 'Conversions', data: [0, 1, 0, 2, 0, 1, 1], color: '#15803D' }
    ],
    credits: { enabled: false },
    legend: { itemStyle: { color: tc.text } }
  };

  return (
    <div className="space-y-6 w-full" style={{ color: tc.text }}>

      {/* Header */}
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Agent Dashboard</h1>
        <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>
          Welcome back, <strong>{name}</strong> — Manage your assigned leads, customer visits, follow-ups and sales activities.
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

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
          <div className="grid grid-cols-2 gap-2">
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
      </div>

      {/* Chart Section */}
      <div className="rounded-2xl p-5 w-full" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <h2 className="text-[15px] font-extrabold mb-4" style={{ color: tc.text }}>Weekly Performance</h2>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>

      {/* Recent Leads */}
      <div className="rounded-2xl w-full" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${tc.border}` }}>
          <h2 className="text-[15px] font-extrabold" style={{ color: tc.text }}>Recent Assigned Leads</h2>
          <Link to="/agent/leads" className="text-[12px] font-bold flex items-center gap-1" style={{ color: tc.blue }}>
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: tc.sky }}>
                {["Lead ID", "Customer Name", "Mobile", "Loan Type", "Amount", "Status", "Next Activity", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockAgentLeads.slice(0, 5).map((lead, i) => {
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
                      <Link to={`/agent/leads/${lead.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors w-fit"
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
