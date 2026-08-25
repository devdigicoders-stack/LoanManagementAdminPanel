import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import {
  BarChart3, FileText, Clock, FolderOpen, CalendarRange,
  Users, Download, Filter, ArrowRight, RefreshCw,
  CheckCircle2, XCircle, AlertCircle, TrendingUp, Activity
} from 'lucide-react';

/* ── helpers ─────────────────────────────────────────── */
const COLORS = {
  sky:    '#8ED3F4',
  soft:   '#BFE7F7',
  cream:  '#FFF8E7',
  green:  '#34D399',
  amber:  '#FBBF24',
  purple: '#A78BFA',
  red:    '#F87171',
  blue:   '#60A5FA',
  teal:   '#2DD4BF',
};

function useChart(ref, options) {
  useEffect(() => {
    if (!ref.current) return;
    const chart = Highcharts.chart(ref.current, {
      credits: { enabled: false },
      chart: { ...options.chart, backgroundColor: 'transparent', style: { fontFamily: 'inherit' } },
      title: { text: '' },
      ...options,
    });
    return () => chart.destroy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/* ── individual chart components ──────────────────────── */
function ApplicationStatusDonut() {
  const ref = useRef(null);
  useChart(ref, {
    chart: { type: 'pie', height: 280 },
    tooltip: { pointFormat: '<b>{point.y}</b> applications ({point.percentage:.1f}%)' },
    plotOptions: {
      pie: {
        innerSize: '60%',
        dataLabels: { enabled: false },
        showInLegend: true,
      },
    },
    legend: { align: 'right', verticalAlign: 'middle', layout: 'vertical', itemStyle: { fontWeight: '700', color: '#344054', fontSize: '12px' } },
    series: [{
      name: 'Applications',
      data: [
        { name: 'New',                  y: 28,  color: COLORS.sky    },
        { name: 'In Progress',          y: 45,  color: COLORS.blue   },
        { name: 'Documents Pending',    y: 32,  color: COLORS.amber  },
        { name: 'Verification Pending', y: 18,  color: COLORS.purple },
        { name: 'On Hold',              y: 12,  color: COLORS.red    },
        { name: 'Approved',             y: 56,  color: COLORS.green  },
        { name: 'Rejected',             y: 22,  color: '#FB923C'     },
        { name: 'Completed',            y: 35,  color: COLORS.teal   },
      ],
    }],
  });
  return <div ref={ref} />;
}

function MonthlyTrendBar() {
  const ref = useRef(null);
  useChart(ref, {
    chart: { type: 'column', height: 280 },
    xAxis: {
      categories: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      lineColor: '#D9EAF2',
      tickColor: '#D9EAF2',
      labels: { style: { color: '#667085', fontWeight: '700', fontSize: '12px' } },
    },
    yAxis: {
      title: { text: '' },
      gridLineColor: '#F0FAFF',
      labels: { style: { color: '#667085', fontWeight: '700', fontSize: '12px' } },
    },
    tooltip: { shared: true },
    plotOptions: { column: { borderRadius: 6, groupPadding: 0.15 } },
    legend: { itemStyle: { fontWeight: '700', color: '#344054', fontSize: '12px' } },
    series: [
      { name: 'Received',  data: [38, 42, 55, 48, 61, 72], color: COLORS.sky   },
      { name: 'Completed', data: [30, 35, 44, 40, 50, 58], color: COLORS.green },
      { name: 'Rejected',  data: [5,  4,  6,  5,  7,  9],  color: COLORS.red   },
    ],
  });
  return <div ref={ref} />;
}

function ProcessingTimeSpline() {
  const ref = useRef(null);
  useChart(ref, {
    chart: { type: 'spline', height: 260 },
    xAxis: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      lineColor: '#D9EAF2',
      labels: { style: { color: '#667085', fontWeight: '700', fontSize: '12px' } },
    },
    yAxis: {
      title: { text: 'Days', style: { color: '#667085', fontWeight: '700' } },
      gridLineColor: '#F0FAFF',
      labels: { style: { color: '#667085', fontWeight: '700', fontSize: '12px' } },
    },
    tooltip: { valueSuffix: ' days' },
    plotOptions: { spline: { marker: { enabled: true, radius: 5 } } },
    legend: { itemStyle: { fontWeight: '700', color: '#344054', fontSize: '12px' } },
    series: [
      { name: 'Avg Processing Time', data: [8.2, 7.5, 9.1, 6.8, 7.2, 5.9], color: COLORS.sky    },
      { name: 'Target',              data: [7,   7,   7,   7,   7,   7  ], color: COLORS.amber, dashStyle: 'Dash' },
    ],
  });
  return <div ref={ref} />;
}

function DocumentStatusBar() {
  const ref = useRef(null);
  useChart(ref, {
    chart: { type: 'bar', height: 260 },
    xAxis: {
      categories: ['Identity Proof', 'Address Proof', 'Income Proof', 'Bank Statement', 'Property Docs'],
      lineColor: '#D9EAF2',
      labels: { style: { color: '#667085', fontWeight: '700', fontSize: '12px' } },
    },
    yAxis: {
      title: { text: '' },
      gridLineColor: '#F0FAFF',
      labels: { style: { color: '#667085', fontWeight: '700', fontSize: '12px' } },
    },
    tooltip: { shared: true },
    plotOptions: { bar: { borderRadius: 5, dataLabels: { enabled: false } } },
    legend: { itemStyle: { fontWeight: '700', color: '#344054', fontSize: '12px' } },
    series: [
      { name: 'Verified',         data: [145, 130, 98,  112, 45], color: COLORS.green },
      { name: 'Pending',          data: [28,  22,  35,  18,  12], color: COLORS.amber },
      { name: 'Rejected',         data: [8,   6,   12,  5,   3 ], color: COLORS.red   },
      { name: 'Re-upload Needed', data: [12,  10,  18,  8,   5 ], color: COLORS.purple},
    ],
  });
  return <div ref={ref} />;
}

function EmployeePerformancePie() {
  const ref = useRef(null);
  useChart(ref, {
    chart: { type: 'pie', height: 260 },
    tooltip: { pointFormat: '<b>{point.y}</b> applications' },
    plotOptions: {
      pie: {
        dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.y}', style: { fontWeight: '700', color: '#344054', fontSize: '12px' } },
      },
    },
    series: [{
      name: 'Applications',
      data: [
        { name: 'Suresh K.',  y: 48, color: COLORS.sky    },
        { name: 'Meena R.',   y: 36, color: COLORS.green  },
        { name: 'Vikram S.',  y: 29, color: COLORS.amber  },
        { name: 'Neha T.',    y: 22, color: COLORS.purple },
        { name: 'Ravi M.',    y: 18, color: COLORS.teal   },
      ],
    }],
  });
  return <div ref={ref} />;
}

function FollowUpAreaChart() {
  const ref = useRef(null);
  useChart(ref, {
    chart: { type: 'area', height: 260 },
    xAxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      lineColor: '#D9EAF2',
      labels: { style: { color: '#667085', fontWeight: '700', fontSize: '12px' } },
    },
    yAxis: {
      title: { text: '' },
      gridLineColor: '#F0FAFF',
      labels: { style: { color: '#667085', fontWeight: '700', fontSize: '12px' } },
    },
    plotOptions: {
      area: {
        fillOpacity: 0.15,
        marker: { enabled: true, radius: 4 },
      },
    },
    legend: { itemStyle: { fontWeight: '700', color: '#344054', fontSize: '12px' } },
    series: [
      { name: 'Scheduled',  data: [12, 18, 14, 22, 16, 8, 6],  color: COLORS.sky   },
      { name: 'Completed',  data: [10, 15, 12, 18, 14, 7, 5],  color: COLORS.green },
      { name: 'Missed',     data: [2,  3,  2,  4,  2,  1, 1],  color: COLORS.red   },
    ],
  });
  return <div ref={ref} />;
}

/* ── stat card ────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, sub, color, bg }) => (
  <div className="bg-white rounded-[20px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all p-5">
    <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center mb-4 border border-[#D9EAF2]`}>
      <Icon size={22} strokeWidth={2.5} />
    </div>
    <p className="text-[12px] font-bold text-[#667085]">{label}</p>
    <p className="text-2xl font-black text-[#344054] tracking-tight mt-0.5">{value}</p>
    {sub && <p className="text-[11px] font-bold text-[#059669] mt-1">{sub}</p>}
  </div>
);

/* ── chart card wrapper ───────────────────────────────── */
const ChartCard = ({ title, subtitle, children, className = '' }) => (
  <div className={`bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 ${className}`}>
    <div className="mb-4">
      <h3 className="text-[16px] font-extrabold text-[#344054]">{title}</h3>
      {subtitle && <p className="text-[12px] text-[#667085] font-medium mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

/* ── application report table data ───────────────────── */
const mockAppReport = [
  { id: 'LN-10245', customer: 'Ramesh Patel',  type: 'Personal Loan',  amount: '₹5,00,000',  employee: 'Suresh K.', status: 'Under Review', appDate: '24 Aug 2026', complDate: '-'           },
  { id: 'LN-10241', customer: 'Priya Sharma',  type: 'Home Loan',      amount: '₹25,00,000', employee: 'Meena R.', status: 'Completed',    appDate: '20 Aug 2026', complDate: '24 Aug 2026' },
  { id: 'LN-10238', customer: 'Amit Kumar',    type: 'Business Loan',  amount: '₹8,00,000',  employee: 'Vikram S.',status: 'On Hold',      appDate: '18 Aug 2026', complDate: '-'           },
  { id: 'LN-10235', customer: 'Neha Gupta',    type: 'Personal Loan',  amount: '₹3,50,000',  employee: 'Neha T.',  status: 'Approved',     appDate: '15 Aug 2026', complDate: '22 Aug 2026' },
  { id: 'LN-10230', customer: 'Vijay Singh',   type: 'Vehicle Loan',   amount: '₹6,00,000',  employee: 'Ravi M.',  status: 'Rejected',     appDate: '12 Aug 2026', complDate: '18 Aug 2026' },
];

const STATUS_STYLE = {
  'Under Review': 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]',
  'Completed':    'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
  'On Hold':      'bg-[#FFF8E7] text-[#D97706] border-[#FDE68A]',
  'Approved':     'bg-[#DFF3FF] text-[#0369A1] border-[#BFE7F7]',
  'Rejected':     'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
};

/* ══ MAIN COMPONENT ══════════════════════════════════════ */
export default function OperationReports() {
  const [activeReport, setActiveReport] = useState(null);

  return (
    <div className="w-full bg-[#FAFCFD] min-h-screen p-4 space-y-6 pb-12">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-white rounded-[24px] p-8 border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#DFF3FF] to-[#FFF8E7] rounded-full blur-3xl opacity-70 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            {activeReport && (
              <button onClick={() => setActiveReport(null)} className="text-[13px] font-bold text-[#0284C7] hover:underline mb-2 flex items-center gap-1">
                ← Back to Reports
              </button>
            )}
            <h1 className="text-3xl font-black text-[#344054] tracking-tight">Reports & Analytics</h1>
            <p className="text-[15px] text-[#667085] font-medium mt-2">Analyze application processing and operational performance.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#344054] border border-[#D9EAF2] rounded-xl font-bold text-[13px] hover:bg-[#F0FAFF] transition-all shadow-sm">
              <Download size={16} /> Export Excel
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#FFF8E7] text-[#D97706] border border-[#FDE68A] rounded-xl font-bold text-[13px] hover:bg-[#FEF3C7] transition-all shadow-sm">
              <Download size={16} /> Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────── */}
      <div className="bg-white rounded-[24px] border border-[#D9EAF2] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-[12px] font-black text-[#667085] uppercase tracking-wider whitespace-nowrap">Date Range</label>
          <input type="date" className="px-4 py-2.5 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:ring-2 focus:ring-[#8ED3F4] focus:outline-none text-[13px] text-[#344054]" />
          <span className="text-[#667085]">—</span>
          <input type="date" className="px-4 py-2.5 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:ring-2 focus:ring-[#8ED3F4] focus:outline-none text-[13px] text-[#344054]" />
        </div>
        <select className="px-4 py-2.5 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:ring-2 focus:ring-[#8ED3F4] focus:outline-none text-[13px] font-bold text-[#344054] cursor-pointer min-w-[140px]">
          <option value="">All Statuses</option>
          <option>Under Review</option><option>Completed</option><option>On Hold</option>
        </select>
        <select className="px-4 py-2.5 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:ring-2 focus:ring-[#8ED3F4] focus:outline-none text-[13px] font-bold text-[#344054] cursor-pointer min-w-[140px]">
          <option value="">All Loan Types</option>
          <option>Personal Loan</option><option>Home Loan</option><option>Business Loan</option>
        </select>
        <div className="flex gap-3 ml-auto">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#BFE7F7] text-[#0369A1] rounded-xl font-bold text-[14px] hover:bg-[#8ED3F4] transition-colors">
            <Filter size={16} /> Apply
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#344054] border border-[#D9EAF2] rounded-xl font-bold text-[14px] hover:bg-[#F0FAFF] transition-all">
            <RefreshCw size={16} /> Reset
          </button>
        </div>
      </div>

      {/* ══ OVERVIEW DASHBOARD (default view) ══════════════ */}
      {!activeReport && (
        <>
          {/* KPI Summary */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard icon={FileText}     label="Total Applications" value="248"  sub="↑ 12% this month" color="text-[#0369A1]"  bg="bg-[#DFF3FF]"  />
            <StatCard icon={CheckCircle2} label="Completed"          value="156"  sub="↑ 8% this month"  color="text-[#059669]"  bg="bg-[#ECFDF5]"  />
            <StatCard icon={Clock}        label="In Progress"        value="45"   sub="Active now"        color="text-[#D97706]"  bg="bg-[#FFF8E7]"  />
            <StatCard icon={AlertCircle}  label="On Hold"            value="18"   sub="Needs attention"   color="text-[#7E22CE]"  bg="bg-[#F3E8FF]"  />
            <StatCard icon={XCircle}      label="Rejected"           value="22"   sub="Review required"   color="text-[#DC2626]"  bg="bg-[#FEF2F2]"  />
            <StatCard icon={TrendingUp}   label="Avg. Processing"    value="6.9d" sub="Target: 7 days"    color="text-[#0284C7]"  bg="bg-[#BFE7F7]"  />
          </div>

          {/* Row 1: Donut + Monthly Bar */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ChartCard title="Application Status Distribution" subtitle="Current breakdown across all statuses">
              <ApplicationStatusDonut />
            </ChartCard>
            <ChartCard title="Monthly Application Trends" subtitle="Received vs Completed vs Rejected (last 6 months)">
              <MonthlyTrendBar />
            </ChartCard>
          </div>

          {/* Row 2: Processing Time + Document Status */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ChartCard title="Average Processing Time" subtitle="Weekly avg. vs 7-day target (days)">
              <ProcessingTimeSpline />
            </ChartCard>
            <ChartCard title="Document Verification Status" subtitle="By document type — verified, pending, rejected">
              <DocumentStatusBar />
            </ChartCard>
          </div>

          {/* Row 3: Employee Pie + Follow-up Area */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ChartCard title="Applications by Employee" subtitle="Workload distribution across operations staff">
              <EmployeePerformancePie />
            </ChartCard>
            <ChartCard title="Follow-up Activity (This Week)" subtitle="Scheduled vs Completed vs Missed — daily">
              <FollowUpAreaChart />
            </ChartCard>
          </div>

          {/* Quick Report Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {[
              { icon: FileText,     label: 'Application Report',  key: 'application', color: 'text-[#0284C7]',  bg: 'bg-[#DFF3FF]'  },
              { icon: Clock,        label: 'Processing Report',   key: 'processing',  color: 'text-[#D97706]',  bg: 'bg-[#FFF8E7]'  },
              { icon: FolderOpen,   label: 'Document Report',     key: 'document',    color: 'text-[#059669]',  bg: 'bg-[#ECFDF5]'  },
              { icon: CalendarRange,label: 'Follow-up Report',    key: 'followup',    color: 'text-[#7E22CE]',  bg: 'bg-[#F3E8FF]'  },
              { icon: Users,        label: 'Employee Performance',key: 'performance', color: 'text-[#0369A1]',  bg: 'bg-[#BFE7F7]'  },
            ].map(r => (
              <button key={r.key} onClick={() => setActiveReport(r.key)}
                className="bg-white rounded-[20px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all p-5 text-left group">
                <div className={`w-10 h-10 rounded-xl ${r.bg} ${r.color} flex items-center justify-center mb-3 border border-[#D9EAF2] group-hover:scale-110 transition-transform`}>
                  <r.icon size={20} strokeWidth={2} />
                </div>
                <p className="text-[13px] font-extrabold text-[#344054]">{r.label}</p>
                <p className="text-[11px] font-bold text-[#0284C7] mt-2 flex items-center gap-1">View Detail <ArrowRight size={12} /></p>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ══ APPLICATION REPORT DETAIL ══════════════════════ */}
      {activeReport === 'application' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Applications', value: '248', color: 'text-[#344054]' },
              { label: 'Completed',          value: '156', color: 'text-[#059669]' },
              { label: 'Pending',            value: '52',  color: 'text-[#D97706]' },
              { label: 'On Hold',            value: '18',  color: 'text-[#7E22CE]' },
              { label: 'Rejected',           value: '22',  color: 'text-[#DC2626]' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-[20px] border border-[#D9EAF2] shadow-sm p-5">
                <p className="text-[12px] font-bold text-[#667085]">{s.label}</p>
                <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ChartCard title="Application Status Breakdown" subtitle="Count by current status">
              <ApplicationStatusDonut />
            </ChartCard>
            <ChartCard title="Monthly Trends" subtitle="Received vs Completed">
              <MonthlyTrendBar />
            </ChartCard>
          </div>

          <div className="bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="p-6 border-b border-[#D9EAF2] bg-[#FAFCFD]">
              <h3 className="text-[16px] font-extrabold text-[#344054]">Application Report</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-[#EFF9FE] border-b border-[#D9EAF2]">
                    {['Application ID','Customer','Loan Type','Amount','Assigned Employee','Status','Application Date','Completion Date'].map(h => (
                      <th key={h} className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0FAFF]">
                  {mockAppReport.map((row, i) => (
                    <tr key={i} className="hover:bg-[#F7FCFF] transition-colors">
                      <td className="py-4 px-5 text-[13px] font-bold text-[#0284C7]">{row.id}</td>
                      <td className="py-4 px-5 text-[13px] font-medium text-[#344054]">{row.customer}</td>
                      <td className="py-4 px-5 text-[13px] text-[#667085]">{row.type}</td>
                      <td className="py-4 px-5 text-[13px] font-bold text-[#344054]">{row.amount}</td>
                      <td className="py-4 px-5 text-[13px] text-[#667085]">{row.employee}</td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md border ${STATUS_STYLE[row.status] || 'bg-[#FAFCFD] text-[#667085] border-[#D9EAF2]'}`}>{row.status}</span>
                      </td>
                      <td className="py-4 px-5 text-[13px] text-[#667085]">{row.appDate}</td>
                      <td className="py-4 px-5 text-[13px] text-[#667085]">{row.complDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══ PROCESSING REPORT DETAIL ═══════════════════════ */}
      {activeReport === 'processing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Avg Processing Time', value: '6.9d', color: 'text-[#0284C7]' },
              { label: 'Pending',             value: '52',   color: 'text-[#D97706]' },
              { label: 'Completed',           value: '156',  color: 'text-[#059669]' },
              { label: 'On Hold',             value: '18',   color: 'text-[#7E22CE]' },
              { label: 'Verification Pending',value: '24',   color: 'text-[#D97706]' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-[20px] border border-[#D9EAF2] shadow-sm p-5">
                <p className="text-[12px] font-bold text-[#667085]">{s.label}</p>
                <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <ChartCard title="Processing Time Trend" subtitle="Weekly average processing time vs 7-day target">
            <ProcessingTimeSpline />
          </ChartCard>
        </div>
      )}

      {/* ══ DOCUMENT REPORT DETAIL ════════════════════════ */}
      {activeReport === 'document' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Documents',   value: '1,245', color: 'text-[#344054]' },
              { label: 'Verified',          value: '890',   color: 'text-[#059669]' },
              { label: 'Pending',           value: '142',   color: 'text-[#D97706]' },
              { label: 'Rejected',          value: '18',    color: 'text-[#DC2626]' },
              { label: 'Re-upload Required',value: '45',    color: 'text-[#7E22CE]' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-[20px] border border-[#D9EAF2] shadow-sm p-5">
                <p className="text-[12px] font-bold text-[#667085]">{s.label}</p>
                <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <ChartCard title="Document Verification by Type" subtitle="Breakdown across all document categories">
            <DocumentStatusBar />
          </ChartCard>
        </div>
      )}

      {/* ══ FOLLOW-UP REPORT DETAIL ═══════════════════════ */}
      {activeReport === 'followup' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Today's Follow-ups", value: '8',   color: 'text-[#0369A1]' },
              { label: 'Scheduled This Week', value: '42',  color: 'text-[#344054]' },
              { label: 'Completed',           value: '156', color: 'text-[#059669]' },
              { label: 'Missed',              value: '5',   color: 'text-[#DC2626]' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-[20px] border border-[#D9EAF2] shadow-sm p-5">
                <p className="text-[12px] font-bold text-[#667085]">{s.label}</p>
                <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <ChartCard title="Weekly Follow-up Activity" subtitle="Scheduled vs Completed vs Missed">
            <FollowUpAreaChart />
          </ChartCard>
        </div>
      )}

      {/* ══ EMPLOYEE PERFORMANCE DETAIL ═══════════════════ */}
      {activeReport === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ChartCard title="Applications Processed by Employee" subtitle="This month — workload distribution">
              <EmployeePerformancePie />
            </ChartCard>
            <ChartCard title="Monthly Processing Trend" subtitle="Applications handled over last 6 months">
              <MonthlyTrendBar />
            </ChartCard>
          </div>
        </div>
      )}

    </div>
  );
}
