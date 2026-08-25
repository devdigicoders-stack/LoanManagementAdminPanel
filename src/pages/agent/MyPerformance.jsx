import { TrendingUp, Target, MapPin, CalendarCheck, FolderOpen, FileText } from "lucide-react";
import React from "react";
import Highcharts from "highcharts";
import HighchartsReactPkg from "highcharts-react-official";
const HighchartsReact = HighchartsReactPkg.default || HighchartsReactPkg;

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function MyPerformance() {
  const stats = [
    { label: "Assigned Leads", value: 45, icon: Target, color: "#DFF3FF", iconColor: "#1e7ba8" },
    { label: "Customer Visits", value: 38, icon: MapPin, color: "#EEF2FF", iconColor: "#4338CA" },
    { label: "Visits Completed", value: 30, icon: MapPin, color: "#DCFCE7", iconColor: "#15803D" },
    { label: "Follow-ups", value: 56, icon: CalendarCheck, color: "#FEF3C7", iconColor: "#D97706" },
    { label: "Docs Collected", value: 25, icon: FolderOpen, color: "#FEF9C3", iconColor: "#CA8A04" },
    { label: "Applications", value: 12, icon: FileText, color: "#F3E8FF", iconColor: "#7E22CE" },
    { label: "Converted Leads", value: 8, icon: TrendingUp, color: "#D1FAE5", iconColor: "#059669" },
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}>
            My Performance <span className="px-3 py-1 rounded-full text-[12px] bg-green-100 text-green-700 ml-2">Conversion Rate: 18%</span>
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Track your sales activities and conversions.</p>
        </div>
        <select className="h-10 px-3 rounded-lg text-[13px] font-bold outline-none bg-white" style={{ border: `1px solid ${tc.border}`, color: tc.text }}>
          <option>This Month</option>
          <option>This Week</option>
          <option>Today</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="rounded-2xl p-4 flex flex-col gap-2" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: stat.color }}>
                  <Icon size={17} style={{ color: stat.iconColor }} />
                </div>
                <span className="text-[24px] font-extrabold" style={{ color: tc.text }}>{stat.value}</span>
              </div>
              <div>
                <p className="text-[12px] font-bold" style={{ color: tc.text }}>{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl p-6 w-full" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <h2 className="text-[16px] font-extrabold mb-4" style={{ color: tc.text }}>Activity vs Conversion</h2>
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            chart: { type: 'column', backgroundColor: 'transparent', height: 350 },
            title: { text: '' },
            xAxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], lineColor: tc.border },
            yAxis: { title: { text: '' }, gridLineColor: tc.border },
            series: [
              { name: 'Leads Assigned', data: [12, 15, 8, 10], color: tc.skyMid },
              { name: 'Visits', data: [8, 10, 6, 6], color: tc.primary },
              { name: 'Conversions', data: [2, 3, 1, 2], color: '#15803D' }
            ],
            credits: { enabled: false },
            legend: { itemStyle: { color: tc.text } }
          }}
        />
      </div>

    </div>
  );
}
