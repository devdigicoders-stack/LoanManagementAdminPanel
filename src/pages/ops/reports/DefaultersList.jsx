import React from 'react';
import { Search, Download, Filter, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const defaulters = [
  { id: 'LN-0988', customer: 'Arjun Kapoor', product: 'Business Loan', amount: '₹22,00,000', dpd: 135, stage: 'Litigation', branch: 'Mumbai' },
  { id: 'LN-1010', customer: 'Vikas Sharma', product: 'Home Loan', amount: '₹14,50,000', dpd: 110, stage: 'Legal Notice', branch: 'Delhi' },
  { id: 'LN-1055', customer: 'Sanjay Dutt', product: 'Personal Loan', amount: '₹12,45,000', dpd: 95, stage: 'Field Recovery', branch: 'Pune' },
  { id: 'LN-1088', customer: 'Kiran Desai', product: 'Auto Loan', amount: '₹8,50,000', dpd: 150, stage: 'Settlement Processing', branch: 'Surat' },
  { id: 'LN-1102', customer: 'Rajinikanth M', product: 'Business Loan', amount: '₹45,00,000', dpd: 210, stage: 'SARFAESI', branch: 'Chennai' },
];

export default function DefaultersList() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Severe Defaulters List</h1>
          <p className="text-sm text-gray-500 mt-1">Master table of all 90+ DPD accounts requiring urgent action.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">
            <Download size={16} /> Export to Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
             <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search Customer or LAN..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-blue-500">
               <option>All Branches</option>
               <option>Mumbai</option>
               <option>Delhi</option>
               <option>Chennai</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50">
            <Filter size={16} /> Advanced Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">LAN</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Branch</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Product</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Principal Due</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">DPD</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Action Stage</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {defaulters.map((item, i) => (
                <tr key={i} className="hover:bg-red-50/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-blue-600">{item.id}</td>
                  <td className="py-3 px-4 font-bold text-gray-900">{item.customer}</td>
                  <td className="py-3 px-4 text-gray-600">{item.branch}</td>
                  <td className="py-3 px-4 text-gray-600">{item.product}</td>
                  <td className="py-3 px-4 font-bold text-red-600">{item.amount}</td>
                  <td className="py-3 px-4 font-black text-red-700">{item.dpd}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200">
                      {item.stage}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-gray-400 hover:text-blue-600 p-1">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600 bg-gray-50">
          <span>Showing 1 to 5 of 124 Defaulters</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100">Prev</button>
            <button className="px-3 py-1 border border-blue-600 rounded bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
