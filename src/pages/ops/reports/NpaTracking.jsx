import React from 'react';
import { Download, AlertTriangle, TrendingDown, RefreshCcw } from 'lucide-react';

export default function NpaTracking() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">NPA Tracking</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor Non-Performing Assets and Recovery Pipelines.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50">
            <Download size={16} /> Export Detailed NPA Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl border border-red-200 shadow-sm ring-1 ring-red-50">
          <p className="text-xs font-bold text-red-500 uppercase">Gross NPA (Total)</p>
          <p className="text-3xl font-black text-red-600 mt-1">₹17.3 Cr</p>
          <p className="text-sm text-red-500 font-bold mt-2">4.2% of Total AUM</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Provisions Made</p>
          <p className="text-3xl font-black text-gray-900 mt-1">₹8.5 Cr</p>
          <p className="text-sm text-gray-500 font-medium mt-2">50% Provision Coverage</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-green-200 shadow-sm">
          <p className="text-xs font-bold text-green-700 uppercase">Net NPA</p>
          <p className="text-3xl font-black text-green-600 mt-1">₹8.8 Cr</p>
          <p className="text-sm text-green-700 font-bold mt-2">2.1% of Total AUM</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm">
          <p className="text-xs font-bold text-blue-700 uppercase">Recoveries / Upgrades</p>
          <p className="text-3xl font-black text-blue-600 mt-1">₹1.2 Cr</p>
          <p className="text-sm text-blue-600 font-bold mt-2 flex items-center gap-1"><TrendingDown size={14}/> This Month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* NPA Aging */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <AlertTriangle size={18} className="text-orange-500"/> NPA Aging Analysis
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                <span>Sub-Standard (90-365 Days)</span>
                <span>₹12.5 Cr (72%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-orange-500 h-2.5 rounded-full" style={{width: '72%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                <span>Doubtful 1 (1 - 3 Years)</span>
                <span>₹3.2 Cr (18%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-red-500 h-2.5 rounded-full" style={{width: '18%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                <span>Doubtful 2 (3+ Years)</span>
                <span>₹1.1 Cr (6%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-red-700 h-2.5 rounded-full" style={{width: '6%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                <span>Loss Assets (Written Off)</span>
                <span>₹0.5 Cr (4%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-black h-2.5 rounded-full" style={{width: '4%'}}></div></div>
            </div>
          </div>
        </div>

        {/* Recovery Pipeline */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <RefreshCcw size={18} className="text-blue-600"/> Recovery Action Pipeline
          </h3>
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-2 text-xs font-bold text-gray-500 uppercase">Action Stage</th>
                  <th className="py-2 px-2 text-xs font-bold text-gray-500 uppercase text-right">Accounts</th>
                  <th className="py-2 px-2 text-xs font-bold text-gray-500 uppercase text-right">Amount stuck</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                <tr>
                  <td className="py-3 px-2 font-bold text-gray-900">Hard Field Recovery</td>
                  <td className="py-3 px-2 text-right font-medium">450</td>
                  <td className="py-3 px-2 text-right font-bold text-gray-900">₹4.5 Cr</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 font-bold text-gray-900">Legal Notice Sent</td>
                  <td className="py-3 px-2 text-right font-medium">124</td>
                  <td className="py-3 px-2 text-right font-bold text-gray-900">₹3.2 Cr</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 font-bold text-gray-900">Active Litigation</td>
                  <td className="py-3 px-2 text-right font-medium">85</td>
                  <td className="py-3 px-2 text-right font-bold text-gray-900">₹5.1 Cr</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 font-bold text-gray-900">Settlement (OTS) Processing</td>
                  <td className="py-3 px-2 text-right font-medium">32</td>
                  <td className="py-3 px-2 text-right font-bold text-green-600">₹1.8 Cr</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 font-bold text-gray-900">SARFAESI / Asset Seizure</td>
                  <td className="py-3 px-2 text-right font-medium">15</td>
                  <td className="py-3 px-2 text-right font-bold text-red-600">₹2.7 Cr</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
