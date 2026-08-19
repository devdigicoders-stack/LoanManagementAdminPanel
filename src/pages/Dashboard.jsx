import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, FileText, CheckCircle, XCircle, Clock, 
  CreditCard, Users, User, Briefcase, FileCheck, ArrowRight, UserPlus, 
  UserCheck, AlertCircle, ChevronDown, X
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
  { name: 'Personal Loan', percentage: 40, color: 'bg-[#489b0d]' },
  { name: 'Home Loan', percentage: 30, color: 'bg-[#489b0d]' },
  { name: 'Business Loan', percentage: 20, color: 'bg-[#489b0d]' },
  { name: 'Education Loan', percentage: 10, color: 'bg-[#489b0d]' },
];

const quickActions = [
  { title: 'Add New User', subtitle: 'Create a new system user', icon: UserPlus, color: 'text-[#489b0d]', action: 'addUser' },
  { title: 'New Loan Application', subtitle: 'Add a new loan application', icon: FileText, color: 'text-[#489b0d]', action: 'newLoan' },
  { title: 'Assign Lead', subtitle: 'Assign lead to employee', icon: UserCheck, color: 'text-[#489b0d]', action: 'assignLead' },
  { title: 'Request Documents', subtitle: 'Request documents from applicant', icon: FileCheck, color: 'text-[#489b0d]', action: 'reqDoc' },
];

// Chart configurations moved inside the component to react to state changes

// --- Helper Components ---
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-slate-200/60 p-5 shadow-sm ${className}`}>
    {children}
  </div>
);

const Trend = ({ value, isUp }) => (
  <span className={`text-[11px] font-bold flex items-center gap-1 ${isUp ? 'text-[#489b0d]' : 'text-red-500'} whitespace-nowrap`}>
    {isUp ? <TrendingUp size={14} strokeWidth={3} className="shrink-0" /> : <TrendingDown size={14} strokeWidth={3} className="shrink-0" />}
    {value} vs last month
  </span>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);
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
    chart: { type: 'spline', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', height: 300 },
    title: { text: null },
    xAxis: { categories: dynamicData.categories, labels: { style: { color: '#64748b', fontSize: '10px' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#64748b', fontSize: '10px' } }, gridLineColor: '#f1f5f9', min: 0 },
    legend: { itemStyle: { color: '#475569', fontWeight: '600', fontSize: '11px' }, symbolRadius: 4, margin: 10, padding: 5 },
    credits: { enabled: false }, tooltip: { shared: true },
    plotOptions: { spline: { marker: { radius: 3, symbol: 'circle' }, lineWidth: 2 } },
    series: [
      { name: 'Total', data: dynamicData.total, color: '#489b0d' },
      { name: 'Approved', data: dynamicData.approved, color: '#3b82f6' },
      { name: 'Pending', data: dynamicData.pending, color: '#f97316' },
      { name: 'Rejected', data: dynamicData.rejected, color: '#ef4444' }
    ]
  };

  const areaChartOptions = {
    chart: { type: 'area', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', height: 220, margin: [0,0,30,0] },
    title: { text: null },
    xAxis: { categories: dynamicData.categories.slice(0, 6), labels: { style: { color: '#64748b', fontSize: '9px' }, y: 20 }, lineWidth: 0, tickWidth: 0 },
    yAxis: { visible: false, min: 0 }, legend: { enabled: false }, credits: { enabled: false },
    plotOptions: { 
      area: { 
        fillColor: { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [ [0, 'rgba(72, 155, 13, 0.2)'], [1, 'rgba(72, 155, 13, 0)'] ] },
        marker: { radius: 0 }, lineWidth: 2, lineColor: '#489b0d', states: { hover: { lineWidth: 2 } }, threshold: null
      } 
    },
    series: [{ name: 'Amount', data: dynamicData.areaData.slice(0, 6) }]
  };

  const barChartOptions = {
    chart: { type: 'column', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', height: 300 },
    title: { text: null },
    xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], labels: { style: { color: '#64748b', fontSize: '10px' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#64748b', fontSize: '10px' } }, gridLineColor: '#f1f5f9', },
    legend: { itemStyle: { color: '#475569', fontWeight: '600', fontSize: '11px' }, verticalAlign: 'top', symbolRadius: 2, itemDistance: 15 },
    credits: { enabled: false }, plotOptions: { column: { borderRadius: 2, borderWidth: 0, pointPadding: 0.1 } },
    series: [
      { name: 'Total', data: [800, 950, 1100, 1050, 1200, 1350, 1250, 1400, 1300, 1150, 1250, 1450], color: '#489b0d' },
      { name: 'Approved', data: [400, 500, 600, 550, 700, 800, 750, 850, 800, 700, 800, 950], color: '#3b82f6' },
      { name: 'Pending', data: [300, 350, 300, 350, 300, 350, 300, 350, 300, 250, 250, 300], color: '#f97316' },
      { name: 'Rejected', data: [100, 100, 200, 150, 200, 200, 200, 200, 200, 200, 200, 200], color: '#ef4444' }
    ]
  };

  const donutChartOptions = {
    chart: { type: 'pie', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', height: 200, margin: [0, 0, 0, 0] },
    title: { 
      text: `${totalApps}<br/><span style="font-size:11px;color:#64748b;font-weight:normal">Total</span>`, 
      align: 'center', verticalAlign: 'middle', y: 12,
      style: { fontSize: '22px', fontWeight: 'bold', color: '#0f172a' } 
    },
    credits: { enabled: false },
    plotOptions: { 
      pie: { 
        innerSize: '75%', dataLabels: { enabled: false }, showInLegend: false,
        borderWidth: 0, colors: ['#489b0d', '#f97316', '#ef4444'], size: '100%'
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
    <div className="w-full space-y-6 pb-10">
      {/* Title Section */}
      <div className="mb-2">
        <h1 className="text-[24px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
          Good Morning, Admin!
          <span className="inline-block origin-bottom-right hover:rotate-12 transition-transform cursor-default text-[28px]">👋</span>
        </h1>
        <p className="text-[13px] text-slate-500 font-medium mt-1">Here's what's happening with your loan management system today.</p>
      </div>
      
      {/* 1. TOP KPIs */}
      <div className="flex flex-wrap gap-4">
        
        <Card className="flex-1 min-w-[210px] flex items-center gap-4 !p-4">
          <div className="w-12 h-12 rounded-lg bg-[#489b0d] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#489b0d]/20">
            <FileText size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-slate-500 mb-0.5 whitespace-nowrap truncate">Total Applications</p>
            <h3 className="text-[22px] font-bold text-slate-800 mb-1 leading-none">{totalApps}</h3>
            <Trend value="12.5%" isUp={true} />
          </div>
        </Card>

        <Card className="flex-1 min-w-[210px] flex items-center gap-4 !p-4">
          <div className="w-12 h-12 rounded-lg bg-[#f97316] text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/20">
            <Clock size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-slate-500 mb-0.5 whitespace-nowrap truncate">Pending Applications</p>
            <h3 className="text-[22px] font-bold text-slate-800 mb-1 leading-none">{pendingApps}</h3>
            <Trend value="8.2%" isUp={true} />
          </div>
        </Card>

        <Card className="flex-1 min-w-[210px] flex items-center gap-4 !p-4">
          <div className="w-12 h-12 rounded-lg bg-[#489b0d] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#489b0d]/20">
            <CheckCircle size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-slate-500 mb-0.5 whitespace-nowrap truncate">Approved Applications</p>
            <h3 className="text-[22px] font-bold text-slate-800 mb-1 leading-none">{approvedApps}</h3>
            <Trend value="15.3%" isUp={true} />
          </div>
        </Card>

        <Card className="flex-1 min-w-[210px] flex items-center gap-4 !p-4">
          <div className="w-12 h-12 rounded-lg bg-[#ef4444] text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-500/20">
            <XCircle size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-slate-500 mb-0.5 whitespace-nowrap truncate">Rejected Applications</p>
            <h3 className="text-[22px] font-bold text-slate-800 mb-1 leading-none">{rejectedApps}</h3>
            <Trend value="5.1%" isUp={false} />
          </div>
        </Card>

        <Card className="flex-1 min-w-[210px] flex items-center gap-4 !p-4">
          <div className="w-12 h-12 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-purple-600/20">
            <CreditCard size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-slate-500 mb-0.5 whitespace-nowrap truncate">Disbursed Amount</p>
            <h3 className="text-[22px] font-bold text-slate-800 mb-1 leading-none">₹24.75 Cr</h3>
            <Trend value="18.7%" isUp={true} />
          </div>
        </Card>

      </div>

      {/* 2. MIDDLE SECTION (Charts & Progress) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Line Chart */}
        <Card className="xl:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-bold text-slate-800">Application Overview</h3>
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 focus:outline-none focus:border-[#489b0d] cursor-pointer"
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>
          <HighchartsReact highcharts={Highcharts} options={lineChartOptions} />
        </Card>

        {/* Donut Chart */}
        <Card className="xl:col-span-1 flex flex-col">
          <h3 className="text-[15px] font-bold text-slate-800 mb-2">Application Status</h3>
          <div className="flex-1 flex flex-col lg:flex-row xl:flex-col items-center justify-center gap-6 mt-4">
            <div className="w-[180px] h-[180px] shrink-0 relative">
              <HighchartsReact highcharts={Highcharts} options={donutChartOptions} containerProps={{ style: { width: '100%', height: '100%' } }} />
            </div>
            <div className="flex flex-col gap-3 w-full px-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#489b0d]"></div><span className="text-[12px] font-semibold text-slate-600">Approved</span></div>
                <span className="text-[12px] font-bold text-slate-800">684 <span className="text-slate-400 font-medium ml-1">(54.8%)</span></span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></div><span className="text-[12px] font-semibold text-slate-600">Pending</span></div>
                <span className="text-[12px] font-bold text-slate-800">268 <span className="text-slate-400 font-medium ml-1">(21.5%)</span></span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></div><span className="text-[12px] font-semibold text-slate-600">Rejected</span></div>
                <span className="text-[12px] font-bold text-slate-800">296 <span className="text-slate-400 font-medium ml-1">(23.7%)</span></span>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Loan Types */}
        <Card className="xl:col-span-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-bold text-slate-800">Top Loan Types</h3>
            <button className="text-[11px] font-bold text-slate-500 border border-slate-200 px-2 py-1 rounded hover:bg-slate-50">View All</button>
          </div>
          
          <div className="space-y-7 flex-1 flex flex-col justify-center pb-2">
            {topLoanTypes.map((loan, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[12px] font-bold text-slate-600">{loan.name}</span>
                  <span className="text-[12px] font-bold text-slate-800">{loan.percentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${loan.color} rounded-full`} style={{ width: `${loan.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* 3. LOWER MIDDLE (Table, Area Chart, Quick Actions) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Table */}
        <Card className="xl:col-span-2 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-bold text-slate-800">Recent Applications</h3>
            <button className="text-[11px] font-bold text-slate-500 border border-slate-200 px-2 py-1 rounded hover:bg-slate-50">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 pr-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Application ID</th>
                  <th className="pb-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Customer Name</th>
                  <th className="pb-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Loan Type</th>
                  <th className="pb-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Amount</th>
                  <th className="pb-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="pb-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Applied On</th>
                  <th className="pb-3 pl-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentApplications.map((app, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 pr-4 text-[12px] font-bold text-slate-700 whitespace-nowrap">{app.id}</td>
                    <td className="py-3.5 px-4 text-[12px] font-semibold text-slate-600 whitespace-nowrap">{app.name}</td>
                    <td className="py-3.5 px-4 text-[12px] font-semibold text-slate-600 whitespace-nowrap">{app.type}</td>
                    <td className="py-3.5 px-4 text-[12px] font-bold text-slate-800 whitespace-nowrap">{app.amount}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${
                        app.status === 'Approved' ? 'bg-[#489b0d]/10 text-[#489b0d]' : 
                        app.status === 'Rejected' ? 'bg-red-100 text-red-600' : 
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[12px] font-semibold text-slate-500 whitespace-nowrap">{app.date}</td>
                    <td className="py-3.5 pl-4 whitespace-nowrap">
                      <button 
                        onClick={() => navigate('/user-profile/' + app.userId)} 
                        className="text-[11px] font-bold text-slate-500 border border-slate-200 px-2.5 py-1 rounded hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Area Chart */}
        <Card className="xl:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[15px] font-bold text-slate-800 pr-2">Disbursed Amount Overview</h3>
              <select 
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-2 py-1 rounded border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 focus:outline-none focus:border-[#489b0d] cursor-pointer"
              >
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Year</option>
                <option>All Time</option>
              </select>
            </div>
            <p className="text-[11px] font-bold text-slate-500 mb-1">Total Disbursed Amount</p>
            <h2 className="text-[22px] 2xl:text-[26px] font-bold text-slate-800 mb-1 leading-tight">₹24,75,00,000</h2>
            <Trend value="18.7%" isUp={true} />
          </div>
          <div className="mt-4 -mx-2 -mb-2">
            <HighchartsReact highcharts={Highcharts} options={areaChartOptions} />
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="xl:col-span-1">
          <h3 className="text-[15px] font-bold text-slate-800 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            {quickActions.map((action, idx) => (
              <button key={idx} onClick={() => {
                if (action.action === 'addUser') navigate('/users');
                else if (action.action === 'newLoan') navigate('/loans');
                else if (action.action === 'assignLead') navigate('/leads');
                else navigate('/users');
              }} className="w-full flex items-center justify-between p-3 rounded-md border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all text-left group cursor-pointer">
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className={`w-9 h-9 rounded-lg bg-[#F0FDF4] flex items-center justify-center shrink-0 ${action.color}`}>
                    <action.icon size={18} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-bold text-slate-800 leading-tight truncate">{action.title}</h4>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">{action.subtitle}</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </Card>

      </div>

      {/* 4. BOTTOM SMALL KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        
        <Card className="flex items-center gap-3 !p-4">
          <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500">Total Customers</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-lg font-bold text-slate-800">2,547</h4>
              <span className="text-[10px] font-bold text-[#489b0d] flex items-center"><TrendingUp size={10}/> 10.2%</span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-3 !p-4">
          <div className="w-10 h-10 rounded-md bg-[#F0FDF4] text-[#489b0d] flex items-center justify-center shrink-0">
            <FileCheck size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500">Active Loans</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-lg font-bold text-slate-800">1,856</h4>
              <span className="text-[10px] font-bold text-[#489b0d] flex items-center"><TrendingUp size={10}/> 9.4%</span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-3 !p-4">
          <div className="w-10 h-10 rounded-md bg-[#F0FDF4] text-[#489b0d] flex items-center justify-center shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500">Closed Loans</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-lg font-bold text-slate-800">691</h4>
              <span className="text-[10px] font-bold text-[#489b0d] flex items-center"><TrendingUp size={10}/> 7.1%</span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-3 !p-4">
          <div className="w-10 h-10 rounded-md bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500">Overdue Loans</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-lg font-bold text-slate-800">145</h4>
              <span className="text-[10px] font-bold text-red-500 flex items-center"><TrendingDown size={10}/> 3.4%</span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-3 !p-4">
          <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <UserCheck size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500">Employees</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-lg font-bold text-slate-800">24</h4>
            </div>
            <p className="text-[9px] font-semibold text-slate-400 leading-none">No change vs last month</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3 !p-4">
          <div className="w-10 h-10 rounded-md bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500">Complaints</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-lg font-bold text-slate-800">12</h4>
              <span className="text-[10px] font-bold text-red-500 flex items-center"><TrendingDown size={10}/> 7.7%</span>
            </div>
          </div>
        </Card>

      </div>

      {/* 5. BOTTOM SECTION (Bar Chart, Activities, Notifications) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Bar Chart */}
        <Card className="xl:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[15px] font-bold text-slate-800">Application Trend</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50">
              This Year <ChevronDown size={14} />
            </button>
          </div>
          <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
        </Card>

        {/* Recent Activities */}
        <Card className="xl:col-span-1 flex flex-col">
          <h3 className="text-[15px] font-bold text-slate-800 mb-6">Recent Activities</h3>
          <div className="space-y-6 flex-1">
            
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#F0FDF4] text-[#489b0d] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle size={12} strokeWidth={3} />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-700 leading-snug">New application APP-2025-1250 submitted by Ravi Kumar</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">10 May 2025, 10:30 AM</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#F0FDF4] text-[#489b0d] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle size={12} strokeWidth={3} />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-700 leading-snug">Application APP-2025-1249 approved by Super Admin</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">10 May 2025, 09:45 AM</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                <FileText size={12} strokeWidth={3} />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-700 leading-snug">Documents requested for APP-2025-1248</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">09 May 2025, 04:15 PM</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                <User size={12} strokeWidth={3} />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-700 leading-snug">Lead assigned to John Doe for APP-2025-1247</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">09 May 2025, 11:20 AM</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                <XCircle size={12} strokeWidth={3} />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-700 leading-snug">Application APP-2025-1246 rejected by Admin</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">08 May 2025, 03:50 PM</p>
              </div>
            </div>

          </div>
        </Card>

        {/* Notifications */}
        <Card className="xl:col-span-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-bold text-slate-800">Notifications</h3>
            <button className="text-[11px] font-bold text-slate-500 border border-slate-200 px-2 py-1 rounded hover:bg-slate-50">View All</button>
          </div>
          <div className="space-y-6 flex-1">
            
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F0FDF4] text-[#489b0d] flex items-center justify-center shrink-0">
                <UserPlus size={16} />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-700 leading-snug">5 new applications submitted today</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">10 May 2025, 10:30 AM</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-700 leading-snug">3 applications are pending for approval</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">10 May 2025, 09:15 AM</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <FileCheck size={16} />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-700 leading-snug">2 documents are pending for verification</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">09 May 2025, 04:00 PM</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <AlertCircle size={16} />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-700 leading-snug">1 loan payment is overdue</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">09 May 2025, 02:30 PM</p>
              </div>
            </div>

          </div>
        </Card>

      </div>


    </div>
  );
}
