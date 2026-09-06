import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, FileText, CheckCircle, XCircle, Clock, 
  CreditCard, Users, User, Briefcase, FileCheck, ArrowRight, UserPlus, 
  UserCheck, AlertCircle, ChevronDown, ChevronRight, X, Zap, PhoneCall,
  MapPin, Building2, BarChart3, Layers, ShieldCheck, Eye, RefreshCw,
  Search, Calendar, DollarSign, CheckCircle2, Filter, Activity, Award,
  PieChart
} from 'lucide-react';
import Highcharts from 'highcharts';
import HighchartsReactPkg from 'highcharts-react-official';
const HighchartsReact = HighchartsReactPkg.default || HighchartsReactPkg.HighchartsReact || HighchartsReactPkg;
import { useNavigate } from 'react-router-dom';

const Card = ({ children, className = "", noPadding = false }) => (
  <div className={`bg-white rounded-[20px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.07)] transition-all duration-300 ${noPadding ? '' : 'p-6'} ${className}`}>
    {children}
  </div>
);

const Trend = ({ value, isUp }) => (
  <span className={`text-[12px] font-bold flex items-center gap-1 ${isUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'} whitespace-nowrap px-2.5 py-0.5 rounded-full border ${isUp ? 'border-emerald-100' : 'border-rose-100'}`}>
    {isUp ? <TrendingUp size={13} strokeWidth={2.5} /> : <TrendingDown size={13} strokeWidth={2.5} />}
    {value}
  </span>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'loans', 'leads', 'recruitment', 'roles'
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    kpis: {
      totalApps: 0,
      approvedApps: 0,
      pendingApps: 0,
      rejectedApps: 0,
      disbursedApps: 0,
      disbursedAmount: "0",
      totalCustomers: 0,
      activeLoans: 0,
      closedLoans: 0,
      overdueLoans: 0,
      employees: 0,
      complaints: 0,
      totalLeads: 0,
      convertedLeads: 0,
      leadConversionRate: "0%",
      totalJobApps: 0,
      activeJobs: 0,
      totalCollectedEMI: "0",
      estimatedRevenue: "0",
      activeStaffToday: 0
    },
    loanTracking: {
      totalApplications: 0,
      pendingCount: 0,
      approvedCount: 0,
      disbursedCount: 0,
      rejectedCount: 0,
      totalDisbursedAmount: "₹0",
      recentApplications: [],
      topLoanTypes: []
    },
    emiTracking: {
      monthlyTarget: "₹0",
      totalCollected: "₹0",
      overdueCount: 0,
      overdueAmount: "₹0",
      collectionEfficiency: "0%",
      aging: { dpd30: 0, dpd60: 0, dpd90: 0 }
    },
    financialTracking: {
      totalDisbursed: "₹0",
      totalCollected: "₹0",
      netRevenue: "₹0",
      activePortfolio: "₹0"
    },
    leadsTracking: {
      totalLeads: 0,
      statusCounts: { New: 0, Contacted: 0, Qualified: 0, Converted: 0, Lost: 0 },
      sourceCounts: {},
      conversionRate: "0%",
      recentLeads: []
    },
    recruitmentTracking: {
      activeJobs: 0,
      totalApplications: 0,
      statusCounts: { Applied: 0, Reviewed: 0, Interview: 0, Shortlisted: 0, Hired: 0, Rejected: 0 },
      recentApplicants: []
    },
    roleProductivity: {
      distribution: {},
      totalStaff: 0,
      presentToday: 0,
      onLeave: 0,
      telecallers: { count: 0, totalAssignedLeads: 0, converted: 0, callingRate: "0%" },
      fieldAgents: { count: 0, visitsCompleted: 0, fieldCollected: "₹0", pendingVerification: 0 },
      operations: { count: 0, pendingFiles: 0, avgTAT: "-" },
      accountants: { count: 0, vouchersPassed: 0, reconciledStatus: "OK" }
    },
    chartsData: {
      'This Month': { categories: [], total: [], approved: [], disbursed: [], collected: [], areaData: [] },
      'Last Month': { categories: [], total: [], approved: [], disbursed: [], collected: [], areaData: [] },
      'This Year': { categories: [], total: [], approved: [], disbursed: [], collected: [], areaData: [] },
      'All Time': { categories: [], total: [], approved: [], disbursed: [], collected: [], areaData: [] },
    },
    topLoanTypes: [],
    recentApplications: [],
    recentActivities: [],
    notifications: []
  });

  const fetchDashboardData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
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
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const { 
    kpis, 
    chartsData, 
    loanTracking, 
    emiTracking, 
    financialTracking, 
    leadsTracking, 
    recruitmentTracking, 
    roleProductivity, 
    topLoanTypes, 
    recentApplications, 
    recentActivities 
  } = dashboardData;

  const dynamicData = chartsData[timeFilter] || chartsData['This Month'] || { categories: [], total: [], approved: [], disbursed: [], collected: [] };

  // Chart 1: Financial Flow (Disbursed vs Collected)
  const financeChartOptions = {
    chart: { type: 'areaspline', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', height: 320 },
    title: { text: null },
    xAxis: { categories: dynamicData.categories || [], labels: { style: { color: '#64748b', fontSize: '11px', fontWeight: '600' } }, lineColor: '#e2e8f0', tickColor: '#e2e8f0' },
    yAxis: { title: { text: null }, labels: { style: { color: '#64748b', fontSize: '11px', fontWeight: '600' } }, gridLineColor: '#f1f5f9', gridLineDashStyle: 'Dash', min: 0 },
    legend: { itemStyle: { color: '#334155', fontWeight: '700', fontSize: '12px' }, symbolRadius: 6, margin: 15 },
    credits: { enabled: false },
    tooltip: { shared: true, backgroundColor: 'rgba(255, 255, 255, 0.96)', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', padding: 12 },
    plotOptions: { 
      areaspline: { 
        fillOpacity: 0.12, 
        marker: { radius: 4, symbol: 'circle', lineWidth: 2, lineColor: '#fff' }, 
        lineWidth: 3 
      } 
    },
    series: [
      { name: 'Disbursed (₹)', data: dynamicData.disbursed || [0, 0, 0, 0], color: '#3b82f6', fillColor: { linearGradient: [0, 0, 0, 300], stops: [[0, 'rgba(59, 130, 246, 0.25)'], [1, 'rgba(59, 130, 246, 0)']] } },
      { name: 'Collected / Repaid (₹)', data: dynamicData.collected || [0, 0, 0, 0], color: '#10b981', fillColor: { linearGradient: [0, 0, 0, 300], stops: [[0, 'rgba(16, 185, 129, 0.25)'], [1, 'rgba(16, 185, 129, 0)']] } }
    ]
  };

  // Chart 2: Loan Pipeline Breakdown Donut
  const donutChartOptions = {
    chart: { type: 'pie', style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', height: 240, margin: [0, 0, 0, 0] },
    title: { 
      text: `<div style="text-align:center"><span style="font-size:24px;font-weight:900;color:#0f172a">${kpis.totalApps || 0}</span><br/><span style="font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase">Loans</span></div>`, 
      align: 'center', verticalAlign: 'middle', y: 15, useHTML: true
    },
    credits: { enabled: false },
    plotOptions: { 
      pie: { 
        innerSize: '78%', dataLabels: { enabled: false }, showInLegend: false,
        borderWidth: 0, colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'], size: '100%'
      } 
    },
    series: [{
      name: 'Applications',
      data: [
        { name: 'Disbursed', y: kpis.disbursedApps || 0 },
        { name: 'Approved', y: kpis.approvedApps || 0 },
        { name: 'Pending Review', y: kpis.pendingApps || 0 },
        { name: 'Rejected', y: kpis.rejectedApps || 0 }
      ]
    }]
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold text-sm">Loading Super Admin Master Command Center...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-7 pb-16 bg-slate-50/60 min-h-screen text-slate-800">
      
      {/* ── 1. COMPACT SLEEK HEADER BAR ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Dashboard Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Systems
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Real-time tracking across Loan Applications, Recoveries, Leads & Workforce.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center flex-wrap">
          <button 
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl font-bold text-xs transition-all border border-slate-200 shadow-xs hover:border-slate-300"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin text-blue-600' : 'text-slate-400'} />
            {refreshing ? 'Syncing...' : 'Sync Data'}
          </button>
          
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="This Year">This Year</option>
            <option value="All Time">All Time</option>
          </select>
        </div>
      </div>

      {/* ── 2. TOP 6 COMPACT HIGH-IMPACT METRICS ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        
        {/* Card 1: Total Disbursed */}
        <div 
          onClick={() => setActiveTab('loans')}
          className="relative overflow-hidden bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

          <div>
            <div className="flex items-center justify-between gap-1.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                <CreditCard size={16} strokeWidth={2.2} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                {kpis.disbursedApps || 0} Loans
              </span>
            </div>

            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Total Disbursed
            </p>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5 flex items-baseline">
              <span className="text-sm font-extrabold text-slate-400 mr-0.5 select-none">₹</span>
              {kpis.disbursedAmount}
            </h3>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-500 font-medium">
            <span className="text-blue-600 font-bold truncate">
              {kpis.disbursedApps || 0} Disbursed
            </span>
            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
              LOS &rarr;
            </span>
          </div>
        </div>

        {/* Card 2: EMI Recovered */}
        <div 
          onClick={() => setActiveTab('loans')}
          className="relative overflow-hidden bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

          <div>
            <div className="flex items-center justify-between gap-1.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                <DollarSign size={16} strokeWidth={2.4} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Eff: {emiTracking.collectionEfficiency || "0%"}
              </span>
            </div>

            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              EMI Recovered
            </p>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5 flex items-baseline">
              <span className="text-sm font-extrabold text-slate-400 mr-0.5 select-none">₹</span>
              {kpis.totalCollectedEMI}
            </h3>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-500 font-medium">
            <span className="text-emerald-600 font-bold truncate">
              Target: {emiTracking.monthlyTarget}
            </span>
            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
              EMI &rarr;
            </span>
          </div>
        </div>

        {/* Card 3: Loan Applications */}
        <div 
          onClick={() => setActiveTab('loans')}
          className="relative overflow-hidden bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-300 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500"></div>

          <div>
            <div className="flex items-center justify-between gap-1.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors duration-200">
                <FileText size={16} strokeWidth={2.2} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                {kpis.pendingApps || 0} Pending
              </span>
            </div>

            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Applications
            </p>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
              {kpis.totalApps}
            </h3>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-500 font-medium">
            <span className="text-purple-600 font-bold truncate">
              {kpis.approvedApps} Appr / {kpis.rejectedApps} Rej
            </span>
            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider group-hover:text-purple-600 transition-colors">
              LOS &rarr;
            </span>
          </div>
        </div>

        {/* Card 4: Total Leads */}
        <div 
          onClick={() => setActiveTab('leads')}
          className="relative overflow-hidden bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>

          <div>
            <div className="flex items-center justify-between gap-1.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
                <PhoneCall size={16} strokeWidth={2.2} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                {kpis.leadConversionRate || "0%"}
              </span>
            </div>

            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Total Leads
            </p>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
              {kpis.totalLeads}
            </h3>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-500 font-medium">
            <span className="text-amber-600 font-bold truncate">
              {kpis.convertedLeads} Converted
            </span>
            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider group-hover:text-amber-600 transition-colors">
              CRM &rarr;
            </span>
          </div>
        </div>

        {/* Card 5: Job Applicants */}
        <div 
          onClick={() => setActiveTab('recruitment')}
          className="relative overflow-hidden bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-sky-300 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-cyan-500"></div>

          <div>
            <div className="flex items-center justify-between gap-1.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors duration-200">
                <Briefcase size={16} strokeWidth={2.2} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                {kpis.activeJobs || 0} Open
              </span>
            </div>

            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Job Applicants
            </p>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
              {kpis.totalJobApps}
            </h3>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-500 font-medium">
            <span className="text-sky-600 font-bold truncate">
              ATS Pipeline
            </span>
            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider group-hover:text-sky-600 transition-colors">
              Jobs &rarr;
            </span>
          </div>
        </div>

        {/* Card 6: Total Staff */}
        <div 
          onClick={() => setActiveTab('roles')}
          className="relative overflow-hidden bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

          <div>
            <div className="flex items-center justify-between gap-1.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                <Users size={16} strokeWidth={2.2} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                {kpis.activeStaffToday || 0} Present
              </span>
            </div>

            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Workforce
            </p>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
              {kpis.employees}
            </h3>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-500 font-medium">
            <span className="text-indigo-600 font-bold truncate">
              All Active
            </span>
            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
              Staff &rarr;
            </span>
          </div>
        </div>

      </div>

      {/* ── 3. INTERACTIVE PILLAR SELECTOR TABS ───────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & Financials', icon: BarChart3, badge: null },
          { id: 'loans', label: 'Loan & EMI Lifecycle', icon: FileText, badge: kpis.totalApps },
          { id: 'leads', label: 'Leads & Telecalling', icon: PhoneCall, badge: kpis.totalLeads },
          { id: 'recruitment', label: 'Jobs & Recruitment', icon: Briefcase, badge: kpis.totalJobApps },
          { id: 'roles', label: 'All Roles Staff Tracking', icon: Users, badge: kpis.employees }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-blue-400' : 'text-slate-400'} />
              <span>{tab.label}</span>
              {tab.badge !== null && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── 4. TAB 1: OVERVIEW & FINANCIALS ──────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Financial Curve */}
            <Card className="xl:col-span-2 flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Capital Flow: Disbursed vs Recovered</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Tracking principal deployed versus monthly EMI recovery inflows</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                    Net Portfolio: {financialTracking.activePortfolio}
                  </span>
                </div>
              </div>
              <div className="flex-1 -mx-2">
                <HighchartsReact highcharts={Highcharts} options={financeChartOptions} />
              </div>
            </Card>

            {/* Application Pipeline Donut */}
            <Card className="xl:col-span-1 flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg font-black text-slate-900">Loan Status Distribution</h3>
                <p className="text-xs text-slate-400 font-medium">Breakdown across all lifecycle stages</p>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-[190px] h-[190px] relative">
                  <HighchartsReact highcharts={Highcharts} options={donutChartOptions} containerProps={{ style: { width: '100%', height: '100%' } }} />
                </div>
                <div className="grid grid-cols-2 gap-2.5 w-full mt-4">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-700">Disbursed</span>
                    <span className="text-xs font-black text-emerald-900">{kpis.disbursedApps}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                    <span className="text-xs font-bold text-blue-700">Approved</span>
                    <span className="text-xs font-black text-blue-900">{kpis.approvedApps}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
                    <span className="text-xs font-bold text-amber-700">Pending</span>
                    <span className="text-xs font-black text-amber-900">{kpis.pendingApps}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/70 border border-rose-100">
                    <span className="text-xs font-bold text-rose-700">Rejected</span>
                    <span className="text-xs font-black text-rose-900">{kpis.rejectedApps}</span>
                  </div>
                </div>
              </div>
            </Card>

          </div>

          {/* Bottom Grid: Live Activity Stream & Key Roles Quick Pulse */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Live Real-time Activity Stream */}
            <Card className="xl:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Activity size={18} className="text-blue-600" />
                    Live Multi-Department Work Stream
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Real-time actions taken across Loans, Leads & Recruitment</p>
                </div>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Live Audit Feed</span>
              </div>

              <div className="divide-y divide-slate-100">
                {recentActivities && recentActivities.length > 0 ? (
                  recentActivities.map((act, idx) => (
                    <div key={idx} className="py-3.5 flex items-start justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-xl transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-black ${
                          act.badge === 'Loan' ? 'bg-blue-50 text-blue-600' :
                          act.badge === 'Lead' ? 'bg-purple-50 text-purple-600' :
                          'bg-sky-50 text-sky-600'
                        }`}>
                          {act.badge === 'Loan' ? 'LN' : act.badge === 'Lead' ? 'LD' : 'HR'}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">{act.title}</h4>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{act.subtitle}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {act.timeFormatted}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">No recent activities recorded.</p>
                )}
              </div>
            </Card>

            {/* Department Quick Oversight */}
            <Card className="xl:col-span-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-1">Role Health & Staff Status</h3>
                <p className="text-xs text-slate-400 font-medium mb-5">Department active numbers today</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <PhoneCall size={16} className="text-purple-600" />
                      <span className="text-xs font-bold text-slate-700">Telecallers</span>
                    </div>
                    <span className="text-xs font-black text-slate-900">{roleProductivity.telecallers.count} Active</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-emerald-600" />
                      <span className="text-xs font-bold text-slate-700">Field Agents</span>
                    </div>
                    <span className="text-xs font-black text-slate-900">{roleProductivity.fieldAgents.count} On Field</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={16} className="text-blue-600" />
                      <span className="text-xs font-bold text-slate-700">Operations & Credit</span>
                    </div>
                    <span className="text-xs font-black text-slate-900">{roleProductivity.operations.count} Officers</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <CreditCard size={16} className="text-amber-600" />
                      <span className="text-xs font-bold text-slate-700">Accountant / Finance</span>
                    </div>
                    <span className="text-xs font-black text-slate-900">{roleProductivity.accountants.count} Active</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <Building2 size={16} className="text-rose-600" />
                      <span className="text-xs font-bold text-slate-700">HR Department</span>
                    </div>
                    <span className="text-xs font-black text-slate-900">{roleProductivity.distribution.HR || 0} Active</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setActiveTab('roles')}
                className="mt-4 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                View Full Department Logs <ArrowRight size={14} />
              </button>
            </Card>

          </div>
        </div>
      )}

      {/* ── 5. TAB 2: LOAN & EMI LIFECYCLE TRACKING ──────────────────── */}
      {activeTab === 'loans' && (
        <div className="space-y-6">
          {/* Stage Funnel Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <span className="text-[11px] font-bold text-amber-700 uppercase">Stage 1: Pending</span>
              <h4 className="text-2xl font-black text-amber-900 mt-1">{loanTracking.pendingCount}</h4>
              <p className="text-[11px] text-amber-600 mt-0.5">Awaiting Document Audit</p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <span className="text-[11px] font-bold text-blue-700 uppercase">Stage 2: Under Review</span>
              <h4 className="text-2xl font-black text-blue-900 mt-1">{loanTracking.pendingCount}</h4>
              <p className="text-[11px] text-blue-600 mt-0.5">Credit Officer CAM Review</p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
              <span className="text-[11px] font-bold text-purple-700 uppercase">Stage 3: Approved</span>
              <h4 className="text-2xl font-black text-purple-900 mt-1">{loanTracking.approvedCount}</h4>
              <p className="text-[11px] text-purple-600 mt-0.5">Sanction Letter Issued</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-[11px] font-bold text-emerald-700 uppercase">Stage 4: Disbursed</span>
              <h4 className="text-2xl font-black text-emerald-900 mt-1">{loanTracking.disbursedCount}</h4>
              <p className="text-[11px] text-emerald-600 mt-0.5">{loanTracking.totalDisbursedAmount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
              <span className="text-[11px] font-bold text-rose-700 uppercase">Stage 5: Rejected</span>
              <h4 className="text-2xl font-black text-rose-900 mt-1">{loanTracking.rejectedCount}</h4>
              <p className="text-[11px] text-rose-600 mt-0.5">Low CIBIL / Docs Missing</p>
            </div>
          </div>

          {/* EMI Delinquency & Recovery Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white border-none shadow-lg">
              <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Monthly Target vs Collected</span>
              <div className="flex items-baseline gap-2 mt-2">
                <h3 className="text-3xl font-black">{emiTracking.totalCollected}</h3>
                <span className="text-xs text-emerald-200">/ {emiTracking.monthlyTarget}</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full mt-4 overflow-hidden">
                <div className="bg-white h-full rounded-full" style={{ width: emiTracking.collectionEfficiency || '0%' }}></div>
              </div>
              <div className="flex justify-between items-center text-xs mt-2 font-semibold">
                <span>Collection Efficiency</span>
                <span className="font-black">{emiTracking.collectionEfficiency}</span>
              </div>
            </Card>

            <Card className="border-rose-100 bg-rose-50/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Overdue & Defaulted Accounts</span>
                <AlertCircle size={18} className="text-rose-600" />
              </div>
              <h3 className="text-3xl font-black text-rose-900">{emiTracking.overdueAmount}</h3>
              <p className="text-xs font-semibold text-rose-600 mt-1">{emiTracking.overdueCount} Accounts with Missed EMI</p>
              
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-rose-200/50">
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">1-30 DPD</span>
                  <span className="text-sm font-black text-amber-600">{emiTracking.aging.dpd30}</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">31-60 DPD</span>
                  <span className="text-sm font-black text-rose-500">{emiTracking.aging.dpd60}</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">90+ DPD (NPA)</span>
                  <span className="text-sm font-black text-rose-700">{emiTracking.aging.dpd90}</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-black text-slate-900">Loan Portfolio by Product</h4>
                <PieChart size={18} className="text-slate-400" />
              </div>
              <div className="space-y-2.5 mt-4">
                {topLoanTypes.map((type, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                    <span className="font-bold text-slate-700">{type.name}</span>
                    <span className="font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{type.count} Loans</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Loan Applications Oversight Table */}
          <Card noPadding={true}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Central Loan Applications Register</h3>
                <p className="text-xs text-slate-400 font-medium">Tracking all incoming applications from all channels</p>
              </div>
              <button 
                onClick={() => navigate('/loans')} 
                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
              >
                Go to Loan Portal <ArrowRight size={13} />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="py-3.5 px-6">App ID</th>
                    <th className="py-3.5 px-6">Applicant</th>
                    <th className="py-3.5 px-6">Loan Type</th>
                    <th className="py-3.5 px-6">Sanction / Requested</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {recentApplications && recentApplications.length > 0 ? (
                    recentApplications.map((app, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-bold text-blue-600">{app.id}</td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">{app.name}</div>
                          <div className="text-[11px] text-slate-400">{app.mobile}</div>
                        </td>
                        <td className="py-4 px-6 font-semibold">{app.type}</td>
                        <td className="py-4 px-6 font-black text-slate-900">{app.amount}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            app.status === 'Disbursed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            app.status === 'Approved' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            app.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                            'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-400">{app.date}</td>
                        <td className="py-4 px-6">
                          <button 
                            onClick={() => navigate('/loans')} 
                            className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Eye size={13} /> Audit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400 font-medium">
                        No loan applications found in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── 6. TAB 3: LEADS & TELECALLER PIPELINE ─────────────────────── */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          {/* Top Funnel */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <span className="text-[11px] font-bold text-indigo-700 uppercase">Total Inflow</span>
              <h4 className="text-2xl font-black text-indigo-900 mt-1">{leadsTracking.totalLeads}</h4>
              <p className="text-[11px] text-indigo-600 mt-0.5">All Acquisition Channels</p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <span className="text-[11px] font-bold text-blue-700 uppercase">Contacted</span>
              <h4 className="text-2xl font-black text-blue-900 mt-1">{leadsTracking.statusCounts.Contacted || 0}</h4>
              <p className="text-[11px] text-blue-600 mt-0.5">Telecaller Calling Stage</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <span className="text-[11px] font-bold text-amber-700 uppercase">Qualified</span>
              <h4 className="text-2xl font-black text-amber-900 mt-1">{leadsTracking.statusCounts.Qualified || 0}</h4>
              <p className="text-[11px] text-amber-600 mt-0.5">Eligible for Loan Application</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-[11px] font-bold text-emerald-700 uppercase">Converted</span>
              <h4 className="text-2xl font-black text-emerald-900 mt-1">{leadsTracking.statusCounts.Converted || 0}</h4>
              <p className="text-[11px] text-emerald-600 mt-0.5">Conversion Rate: {leadsTracking.conversionRate}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 uppercase">Lost / Dropped</span>
              <h4 className="text-2xl font-black text-slate-900 mt-1">{leadsTracking.statusCounts.Lost || 0}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Not Interested / Low CIBIL</p>
            </div>
          </div>

          {/* Leads Channel Breakdown & Calling Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h4 className="text-sm font-black text-slate-900 mb-3">Lead Sources Breakdown</h4>
              <div className="space-y-2.5">
                {Object.entries(leadsTracking.sourceCounts).map(([src, count], idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50">
                    <span className="font-bold text-slate-700">{src}</span>
                    <span className="font-black text-slate-900 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">{count} Leads</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-sm font-black text-slate-900">Telecaller Work & Assignment Monitor</h4>
                  <p className="text-xs text-slate-400 font-medium">Monitoring call velocity and conversion efficiency</p>
                </div>
                <button onClick={() => navigate('/telecaller')} className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors">
                  Open Telecaller Desk
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-center">
                  <span className="text-[11px] text-purple-700 font-bold block">Assigned Leads</span>
                  <span className="text-xl font-black text-purple-900">{roleProductivity.telecallers.totalAssignedLeads}</span>
                </div>
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
                  <span className="text-[11px] text-emerald-700 font-bold block">Converted to Loans</span>
                  <span className="text-xl font-black text-emerald-900">{roleProductivity.telecallers.converted}</span>
                </div>
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-center">
                  <span className="text-[11px] text-blue-700 font-bold block">Calling Activity Rate</span>
                  <span className="text-xl font-black text-blue-900">{roleProductivity.telecallers.callingRate}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Leads Table */}
          <Card noPadding={true}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-slate-900">All Live Customer Leads</h3>
                <p className="text-xs text-slate-400 font-medium">Tracking telecaller follow-ups and applicant remarks</p>
              </div>
              <button onClick={() => navigate('/leads')} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">
                Manage All Leads <ArrowRight size={13} className="inline ml-1" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="py-3.5 px-6">Lead ID</th>
                    <th className="py-3.5 px-6">Customer</th>
                    <th className="py-3.5 px-6">Loan Purpose</th>
                    <th className="py-3.5 px-6">Requested</th>
                    <th className="py-3.5 px-6">Source</th>
                    <th className="py-3.5 px-6">Assigned To</th>
                    <th className="py-3.5 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {leadsTracking.recentLeads && leadsTracking.recentLeads.length > 0 ? (
                    leadsTracking.recentLeads.map((ld, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-bold text-indigo-600">{ld.id}</td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">{ld.name}</div>
                          <div className="text-[11px] text-slate-400">{ld.mobile}</div>
                        </td>
                        <td className="py-4 px-6 font-semibold">{ld.purpose}</td>
                        <td className="py-4 px-6 font-black text-slate-900">{ld.expectedAmount}</td>
                        <td className="py-4 px-6">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-bold">{ld.source}</span>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-800">{ld.assignedTo}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            ld.status === 'Converted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            ld.status === 'Qualified' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            ld.status === 'Contacted' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                            'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {ld.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400 font-medium">
                        No leads recorded in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── 7. TAB 4: JOBS & CAREER RECRUITMENT ───────────────────────── */}
      {activeTab === 'recruitment' && (
        <div className="space-y-6">
          {/* Recruitment Funnel */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
              <span className="text-[11px] font-bold text-sky-700 uppercase">1. Applied</span>
              <h4 className="text-2xl font-black text-sky-900 mt-1">{recruitmentTracking.statusCounts.Applied || 0}</h4>
              <p className="text-[11px] text-sky-600 mt-0.5">New Resumes</p>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <span className="text-[11px] font-bold text-indigo-700 uppercase">2. Reviewed</span>
              <h4 className="text-2xl font-black text-indigo-900 mt-1">{recruitmentTracking.statusCounts.Reviewed || 0}</h4>
              <p className="text-[11px] text-indigo-600 mt-0.5">Screened by HR</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <span className="text-[11px] font-bold text-amber-700 uppercase">3. Interview</span>
              <h4 className="text-2xl font-black text-amber-900 mt-1">{recruitmentTracking.statusCounts.Interview || 0}</h4>
              <p className="text-[11px] text-amber-600 mt-0.5">In Round 1 / 2</p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
              <span className="text-[11px] font-bold text-purple-700 uppercase">4. Shortlisted</span>
              <h4 className="text-2xl font-black text-purple-900 mt-1">{recruitmentTracking.statusCounts.Shortlisted || 0}</h4>
              <p className="text-[11px] text-purple-600 mt-0.5">Final Offer Stage</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-[11px] font-bold text-emerald-700 uppercase">5. Hired</span>
              <h4 className="text-2xl font-black text-emerald-900 mt-1">{recruitmentTracking.statusCounts.Hired || 0}</h4>
              <p className="text-[11px] text-emerald-600 mt-0.5">Joined Team</p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
              <span className="text-[11px] font-bold text-rose-700 uppercase">6. Rejected</span>
              <h4 className="text-2xl font-black text-rose-900 mt-1">{recruitmentTracking.statusCounts.Rejected || 0}</h4>
              <p className="text-[11px] text-rose-600 mt-0.5">Archived</p>
            </div>
          </div>

          {/* Job Openings & Candidate Table */}
          <Card noPadding={true}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Applicant Tracking System (ATS Register)</h3>
                <p className="text-xs text-slate-400 font-medium">Tracking all external candidates applying for company vacancies</p>
              </div>
              <button onClick={() => navigate('/hr/recruitment')} className="text-xs font-bold text-sky-600 bg-sky-50 px-4 py-2 rounded-xl flex items-center gap-1.5">
                Manage Job Vacancies & Candidates <ArrowRight size={13} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="py-3.5 px-6">Candidate</th>
                    <th className="py-3.5 px-6">Role Applied</th>
                    <th className="py-3.5 px-6">Department</th>
                    <th className="py-3.5 px-6">Channel</th>
                    <th className="py-3.5 px-6">Expected CTC</th>
                    <th className="py-3.5 px-6">Stage</th>
                    <th className="py-3.5 px-6">Applied Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {recruitmentTracking.recentApplicants && recruitmentTracking.recentApplicants.length > 0 ? (
                    recruitmentTracking.recentApplicants.map((app, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">{app.name}</div>
                          <div className="text-[11px] text-slate-400">{app.email} • {app.phone}</div>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-800">{app.jobTitle}</td>
                        <td className="py-4 px-6 text-slate-500">{app.department}</td>
                        <td className="py-4 px-6">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-bold">{app.source}</span>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-800">{app.expectedSalary}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            app.status === 'Hired' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            app.status === 'Interview' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            app.status === 'Shortlisted' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                            app.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                            'bg-sky-50 text-sky-600 border border-sky-100'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-400">{app.appliedAt}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400 font-medium">
                        No job applications received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── 8. TAB 5: ALL ROLES STAFF PRODUCTIVITY ───────────────────── */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {/* Telecalling Desk */}
            <Card className="border-purple-100 hover:border-purple-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <PhoneCall size={18} />
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                  {roleProductivity.telecallers.count} Telecallers
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900 mb-1">Telecalling Department</h4>
              <p className="text-xs text-slate-400 font-medium mb-4">Outbound Lead Nurturing & Calling</p>
              
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Assigned Leads:</span>
                  <span className="font-bold text-slate-800">{roleProductivity.telecallers.totalAssignedLeads}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Conversions:</span>
                  <span className="font-black text-emerald-600">{roleProductivity.telecallers.converted} Loans</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Call Connect Rate:</span>
                  <span className="font-bold text-purple-600">{roleProductivity.telecallers.callingRate}</span>
                </div>
              </div>
            </Card>

            {/* Field Recovery Desk */}
            <Card className="border-emerald-100 hover:border-emerald-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <MapPin size={18} />
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {roleProductivity.fieldAgents.count} Field Agents
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900 mb-1">Field Recovery & Verification</h4>
              <p className="text-xs text-slate-400 font-medium mb-4">Physical Visits & Cash Collections</p>
              
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Visits Logged Today:</span>
                  <span className="font-bold text-slate-800">{roleProductivity.fieldAgents.visitsCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Cash Collected:</span>
                  <span className="font-black text-emerald-600">{roleProductivity.fieldAgents.fieldCollected}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Pending Verifications:</span>
                  <span className="font-bold text-amber-600">{roleProductivity.fieldAgents.pendingVerification}</span>
                </div>
              </div>
            </Card>

            {/* Operations & Underwriting Desk */}
            <Card className="border-blue-100 hover:border-blue-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                  {roleProductivity.operations.count} Officers
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900 mb-1">Operations & Underwriting</h4>
              <p className="text-xs text-slate-400 font-medium mb-4">CIBIL, KYC & Sanction Approvals</p>
              
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Files In Review:</span>
                  <span className="font-bold text-amber-600">{roleProductivity.operations.pendingFiles} Files</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Average TAT:</span>
                  <span className="font-black text-blue-600">{roleProductivity.operations.avgTAT}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Approval Speed:</span>
                  <span className="font-bold text-emerald-600">Standard</span>
                </div>
              </div>
            </Card>

            {/* Accounts & Finance Desk */}
            <Card className="border-amber-100 hover:border-amber-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <CreditCard size={18} />
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                  {roleProductivity.accountants.count} Accountants
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900 mb-1">Accounts & Reconciliation</h4>
              <p className="text-xs text-slate-400 font-medium mb-4">Disbursements & Ledger Entries</p>
              
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Vouchers Passed:</span>
                  <span className="font-bold text-slate-800">{roleProductivity.accountants.vouchersPassed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Cashbook Status:</span>
                  <span className="font-black text-emerald-600">{roleProductivity.accountants.reconciledStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Audit Compliance:</span>
                  <span className="font-bold text-amber-600">100% Verified</span>
                </div>
              </div>
            </Card>

          </div>

          {/* HR & Workforce Summary Card */}
          <Card>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Workforce Presence & Department Roster</h3>
                <p className="text-xs text-slate-400 font-medium">Daily staff check-ins and active department heads</p>
              </div>
              <button onClick={() => navigate('/employees')} className="text-xs font-bold text-blue-600 bg-blue-50 px-3.5 py-2 rounded-xl">
                Manage Staff Roster <ArrowRight size={13} className="inline ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 text-center">
                <span className="text-xs text-slate-500 font-bold block">Total Staff</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{roleProductivity.totalStaff}</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 text-center">
                <span className="text-xs text-emerald-700 font-bold block">Present Today</span>
                <span className="text-2xl font-black text-emerald-900 mt-1 block">{roleProductivity.presentToday}</span>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 text-center">
                <span className="text-xs text-amber-700 font-bold block">On Leave</span>
                <span className="text-2xl font-black text-amber-900 mt-1 block">{roleProductivity.onLeave}</span>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 text-center">
                <span className="text-xs text-purple-700 font-bold block">Active Roles</span>
                <span className="text-2xl font-black text-purple-900 mt-1 block">5 Depts</span>
              </div>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
