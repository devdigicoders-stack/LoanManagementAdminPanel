import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, Calendar, FileText, Briefcase, Building2, 
  TrendingUp, TrendingDown, ArrowRight, Zap, CheckCircle, XCircle, Clock
} from 'lucide-react';
import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

Highcharts.setOptions({ accessibility: { enabled: false } });

// --- Shared Card Component matching the new design system
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-[20px] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] transition-all duration-300 p-5 ${className}`}>
    {children}
  </div>
);

const Trend = ({ value, isUp }) => (
  <span className={`text-[12px] font-bold flex items-center gap-1 ${isUp ? 'textemerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'} px-2 py-0.5 rounded-full whitespace-nowrap`}>
    {isUp ? <TrendingUp size={14} strokeWidth={2.5} /> : <TrendingDown size={14} strokeWidth={2.5} />}
    {value}
  </span>
);

export default function HRDashboard() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('This Year');
  const [loading, setLoading] = useState(true);

  // Stats State
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingOnboarding: 0,
    onLeaveToday: 0
  });

  const [departmentData, setDepartmentData] = useState([]);
  const [growthData, setGrowthData] = useState({ categories: [], total: [], newHires: [] });
  const [attendanceData, setAttendanceData] = useState({ categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], present: [0,0,0,0,0], absent: [0,0,0,0,0] });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/dashboard/hr', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        
        // Use the API response directly
        if (data.stats) setStats(data.stats);
        if (data.departmentData) setDepartmentData(data.departmentData);
        if (data.growthData) setGrowthData(data.growthData);
        if (data.attendanceData) setAttendanceData(data.attendanceData);
        if (data.activities) setActivities(data.activities);
        
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // --- Chart Configs ---
  const lineChartOptions = {
    chart: { type: 'areaspline', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', height: 240 },
    title: { text: null },
    xAxis: { categories: growthData.categories, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
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
      { name: 'Total Employees', data: growthData.total, color: '#3b82f6', fillColor: { linearGradient: [0, 0, 0, 300], stops: [[0, 'rgba(59, 130, 246, 0.2)'], [1, 'rgba(59, 130, 246, 0)']] } },
      { name: 'New Hires', data: growthData.newHires, color: '#10b981', fillColor: { linearGradient: [0, 0, 0, 300], stops: [[0, 'rgba(16, 185, 129, 0.2)'], [1, 'rgba(16, 185, 129, 0)']] } },
    ]
  };

  const donutChartOptions = {
    chart: { type: 'pie', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', height: 150, margin: [0, 0, 0, 0] },
    title: { 
      text: `<div style="text-align:center"><span style="font-size:20px;font-weight:900;color:#0f172a">${stats.totalEmployees}</span><br/><span style="font-size:11px;color:#64748b;font-weight:500">Total</span></div>`, 
      align: 'center', verticalAlign: 'middle', y: 12, useHTML: true
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
    chart: { type: 'column', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', height: 200 },
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

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

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
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <Users size={20} strokeWidth={2.5} />
            </div>
            <Trend value="+4.2%" isUp={true} />
          </div>
          <p className="text-[12px] font-bold text-slate-500 mb-1">Total Employees</p>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats.totalEmployees}</h3>
        </Card>

        <Card className="flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-emerald-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <UserCheck size={20} strokeWidth={2.5} />
            </div>
            <Trend value="+5.1%" isUp={true} />
          </div>
          <p className="text-[12px] font-bold text-slate-500 mb-1">Active Employees</p>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats.activeEmployees}</h3>
        </Card>

        <Card className="flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-amber-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100">
              <Calendar size={20} strokeWidth={2.5} />
            </div>
            <Trend value="-2.1%" isUp={false} />
          </div>
          <p className="text-[12px] font-bold text-slate-500 mb-1">On Leave Today</p>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats.onLeaveToday}</h3>
        </Card>

        <Card className="flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-purple-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
              <FileText size={20} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-bold flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">Needs Action</span>
          </div>
          <p className="text-[12px] font-bold text-slate-500 mb-1">Pending Onboarding</p>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats.pendingOnboarding}</h3>
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
          <h3 className="text-md font-extrabold text-slate-900 mb-4">Department Distribution</h3>
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-[150px] h-[150px] shrink-0 relative">
              <HighchartsReact highcharts={Highcharts} options={donutChartOptions} containerProps={{ style: { width: '100%', height: '100%' } }} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              {departmentData.map((dept, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color, boxShadow: `0 0 10px ${dept.color}80` }}></div><span className="text-sm font-bold text-slate-700">{dept.name}</span></div>
                  <span className="text-sm font-black text-slate-900">{dept.y} <span className="text-slate-400 font-semibold ml-1">({Math.round((dept.y / stats.totalEmployees) * 100) || 0}%)</span></span>
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
            {activities.length > 0 ? activities.map((act) => (
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
            )) : (
               <div className="text-sm text-gray-400 text-center py-6 font-medium">No recent activity</div>
            )}
          </div>
        </Card>

      </div>

    </div>
  );
}
