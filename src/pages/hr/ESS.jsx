import React from 'react';
import { User, FileText, Download, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export default function ESS() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Workspace (ESS)</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, Amit Desai. Here is your personal hub.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center">
           <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-3xl mb-4">
             AD
           </div>
           <h2 className="text-xl font-bold text-gray-900">Amit Desai</h2>
           <p className="text-blue-600 font-bold text-sm mb-1">Operations Head</p>
           <p className="text-gray-500 text-xs mb-6">EMP-001 | Joined: 12 Jan 2024</p>
           
           <div className="w-full text-left space-y-3 pt-4 border-t border-gray-100 text-sm">
             <div className="flex justify-between">
                <span className="text-gray-500">Department</span>
                <span className="font-semibold text-gray-900">Operations</span>
             </div>
             <div className="flex justify-between">
                <span className="text-gray-500">Reporting To</span>
                <span className="font-semibold text-gray-900">National Head</span>
             </div>
             <div className="flex justify-between">
                <span className="text-gray-500">Work Location</span>
                <span className="font-semibold text-gray-900">Mumbai HQ</span>
             </div>
           </div>
           
           <button className="w-full mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200">
             Edit Personal Info
           </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
           
           {/* KPI & Leave Balances */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                 <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <Calendar size={18} className="text-purple-600"/> My Leave Balances
                 </h3>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-gray-700">Casual Leaves (CL)</span>
                      <span className="font-black text-gray-900 bg-gray-100 px-2 py-1 rounded">08</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-gray-700">Sick Leaves (SL)</span>
                      <span className="font-black text-gray-900 bg-gray-100 px-2 py-1 rounded">04</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-gray-700">Earned Leaves (EL)</span>
                      <span className="font-black text-gray-900 bg-gray-100 px-2 py-1 rounded">12</span>
                    </div>
                 </div>
                 <button className="w-full mt-4 text-xs font-bold text-blue-600 hover:underline">Apply for Leave</button>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                 <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <TrendingUp size={18} className="text-green-600"/> My Performance (YTD)
                 </h3>
                 <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                        <span>Ops Clearance SLA</span>
                        <span>94%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{width: '94%'}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                        <span>Disbursement Target</span>
                        <span>110%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width: '100%'}}></div></div>
                    </div>
                 </div>
                 <div className="mt-4 p-2 bg-green-50 text-green-800 text-xs rounded border border-green-200 font-medium flex gap-2">
                    <AlertCircle size={14} className="shrink-0" /> You are eligible for the Q3 Performance Bonus!
                 </div>
              </div>

           </div>

           {/* Documents & Payslips */}
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />
                <h3 className="font-bold text-gray-900">My Documents & Payslips</h3>
              </div>
              <div className="divide-y divide-gray-100">
                 <div className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div>
                       <p className="font-bold text-sm text-gray-900">Payslip - August 2026</p>
                       <p className="text-xs text-gray-500">Generated on 31 Aug 2026</p>
                    </div>
                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Download size={18} /></button>
                 </div>
                 <div className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div>
                       <p className="font-bold text-sm text-gray-900">Payslip - July 2026</p>
                       <p className="text-xs text-gray-500">Generated on 31 Jul 2026</p>
                    </div>
                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Download size={18} /></button>
                 </div>
                 <div className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div>
                       <p className="font-bold text-sm text-gray-900">Form 16 (FY 2025-26)</p>
                       <p className="text-xs text-gray-500">Tax Document</p>
                    </div>
                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Download size={18} /></button>
                 </div>
                 <div className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div>
                       <p className="font-bold text-sm text-gray-900">Offer Letter & Employment Contract</p>
                       <p className="text-xs text-gray-500">Onboarding Kit</p>
                    </div>
                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Download size={18} /></button>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
