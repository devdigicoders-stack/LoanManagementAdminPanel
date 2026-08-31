import React from 'react';
import { Handshake, IndianRupee, CheckCircle2, ChevronRight, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settlement() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settlement (Compromise)</h1>
          <p className="text-sm text-gray-500 mt-1">Process one-time settlements (OTS) for NPA assets via haircut.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Loan Selection */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Select NPA Account</h3>
            <div className="flex gap-2">
              <input type="text" placeholder="Enter LAN (e.g. LN-1088)" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="LN-1088" />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">Search</button>
            </div>
            
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-red-800 uppercase">Customer Name</p>
                  <p className="text-sm font-bold text-red-900 mt-1">Kiran Desai</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-800 uppercase">Total Outstanding (POS + Int)</p>
                  <p className="text-sm font-bold text-red-900 mt-1">₹8,50,000</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-800 uppercase">Penalties & Bounce Charges</p>
                  <p className="text-sm font-bold text-red-900 mt-1">₹45,000</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-800 uppercase">Asset Status</p>
                  <p className="text-sm font-bold text-red-600 mt-1 flex items-center gap-1">
                    NPA (150 DPD)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settlement Calculator */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
           <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <Handshake size={20} className="text-green-600" />
            <h3 className="font-bold text-gray-900">OTS Calculator (Haircut)</h3>
          </div>
          
          <div className="p-6 space-y-4">
            
            <div>
               <div className="flex justify-between items-center mb-1">
                 <label className="block text-sm font-semibold text-gray-700">Proposed Settlement Amount (₹)</label>
                 <span className="text-xs text-gray-500 font-bold">Total Dues: ₹8,95,000</span>
               </div>
               <input type="number" defaultValue="600000" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg font-black text-gray-900 focus:ring-2 focus:ring-green-500" />
            </div>

            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
               <p className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">Loss Analysis</p>
               <div className="flex justify-between items-center mb-2">
                 <span className="text-sm font-medium">Principal Waiver</span>
                 <span className="text-sm font-bold text-red-600">₹0 (0%)</span>
               </div>
               <div className="flex justify-between items-center mb-2">
                 <span className="text-sm font-medium">Interest Waiver</span>
                 <span className="text-sm font-bold text-red-600">₹2,50,000 (100%)</span>
               </div>
               <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                 <span className="text-sm font-medium">Total Haircut / Loss</span>
                 <span className="text-lg font-black text-red-600">₹2,95,000 (32.9%)</span>
               </div>
            </div>

            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1 mt-4">Justification for Waiver</label>
               <textarea rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="e.g. Customer has lost job, willing to pay principal component..."></textarea>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-bold shadow-sm hover:bg-red-100">
                 <XCircle size={16} /> Reject Deal
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-green-700">
                 <CheckCircle2 size={16} /> Send to Credit Head
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
