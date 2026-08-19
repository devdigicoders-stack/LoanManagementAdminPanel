import React, { useState } from 'react';
import { ChevronRight, Shield, ShieldAlert, Users, FileText, User, Save, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const initialRoles = [
  { id: 'super_admin', name: 'Super Admin', desc: 'Full system access', icon: Shield, color: 'text-[#489b0d]', bg: 'bg-emerald-50' },
  { id: 'admin', name: 'Admin', desc: 'Manage system operations', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'manager', name: 'Manager', desc: 'Manage team and loans', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'loan_officer', name: 'Loan Officer', desc: 'Handle loan applications', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'employee', name: 'Employee', desc: 'Basic system access', icon: User, color: 'text-slate-500', bg: 'bg-slate-50' },
];

const permissionModules = [
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
    actions: ['Loan Applications', 'Approve / Reject / Hold', 'Manage Documents']
  },
  {
    module: 'Reports & Analytics',
    actions: ['View Reports', 'Export Data']
  }
];

// Initial mock state for role permissions
const initialRolePermissions = {
  'super_admin': ['Manage Users', 'Manage Employees', 'Role & Permission Management', 'Lead Management', 'Assign Lead to Employee', 'Status Management', 'Loan Applications', 'Approve / Reject / Hold', 'Manage Documents', 'View Reports', 'Export Data'],
  'admin': ['Manage Users', 'Manage Employees', 'Lead Management', 'Assign Lead to Employee', 'Status Management', 'Loan Applications', 'View Reports'],
  'manager': ['Lead Management', 'Assign Lead to Employee', 'Loan Applications', 'Approve / Reject / Hold', 'View Reports'],
  'loan_officer': ['Lead Management', 'Loan Applications', 'Manage Documents'],
  'employee': ['View Reports']
};

export default function RolePermissions() {
  const [activeRoleId, setActiveRoleId] = useState('super_admin');
  const [rolePermissions, setRolePermissions] = useState(initialRolePermissions);
  const [isSaving, setIsSaving] = useState(false);

  const activeRole = initialRoles.find(r => r.id === activeRoleId);
  const currentPermissions = rolePermissions[activeRoleId] || [];

  const allActions = permissionModules.flatMap(m => m.actions);
  const isAllSelected = currentPermissions.length === allActions.length;

  const togglePermission = (action) => {
    setRolePermissions(prev => {
      const perms = prev[activeRoleId] || [];
      const newPerms = perms.includes(action) 
        ? perms.filter(p => p !== action)
        : [...perms, action];
      return { ...prev, [activeRoleId]: newPerms };
    });
  };

  const toggleAll = () => {
    setRolePermissions(prev => {
      const newPerms = isAllSelected ? [] : [...allActions];
      return { ...prev, [activeRoleId]: newPerms };
    });
  };

  const handleSave = () => {
    Swal.fire({
      title: 'Update Permissions?',
      text: `Are you sure you want to save the new permissions for ${activeRole.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#489b0d',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Yes, Save Changes'
    }).then((result) => {
      if (result.isConfirmed) {
        setIsSaving(true);
        setTimeout(() => {
          setIsSaving(false);
          toast.success(`${activeRole.name} permissions updated successfully!`);
        }, 800);
      }
    });
  };

  const handleReset = () => {
    setRolePermissions(prev => ({
      ...prev,
      [activeRoleId]: initialRolePermissions[activeRoleId] || []
    }));
    toast.success("Changes discarded.");
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Role & Permissions</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <Link to="/users" className="hover:text-[#489b0d] transition-colors">User Management</Link>
            <ChevronRight size={14} className="mx-1" />
            <Link to="/users" className="hover:text-[#489b0d] transition-colors">Manage Users</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-slate-800 font-bold">Role & Permissions</span>
          </div>
        </div>
        
        <Link to="/users" className="h-10 px-4 border border-slate-200 text-slate-600 rounded-lg text-[13px] font-bold hover:bg-slate-50 transition-colors bg-white shadow-sm flex items-center justify-center gap-2">
           &larr; Back to Users
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Left Column - Select Role */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit">
          <h3 className="text-[15px] font-bold text-slate-800 mb-6">Select Role</h3>
          
          <div className="space-y-3">
            {initialRoles.map((role) => {
              const isActive = role.id === activeRoleId;
              return (
                <button 
                  key={role.id}
                  onClick={() => setActiveRoleId(role.id)}
                  className={`w-full flex items-center gap-4 p-3 rounded-lg border text-left transition-all ${
                    isActive 
                      ? 'border-[#489b0d] bg-[#489b0d]/5 shadow-sm' 
                      : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isActive ? 'bg-white shadow-sm text-[#489b0d]' : role.bg + ' ' + role.color}`}>
                    <role.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <div>
                    <h4 className={`text-[13px] font-bold ${isActive ? 'text-slate-800' : 'text-slate-700'}`}>{role.name}</h4>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">{role.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column - Permissions Matrix */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex-1 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 mb-6 gap-4">
              <div>
                <h3 className="text-[16px] font-extrabold text-slate-800">Permissions for <span className="text-[#489b0d]">{activeRole.name}</span></h3>
                <p className="text-[12px] font-medium text-slate-500 mt-1">Select the modules and actions this role can access.</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer group bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100 hover:bg-slate-100 transition-colors w-fit">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={isAllSelected}
                    onChange={toggleAll}
                    className="peer appearance-none w-4 h-4 border border-slate-300 rounded hover:border-[#489b0d] checked:bg-[#489b0d] checked:border-[#489b0d] transition-colors cursor-pointer" 
                  />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-[12px] font-bold text-slate-700 transition-colors">Select All Permissions</span>
              </label>
            </div>

            <div className="space-y-8 flex-1 overflow-y-auto pr-2">
              {permissionModules.map((group, idx) => {
                const groupActions = group.actions;
                const isGroupSelected = groupActions.every(a => currentPermissions.includes(a));
                const isGroupIndeterminate = groupActions.some(a => currentPermissions.includes(a)) && !isGroupSelected;

                const toggleGroup = () => {
                  setRolePermissions(prev => {
                    const perms = prev[activeRoleId] || [];
                    let newPerms;
                    if (isGroupSelected) {
                      newPerms = perms.filter(p => !groupActions.includes(p));
                    } else {
                      newPerms = Array.from(new Set([...perms, ...groupActions]));
                    }
                    return { ...prev, [activeRoleId]: newPerms };
                  });
                };

                return (
                  <div key={idx} className="bg-slate-50/50 p-5 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative flex items-center justify-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={isGroupSelected}
                          onChange={toggleGroup}
                          ref={input => {
                            if (input) input.indeterminate = isGroupIndeterminate;
                          }}
                          className={`peer appearance-none w-4 h-4 border rounded hover:border-[#489b0d] transition-colors cursor-pointer ${isGroupSelected || isGroupIndeterminate ? 'bg-[#489b0d] border-[#489b0d]' : 'border-slate-300'}`} 
                        />
                        {isGroupSelected && (
                          <svg className="absolute w-3 h-3 text-white pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        )}
                        {isGroupIndeterminate && (
                          <div className="absolute w-2 h-0.5 bg-white pointer-events-none rounded-full"></div>
                        )}
                      </div>
                      <h4 className="text-[14px] font-extrabold text-slate-800">{group.module}</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 pl-7">
                      {group.actions.map((action, actionIdx) => {
                        const isChecked = currentPermissions.includes(action);
                        return (
                          <label key={actionIdx} className="flex items-center gap-3 cursor-pointer group w-fit">
                            <div className="relative flex items-center justify-center">
                              <input 
                                type="checkbox" 
                                checked={isChecked}
                                onChange={() => togglePermission(action)}
                                className="peer appearance-none w-4 h-4 border border-slate-300 rounded hover:border-[#489b0d] checked:bg-[#489b0d] checked:border-[#489b0d] transition-colors cursor-pointer" 
                              />
                              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{action}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                onClick={handleReset}
                className="h-10 px-5 flex items-center justify-center gap-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors"
              >
                <RefreshCw size={14} /> Discard Changes
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="h-10 px-6 flex items-center justify-center gap-2 rounded-lg bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm disabled:opacity-70"
              >
                {isSaving ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Saving...</>
                ) : (
                  <><Save size={16} /> Save Permissions</>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
