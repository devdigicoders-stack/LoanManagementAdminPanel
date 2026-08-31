import React, { useState } from 'react';
import { Search, Filter, FileText, ChevronRight, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockApps = [
  { id: 'APP-8001', customer: 'Ramesh Patel', amount: '₹2,50,000', stage: 'Data Collection', status: 'Pending', assigned: 'Suresh K.', date: '31 Aug 2026' },
  { id: 'APP-8002', customer: 'Priya Sharma', amount: '₹45,00,000', stage: 'Verification', status: 'In Process', assigned: 'Meena R.', date: '30 Aug 2026' },
  { id: 'APP-8003', customer: 'Amit Kumar', amount: '₹15,00,000', stage: 'Underwriting', status: 'Hold', assigned: 'Vikram S.', date: '29 Aug 2026' },
  { id: 'APP-8004', customer: 'Neha Gupta', amount: '₹1,00,000', stage: 'Approval', status: 'Approved', assigned: 'System', date: '28 Aug 2026' },
  { id: 'APP-8005', customer: 'Rajesh Singh', amount: '₹8,50,000', stage: 'Disbursement', status: 'Completed', assigned: 'Finance', date: '27 Aug 2026' },
];

export default function Applications() {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completed': 
      case 'Approved': return <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>;
      case 'In Process': return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>;
      case 'Hold': return <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>;
      case 'Pending': return <span className="bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>;
      default: return <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const getStageColor = (stage) => {
    switch(stage) {
      case 'Data Collection': return 'text-purple-600 bg-purple-50';
      case 'Verification': return 'text-orange-600 bg-orange-50';
      case 'Underwriting': return 'text-indigo-600 bg-indigo-50';
      case 'Approval': return 'text-green-600 bg-green-50';
      case 'Disbursement': return 'text-emerald-600 bg-emerald-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">LOS Applications</h1>
          <p className="text-sm text-gray-500 mt-1">Master view of all applications flowing through the origination pipeline.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by App ID, Customer..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 text-gray-600">
          <option value="">All Stages</option>
          <option value="Data Collection">Data Collection</option>
          <option value="Verification">Verification</option>
          <option value="Underwriting">Underwriting</option>
          <option value="Approval">Approval</option>
          <option value="Disbursement">Disbursement</option>
        </select>
        <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 text-gray-600">
          <option value="">Status</option>
          <option value="In Process">In Process</option>
          <option value="Hold">Hold</option>
          <option value="Pending">Pending</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">App ID</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stage</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockApps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                  <td className="py-4 px-4 text-sm font-bold text-blue-600">{app.id}</td>
                  <td className="py-4 px-4 font-bold text-gray-900 text-sm">{app.customer}</td>
                  <td className="py-4 px-4 font-black text-gray-800 text-sm">{app.amount}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded uppercase tracking-wider border border-transparent ${getStageColor(app.stage)}`}>
                      {app.stage}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-700">{app.assigned}</td>
                  <td className="py-4 px-4 text-sm text-gray-500 font-medium">{app.date}</td>
                  <td className="py-4 px-4 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); alert(`Opening LOS processing view for application ${app.id} at stage: ${app.stage}`); }}
                      className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                    >
                      Process <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
