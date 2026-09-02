import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, FileText, CheckCircle, XCircle, Clock, 
  CreditCard, Users, User, Briefcase, FileCheck, ArrowRight, UserPlus, 
  UserCheck, AlertCircle, ChevronDown, X, Zap
} from 'lucide-react';
import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { useNavigate } from 'react-router-dom';
// Removed static mock variables
const quickActions = [
  { title: 'Add New User', subtitle: 'Create a new system user', icon: UserPlus, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', action: 'addUser' },
  { title: 'New Loan Application', subtitle: 'Add a new loan application', icon: FileText, color: 'text-blue-600 bg-blue-50 border-blue-100', action: 'newLoan' },
  { title: 'Assign Lead', subtitle: 'Assign lead to employee', icon: UserCheck, color: 'text-purple-600 bg-purple-50 border-purple-100', action: 'assignLead' },
  { title: 'Request Documents', subtitle: 'Request documents from applicant', icon: FileCheck, color: 'text-orange-600 bg-orange-50 border-orange-100', action: 'reqDoc' },
];
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
  const [dashboardData, setDashboardData] = useState({
    kpis: {
      totalApps: 0,
      approvedApps: 0,
      pendingApps: 0,
      rejectedApps: 0,
      disbursedAmount: "0",
      totalCustomers: 0,
      activeLoans: 0,
      closedLoans: 0,
      overdueLoans: 0,
      employees: 0,
      complaints: 0
    },
    chartsData: {
      'This Month': { categories: [], total: [], approved: [], pending: [], rejected: [], areaData: [] },
      'Last Month': { categories: [], total: [], approved: [], pending: [], rejected: [], areaData: [] },
      'This Year': { categories: [], total: [], approved: [], pending: [], rejected: [], areaData: [] },
      'All Time': { categories: [], total: [], approved: [], pending: [], rejected: [], areaData: [] },
    },
    topLoanTypes: [],
    recentApplications: [],
    recentActivities: [],
    notifications: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const { kpis, chartsData, topLoanTypes, recentApplications, recentActivities, notifications } = dashboardData;

  const dynamicData = chartsData[timeFilter] || chartsData['This Month'];

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
      { name: 'Approved', data: dynamicData.approved, color: '#10b981' },
      { name: 'Pending', data: dynamicData.pending, color: '#f59e0b' },
      { name: 'Rejected', data: dynamicData.rejected, color: '#ef4444' }
    ]
  };

  const donutChartOptions = {
    chart: { type: 'pie', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', height: 220, margin: [0, 0, 0, 0] },
    title: { 
      text: `<div style="text-align:center"><span style="font-size:24px;font-weight:900;color:#0f172a">${kpis.totalApps}</span><br/><span style="font-size:12px;color:#64748b;font-weight:500">Total</span></div>`, 
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
        { name: 'Approved', y: kpis.approvedApps },
        { name: 'Pending', y: kpis.pendingApps },
        { name: 'Rejected', y: kpis.rejectedApps }
      ]
    }]
  };

  if (loading) return <div className="p-8">Loading dashboard...</div>;


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
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">{kpis.totalApps}</h3>
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
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">{kpis.pendingApps}</h3>
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
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">{kpis.approvedApps}</h3>
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
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">{kpis.rejectedApps}</h3>
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
          <h3 className="text-3xl font-black text-white tracking-tight relative z-10">₹{kpis.disbursedAmount}</h3>
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
                <span className="text-sm font-black text-slate-900">{kpis.approvedApps}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div><span className="text-sm font-bold text-slate-700">Pending</span></div>
                <span className="text-sm font-black text-slate-900">{kpis.pendingApps}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div><span className="text-sm font-bold text-slate-700">Rejected</span></div>
                <span className="text-sm font-black text-slate-900">{kpis.rejectedApps}</span>
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
                {dashboardData.recentApplications.map((app, idx) => (
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
              <h4 className="text-xl font-black text-slate-900">{kpis.totalCustomers}</h4>
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
              <h4 className="text-xl font-black text-slate-900">{kpis.activeLoans}</h4>
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
              <h4 className="text-xl font-black text-slate-900">{kpis.closedLoans}</h4>
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
              <h4 className="text-xl font-black text-slate-900">{kpis.overdueLoans}</h4>
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
              <h4 className="text-xl font-black text-slate-900">{kpis.employees}</h4>
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
              <h4 className="text-xl font-black text-slate-900">{kpis.complaints}</h4>
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
            {recentActivities.length > 0 ? recentActivities.map((activity, idx) => {
              // Map activity type to icon
              const getIcon = (type) => {
                switch(type) {
                  case 'submission': return <CheckCircle size={14} strokeWidth={2.5} />;
                  case 'approval': return <CheckCircle size={14} strokeWidth={2.5} />;
                  case 'document': return <FileText size={14} strokeWidth={2.5} />;
                  case 'assignment': return <User size={14} strokeWidth={2.5} />;
                  case 'rejection': return <XCircle size={14} strokeWidth={2.5} />;
                  default: return <Clock size={14} strokeWidth={2.5} />;
                }
              };
              const getColorClass = (type) => {
                switch(type) {
                  case 'submission': return 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white';
                  case 'approval': return 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white';
                  case 'document': return 'bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-slate-500 group-hover:text-white';
                  case 'assignment': return 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-500 group-hover:text-white';
                  case 'rejection': return 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-500 group-hover:text-white';
                  default: return 'bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-slate-500 group-hover:text-white';
                }
              };

              return (
                <div key={idx} className="flex gap-4 group cursor-pointer">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-colors ${getColorClass(activity.type)}`}>
                    {getIcon(activity.type)}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">{activity.title}</p>
                    <p className="text-[11px] font-bold text-slate-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center text-slate-400 py-8 text-sm font-medium flex flex-col items-center">
                <Clock size={32} className="opacity-20 mb-3" />
                No recent activities
              </div>
            )}
          </div>
        </Card>

        {/* Notifications */}
        <Card className="xl:col-span-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-slate-900">Notifications</h3>
            <button className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">View All</button>
          </div>
          <div className="space-y-6 flex-1">
            {notifications.length > 0 ? notifications.map((notif, idx) => {
              const getIcon = (type) => {
                switch(type) {
                  case 'application': return <UserPlus size={18} />;
                  case 'pending': return <Clock size={18} />;
                  case 'document': return <FileCheck size={18} />;
                  case 'overdue': return <AlertCircle size={18} />;
                  default: return <Clock size={18} />;
                }
              };
              const getColorClass = (type) => {
                switch(type) {
                  case 'application': return 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white';
                  case 'pending': return 'bg-amber-50 text-amber-500 border-amber-100 group-hover:bg-amber-500 group-hover:text-white';
                  case 'document': return 'bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-500 group-hover:text-white';
                  case 'overdue': return 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-500 group-hover:text-white';
                  default: return 'bg-slate-50 text-slate-500 border-slate-100 group-hover:bg-slate-500 group-hover:text-white';
                }
              };

              return (
                <div key={idx} className="flex gap-4 group cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${getColorClass(notif.type)}`}>
                    {getIcon(notif.type)}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">{notif.title}</p>
                    <p className="text-[11px] font-bold text-slate-400 mt-1.5">{notif.time}</p>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center text-slate-400 py-8 text-sm font-medium flex flex-col items-center">
                <AlertCircle size={32} className="opacity-20 mb-3" />
                No new notifications
              </div>
            )}
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
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">₹{kpis.disbursedAmount}</h2>
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
