import React from 'react';
import { FileText, Send, Printer, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const accounts = [
  { id: 'LN-1055', customer: 'Sanjay Dutt', amount: '₹12,45,000', dpd: '95 Days', noticeType: 'Section 138 (Cheque Bounce)', status: 'Pending Generation' },
  { id: 'LN-1012', customer: 'Riya Sen', amount: '₹4,50,000', dpd: '110 Days', noticeType: 'Loan Recall Notice', status: 'Notice Sent (14 Days left)' },
  { id: 'LN-0988', customer: 'Arjun Kapoor', amount: '₹22,00,000', dpd: '135 Days', noticeType: 'Arbitration Notice', status: 'Notice Sent (Expired)' },
];

export default function LegalNotice() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Legal Notice Generation</h1>
          <p className="text-sm text-gray-500 mt-1">Generate and dispatch official notices for severe defaulters (90+ DPD).</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
               <option>All Notice Types</option>
               <option>Section 138</option>
               <option>Recall Notice</option>
               <option>Arbitration</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">LAN / Customer</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Outstanding</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Notice Type</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {accounts.map(acc => (
                <tr key={acc.id} className="hover:bg-red-50/50 transition-colors">
                  <td className="py-3 px-4">
                     <span className="font-bold text-blue-600 block">{acc.id}</span>
                     <span className="font-medium text-gray-900">{acc.customer}</span>
                  </td>
                  <td className="py-3 px-4">
                     <span className="font-bold text-red-600 block">{acc.amount}</span>
                     <span className="text-xs text-gray-500">({acc.dpd})</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-700">{acc.noticeType}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                      acc.status.includes('Pending') ? 'bg-orange-100 text-orange-700' :
                      acc.status.includes('Expired') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {acc.status.includes('Pending') ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                      {acc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right flex justify-end gap-2">
                    {acc.status.includes('Pending') ? (
                       <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700">
                         <FileText size={14} /> Generate & Send
                       </button>
                    ) : (
                       <>
                         <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-bold hover:bg-gray-200 border border-gray-200">
                           Mark Delivered
                         </button>
                         <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors" title="Print Notice"><Printer size={16} /></button>
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
