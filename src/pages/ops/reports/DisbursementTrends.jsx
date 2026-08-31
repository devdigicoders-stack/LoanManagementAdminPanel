import React from 'react';
import { Download, Filter, Landmark, TrendingUp, BarChart3, Calendar } from 'lucide-react';

export default function DisbursementTrends() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Disbursement Trends</h1>
          <p className="text-sm text-gray-500 mt-1">Analyze historical funding volumes and pipeline conversions.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">MTD Disbursement (This Month)</p>
          <p className="text-3xl font-black text-green-600 mt-1">₹14.2 Cr</p>
          <p className="text-sm text-gray-500 font-medium mt-2">Target: ₹20 Cr</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">YTD Disbursement (This Year)</p>
          <p className="text-3xl font-black text-blue-600 mt-1">₹85.5 Cr</p>
          <p className="text-sm text-green-600 font-bold mt-2 flex items-center gap-1"><TrendingUp size={14}/> +18% vs Last YTD</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Conversion Rate (App to Disburse)</p>
          <p className="text-3xl font-black text-purple-600 mt-1">24.5%</p>
          <p className="text-sm text-gray-500 font-medium mt-2">Industry Avg: 22%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Placeholder Chart Area */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:col-span-2">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-blue-600"/> Monthly Disbursement Volume (Last 6 Months)
          </h3>
          
          {/* Simulated Chart Bars */}
          <div className="h-64 flex items-end justify-between gap-4 px-4 pb-8 pt-4 border-b border-gray-200 relative">
             <div className="absolute left-0 bottom-0 top-0 w-full flex flex-col justify-between text-xs text-gray-400 pb-8 z-0">
               <span>₹30 Cr</span>
               <span>₹20 Cr</span>
               <span>₹10 Cr</span>
               <span>₹0</span>
             </div>
             
             {[
               { month: 'Apr', val: '12', h: '40%' },
               { month: 'May', val: '15', h: '50%' },
               { month: 'Jun', val: '18', h: '60%' },
               { month: 'Jul', val: '14', h: '45%' },
               { month: 'Aug', val: '22', h: '75%' },
               { month: 'Sep', val: '14', h: '48%' },
             ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full z-10 group relative">
                   <div className="w-full max-w-[40px] bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600" style={{height: bar.h}}></div>
                   <span className="absolute -bottom-6 text-sm font-bold text-gray-600">{bar.month}</span>
                   
                   {/* Tooltip */}
                   <div className="absolute -top-10 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{bar.val} Cr
                   </div>
                </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
}
