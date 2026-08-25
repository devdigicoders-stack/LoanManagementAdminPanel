import { useState } from "react";
import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import { PieChart, TrendingUp, BarChart2, Activity, CalendarDays, Filter } from "lucide-react";

const tc = {
  card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7", primary: "#8ED3F4",
  cream: "#FFF8E7", text: "#344054", muted: "#667085", border: "#D9EAF2", blue: "#1e7ba8",
};

export default function TelecallerReports() {
  const [filter, setFilter] = useState("This Month");

  // Chart 1: Lead Status Distribution (Pie Chart)
  const leadStatusOptions = {
    chart: { type: "pie", backgroundColor: "transparent", height: 300 },
    title: { text: "" },
    tooltip: { pointFormat: "<b>{point.y} Leads</b> ({point.percentage:.1f}%)" },
    plotOptions: {
      pie: {
        innerSize: "60%",
        borderWidth: 2,
        borderColor: "#FFFFFF",
        dataLabels: { enabled: false },
        showInLegend: true
      }
    },
    legend: { itemStyle: { color: tc.text, fontSize: "11px" } },
    series: [{
      name: "Leads",
      colorByPoint: true,
      data: [
        { name: "New", y: 15, color: "#1e7ba8" },
        { name: "Contacted", y: 20, color: "#8ED3F4" },
        { name: "Interested", y: 10, color: "#15803D" },
        { name: "Follow-up", y: 12, color: "#D97706" },
        { name: "Lost", y: 5, color: "#DC2626" }
      ]
    }],
    credits: { enabled: false }
  };

  // Chart 2: Daily Call Activity (Column Chart)
  const callActivityOptions = {
    chart: { type: "column", backgroundColor: "transparent", height: 300 },
    title: { text: "" },
    xAxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], lineColor: tc.border },
    yAxis: { title: { text: "Number of Calls" }, gridLineColor: tc.border },
    tooltip: { shared: true },
    plotOptions: { column: { borderRadius: 4, pointPadding: 0.1 } },
    series: [
      { name: "Scheduled", data: [15, 20, 18, 25, 22, 10, 5], color: tc.sky },
      { name: "Completed", data: [12, 18, 15, 22, 20, 8, 3], color: tc.blue }
    ],
    credits: { enabled: false }
  };

  // Chart 3: Conversion Trend (Area Chart)
  const conversionTrendOptions = {
    chart: { type: "areaspline", backgroundColor: "transparent", height: 300 },
    title: { text: "" },
    xAxis: { categories: ["Week 1", "Week 2", "Week 3", "Week 4"], lineColor: tc.border },
    yAxis: { title: { text: "Leads Converted" }, gridLineColor: tc.border },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.2,
        marker: { radius: 4, symbol: "circle" }
      }
    },
    series: [{
      name: "Converted Leads",
      data: [2, 5, 4, 8],
      color: "#15803D",
      fillColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [[0, "rgba(21, 128, 61, 0.4)"], [1, "rgba(21, 128, 61, 0)"]]
      }
    }],
    credits: { enabled: false }
  };

  // Chart 4: Loan Type Demand (Bar Chart)
  const loanTypeOptions = {
    chart: { type: "bar", backgroundColor: "transparent", height: 300 },
    title: { text: "" },
    xAxis: { categories: ["Home Loan", "LAP", "Business", "Personal", "Other"], lineColor: tc.border },
    yAxis: { title: { text: "Interest Volume" }, gridLineColor: tc.border },
    plotOptions: { bar: { borderRadius: 4, colorByPoint: true } },
    colors: ["#1e7ba8", "#D97706", "#15803D", "#4338CA", "#667085"],
    series: [{ name: "Leads", data: [25, 18, 12, 8, 4], showInLegend: false }],
    credits: { enabled: false }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}>
            <Activity size={22} style={{ color: tc.primary }} /> Reports & Analytics
          </h1>
          <p className="text-[13px] mt-1" style={{ color: tc.muted }}>Visual insights into your leads, calls, and conversions.</p>
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.primary }} />
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="pl-8 pr-4 h-10 rounded-xl text-[13px] font-bold border outline-none appearance-none cursor-pointer bg-white"
            style={{ borderColor: tc.border, color: tc.text }}>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: 62, icon: PieChart, color: tc.blue, bg: tc.sky },
          { label: "Calls Completed", value: 145, icon: Activity, color: "#4338CA", bg: "#EEF2FF" },
          { label: "Conversion Rate", value: "14.5%", icon: TrendingUp, color: "#15803D", bg: "#DCFCE7" },
          { label: "Follow-ups", value: 48, icon: CalendarDays, color: "#D97706", bg: "#FEF3C7" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="rounded-2xl p-4 flex items-center gap-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg, color: s.color }}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-[22px] font-extrabold" style={{ color: tc.text }}>{s.value}</p>
                <p className="text-[12px] font-bold" style={{ color: tc.muted }}>{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Lead Status Pie */}
        <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <div className="flex items-center gap-2 mb-4">
            <PieChart size={16} style={{ color: tc.blue }} />
            <h3 className="text-[15px] font-extrabold" style={{ color: tc.text }}>Lead Status Distribution</h3>
          </div>
          <HighchartsReact highcharts={Highcharts} options={leadStatusOptions} />
        </div>

        {/* Call Activity Column */}
        <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} style={{ color: tc.blue }} />
            <h3 className="text-[15px] font-extrabold" style={{ color: tc.text }}>Daily Call Activity</h3>
          </div>
          <HighchartsReact highcharts={Highcharts} options={callActivityOptions} />
        </div>

        {/* Conversion Trend Area */}
        <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} style={{ color: "#15803D" }} />
            <h3 className="text-[15px] font-extrabold" style={{ color: tc.text }}>Conversion Trend</h3>
          </div>
          <HighchartsReact highcharts={Highcharts} options={conversionTrendOptions} />
        </div>

        {/* Loan Type Demand Bar */}
        <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} style={{ color: "#D97706" }} />
            <h3 className="text-[15px] font-extrabold" style={{ color: tc.text }}>Loan Type Demand</h3>
          </div>
          <HighchartsReact highcharts={Highcharts} options={loanTypeOptions} />
        </div>
        
      </div>
    </div>
  );
}
