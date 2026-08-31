import React from 'react';
import { Download, Filter, Percent, Activity } from 'lucide-react';

export default function CollectionEfficiency() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collection Efficiency</h1>
          <p className="text-sm text-gray-500 mt-1">Track recovery rates and bounce metrics over time.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Current Month Efficiency</p>
          <p className="text-3xl font-black text-green-600 mt-1">94.5%</p>
          <p className="text-sm text-gray-500 font-medium mt-2">Target: 95%</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">First Pass Clearance (FPC)</p>
          <p className="text-3xl font-black text-blue-600 mt-1">88.2%</p>
          <p className="text-sm text-gray-500 font-medium mt-2">Cleared on first presentation</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Average Bounce Rate</p>
          <p className="text-3xl font-black text-orange-600 mt-1">11.8%</p>
          <p className="text-sm text-gray-500 font-medium mt-2">Across all portfolios</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bucket Roll-Forward (Flow Rate) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6 lg:col-span-2">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity size={18} className="text-purple-600"/> Bucket Flow Rates (Roll-Forward Analysis)
          </h3>
          
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Flow Metric</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Jul '26</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Aug '26</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Sep '26 (MTD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">Standard to SMA-0 (1-30)</td>
                  <td className="py-3 px-4 text-right font-medium">8.2%</td>
                  <td className="py-3 px-4 text-right font-medium">7.9%</td>
                  <td className="py-3 px-4 text-right font-bold text-green-600">7.1%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">SMA-0 to SMA-1 (31-60)</td>
                  <td className="py-3 px-4 text-right font-medium">15.5%</td>
                  <td className="py-3 px-4 text-right font-medium">14.2%</td>
                  <td className="py-3 px-4 text-right font-bold text-orange-600">16.0%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">SMA-1 to SMA-2 (61-90)</td>
                  <td className="py-3 px-4 text-right font-medium">25.0%</td>
                  <td className="py-3 px-4 text-right font-medium">22.5%</td>
                  <td className="py-3 px-4 text-right font-bold text-red-600">28.4%</td>
                </tr>
                <tr className="hover:bg-gray-50 bg-red-50/30">
                  <td className="py-3 px-4 font-bold text-red-700">SMA-2 to NPA (90+)</td>
                  <td className="py-3 px-4 text-right font-medium text-red-700">35.2%</td>
                  <td className="py-3 px-4 text-right font-medium text-red-700">32.8%</td>
                  <td className="py-3 px-4 text-right font-black text-red-700">33.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
             <strong>Insight:</strong> Flow rate into SMA-2 is showing a slight spike this month. Focus field recovery efforts on the 31-60 DPD bucket to prevent NPA slippage.
          </div>
        </div>

      </div>
    </div>
  );
}
