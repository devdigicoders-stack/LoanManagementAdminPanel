import React from 'react';
import { Users, Briefcase, Plus, CheckCircle2, ChevronRight, Search, FileText } from 'lucide-react';

const mockCandidates = [
  { id: 'CAN-101', name: 'Rajesh Kumar', role: 'Credit Manager', stage: 'Interview Round 2', applied: '05 Sep 2026', source: 'LinkedIn' },
  { id: 'CAN-102', name: 'Sneha Patel', role: 'Telecaller', stage: 'Screening', applied: '08 Sep 2026', source: 'Naukri' },
  { id: 'CAN-103', name: 'Vikram Singh', role: 'Field Executive', stage: 'Offer Rollout', applied: '01 Sep 2026', source: 'Referral' },
];

export default function Recruitment() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruitment & Hiring</h1>
          <p className="text-sm text-gray-500 mt-1">Manage job postings, candidates, interviews, and offer letters.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">
            <Plus size={16} /> Post New Job
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Briefcase size={24} /></div>
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Active Jobs</p>
             <p className="text-xl font-black text-gray-900 mt-0.5">8</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Users size={24} /></div>
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Total Candidates</p>
             <p className="text-xl font-black text-gray-900 mt-0.5">145</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><Search size={24} /></div>
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase">In Interview</p>
             <p className="text-xl font-black text-gray-900 mt-0.5">24</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle2 size={24} /></div>
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Offers Made</p>
             <p className="text-xl font-black text-gray-900 mt-0.5">12</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
               <option>All Jobs</option>
               <option>Credit Manager</option>
               <option>Telecaller</option>
               <option>Field Executive</option>
            </select>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Candidate..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Candidate</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Applied Role</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Applied On</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Source</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Current Stage</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {mockCandidates.map(c => (
                <tr key={c.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="py-3 px-4">
                     <span className="font-bold text-blue-600 block">{c.id}</span>
                     <span className="font-medium text-gray-900">{c.name}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-700">{c.role}</td>
                  <td className="py-3 px-4 text-gray-600">{c.applied}</td>
                  <td className="py-3 px-4 text-gray-500">{c.source}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                      c.stage.includes('Offer') ? 'bg-green-100 text-green-700' :
                      c.stage.includes('Screening') ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {c.stage}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right flex justify-end gap-2">
                     <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded text-xs font-bold hover:bg-gray-50">
                       <FileText size={14} /> Resume
                     </button>
                     <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700">
                       Update Stage
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
