import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReactImport from 'highcharts-react-official';
import { Target, Users, TrendingUp, BarChart3 } from 'lucide-react';

const HighchartsReact = HighchartsReactImport.default || HighchartsReactImport;
Highcharts.setOptions({ accessibility: { enabled: false } });

const sourceEffectivenessOptions = {
  chart: { type: 'pie', backgroundColor: 'transparent', height: 300 },
  title: { text: null },
  credits: { enabled: false },
  plotOptions: { pie: { innerSize: '60%', dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.percentage:.1f} %' } } },
  series: [{
    name: 'Leads',
    data: [
      { name: 'Facebook Ads', y: 45, color: '#1877F2' },
      { name: 'Google Search', y: 25, color: '#EA4335' },
      { name: 'Website Organic', y: 15, color: '#34A853' },
      { name: 'Referral', y: 10, color: '#FBBC05' },
      { name: 'Field Execs', y: 5, color: '#8B5CF6' }
    ]
  }]
};

const conversionTrendOptions = {
  chart: { type: 'areaspline', backgroundColor: 'transparent', height: 300 },
  title: { text: null },
  xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], gridLineWidth: 0 },
  yAxis: { title: { text: 'Conversion Rate (%)' }, gridLineDashStyle: 'Dash' },
  credits: { enabled: false },
  legend: { enabled: false },
  plotOptions: { areaspline: { fillOpacity: 0.1, lineWidth: 3, marker: { enabled: true, radius: 4 } } },
  series: [{ name: 'Conversion Rate', data: [12, 14, 15, 18, 22, 25], color: '#10B981' }]
};

const execPerformanceOptions = {
  chart: { type: 'bar', backgroundColor: 'transparent', height: 300 },
  title: { text: null },
  xAxis: { categories: ['Rahul S.', 'Priya M.', 'Vikram K.', 'Meena K.'], gridLineWidth: 0 },
  yAxis: { title: { text: 'Leads Handled' }, gridLineDashStyle: 'Dash' },
  credits: { enabled: false },
  legend: { enabled: true },
  plotOptions: { series: { stacking: 'normal', borderRadius: 4, borderWidth: 0 } },
  series: [
    { name: 'Converted', data: [45, 30, 25, 20], color: '#10B981' },
    { name: 'In Process', data: [15, 20, 10, 5], color: '#3B82F6' },
    { name: 'Lost', data: [10, 5, 8, 2], color: '#EF4444' }
  ]
};

export default function LeadReports() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Analytics & Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Track conversion metrics, source ROI, and team performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads (YTD)', value: '12,450', icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Avg Conversion Rate', value: '18.4%', icon: Target, color: 'text-green-600 bg-green-50 border-green-100' },
          { label: 'Cost Per Acquisition', value: '₹1,250', icon: TrendingUp, color: 'text-purple-600 bg-purple-50 border-purple-100' },
          { label: 'Active Pipeline', value: '450', icon: BarChart3, color: 'text-orange-600 bg-orange-50 border-orange-100' },
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg border ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{card.label}</p>
              <h3 className="text-xl font-black text-gray-900 mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Lead Source Effectiveness</h3>
          <HighchartsReact highcharts={Highcharts} options={sourceEffectivenessOptions} />
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">M-o-M Conversion Trend</h3>
          <HighchartsReact highcharts={Highcharts} options={conversionTrendOptions} />
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Executive Performance (Leads Handled)</h3>
          <HighchartsReact highcharts={Highcharts} options={execPerformanceOptions} />
        </div>

      </div>

    </div>
  );
}
