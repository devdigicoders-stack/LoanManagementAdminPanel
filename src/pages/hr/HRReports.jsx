import { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReactImport from 'highcharts-react-official';
import { Download, Filter, Calendar, Users, FileText, CheckCircle2, TrendingUp, Award, Clock, Zap, AlertCircle, MapPin, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const HighchartsReact = HighchartsReactImport.default || HighchartsReactImport;
Highcharts.setOptions({ accessibility: { enabled: false } });

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-[20px] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] transition-all duration-300 p-5 ${className}`}>
    {children}
  </div>
);

export default function HRReports() {
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || localStorage.getItem('admin') || '{}');
    } catch {
      return {};
    }
  })();

  const userRole = (currentUser.role || '').toLowerCase();
  const cleanRole = userRole.replace(/[^a-z0-9]/g, '');
  const isHrExecutive = cleanRole.includes('executive');
  const isHrManager = cleanRole.includes('manager') && !cleanRole.includes('head');
  const userZone = currentUser.zone || 'NORTH';

  const [reportType, setReportType] = useState('employee');
  const [department, setDepartment] = useState('All');
  const [zone, setZone] = useState(isHrExecutive ? userZone : 'All');
  const [dateRange, setDateRange] = useState('This Month');
  const [reportData, setReportData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchReportData();
    fetchEmployees();
  }, [reportType, department, zone]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setEmployees(await res.json());
    } catch (e) {}
  };

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = reportType === 'leave' ? 'leaves' : reportType;
      const params = new URLSearchParams();
      if (department && department !== 'All') params.append('department', department);
      if (zone && zone !== 'All') params.append('zone', zone);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reports/${endpoint}${queryString}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      } else {
        toast.error('Failed to load report data');
      }
    } catch (e) {
      toast.error('Server error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Premium Highcharts Configs ---

  const commonChartOptions = {
    chart: { style: { fontFamily: 'inherit' }, backgroundColor: 'transparent' },
    title: { text: null },
    credits: { enabled: false },
    legend: { itemStyle: { color: '#64748b', fontWeight: '600', fontSize: '12px' }, symbolRadius: 6, margin: 20 },
    tooltip: { backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 12, borderWidth: 0, shadow: true, padding: 12 }
  };

  // 1. Employee Report Charts
  const departmentChartOptions = {
    ...commonChartOptions,
    chart: { type: 'pie', backgroundColor: 'transparent', height: 240, margin: [0,0,0,0] },
    title: { 
      text: `<div style="text-align:center"><span style="font-size:20px;font-weight:900;color:#0f172a">${reportData?.totalEmployees || 0}</span><br/><span style="font-size:11px;color:#64748b;font-weight:500">Total</span></div>`, 
      align: 'center', verticalAlign: 'middle', y: 15, useHTML: true
    },
    plotOptions: {
      pie: {
        innerSize: '80%', borderWidth: 0, showInLegend: true,
        dataLabels: { enabled: false }
      }
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
    series: [{
      name: 'Employees',
      data: reportData?.departmentChartData || []
    }]
  };

  const employeeGrowthOptions = {
    ...commonChartOptions,
    chart: { type: 'areaspline', backgroundColor: 'transparent', height: 240 },
    xAxis: { categories: reportData?.growthCategories || [], labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, gridLineColor: '#f8fafc', gridLineDashStyle: 'Dash' },
    plotOptions: {
      areaspline: { fillOpacity: 0.1, marker: { radius: 4, symbol: 'circle', lineWidth: 2, lineColor: '#fff' }, lineWidth: 3 }
    },
    series: [{
      name: 'New Hires', data: reportData?.growthData || [], color: '#3b82f6', 
      fillColor: { linearGradient: [0, 0, 0, 300], stops: [[0, 'rgba(59, 130, 246, 0.2)'], [1, 'rgba(59, 130, 246, 0)']] }
    }]
  };

  // 2. Attendance Report Charts
  const attendanceMonthlyOptions = {
    ...commonChartOptions,
    chart: { type: 'column', backgroundColor: 'transparent', height: 240 },
    xAxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'], labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, gridLineColor: '#f8fafc', gridLineDashStyle: 'Dash' },
    plotOptions: { column: { stacking: 'normal', borderRadius: 4, borderWidth: 0 } },
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    series: [
      { name: 'Present', data: reportData?.attendanceWeekly?.present || [] },
      { name: 'Late/Half Day', data: reportData?.attendanceWeekly?.late || [] },
      { name: 'Absent/Leave', data: reportData?.attendanceWeekly?.absent || [] }
    ]
  };

  const lateDepartmentOptions = {
    ...commonChartOptions,
    chart: { type: 'bar', backgroundColor: 'transparent', height: 240 },
    xAxis: { categories: reportData?.lateDepartment?.categories || [], labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, gridLineColor: '#f8fafc', gridLineDashStyle: 'Dash' },
    plotOptions: { bar: { borderRadius: 4, borderWidth: 0, colorByPoint: true } },
    colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'],
    series: [{ name: 'Late Incidents', data: reportData?.lateDepartment?.data || [] }],
    legend: { enabled: false }
  };

  // 3. Leave Report Charts
  const leaveSummaryOptions = {
    ...commonChartOptions,
    chart: { type: 'pie', backgroundColor: 'transparent', height: 240 },
    plotOptions: { pie: { innerSize: '75%', borderWidth: 0, showInLegend: true, dataLabels: { enabled: false } } },
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    series: [{ name: 'Leaves', data: reportData?.leaveSummaryData || [] }]
  };

  const leaveTypesOptions = {
    ...commonChartOptions,
    chart: { type: 'column', backgroundColor: 'transparent', height: 240 },
    xAxis: { categories: reportData?.leaveTypesCategories || [], labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, gridLineColor: '#f8fafc', gridLineDashStyle: 'Dash' },
    plotOptions: { column: { borderRadius: 4, borderWidth: 0, colorByPoint: true } },
    colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
    series: [{ name: 'Days Taken', data: reportData?.leaveTypesData || [] }],
    legend: { enabled: false }
  };

  // 4. Document Report Charts
  const documentStatusOptions = {
    ...commonChartOptions,
    chart: { type: 'pie', backgroundColor: 'transparent', height: 240 },
    plotOptions: { pie: { innerSize: '75%', borderWidth: 0, showInLegend: true, dataLabels: { enabled: false } } },
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    series: [{ name: 'Documents', data: reportData?.documentStatusData || [] }]
  };

  const documentUploadsOptions = {
    ...commonChartOptions,
    chart: { type: 'column', backgroundColor: 'transparent', height: 240 },
    xAxis: { categories: reportData?.uploadsDepartment?.categories || [], labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, gridLineColor: '#f8fafc', gridLineDashStyle: 'Dash' },
    plotOptions: { column: { borderRadius: 4, borderWidth: 0, colorByPoint: true } },
    colors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
    series: [{ name: 'Uploads', data: reportData?.uploadsDepartment?.data || [] }],
    legend: { enabled: false }
  };

  // 5. Performance Report Charts
  const performanceRatingsOptions = {
    ...commonChartOptions,
    chart: { type: 'column', backgroundColor: 'transparent', height: 240 },
    xAxis: { categories: ['Outstanding', 'Exceeds Expectations', 'Meets Expectations', 'Needs Improvement'], labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, gridLineColor: '#f8fafc', gridLineDashStyle: 'Dash' },
    plotOptions: { column: { borderRadius: 4, borderWidth: 0, colorByPoint: true } },
    colors: ['#10b981', '#34d399', '#6ee7b7', '#fcd34d'],
    series: [{ name: 'Employees', data: reportData?.performanceRatingsData || [] }],
    legend: { enabled: false }
  };

  const kpiAchievementOptions = {
    ...commonChartOptions,
    chart: { type: 'areaspline', backgroundColor: 'transparent', height: 240 },
    xAxis: { categories: reportData?.kpiCategories || [], labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, gridLineColor: '#f8fafc', gridLineDashStyle: 'Dash', max: 100 },
    plotOptions: { areaspline: { fillOpacity: 0.1, marker: { radius: 4, symbol: 'circle', lineWidth: 2, lineColor: '#fff' }, lineWidth: 3 } },
    series: [{ name: 'Avg Score', data: reportData?.kpiData || [], color: '#8b5cf6', fillColor: { linearGradient: [0, 0, 0, 300], stops: [[0, 'rgba(139, 92, 246, 0.2)'], [1, 'rgba(139, 92, 246, 0)']] } }]
  };

  const handleExport = (type) => {
    toast.success(`Exporting ${reportType} report as ${type}...`);
  };

  return (
    <div className="w-full space-y-8 pb-12 bg-slate-50/50 min-h-screen">
      
      {/* Header & Actions */}
      <div className="relative overflow-hidden bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-70 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              {isHrExecutive ? "My Activity & Hiring Report" : "HR Reports & Analytics"}
            </h1>
            <p className="text-[15px] text-slate-500 font-medium mt-2">
              {isHrExecutive 
                ? `Track candidate hiring, onboarding activity, and staff handled by you in ${userZone} zone`
                : "Generate, view, and export insights across all HR modules and zones"}
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => handleExport('Excel')}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
            >
              <Download size={16} /> Excel
            </button>
            <button 
              onClick={() => handleExport('PDF')}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <Zap size={16} className="text-yellow-400 fill-yellow-400" /> Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Report Controls */}
      <div className="bg-white p-2 rounded-[20px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center p-1 bg-slate-50/80 rounded-[16px] w-full md:w-auto overflow-x-auto">
          {[
            { id: 'employee', label: 'Employees', icon: Users },
            { id: 'attendance', label: 'Attendance', icon: Clock },
            { id: 'leave', label: 'Leaves', icon: Calendar },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'performance', label: 'Performance', icon: Award }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-[13px] font-bold whitespace-nowrap transition-all ${
                reportType === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              <tab.icon size={16} strokeWidth={2.5} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 pr-2 w-full md:w-auto pb-2 md:pb-0">
          {isHrExecutive ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-[12px] bg-blue-50 border border-blue-200 text-blue-800 text-[13px] font-bold shadow-sm">
              <MapPin size={15} className="text-blue-600" />
              <span>Zone: {userZone}</span>
              <span className="text-[10px] uppercase tracking-wider bg-blue-200/70 text-blue-900 px-1.5 py-0.5 rounded font-black">Assigned</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-slate-50 border border-slate-200">
              <MapPin size={16} className="text-slate-400" />
              <select 
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="text-[13px] font-bold text-slate-700 focus:outline-none bg-transparent cursor-pointer"
              >
                <option value="All">All Zones</option>
                <option value="NORTH">North Zone</option>
                <option value="SOUTH">South Zone</option>
                <option value="EAST">East Zone</option>
                <option value="WEST">West Zone</option>
                <option value="CENTRAL">Central Zone</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-slate-50 border border-slate-200">
            <Filter size={16} className="text-slate-400" />
            <select 
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="text-[13px] font-bold text-slate-700 focus:outline-none bg-transparent cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="Sales">Sales</option>
              <option value="Operations">Operations</option>
              <option value="HR">HR</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-slate-50 border border-slate-200">
            <Calendar size={16} className="text-slate-400" />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-[13px] font-bold text-slate-700 focus:outline-none bg-transparent cursor-pointer"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Dashboards */}
      <div className="space-y-6">
        
        {reportType === 'employee' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[{ label: 'Total Employees', val: reportData?.totalEmployees || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' }, { label: 'Active Employees', val: reportData?.totalEmployees || 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' }, { label: 'New Joiners (Month)', val: reportData?.growthData?.[reportData?.growthData?.length - 1] || 0, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' }, { label: 'Inactive/Left', val: 0, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' }].map((stat, i) => (
                <Card key={i} className="flex flex-col relative overflow-hidden group">
                   <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 border ${stat.border}`}>
                        <stat.icon size={22} strokeWidth={2.5} />
                      </div>
                   </div>
                   <p className="text-[13px] font-bold text-slate-500 mb-1">{stat.label}</p>
                   <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stat.val}</h3>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-extrabold text-slate-900 mb-6">Employees by Department</h3>
                <HighchartsReact highcharts={Highcharts} options={departmentChartOptions} />
              </Card>
              <Card>
                <h3 className="text-lg font-extrabold text-slate-900 mb-6">New Joiners (Last 6 Months)</h3>
                <HighchartsReact highcharts={Highcharts} options={employeeGrowthOptions} />
              </Card>
            </div>

            {/* Employee Table */}
            <Card>
              <h3 className="text-lg font-extrabold text-slate-900 mb-4">All Employees</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['Emp ID','Name','Role','Division','Status','Onboarding'].map(h => (<th key={h} className="py-3 px-3 font-bold text-slate-500 text-[11px] uppercase tracking-wide whitespace-nowrap">{h}</th>))}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-mono text-[12px] text-slate-500">{emp.empId}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{emp.name}</td>
                        <td className="py-3 px-3 text-slate-600">{emp.role}</td>
                        <td className="py-3 px-3 text-slate-600">{emp.division || 'N/A'}</td>
                        <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded text-[11px] font-bold ${emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{emp.status}</span></td>
                        <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded text-[11px] font-bold ${emp.onboardingStatus === 'Done' ? 'bg-emerald-50 text-emerald-700' : emp.onboardingStatus === 'Submitted' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>{emp.onboardingStatus}</span></td>
                      </tr>
                    ))}
                    {employees.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-slate-400">No employees found</td></tr>}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {reportType === 'attendance' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[{ label: 'Avg Daily Present', val: '92%', color: 'text-emerald-600' }, { label: 'Avg Late Arrivals', val: '8/day', color: 'text-amber-500' }, { label: 'Absence Rate', val: '3.5%', color: 'text-rose-500' }, { label: 'Half Days (Total)', val: '24', color: 'text-blue-500' }].map((stat, i) => (
                <Card key={i} className="flex flex-col">
                   <p className="text-[13px] font-bold text-slate-500 mb-1">{stat.label}</p>
                   <h3 className={`text-3xl font-black tracking-tight ${stat.color}`}>{stat.val}</h3>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-extrabold text-slate-900 mb-6">Monthly Attendance Overview</h3>
                <HighchartsReact highcharts={Highcharts} options={attendanceMonthlyOptions} />
              </Card>
              <Card>
                <h3 className="text-lg font-extrabold text-slate-900 mb-6">Late Arrivals by Department</h3>
                <HighchartsReact highcharts={Highcharts} options={lateDepartmentOptions} />
              </Card>
            </div>

            {/* Attendance Table */}
            <Card>
              <h3 className="text-lg font-extrabold text-slate-900 mb-4">Attendance Log (All Employees)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['Employee','Division','Date','Status','In Time','Out Time','Remarks'].map(h => (<th key={h} className="py-3 px-3 font-bold text-slate-500 text-[11px] uppercase tracking-wide whitespace-nowrap">{h}</th>))}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.flatMap(emp => (emp.attendance || []).map(att => ({ ...att, empName: emp.name, division: emp.division })))
                      .sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,50)
                      .map((row, i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-semibold text-slate-800">{row.empName}</td>
                          <td className="py-3 px-3 text-slate-500">{row.division || 'N/A'}</td>
                          <td className="py-3 px-3 text-slate-600">{row.date}</td>
                          <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded text-[11px] font-bold ${row.status === 'Present' ? 'bg-emerald-50 text-emerald-700' : row.status === 'Absent' ? 'bg-rose-50 text-rose-700' : row.status === 'Leave' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>{row.status}</span></td>
                          <td className="py-3 px-3 text-slate-500">{row.inTime || '-'}</td>
                          <td className="py-3 px-3 text-slate-500">{row.outTime || '-'}</td>
                          <td className="py-3 px-3 text-slate-500">{row.remarks || '-'}</td>
                        </tr>
                    ))}
                    {employees.every(e => !e.attendance?.length) && <tr><td colSpan={7} className="py-8 text-center text-slate-400">No attendance records found</td></tr>}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {reportType === 'leave' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[{ label: 'Total Leaves Taken', val: (reportData?.leaveSummaryData?.[0]?.y || 0) + (reportData?.leaveSummaryData?.[1]?.y || 0) + (reportData?.leaveSummaryData?.[2]?.y || 0), color: 'text-slate-800' }, { label: 'Approved Requests', val: reportData?.leaveSummaryData?.[0]?.y || 0, color: 'text-emerald-600' }, { label: 'Pending Requests', val: reportData?.leaveSummaryData?.[1]?.y || 0, color: 'text-amber-500' }, { label: 'Rejected Requests', val: reportData?.leaveSummaryData?.[2]?.y || 0, color: 'text-rose-500' }].map((stat, i) => (
                <Card key={i} className="flex flex-col">
                   <p className="text-[13px] font-bold text-slate-500 mb-1">{stat.label}</p>
                   <h3 className={`text-3xl font-black tracking-tight ${stat.color}`}>{stat.val}</h3>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-extrabold text-slate-900 mb-6">Leave Status Summary</h3>
                <HighchartsReact highcharts={Highcharts} options={leaveSummaryOptions} />
              </Card>
              <Card>
                <h3 className="text-lg font-extrabold text-slate-900 mb-6">Most Used Leave Types</h3>
                <HighchartsReact highcharts={Highcharts} options={leaveTypesOptions} />
              </Card>
            </div>

            {/* Leave Table */}
            <Card>
              <h3 className="text-lg font-extrabold text-slate-900 mb-4">Leave Requests (All Employees)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['Employee','Leave Type','From','To','Days','Status','Reason'].map(h => (<th key={h} className="py-3 px-3 font-bold text-slate-500 text-[11px] uppercase tracking-wide whitespace-nowrap">{h}</th>))}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.flatMap(emp => (emp.leaves || []).map(lv => ({ ...lv, empName: emp.name })))
                      .sort((a,b) => new Date(b.startDate) - new Date(a.startDate))
                      .map((row, i) => {
                        const days = row.startDate && row.endDate ? Math.round((new Date(row.endDate) - new Date(row.startDate)) / (1000*60*60*24)) + 1 : '-';
                        return (
                          <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-3 font-semibold text-slate-800">{row.empName}</td>
                            <td className="py-3 px-3 text-slate-600">{row.type || 'N/A'}</td>
                            <td className="py-3 px-3 text-slate-500">{row.startDate}</td>
                            <td className="py-3 px-3 text-slate-500">{row.endDate}</td>
                            <td className="py-3 px-3 font-semibold">{days}</td>
                            <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded text-[11px] font-bold ${row.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : row.status === 'Rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{row.status}</span></td>
                            <td className="py-3 px-3 text-slate-500 max-w-[180px] truncate">{row.reason || '-'}</td>
                          </tr>
                        );
                      })}
                    {employees.every(e => !e.leaves?.length) && <tr><td colSpan={7} className="py-8 text-center text-slate-400">No leave requests found</td></tr>}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {reportType === 'documents' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[{ label: 'Total Documents', val: (reportData?.documentStatusData?.[0]?.y || 0) + (reportData?.documentStatusData?.[1]?.y || 0) + (reportData?.documentStatusData?.[2]?.y || 0), color: 'text-slate-800' }, { label: 'Verified', val: reportData?.documentStatusData?.[0]?.y || 0, color: 'text-emerald-600' }, { label: 'Pending', val: reportData?.documentStatusData?.[1]?.y || 0, color: 'text-amber-500' }, { label: 'Rejected', val: reportData?.documentStatusData?.[2]?.y || 0, color: 'text-rose-500' }].map((stat, i) => (
                <Card key={i} className="flex flex-col">
                   <p className="text-[13px] font-bold text-slate-500 mb-1">{stat.label}</p>
                   <h3 className={`text-3xl font-black tracking-tight ${stat.color}`}>{stat.val}</h3>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-extrabold text-slate-900 mb-6">Document Verification Status</h3>
                <HighchartsReact highcharts={Highcharts} options={documentStatusOptions} />
              </Card>
              <Card>
                <h3 className="text-lg font-extrabold text-slate-900 mb-6">Uploads by Department</h3>
                <HighchartsReact highcharts={Highcharts} options={documentUploadsOptions} />
              </Card>
            </div>

            {/* Document Table */}
            <Card>
              <h3 className="text-lg font-extrabold text-slate-900 mb-4">Document Status (All Employees)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['Employee','Division','Document Name','Type/Key','Uploaded On','Status'].map(h => (<th key={h} className="py-3 px-3 font-bold text-slate-500 text-[11px] uppercase tracking-wide whitespace-nowrap">{h}</th>))}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.flatMap(emp => (emp.documents || []).map(doc => ({ ...doc, empName: emp.name, division: emp.division })))
                      .sort((a,b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
                      .map((row, i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-semibold text-slate-800">{row.empName}</td>
                          <td className="py-3 px-3 text-slate-500">{row.division || 'N/A'}</td>
                          <td className="py-3 px-3 text-slate-600 max-w-[160px] truncate" title={row.name}>{row.name}</td>
                          <td className="py-3 px-3 text-slate-500 capitalize">{row.key}</td>
                          <td className="py-3 px-3 text-slate-500">{row.uploadedAt ? new Date(row.uploadedAt).toLocaleDateString() : '-'}</td>
                          <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded text-[11px] font-bold ${row.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' : row.status === 'Rejected' ? 'bg-rose-50 text-rose-700' : row.status === 'Re-upload Required' ? 'bg-orange-50 text-orange-700' : 'bg-amber-50 text-amber-700'}`}>{row.status}</span></td>
                        </tr>
                    ))}
                    {employees.every(e => !e.documents?.length) && <tr><td colSpan={6} className="py-8 text-center text-slate-400">No documents found</td></tr>}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {reportType === 'performance' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[{ label: 'Avg Rating', val: '4.2/5', color: 'text-slate-800' }, { label: 'Top Performers', val: '15', color: 'text-emerald-600' }, { label: 'Need Improvement', val: '10', color: 'text-amber-500' }, { label: 'Reviews Pending', val: '8', color: 'text-blue-600' }].map((stat, i) => (
                <Card key={i} className="flex flex-col">
                   <p className="text-[13px] font-bold text-slate-500 mb-1">{stat.label}</p>
                   <h3 className={`text-3xl font-black tracking-tight ${stat.color}`}>{stat.val}</h3>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-extrabold text-slate-900 mb-6">Employee Performance Ratings</h3>
                <HighchartsReact highcharts={Highcharts} options={performanceRatingsOptions} />
              </Card>
              <Card>
                <h3 className="text-lg font-extrabold text-slate-900 mb-6">Average KPI Score (Last 6 Months)</h3>
                <HighchartsReact highcharts={Highcharts} options={kpiAchievementOptions} />
              </Card>
            </div>

            {/* Performance/Salary Table */}
            <Card>
              <h3 className="text-lg font-extrabold text-slate-900 mb-4">Salary & Incentive Summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['Employee','Role','Gross Monthly','Transport','Performance','Achievement','Incentives','Total CTC'].map(h => (<th key={h} className="py-3 px-3 font-bold text-slate-500 text-[11px] uppercase tracking-wide whitespace-nowrap">{h}</th>))}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, i) => {
                      const ctc = (emp.grossMonthly||0)+(emp.transportation||0)+(emp.performance||0)+(emp.achievement||0)+(emp.incentives||0);
                      return (
                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-semibold text-slate-800">{emp.name}</td>
                          <td className="py-3 px-3 text-slate-500 text-[12px]">{emp.role}</td>
                          <td className="py-3 px-3 font-semibold">₹{(emp.grossMonthly||0).toLocaleString()}</td>
                          <td className="py-3 px-3 text-slate-600">₹{(emp.transportation||0).toLocaleString()}</td>
                          <td className="py-3 px-3 text-slate-600">₹{(emp.performance||0).toLocaleString()}</td>
                          <td className="py-3 px-3 text-slate-600">₹{(emp.achievement||0).toLocaleString()}</td>
                          <td className="py-3 px-3 text-slate-600">₹{(emp.incentives||0).toLocaleString()}</td>
                          <td className="py-3 px-3 font-black text-blue-600">₹{ctc.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                    {employees.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-slate-400">No employee data found</td></tr>}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}

