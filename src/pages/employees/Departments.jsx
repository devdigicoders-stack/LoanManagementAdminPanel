import React from 'react';
import { Building2, Users, Network, Plus, ChevronRight, Settings } from 'lucide-react';

const mockDepartments = [
  { id: 'DEPT-01', name: 'Operations & Processing', head: 'Amit Desai', headRole: 'Ops Head', headcount: 45, budget: '₹1.2 Cr', status: 'Active' },
  { id: 'DEPT-02', name: 'Sales & Origination', head: 'Vikram Singh', headRole: 'National Head', headcount: 120, budget: '₹3.5 Cr', status: 'Active' },
  { id: 'DEPT-03', name: 'Credit & Underwriting', head: 'Sneha Rao', headRole: 'Credit Admin', headcount: 15, budget: '₹85 L', status: 'Active' },
  { id: 'DEPT-04', name: 'Human Resources', head: 'Priya Sharma', headRole: 'HR Head', headcount: 8, budget: '₹40 L', status: 'Active' },
];

export default function Departments() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments & Hierarchy</h1>
          <p className="text-sm text-gray-500 mt-1">Manage organizational structure, reporting lines, and department heads.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">
            <Plus size={16} /> Create Department
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Building2 size={24} /></div>
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Total Departments</p>
             <p className="text-xl font-black text-gray-900 mt-0.5">8</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Users size={24} /></div>
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Total Headcount</p>
             <p className="text-xl font-black text-gray-900 mt-0.5">245</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 cursor-pointer hover:border-blue-300 transition-colors">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Network size={24} /></div>
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Org Chart</p>
             <p className="text-sm font-bold text-blue-600 mt-0.5 flex items-center gap-1">View Hierarchy <ChevronRight size={14}/></p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Department ID</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Department Name</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Department Head</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-center">Headcount</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Annual Budget</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {mockDepartments.map(dept => (
                <tr key={dept.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-blue-600">{dept.id}</td>
                  <td className="py-4 px-4 font-bold text-gray-900">{dept.name}</td>
                  <td className="py-4 px-4">
                     <span className="font-bold text-gray-900 block">{dept.head}</span>
                     <span className="text-xs text-gray-500">{dept.headRole}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                     <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded font-bold">{dept.headcount}</span>
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-gray-700">{dept.budget}</td>
                  <td className="py-4 px-4 text-right flex justify-end gap-2">
                     <button className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 rounded transition-colors" title="Manage Roles">
                       <Settings size={18} />
                     </button>
                     <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded text-xs font-bold hover:bg-gray-50">
                       View Members
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
