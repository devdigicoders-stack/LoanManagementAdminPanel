import React from 'react';
import { IndianRupee, Send, CheckCircle2, ChevronRight, FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Disbursement() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="font-medium text-blue-600 cursor-pointer" onClick={() => navigate('/ops/los/applications')}>APP-8001</span>
            <ChevronRight size={14} />
            <span>Disbursement</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Fund Transfer & Closure</h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50">
             Hold Payout
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-green-700">
            <Send size={16} /> Process NEFT / RTGS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Deductions & Calculation */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900">Disbursement Calculation</h3>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Sanctioned Loan Amount</span>
                <span className="text-lg font-bold text-gray-900">₹10,00,000</span>
              </div>
              
              <div className="py-4 space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Upfront Deductions</h4>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Processing Fee (1.5%)</span>
                  <span className="text-sm font-medium text-red-600">- ₹15,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">GST on Processing Fee (18%)</span>
                  <span className="text-sm font-medium text-red-600">- ₹2,700</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Documentation & Stamp Duty</span>
                  <span className="text-sm font-medium text-red-600">- ₹2,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pre-EMI Interest (Till 5th of next month)</span>
                  <span className="text-sm font-medium text-red-600">- ₹1,850</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Insurance Premium (Credit Shield)</span>
                  <span className="text-sm font-medium text-red-600">- ₹12,000</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-4 border-t-2 border-gray-200 mt-2 bg-green-50 px-4 -mx-6 mb-[-24px]">
                <span className="font-bold text-green-900">Final Net Disbursement Amount</span>
                <span className="text-2xl font-black text-green-700">₹9,65,950</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Bank Details & Action */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Customer Bank Details</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Beneficiary Name</p>
                <p className="text-sm font-bold text-gray-900 mt-1">Ramesh Kumar Patel</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Bank Name</p>
                <p className="text-sm font-bold text-gray-900 mt-1">HDFC Bank Ltd.</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Account Number</p>
                <p className="text-sm font-bold text-blue-600 mt-1 font-mono tracking-wider">50100123456789</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">IFSC Code</p>
                <p className="text-sm font-bold text-gray-900 mt-1 font-mono">HDFC0001234</p>
              </div>
              
              <div className="flex items-start gap-2 bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-100 mt-4">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <p className="text-xs font-medium">Bank account has been successfully verified via Penny Drop (₹1 test).</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-gray-500" />
                <span className="text-sm font-bold text-gray-700">Download Payment Advice</span>
              </div>
              <Download size={16} className="text-gray-400" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
