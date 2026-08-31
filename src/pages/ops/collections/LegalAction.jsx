import React from 'react';
import { Gavel, Scale, AlertTriangle, FileText, UploadCloud, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const cases = [
  { id: 'LN-0988', customer: 'Arjun Kapoor', amount: '₹22,00,000', court: 'Mumbai High Court', section: 'Arbitration', status: 'Hearing Scheduled', date: '15 Sep 2026' },
  { id: 'LN-1010', customer: 'Vikas Sharma', amount: '₹14,50,000', court: 'Andheri Sessions Court', section: 'Sec 138 (NIA)', status: 'Warrant Issued', date: '01 Sep 2026' },
];

export default function LegalAction() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Legal Action / Litigation</h1>
          <p className="text-sm text-gray-500 mt-1">Track court cases, advocate assignments, and hearing dates for NPA assets.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">
            <Gavel size={16} /> File New Case
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Disputed Amount</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Court / Section</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Next Hearing</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Current Status</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {cases.map(c => (
                <tr key={c.id} className="hover:bg-red-50/30 transition-colors">
                  <td className="py-3 px-4">
                     <span className="font-bold text-blue-600 block">{c.id}</span>
                     <span className="font-medium text-gray-900">{c.customer}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-red-600">{c.amount}</td>
                  <td className="py-3 px-4">
                     <span className="block font-bold text-gray-700">{c.section}</span>
                     <span className="block text-xs text-gray-500 mt-0.5">{c.court}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900">{c.date}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-orange-100 text-orange-700">
                      <Scale size={12} />
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-xs font-bold text-blue-600 hover:underline">Update Status</button>
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
