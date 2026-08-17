import { useState } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const usersData = [
  { id: 1, name: 'Admin User', email: 'admin@loanpro.com', phone: '+91 9876543210', role: 'Super Admin', status: 'Active' },
  { id: 2, name: 'John Doe', email: 'john@loanpro.com', phone: '+91 9876543211', role: 'Admin', status: 'Active' },
  { id: 3, name: 'Jane Smith', email: 'jane@loanpro.com', phone: '+91 9876543212', role: 'Employee', status: 'Active' },
  { id: 4, name: 'Michael Brown', email: 'michael@loanpro.com', phone: '+91 9876543213', role: 'Employee', status: 'Inactive' },
  { id: 5, name: 'Emily Davis', email: 'emily@loanpro.com', phone: '+91 9876543214', role: 'Employee', status: 'Active' },
];

export default function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="w-full">
      
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D2A054]/20 focus:border-[#D2A054] transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D2A054]/20 focus:border-[#D2A054] transition-all shadow-sm cursor-pointer">
            <option value="">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Employee">Employee</option>
          </select>
          <select className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D2A054]/20 focus:border-[#D2A054] transition-all shadow-sm cursor-pointer">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#D2A054] to-[#C89446] text-white rounded-xl text-[13px] font-bold hover:shadow-lg hover:shadow-[#D2A054]/30 hover:-translate-y-0.5 transition-all">
            <Plus size={16} strokeWidth={3} />
            Add User
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user) => (
                <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 text-[13px] font-bold text-slate-800">{user.name}</td>
                  <td className="py-4 px-6 text-[13px] font-medium text-slate-500">{user.email}</td>
                  <td className="py-4 px-6 text-[13px] text-slate-600 font-medium">{user.phone}</td>
                  <td className="py-4 px-6 text-[13px] font-semibold text-slate-700">{user.role}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      user.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button className="inline-flex items-center justify-center text-[12px] font-bold text-slate-600 bg-white border border-slate-200 px-4 py-1.5 rounded-lg hover:bg-slate-50 hover:text-[#D2A054] hover:border-[#D2A054]/30 transition-all shadow-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end">
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#D2A054] text-white font-bold text-sm shadow-sm shadow-[#D2A054]/20">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-sm">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-sm">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
