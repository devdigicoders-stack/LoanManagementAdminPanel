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

export default function FinancialReports() {
  const [dateRange, setDateRange] = useState("This Month");

  const collectionChart = {
    chart: { type: 'pie', backgroundColor: 'transparent', height: 300 },
    title: { text: '' },
    plotOptions: { pie: { innerSize: '60%', dataLabels: { enabled: false }, showInLegend: true } },
    series: [{
      name: 'Amount',
      data: [
        { name: 'UPI', y: 45000, color: tc.primary },
        { name: 'Bank Transfer', y: 35000, color: tc.blue },
        { name: 'Cash', y: 20000, color: '#15803D' }
      ]
    }],
    credits: { enabled: false },
    legend: { itemStyle: { color: tc.text } }
  };

  const expenseChart = {
    chart: { type: 'column', backgroundColor: 'transparent', height: 300 },
    title: { text: '' },
    xAxis: { categories: ['Office', 'Travel', 'Marketing', 'Software', 'Other'], lineColor: tc.border },
    yAxis: { title: { text: '' }, gridLineColor: tc.border },
    series: [
      { name: 'Expenses', data: [15000, 8000, 45000, 12000, 5000], color: '#DC2626' }
    ],
    credits: { enabled: false },
    legend: { itemStyle: { color: tc.text } }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Financial Reports</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Analyze collections, payments, refunds, expenses and outstanding amounts.</p>
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
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90 shadow-sm" style={{ background: tc.blue }}>
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <h2 className="text-[15px] font-extrabold mb-4 flex items-center justify-between" style={{ color: tc.text }}>
            Collection by Method
            <span className="text-[12px] font-bold px-2 py-1 rounded-md" style={{ background: tc.sky, color: tc.blue }}>Total: ₹1.0L</span>
          </h2>
          <HighchartsReact highcharts={Highcharts} options={collectionChart} />
        </div>

        <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <h2 className="text-[15px] font-extrabold mb-4 flex items-center justify-between" style={{ color: tc.text }}>
            Expense by Category
            <span className="text-[12px] font-bold px-2 py-1 rounded-md bg-red-50 text-red-600">Total: ₹85K</span>
          </h2>
          <HighchartsReact highcharts={Highcharts} options={expenseChart} />
        </div>

      </div>

      <div className="rounded-2xl p-5 w-full" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-extrabold" style={{ color: tc.text }}>Outstanding Overview</h2>
          <button className="flex items-center gap-1 text-[12px] font-bold" style={{ color: tc.blue }}><Filter size={14} /> Filter</button>
        </div>
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            chart: { type: 'bar', backgroundColor: 'transparent', height: 250 },
            title: { text: '' },
            xAxis: { categories: ['Home Loan', 'Personal Loan', 'Auto Loan', 'Business Loan'], lineColor: tc.border },
            yAxis: { title: { text: '' }, gridLineColor: tc.border },
            plotOptions: { series: { stacking: 'normal' } },
            series: [
              { name: 'Paid', data: [150000, 50000, 80000, 40000], color: '#15803D' },
              { name: 'Outstanding', data: [350000, 150000, 20000, 10000], color: '#DC2626' }
            ],
            credits: { enabled: false },
            legend: { itemStyle: { color: tc.text } }
          }}
        />
      </div>
    </div>
  );
}
