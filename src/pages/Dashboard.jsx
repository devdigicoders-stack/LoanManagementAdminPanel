import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, FileText, CheckCircle, XCircle, Clock, 
  CreditCard, Users, User, Briefcase, FileCheck, ArrowRight, UserPlus, 
  UserCheck, AlertCircle, ChevronDown, X, Zap
} from 'lucide-react';
import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from './ManageUsers';

// Disable accessibility module warning
Highcharts.setOptions({ accessibility: { enabled: false } });

// --- Computed Data ---
const totalApps = mockUsers.reduce((sum, u) => sum + (u.totalApplications || 0), 0);
const approvedApps = mockUsers.reduce((sum, u) => sum + (u.approvedApplications || 0), 0);
const pendingApps = mockUsers.reduce((sum, u) => sum + (u.underReviewApplications || 0), 0);
const rejectedApps = mockUsers.reduce((sum, u) => sum + (u.rejectedApplications || 0), 0);

const recentApplications = mockUsers.slice(0, 5).map((user, idx) => ({
  id: `APP-2025-10${idx}`,
  userId: user.id,
  name: user.name,
  type: ['Personal Loan', 'Home Loan', 'Business Loan', 'Education Loan'][idx % 4],
  amount: `₹${(idx + 1) * 2},50,000`,
  status: ['Pending', 'Approved', 'Pending', 'Rejected', 'Approved'][idx % 5],
  date: `1${idx} May 2025`
}));

const topLoanTypes = [
  { name: 'Personal Loan', percentage: 40, color: 'bg-gradient-to-r from-emerald-500 to-emerald-400' },
  { name: 'Home Loan', percentage: 30, color: 'bg-gradient-to-r from-blue-500 to-blue-400' },
  { name: 'Business Loan', percentage: 20, color: 'bg-gradient-to-r from-purple-500 to-purple-400' },
  { name: 'Education Loan', percentage: 10, color: 'bg-gradient-to-r from-orange-500 to-orange-400' },
];

const quickActions = [
  { title: 'Add New User', subtitle: 'Create a new system user', icon: UserPlus, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', action: 'addUser' },
  { title: 'New Loan Application', subtitle: 'Add a new loan application', icon: FileText, color: 'text-blue-600 bg-blue-50 border-blue-100', action: 'newLoan' },
  { title: 'Assign Lead', subtitle: 'Assign lead to employee', icon: UserCheck, color: 'text-purple-600 bg-purple-50 border-purple-100', action: 'assignLead' },
  { title: 'Request Documents', subtitle: 'Request documents from applicant', icon: FileCheck, color: 'text-orange-600 bg-orange-50 border-orange-100', action: 'reqDoc' },
];

// --- Helper Components ---
const Card = ({ children, className = "", noPadding = false }) => (
  <div className={`bg-white rounded-[20px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 ${noPadding ? '' : 'p-6'} ${className}`}>
    {children}
  </div>
);

const Trend = ({ value, isUp }) => (
  <span className={`text-[12px] font-bold flex items-center gap-1 ${isUp ? 'text-emerald-500' : 'text-rose-500'} whitespace-nowrap bg-${isUp ? 'emerald' : 'rose'}-50 px-2 py-0.5 rounded-full`}>
    {isUp ? <TrendingUp size={14} strokeWidth={2.5} /> : <TrendingDown size={14} strokeWidth={2.5} />}
    {value}
  </span>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('This Month');

  // Dynamic Chart Options based on timeFilter
  const getDynamicData = (filter) => {
    switch(filter) {
      case 'This Year':
        return {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          total: [80, 95, 110, 105, 120, 135, 125, 140, 130, 115, 125, 145],
          approved: [40, 50, 60, 55, 70, 80, 75, 85, 80, 70, 80, 95],
          pending: [30, 35, 30, 35, 30, 35, 30, 35, 30, 25, 25, 30],
          rejected: [10, 10, 20, 15, 20, 20, 20, 20, 20, 20, 20, 20],
          areaData: [100, 200, 150, 300, 250, 400, 350, 450, 400, 500, 450, 600]
        };
      case 'Last Month':
        return {
          categories: ['01 Apr', '06 Apr', '11 Apr', '16 Apr', '21 Apr', '26 Apr', '30 Apr'],
          total: [30, 40, 35, 50, 45, 60, 55],
          approved: [15, 20, 18, 25, 22, 30, 28],
          pending: [10, 15, 12, 18, 15, 20, 18],
          rejected: [5, 5, 5, 7, 8, 10, 9],
          areaData: [15, 25, 20, 35, 30, 45, 40]
        };
      case 'All Time':
        return {
          categories: ['2020', '2021', '2022', '2023', '2024', '2025'],
          total: [500, 800, 1200, 1500, 2000, 1350],
          approved: [250, 400, 600, 800, 1200, 800],
          pending: [150, 200, 400, 400, 500, 350],
          rejected: [100, 200, 200, 300, 300, 200],
          areaData: [500, 800, 1200, 1500, 2000, 1350]
        };
      default: // This Month
        return {
          categories: ['01 May', '04 May', '07 May', '10 May', '13 May', '16 May', '19 May', '22 May', '25 May', '28 May', '31 May'],
          total: [20, 50, 40, 55, 45, 70, 55, 80, 65, 85, 75],
          approved: [10, 30, 20, 35, 25, 45, 35, 60, 55, 70, 55],
          pending: [5, 15, 10, 25, 15, 30, 20, 40, 35, 40, 30],
          rejected: [2, 5, 8, 10, 12, 15, 10, 18, 20, 25, 20],
          areaData: [10, 20, 15, 30, 25, 40, 35, 50, 45, 60, 55]
        };
    }
  };

  const dynamicData = getDynamicData(timeFilter);

  const lineChartOptions = {
    chart: { type: 'areaspline', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', height: 320 },
    title: { text: null },
    xAxis: { categories: dynamicData.categories, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, gridLineColor: '#f8fafc', gridLineDashStyle: 'Dash', min: 0 },
    legend: { itemStyle: { color: '#64748b', fontWeight: '600', fontSize: '12px' }, symbolRadius: 6, margin: 20, padding: 5 },
    credits: { enabled: false }, tooltip: { shared: true, backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 12, borderWidth: 0, shadow: true, padding: 12 },
    plotOptions: { 
      areaspline: { 
        fillOpacity: 0.1,
        marker: { radius: 4, symbol: 'circle', lineWidth: 2, lineColor: '#fff' }, 
        lineWidth: 3 
      } 
    },
    series: [
      { name: 'Total', data: dynamicData.total, color: '#3b82f6', fillColor: { linearGradient: [0, 0, 0, 300], stops: [[0, 'rgba(59, 130, 246, 0.2)'], [1, 'rgba(59, 130, 246, 0)']] } },
      { name: 'Approved', data: dynamicData.approved, color: '#10b981', fillColor: { linearGradient: [0, 0, 0, 300], stops: [[0, 'rgba(16, 185, 129, 0.2)'], [1, 'rgba(16, 185, 129, 0)']] } },
    ]
  };

  const areaChartOptions = {
    chart: { type: 'area', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', height: 180, margin: [0,0,0,0] },
    title: { text: null },
    xAxis: { visible: false },
    yAxis: { visible: false, min: 0 }, 
    legend: { enabled: false }, credits: { enabled: false },
    plotOptions: { 
      area: { 
        fillColor: { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [ [0, 'rgba(139, 92, 246, 0.4)'], [1, 'rgba(139, 92, 246, 0)'] ] },
        marker: { enabled: false }, lineWidth: 3, lineColor: '#8b5cf6', states: { hover: { lineWidth: 3 } }
      } 
    },
    series: [{ name: 'Amount', data: dynamicData.areaData }]
  };

  const barChartOptions = {
    chart: { type: 'column', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', height: 320 },
    title: { text: null },
    xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, gridLineColor: '#f8fafc', gridLineDashStyle: 'Dash' },
    legend: { itemStyle: { color: '#64748b', fontWeight: '600', fontSize: '12px' }, verticalAlign: 'top', symbolRadius: 4, itemDistance: 20 },
    credits: { enabled: false }, 
    plotOptions: { column: { borderRadius: 4, borderWidth: 0, pointPadding: 0.2 } },
    series: [
      { name: 'Approved', data: [400, 500, 600, 550, 700, 800, 750, 850, 800, 700, 800, 950], color: '#10b981' },
      { name: 'Pending', data: [300, 350, 300, 350, 300, 350, 300, 350, 300, 250, 250, 300], color: '#f59e0b' },
      { name: 'Rejected', data: [100, 100, 200, 150, 200, 200, 200, 200, 200, 200, 200, 200], color: '#ef4444' }
    ]
  };

  const donutChartOptions = {
    chart: { type: 'pie', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', height: 220, margin: [0, 0, 0, 0] },
    title: { 
      text: `<div style="text-align:center"><span style="font-size:24px;font-weight:900;color:#0f172a">${totalApps}</span><br/><span style="font-size:12px;color:#64748b;font-weight:500">Total</span></div>`, 
      align: 'center', verticalAlign: 'middle', y: 15, useHTML: true
    },
    credits: { enabled: false },
    plotOptions: { 
      pie: { 
        innerSize: '80%', dataLabels: { enabled: false }, showInLegend: false,
        borderWidth: 0, colors: ['#10b981', '#f59e0b', '#ef4444'], size: '100%'
      } 
    },
    series: [{
      name: 'Applications',
      data: [
        { name: 'Approved', y: approvedApps },
        { name: 'Pending', y: pendingApps },
        { name: 'Rejected', y: rejectedApps }
      ]
    }]
  };

  return (
    <div className="w-full space-y-8 pb-12 bg-slate-50/50 min-h-screen">
      
      {/* Title Section with Premium Gradient */}
      <div className="relative overflow-hidden bg-white rounded-[24px] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-full blur-3xl opacity-70 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Good Morning, Admin!
              <span className="inline-block origin-bottom-right hover:rotate-12 transition-transform cursor-default text-3xl">👋</span>
            </h1>
            <p className="text-[15px] text-slate-500 font-medium mt-2">Here's what's happening with your loan management system today.</p>
          </div>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <Zap size={16} className="text-yellow-400 fill-yellow-400" /> Generate Report
          </button>
        </div>
      </div>
      
      {/* 1. TOP KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        
        <Card className="flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-emerald-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <FileText size={22} strokeWidth={2.5} />
            </div>
            <Trend value="+12.5%" isUp={true} />
          </div>
          <p className="text-[13px] font-bold text-slate-500 mb-1">Total Applications</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">{totalApps}</h3>
        </Card>

        <Card className="flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-amber-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100">
              <Clock size={22} strokeWidth={2.5} />
            </div>
            <Trend value="+8.2%" isUp={true} />
          </div>
          <p className="text-[13px] font-bold text-slate-500 mb-1">Pending Applications</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">{pendingApps}</h3>
        </Card>

        <Card className="flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <CheckCircle size={22} strokeWidth={2.5} />
            </div>
            <Trend value="+15.3%" isUp={true} />
          </div>
          <p className="text-[13px] font-bold text-slate-500 mb-1">Approved Applications</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">{approvedApps}</h3>
        </Card>

        <Card className="flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-rose-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100">
              <XCircle size={22} strokeWidth={2.5} />
            </div>
            <Trend value="-5.1%" isUp={false} />
          </div>
          <p className="text-[13px] font-bold text-slate-500 mb-1">Rejected Applications</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">{rejectedApps}</h3>
        </Card>

        <Card className="flex flex-col relative overflow-hidden group bg-gradient-to-br from-slate-900 to-slate-800 border-none !text-white shadow-xl">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0 border border-white/10 backdrop-blur-sm">
              <CreditCard size={22} strokeWidth={2.5} />
            </div>
            <span className="text-[12px] font-bold flex items-center gap-1 text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
              <TrendingUp size={14} strokeWidth={2.5} /> +18.7%
            </span>
          </div>
          <p className="text-[13px] font-medium text-slate-300 mb-1 relative z-10">Disbursed Amount</p>
          <h3 className="text-3xl font-black text-white tracking-tight relative z-10">₹24.75 Cr</h3>
        </Card>

      </div>

      {/* 2. MIDDLE SECTION (Charts & Progress) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Line Chart */}
        <Card className="xl:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-slate-900">Application Overview</h3>
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-colors"
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="flex-1 -mx-2">
            <HighchartsReact highcharts={Highcharts} options={lineChartOptions} />
          </div>
        </Card>

        {/* Donut Chart */}
        <Card className="xl:col-span-1 flex flex-col">
          <h3 className="text-lg font-extrabold text-slate-900 mb-6">Application Status</h3>
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <div className="w-[200px] h-[200px] shrink-0 relative">
              <HighchartsReact highcharts={Highcharts} options={donutChartOptions} containerProps={{ style: { width: '100%', height: '100%' } }} />
            </div>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div><span className="text-sm font-bold text-slate-700">Approved</span></div>
                <span className="text-sm font-black text-slate-900">684 <span className="text-slate-400 font-semibold ml-1.5">(54.8%)</span></span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div><span className="text-sm font-bold text-slate-700">Pending</span></div>
                <span className="text-sm font-black text-slate-900">268 <span className="text-slate-400 font-semibold ml-1.5">(21.5%)</span></span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div><span className="text-sm font-bold text-slate-700">Rejected</span></div>
                <span className="text-sm font-black text-slate-900">296 <span className="text-slate-400 font-semibold ml-1.5">(23.7%)</span></span>
              </div>
            </div>
          </div>
        </Card>

        {/* Application Status (Donut Chart) moved from top if needed or keep this clean */}
      </div>

      {/* 3. LOWER MIDDLE (Table & Bar Chart) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Table */}
        <Card className="xl:col-span-2 overflow-hidden flex flex-col !p-0">
          <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white">
            <h3 className="text-lg font-extrabold text-slate-900">Recent Applications</h3>
            <button className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-4 px-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap bg-slate-50/50 rounded-l-xl">Application ID</th>
                  <th className="py-4 px-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap bg-slate-50/50">Customer</th>
                  <th className="py-4 px-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap bg-slate-50/50">Loan Type</th>
                  <th className="py-4 px-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap bg-slate-50/50">Amount</th>
                  <th className="py-4 px-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap bg-slate-50/50">Status</th>
                  <th className="py-4 px-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap bg-slate-50/50 rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentApplications.map((app, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-5 text-[13px] font-bold text-slate-800 whitespace-nowrap">{app.id}</td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">{app.name.charAt(0)}</div>
                        <span className="text-[13px] font-bold text-slate-700">{app.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-[13px] font-semibold text-slate-500 whitespace-nowrap">{app.type}</td>
                    <td className="py-4 px-5 text-[13px] font-black text-slate-900 whitespace-nowrap">{app.amount}</td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border ${
                        app.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        app.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <button 
                        onClick={() => navigate('/user-profile/' + app.userId)} 
                        className="text-[12px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Bar Chart */}
        <Card className="xl:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-slate-900">Application Trend</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100">
              This Year <ChevronDown size={14} />
            </button>
          </div>
          <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
        </Card>

      </div>

      {/* 4. BOTTOM SMALL KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
        
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Users size={22} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-500 mb-0.5">Total Customers</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-xl font-black text-slate-900">2,547</h4>
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <FileCheck size={22} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-500 mb-0.5">Active Loans</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-xl font-black text-slate-900">1,856</h4>
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-500 mb-0.5">Closed Loans</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-xl font-black text-slate-900">691</h4>
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-500 mb-0.5">Overdue Loans</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-xl font-black text-slate-900">145</h4>
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <UserCheck size={22} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-500 mb-0.5">Employees</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-xl font-black text-slate-900">24</h4>
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100">
            <AlertCircle size={22} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-500 mb-0.5">Complaints</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-xl font-black text-slate-900">12</h4>
            </div>
          </div>
        </Card>

      </div>

      {/* 5. BOTTOM SECTION (Recent Activities, Notifications, Area Chart) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Recent Activities */}
        <Card className="xl:col-span-1 flex flex-col">
          <h3 className="text-lg font-extrabold text-slate-900 mb-6">Recent Activities</h3>
          <div className="space-y-6 flex-1">
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <CheckCircle size={14} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">New application APP-2025-1250 submitted by Ravi Kumar</p>
                <p className="text-[11px] font-bold text-slate-400 mt-1">10 May 2025, 10:30 AM</p>
              </div>
            </div>
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <CheckCircle size={14} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">Application APP-2025-1249 approved by Super Admin</p>
                <p className="text-[11px] font-bold text-slate-400 mt-1">10 May 2025, 09:45 AM</p>
              </div>
            </div>
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-slate-500 group-hover:text-white transition-colors">
                <FileText size={14} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">Documents requested for APP-2025-1248</p>
                <p className="text-[11px] font-bold text-slate-400 mt-1">09 May 2025, 04:15 PM</p>
              </div>
            </div>
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <User size={14} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">Lead assigned to John Doe for APP-2025-1247</p>
                <p className="text-[11px] font-bold text-slate-400 mt-1">09 May 2025, 11:20 AM</p>
              </div>
            </div>
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <XCircle size={14} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">Application APP-2025-1246 rejected by Admin</p>
                <p className="text-[11px] font-bold text-slate-400 mt-1">08 May 2025, 03:50 PM</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="xl:col-span-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-slate-900">Notifications</h3>
            <button className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">View All</button>
          </div>
          <div className="space-y-6 flex-1">
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <UserPlus size={18} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">5 new applications submitted today</p>
                <p className="text-[11px] font-bold text-slate-400 mt-1.5">10 May 2025, 10:30 AM</p>
              </div>
            </div>
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">3 applications are pending for approval</p>
                <p className="text-[11px] font-bold text-slate-400 mt-1.5">10 May 2025, 09:15 AM</p>
              </div>
            </div>
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <FileCheck size={18} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">2 documents are pending for verification</p>
                <p className="text-[11px] font-bold text-slate-400 mt-1.5">09 May 2025, 04:00 PM</p>
              </div>
            </div>
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <AlertCircle size={18} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">1 loan payment is overdue</p>
                <p className="text-[11px] font-bold text-slate-400 mt-1.5">09 May 2025, 02:30 PM</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Area Chart / Disbursed Amount Sparkline */}
        <Card className="xl:col-span-1 flex flex-col justify-between overflow-hidden relative group bg-gradient-to-br from-slate-900 to-slate-800 border-none !text-white">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md shadow-lg">
                <TrendingUp size={24} />
              </div>
            </div>
            <p className="text-[13px] font-medium text-slate-300 mb-1">Total Disbursed (MTD)</p>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">₹24.75 Cr</h2>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-md backdrop-blur-sm">+18.7%</span>
              <span className="text-[11px] font-medium text-slate-400">vs last month</span>
            </div>
          </div>
          <div className="mt-8 relative z-0">
            <HighchartsReact highcharts={Highcharts} options={areaChartOptions} />
          </div>
        </Card>

      </div>

    </div>
  );
}
