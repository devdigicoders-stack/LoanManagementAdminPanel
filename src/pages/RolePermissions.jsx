import React, { useState, useEffect } from 'react';
import { ChevronRight, Shield, ShieldAlert, Users, FileText, User, Save, RefreshCw, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

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
    actions: ['View Loan Applications', 'Approve/Reject/Hold Loan', 'Verify Documents', 'Download Documents']
  },
  {
    module: 'Reports & Analytics',
    actions: ['View Reports', 'Export Data', 'Payroll/Salary', 'Send Reminders/SMS']
  }
];

const allActions = permissionModules.flatMap(m => m.actions);

const getRoleIcon = (role) => {
  const r = (role || '').toLowerCase();
  if (r.includes('super')) return { icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50' };
  if (r.includes('hr')) return { icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' };
  if (r.includes('credit')) return { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' };
  if (r.includes('sales')) return { icon: Users, color: 'text-amber-500', bg: 'bg-amber-50' };
  if (r.includes('operation')) return { icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50' };
  if (r.includes('account')) return { icon: FileText, color: 'text-cyan-500', bg: 'bg-cyan-50' };
  if (r.includes('tele')) return { icon: User, color: 'text-slate-500', bg: 'bg-slate-50' };
  return { icon: User, color: 'text-gray-500', bg: 'bg-gray-50' };
};

export default function RolePermissions() {
  const [admins, setAdmins] = useState([]);
  const [activeAdminId, setActiveAdminId] = useState(null);
  const [currentPermissions, setCurrentPermissions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL}`;

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Exclude Super Admin from the list (no need to manage their permissions)
        const filteredAdmins = data.filter(a =>
          !['Super Admin', 'superadmin'].includes(a.role)
        );
        setAdmins(filteredAdmins);
        if (filteredAdmins.length > 0) {
          setActiveAdminId(filteredAdmins[0]._id);
          setCurrentPermissions(filteredAdmins[0].permissions || []);
        }
      } else {
        toast.error('Failed to load admins');
      }
    } catch (err) {
      toast.error('Server error while loading admins');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAdmin = (admin) => {
    setActiveAdminId(admin._id);
    setCurrentPermissions(admin.permissions || []);
  };

  const togglePermission = (action) => {
    setCurrentPermissions(prev =>
      prev.includes(action) ? prev.filter(p => p !== action) : [...prev, action]
    );
  };

  const toggleGroup = (groupActions) => {
    const allSelected = groupActions.every(a => currentPermissions.includes(a));
    if (allSelected) {
      setCurrentPermissions(prev => prev.filter(p => !groupActions.includes(p)));
    } else {
      setCurrentPermissions(prev => Array.from(new Set([...prev, ...groupActions])));
    }
  };

  const toggleAll = () => {
    if (currentPermissions.length === allActions.length) {
      setCurrentPermissions([]);
    } else {
      setCurrentPermissions([...allActions]);
    }
  };

  const handleSave = () => {
    const activeAdmin = admins.find(a => a._id === activeAdminId);
    Swal.fire({
      title: 'Update Permissions?',
      text: `Save permissions for ${activeAdmin?.name || 'this admin'}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#489b0d',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Yes, Save'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSaving(true);
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_URL}/admin/${activeAdminId}/permissions`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ permissions: currentPermissions })
          });

          if (res.ok) {
            // Update local admin list
            setAdmins(prev => prev.map(a =>
              a._id === activeAdminId ? { ...a, permissions: currentPermissions } : a
            ));
            toast.success(`Permissions saved for ${activeAdmin?.name}!`);
          } else {
            const data = await res.json();
            toast.error(data.message || 'Failed to save permissions');
          }
        } catch (err) {
          toast.error('Server error while saving permissions');
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const handleReset = () => {
    const activeAdmin = admins.find(a => a._id === activeAdminId);
    setCurrentPermissions(activeAdmin?.permissions || []);
    toast.success('Changes discarded.');
  };

  const isAllSelected = currentPermissions.length === allActions.length;
  const activeAdmin = admins.find(a => a._id === activeAdminId);

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Role & Permissions</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <Link to="/users" className="hover:text-[#489b0d] transition-colors">User Management</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-slate-800 font-bold">Permission Management</span>
          </div>
        </div>
        <Link to="/users" className="h-10 px-4 border border-slate-200 text-slate-600 rounded-lg text-[13px] font-bold hover:bg-slate-50 transition-colors bg-white shadow-sm flex items-center justify-center gap-2">
          &larr; Back to Users
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#489b0d]" />
        </div>
      ) : admins.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
          <Shield size={40} className="mb-3 text-slate-300" />
          <p className="font-semibold text-slate-700">No sub-admins found</p>
          <p className="text-sm mt-1">Add employees with admin roles to manage their permissions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">

          {/* Left Column - Admin List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit">
            <h3 className="text-[15px] font-bold text-slate-800 mb-4">Select Admin</h3>
            <p className="text-[11px] text-slate-400 mb-4">Click on an admin to manage their permissions.</p>
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {admins.map((admin) => {
                const isActive = admin._id === activeAdminId;
                const { icon: Icon, color, bg } = getRoleIcon(admin.role);
                const grantedCount = (admin.permissions || []).length;
                return (
                  <button
                    key={admin._id}
                    onClick={() => handleSelectAdmin(admin)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                      isActive
                        ? 'border-[#489b0d] bg-[#489b0d]/5 shadow-sm'
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isActive ? 'bg-white shadow-sm text-[#489b0d]' : bg + ' ' + color}`}>
                      <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className={`text-[13px] font-bold truncate ${isActive ? 'text-slate-800' : 'text-slate-700'}`}>{admin.name}</h4>
                      <p className="text-[11px] font-medium text-slate-500 truncate">{admin.role}</p>
                    </div>
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${grantedCount > 0 ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                      {grantedCount}
                    </span>
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
                  <h3 className="text-[16px] font-extrabold text-slate-800">
                    Permissions for <span className="text-[#489b0d]">{activeAdmin?.name}</span>
                  </h3>
                  <p className="text-[12px] font-medium text-slate-500 mt-1">
                    Role: <span className="font-bold text-slate-700">{activeAdmin?.role}</span> &mdash; Email: {activeAdmin?.email}
                  </p>
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
                  <span className="text-[12px] font-bold text-slate-700">Select All</span>
                </label>
              </div>

              <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                {permissionModules.map((group, idx) => {
                  const groupActions = group.actions;
                  const isGroupSelected = groupActions.every(a => currentPermissions.includes(a));
                  const isGroupIndeterminate = groupActions.some(a => currentPermissions.includes(a)) && !isGroupSelected;

                  return (
                    <div key={idx} className="bg-slate-50/50 p-5 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative flex items-center justify-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isGroupSelected}
                            onChange={() => toggleGroup(groupActions)}
                            ref={input => { if (input) input.indeterminate = isGroupIndeterminate; }}
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

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  onClick={handleReset}
                  className="h-10 px-5 flex items-center justify-center gap-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors"
                >
                  <RefreshCw size={14} /> Discard
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
      )}
    </div>
  );
}
