import React from 'react';
import { FileText, Download, Printer, Search, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const closedLoans = [
  { id: 'LN-0081', customer: 'Amit Shah', closedOn: '28 Aug 2026', nocStatus: 'Generated' },
  { id: 'LN-0042', customer: 'Priya Sharma', closedOn: '30 Aug 2026', nocStatus: 'Pending' },
  { id: 'LN-0019', customer: 'Neha Gupta', closedOn: '31 Aug 2026', nocStatus: 'Pending' },
];

export default function NocGeneration() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">NOC Generation</h1>
          <p className="text-sm text-gray-500 mt-1">Issue No Objection Certificates for successfully closed loans.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search closed LAN..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">LAN</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Closed On</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">NOC Status</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {closedLoans.map(loan => (
                <tr key={loan.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-blue-600">{loan.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{loan.customer}</td>
                  <td className="py-3 px-4 text-gray-600">{loan.closedOn}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                      loan.nocStatus === 'Generated' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {loan.nocStatus === 'Generated' ? <CheckCircle2 size={12} /> : <FileText size={12} />}
                      {loan.nocStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right flex justify-end gap-2">
                    {loan.nocStatus === 'Pending' ? (
                       <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700">
                         Generate NOC
                       </button>
                    ) : (
                       <>
                         <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors" title="Print"><Printer size={16} /></button>
                         <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors" title="Download"><Download size={16} /></button>
                       </>
                    )}
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
