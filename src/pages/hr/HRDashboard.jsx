import React, { useState } from 'react';
import { 
  Users, UserCheck, Calendar, FileText, Briefcase, Building2, 
  TrendingUp, TrendingDown, ArrowRight, Zap, CheckCircle, XCircle, Clock
} from 'lucide-react';
import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { useNavigate } from 'react-router-dom';

Highcharts.setOptions({ accessibility: { enabled: false } });

// --- Mock Data for HR ---
const employeeGrowthData = {
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  total: [120, 125, 132, 145, 150, 156],
  newHires: [5, 5, 8, 14, 6, 8]
};

const departmentData = [
  { name: 'Engineering', y: 45, color: '#3b82f6' },
  { name: 'Sales', y: 30, color: '#10b981' },
  { name: 'Support', y: 25, color: '#f59e0b' },
  { name: 'HR & Admin', y: 15, color: '#8b5cf6' }
];

const attendanceData = {
  categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  present: [145, 148, 150, 142, 138],
  absent: [11, 8, 6, 14, 18]
};

const recentActivities = [
  { id: 1, action: "New Employee Onboarded", user: "Ravi Kumar (EMP-1001)", time: "10:30 AM, Today", type: "add" },
  { id: 2, action: "Leave Request Approved", user: "Priya Singh (EMP-1002)", time: "09:15 AM, Today", type: "approve" },
  { id: 3, action: "Document Verification Pending", user: "Amit Sharma (EMP-1003)", time: "Yesterday, 04:30 PM", type: "doc" },
  { id: 4, action: "Performance Review Scheduled", user: "Neha Gupta (EMP-1004)", time: "Yesterday, 11:00 AM", type: "calendar" },
];

const quickActions = [
  { title: 'Add Employee', subtitle: 'Onboard new staff', icon: Users, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', route: '/hr/employees/new' },
  { title: 'Leave Requests', subtitle: 'Review pending leaves', icon: Calendar, color: 'text-amber-600 bg-amber-50 border-amber-100', route: '/hr/leaves' },
  { title: 'Departments', subtitle: 'Manage company structure', icon: Building2, color: 'text-blue-600 bg-blue-50 border-blue-100', route: '/hr/departments' },
  { title: 'Documents', subtitle: 'Verify employee docs', icon: FileText, color: 'text-purple-600 bg-purple-50 border-purple-100', route: '/hr/documents' },
];

// --- Shared Components ---
const Card = ({ children, className = "", noPadding = false }) => (
  <div className={`bg-white rounded-[20px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 ${noPadding ? '' : 'p-6'} ${className}`}>
    {children}
  </div>
);

const Trend = ({ value, isUp }) => (
  <span className={`text-[12px] font-bold flex items-center gap-1 ${isUp ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'} px-2 py-0.5 rounded-full whitespace-nowrap`}>
    {isUp ? <TrendingUp size={14} strokeWidth={2.5} /> : <TrendingDown size={14} strokeWidth={2.5} />}
    {value}
  </span>
);

export default function HRDashboard() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('This Month');

  // --- Chart Configs ---
  const lineChartOptions = {
    chart: { type: 'areaspline', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', height: 320 },
    title: { text: null },
    xAxis: { categories: employeeGrowthData.categories, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, gridLineColor: '#f8fafc', gridLineDashStyle: 'Dash' },
    legend: { itemStyle: { color: '#64748b', fontWeight: '600', fontSize: '12px' }, symbolRadius: 6, margin: 20 },
    credits: { enabled: false }, tooltip: { shared: true, backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 12, borderWidth: 0, shadow: true, padding: 12 },
    plotOptions: { 
      areaspline: { 
        fillOpacity: 0.1,
        marker: { radius: 4, symbol: 'circle', lineWidth: 2, lineColor: '#fff' }, 
        lineWidth: 3 
      } 
    },
    series: [
      { name: 'Total Employees', data: employeeGrowthData.total, color: '#3b82f6', fillColor: { linearGradient: [0, 0, 0, 300], stops: [[0, 'rgba(59, 130, 246, 0.2)'], [1, 'rgba(59, 130, 246, 0)']] } },
      { name: 'New Hires', data: employeeGrowthData.newHires, color: '#10b981', fillColor: { linearGradient: [0, 0, 0, 300], stops: [[0, 'rgba(16, 185, 129, 0.2)'], [1, 'rgba(16, 185, 129, 0)']] } },
    ]
  };

  const donutChartOptions = {
    chart: { type: 'pie', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', height: 180, margin: [0, 0, 0, 0] },
    title: { 
      text: `<div style="text-align:center"><span style="font-size:24px;font-weight:900;color:#0f172a">156</span><br/><span style="font-size:12px;color:#64748b;font-weight:500">Total</span></div>`, 
      align: 'center', verticalAlign: 'middle', y: 15, useHTML: true
    },
    credits: { enabled: false },
    plotOptions: { 
      pie: { 
        innerSize: '80%', dataLabels: { enabled: false }, showInLegend: false,
        borderWidth: 0, size: '100%'
      } 
    },
    series: [{
      name: 'Employees',
      data: departmentData
    }]
  };

  const barChartOptions = {
    chart: { type: 'column', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', height: 240 },
    title: { text: null },
    xAxis: { categories: attendanceData.categories, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, gridLineColor: '#f8fafc', gridLineDashStyle: 'Dash' },
    legend: { itemStyle: { color: '#64748b', fontWeight: '600', fontSize: '12px' }, verticalAlign: 'top', symbolRadius: 4 },
    credits: { enabled: false }, 
    plotOptions: { column: { borderRadius: 4, borderWidth: 0, pointPadding: 0.2 } },
    series: [
      { name: 'Present', data: attendanceData.present, color: '#10b981' },
      { name: 'Absent/Leave', data: attendanceData.absent, color: '#f59e0b' },
    ]
  };

  const ActivityIcon = ({ type }) => {
    switch (type) {
      case 'add': return <UserCheck size={16} strokeWidth={2.5} />;
      case 'approve': return <CheckCircle size={16} strokeWidth={2.5} />;
      case 'doc': return <FileText size={16} strokeWidth={2.5} />;
      case 'calendar': return <Calendar size={16} strokeWidth={2.5} />;
      default: return <Clock size={16} strokeWidth={2.5} />;
    }
  };

  return (
    <div className="w-full space-y-8 pb-12 bg-slate-50/50 min-h-screen">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-[24px] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl opacity-70 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              HR Dashboard
              <span className="inline-block origin-bottom-right hover:rotate-12 transition-transform cursor-default text-3xl">👋</span>
            </h1>
            <p className="text-[15px] text-slate-500 font-medium mt-2">Overview of human resources and employee activities.</p>
          </div>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <Zap size={16} className="text-yellow-400 fill-yellow-400" /> Export HR Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        <Card className="flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <Users size={22} strokeWidth={2.5} />
            </div>
            <Trend value="+4.2%" isUp={true} />
          </div>
          <p className="text-[13px] font-bold text-slate-500 mb-1">Total Employees</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">156</h3>
        </Card>

        <Card className="flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-emerald-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <UserCheck size={22} strokeWidth={2.5} />
            </div>
            <Trend value="+5.1%" isUp={true} />
          </div>
          <p className="text-[13px] font-bold text-slate-500 mb-1">Active Employees</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">142</h3>
        </Card>

        <Card className="flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-amber-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100">
              <Calendar size={22} strokeWidth={2.5} />
            </div>
            <Trend value="-2.1%" isUp={false} />
          </div>
          <p className="text-[13px] font-bold text-slate-500 mb-1">On Leave Today</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">8</h3>
        </Card>

        <Card className="flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-purple-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
              <FileText size={22} strokeWidth={2.5} />
            </div>
            <span className="text-[12px] font-bold flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">Needs Action</span>
          </div>
          <p className="text-[13px] font-bold text-slate-500 mb-1">Pending Documents</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">12</h3>
        </Card>

      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">
        
        {/* Line Chart */}
        <Card className="xl:col-span-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-slate-900">Employee Growth Trend</h3>
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 focus:outline-none transition-colors cursor-pointer"
            >
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="flex-1 -mx-2">
            <HighchartsReact highcharts={Highcharts} options={lineChartOptions} />
          </div>
        </Card>

      </div>

      {/* Bottom Section (Donut, Bar, Recent Activity) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Donut Chart */}
        <Card className="xl:col-span-1 flex flex-col">
          <h3 className="text-lg font-extrabold text-slate-900 mb-6">Department Distribution</h3>
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="w-[180px] h-[180px] shrink-0 relative">
              <HighchartsReact highcharts={Highcharts} options={donutChartOptions} containerProps={{ style: { width: '100%', height: '100%' } }} />
            </div>
            <div className="flex flex-col gap-3 w-full">
              {departmentData.map((dept, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color, boxShadow: `0 0 10px ${dept.color}80` }}></div><span className="text-sm font-bold text-slate-700">{dept.name}</span></div>
                  <span className="text-sm font-black text-slate-900">{dept.y} <span className="text-slate-400 font-semibold ml-1">({Math.round((dept.y / 156) * 100)}%)</span></span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Bar Chart */}
        <Card className="xl:col-span-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-slate-900">Attendance (This Week)</h3>
          </div>
          <div className="flex-1 -mx-2">
            <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="xl:col-span-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-slate-900">Recent HR Activity</h3>
            <button className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">View All</button>
          </div>
          <div className="space-y-6 flex-1">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex gap-4 group cursor-pointer">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                  act.type === 'add' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white' : 
                  act.type === 'approve' ? 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-500 group-hover:text-white' :
                  act.type === 'doc' ? 'bg-amber-50 text-amber-500 border-amber-100 group-hover:bg-amber-500 group-hover:text-white' :
                  'bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-500 group-hover:text-white'
                }`}>
                  <ActivityIcon type={act.type} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">{act.action}</p>
                  <p className="text-[12px] font-medium text-slate-500 mt-0.5">{act.user}</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
}
