import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, Calendar, FileText, Briefcase, Building2, 
  TrendingUp, TrendingDown, ArrowRight, Zap, CheckCircle, XCircle, Clock,
  Lock, Unlock, AlertCircle, ShieldCheck, UserPlus, MapPin, Eye, ExternalLink, Activity
} from 'lucide-react';
import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

Highcharts.setOptions({ accessibility: { enabled: false } });

// --- Shared Card Component matching the new design system
const Card = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-[20px] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] transition-all duration-300 p-5 ${className}`}
  >
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
  const [timeFilter, setTimeFilter] = useState('This Year');
  const [loading, setLoading] = useState(true);

  // Role details
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = localStorage.getItem('userRole') || currentUser.role || 'HR Head';
  const roleLower = userRole.toLowerCase();
  const cleanRole = roleLower.replace(/[^a-z0-9]/g, '');
  const isMasterAdmin = ['super admin', 'superadmin', 'admin'].includes(roleLower) || ['superadmin', 'admin'].includes(cleanRole);
  const isHRHead = ['hr head', 'hr_head', 'hr admin', 'hradmin', 'hr'].includes(roleLower) || 
                   ['hrhead', 'hradmin', 'hr'].includes(cleanRole) || 
                   (currentUser.designation || '').toLowerCase().includes('hr head') ||
                   isMasterAdmin;
  const isHRManager = !isHRHead && (['hr manager', 'hr_manager', 'hrmanager'].includes(roleLower) || 
                     ['hrmanager'].includes(cleanRole) || 
                     (currentUser.designation || '').toLowerCase().includes('hr manager'));
  const isHRExecutive = !isHRHead && !isHRManager;
  const userZone = currentUser.zone || localStorage.getItem('userZone') || 'NORTH';

  // Stats State
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingOnboarding: 0,
    onLeaveToday: 0,
    hrManagersCount: 0,
    hrExecutivesCount: 0,
    totalJobApplications: 0,
    pendingJobApplications: 0,
    hiredJobApplications: 0
  });

  const [hrManagers, setHrManagers] = useState([]);
  const [hrExecutives, setHrExecutives] = useState([]);
  const [unblockQueries, setUnblockQueries] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [growthData, setGrowthData] = useState({ categories: [], total: [], newHires: [] });
  const [attendanceData, setAttendanceData] = useState({ categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], present: [0,0,0,0,0], absent: [0,0,0,0,0] });
  const [activities, setActivities] = useState([]);
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('ALL');

  useEffect(() => {
    fetchDashboardData(selectedZoneFilter);
    fetchUnblockQueries();
  }, [selectedZoneFilter]);

  const fetchUnblockQueries = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/unblock-queries`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUnblockQueries(Array.isArray(data.requests) ? data.requests : []);
      }
    } catch (err) {
      console.error('Failed to fetch unblock queries:', err);
    }
  };

  const fetchDashboardData = async (zoneParam = 'ALL') => {
    try {
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_API_BASE_URL}/dashboard/hr${zoneParam !== 'ALL' ? `?zone=${zoneParam}` : ''}`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.stats) setStats(data.stats);
        if (data.hrManagers) setHrManagers(data.hrManagers);
        if (data.hrExecutives) setHrExecutives(data.hrExecutives);
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
    credits: { enabled: false }, legend: { itemStyle: { color: '#64748b', fontWeight: '600', fontSize: '12px' }, margin: 10 },
    plotOptions: { column: { borderRadius: 6, pointPadding: 0.2, groupPadding: 0.1 } },
    series: [
      { name: 'Present', data: attendanceData.present, color: '#489b0d' },
      { name: 'Absent', data: attendanceData.absent, color: '#f43f5e' }
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

  if (loading) return <div className="p-10 text-center font-bold text-slate-600">Loading HR Dashboard...</div>;

  return (
    <div className="w-full space-y-8 pb-12 bg-slate-50/50 min-h-screen">
      
      {/* Dynamic Header based on exact Role */}
      <div className="relative overflow-hidden bg-white rounded-[24px] p-6 sm:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-emerald-50/30 rounded-full blur-3xl opacity-70 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50/90 border border-indigo-100 rounded-full text-indigo-700 text-[11px] font-extrabold tracking-wide uppercase">
              <ShieldCheck size={14} className="text-indigo-600 shrink-0" />
              <span>
                {isHRHead 
                  ? '👑 HR Head Authority Control (Pan-India)' 
                  : isHRManager 
                    ? '👔 HR Manager (Team Leader)' 
                    : `📋 HR Executive (${userZone} Zone Recruiter)`
                }
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <span>
                {isHRHead 
                  ? 'HR Central Dashboard' 
                  : isHRManager 
                    ? 'HR Manager Hub' 
                    : 'Zone Recruitment Workspace'
                }
              </span>
              <span className="inline-block origin-bottom-right hover:rotate-12 transition-transform cursor-default text-2xl sm:text-3xl">👋</span>
            </h1>
            <p className="text-[13px] sm:text-[14px] text-slate-500 font-medium leading-relaxed">
              {isHRHead 
                ? 'Central Authority: Monitor HR Managers, Executive Team, and Pan-India Recruitment Activities.'
                : isHRManager
                  ? 'Team Leader Hub: Manage your assigned HR Executives, track their candidate recruitment pipeline & daily status.'
                  : `Zone Operations: Process ${userZone} Zone candidates, conduct interviews, and track candidate onboarding.`
              }
            </p>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            {isHRHead && (
              <button 
                onClick={() => navigate('/users/add')}
                className="inline-flex items-center gap-2 bg-[#489b0d] hover:bg-[#3d840b] active:scale-[0.98] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-[0_4px_14px_rgba(72,155,13,0.3)] hover:shadow-[0_6px_20px_rgba(72,155,13,0.4)] transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                <UserPlus size={16} strokeWidth={2.5} className="shrink-0" />
                <span>Create HR Staff</span>
              </button>
            )}
            {isHRManager && (
              <button 
                onClick={() => navigate('/users/add')}
                className="inline-flex items-center gap-2 bg-[#489b0d] hover:bg-[#3d840b] active:scale-[0.98] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-[0_4px_14px_rgba(72,155,13,0.3)] hover:shadow-[0_6px_20px_rgba(72,155,13,0.4)] transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                <UserPlus size={16} strokeWidth={2.5} className="shrink-0" />
                <span>+ Add HR Executive</span>
              </button>
            )}
            <button 
              onClick={() => navigate('/hr/recruitment')}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <Briefcase size={16} strokeWidth={2.5} className="shrink-0" />
              <span>{isHRExecutive ? 'My Zone Applications' : 'Recruitment Pipeline'}</span>
            </button>
          </div>
        </div>

        {/* Zone Filter Tabs for HR Head */}
        {isHRHead && (
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[#489b0d]" />
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Operating Zone View:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {['ALL', 'NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL'].map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setSelectedZoneFilter(z)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedZoneFilter === z
                      ? 'bg-white text-slate-900 shadow-xs font-black'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {z === 'ALL' ? '🌐 All India (Pan-India)' : `${z} Zone`}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Pending Login Unblock Queries Alert Banner (For HR Head) */}
      {isHRHead && unblockQueries.length > 0 && (
        <div className="bg-gradient-to-r from-rose-500 to-amber-600 rounded-[20px] p-5 text-white shadow-lg shadow-rose-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Lock size={22} className="text-white" />
            </div>
            <div>
              <h4 className="text-base font-black flex items-center gap-2">
                <span>{unblockQueries.length} Employee(s) Waiting for Login Approval / Unblock</span>
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              </h4>
              <p className="text-xs text-rose-100 mt-0.5">
                Employees have submitted unlock queries directly from the login page. You can approve their login in 1 click.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/employees')}
            className="px-4 py-2 bg-white text-rose-700 font-extrabold text-xs rounded-xl shadow hover:bg-rose-50 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Unlock size={14} /> Review & Unblock Now &rarr;
          </button>
        </div>
      )}

      {/* KPI Cards dynamically rendered based on Role */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        
        {/* Card 1 */}
        {isHRHead && (
          <Card className="flex flex-col relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <Users size={20} strokeWidth={2.5} />
              </div>
              <Trend value="+4.2%" isUp={true} />
            </div>
            <p className="text-[12px] font-bold text-slate-500 mb-1">Total Employees</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats.totalEmployees}</h3>
          </Card>
        )}

        {isHRManager && (
          <Card onClick={() => navigate('/users')} className="flex flex-col relative overflow-hidden group cursor-pointer hover:border-indigo-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                <UserCheck size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">My Team</span>
            </div>
            <p className="text-[12px] font-bold text-slate-500 mb-1">My HR Executives</p>
            <h3 className="text-2xl font-black text-indigo-950 tracking-tight">{hrExecutives.length}</h3>
          </Card>
        )}

        {isHRExecutive && (
          <Card onClick={() => navigate('/hr/recruitment')} className="flex flex-col relative overflow-hidden group cursor-pointer hover:border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <MapPin size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">{userZone} Zone</span>
            </div>
            <p className="text-[12px] font-bold text-slate-500 mb-1">Zone Applications</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats.totalJobApplications || 0}</h3>
          </Card>
        )}

        {/* Card 2 */}
        {isHRHead && (
          <Card 
            onClick={() => navigate('/users')}
            className="flex flex-col relative overflow-hidden group cursor-pointer hover:border-indigo-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                <ShieldCheck size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">HR Team</span>
            </div>
            <p className="text-[12px] font-bold text-slate-500 mb-1">HR Managers</p>
            <h3 className="text-2xl font-black text-indigo-950 tracking-tight">{stats.hrManagersCount || 0}</h3>
          </Card>
        )}

        {isHRManager && (
          <Card onClick={() => navigate('/hr/recruitment')} className="flex flex-col relative overflow-hidden group cursor-pointer hover:border-emerald-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <Briefcase size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Pipeline</span>
            </div>
            <p className="text-[12px] font-bold text-slate-500 mb-1">Team Applications</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats.totalJobApplications || 0}</h3>
          </Card>
        )}

        {isHRExecutive && (
          <Card onClick={() => navigate('/hr/recruitment')} className="flex flex-col relative overflow-hidden group cursor-pointer hover:border-amber-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100">
                <Clock size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">To Review</span>
            </div>
            <p className="text-[12px] font-bold text-slate-500 mb-1">Pending Review</p>
            <h3 className="text-2xl font-black text-amber-900 tracking-tight">{stats.pendingJobApplications || 0}</h3>
          </Card>
        )}

        {/* Card 3 */}
        {isHRHead ? (
          <Card 
            onClick={() => navigate('/users')}
            className="flex flex-col relative overflow-hidden group cursor-pointer hover:border-emerald-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <UserCheck size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Zone-Wise</span>
            </div>
            <p className="text-[12px] font-bold text-slate-500 mb-1">HR Executives</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats.hrExecutivesCount || 0}</h3>
          </Card>
        ) : (
          <Card onClick={() => navigate('/hr/recruitment')} className="flex flex-col relative overflow-hidden group cursor-pointer hover:border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <CheckCircle size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">Hired</span>
            </div>
            <p className="text-[12px] font-bold text-slate-500 mb-1">Hired Candidates</p>
            <h3 className="text-2xl font-black text-purple-950 tracking-tight">{stats.hiredJobApplications || 0}</h3>
          </Card>
        )}

        {/* Card 4 */}
        <Card 
          onClick={() => navigate('/hr/recruitment')}
          className="flex flex-col relative overflow-hidden group cursor-pointer hover:border-amber-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100">
              <Briefcase size={20} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              {isHRHead ? 'Pan-India' : 'In Progress'}
            </span>
          </div>
          <p className="text-[12px] font-bold text-slate-500 mb-1">
            {isHRHead ? 'Job Applications' : 'Pending In Review'}
          </p>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            {isHRHead ? (stats.totalJobApplications || 0) : (stats.pendingJobApplications || 0)}
          </h3>
        </Card>

        {/* Card 5 */}
        {isHRHead ? (
          <Card 
            onClick={() => navigate('/employees')}
            className={`flex flex-col relative overflow-hidden group cursor-pointer transition-all ${
              unblockQueries.length > 0 ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/20' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                unblockQueries.length > 0 ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                <Lock size={20} strokeWidth={2.5} />
              </div>
              {unblockQueries.length > 0 ? (
                <span className="text-[11px] font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full animate-pulse">Action Needed</span>
              ) : (
                <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">All Clear</span>
              )}
            </div>
            <p className="text-[12px] font-bold text-slate-500 mb-1">Unlock Queries</p>
            <h3 className="text-2xl font-black text-rose-900 tracking-tight">{unblockQueries.length}</h3>
          </Card>
        ) : (
          <Card onClick={() => navigate('/employees/attendance')} className="flex flex-col relative overflow-hidden group cursor-pointer hover:border-emerald-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <Clock size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Attendance</span>
            </div>
            <p className="text-[12px] font-bold text-slate-500 mb-1">{isHRManager ? 'Team Present' : 'My Status'}</p>
            <h3 className="text-2xl font-black text-emerald-950 tracking-tight">
              {isHRManager ? (attendanceData.present.slice(-1)[0] || 0) : 'Present'}
            </h3>
          </Card>
        )}

      </div>

      {/* HR Team Hierarchy & Activity Tracking Section */}
      {(isHRHead || isHRManager) && (
        <div className={`grid grid-cols-1 ${isHRHead ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-6`}>
          
          {/* HR Managers List (Only visible to HR Head) */}
          {isHRHead && (
            <Card className="flex flex-col">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-md font-extrabold text-slate-900 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-indigo-600" /> HR Managers (Team Leaders)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Created & Managed directly by HR Head</p>
                </div>
                <button 
                  onClick={() => navigate('/users/add')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  + Add Manager
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[280px] pr-1">
                {hrManagers.length > 0 ? hrManagers.map((mgr, idx) => (
                  <div key={mgr._id || idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-indigo-50/30 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        {(mgr.name || 'M')[0]}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{mgr.name}</h4>
                        <p className="text-[11px] text-slate-500">{mgr.email} • {mgr.empId || 'EMP'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${mgr.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {mgr.status || 'Active'}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">Zone: {mgr.zone || 'ALL'}</p>
                    </div>
                  </div>
                )) : (
                  <div className="py-8 text-center text-xs text-slate-400 font-medium">
                    No HR Managers created yet. Click "+ Add Manager" to create one.
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* HR Executives List (Visible to HR Head and HR Manager) */}
          <Card className="flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-md font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-600" /> 
                  {isHRHead ? 'HR Executives (Zone-Wise Recruiters)' : 'My Assigned HR Executives'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isHRHead ? 'Created by HR Head or HR Manager • Assigned by Zone' : 'Executives under your managerial oversight'}
                </p>
              </div>
              <button 
                onClick={() => navigate('/users/add')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                + Add Executive
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[280px] pr-1">
              {hrExecutives.length > 0 ? hrExecutives.map((exec, idx) => (
                <div key={exec._id || idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-emerald-50/30 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {(exec.name || 'E')[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{exec.name}</h4>
                      <p className="text-[11px] text-slate-500">{exec.email} • {exec.reportsToManagerName ? `Under ${exec.reportsToManagerName}` : 'Central HR'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {exec.zone || 'NORTH'} Zone
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">{exec.status || 'Active'}</p>
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center text-xs text-slate-400 font-medium">
                  No HR Executives mapped under your team yet. Click "+ Add Executive" to add one.
                </div>
              )}
            </div>
          </Card>

        </div>
      )}

      {/* Main Charts & Activity Logs */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Line Chart */}
        <Card className="xl:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Staff Growth & Hiring Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">Cumulative workforce expansion across all teams</p>
            </div>
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

        {/* Live HR Activities Log */}
        <Card className="xl:col-span-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Activity size={18} className="text-blue-600" /> HR & Recruitment Activity
            </h3>
            <button 
              onClick={() => navigate('/hr/recruitment')}
              className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
            >
              View Pipeline
            </button>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[320px] pr-1">
            {activities.length > 0 ? activities.map((act, index) => (
              <div key={act.id || index} className="flex gap-3.5 group">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                  act.type === 'add' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white' : 
                  act.type === 'approve' ? 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-500 group-hover:text-white' :
                  act.type === 'doc' ? 'bg-amber-50 text-amber-500 border-amber-100 group-hover:bg-amber-500 group-hover:text-white' :
                  'bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-500 group-hover:text-white'
                }`}>
                  <ActivityIcon type={act.type} />
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-slate-800 leading-snug">{act.action}</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">{act.user}</p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-1">{act.time}</p>
                </div>
              </div>
            )) : (
               <div className="text-sm text-gray-400 text-center py-6 font-medium">No recent activity</div>
            )}
          </div>
        </Card>

      </div>

      {/* Bottom Section (Donut & Attendance) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Donut Chart */}
        <Card className="flex flex-col">
          <h3 className="text-md font-extrabold text-slate-900 mb-4">Department Distribution</h3>
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6">
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
        <Card className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-slate-900">Attendance (This Week)</h3>
          </div>
          <div className="flex-1 -mx-2">
            <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
          </div>
        </Card>

      </div>

    </div>
  );
}
