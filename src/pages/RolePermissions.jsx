import { ChevronRight, Shield, ShieldAlert, Users, FileText, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RolePermissions() {
  const roles = [
    { id: 'super_admin', name: 'Super Admin', desc: 'Full system access', icon: Shield, active: true, color: 'text-[#489b0d]', bg: 'bg-emerald-50' },
    { id: 'admin', name: 'Admin', desc: 'Manage system operations', icon: ShieldAlert, active: false, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'manager', name: 'Manager', desc: 'Manage team and loans', icon: Users, active: false, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'loan_officer', name: 'Loan Officer', desc: 'Handle loan applications', icon: FileText, active: false, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'employee', name: 'Employee', desc: 'Basic system access', icon: User, active: false, color: 'text-slate-500', bg: 'bg-slate-50' },
  ];

  const permissions = [
    {
      module: 'User Management',
      actions: ['Manage Users', 'Manage Employees', 'Role & Permission Management']
    },
    {
      module: 'Lead Management',
      actions: ['Lead Management', 'Assign Lead to Employee', 'Status Management']
    },
    {
      module: 'Loan Management',
      actions: ['Loan Applications', 'Approve / Reject / Hold']
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Role & Permissions</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <Link to="/users" className="hover:text-[#489b0d] transition-colors">User Management</Link>
            <ChevronRight size={14} className="mx-1" />
            <Link to="/users" className="hover:text-[#489b0d] transition-colors">Manage Users</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-slate-800">Role & Permissions</span>
          </div>
        </div>
        
        <Link to="/users" className="px-4 py-2 border border-slate-200 text-slate-600 rounded-md text-[13px] font-bold hover:bg-slate-50 transition-colors bg-white shadow-sm flex items-center gap-2">
           &larr; Back to Users
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Select Role */}
        <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 h-fit">
          <h3 className="text-[15px] font-bold text-slate-800 mb-6">Select Role</h3>
          
          <div className="space-y-3">
            {roles.map((role) => (
              <button 
                key={role.id}
                className={`w-full flex items-center gap-4 p-3 rounded-md border text-left transition-all ${
                  role.active 
                    ? 'border-[#489b0d] bg-[#489b0d]/5 shadow-sm' 
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${role.active ? 'bg-white shadow-sm text-[#489b0d]' : role.bg + ' ' + role.color}`}>
                  <role.icon size={18} strokeWidth={role.active ? 2.5 : 2} />
                </div>
                <div>
                  <h4 className={`text-[13px] font-bold ${role.active ? 'text-slate-800' : 'text-slate-700'}`}>{role.name}</h4>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">{role.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Permissions Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-[15px] font-bold text-slate-800">Permissions for Super Admin</h3>
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" defaultChecked className="peer appearance-none w-4 h-4 border border-slate-300 rounded hover:border-[#489b0d] checked:bg-[#489b0d] checked:border-[#489b0d] transition-colors cursor-pointer" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-[12px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors">Select All</span>
              </label>
            </div>

            <div className="space-y-8">
              {permissions.map((group, idx) => (
                <div key={idx}>
                  <h4 className="text-[13px] font-bold text-[#489b0d] mb-4">{group.module}</h4>
                  <div className="space-y-4 pl-1">
                    {group.actions.map((action, actionIdx) => (
                      <label key={actionIdx} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input type="checkbox" defaultChecked className="peer appearance-none w-4 h-4 border border-slate-300 rounded hover:border-[#489b0d] checked:bg-[#489b0d] checked:border-[#489b0d] transition-colors cursor-pointer" />
                          <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span className="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{action}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
              <Link to="/users" className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-md text-[13px] font-bold hover:bg-slate-50 transition-colors">
                Cancel
              </Link>
              <button className="px-6 py-2.5 bg-[#489b0d] text-white rounded-md text-[13px] font-bold hover:bg-[#3e850b] transition-colors shadow-sm">
                Save Permissions
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
