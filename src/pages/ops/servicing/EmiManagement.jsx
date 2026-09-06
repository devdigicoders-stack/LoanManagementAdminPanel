import React from 'react';
import { IndianRupee, Search, CheckCircle2, AlertCircle, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockEmis = [];

export default function EmiManagement() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">EMI & Repayment Tracking</h1>
          <p className="text-sm text-gray-500 mt-1">Track NACH mandates, received EMIs, and bounces.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">
            <IndianRupee size={16} /> Record Manual Payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Clock size={24} /></div>
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Expected</p>
             <p className="text-xl font-black text-gray-900 mt-0.5">₹0</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle2 size={24} /></div>
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Received</p>
             <p className="text-xl font-black text-green-600 mt-0.5">₹0</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg"><AlertCircle size={24} /></div>
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Bounced / Pending</p>
             <p className="text-xl font-black text-red-600 mt-0.5">₹0</p>
          </div>
        </div>
      </div>

      {/* EMI Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-blue-500">
               <option>All Status</option>
               <option>Received</option>
               <option>Bounced</option>
               <option>Upcoming</option>
            </select>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search LAN or Customer..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">LAN</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Due Date</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">EMI Amount</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Method</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {mockEmis.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    <Clock className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    <p className="font-semibold text-gray-700">No EMI records found</p>
                    <p className="text-xs text-gray-400 mt-0.5">Scheduled EMIs will appear here once loans are disbursed.</p>
                  </td>
                </tr>
              ) : (
                mockEmis.map((emi, i) => (
                  <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-blue-600">{emi.id}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{emi.customer}</td>
                    <td className="py-3 px-4 text-gray-600">{emi.dueDate}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{emi.amount}</td>
                    <td className="py-3 px-4 text-gray-600">{emi.method}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                        emi.status === 'Received' ? 'bg-green-100 text-green-700' : 
                        emi.status === 'Bounced' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {emi.status === 'Received' && <CheckCircle2 size={12} />}
                        {emi.status === 'Bounced' && <AlertCircle size={12} />}
                        {emi.status === 'Upcoming' && <Clock size={12} />}
                        {emi.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-xs font-bold text-blue-600 hover:underline">View Ledger</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
