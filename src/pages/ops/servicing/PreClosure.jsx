import React from 'react';
import { IndianRupee, Lock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PreClosure() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pre-Closure / Foreclosure</h1>
          <p className="text-sm text-gray-500 mt-1">Calculate final settlement amount and close active loans early.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Loan Selection */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Select Loan Account</h3>
            <div className="flex gap-2">
              <input type="text" placeholder="Enter LAN (e.g. LN-1001)" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="LN-1001" />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">Search</button>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Customer Name</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">Ramesh Patel</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Current Outstanding</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">₹8,45,000</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Lock-in Period Status</p>
                  <p className="text-sm font-bold text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Cleared (12+ Mo)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
           <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <IndianRupee size={20} className="text-blue-600" />
            <h3 className="font-bold text-gray-900">Foreclosure Calculator</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Principal Outstanding</span>
                <span className="font-medium text-gray-900">₹8,45,000</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Interest till date (Current Month)</span>
                <span className="font-medium text-gray-900">₹4,250</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Foreclosure Charges (2% + GST)</span>
                <span className="font-medium text-red-600">₹19,942</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Unpaid Penalties / Bounces</span>
                <span className="font-medium text-red-600">₹0</span>
              </div>
              
              <div className="flex justify-between items-center py-4 border-t-2 border-gray-200 mt-2 bg-blue-50 px-4 -mx-6 mb-[-24px]">
                <span className="font-bold text-blue-900">Total Settlement Amount</span>
                <span className="text-2xl font-black text-blue-700">₹8,69,192</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200">
             <div className="flex items-center gap-3 mb-4 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <AlertTriangle size={20} className="shrink-0" />
                <span>Closing this loan will stop all future NACH mandates and mark the asset as closed in the ledger.</span>
             </div>
             
             <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-red-700">
                <Lock size={16} /> Confirm Payment & Close Loan
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
