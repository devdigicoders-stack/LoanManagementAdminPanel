import React, { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReactPkg from "highcharts-react-official";
const HighchartsReact = HighchartsReactPkg.default || HighchartsReactPkg;
import { Download, Calendar, Filter } from "lucide-react";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function AgentReports() {
  const [dateRange, setDateRange] = useState("This Month");

  const conversionChart = {
    chart: { type: 'pie', backgroundColor: 'transparent', height: 300 },
    title: { text: '' },
    plotOptions: {
      pie: { innerSize: '60%', dataLabels: { enabled: false }, showInLegend: true }
    },
    series: [{
      name: 'Leads',
      data: [
        { name: 'Converted', y: 0, color: '#15803D' },
        { name: 'In Progress', y: 0, color: tc.primary },
        { name: 'Lost', y: 0, color: '#DC2626' }
      ]
    }],
    credits: { enabled: false },
    legend: { itemStyle: { color: tc.text } }
  };

  const activityChart = {
    chart: { type: 'area', backgroundColor: 'transparent', height: 300 },
    title: { text: '' },
    xAxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], lineColor: tc.border },
    yAxis: { title: { text: '' }, gridLineColor: tc.border },
    series: [
      { name: 'Visits', data: [0, 0, 0, 0], color: tc.primary, fillOpacity: 0.3 },
      { name: 'Follow-ups', data: [0, 0, 0, 0], color: '#D97706', fillOpacity: 0.3 }
    ],
    credits: { enabled: false },
    legend: { itemStyle: { color: tc.text } }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Analytical Reports</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Detailed charts and graphs of your sales performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white" style={{ border: `1px solid ${tc.border}` }}>
            <Calendar size={14} style={{ color: tc.muted }} />
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="text-[12px] font-bold outline-none bg-transparent" 
              style={{ color: tc.text }}
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90" style={{ background: tc.blue }}>
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Conversion Funnel / Status */}
        <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <h2 className="text-[15px] font-extrabold mb-4" style={{ color: tc.text }}>Lead Conversion Status</h2>
          <HighchartsReact highcharts={Highcharts} options={conversionChart} />
        </div>

        {/* Activity Over Time */}
        <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <h2 className="text-[15px] font-extrabold mb-4" style={{ color: tc.text }}>Field Activity Over Time</h2>
          <HighchartsReact highcharts={Highcharts} options={activityChart} />
        </div>

      </div>

      <div className="rounded-2xl p-5 w-full" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-extrabold" style={{ color: tc.text }}>Application Approval Rate</h2>
          <button className="flex items-center gap-1 text-[12px] font-bold" style={{ color: tc.blue }}><Filter size={14} /> Filter</button>
        </div>
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            chart: { type: 'bar', backgroundColor: 'transparent', height: 250 },
            title: { text: '' },
            xAxis: { categories: ['Personal Loan', 'Home Loan', 'Auto Loan', 'Business Loan'], lineColor: tc.border },
            yAxis: { title: { text: '' }, gridLineColor: tc.border },
            plotOptions: { series: { stacking: 'normal' } },
            series: [
              { name: 'Approved', data: [0, 0, 0, 0], color: '#15803D' },
              { name: 'Rejected', data: [0, 0, 0, 0], color: '#DC2626' },
              { name: 'Pending', data: [0, 0, 0, 0], color: '#D97706' }
            ],
            credits: { enabled: false },
            legend: { itemStyle: { color: tc.text } }
          }}
        />
      </div>
    </div>
  );
}
