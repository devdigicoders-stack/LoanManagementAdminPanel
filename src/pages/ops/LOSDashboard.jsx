import React, { useState } from 'react';
import { Search, Filter, FileText, CheckCircle, Clock, AlertCircle, FileSignature, Wallet } from 'lucide-react';

const mockLoans = [];


const stages = [
  { name: 'Data Collection', icon: FileText, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Document Verification', icon: CheckCircle, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'Underwriting & Scoring', icon: AlertCircle, color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'Approval & Legal Docs', icon: FileSignature, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { name: 'Disbursements', icon: Wallet, color: 'bg-green-50 text-green-700 border-green-200' },
];

export default function LOSDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Origination System (LOS)</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the complete lifecycle of loan applications from collection to disbursement.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search loans..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
        {stages.map((stage) => {
          const stageLoans = mockLoans.filter(l => l.stage === stage.name);
          const Icon = stage.icon;
          
          return (
            <div key={stage.name} className="flex-none w-[320px]">
              <div className={`flex items-center justify-between p-3 rounded-t-xl border border-b-0 ${stage.color}`}>
                <div className="flex items-center gap-2">
                  <Icon size={18} />
                  <h3 className="font-semibold text-sm">{stage.name}</h3>
                </div>
                <span className="bg-white/60 px-2 py-0.5 rounded-full text-xs font-bold">
                  {stageLoans.length}
                </span>
              </div>
              
              <div className="bg-gray-100/50 border border-gray-200 rounded-b-xl p-3 min-h-[350px] flex flex-col gap-3">
                {stageLoans.length === 0 ? (
                  <div className="py-12 text-center text-xs text-gray-400 font-medium">No applications</div>
                ) : stageLoans.map((loan) => (
                  <div key={loan.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{loan.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        loan.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                        loan.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {loan.priority}
                      </span>
                    </div>
                    
                    <h4 className="font-bold text-gray-900">{loan.customer}</h4>
                    <p className="text-xs text-gray-500 font-medium mb-3">{loan.type}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="font-bold text-gray-900">₹{loan.amount}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={12} /> {loan.date}
                      </div>
                    </div>
                  </div>
                ))}
                
                {stageLoans.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <p className="text-sm font-medium">No loans in this stage</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
