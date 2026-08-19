import React from "react";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  FileText,
  UserCheck,
  CheckCircle2,
  Banknote,
  ClipboardList,
  CheckSquare,
  TrendingUp,
  TrendingDown,
  Clock,
  PieChart,
  Search
} from "lucide-react";

export default function LoanDashboard() {
  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Loan Management</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="text-slate-500">Manage loan applications, disbursements and repayments</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-10 px-3 flex items-center justify-between rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 bg-white min-w-[200px]">
            <Search size={14} className="text-slate-400 mr-2" />
            <span className="truncate flex-1 text-slate-400">Search by Application ID...</span>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Left Side: Process Flow & Stage Wise Summary */}
        <div className="space-y-6">
          
          {/* Loan Process Flow Card */}
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-[16px] font-extrabold text-slate-800 mb-0.5">Loan Process Flow</h2>
                <p className="text-[12px] font-medium text-slate-500">Track loan journey at each stage</p>
              </div>
              <select className="h-8 px-2 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600 focus:outline-none bg-slate-50">
                <option>All Branches</option>
            <option>Mumbai Branch</option>
            <option>Delhi Branch</option>
            <option>Bangalore Branch</option>
            <option>Chennai Branch</option>
              </select>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-start gap-4 overflow-x-auto custom-scrollbar pb-4 min-w-full">
              <ProcessStep icon={<FileText size={16} />} title="Application" count="1,248" color="text-[#489b0d]" bg="bg-[#489b0d]/10" active />
              <div className="flex-1 h-[1px] bg-slate-200 border-t border-dashed border-slate-300 min-w-[20px]"></div>
              <ProcessStep icon={<UserCheck size={16} />} title="Verification" count="684" color="text-blue-500" bg="bg-blue-50" />
              <div className="flex-1 h-[1px] bg-slate-200 border-t border-dashed border-slate-300 min-w-[20px]"></div>
              <ProcessStep icon={<CheckCircle2 size={16} />} title="Approval" count="532" color="text-purple-500" bg="bg-purple-50" />
              <div className="flex-1 h-[1px] bg-slate-200 border-t border-dashed border-slate-300 min-w-[20px]"></div>
              <ProcessStep icon={<Banknote size={16} />} title="Disbursement" count="416" color="text-orange-500" bg="bg-orange-50" />
              <div className="flex-1 h-[1px] bg-slate-200 border-t border-dashed border-slate-300 min-w-[20px]"></div>
              <ProcessStep icon={<ClipboardList size={16} />} title="Collection" count="1,024" color="text-[#489b0d]" bg="bg-[#489b0d]/10" />
              <div className="flex-1 h-[1px] bg-slate-200 border-t border-dashed border-slate-300 min-w-[20px]"></div>
              <ProcessStep icon={<CheckSquare size={16} />} title="Closure" count="256" color="text-slate-500" bg="bg-slate-100" />
            </div>
          </div>

          {/* Stage Wise Summary Card */}
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[16px] font-extrabold text-slate-800">Stage Wise Summary</h2>
              <select className="h-8 px-2 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600 focus:outline-none bg-slate-50">
                <option>This Month</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SummaryCard 
                title="Avg. Processing Time" 
                value="3.6 Days" 
                trend="-12%" 
                trendUp={false}
                icon={<Clock size={16} className="text-[#489b0d]" />} 
                bg="bg-[#489b0d]/10" 
              />
              <SummaryCard 
                title="Approval Rate" 
                value="78.45%" 
                trend="+9.4%" 
                trendUp={true}
                icon={<CheckCircle2 size={16} className="text-blue-500" />} 
                bg="bg-blue-50" 
              />
              <SummaryCard 
                title="Disbursement Amount" 
                value="₹24,75,00,000" 
                trend="+18.7%" 
                trendUp={true}
                icon={<Banknote size={16} className="text-purple-500" />} 
                bg="bg-purple-50" 
              />
              <SummaryCard 
                title="Recovery Rate" 
                value="93.20%" 
                trend="+6.2%" 
                trendUp={true}
                icon={<TrendingUp size={16} className="text-orange-500" />} 
                bg="bg-orange-50" 
              />
            </div>
          </div>
          
        </div>

        {/* Right Side: Analytics & Insights */}
        <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-[16px] font-extrabold text-slate-800 mb-0.5">Loan Analytics & Insights</h2>
              <p className="text-[12px] font-medium text-slate-500">Key metrics and portfolio distribution</p>
            </div>
            <div className="h-8 px-3 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600 flex items-center bg-slate-50">
              01 May 2025 - 18 May 2025
            </div>
          </div>

          {/* Top KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <MetricBox title="Total Loan Book" value="₹150.25 Cr" trend="+14.6%" trendUp={true} color="text-[#489b0d]" bg="bg-[#489b0d]/5" border="border-[#489b0d]/20" />
            <MetricBox title="Total Disbursed" value="₹42.10 Cr" trend="+18.2%" trendUp={true} color="text-blue-500" bg="bg-blue-50/50" border="border-blue-200" />
            <MetricBox title="Total Outstanding" value="₹108.15 Cr" trend="+8.4%" trendUp={true} color="text-purple-500" bg="bg-purple-50/50" border="border-purple-200" />
            <MetricBox title="Overdue Amount" value="₹3.25 Cr" trend="-4.2%" trendUp={false} color="text-red-500" bg="bg-red-50/50" border="border-red-200" />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-8 flex-1">
            
            {/* Trend Chart Placeholder */}
            <div className="flex flex-col">
              <h3 className="text-[13px] font-extrabold text-slate-800 mb-4">Disbursement Trend</h3>
              <div className="flex-1 flex flex-col justify-end border-l border-b border-slate-200 relative min-h-[180px] p-2">
                <svg className="w-full h-full absolute inset-0 p-2" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M 0,80 L 15,60 L 30,70 L 45,40 L 60,50 L 75,20 L 90,30 L 100,10" fill="none" stroke="#489b0d" strokeWidth="2" />
                  <circle cx="15" cy="60" r="2" fill="#489b0d" />
                  <circle cx="30" cy="70" r="2" fill="#489b0d" />
                  <circle cx="45" cy="40" r="2" fill="#489b0d" />
                  <circle cx="60" cy="50" r="2" fill="#489b0d" />
                  <circle cx="75" cy="20" r="2" fill="#489b0d" />
                  <circle cx="90" cy="30" r="2" fill="#489b0d" />
                  <circle cx="100" cy="10" r="2" fill="#489b0d" />
                </svg>
                {/* Axis Labels */}
                <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[9px] font-bold text-slate-400">
                  <span className="whitespace-nowrap">01 May</span>
                  <span className="whitespace-nowrap">04 May</span>
                  <span className="whitespace-nowrap">07 May</span>
                  <span className="whitespace-nowrap">10 May</span>
                  <span className="whitespace-nowrap">13 May</span>
                  <span className="whitespace-nowrap">16 May</span>
                  <span className="whitespace-nowrap">18 May</span>
                </div>
                <div className="absolute top-0 -left-8 bottom-0 flex flex-col justify-between text-[9px] font-bold text-slate-400 pb-6 items-end">
                  <span className="whitespace-nowrap">40 Cr</span>
                  <span className="whitespace-nowrap">30 Cr</span>
                  <span className="whitespace-nowrap">20 Cr</span>
                  <span className="whitespace-nowrap">10 Cr</span>
                  <span className="whitespace-nowrap">0 Cr</span>
                </div>
              </div>
            </div>

            {/* Doughnut Chart Placeholder */}
            <div className="flex flex-col">
              <h3 className="text-[13px] font-extrabold text-slate-800 mb-4">Loan Portfolio by Type</h3>
              <div className="flex items-center gap-6 flex-1">
                <div className="relative w-32 h-32 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    {/* Personal Loan 40% */}
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="40, 100" />
                    {/* Home Loan 30% */}
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#489b0d" strokeWidth="4" strokeDasharray="30, 100" strokeDashoffset="-40" />
                    {/* Business Loan 15% */}
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eab308" strokeWidth="4" strokeDasharray="15, 100" strokeDashoffset="-70" />
                    {/* Education Loan 10% */}
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="10, 100" strokeDashoffset="-85" />
                    {/* Other 5% */}
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#94a3b8" strokeWidth="4" strokeDasharray="5, 100" strokeDashoffset="-95" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[9px] font-bold text-slate-400">Total</span>
                    <span className="text-[13px] font-extrabold text-slate-800">₹150.25 Cr</span>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex-1 space-y-2.5">
                  <LegendItem color="bg-blue-500" label="Personal Loan" percent="40%" val="(60.1 Cr)" />
                  <LegendItem color="bg-[#489b0d]" label="Home Loan" percent="30%" val="(45.1 Cr)" />
                  <LegendItem color="bg-yellow-500" label="Business Loan" percent="15%" val="(22.5 Cr)" />
                  <LegendItem color="bg-red-500" label="Education Loan" percent="10%" val="(15.0 Cr)" />
                  <LegendItem color="bg-slate-400" label="Other Loan" percent="5%" val="(7.5 Cr)" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

// Subcomponents

function ProcessStep({ icon, title, count, color, bg, active }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${active ? '' : 'opacity-80'} min-w-[70px]`}>
      <div className={`w-10 h-10 rounded-full ${bg} ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <div className="text-center">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-[14px] font-extrabold text-slate-800">{count}</p>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, trend, trendUp, icon, bg }) {
  return (
    <div className="border border-slate-100 rounded-md p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-tight">{title}</p>
      </div>
      <div>
        <h3 className="text-xl font-extrabold text-slate-800">{value}</h3>
        <p className={`text-[11px] font-bold flex items-center gap-1 mt-1 ${trendUp ? 'text-[#489b0d]' : 'text-red-500'}`}>
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend} <span className="text-slate-400 ml-1 font-medium">vs last month</span>
        </p>
      </div>
    </div>
  );
}

function MetricBox({ title, value, trend, trendUp, color, bg, border }) {
  return (
    <div className={`p-4 rounded-md border ${border} ${bg} flex flex-col gap-1 overflow-hidden`}>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap truncate">{title}</p>
      <h3 className="text-[16px] font-extrabold text-slate-800 whitespace-nowrap truncate">{value}</h3>
      <p className={`text-[10px] font-bold flex items-center gap-1 whitespace-nowrap ${trendUp ? 'text-[#489b0d]' : 'text-red-500'}`}>
        {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {trend}
      </p>
    </div>
  );
}

function LegendItem({ color, label, percent, val }) {
  return (
    <div className="flex items-center justify-between text-[11px] gap-2">
      <div className="flex items-center gap-2 shrink-0">
        <span className={`w-2 h-2 rounded-full shrink-0 ${color}`}></span>
        <span className="font-semibold text-slate-600 whitespace-nowrap">{label}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-extrabold text-slate-800 whitespace-nowrap">{percent}</span>
        <span className="text-slate-400 font-medium w-[45px] text-right whitespace-nowrap">{val}</span>
      </div>
    </div>
  );
}
