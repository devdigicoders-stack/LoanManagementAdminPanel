import { useState } from "react";
import { BarChart3, TrendingUp, Target, Phone, Users, Star, CalendarCheck, CheckCircle2, XCircle, Filter } from "lucide-react";

const tc = {
  card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  cream: "#FFF8E7", text: "#344054", muted: "#667085", border: "#D9EAF2", blue: "#1e7ba8",
};

export default function MyPerformance() {
  const [filter, setFilter] = useState("This Month");

  const stats = [
    { label: "Total Leads", value: 45, icon: Target, bg: tc.sky, col: tc.blue },
    { label: "Calls Made", value: 120, icon: Phone, bg: "#EEF2FF", col: "#4338CA" },
    { label: "Customers Contacted", value: 38, icon: Users, bg: tc.cream, col: "#D97706" },
    { label: "Interested Leads", value: 15, icon: Star, bg: "#FEF9C3", col: "#CA8A04" },
    { label: "Follow-ups Completed", value: 40, icon: CalendarCheck, bg: "#F4F4F5", col: "#52525B" },
    { label: "Converted Leads", value: 8, icon: CheckCircle2, bg: "#DCFCE7", col: "#15803D" },
    { label: "Lost Leads", value: 5, icon: XCircle, bg: "#FEE2E2", col: "#DC2626" },
  ];

  const conversionRate = Math.round((8 / 45) * 100);

  const chartData = [
    { label: "Leads Assigned", value: 45, max: 50 },
    { label: "Calls Made", value: 120, max: 150 },
    { label: "Contacted", value: 38, max: 50 },
    { label: "Interested", value: 15, max: 50 },
    { label: "Converted", value: 8, max: 50 },
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}>
            <BarChart3 size={22} style={{ color: tc.primary }} /> My Performance
          </h1>
          <p className="text-[13px] mt-1" style={{ color: tc.muted }}>View your sales performance and conversion metrics.</p>
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.primary }} />
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="pl-8 pr-4 h-10 rounded-xl text-[13px] font-bold border outline-none appearance-none cursor-pointer bg-white"
            style={{ borderColor: tc.border, color: tc.text }}>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Conversion Rate Card */}
        <div className="md:col-span-1 rounded-2xl p-6 flex flex-col items-center justify-center text-center" style={{ background: tc.sky, border: `1px solid ${tc.skyMid}` }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#FFFFFF", color: tc.blue }}>
            <TrendingUp size={28} />
          </div>
          <h3 className="text-[14px] font-bold mb-1" style={{ color: tc.muted }}>Conversion Rate</h3>
          <p className="text-[42px] font-extrabold leading-none" style={{ color: tc.blue }}>{conversionRate}%</p>
          <p className="text-[11px] font-semibold mt-3 px-3 py-1 bg-white rounded-full" style={{ color: tc.muted }}>
            8 Converted / 45 Total Leads
          </p>
        </div>

        {/* Stats Grid */}
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.bg, color: s.col }}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-[20px] font-extrabold" style={{ color: tc.text }}>{s.value}</p>
                  <p className="text-[12px] font-semibold" style={{ color: tc.muted }}>{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Chart */}
      <div className="rounded-2xl p-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <h3 className="text-[15px] font-extrabold mb-6" style={{ color: tc.text }}>Activity Overview</h3>
        <div className="space-y-5">
          {chartData.map((d, i) => {
            const pct = Math.round((d.value / d.max) * 100);
            return (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[12px] font-bold" style={{ color: tc.muted }}>{d.label}</span>
                  <span className="text-[13px] font-extrabold" style={{ color: tc.blue }}>{d.value}</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: tc.sky }}>
                  <div className="h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${pct}%`, background: tc.blue }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
