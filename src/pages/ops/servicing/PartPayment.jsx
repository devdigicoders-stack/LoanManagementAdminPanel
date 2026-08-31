import React from 'react';
import { IndianRupee, Calculator, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PartPayment() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Part Payment Processing</h1>
          <p className="text-sm text-gray-500 mt-1">Accept mid-term principal reductions and recalculate EMI/Tenure.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Loan Selection & Details */}
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
                  <p className="text-xs font-semibold text-gray-500 uppercase">Current EMI</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">₹20,516</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Remaining Tenure</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">48 Months</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Processing */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
           <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <Calculator size={20} className="text-blue-600" />
            <h3 className="font-bold text-gray-900">Payment Entry</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Part Payment Amount (₹)</label>
              <input type="number" defaultValue="100000" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 font-black text-gray-900" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Impact Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                  <option>Reduce EMI (Keep Tenure)</option>
                  <option>Reduce Tenure (Keep EMI)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Mode</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                  <option>RTGS/NEFT</option>
                  <option>Cheque</option>
                  <option>UPI</option>
                </select>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
               <p className="text-xs font-bold uppercase tracking-wider mb-2">New Projected Scenario</p>
               <div className="flex justify-between items-center mb-1">
                 <span className="text-sm font-medium">New Outstanding Principal</span>
                 <span className="text-sm font-bold">₹7,45,000</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm font-medium">New EMI</span>
                 <span className="text-sm font-bold">₹18,088</span>
               </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-green-700 mt-6">
               <CheckCircle2 size={16} /> Process & Generate Receipt
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
