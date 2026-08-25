import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReactImport from 'highcharts-react-official';
import { 
  FileText, Clock, AlertCircle, CheckCircle, RotateCw, FileSearch, ShieldCheck, 
  XCircle, Zap, FilePlus, Search, Bell, PlusCircle, ArrowRight, TrendingUp
} from 'lucide-react';

const HighchartsReact = HighchartsReactImport.default || HighchartsReactImport;
Highcharts.setOptions({ accessibility: { enabled: false } });

// --- Mock Data ---
const recentApps = [
  { id: 'APP-8001', name: 'Ramesh Patel', type: 'Personal Loan', amount: '₹2,50,000', status: 'Documents Pending', officer: 'Suresh K.', date: '2023-10-25' },
  { id: 'APP-8002', name: 'Priya Sharma', type: 'Home Loan', amount: '₹45,00,000', status: 'Verification', officer: 'Meena R.', date: '2023-10-25' },
  { id: 'APP-8003', name: 'Amit Kumar', type: 'Business Loan', amount: '₹15,00,000', status: 'In Progress', officer: 'Vikram S.', date: '2023-10-24' },
  { id: 'APP-8004', name: 'Neha Gupta', type: 'Personal Loan', amount: '₹1,00,000', status: 'New', officer: 'Unassigned', date: '2023-10-24' },
  { id: 'APP-8005', name: 'Rajesh Singh', type: 'Auto Loan', amount: '₹8,50,000', status: 'On Hold', officer: 'Suresh K.', date: '2023-10-23' },
];

const statusChartOptions = {
  chart: { type: 'column', backgroundColor: 'transparent', height: 300, style: { fontFamily: 'inherit' } },
  title: { text: null },
  xAxis: { 
    categories: ['New', 'In Progress', 'Docs Pending', 'Verification', 'On Hold', 'Approved', 'Rejected', 'Completed'],
    labels: { style: { color: '#667085', fontSize: '11px', fontWeight: '700' } },
    lineColor: '#D9EAF2', tickColor: '#D9EAF2'
  },
  yAxis: { 
    title: { text: null }, 
    labels: { style: { color: '#667085', fontSize: '11px', fontWeight: '700' } }, 
    gridLineColor: '#F0FAFF', gridLineDashStyle: 'Dash' 
  },
  legend: { enabled: false },
  credits: { enabled: false },
  tooltip: { backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 12, borderWidth: 0, shadow: true, padding: 12 },
  plotOptions: { column: { borderRadius: 6, borderWidth: 0, colorByPoint: true } },
  colors: ['#BFE7F7', '#8ED3F4', '#FDE68A', '#8ED3F4', '#FECACA', '#A7F3D0', '#FECACA', '#8ED3F4'], 
  series: [{ name: 'Applications', data: [14, 25, 18, 12, 5, 42, 8, 150] }]
};

// Reusable Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 p-6 ${className}`}>
    {children}
  </div>
);

export default function OperationDashboard() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#FAFCFD] min-h-screen p-2 space-y-8 pb-12">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-[24px] p-8 border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#DFF3FF] to-[#FFF8E7] rounded-full blur-3xl opacity-70 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#344054] tracking-tight">Operation Dashboard</h1>
            <p className="text-[15px] text-[#667085] font-medium mt-2">Manage and track application processing workflows.</p>
          </div>
          <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-[#FFF8E7] text-[#D97706] border border-[#FDE68A] rounded-xl font-bold text-[14px] hover:bg-[#FEF3C7] shadow-sm transition-all hover:-translate-y-0.5">
              <Clock size={18} /> Today's Focus
           </button>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-[#8ED3F4] text-white border border-[#7BC4E8] rounded-xl font-bold text-[14px] hover:bg-[#7BC4E8] shadow-md transition-all hover:-translate-y-0.5">
              <FilePlus size={18} /> New Application
           </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        
        <Card className="flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-[#F0FAFF] to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAFCFD] text-[#667085] flex items-center justify-center shrink-0 border border-[#D9EAF2]">
              <FileText size={22} strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-[13px] font-bold text-[#667085] mb-1">Total Apps</p>
          <h3 className="text-3xl font-black text-[#344054] tracking-tight">842</h3>
        </Card>

        <Card className="flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-[#DFF3FF] to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DFF3FF] text-[#0284C7] flex items-center justify-center shrink-0 border border-[#BFE7F7]">
              <Zap size={22} strokeWidth={2.5} />
            </div>
            <span className="text-[12px] font-bold text-[#0284C7] bg-[#F0FAFF] px-2 py-0.5 rounded-full border border-[#D9EAF2]">+12</span>
          </div>
          <p className="text-[13px] font-bold text-[#667085] mb-1">New Apps</p>
          <h3 className="text-3xl font-black text-[#344054] tracking-tight">45</h3>
        </Card>

        <Card className="flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-[#BFE7F7] to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#BFE7F7] text-[#0369A1] flex items-center justify-center shrink-0 border border-[#8ED3F4]">
              <RotateCw size={22} strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-[13px] font-bold text-[#667085] mb-1">Under Process</p>
          <h3 className="text-3xl font-black text-[#344054] tracking-tight">128</h3>
        </Card>

        <Card className="flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-[#FFF8E7] to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8E7] text-[#D97706] flex items-center justify-center shrink-0 border border-[#FDE68A]">
              <FileSearch size={22} strokeWidth={2.5} />
            </div>
            <span className="text-[12px] font-bold text-[#D97706] bg-[#FFFDF5] px-2 py-0.5 rounded-full border border-[#FEF08A]">Urgent</span>
          </div>
          <p className="text-[13px] font-bold text-[#667085] mb-1">Docs Pending</p>
          <h3 className="text-3xl font-black text-[#344054] tracking-tight">34</h3>
        </Card>

        <Card className="flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-[#FFFDF5] to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFFDF5] text-[#667085] flex items-center justify-center shrink-0 border border-[#FEF08A]">
              <ShieldCheck size={22} strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-[13px] font-bold text-[#667085] mb-1">Verification</p>
          <h3 className="text-3xl font-black text-[#344054] tracking-tight">22</h3>
        </Card>

      </div>

      {/* Overview & Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Today's Overview */}
        <Card className="xl:col-span-3">
          <h3 className="text-lg font-extrabold text-[#344054] mb-6">Today's Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-[#FAFCFD] p-5 rounded-[20px] border border-[#D9EAF2] flex flex-col items-center justify-center text-center group hover:border-[#8ED3F4] transition-colors">
              <p className="text-[12px] font-bold text-[#667085] uppercase mb-1">New Apps</p>
              <p className="text-3xl font-black text-[#344054] group-hover:text-[#0284C7] transition-colors">24</p>
            </div>
            <div className="bg-[#FFFDF5] p-5 rounded-[20px] border border-[#FEF08A] flex flex-col items-center justify-center text-center group hover:border-[#FCD34D] transition-colors">
              <p className="text-[12px] font-bold text-[#667085] uppercase mb-1">Docs Received</p>
              <p className="text-3xl font-black text-[#344054] group-hover:text-[#D97706] transition-colors">18</p>
            </div>
            <div className="bg-[#DFF3FF] p-5 rounded-[20px] border border-[#BFE7F7] flex flex-col items-center justify-center text-center group hover:border-[#8ED3F4] transition-colors">
              <p className="text-[12px] font-bold text-[#667085] uppercase mb-1">Processed</p>
              <p className="text-3xl font-black text-[#344054] group-hover:text-[#0369A1] transition-colors">32</p>
            </div>
            <div className="bg-[#FEF2F2] p-5 rounded-[20px] border border-[#FECACA] flex flex-col items-center justify-center text-center group hover:border-[#FCA5A5] transition-colors">
              <p className="text-[12px] font-bold text-[#667085] uppercase mb-1">On Hold</p>
              <p className="text-3xl font-black text-[#344054] group-hover:text-[#DC2626] transition-colors">5</p>
            </div>
            <div className="bg-[#FAFCFD] p-5 rounded-[20px] border border-[#D9EAF2] flex flex-col items-center justify-center text-center group hover:border-[#8ED3F4] transition-colors">
              <p className="text-[12px] font-bold text-[#667085] uppercase mb-1">Follow-ups</p>
              <p className="text-3xl font-black text-[#344054] group-hover:text-[#0284C7] transition-colors">12</p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="xl:col-span-1">
          <h3 className="text-lg font-extrabold text-[#344054] mb-6">Quick Actions</h3>
          <div className="space-y-4">
            {[
              { label: 'View Applications', icon: FileText, route: '/operations/applications', color: 'text-[#0284C7] bg-[#DFF3FF] border-[#BFE7F7]' },
              { label: 'Pending Documents', icon: FileSearch, route: '/operations/documents', color: 'text-[#D97706] bg-[#FFF8E7] border-[#FDE68A]' },
              { label: 'Add Follow-up', icon: PlusCircle, route: '/operations/follow-ups', color: 'text-[#059669] bg-[#ECFDF5] border-[#A7F3D0]' },
              { label: 'Search Application', icon: Search, route: '/operations/applications', color: 'text-[#667085] bg-[#FAFCFD] border-[#D9EAF2]' }
            ].map((action, i) => (
              <button key={i} onClick={() => navigate(action.route)} className="w-full flex items-center justify-between p-3.5 rounded-[16px] bg-[#FAFCFD] hover:bg-white border border-[#D9EAF2] hover:border-[#BFE7F7] hover:shadow-md transition-all group hover:-translate-y-0.5">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110 ${action.color}`}>
                    <action.icon size={18} strokeWidth={2.5} />
                  </div>
                  <span className="text-[14px] font-bold text-[#344054]">{action.label}</span>
                </div>
                <ArrowRight size={16} className="text-[#BFE7F7] group-hover:text-[#8ED3F4]" />
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts & Recent Table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Status Chart */}
        <Card className="xl:col-span-1">
          <h3 className="text-lg font-extrabold text-[#344054] mb-6">Status Overview</h3>
          <HighchartsReact highcharts={Highcharts} options={statusChartOptions} />
        </Card>

        {/* Recent Applications */}
        <Card className="xl:col-span-2 !p-0 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-[#D9EAF2] bg-white">
            <h3 className="text-lg font-extrabold text-[#344054]">Recent Applications</h3>
            <button onClick={() => navigate('/operations/applications')} className="text-[12px] font-bold text-[#8ED3F4] bg-[#F0FAFF] px-4 py-2 rounded-xl hover:bg-[#DFF3FF] transition-colors border border-[#D9EAF2]">View All</button>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider bg-[#FAFCFD] rounded-l-xl">App ID</th>
                  <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider bg-[#FAFCFD]">Customer</th>
                  <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider bg-[#FAFCFD]">Amount</th>
                  <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider bg-[#FAFCFD]">Status</th>
                  <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider bg-[#FAFCFD] rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0FAFF]">
                {recentApps.map((app, i) => (
                  <tr key={i} className="hover:bg-[#F0FAFF] transition-colors group">
                    <td className="py-4 px-5 text-[13px] font-bold text-[#344054] whitespace-nowrap">{app.id}</td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#DFF3FF] flex items-center justify-center text-[#0284C7] font-bold text-[13px] border border-[#BFE7F7]">
                          {app.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-[#344054]">{app.name}</span>
                          <span className="text-[12px] font-medium text-[#667085]">{app.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-[14px] font-black text-[#344054] whitespace-nowrap">{app.amount}</td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border ${
                        app.status === 'Completed' ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]' : 
                        app.status === 'Documents Pending' ? 'bg-[#FFF8E7] text-[#D97706] border-[#FDE68A]' :
                        app.status === 'On Hold' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]' :
                        'bg-[#DFF3FF] text-[#0284C7] border-[#BFE7F7]'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <button className="text-[12px] font-bold text-[#8ED3F4] opacity-0 group-hover:opacity-100 transition-opacity hover:underline">Process</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </div>
  );
}
