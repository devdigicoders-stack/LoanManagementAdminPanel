import { TrendingUp, FileText, CheckCircle, Clock, CreditCard } from 'lucide-react';
import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';

// Sample Data
const recentApplications = [
  { id: 'APP-2025-1250', name: 'Ravi Kumar', type: 'Personal Loan', amount: '₹2,50,000', status: 'Pending', date: '10 May 2025' },
  { id: 'APP-2025-1249', name: 'Priya Sharma', type: 'Home Loan', amount: '₹12,00,000', status: 'Approved', date: '09 May 2025' },
  { id: 'APP-2025-1248', name: 'Amit Verma', type: 'Business Loan', amount: '₹5,00,000', status: 'Pending', date: '09 May 2025' },
  { id: 'APP-2025-1247', name: 'Neha Singh', type: 'Education Loan', amount: '₹1,50,000', status: 'Rejected', date: '08 May 2025' },
  { id: 'APP-2025-1246', name: 'Suresh Patel', type: 'Personal Loan', amount: '₹1,00,000', status: 'Approved', date: '08 May 2025' },
];

const topLoanTypes = [
  { name: 'Personal Loan', percentage: 40, color: 'bg-emerald-500' },
  { name: 'Home Loan', percentage: 30, color: 'bg-blue-600' },
  { name: 'Business Loan', percentage: 20, color: 'bg-emerald-500' },
  { name: 'Education Loan', percentage: 10, color: 'bg-slate-700' },
];

export default function Dashboard() {
  
  // Highcharts Options for Line Chart
  const lineChartOptions = {
    chart: { type: 'spline', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent' },
    title: { text: null },
    xAxis: { 
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: { style: { color: '#64748b', fontSize: '11px', fontWeight: '500' } },
      lineColor: '#e2e8f0',
      tickColor: '#e2e8f0'
    },
    yAxis: { 
      title: { text: null },
      labels: { style: { color: '#64748b', fontSize: '11px', fontWeight: '500' } },
      gridLineColor: '#f1f5f9',
      gridLineDashStyle: 'Dash'
    },
    legend: {
      itemStyle: { color: '#475569', fontWeight: '600', fontSize: '12px' },
      itemHoverStyle: { color: '#0f172a' },
      symbolRadius: 4
    },
    credits: { enabled: false },
    tooltip: { shared: true, crosshairs: true, backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#e2e8f0', borderRadius: 8, style: { color: '#0f172a' } },
    plotOptions: { 
      spline: { 
        marker: { radius: 4, symbol: 'circle', lineWidth: 2, lineColor: '#ffffff' } 
      } 
    },
    series: [
      { name: 'Total', data: [30, 50, 80, 45, 65, 90, 85, 100, 80, 60, 95, 120], color: '#3b82f6' },
      { name: 'Approved', data: [40, 35, 60, 40, 50, 75, 65, 90, 70, 50, 80, 100], color: '#10b981' },
      { name: 'Pending', data: [15, 25, 20, 30, 40, 50, 40, 55, 45, 30, 40, 60], color: '#f59e0b' },
      { name: 'Rejected', data: [5, 10, 5, 15, 25, 20, 15, 25, 30, 35, 25, 20], color: '#ef4444' }
    ]
  };

  // Highcharts Options for Donut Chart
  const donutChartOptions = {
    chart: { type: 'pie', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent' },
    title: { 
      text: '1,248<br/><span style="font-size:12px;color:#64748b;font-weight:normal">Total</span>', 
      align: 'center', 
      verticalAlign: 'middle', 
      y: 15, 
      x: -55, 
      style: { fontSize: '24px', fontWeight: 'bold', color: '#0f172a' } 
    },
    credits: { enabled: false },
    tooltip: { backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#e2e8f0', borderRadius: 8, style: { color: '#0f172a' } },
    plotOptions: { 
      pie: { 
        innerSize: '75%', 
        dataLabels: { enabled: false }, 
        showInLegend: true,
        borderWidth: 2,
        borderColor: '#ffffff'
      } 
    },
    legend: { 
      layout: 'vertical', align: 'right', verticalAlign: 'middle', itemMarginTop: 12, itemMarginBottom: 12,
      itemStyle: { color: '#475569', fontWeight: '600', fontSize: '12px' },
      itemHoverStyle: { color: '#0f172a' },
      symbolRadius: 4
    },
    series: [{
      name: 'Applications',
      data: [
        { name: 'Approved', y: 684, color: '#3b82f6' },
        { name: 'Pending', y: 268, color: '#f59e0b' },
        { name: 'Rejected', y: 296, color: '#ef4444' }
      ]
    }]
  };

  return (
    <div className="w-full">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-inner shrink-0">
            <FileText size={20} strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 truncate">Total Applications</p>
            <h3 className="text-xl font-bold text-slate-800">1,248</h3>
            <p className="text-[11px] font-bold text-emerald-500 flex items-center gap-1 mt-0.5 whitespace-nowrap">
              <TrendingUp size={12} strokeWidth={3} /> 12.5% <span className="text-slate-400 font-medium">vs last month</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(249,115,22,0.1)] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-inner shrink-0">
            <Clock size={20} strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 truncate">Pending Applications</p>
            <h3 className="text-xl font-bold text-slate-800">268</h3>
            <p className="text-[11px] font-bold text-orange-500 flex items-center gap-1 mt-0.5 whitespace-nowrap">
              <TrendingUp size={12} strokeWidth={3} /> 8.2% <span className="text-slate-400 font-medium">vs last month</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.1)] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-inner shrink-0">
            <CheckCircle size={20} strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 truncate">Approved Applications</p>
            <h3 className="text-xl font-bold text-slate-800">684</h3>
            <p className="text-[11px] font-bold text-emerald-500 flex items-center gap-1 mt-0.5 whitespace-nowrap">
              <TrendingUp size={12} strokeWidth={3} /> 15.3% <span className="text-slate-400 font-medium">vs last month</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(147,51,234,0.1)] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-inner shrink-0">
            <CreditCard size={20} strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 truncate">Disbursed Amount</p>
            <h3 className="text-xl font-bold text-slate-800">₹24.75 Cr</h3>
            <p className="text-[11px] font-bold text-emerald-500 flex items-center gap-1 mt-0.5 whitespace-nowrap">
              <TrendingUp size={12} strokeWidth={3} /> 16.7% <span className="text-slate-400 font-medium">vs last month</span>
            </p>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-800">Application Overview</h3>
            <select className="text-xs border border-slate-200 rounded-md px-3 py-1.5 bg-slate-50 text-slate-600 font-medium focus:outline-none focus:border-blue-400">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="-ml-4">
            <HighchartsReact highcharts={Highcharts} options={lineChartOptions} />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6">Application Status</h3>
          <div className="h-[300px]">
            <HighchartsReact highcharts={Highcharts} options={donutChartOptions} />
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Applications Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Recent Applications</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Application ID</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Customer Name</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Loan Type</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Applied On</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-[13px] font-semibold text-slate-600">{app.id}</td>
                    <td className="py-4 px-6 text-[13px] font-medium text-slate-800">{app.name}</td>
                    <td className="py-4 px-6 text-[13px] text-slate-500">{app.type}</td>
                    <td className="py-4 px-6 text-[13px] font-semibold text-slate-700">{app.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold ${
                        app.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        app.status === 'Pending' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                        'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[12px] text-slate-500 font-medium">{app.date}</td>
                    <td className="py-4 px-6 text-center">
                      <button className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors border border-blue-100">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Loan Types */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 mb-6">Top Loan Types</h3>
          <div className="space-y-6 flex-1">
            {topLoanTypes.map((loan, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[13px] font-semibold text-slate-700">{loan.name}</span>
                  <span className="text-[12px] font-bold text-slate-500">{loan.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${loan.color} rounded-full`} style={{ width: `${loan.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
