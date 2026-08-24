import { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReactImport from 'highcharts-react-official';
import { Download, Filter, Calendar, Users, FileText, CheckCircle2, TrendingUp, Award, Clock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const HighchartsReact = HighchartsReactImport.default || HighchartsReactImport;
Highcharts.setOptions({ accessibility: { enabled: false } });

// Shared Card Component matching the new design system
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 p-6 ${className}`}>
    {children}
  </div>
);

export default function HRReports() {
  const [reportType, setReportType] = useState('employee');
  const [department, setDepartment] = useState('All');
  const [dateRange, setDateRange] = useState('This Month');

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
    chart: { type: 'pie', backgroundColor: 'transparent', height: 320, margin: [0,0,0,0] },
    title: { 
      text: `<div style="text-align:center"><span style="font-size:24px;font-weight:900;color:#0f172a">127</span><br/><span style="font-size:12px;color:#64748b;font-weight:500">Total</span></div>`, 
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
      data: [
        { name: 'Sales', y: 45 }, { name: 'Operations', y: 30 }, { name: 'HR', y: 12 }, { name: 'Credit', y: 25 }, { name: 'Accounts', y: 15 }
      ]
    }]
  };

  const employeeGrowthOptions = {
    ...commonChartOptions,
    chart: { type: 'areaspline', backgroundColor: 'transparent', height: 320 },
    xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, gridLineColor: '#f8fafc', gridLineDashStyle: 'Dash' },
    plotOptions: {
      areaspline: { fillOpacity: 0.1, marker: { radius: 4, symbol: 'circle', lineWidth: 2, lineColor: '#fff' }, lineWidth: 3 }
    },
    series: [{
      name: 'New Hires', data: [5, 8, 3, 12, 7, 15], color: '#3b82f6', 
      fillColor: { linearGradient: [0, 0, 0, 300], stops: [[0, 'rgba(59, 130, 246, 0.2)'], [1, 'rgba(59, 130, 246, 0)']] }
    }]
  };

  // 2. Attendance Report Charts
  const attendanceMonthlyOptions = {
    ...commonChartOptions,
    chart: { type: 'column', backgroundColor: 'transparent', height: 320 },
    xAxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, gridLineColor: '#f8fafc', gridLineDashStyle: 'Dash' },
    plotOptions: { column: { stacking: 'normal', borderRadius: 4, borderWidth: 0 } },
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    series: [
      { name: 'Present', data: [110, 105, 115, 120] },
      { name: 'Late/Half Day', data: [10, 15, 5, 2] },
      { name: 'Absent/Leave', data: [4, 4, 4, 2] }
    ]
  };

  const lateDepartmentOptions = {
    ...commonChartOptions,
    chart: { type: 'bar', backgroundColor: 'transparent', height: 320 },
    xAxis: { categories: ['Sales', 'Operations', 'HR', 'Credit', 'Accounts'], labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, gridLineColor: '#f8fafc', gridLineDashStyle: 'Dash' },
    plotOptions: { bar: { borderRadius: 4, borderWidth: 0, colorByPoint: true } },
    colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'],
    series: [{ name: 'Late Incidents', data: [12, 5, 2, 8, 1] }],
    legend: { enabled: false }
  };

  // 3. Leave Report Charts
  const leaveSummaryOptions = {
    ...commonChartOptions,
    chart: { type: 'pie', backgroundColor: 'transparent', height: 320 },
    plotOptions: { pie: { innerSize: '75%', borderWidth: 0, showInLegend: true, dataLabels: { enabled: false } } },
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    series: [{ name: 'Leaves', data: [{ name: 'Approved', y: 45 }, { name: 'Pending', y: 15 }, { name: 'Rejected', y: 5 }] }]
  };

  const leaveTypesOptions = {
    ...commonChartOptions,
    chart: { type: 'column', backgroundColor: 'transparent', height: 320 },
    xAxis: { categories: ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Emergency Leave'], labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, gridLineColor: '#f8fafc', gridLineDashStyle: 'Dash' },
    plotOptions: { column: { borderRadius: 4, borderWidth: 0, colorByPoint: true } },
    colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
    series: [{ name: 'Days Taken', data: [35, 60, 20, 15] }],
    legend: { enabled: false }
  };

  // 4. Document Report Charts
  const documentStatusOptions = {
    ...commonChartOptions,
    chart: { type: 'pie', backgroundColor: 'transparent', height: 320 },
    plotOptions: { pie: { innerSize: '75%', borderWidth: 0, showInLegend: true, dataLabels: { enabled: false } } },
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    series: [{ name: 'Documents', data: [{ name: 'Verified', y: 320 }, { name: 'Pending', y: 45 }, { name: 'Rejected', y: 12 }] }]
  };

  const documentUploadsOptions = {
    ...commonChartOptions,
    chart: { type: 'column', backgroundColor: 'transparent', height: 320 },
    xAxis: { categories: ['Sales', 'Operations', 'HR', 'Credit', 'Accounts'], labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, gridLineColor: '#f8fafc', gridLineDashStyle: 'Dash' },
    plotOptions: { column: { borderRadius: 4, borderWidth: 0, colorByPoint: true } },
    colors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
    series: [{ name: 'Uploads', data: [150, 90, 30, 80, 27] }],
    legend: { enabled: false }
  };

  // 5. Performance Report Charts
  const performanceRatingsOptions = {
    ...commonChartOptions,
    chart: { type: 'column', backgroundColor: 'transparent', height: 320 },
    xAxis: { categories: ['Outstanding', 'Exceeds Expectations', 'Meets Expectations', 'Needs Improvement'], labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, gridLineColor: '#f8fafc', gridLineDashStyle: 'Dash' },
    plotOptions: { column: { borderRadius: 4, borderWidth: 0, colorByPoint: true } },
    colors: ['#10b981', '#34d399', '#6ee7b7', '#fcd34d'],
    series: [{ name: 'Employees', data: [15, 35, 60, 10] }],
    legend: { enabled: false }
  };

  const kpiAchievementOptions = {
    ...commonChartOptions,
    chart: { type: 'areaspline', backgroundColor: 'transparent', height: 320 },
    xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, lineColor: '#f1f5f9', tickColor: '#f1f5f9' },
    yAxis: { title: { text: null }, labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' } }, gridLineColor: '#f8fafc', gridLineDashStyle: 'Dash', max: 100 },
    plotOptions: { areaspline: { fillOpacity: 0.1, marker: { radius: 4, symbol: 'circle', lineWidth: 2, lineColor: '#fff' }, lineWidth: 3 } },
    series: [{ name: 'Avg Score', data: [78, 82, 85, 81, 88, 92], color: '#8b5cf6', fillColor: { linearGradient: [0, 0, 0, 300], stops: [[0, 'rgba(139, 92, 246, 0.2)'], [1, 'rgba(139, 92, 246, 0)']] } }]
  };

  const handleExport = (type) => {
    toast.success(`Exporting ${reportType} report as ${type}...`);
  };

  return (
    <div className="w-full space-y-8 pb-12 bg-slate-50/50 min-h-screen">
      
      {/* Header & Actions */}
      <div className="relative overflow-hidden bg-white rounded-[24px] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-70 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              HR Reports & Analytics
            </h1>
            <p className="text-[15px] text-slate-500 font-medium mt-2">Generate, view, and export beautiful insights across all HR modules</p>
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

        <div className="flex items-center gap-3 pr-2 w-full md:w-auto pb-2 md:pb-0">
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
              {[{ label: 'Total Employees', val: '127', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' }, { label: 'Active Employees', val: '120', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' }, { label: 'New Joiners (Month)', val: '12', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' }, { label: 'Inactive/Left', val: '7', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' }].map((stat, i) => (
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
          </div>
        )}

        {reportType === 'leave' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[{ label: 'Total Leaves Taken', val: '130', color: 'text-slate-800' }, { label: 'Approved Requests', val: '45', color: 'text-emerald-600' }, { label: 'Pending Requests', val: '15', color: 'text-amber-500' }, { label: 'Rejected Requests', val: '5', color: 'text-rose-500' }].map((stat, i) => (
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
          </div>
        )}

        {reportType === 'documents' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[{ label: 'Total Documents', val: '377', color: 'text-slate-800' }, { label: 'Verified', val: '320', color: 'text-emerald-600' }, { label: 'Pending', val: '45', color: 'text-amber-500' }, { label: 'Rejected', val: '12', color: 'text-rose-500' }].map((stat, i) => (
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
          </div>
        )}

      </div>
    </div>
  );
}
// Add this simple AlertCircle component that was missing
const AlertCircle = ({ size, strokeWidth, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);
