import React from 'react';
import { ShieldCheck, CheckCircle2, ChevronRight, XCircle, FileText, Send, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Approval() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="font-medium text-blue-600 cursor-pointer" onClick={() => navigate('/ops/los/applications')}>APP-8001</span>
            <ChevronRight size={14} />
            <span>Final Approval</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sanction / Reject Loan</h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-bold shadow-sm hover:bg-red-100">
            <XCircle size={16} /> Reject Loan
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-green-700">
            <CheckCircle2 size={16} /> Sanction Loan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Summary & Checks */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Application Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Customer Name</p>
                <p className="text-sm font-bold text-gray-900 mt-1">Ramesh Patel</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Loan Type</p>
                <p className="text-sm font-bold text-gray-900 mt-1">Home Loan</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Requested Amount</p>
                <p className="text-sm font-bold text-gray-900 mt-1">₹10,00,000</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">CIBIL Score</p>
                <p className="text-sm font-bold text-green-600 mt-1">745</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Clearance Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'KYC & Identity Verification', status: 'Passed', icon: UserCheck, color: 'text-green-600 bg-green-50' },
                { label: 'Field Verification (Home)', status: 'Passed', icon: ShieldCheck, color: 'text-green-600 bg-green-50' },
                { label: 'Income & FOIR Underwriting', status: 'Passed (FOIR: 42%)', icon: ShieldCheck, color: 'text-green-600 bg-green-50' },
                { label: 'Legal & Technical Valuation', status: 'Cleared', icon: FileText, color: 'text-green-600 bg-green-50' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded ${item.color}`}>
                      <item.icon size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-green-700 px-2 py-0.5 rounded-full bg-green-50">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Sanction Input */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Final Sanction Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Sanctioned Amount (₹)</label>
                <input type="number" defaultValue="1000000" className="w-full px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 font-black text-blue-700" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Interest Rate (% p.a)</label>
                <input type="number" step="0.1" defaultValue="8.5" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-bold" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tenure (Months)</label>
                <input type="number" defaultValue="60" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-bold" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Final EMI (₹)</label>
                <input type="number" defaultValue="20516" disabled className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm font-bold text-gray-600" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 mt-4">Approver Remarks</label>
                <textarea 
                  rows="3" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Notes for the customer or internal team..."
                  defaultValue="All verifications clear. FOIR is within acceptable limits. Sanctioning requested amount."
                ></textarea>
              </div>

              <button className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 mt-4">
                <Send size={16} /> Send Offer to Customer
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
