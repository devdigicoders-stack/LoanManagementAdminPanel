import React from "react";
import { BarChart3, TrendingUp, DollarSign, Download, Filter, Calendar } from "lucide-react";

export default function ReportsAnalytics() {
  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Reports & Analytics</h1>
          <p className="text-[12px] font-medium text-slate-500">View detailed analytics and generate comprehensive reports</p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-10 px-3 flex items-center justify-between rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 bg-white min-w-[150px]">
            <span className="truncate">This Month</span>
            <Calendar size={14} className="text-slate-400 ml-2" />
          </div>
          <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={14} /> Filters
          </button>
          <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm">
            <Download size={14} /> Download Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Revenue</p>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-2">₹12.45 Cr</h3>
          <p className="text-[12px] font-bold text-[#489b0d] flex items-center gap-1"><TrendingUp size={12}/> +8.4% vs last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#489b0d]/10 text-[#489b0d] flex items-center justify-center">
              <BarChart3 size={16} />
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Loans</p>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-2">4,285</h3>
          <p className="text-[12px] font-bold text-[#489b0d] flex items-center gap-1"><TrendingUp size={12}/> +12.1% vs last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recovery Rate</p>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-2">94.2%</h3>
          <p className="text-[12px] font-bold text-[#489b0d] flex items-center gap-1"><TrendingUp size={12}/> +1.5% vs last month</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex-1 p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
          <BarChart3 size={24} className="text-slate-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-700 mb-2">Detailed Reports Generator</h2>
        <p className="text-[13px] font-medium text-slate-500 max-w-md">
          Select specific parameters using the filter options above to generate a comprehensive business report. Custom charts and insights will appear here.
        </p>
      </div>

    </div>
  );
}
