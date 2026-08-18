import React from 'react';
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const mockRoles = [
  { id: 1, name: 'Super Admin', desc: 'Full access to all modules', users: 2, status: 'Active' },
  { id: 2, name: 'Admin', desc: 'Manage systems and settings', users: 5, status: 'Active' },
  { id: 3, name: 'Branch Manager', desc: 'Manage branch operations', users: 8, status: 'Active' },
  { id: 4, name: 'Loan Officer', desc: 'Manage loan applications', users: 32, status: 'Active' },
  { id: 5, name: 'Sales Executive', desc: 'Generate leads and follow up', users: 26, status: 'Active' },
  { id: 6, name: 'Verification Officer', desc: 'Verify documents and details', users: 16, status: 'Active' },
  { id: 7, name: 'Collection Executive', desc: 'Handle collections and follow ups', users: 12, status: 'Active' },
  { id: 8, name: 'Customer Support', desc: 'Customer support and queries', users: 8, status: 'Inactive' },
];

export default function EmployeeRoles() {
  return (
    <div className="w-full space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Roles & Permissions</h1>
          <p className="text-[13px] text-slate-500 font-medium">Manage roles and their access permissions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#489b0d] text-white rounded-md text-[12px] font-bold hover:bg-[#3e850b] transition-colors shadow-sm">
          <Plus size={16} /> Add Role
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase">Role Name</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase">Description</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase text-center">Total Users</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockRoles.map((role) => (
                <tr key={role.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 text-[13px] font-bold text-slate-800">{role.name}</td>
                  <td className="py-4 px-6 text-[12px] font-medium text-slate-500">{role.desc}</td>
                  <td className="py-4 px-6 text-[13px] font-bold text-slate-700 text-center">{role.users}</td>
                  <td className="py-4 px-6">
                    {role.status === 'Active' ? (
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
