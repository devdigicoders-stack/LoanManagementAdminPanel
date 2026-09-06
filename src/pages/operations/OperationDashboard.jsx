import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReactPkg from 'highcharts-react-official';
import { 
  Users, FileText, ShieldCheck, Briefcase, CheckSquare, 
  XOctagon, Landmark, CheckCircle2, AlertCircle, TrendingDown, Filter, ArrowRight,
  Clock, FilePlus, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const HighchartsReact = HighchartsReactPkg.default || HighchartsReactPkg.HighchartsReact || HighchartsReactPkg;
Highcharts.setOptions({ accessibility: { enabled: false } });

export default function OperationDashboard() {
  const navigate = useNavigate();
  const [opsData, setOpsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpsData();
  }, []);

  const fetchOpsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard/ops-overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOpsData(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load operations metrics");
    } finally {
      setLoading(false);
    }
  };

  const c = opsData?.cards || {};

  const topCards = [
    { label: 'Total Leads', value: (c.totalLeads ?? 0).toString(), icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { label: 'Applications', value: (c.totalApps ?? 0).toString(), icon: FileText, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { label: 'Verified Docs', value: (c.verifiedApps ?? 0).toString(), icon: ShieldCheck, color: 'text-orange-600 bg-orange-50 border-orange-100' },
    { label: 'Under Review', value: (c.underReviewApps ?? 0).toString(), icon: Briefcase, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { label: 'Approved', value: (c.approvedApps ?? 0).toString(), icon: CheckSquare, color: 'text-green-600 bg-green-50 border-green-100' },
    { label: 'Rejected', value: (c.rejectedApps ?? 0).toString(), icon: XOctagon, color: 'text-red-600 bg-red-50 border-red-100' },
    { label: 'Disbursed', value: (c.disbursedApps ?? 0).toString(), icon: Landmark, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Active Loans', value: (c.activeLoans ?? 0).toString(), icon: CheckCircle2, color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
    { label: 'Overdue', value: (c.overdueLoans ?? 0).toString(), icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50 border-yellow-100' },
    { label: 'NPA Default', value: (c.npaCount ?? 0).toString(), icon: TrendingDown, color: 'text-rose-600 bg-rose-50 border-rose-100' },
  ];

  const funnelOptions = {
    chart: { type: 'column', backgroundColor: 'transparent', height: 320 },
    title: { text: null },
    xAxis: { categories: ['Leads', 'Applications', 'Verified', 'Underwriting', 'Approved', 'Disbursed'], lineWidth: 0, tickWidth: 0 },
    yAxis: { title: { text: null }, gridLineDashStyle: 'Dash', gridLineColor: '#f3f4f6' },
    legend: { enabled: false },
    credits: { enabled: false },
    plotOptions: {
      column: {
        borderRadius: 6,
        colorByPoint: true,
        borderWidth: 0,
        dataLabels: { enabled: true, format: '{y}', style: { fontWeight: 'bold', fontSize: '12px' } }
      }
    },
    colors: ['#60a5fa', '#818cf8', '#fb923c', '#c084fc', '#4ade80', '#10b981'],
    series: [{ name: 'MongoDB Pipeline', data: opsData?.funnel || [0, 0, 0, 0, 0, 0] }]
  };

  const approvalVsRejectionOptions = {
    chart: { type: 'pie', backgroundColor: 'transparent', height: 250 },
    title: { text: null },
    credits: { enabled: false },
    plotOptions: { pie: { innerSize: '70%', dataLabels: { enabled: false }, showInLegend: true, borderWidth: 0 } },
    series: [{ 
      name: 'Decisions', 
      data: opsData?.decisions || [
        { name: 'Approved', y: 0, color: '#10b981' }, 
        { name: 'Rejected', y: 0, color: '#ef4444' }, 
        { name: 'Under Review', y: 0, color: '#f59e0b' }
      ] 
    }]
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-800">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Operations & LOS Command Center</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Live MongoDB Loan Origination Funnel and Underwriting Pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/ops/los/applications')}
            className="flex items-center gap-2 bg-[#1e7ba8] hover:bg-[#166085] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <FilePlus size={16} /> Open LOS Queue
          </button>
        </div>
      </div>

      {/* 10 KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {topCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition-shadow">
              <div className={`p-2.5 rounded-lg border ${card.color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                <p className="text-xl font-black text-slate-800 tracking-tight">
                  {loading ? "..." : card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Funnel & Approval Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-sm font-black text-slate-900">Live Loan Origination Conversion Funnel</h2>
              <p className="text-[11px] text-slate-400 font-medium">Stage-by-stage pipeline conversions from MongoDB</p>
            </div>
          </div>
          <HighchartsReact highcharts={Highcharts} options={funnelOptions} />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-sm font-black text-slate-900 mb-1">Underwriting Approvals vs Rejections</h2>
          <p className="text-[11px] text-slate-400 font-medium mb-4">Realtime decision ratio from loan applications</p>
          <HighchartsReact highcharts={Highcharts} options={approvalVsRejectionOptions} />
        </div>
      </div>
    </div>
  );
}
