import React from 'react';
import { Activity, ShieldCheck, AlertTriangle, TrendingDown, RefreshCw, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreditScoring() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="font-medium text-blue-600 cursor-pointer" onClick={() => navigate('/ops/los/applications')}>APP-8001</span>
            <ChevronRight size={14} />
            <span>Credit Scoring</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Credit Score & Risk Assessment</h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50">
            <RefreshCw size={16} /> Fetch Latest Bureau Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">Submit Risk Profile</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Score Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-4">CIBIL Score</h3>
            
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-gray-100" />
                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" strokeDasharray="502" strokeDashoffset="120" className="text-green-500" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-gray-900">745</span>
                <span className="text-sm font-bold text-green-600 uppercase tracking-widest mt-1">Excellent</span>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between text-xs font-bold text-gray-400">
              <span>300 (Poor)</span>
              <span>900 (Excellent)</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Risk Flags</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                <ShieldCheck size={20} />
                <span className="font-medium">No recent defaults found</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <AlertTriangle size={20} />
                <span className="font-medium">High credit utilization (65%)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                <CheckCircle2 size={20} />
                <span className="font-medium">Address matches bureau record</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Credit History Details</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase">Active Accounts</p>
                <p className="text-2xl font-black text-gray-900 mt-1">4</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase">Total Outstanding</p>
                <p className="text-xl font-black text-gray-900 mt-1">₹3.2L</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase">Recent Inquiries (6m)</p>
                <p className="text-2xl font-black text-gray-900 mt-1">2</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase">Credit Age</p>
                <p className="text-xl font-black text-gray-900 mt-1">4y 2m</p>
              </div>
            </div>

            <h4 className="font-bold text-sm text-gray-700 mb-3 border-b border-gray-100 pb-2">Active Loans</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-200">
                    <th className="py-2 px-3 text-xs font-bold text-gray-500 uppercase">Lender</th>
                    <th className="py-2 px-3 text-xs font-bold text-gray-500 uppercase">Loan Type</th>
                    <th className="py-2 px-3 text-xs font-bold text-gray-500 uppercase">Sanctioned</th>
                    <th className="py-2 px-3 text-xs font-bold text-gray-500 uppercase">Outstanding</th>
                    <th className="py-2 px-3 text-xs font-bold text-gray-500 uppercase">EMI (₹)</th>
                    <th className="py-2 px-3 text-xs font-bold text-gray-500 uppercase">DPD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  <tr>
                    <td className="py-3 px-3 font-medium text-gray-900">HDFC Bank</td>
                    <td className="py-3 px-3 text-gray-600">Credit Card</td>
                    <td className="py-3 px-3 text-gray-600">₹1,50,000</td>
                    <td className="py-3 px-3 font-medium text-red-600">₹95,000</td>
                    <td className="py-3 px-3 text-gray-600">-</td>
                    <td className="py-3 px-3">
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">0</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium text-gray-900">Bajaj Finserv</td>
                    <td className="py-3 px-3 text-gray-600">Consumer Durable</td>
                    <td className="py-3 px-3 text-gray-600">₹45,000</td>
                    <td className="py-3 px-3 font-medium text-red-600">₹12,000</td>
                    <td className="py-3 px-3 text-gray-600">₹2,500</td>
                    <td className="py-3 px-3">
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">0</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Risk Assessor Remarks</h3>
            <textarea 
              rows="3" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter analysis of credit history..."
              defaultValue="Customer has a solid repayment history. The high utilization is on a single credit card, but no defaults are recorded in the last 24 months. Acceptable risk."
            ></textarea>
          </div>

        </div>

      </div>
    </div>
  );
}
