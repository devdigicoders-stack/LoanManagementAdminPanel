import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldCheck, CheckSquare, Building2, ArrowRight, RefreshCw, 
  Send, CheckCircle2, TrendingUp, AlertTriangle, PieChart as PieIcon, 
  BarChart3, Layers, Filter, IndianRupee, MapPin
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

const PIE_COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#f43f5e'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-xl shadow-xl text-xs space-y-1">
        <p className="font-bold text-slate-700 border-b border-slate-100 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <span style={{ color: entry.color }} className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }}></span>
              {entry.name}:
            </span>
            <span className="font-bold text-slate-900">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function OperationDashboard() {
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 4 Core Operations Metrics
  const [stats, setStats] = useState({
    pendingVerification: 0,
    dispatchedToBanks: 0,
    sanctionedOffers: 0,
    disbursedLoans: 0,
    rejectedFiles: 0,
    holdAlerts: 0,
    disbursedVolume: 0
  });

  // Dynamic Chart Data
  const [charts, setCharts] = useState({
    monthlyTrend: [],
    pipelineDistribution: [],
    lenderDistribution: [],
    zoneComparison: []
  });

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchDashboardData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const zoneParam = selectedZone !== 'ALL' ? `?zone=${selectedZone}` : '';
      const res = await axios.get(`${API_BASE}/dashboard/ops-overview${zoneParam}`, getHeaders());

      if (res.data?.success) {
        setStats(res.data.stats || {
          pendingVerification: 0,
          dispatchedToBanks: 0,
          sanctionedOffers: 0,
          disbursedLoans: 0,
          rejectedFiles: 0,
          holdAlerts: 0,
          disbursedVolume: 0
        });
        setCharts(res.data.charts || {
          monthlyTrend: [],
          pipelineDistribution: [],
          lenderDistribution: [],
          zoneComparison: []
        });
      }
    } catch (err) {
      console.error('Failed to load ops dashboard:', err);
    } finally {
      setLoading(false);
      if (isManual) {
        setRefreshing(false);
        toast.success(`Data refreshed for ${selectedZone === 'ALL' ? 'All Zones' : `${selectedZone} Zone`}`);
      }
    }
  }, [selectedZone]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto min-h-screen bg-slate-50 space-y-6">
      
      {/* ── TOP HEADER WITH LIVE ZONE FILTER ── */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">HAUS NUO-PAY OPERATIONS CENTER</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Operations & Bank Forwarding Overview
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Live KYC verification queue, partner bank forwarding status, and zonal file movement.
          </p>
        </div>

        {/* Action Buttons & Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-xs transition"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin text-blue-600' : 'text-slate-400'} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
            {['ALL', 'NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL'].map(z => (
              <button
                key={z}
                onClick={() => setSelectedZone(z)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  selectedZone === z
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {z === 'ALL' ? 'All Zones' : `${z} Zone`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4 CORE OPERATIONS STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-amber-300 transition">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold text-slate-500 uppercase">Pending Verification</span>
            <div className="p-2 bg-amber-50 rounded-xl"><ShieldCheck size={18} /></div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {loading ? '...' : stats.pendingVerification}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Ready for KYC & document verification ({selectedZone === 'ALL' ? 'All Zones' : `${selectedZone} Zone`})</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-blue-300 transition">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-bold text-slate-500 uppercase">Dispatched to Lenders</span>
            <div className="p-2 bg-blue-50 rounded-xl"><Send size={18} /></div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {loading ? '...' : stats.dispatchedToBanks}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Active files sent to 21 partner lenders</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-purple-300 transition">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-xs font-bold text-slate-500 uppercase">Sanctioned by Bank</span>
            <div className="p-2 bg-purple-50 rounded-xl"><CheckSquare size={18} /></div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {loading ? '...' : stats.sanctionedOffers}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Approved offers awaiting customer sign</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-emerald-300 transition">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold text-slate-500 uppercase">Disbursed Completed</span>
            <div className="p-2 bg-emerald-50 rounded-xl"><CheckCircle2 size={18} /></div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {loading ? '...' : stats.disbursedLoans}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Loans successfully funded</p>
        </div>

      </div>

      {/* ── 2 BIG OPERATIONS CHARTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Operations Monthly Verification & Forwarding Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <TrendingUp size={18} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Operations Verification & Forwarding Trend</h2>
                <p className="text-xs text-slate-500 font-medium">Files received, KYC verified & forwarded to banks ({selectedZone === 'ALL' ? 'All Zones' : `${selectedZone} Zone`})</p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">Last 6 Months</span>
          </div>

          <div className="h-[280px] w-full">
            {charts.monthlyTrend && charts.monthlyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDispatched" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
                  <Area type="monotone" dataKey="Files Received" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReceived)" />
                  <Area type="monotone" dataKey="Verified & Approved" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVerified)" />
                  <Area type="monotone" dataKey="Dispatched to Banks" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDispatched)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium">
                No monthly data available for current filter
              </div>
            )}
          </div>
        </div>

        {/* Live Operations & Bank Pipeline Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <PieIcon size={18} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Operations & Bank Stages</h2>
                <p className="text-xs text-slate-500 font-medium">Live verification & bank status</p>
              </div>
            </div>
          </div>

          <div className="h-[220px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.pipelineDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(charts.pipelineDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {(charts.pipelineDistribution || []).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color || PIE_COLORS[idx % PIE_COLORS.length] }}></span>
                  <span className="font-semibold text-slate-600">{item.name}</span>
                </div>
                <span className="font-black text-slate-900">{item.value} files</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── 2 BOTTOM CHARTS: ZONAL OPERATIONS QUEUE & PARTNER BANK DISPATCHES ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Zonal Operations Queue & Forwarding Comparison */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <MapPin size={18} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Zonal Operations Queue</h2>
                <p className="text-xs text-slate-500 font-medium">Pending verification queue vs Bank forwarded volume</p>
              </div>
            </div>
          </div>

          <div className="h-[240px] w-full">
            {charts.zoneComparison && charts.zoneComparison.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.zoneComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="zone" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
                  <Bar dataKey="Pending Queue" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending Queue" />
                  <Bar dataKey="KYC Verified" fill="#3b82f6" radius={[4, 4, 0, 0]} name="KYC Verified" />
                  <Bar dataKey="Forwarded to Bank" fill="#10b981" radius={[4, 4, 0, 0]} name="Forwarded to Bank" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium">
                No zonal distribution data
              </div>
            )}
          </div>
        </div>

        {/* Top Partner Bank / NBFC Forwarding Volume */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Building2 size={18} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Top Partner Lender Dispatches</h2>
                <p className="text-xs text-slate-500 font-medium">Forwarded files by partner bank & NBFC</p>
              </div>
            </div>
          </div>

          <div className="h-[240px] w-full">
            {charts.lenderDistribution && charts.lenderDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.lenderDistribution} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} width={130} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} name="Dispatched Files" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium">
                No lender dispatch data
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── 2 BIG CLEAN ACTION SHORTCUTS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <div 
          onClick={() => navigate('/operations/verification')}
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition flex items-center gap-2">
              Verify & Forward Desk <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Select any pending loan file from North, South, East, West or Central zone, verify KYC documents, and dispatch directly to one of 21 Banks / NBFCs.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl">
            Open Verification Desk &rarr;
          </div>
        </div>

        <div 
          onClick={() => navigate('/sales/bank-submissions')}
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl group-hover:bg-emerald-600 group-hover:text-white transition">
            <Building2 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition flex items-center gap-2">
              Lender Submissions & Live Status <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Track loan files sent to Kotak, HDFC, ICICI, Cholamandalam, Piramal, Bajaj, etc. Record bank sanctions, customer acceptances, or hold alerts.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl">
            View Submissions Queue &rarr;
          </div>
        </div>

      </div>

    </div>
  );
}

