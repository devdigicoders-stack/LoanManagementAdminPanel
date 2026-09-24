import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
 TrendingUp,
 Award,
 Clock,
 Briefcase,
 Users,
 CheckCircle,
 AlertTriangle,
 Plus,
 RefreshCw,
 Building,
 Target,
 FileSpreadsheet,
 PieChart as PieChartIcon,
 BarChart3,
 LineChart as LineChartIcon,
 Layers,
 DollarSign
} from 'lucide-react';
import {
 AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
 CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const ZONE_COLORS = {
 NORTH: '#2563eb',
 SOUTH: '#059669',
 EAST: '#d97706',
 WEST: '#7c3aed',
 CENTRAL: '#db2777'
};

const CustomTooltip = ({ active, payload, label }) => {
 if (active && payload && payload.length) {
 return (
 <div className="bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded-xl shadow-xl text-xs space-y-1">
 <p className="font-bold text-slate-600 border-b border-slate-100 pb-1">{label}</p>
 {payload.map((entry, index) => (
 <div key={index} className="flex items-center justify-between gap-4">
 <span style={{ color: entry.color }} className="flex items-center gap-1.5 font-medium">
 <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }}></span>
 {entry.name}:
 </span>
 <span className="font-bold text-slate-800">{entry.value.toLocaleString()}</span>
 </div>
 ))}
 </div>
 );
 }
 return null;
};

const renderPieLabel = ({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`;

const SalesDashboard = () => {
 const [selectedZone, setSelectedZone] = useState('ALL');
 const [metrics, setMetrics] = useState({
 totalLeads: 0,
 activeLeads: 0,
 disbursedLeads: 0,
 disbursedAmount: 0,
 holdLeads: 0,
 approvalPendingCount: 0,
 targetAmount: 50000000,
 targetAchievementPercent: 0,
 zones: {}
 });

 const [charts, setCharts] = useState({
 monthlyTrend: [],
 productData: [],
 stageFunnel: [],
 zoneComparison: [],
 amountDist: []
 });

 const [loading, setLoading] = useState(true);
 const [chartsLoading, setChartsLoading] = useState(true);
 const [requisitions, setRequisitions] = useState([]);
 const [isHiringModalOpen, setIsHiringModalOpen] = useState(false);

 const [newHiring, setNewHiring] = useState({
 zone: 'NORTH',
 role: 'RO',
 requiredCount: 1,
 priority: 'Medium',
 notes: ''
 });

 const fetchData = useCallback(async () => {
 setLoading(true);
 setChartsLoading(true);
 try {
 const zoneParam = selectedZone !== 'ALL' ? `?zone=${selectedZone}` : '';
 const token = localStorage.getItem('token');
 const authHeader = { headers: { Authorization: `Bearer ${token}` } };
 
 const [metricsRes, chartsRes, reqsRes] = await Promise.all([
 axios.get(`${API_BASE}/sales/dashboard-metrics${zoneParam}`, authHeader),
 axios.get(`${API_BASE}/sales/chart-analytics${zoneParam}`, authHeader),
 axios.get(`${API_BASE}/sales/hiring-requisitions${zoneParam}`, authHeader)
 ]);

 if (metricsRes.data?.success) {
 setMetrics(metricsRes.data.metrics);
 }
 if (chartsRes.data?.success) {
 setCharts(chartsRes.data.charts);
 }
 if (reqsRes.data?.success) {
 setRequisitions(reqsRes.data.requisitions || []);
 }
 } catch (err) {
 console.error('Error loading dashboard data:', err);
 } finally {
 setLoading(false);
 setChartsLoading(false);
 }
 }, [selectedZone]);

 useEffect(() => {
 fetchData();
 }, [fetchData]);

 const handleCreateHiringRequest = async (e) => {
 e.preventDefault();
 try {
 const token = localStorage.getItem('token');
 const authHeader = { headers: { Authorization: `Bearer ${token}` } };
 const res = await axios.post(`${API_BASE}/sales/hiring-requisitions`, newHiring, authHeader);
 if (res.data.success) {
 setIsHiringModalOpen(false);
 setNewHiring({ zone: 'NORTH', role: 'RO', requiredCount: 1, priority: 'Medium', notes: '' });
 fetchData();
 }
 } catch (err) {
 console.error('Error creating hiring request:', err);
 }
 };

 const formatCurrency = (val) => {
 if (!val) return '₹0';
 if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
 if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
 return `₹${val.toLocaleString()}`;
 };

 return (
 <div className="p-6 space-y-6 bg-slate-50 min-h-screen text-slate-800">
 {/* Header Bar */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
 <div>
 <div className="flex items-center gap-2 mb-1">
 <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
 <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
 Area Reporting Manager (ARM)
 </span>
 </div>
 <h1 className="text-2xl font-black text-slate-900 tracking-tight">
 Area Command & Team Supervision Hub
 </h1>
 <p className="text-xs text-slate-500 mt-0.5">
 Supervise hired Reporting Managers (RMs), Relationship Officers/Executives (RO/RE), and Telecallers
 </p>
 </div>

 <div className="flex flex-wrap items-center gap-3">
 {/* Zone Selector */}
 <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
 <Building className="w-4 h-4 text-blue-600" />
 <select
 value={selectedZone}
 onChange={(e) => setSelectedZone(e.target.value)}
 className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
 >
 <option value="ALL">All Zones Overview</option>
 <option value="NORTH">North Zone</option>
 <option value="SOUTH">South Zone</option>
 <option value="EAST">East Zone</option>
 <option value="WEST">West Zone</option>
 <option value="CENTRAL">Central Zone</option>
 </select>
 </div>

 <button
 onClick={fetchData}
 className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl transition border border-slate-200 shadow-sm"
 title="Refresh Data"
 >
 <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
 </button>

 <button
 onClick={() => setIsHiringModalOpen(true)}
 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-blue-500/20"
 >
 <Plus className="w-4 h-4" />
 Raise Team Req
 </button>
 </div>
 </div>

 {/* KPI Cards Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
 {/* Total Pipeline */}
 <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
 <div className="flex items-center justify-between text-slate-500 mb-2">
 <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Pipeline</span>
 <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
 <FileSpreadsheet className="w-4 h-4" />
 </div>
 </div>
 <div className="text-2xl font-black text-slate-900">{metrics.totalLeads}</div>
 <p className="text-[11px] text-slate-500 mt-1">
 <span className="text-blue-600 font-bold">{metrics.activeLeads}</span> active in workflow
 </p>
 </div>

 {/* Approval Pending */}
 <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
 <div className="flex items-center justify-between text-slate-500 mb-2">
 <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Desk Pending</span>
 <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
 <Clock className="w-4 h-4" />
 </div>
 </div>
 <div className="text-2xl font-black text-amber-600">{metrics.approvalPendingCount}</div>
 <p className="text-[11px] text-slate-500 mt-1">Awaiting Sales Head review</p>
 </div>

 {/* Customer Hold */}
 <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
 <div className="flex items-center justify-between text-slate-500 mb-2">
 <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Hold Cases</span>
 <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
 <AlertTriangle className="w-4 h-4" />
 </div>
 </div>
 <div className="text-2xl font-black text-rose-600">{metrics.holdLeads}</div>
 <p className="text-[11px] text-slate-500 mt-1">Needs RM/ARM follow-up</p>
 </div>

 {/* Disbursed Files */}
 <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
 <div className="flex items-center justify-between text-slate-500 mb-2">
 <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Disbursed</span>
 <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
 <CheckCircle className="w-4 h-4" />
 </div>
 </div>
 <div className="text-2xl font-black text-emerald-600">{metrics.disbursedLeads}</div>
 <p className="text-[11px] text-slate-500 mt-1">Completed files</p>
 </div>

 {/* Disbursed Volume */}
 <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
 <div className="flex items-center justify-between text-slate-500 mb-2">
 <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Disbursed Volume</span>
 <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
 <DollarSign className="w-4 h-4" />
 </div>
 </div>
 <div className="text-xl font-black text-purple-700">{formatCurrency(metrics.disbursedAmount)}</div>
 <p className="text-[11px] text-slate-500 mt-1">Total portfolio value</p>
 </div>

 {/* Target Achievement */}
 <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
 <div className="flex items-center justify-between text-slate-500 mb-2">
 <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Target Achieved</span>
 <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
 <Target className="w-4 h-4" />
 </div>
 </div>
 <div className="text-2xl font-black text-indigo-600">{metrics.targetAchievementPercent}%</div>
 <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
 <div
 className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
 style={{ width: `${Math.min(metrics.targetAchievementPercent, 100)}%` }}
 ></div>
 </div>
 </div>
 </div>

 {/* Row 1: Charts - Monthly Trend & Product Mix */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Monthly Lead & Disbursal Trend (Area Chart) */}
 <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
 <div className="flex items-center justify-between mb-4">
 <div>
 <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
 <LineChartIcon className="w-5 h-5 text-blue-600" />
 Monthly Lead & Disbursal Trend
 </h2>
 <p className="text-xs text-slate-500">Pipeline generation vs disbursals over the last 6 months</p>
 </div>
 <span className="text-[11px] bg-blue-50 text-blue-700 font-bold border border-blue-200 px-3 py-1 rounded-full">
 Live DB Data
 </span>
 </div>

 <div className="h-72 w-full">
 {chartsLoading ? (
 <div className="h-full flex items-center justify-center text-slate-400 text-xs">Loading chart data...</div>
 ) : charts.monthlyTrend.length === 0 ? (
 <div className="h-full flex items-center justify-center text-slate-400 text-xs">No monthly data available</div>
 ) : (
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={charts.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
 <defs>
 <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
 <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
 </linearGradient>
 <linearGradient id="colorDisbursed" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
 <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
 </linearGradient>
 <linearGradient id="colorHold" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
 <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
 <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
 <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} tickLine={false} />
 <Tooltip content={<CustomTooltip />} />
 <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
 <Area type="monotone" dataKey="Leads" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTotal)" />
 <Area type="monotone" dataKey="Disbursed" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDisbursed)" />
 <Area type="monotone" dataKey="Hold" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHold)" />
 </AreaChart>
 </ResponsiveContainer>
 )}
 </div>
 </div>

 {/* Product Mix Share (Donut Chart) */}
 <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
 <div className="flex items-center justify-between mb-2">
 <div>
 <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
 <PieChartIcon className="w-5 h-5 text-indigo-600" />
 Product Portfolio Mix
 </h2>
 <p className="text-xs text-slate-500">Distribution by loan type</p>
 </div>
 </div>

 <div className="h-72 w-full flex items-center justify-center">
 {chartsLoading ? (
 <div className="text-slate-400 text-xs">Loading product mix...</div>
 ) : charts.productData.length === 0 ? (
 <div className="text-slate-400 text-xs">No product distribution data</div>
 ) : (
 <ResponsiveContainer width="100%" height="100%">
 <PieChart>
 <Pie
 data={charts.productData}
 cx="50%"
 cy="45%"
 innerRadius={55}
 outerRadius={85}
 paddingAngle={4}
 dataKey="value"
 label={renderPieLabel}
 labelLine={false}
 >
 {charts.productData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
 ))}
 </Pie>
 <Tooltip content={<CustomTooltip />} />
 <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />
 </PieChart>
 </ResponsiveContainer>
 )}
 </div>
 </div>
 </div>

 {/* Row 2: Charts - Workflow Stage Funnel & Regional Performance */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Workflow Stage Funnel (Horizontal Bar Chart) */}
 <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
 <div className="flex items-center justify-between mb-4">
 <div>
 <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
 <Layers className="w-5 h-5 text-purple-600" />
 Workflow Lifecycle Funnel
 </h2>
 <p className="text-xs text-slate-500">Active leads count across each workflow step</p>
 </div>
 </div>

 <div className="h-72 w-full">
 {chartsLoading ? (
 <div className="h-full flex items-center justify-center text-slate-400 text-xs">Loading stage funnel...</div>
 ) : charts.stageFunnel.length === 0 ? (
 <div className="h-full flex items-center justify-center text-slate-400 text-xs">No funnel data available</div>
 ) : (
 <ResponsiveContainer width="100%" height="100%">
 <BarChart
 layout="vertical"
 data={charts.stageFunnel}
 margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
 >
 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
 <XAxis type="number" stroke="#64748b" fontSize={11} allowDecimals={false} tickLine={false} />
 <YAxis type="category" dataKey="stage" stroke="#64748b" fontSize={11} width={120} tickLine={false} />
 <Tooltip content={<CustomTooltip />} />
 <Bar dataKey="count" name="Leads" fill="#8b5cf6" radius={[0, 6, 6, 0]}>
 {charts.stageFunnel.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
 ))}
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 )}
 </div>
 </div>

 {/* Zone Breakdown (Grouped Bar Chart) */}
 <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
 <div className="flex items-center justify-between mb-4">
 <div>
 <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
 <BarChart3 className="w-5 h-5 text-emerald-600" />
 Regional Zonal Comparison
 </h2>
 <p className="text-xs text-slate-500">Lead metrics comparison across North, South, East, West, Central</p>
 </div>
 </div>

 <div className="h-72 w-full">
 {chartsLoading ? (
 <div className="h-full flex items-center justify-center text-slate-400 text-xs">Loading zone data...</div>
 ) : charts.zoneComparison.length === 0 ? (
 <div className="h-full flex items-center justify-center text-slate-400 text-xs">No zonal data available</div>
 ) : (
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={charts.zoneComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
 <XAxis dataKey="zone" stroke="#64748b" fontSize={11} tickLine={false} />
 <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} tickLine={false} />
 <Tooltip content={<CustomTooltip />} />
 <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
 <Bar dataKey="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
 <Bar dataKey="Disbursed" fill="#10b981" radius={[4, 4, 0, 0]} />
 <Bar dataKey="Approved" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
 <Bar dataKey="Hold" fill="#ef4444" radius={[4, 4, 0, 0]} />
 </BarChart>
 </ResponsiveContainer>
 )}
 </div>
 </div>
 </div>

 {/* Row 3: Ticket Size Distribution Chart */}
 <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
 <div className="flex items-center justify-between mb-4">
 <div>
 <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
 <TrendingUp className="w-5 h-5 text-amber-600" />
 Loan Ticket Size Distribution
 </h2>
 <p className="text-xs text-slate-500">Leads categorized by expected loan amount ranges</p>
 </div>
 </div>

 <div className="h-64 w-full">
 {chartsLoading ? (
 <div className="h-full flex items-center justify-center text-slate-400 text-xs">Loading amount distribution...</div>
 ) : charts.amountDist.length === 0 ? (
 <div className="h-full flex items-center justify-center text-slate-400 text-xs">No amount data available</div>
 ) : (
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={charts.amountDist} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
 <defs>
 <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
 <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.8} />
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
 <XAxis dataKey="range" stroke="#64748b" fontSize={11} tickLine={false} />
 <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} tickLine={false} />
 <Tooltip content={<CustomTooltip />} />
 <Bar dataKey="count" name="Number of Leads" fill="url(#amberGradient)" radius={[6, 6, 0, 0]} />
 </BarChart>
 </ResponsiveContainer>
 )}
 </div>
 </div>

 {/* Zonal Performance Cards Grid */}
 <div className="space-y-3">
 <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
 <Award className="w-5 h-5 text-blue-600" />
 Zonal Performance Overview
 </h2>

 <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
 {['NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL'].map((z) => {
 const zData = metrics.zones?.[z] || { totalLeads: 0, activeLeads: 0, disbursedLeads: 0, holdLeads: 0, disbursedAmount: 0 };
 const isSelected = selectedZone === z;

 return (
 <div
 key={z}
 onClick={() => setSelectedZone(isSelected ? 'ALL' : z)}
 className={`p-4 rounded-2xl border transition cursor-pointer ${
 isSelected
 ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-400/20'
 : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
 }`}
 >
 <div className="flex items-center justify-between mb-2">
 <span className="font-bold text-xs tracking-wider text-slate-700">{z} ZONE</span>
 <span
 className="w-2.5 h-2.5 rounded-full"
 style={{ backgroundColor: ZONE_COLORS[z] || '#2563eb' }}
 ></span>
 </div>

 <div className="space-y-1 text-xs">
 <div className="flex justify-between text-slate-500">
 <span>Total Pipeline:</span>
 <span className="font-bold text-slate-800">{zData.totalLeads}</span>
 </div>
 <div className="flex justify-between text-slate-500">
 <span>Active Leads:</span>
 <span className="font-bold text-blue-600">{zData.activeLeads}</span>
 </div>
 <div className="flex justify-between text-slate-500">
 <span>Disbursed:</span>
 <span className="font-bold text-emerald-600">{zData.disbursedLeads}</span>
 </div>
 <div className="flex justify-between text-slate-500">
 <span>On Hold:</span>
 <span className="font-bold text-rose-600">{zData.holdLeads}</span>
 </div>
 </div>

 <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[11px]">
 <span className="text-slate-400 font-medium">Volume</span>
 <span className="font-black text-slate-700">{formatCurrency(zData.disbursedAmount)}</span>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Hiring Requisitions Tracker */}
 <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
 <Users className="w-5 h-5 text-indigo-600" />
 Zonal Hiring & Team Expansion Demands
 </h2>
 <p className="text-xs text-slate-500">Requisitions raised to HR for ARM, RM, RE, RO & Telecallers</p>
 </div>
 <button
 onClick={() => setIsHiringModalOpen(true)}
 className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 font-bold border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl transition"
 >
 <Plus className="w-3.5 h-3.5" /> Raise Demand
 </button>
 </div>

 {requisitions.length === 0 ? (
 <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl border border-slate-100">
 No active hiring requisitions found. Click &quot;Raise Demand&quot; to request team members from HR.
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-xs text-left text-slate-700 whitespace-nowrap">
 <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
 <tr className="whitespace-nowrap">
 <th className="p-3 whitespace-nowrap">Zone</th>
 <th className="p-3 whitespace-nowrap">Role Requested</th>
 <th className="p-3 whitespace-nowrap">Required</th>
 <th className="p-3 whitespace-nowrap">Hired</th>
 <th className="p-3 whitespace-nowrap">Priority</th>
 <th className="p-3 whitespace-nowrap">Status</th>
 <th className="p-3 whitespace-nowrap">Notes</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {requisitions.map((req) => (
 <tr key={req._id} className="hover:bg-slate-50 transition whitespace-nowrap">
 <td className="p-3 font-bold text-slate-800 whitespace-nowrap">{req.zone}</td>
 <td className="p-3 text-blue-600 font-bold whitespace-nowrap">{req.role}</td>
 <td className="p-3 font-bold text-slate-900 whitespace-nowrap">{req.requiredCount}</td>
 <td className="p-3 font-bold text-emerald-600 whitespace-nowrap">{req.hiredCount}</td>
 <td className="p-3 whitespace-nowrap">
 <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
 req.priority === 'Urgent' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
 req.priority === 'High' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
 'bg-slate-100 text-slate-700 border border-slate-200'
 }`}>
 {req.priority}
 </span>
 </td>
 <td className="p-3 whitespace-nowrap">
 <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap ${
 req.status === 'Fulfilled' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
 req.status === 'In-Process' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
 'bg-slate-100 text-slate-600 border border-slate-200'
 }`}>
 {req.status}
 </span>
 </td>
 <td className="p-3 text-slate-500 max-w-xs truncate whitespace-nowrap" title={req.notes}>{req.notes || '-'}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>

 {/* Hiring Request Modal */}
 {isHiringModalOpen && (
 <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
 <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
 <div className="flex items-center justify-between border-b border-slate-100 pb-3">
 <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
 <Briefcase className="w-5 h-5 text-blue-600" />
 Raise Hiring Demand to HR
 </h3>
 <button
 onClick={() => setIsHiringModalOpen(false)}
 className="text-slate-400 hover:text-slate-600 text-lg font-bold"
 >
 
 </button>
 </div>

 <form onSubmit={handleCreateHiringRequest} className="space-y-4 text-xs">
 <div>
 <label className="block font-bold text-slate-700 mb-1">Target Zone</label>
 <select
 value={newHiring.zone}
 onChange={(e) => setNewHiring({ ...newHiring, zone: e.target.value })}
 className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
 >
 <option value="NORTH">NORTH ZONE</option>
 <option value="SOUTH">SOUTH ZONE</option>
 <option value="EAST">EAST ZONE</option>
 <option value="WEST">WEST ZONE</option>
 <option value="CENTRAL">CENTRAL ZONE</option>
 </select>
 </div>

 <div>
 <label className="block font-bold text-slate-700 mb-1">Role Needed</label>
 <select
 value={newHiring.role}
 onChange={(e) => setNewHiring({ ...newHiring, role: e.target.value })}
 className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
 >
 <option value="ARM">Area Reporting Manager (ARM)</option>
 <option value="RM">Reporting Manager (RM)</option>
 <option value="RE">Relationship Executive (RE)</option>
 <option value="RO">Relationship Officer (RO)</option>
 <option value="Telecaller">Telecaller</option>
 </select>
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block font-bold text-slate-700 mb-1">Headcount Needed</label>
 <input
 type="number"
 min="1"
 value={newHiring.requiredCount}
 onChange={(e) => setNewHiring({ ...newHiring, requiredCount: parseInt(e.target.value) || 1 })}
 className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
 />
 </div>

 <div>
 <label className="block font-bold text-slate-700 mb-1">Priority</label>
 <select
 value={newHiring.priority}
 onChange={(e) => setNewHiring({ ...newHiring, priority: e.target.value })}
 className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
 >
 <option value="Low">Low</option>
 <option value="Medium">Medium</option>
 <option value="High">High</option>
 <option value="Urgent">Urgent</option>
 </select>
 </div>
 </div>

 <div>
 <label className="block font-bold text-slate-700 mb-1">Requirement Details / Notes</label>
 <textarea
 rows="3"
 value={newHiring.notes}
 onChange={(e) => setNewHiring({ ...newHiring, notes: e.target.value })}
 placeholder="Specify location, skill set, or branch assignment..."
 className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
 ></textarea>
 </div>

 <div className="flex items-center justify-end gap-3 pt-2">
 <button
 type="button"
 onClick={() => setIsHiringModalOpen(false)}
 className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition"
 >
 Cancel
 </button>
 <button
 type="submit"
 className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md shadow-blue-500/20"
 >
 Submit Demand
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
};

export default SalesDashboard;
