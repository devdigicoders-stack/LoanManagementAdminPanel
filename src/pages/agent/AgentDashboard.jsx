import { Link } from "react-router-dom";
import {
  Target, MapPin, CalendarCheck, Clock, Star, FolderOpen,
  FileText, TrendingUp, Activity, ChevronRight, Eye, Plus, Loader2
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReactPkg from "highcharts-react-official";
const HighchartsReact = HighchartsReactPkg.default || HighchartsReactPkg;
import { statusColors } from "./agentData";
import toast from "react-hot-toast";

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

export default function AgentDashboard() {
  const name = localStorage.getItem(`adminName_${localStorage.getItem("userRole")}`) || "Field Agent";
  const [visitStats, setVisitStats] = useState({ total: 0, scheduled: 0, completed: 0 });
  const [leadsCount, setLeadsCount] = useState(0);
  const [recentVisits, setRecentVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentData();
  }, []);

  const fetchAgentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const [vStatsRes, visitsRes, leadsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/visits/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/visits`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/leads?unassigned=false`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (vStatsRes.ok) {
        const vs = await vStatsRes.json();
        setVisitStats(vs);
      }
      if (visitsRes.ok) {
        const vList = await visitsRes.json();
        setRecentVisits(vList);
      }
      if (leadsRes.ok) {
        const lList = await leadsRes.json();
        setLeadsCount(lList.length);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch agent statistics");
    } finally {
      setLoading(false);
    }
  };

  const summaryCards = [
    { label: "My Total Leads",          value: leadsCount.toString(),  sub: "Active leads in pipeline",               icon: Target,       color: "#DFF3FF", iconColor: "#1e7ba8" },
    { label: "Total Field Visits",      value: visitStats.total.toString(),  sub: "Total customer visits in system",    icon: MapPin,       color: "#EEF2FF", iconColor: "#4338CA" },
    { label: "Scheduled Visits",        value: visitStats.scheduled.toString(),  sub: "Upcoming site verifications",   icon: Clock,        color: "#FFF8E7", iconColor: "#D97706" },
    { label: "Completed Visits",        value: visitStats.completed.toString(),  sub: "Reports & docs collected",      icon: CalendarCheck,color: "#DCFCE7", iconColor: "#15803D" },
    { label: "Verification Success",    value: visitStats.total ? `${Math.round((visitStats.completed / visitStats.total) * 100)}%` : "0%", sub: "Field verification completion", icon: TrendingUp, color: "#D1FAE5", iconColor: "#059669" },
    { label: "Priority In-Progress",    value: visitStats.inProgress?.toString() || "0", sub: "Currently active on field", icon: Activity, color: "#FEF9C3", iconColor: "#CA8A04" },
    { label: "Cancelled / Rescheduled", value: visitStats.cancelled?.toString() || "0", sub: "Customer unavailable",  icon: FolderOpen,   color: "#FEE2E2", iconColor: "#DC2626" },
    { label: "Applications Tracked",    value: "0", sub: "Connected loan accounts",       icon: FileText,     color: "#F3E8FF", iconColor: "#7E22CE" },
  ];

  const quickActions = [
    { label: "Customer Visits",   path: "/agent/visits",      bg: "#EEF2FF",  col: "#4338CA" },
    { label: "Schedule New Visit",path: "/agent/visits/add",  bg: "#FFF8E7",  col: "#D97706" },
    { label: "View Leads Pool",   path: "/agent/leads",       bg: "#DFF3FF",  col: "#1e7ba8" },
    { label: "Follow-ups",        path: "/agent/followups",   bg: "#DCFCE7",  col: "#15803D" },
  ];

  const chartOptions = {
    chart: { type: 'spline', backgroundColor: 'transparent', height: 280 },
    title: { text: '' },
    xAxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], lineColor: tc.border },
    yAxis: { title: { text: '' }, gridLineColor: tc.border },
    series: [
      { name: 'Visits Scheduled', data: [0, 0, 0, 0, 0, 0, 0], color: tc.blue },
      { name: 'Completed & Verified', data: [0, 0, 0, 0, 0, 0, 0], color: '#15803D' }
    ],
    credits: { enabled: false },
    legend: { itemStyle: { color: tc.text } }
  };

  return (
    <div className="space-y-6 w-full" style={{ color: tc.text }}>
      
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Field Agent Command Center</h1>
        <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>
          Welcome back, <strong>{name}</strong> — Live physical verification, address checks and document pickup from MongoDB.
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
                <span className="text-[20px] font-extrabold" style={{ color: tc.text }}>
                  {loading ? "..." : card.value}
                </span>
              </div>
              <div>
                <p className="text-[13px] font-bold" style={{ color: tc.text }}>{card.label}</p>
                <p className="text-[11px]" style={{ color: tc.muted }}>{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {quickActions.map((qa, i) => (
          <Link key={i} to={qa.path}
            className="px-4 py-2.5 rounded-xl font-bold text-[13px] flex items-center gap-2 hover:opacity-90 transition-opacity"
            style={{ background: qa.bg, color: qa.col }}>
            {qa.label} <ChevronRight size={14} />
          </Link>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <h2 className="text-[15px] font-extrabold mb-3" style={{ color: tc.text }}>Weekly Field Visits Performance</h2>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>

      {/* Recent Visits Table */}
      <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-extrabold" style={{ color: tc.text }}>Upcoming & Recent Field Visits</h2>
          <Link to="/agent/visits" className="text-[12px] font-bold hover:underline" style={{ color: tc.blue }}>
            View All ({visitStats.total})
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr style={{ borderBottom: `1px solid ${tc.border}`, color: tc.muted }} className="text-[11px] font-bold uppercase text-left">
                <th className="pb-2.5">Visit ID</th>
                <th className="pb-2.5">Customer Name</th>
                <th className="pb-2.5">Mobile</th>
                <th className="pb-2.5">Purpose</th>
                <th className="pb-2.5">Scheduled Time</th>
                <th className="pb-2.5">Agent</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    <Loader2 size={20} className="animate-spin mx-auto mb-2 text-[#1e7ba8]" />
                    Loading live visits...
                  </td>
                </tr>
              ) : recentVisits.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-400 text-xs">
                    No field visits scheduled yet.
                  </td>
                </tr>
              ) : (
                recentVisits.map((v, idx) => (
                  <tr key={v._id || idx} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-slate-50/50">
                    <td className="py-3 font-bold" style={{ color: tc.blue }}>{v.visitId}</td>
                    <td className="py-3 font-semibold">{v.customerName}</td>
                    <td className="py-3 text-slate-500 font-mono text-xs">{v.mobile}</td>
                    <td className="py-3 font-medium text-slate-700">{v.purpose}</td>
                    <td className="py-3 text-slate-500">
                      {new Date(v.scheduledDate).toLocaleDateString('en-IN')} {v.scheduledTime}
                    </td>
                    <td className="py-3 font-medium text-slate-600">{v.agentName}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        v.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link to="/agent/visits" className="p-1.5 inline-block text-slate-400 hover:text-[#1e7ba8]">
                        <Eye size={15} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
