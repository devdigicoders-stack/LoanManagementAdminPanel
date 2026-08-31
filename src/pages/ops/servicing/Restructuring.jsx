import React from 'react';
import { Activity, TrendingDown, Save, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Restructuring() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Restructuring</h1>
          <p className="text-sm text-gray-500 mt-1">Extend tenure or reduce EMI for stressed assets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Loan Selection */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Select Loan Account</h3>
            <div className="flex gap-2">
              <input type="text" placeholder="Enter LAN (e.g. LN-1003)" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="LN-1003" />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">Search</button>
            </div>
            
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-orange-800 uppercase">Customer Name</p>
                  <p className="text-sm font-bold text-orange-900 mt-1">Meena Kumari</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-orange-800 uppercase">Current Outstanding</p>
                  <p className="text-sm font-bold text-orange-900 mt-1">₹11,45,000</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-orange-800 uppercase">Current EMI</p>
                  <p className="text-sm font-bold text-orange-900 mt-1">₹35,200</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-orange-800 uppercase">Asset Status</p>
                  <p className="text-sm font-bold text-red-600 mt-1 flex items-center gap-1">
                    SMA-1 (Stressed)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Restructuring Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
           <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <Activity size={20} className="text-blue-600" />
            <h3 className="font-bold text-gray-900">New Term Setup</h3>
          </div>
          
          <div className="p-6 space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">New Proposed Tenure (Months)</label>
                <input type="number" defaultValue="48" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">New Interest Rate (%)</label>
                <input type="number" step="0.1" defaultValue="10.5" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
               <p className="text-xs font-bold uppercase tracking-wider mb-2">Impact Analysis</p>
               <div className="flex justify-between items-center mb-1">
                 <span className="text-sm font-medium">Old EMI</span>
                 <span className="text-sm font-bold text-red-500 line-through">₹35,200</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm font-medium text-green-700 flex items-center gap-1">
                    New EMI <TrendingDown size={14}/>
                 </span>
                 <span className="text-lg font-black text-green-700">₹29,320</span>
               </div>
            </div>

            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1 mt-4">Reason for Restructuring</label>
               <textarea rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="e.g. Business loss, medical emergency..."></textarea>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 mt-6">
               <Save size={16} /> Submit for Approval
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
