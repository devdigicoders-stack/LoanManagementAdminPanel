import React from 'react';
import { Download, Filter, TrendingUp, PieChart, Activity, AlertCircle } from 'lucide-react';

export default function PortfolioAnalytics() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Macro-level insights into Assets Under Management (AUM).</p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Total AUM</p>
          <p className="text-3xl font-black text-gray-900 mt-1">₹412.5 Cr</p>
          <p className="text-sm text-green-600 font-bold mt-2 flex items-center gap-1"><TrendingUp size={14}/> +4.2% (MoM)</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Active Accounts</p>
          <p className="text-3xl font-black text-blue-600 mt-1">14,250</p>
          <p className="text-sm text-green-600 font-bold mt-2 flex items-center gap-1"><TrendingUp size={14}/> +1,240 (MoM)</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Average Ticket Size</p>
          <p className="text-3xl font-black text-purple-600 mt-1">₹2.89 L</p>
          <p className="text-sm text-gray-500 font-medium mt-2">Stable across regions</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Gross NPA</p>
          <p className="text-3xl font-black text-red-600 mt-1">4.2%</p>
          <p className="text-sm text-red-600 font-bold mt-2 flex items-center gap-1"><TrendingUp size={14}/> +0.1% (MoM)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Product Mix */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PieChart size={18} className="text-blue-600"/> Product Mix (By AUM)
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                <span>Personal Loans</span>
                <span>₹180 Cr (43%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{width: '43%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                <span>Business Loans (MSME)</span>
                <span>₹120 Cr (29%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-purple-600 h-2.5 rounded-full" style={{width: '29%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                <span>Auto Loans</span>
                <span>₹75 Cr (18%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-orange-500 h-2.5 rounded-full" style={{width: '18%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                <span>Home Loans</span>
                <span>₹37.5 Cr (10%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-teal-500 h-2.5 rounded-full" style={{width: '10%'}}></div></div>
            </div>
          </div>
        </div>

        {/* State wise distribution */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity size={18} className="text-purple-600"/> Top 5 Regions (AUM)
          </h3>
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-2 text-xs font-bold text-gray-500 uppercase">State</th>
                  <th className="py-2 px-2 text-xs font-bold text-gray-500 uppercase text-right">AUM</th>
                  <th className="py-2 px-2 text-xs font-bold text-gray-500 uppercase text-right">NPA %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                <tr>
                  <td className="py-3 px-2 font-bold text-gray-900">Maharashtra</td>
                  <td className="py-3 px-2 text-right font-medium">₹145 Cr</td>
                  <td className="py-3 px-2 text-right font-bold text-green-600">3.1%</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 font-bold text-gray-900">Gujarat</td>
                  <td className="py-3 px-2 text-right font-medium">₹95 Cr</td>
                  <td className="py-3 px-2 text-right font-bold text-orange-600">4.5%</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 font-bold text-gray-900">Delhi NCR</td>
                  <td className="py-3 px-2 text-right font-medium">₹80 Cr</td>
                  <td className="py-3 px-2 text-right font-bold text-red-600">5.8%</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 font-bold text-gray-900">Karnataka</td>
                  <td className="py-3 px-2 text-right font-medium">₹55 Cr</td>
                  <td className="py-3 px-2 text-right font-bold text-green-600">2.8%</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 font-bold text-gray-900">Tamil Nadu</td>
                  <td className="py-3 px-2 text-right font-medium">₹37.5 Cr</td>
                  <td className="py-3 px-2 text-right font-bold text-green-600">3.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
