import React from 'react';
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const mockDesignations = [
  { id: 1, name: 'Loan Officer', dept: 'Loan Department', employees: 15, status: 'Active' },
  { id: 2, name: 'Sales Executive', dept: 'Sales Department', employees: 20, status: 'Active' },
  { id: 3, name: 'Verification Officer', dept: 'Operations', employees: 12, status: 'Active' },
  { id: 4, name: 'Collection Executive', dept: 'Collections', employees: 10, status: 'Active' },
  { id: 5, name: 'Relationship Manager', dept: 'Loan Department', employees: 8, status: 'Active' },
  { id: 6, name: 'Customer Support', dept: 'Support Department', employees: 10, status: 'Inactive' },
  { id: 7, name: 'Accountant', dept: 'Finance Department', employees: 4, status: 'Active' },
  { id: 8, name: 'System Administrator', dept: 'Admin Department', employees: 2, status: 'Active' },
];

export default function Designations() {
  return (
    <div className="w-full space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Designations</h1>
          <p className="text-[13px] text-slate-500 font-medium">Manage all employee designations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#489b0d] text-white rounded-md text-[12px] font-bold hover:bg-[#3e850b] transition-colors shadow-sm">
          <Plus size={16} /> Add Designation
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase">Designation Name</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase">Department</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase text-center">Total Employees</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockDesignations.map((desig) => (
                <tr key={desig.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 text-[13px] font-bold text-slate-800">{desig.name}</td>
                  <td className="py-4 px-6 text-[12px] font-medium text-slate-500">{desig.dept}</td>
                  <td className="py-4 px-6 text-[13px] font-bold text-slate-700 text-center">{desig.employees}</td>
                  <td className="py-4 px-6">
                    {desig.status === 'Active' ? (
                      <span className="text-[11px] font-bold text-[#489b0d]">Active</span>
                    ) : (
                      <span className="text-[11px] font-bold text-red-500">Inactive</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-[#489b0d] transition-colors"><Edit2 size={16}/></button>
                      <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-center bg-white">
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">
              <ChevronLeft size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#489b0d] text-white font-bold text-[13px] shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">2</button>
            <span className="px-1 text-slate-400 text-[13px]">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
