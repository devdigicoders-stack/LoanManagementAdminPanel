import React from "react";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  IndianRupee,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Search,
  Download,
  Calendar
} from "lucide-react";

export default function CollectionDashboard() {
  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Collection Dashboard</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">Loan Management</span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">Collections</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-10 px-3 flex items-center justify-between rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 bg-white min-w-[190px]">
            <span className="truncate">This Month</span>
            <Calendar size={14} className="text-slate-400 ml-2" />
          </div>
          <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={14} /> Report
          </button>
        </div>
      </div>

      {/* KPIs Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricBox 
          title="Total EMI Expected" 
          value="₹18.75 Cr" 
          trend="+15.2%" 
          trendUp={true} 
          icon={<IndianRupee size={16} className="text-blue-500" />} 
          bg="bg-blue-50/50" 
          border="border-blue-200"
          iconBg="bg-blue-100" 
        />
        <MetricBox 
          title="Due Amount" 
          value="₹2.45 Cr" 
          trend="-2.8%" 
          trendUp={true} 
          icon={<AlertTriangle size={16} className="text-orange-500" />} 
          bg="bg-orange-50/50" 
          border="border-orange-200"
          iconBg="bg-orange-100" 
        />
        <MetricBox 
          title="Collection Rate" 
          value="93.20%" 
          trend="+5.1%" 
          trendUp={true} 
          icon={<TrendingUp size={16} className="text-[#489b0d]" />} 
          bg="bg-[#489b0d]/5" 
          border="border-[#489b0d]/20"
          iconBg="bg-[#489b0d]/10" 
        />
        <MetricBox 
          title="Failed Payments" 
          value="126" 
          trend="+12%" 
          trendUp={false} 
          icon={<TrendingDown size={16} className="text-red-500" />} 
          bg="bg-red-50/50" 
          border="border-red-200"
          iconBg="bg-red-100" 
        />
      </div>

      {/* Charts & Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        
        {/* Collection Trend Chart Placeholder */}
        <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[14px] font-extrabold text-slate-800">Collection Trend</h3>
            <select className="text-[11px] font-bold text-slate-500 bg-transparent outline-none cursor-pointer">
              <option>Last 7 Days</option>
            </select>
          </div>
          
          <div className="flex-1 min-h-[250px] relative flex items-end justify-between pt-10 pb-6 border-b border-slate-100">
            {/* Dummy Bar Chart */}
            <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
              <div className="w-8 md:w-12 bg-blue-100 rounded-t-sm h-[40%] relative">
                <div className="absolute bottom-0 w-full bg-[#489b0d] rounded-t-sm h-[60%]"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400">01 May</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
              <div className="w-8 md:w-12 bg-blue-100 rounded-t-sm h-[70%] relative">
                <div className="absolute bottom-0 w-full bg-[#489b0d] rounded-t-sm h-[85%]"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400">06 May</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
              <div className="w-8 md:w-12 bg-blue-100 rounded-t-sm h-[50%] relative">
                <div className="absolute bottom-0 w-full bg-[#489b0d] rounded-t-sm h-[70%]"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400">11 May</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
              <div className="w-8 md:w-12 bg-blue-100 rounded-t-sm h-[90%] relative">
                <div className="absolute bottom-0 w-full bg-[#489b0d] rounded-t-sm h-[80%]"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400">16 May</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
              <div className="w-8 md:w-12 bg-blue-100 rounded-t-sm h-[60%] relative">
                <div className="absolute bottom-0 w-full bg-[#489b0d] rounded-t-sm h-[95%]"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400">21 May</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
              <div className="w-8 md:w-12 bg-blue-100 rounded-t-sm h-[80%] relative">
                <div className="absolute bottom-0 w-full bg-[#489b0d] rounded-t-sm h-[90%]"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400">26 May</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
              <span className="w-3 h-3 rounded-sm bg-blue-100"></span> Expected
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
              <span className="w-3 h-3 rounded-sm bg-[#489b0d]"></span> Collected
            </div>
          </div>
        </div>

        {/* Collector Performance */}
        <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[14px] font-extrabold text-slate-800">Collector Performance</h3>
            <span className="text-[11px] font-bold text-[#489b0d] bg-[#489b0d]/10 px-2 py-1 rounded-md">View All</span>
          </div>

          <div className="space-y-5 flex-1">
            <CollectorRow name="Suresh Patel" collected="₹45.2 L" rate="95%" rateColor="bg-[#489b0d]" />
            <CollectorRow name="Neha Singh" collected="₹38.5 L" rate="92%" rateColor="bg-[#489b0d]" />
            <CollectorRow name="John Doe" collected="₹32.1 L" rate="88%" rateColor="bg-yellow-500" />
            <CollectorRow name="Emily Davis" collected="₹28.9 L" rate="68%" rateColor="bg-orange-500" />
            <CollectorRow name="Amit Verma" collected="₹25.4 L" rate="62%" rateColor="bg-red-500" />
          </div>
        </div>

      </div>

    </div>
  );
}

// Subcomponents

function MetricBox({ title, value, trend, trendUp, icon, bg, border, iconBg }) {
  return (
    <div className={`p-5 rounded-lg border ${border} ${bg} flex flex-col gap-3 relative overflow-hidden`}>
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-md ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-extrabold px-2 py-1 rounded-lg bg-white shadow-sm ${trendUp ? 'text-[#489b0d]' : 'text-red-500'}`}>
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{title}</p>
        <h3 className="text-2xl font-extrabold text-slate-800">{value}</h3>
      </div>
    </div>
  );
}

function CollectorRow({ name, collected, rate, rateColor }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-slate-500">{name.charAt(0)}</span>
        </div>
        <div>
          <p className="text-[13px] font-bold text-slate-800 leading-tight">{name}</p>
          <p className="text-[11px] font-medium text-slate-500">Collected: <span className="font-bold text-slate-700">{collected}</span></p>
        </div>
      </div>
      <div className="flex items-center gap-3 w-[100px]">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${rateColor} rounded-full`} style={{ width: rate }}></div>
        </div>
        <span className="text-[11px] font-extrabold text-slate-800 w-8 text-right">{rate}</span>
      </div>
    </div>
  );
}
