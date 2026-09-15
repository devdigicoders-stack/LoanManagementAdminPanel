import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronRight, Shield, ShieldCheck, ShieldAlert, Users, FileText, User, 
  Save, RefreshCw, Loader2, Search, Check, X, Phone, 
  Briefcase, UserCheck, AlertCircle, ChevronDown, CheckCircle2,
  Users2, Sparkles, SlidersHorizontal, Layers, Layout, ChevronUp,
  CreditCard, DollarSign, Crown, Network, Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { ROLE_SIDEBAR_PAGES } from '../utils/permissions';

// Role definitions with department leadership metadata
const DEPARTMENT_HEAD_ROLES = [
  {
    role: 'Admin',
    department: 'Executive Administration',
    isHead: true,
    subRoles: ['Branch Manager', 'System Administrator', 'Office Coordinator'],
    description: 'Master organizational control & all department governance'
  },
  {
    role: 'HR Admin',
    department: 'Human Resources (HR)',
    isHead: true,
    subRoles: ['HR Manager', 'HR Executive', 'Recruitment Specialist', 'Payroll Officer'],
    description: 'Leads recruitment, staff onboarding, attendance, leaves and payroll'
  },
  {
    role: 'Operation Admin',
    department: 'Operations & Processing',
    isHead: true,
    subRoles: ['Operation Manager', 'Operation Executive', 'Treasury Officer', 'Verification Executive'],
    description: 'Leads loan application processing, field & desktop verification, customer follow-ups'
  },
  {
    role: 'Credit Admin',
    department: 'Credit & Underwriting',
    isHead: true,
    subRoles: ['Credit Manager', 'Underwriter', 'Risk Analyst', 'Sanction Officer'],
    description: 'Leads credit assessment, risk evaluation, loan approvals and CIBIL checks'
  },
  {
    role: 'Accountant Admin',
    department: 'Accounts & Finance',
    isHead: true,
    subRoles: ['Chief Accountant', 'Senior Accountant', 'Cashier', 'Disbursement Officer'],
    description: 'Leads financial ledger, EMI reconciliations, expenses and collection accounting'
  },
  {
    role: 'Tele callers operator',
    department: 'Telecalling & Inside Sales',
    isHead: true,
    subRoles: ['Telecalling Team Leader', 'Telecaller Executive', 'Customer Care Executive'],
    description: 'Leads inbound lead calling, customer follow-ups, and conversion tracking'
  },
  {
    role: 'Agent operator',
    department: 'Field Sales & Verification',
    isHead: true,
    subRoles: ['Field Investigation Officer', 'Relationship Executive', 'Sales Officer'],
    description: 'Leads on-ground customer visits, physical KYC verification, and agent sourcing'
  }
];

const AUTH_LOGIN_ROLES = DEPARTMENT_HEAD_ROLES.map(d => d.role);

const normalizeStr = (str) => (str || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');

const isRoleMatch = (roleA, roleB) => {
  const a = normalizeStr(roleA);
  const b = normalizeStr(roleB);
  if (!a || !b) return false;
  if (a === b) return true;
  if ((a === 'admin' || a === 'administrator') && (b === 'admin' || b === 'administrator')) return true;
  if (a.includes('tele') && b.includes('tele')) return true;
  if (a.includes('agent') && b.includes('agent')) return true;
  if (a.includes('hr') && b.includes('hr')) return true;
  if ((a.includes('operation') || a.includes('ops')) && (b.includes('operation') || b.includes('ops'))) return true;
  if (a.includes('account') && b.includes('account')) return true;
  if (a.includes('credit') && b.includes('credit')) return true;
  return false;
};

const getRoleIcon = (role) => {
  const r = (role || '').toLowerCase();
  if (r.includes('super')) return { icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' };
  if (r === 'admin') return { icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' };
  if (r.includes('hr')) return { icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' };
  if (r.includes('credit')) return { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' };
  if (r.includes('tele')) return { icon: Phone, color: 'text-indigo-600', bg: 'bg-indigo-50' };
  if (r.includes('agent')) return { icon: UserCheck, color: 'text-orange-600', bg: 'bg-orange-50' };
  if (r.includes('sales')) return { icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' };
  if (r.includes('operation')) return { icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' };
  if (r.includes('account')) return { icon: DollarSign, color: 'text-cyan-600', bg: 'bg-cyan-50' };
  return { icon: Shield, color: 'text-slate-600', bg: 'bg-slate-50' };
};

export default function RolePermissions() {
  const [admins, setAdmins] = useState([]);
  const [selectedRole, setSelectedRole] = useState('HR Admin');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('all'); // 'all' or specific employee _id
  const [currentPermissions, setCurrentPermissions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [empSearchTerm, setEmpSearchTerm] = useState('');
  const [showOtherModules, setShowOtherModules] = useState(false);
  
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
        const filtered = Array.isArray(data) ? data.filter(a =>
          !['super admin', 'superadmin'].includes((a.role || '').toLowerCase())
        ) : [];
        setAdmins(filtered);
      } else {
        toast.error('Failed to load employee list');
      }
    } catch (err) {
      toast.error('Server error while loading employees');
    } finally {
      setIsLoading(false);
    }
  };

  const allRolesList = useMemo(() => AUTH_LOGIN_ROLES, []);

  // Filtered roles based on search
  const filteredRoles = useMemo(() => {
    if (!roleSearchTerm) return DEPARTMENT_HEAD_ROLES;
    const term = roleSearchTerm.toLowerCase();
    return DEPARTMENT_HEAD_ROLES.filter(r => 
      r.role.toLowerCase().includes(term) || 
      r.department.toLowerCase().includes(term) ||
      r.subRoles.some(sr => sr.toLowerCase().includes(term))
    );
  }, [roleSearchTerm]);

  // Active role leadership info
  const activeRoleMetadata = useMemo(() => {
    return DEPARTMENT_HEAD_ROLES.find(r => r.role === selectedRole) || {
      role: selectedRole,
      department: 'Department',
      isHead: true,
      subRoles: [],
      description: 'Department Head role'
    };
  }, [selectedRole]);

  // Employees belonging to the currently selected role
  const employeesInCurrentRole = useMemo(() => {
    if (!selectedRole) return [];
    return admins.filter(a => isRoleMatch(a.role, selectedRole));
  }, [admins, selectedRole]);

  // Filtered employees in dropdown search
  const filteredEmployeesInRole = useMemo(() => {
    if (!empSearchTerm) return employeesInCurrentRole;
    const term = empSearchTerm.toLowerCase();
    return employeesInCurrentRole.filter(e =>
      e.name?.toLowerCase().includes(term) ||
      e.email?.toLowerCase().includes(term) ||
      e.empId?.toLowerCase().includes(term)
    );
  }, [employeesInCurrentRole, empSearchTerm]);

  // Primary sidebar pages for the selected role
  const primaryRolePages = useMemo(() => {
    return ROLE_SIDEBAR_PAGES[selectedRole] || [];
  }, [selectedRole]);

  // Other departments' pages for cross-functional access
  const otherRoleCategories = useMemo(() => {
    return Object.entries(ROLE_SIDEBAR_PAGES)
      .filter(([roleName]) => roleName !== selectedRole)
      .map(([roleName, pages]) => ({ roleName, pages }));
  }, [selectedRole]);

  // When selectedRole changes, reset employee selector and load permissions
  useEffect(() => {
    const defaultPages = primaryRolePages.map(p => p.name);
    if (employeesInCurrentRole.length > 0) {
      setSelectedEmployeeId('all');
      const firstWithPerms = employeesInCurrentRole.find(e => e.permissions && e.permissions.length > 0);
      setCurrentPermissions(firstWithPerms ? firstWithPerms.permissions : defaultPages);
    } else {
      setSelectedEmployeeId('all');
      setCurrentPermissions(defaultPages);
    }
    setEmpSearchTerm('');
  }, [selectedRole, employeesInCurrentRole, primaryRolePages]);

  // When a specific employee is selected from the dropdown
  const handleSelectEmployee = (empId) => {
    setSelectedEmployeeId(empId);
    const defaultPages = primaryRolePages.map(p => p.name);
    if (empId === 'all') {
      const firstWithPerms = employeesInCurrentRole.find(e => e.permissions && e.permissions.length > 0);
      setCurrentPermissions(firstWithPerms ? firstWithPerms.permissions : defaultPages);
    } else {
      const emp = employeesInCurrentRole.find(e => e._id === empId);
      if (emp) {
        setCurrentPermissions(
          (emp.permissions && emp.permissions.length > 0)
            ? emp.permissions
            : defaultPages
        );
      }
    }
  };

  const togglePermission = (pageName) => {
    setCurrentPermissions(prev =>
      prev.includes(pageName) ? prev.filter(p => p !== pageName) : [...prev, pageName]
    );
  };

  // Toggle all pages in a group
  const toggleGroup = (pages) => {
    const pageNames = pages.map(p => p.name);
    const allSelected = pageNames.every(name => currentPermissions.includes(name));
    if (allSelected) {
      setCurrentPermissions(prev => prev.filter(p => !pageNames.includes(p)));
    } else {
      setCurrentPermissions(prev => Array.from(new Set([...prev, ...pageNames])));
    }
  };

  // Toggle all primary role pages
  const isAllPrimarySelected = useMemo(() => {
    if (primaryRolePages.length === 0) return false;
    return primaryRolePages.every(p => currentPermissions.includes(p.name));
  }, [primaryRolePages, currentPermissions]);

  const toggleAllPrimary = () => {
    const primaryNames = primaryRolePages.map(p => p.name);
    if (isAllPrimarySelected) {
      setCurrentPermissions(prev => prev.filter(p => !primaryNames.includes(p)));
    } else {
      setCurrentPermissions(prev => Array.from(new Set([...prev, ...primaryNames])));
    }
  };

  const activeEmployee = employeesInCurrentRole.find(e => e._id === selectedEmployeeId);

  const handleSave = (target = 'current') => {
    const isBroadcastToRole = target === 'role' || selectedEmployeeId === 'all';
    const targetTitle = isBroadcastToRole
      ? `all ${employeesInCurrentRole.length} employees with Department Head role "${selectedRole}"`
      : `${activeEmployee?.name || 'this employee'}`;

    Swal.fire({
      title: 'Update Leadership & Sidebar Access?',
      text: `Apply these permissions to ${targetTitle}?`,
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
          let url = '';
          let method = 'PUT';

          if (isBroadcastToRole) {
            url = `${API_URL}/admin/role/${encodeURIComponent(selectedRole)}/permissions`;
          } else {
            url = `${API_URL}/admin/${selectedEmployeeId}/permissions`;
          }

          const res = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ permissions: currentPermissions })
          });

          if (res.ok) {
            if (isBroadcastToRole) {
              setAdmins(prev => prev.map(a => 
                isRoleMatch(a.role, selectedRole)
                  ? { ...a, permissions: currentPermissions }
                  : a
              ));
              toast.success(`Sidebar pages saved for all ${selectedRole} staff!`);
            } else {
              setAdmins(prev => prev.map(a =>
                a._id === selectedEmployeeId ? { ...a, permissions: currentPermissions } : a
              ));
              toast.success(`Sidebar pages saved for ${activeEmployee?.name}!`);
            }
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
    const defaultPages = primaryRolePages.map(p => p.name);
    if (selectedEmployeeId === 'all') {
      const firstWithPerms = employeesInCurrentRole.find(e => e.permissions && e.permissions.length > 0);
      setCurrentPermissions(firstWithPerms ? firstWithPerms.permissions : defaultPages);
    } else {
      const emp = employeesInCurrentRole.find(e => e._id === selectedEmployeeId);
      setCurrentPermissions((emp && emp.permissions && emp.permissions.length > 0) ? emp.permissions : defaultPages);
    }
    toast('Changes discarded');
  };

  return (
    <div className="w-full space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="text-[#489b0d]" size={26} />
            Department Head Roles & Permissions
          </h1>
          <p className="text-[13px] text-slate-500 font-medium mt-1">
            Configure permissions for each Department Head. The Head exercises operational authority and manages subordinate staff.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/employees/departments"
            className="h-10 px-4 flex items-center justify-center gap-2 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 font-bold text-[12px] hover:bg-blue-100 transition-colors"
          >
            <Building2 size={15} /> Department Org Chart
          </Link>
          <button
            type="button"
            onClick={fetchAdmins}
            disabled={isLoading}
            className="h-10 px-4 flex items-center justify-center gap-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-[12px] hover:bg-slate-50 transition-colors bg-white shadow-xs"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh Staff List
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full flex items-center justify-center py-28 text-slate-500 font-medium">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-[#489b0d]" />
            <span>Loading roles and employee permissions...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ================= LEFT COLUMN: DEPARTMENT HEAD ROLES LIST ================= */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-fit space-y-3">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-1.5">
                  <Crown size={16} className="text-amber-500" />
                  Department Heads
                </h3>
                <p className="text-[11px] text-slate-400">Select head role to configure access</p>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                {DEPARTMENT_HEAD_ROLES.length} Heads
              </span>
            </div>

            {/* Role Search Box */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search department or head role..."
                value={roleSearchTerm}
                onChange={(e) => setRoleSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[12px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:bg-white transition-all"
              />
            </div>

            {/* Roles Buttons List */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto custom-scrollbar pr-1">
              {filteredRoles.map((item) => {
                const isSelected = selectedRole === item.role;
                const { icon: Icon, color, bg } = getRoleIcon(item.role);
                const count = admins.filter(a => isRoleMatch(a.role, item.role)).length;

                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setSelectedRole(item.role)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#489b0d] bg-[#489b0d]/5 shadow-xs ring-1 ring-[#489b0d]/30'
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'bg-[#489b0d] text-white shadow-xs' : bg + ' ' + color}`}>
                          <Icon size={16} strokeWidth={isSelected ? 2.5 : 2} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className={`text-[13px] font-bold truncate ${isSelected ? 'text-[#489b0d]' : 'text-slate-800'}`}>
                              {item.role}
                            </h4>
                            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded uppercase">
                              HEAD
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-500 truncate mt-0.5">
                            {item.department}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            Subordinates: {item.subRoles.slice(0, 2).join(', ')}...
                          </p>
                        </div>
                      </div>

                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        count > 0 
                          ? (isSelected ? 'bg-[#489b0d] text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200') 
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {count} Staff
                      </span>
                    </div>
                  </button>
                );
              })}

              {filteredRoles.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-[12px]">
                  No roles match "{roleSearchTerm}"
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: SIDEBAR PAGES PERMISSIONS ================= */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex-1 flex flex-col">

              {/* Department Head Profile Banner */}
              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-emerald-500/5 to-blue-500/5 border border-amber-200/80 rounded-xl mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-xs shrink-0">
                      <Crown size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900">{selectedRole}</h3>
                        <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded uppercase">
                          DEPARTMENT HEAD
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-600 mt-0.5">
                        Department: <span className="text-amber-800">{activeRoleMetadata.department}</span>
                      </p>
                    </div>
                  </div>

                  {/* Subordinates Managed */}
                  <div className="text-xs sm:text-right">
                    <p className="text-[11px] font-black text-slate-400 uppercase">Subordinate Roles</p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">
                      {activeRoleMetadata.subRoles.length} Managed Designations
                    </p>
                  </div>
                </div>

                {activeRoleMetadata.subRoles.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-amber-200/60 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase mr-1">Team Roles:</span>
                    {activeRoleMetadata.subRoles.map((sr, idx) => (
                      <span key={idx} className="text-[10px] font-bold px-2 py-0.5 bg-white text-slate-700 rounded border border-slate-200">
                        {sr}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Role & Employee Selector Header */}
              <div className="border-b border-slate-100 pb-5 mb-6 space-y-4">
                
                {/* Top Row: Role Title & Select All */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[15px] font-extrabold text-slate-800">
                      Sidebar Access & Privileges
                    </h3>
                    <p className="text-[12px] text-slate-500 font-medium mt-0.5">
                      Check each page to enable it in the Head and team's sidebar menu.
                    </p>
                  </div>

                  {/* Select All Checkbox for Primary Role Pages */}
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors w-fit select-none">
                    <input
                      type="checkbox"
                      checked={isAllPrimarySelected}
                      onChange={toggleAllPrimary}
                      className="rounded text-[#489b0d] focus:ring-[#489b0d] accent-[#489b0d] cursor-pointer"
                    />
                    <span className="text-[12px] font-bold text-slate-700">
                      Select All Primary Pages ({primaryRolePages.length})
                    </span>
                  </label>
                </div>

                {/* Second Row: Employee Search Dropdown */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <label className="text-[12px] font-bold text-slate-700 flex items-center gap-2">
                      <Users2 size={15} className="text-[#489b0d]" />
                      <span>Appointed Staff in this Head Role:</span>
                    </label>

                    {employeesInCurrentRole.length > 0 && (
                      <span className="text-[11px] font-medium text-slate-500">
                        {selectedEmployeeId === 'all' ? (
                          <span className="text-[#489b0d] font-bold">Applying to All {employeesInCurrentRole.length} Staff</span>
                        ) : (
                          <span>Editing Individual: <strong className="text-slate-800">{activeEmployee?.name}</strong></span>
                        )}
                      </span>
                    )}
                  </div>

                  {employeesInCurrentRole.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-8">
                        <select
                          value={selectedEmployeeId}
                          onChange={(e) => handleSelectEmployee(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all cursor-pointer"
                        >
                          <option value="all">
                            ✦ All Staff with this Head Role ({employeesInCurrentRole.length} Staff)
                          </option>
                          {filteredEmployeesInRole.map((emp) => (
                            <option key={emp._id} value={emp._id}>
                              {emp.name} {emp.empId ? `[${emp.empId}]` : ''} &mdash; ({emp.email})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Dropdown search filter */}
                      <div className="sm:col-span-4 relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Filter staff by name..."
                          value={empSearchTerm}
                          onChange={(e) => setEmpSearchTerm(e.target.value)}
                          className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-[12px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] transition-all"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 py-1 text-slate-500">
                      <AlertCircle size={16} className="text-amber-500 shrink-0" />
                      <p className="text-[12px] font-medium">
                        No employees currently appointed to <strong>"{selectedRole}"</strong>. 
                        Pre-configure pages below so new Department Heads inherit them automatically.
                      </p>
                    </div>
                  )}
                </div>

                {/* Stats Banner */}
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-1">
                  <span>
                    Enabled Sidebar Pages: <strong className="text-[#489b0d]">{primaryRolePages.filter(p => currentPermissions.includes(p.name)).length}</strong> / {primaryRolePages.length} primary
                  </span>
                  {selectedEmployeeId !== 'all' && activeEmployee && (
                    <span className="text-slate-400">
                      Selected: <strong className="text-slate-700">{activeEmployee.email}</strong>
                    </span>
                  )}
                </div>

              </div>

              {/* ================= SECTION 1: PRIMARY SIDEBAR PAGES ================= */}
              <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[580px]">
                
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Layout size={16} className="text-[#489b0d]" />
                      <h4 className="text-[14px] font-extrabold text-slate-800">
                        Primary Pages for {selectedRole}
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">
                      Ticked pages will show in employee sidebar
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {primaryRolePages.map((page, idx) => {
                      const isChecked = currentPermissions.includes(page.name);
                      return (
                        <label 
                          key={idx} 
                          className={`flex items-start gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isChecked 
                              ? 'bg-[#489b0d]/5 border-[#489b0d]/50 text-slate-800 shadow-2xs ring-1 ring-[#489b0d]/20' 
                              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(page.name)}
                            className="mt-1 rounded text-[#489b0d] focus:ring-[#489b0d] accent-[#489b0d] cursor-pointer shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-[13px] font-bold ${isChecked ? 'text-slate-900' : 'text-slate-600'}`}>
                                {page.name}
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-mono shrink-0">
                                {page.path}
                              </span>
                            </div>
                            <p className="text-[11px] font-medium text-slate-400 mt-1 leading-snug">
                              {page.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* ================= SECTION 2: CROSS-DEPARTMENTAL ACCESS ================= */}
                <div className="pt-2 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setShowOtherModules(prev => !prev)}
                    className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers size={16} className="text-slate-600" />
                      <div>
                        <h4 className="text-[13px] font-bold text-slate-800">
                          Cross-Departmental Privileges (Optional)
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Grant additional access to other departments' pages (e.g. Sales, Operations, Accounts)
                        </p>
                      </div>
                    </div>
                    {showOtherModules ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </button>

                  {showOtherModules && (
                    <div className="mt-4 space-y-4 pl-1 animate-in fade-in duration-200">
                      {otherRoleCategories.map((cat, catIdx) => {
                        const isCatAllSelected = cat.pages.every(p => currentPermissions.includes(p.name));
                        return (
                          <div key={catIdx} className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/70">
                            
                            {/* Category Header */}
                            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-200/60">
                              <div className="flex items-center gap-2.5">
                                <input
                                  type="checkbox"
                                  checked={isCatAllSelected}
                                  onChange={() => toggleGroup(cat.pages)}
                                  className="rounded text-[#489b0d] focus:ring-[#489b0d] accent-[#489b0d] cursor-pointer"
                                />
                                <h5 className="text-[13px] font-bold text-slate-700">
                                  {cat.roleName} Pages
                                </h5>
                              </div>
                              <span className="text-[11px] font-semibold text-slate-400">
                                {cat.pages.filter(p => currentPermissions.includes(p.name)).length} / {cat.pages.length} enabled
                              </span>
                            </div>

                            {/* Category Pages Checkboxes */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-6">
                              {cat.pages.map((page, pIdx) => {
                                const isChecked = currentPermissions.includes(page.name);
                                return (
                                  <label 
                                    key={pIdx} 
                                    className={`flex items-start gap-2.5 p-2 rounded-lg border text-left cursor-pointer transition-all ${
                                      isChecked 
                                        ? 'bg-[#489b0d]/5 border-[#489b0d]/40 text-slate-800' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => togglePermission(page.name)}
                                      className="mt-0.5 rounded text-[#489b0d] focus:ring-[#489b0d] accent-[#489b0d] cursor-pointer shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <span className="text-[12px] font-bold block leading-tight">{page.name}</span>
                                      <span className="text-[10px] text-slate-400 block font-mono">{page.path}</span>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

              {/* Bottom Footer Actions */}
              <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="h-10 px-4 flex items-center justify-center gap-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-[12px] hover:bg-slate-50 transition-colors bg-white shadow-xs cursor-pointer"
                >
                  <RefreshCw size={14} /> Discard Changes
                </button>

                <div className="flex items-center gap-3">
                  {selectedEmployeeId !== 'all' && employeesInCurrentRole.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleSave('role')}
                      disabled={isSaving}
                      className="h-10 px-4 flex items-center justify-center gap-2 rounded-lg border border-[#489b0d] text-[#489b0d] font-bold text-[12px] hover:bg-[#489b0d]/10 transition-colors bg-white shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      <Users size={15} /> Apply to All in {selectedRole}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSave('current')}
                    disabled={isSaving}
                    className="h-10 px-6 flex items-center justify-center gap-2 rounded-lg bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm disabled:opacity-70 cursor-pointer"
                  >
                    {isSaving ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</>
                    ) : (
                      <><Save size={16} /> Save Leadership Permissions</>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}
