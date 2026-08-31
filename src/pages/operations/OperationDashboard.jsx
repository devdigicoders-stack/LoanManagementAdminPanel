import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReactImport from 'highcharts-react-official';
import { 
  Users, FileText, ShieldCheck, Briefcase, CheckSquare, 
  XOctagon, Landmark, CheckCircle2, AlertCircle, TrendingDown, Filter, ArrowRight
} from 'lucide-react';

const HighchartsReact = HighchartsReactImport.default || HighchartsReactImport;
Highcharts.setOptions({ accessibility: { enabled: false } });

// --- MOCK KPI DATA ---
const topCards = [
  { label: 'Total Leads', value: '4,521', icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-100' },
  { label: 'New Apps', value: '1,204', icon: FileText, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
  { label: 'Pending Ver.', value: '342', icon: ShieldCheck, color: 'text-orange-600 bg-orange-50 border-orange-100' },
  { label: 'Under Review', value: '185', icon: Briefcase, color: 'text-purple-600 bg-purple-50 border-purple-100' },
  { label: 'Approved', value: '890', icon: CheckSquare, color: 'text-green-600 bg-green-50 border-green-100' },
  { label: 'Rejected', value: '124', icon: XOctagon, color: 'text-red-600 bg-red-50 border-red-100' },
  { label: 'Disbursed', value: '750', icon: Landmark, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { label: 'Active Loans', value: '3,420', icon: CheckCircle2, color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
  { label: 'Overdue', value: '112', icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50 border-yellow-100' },
  { label: 'NPA', value: '18', icon: TrendingDown, color: 'text-rose-600 bg-rose-50 border-rose-100' },
];

// --- CHARTS CONFIG ---
const funnelOptions = {
  chart: { type: 'column', backgroundColor: 'transparent', height: 350 },
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
  colors: ['#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#0f172a'],
  series: [{ name: 'Count', data: [4521, 1204, 950, 890, 800, 750] }]
};

const dailyAppsOptions = {
  chart: { type: 'areaspline', backgroundColor: 'transparent', height: 250 },
  title: { text: null },
  xAxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], gridLineWidth: 0 },
  yAxis: { title: { text: null }, gridLineDashStyle: 'Dash' },
  legend: { enabled: false },
  credits: { enabled: false },
  plotOptions: { areaspline: { fillOpacity: 0.2, lineWidth: 3, marker: { enabled: false } } },
  series: [{ name: 'Applications', data: [45, 52, 38, 65, 80, 42, 30], color: '#6366f1' }]
};

const approvalVsRejectionOptions = {
  chart: { type: 'pie', backgroundColor: 'transparent', height: 250 },
  title: { text: null },
  credits: { enabled: false },
  plotOptions: { pie: { innerSize: '70%', dataLabels: { enabled: false }, showInLegend: true, borderWidth: 0 } },
  series: [{ name: 'Decisions', data: [{ name: 'Approved', y: 890, color: '#10b981' }, { name: 'Rejected', y: 124, color: '#ef4444' }, { name: 'Hold', y: 45, color: '#f59e0b' }] }]
};

const disbursementTrendOptions = {
  chart: { type: 'column', backgroundColor: 'transparent', height: 250 },
  title: { text: null },
  xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
  yAxis: { title: { text: null }, gridLineDashStyle: 'Dash' },
  legend: { enabled: false },
  credits: { enabled: false },
  plotOptions: { column: { borderRadius: 4, borderWidth: 0 } },
  series: [{ name: 'Disbursed (₹ Lakhs)', data: [120, 150, 130, 180, 210, 250], color: '#0ea5e9' }]
};

export default function OperationDashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');

  useEffect(() => {
    setRole(localStorage.getItem('userRole') || 'Unknown Role');
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6 bg-[#f8fafc] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Command Center</h1>
          <p className="text-[14px] text-gray-500 font-medium mt-1">
            Welcome back! You are viewing the dashboard as <span className="text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-100">{role}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert("Showing today's focus tasks (Pending Verifications & Approvals)")}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FFF8E7] text-[#D97706] border border-[#FDE68A] rounded-xl font-bold text-[14px] hover:bg-[#FEF3C7] shadow-sm transition-all hover:-translate-y-0.5"
          >
             <Clock size={18} /> Today's Focus
          </button>
          <button 
            onClick={() => navigate('/ops/leads/add')}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white border border-blue-700 rounded-xl font-bold text-[14px] hover:bg-blue-700 shadow-md transition-all hover:-translate-y-0.5"
          >
             <FilePlus size={18} /> New Lead / App
          </button>
        </div>
      </div>

      {/* Top KPI Cards (Har role ke according data dikhega) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {topCards.map((card, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 transition-transform group-hover:scale-150 ${card.color.split(' ')[1]}`}></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-2.5 rounded-xl border ${card.color}`}>
                <card.icon size={20} strokeWidth={2.5} />
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight relative z-10">{card.value}</h3>
            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mt-1 relative z-10">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Loan Funnel (Takes up 2 columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-black text-gray-900">Loan Conversion Funnel</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">Tracking lead flow through origination to disbursement</p>
            </div>
          </div>
          <HighchartsReact highcharts={Highcharts} options={funnelOptions} />
        </div>

        {/* Approval vs Rejection (1 column) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-6">Decision Analytics</h3>
          <HighchartsReact highcharts={Highcharts} options={approvalVsRejectionOptions} />
          
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 font-medium text-gray-600"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Approved</span>
              <span className="font-bold text-gray-900">890 (84%)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 font-medium text-gray-600"><div className="w-3 h-3 rounded-full bg-red-500"></div> Rejected</span>
              <span className="font-bold text-gray-900">124 (12%)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 font-medium text-gray-600"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Hold</span>
              <span className="font-bold text-gray-900">45 (4%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Secondary Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Daily Applications Trend */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-gray-900">Weekly Application Volume</h3>
            <button className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:underline">View All <ArrowRight size={14}/></button>
          </div>
          <HighchartsReact highcharts={Highcharts} options={dailyAppsOptions} />
        </div>

        {/* Disbursement Trend */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-gray-900">Disbursement Trend (Lakhs)</h3>
            <button className="text-sky-600 text-sm font-bold flex items-center gap-1 hover:underline">View Report <ArrowRight size={14}/></button>
          </div>
          <HighchartsReact highcharts={Highcharts} options={disbursementTrendOptions} />
        </div>

      </div>
      
    </div>
  );
}
