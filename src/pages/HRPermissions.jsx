import React, { useState, useEffect, useMemo } from 'react';
import { 
 ShieldCheck, Users, Briefcase, UserCheck, CheckCircle2,
 RefreshCw, Loader2, Save, Layout, Layers, Info, ChevronRight,
 Sparkles, Check, X, Shield, SlidersHorizontal, ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import SearchableSelect from '../components/common/SearchableSelect';

// Specific HR Roles
const HR_ROLE_CONFIGS = [
 {
 role: 'HR Manager',
 title: ' HR Manager Permissions',
 badge: 'MANAGER LEVEL',
 badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
 description: 'Manages recruitment pipeline, oversees HR Executives, approves leaves, handles onboarding and performance tracking.',
 defaultPages: [
 'Recruitment',
 'Onboarding',
 'Attendance',
 'Leave Management',
 'Manage Employees',
 'Team & Staff',
 'Reports & Analytics',
 'Notifications'
 ]
 },
 {
 role: 'HR Executive',
 title: ' HR Executive Permissions',
 badge: 'EXECUTIVE / ZONE LEVEL',
 badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
 description: 'Handles assigned zone candidate calling, interviews, document collection, attendance, and leave requests.',
 defaultPages: [
 'Recruitment',
 'Onboarding',
 'Attendance',
 'Leave Management',
 'Notifications'
 ]
 }
];

// Available HR Modules & Sidebar Pages
const ALL_HR_MODULE_PAGES = [
 {
 name: 'Recruitment',
 label: 'Recruitment & Job Openings',
 path: '/hr/recruitment',
 description: 'Create & manage job postings, review applicants, schedule interviews and track candidate status.',
 category: 'Core Hiring'
 },
 {
 name: 'Onboarding',
 label: 'Digital Candidate Onboarding',
 path: '/hr/onboarding',
 description: 'Generate onboarding form links, verify uploaded KYC documents and process candidate joining.',
 category: 'Core Hiring'
 },
 {
 name: 'Attendance',
 label: 'Staff Attendance Desk',
 path: '/employees/attendance',
 description: 'View daily check-ins, record manual attendance logs and track executive presence.',
 category: 'Staff Operations'
 },
 {
 name: 'Leave Management',
 label: 'Leave Requests & Approvals',
 path: '/employees/leave-management',
 description: 'Approve, reject or track employee leave applications and monitor available balances.',
 category: 'Staff Operations'
 },
 {
 name: 'Manage Employees',
 label: 'Employee Directory & Profiles',
 path: '/employees',
 description: 'Full employee directory, personal details, professional history and document records.',
 category: 'Management'
 },
 {
 name: 'Team & Staff',
 label: 'Manage Subordinate Team & Staff',
 path: '/users',
 description: 'View and manage subordinate team members, assign operational zones and configure accounts.',
 category: 'Management'
 },
 {
 name: 'Payroll & Salary',
 label: 'Payroll, Salary & CTC Structure',
 path: '/hr/payroll',
 description: 'Access staff salary slips, structures, allowances, deductions and payroll processing.',
 category: 'Financial / HR'
 },
 {
 name: 'Departments',
 label: 'Company Departments & Branches',
 path: '/employees/departments',
 description: 'View and configure organizational branches, hierarchy and department charts.',
 category: 'Organizational'
 },
 {
 name: 'Reports & Analytics',
 label: 'HR Analytics & Reports',
 path: '/hr/reports',
 description: 'Access master recruitment metrics, hiring pipeline data, and executive performance analytics.',
 category: 'Analytics'
 },
 {
 name: 'Notifications',
 label: 'Company Announcements & Alerts',
 path: '/notifications',
 description: 'Publish and receive internal broadcast alerts and department notices.',
 category: 'Communication'
 }
];

export default function HRPermissions() {
 const navigate = useNavigate();

 const loggedInRole = (localStorage.getItem('userRole') || '').trim().toLowerCase();
 const cleanLoggedInRole = loggedInRole.replace(/[^a-z0-9]/g, '');
 const isHrManager = cleanLoggedInRole === 'hrmanager' || cleanLoggedInRole === 'hr_manager' || loggedInRole.includes('hr manager');
 const isHrExecutive = cleanLoggedInRole === 'hrexecutive' || cleanLoggedInRole === 'hr_executive' || cleanLoggedInRole.includes('executive');

 // HR Managers can only configure HR Executives
 const availableRoleConfigs = useMemo(() => {
 if (isHrManager) {
 return HR_ROLE_CONFIGS.filter(r => r.role === 'HR Executive');
 }
 return HR_ROLE_CONFIGS;
 }, [isHrManager]);

 const [selectedRole, setSelectedRole] = useState(isHrManager ? 'HR Executive' : 'HR Manager');
 const [admins, setAdmins] = useState([]);
 const [selectedEmployeeId, setSelectedEmployeeId] = useState('all'); // 'all' or specific employee _id
 const [currentPermissions, setCurrentPermissions] = useState([]);
 const [isSaving, setIsSaving] = useState(false);
 const [isLoading, setIsLoading] = useState(true);

 const API_URL = import.meta.env.VITE_API_BASE_URL;

 const currentRoleConfig = useMemo(() => {
 return availableRoleConfigs.find(r => r.role === selectedRole) || availableRoleConfigs[0];
 }, [selectedRole, availableRoleConfigs]);

 // Fetch all staff to filter HR Managers & HR Executives
 const fetchStaff = async () => {
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
 toast.error('Failed to load HR staff members');
 }
 } catch (err) {
 toast.error('Server error while loading staff');
 } finally {
 setIsLoading(false);
 }
 };

 useEffect(() => {
 fetchStaff();
 }, []);

 // Filter staff for selected HR role
 const staffInRole = useMemo(() => {
 return admins.filter(a => {
 const r = (a.role || '').trim().toLowerCase();
 const d = (a.designation || '').trim().toLowerCase();
 if (selectedRole === 'HR Manager') {
 return r.includes('manager') || d.includes('manager');
 }
 if (selectedRole === 'HR Executive') {
 return (r.includes('executive') || d.includes('executive')) && !r.includes('manager');
 }
 return false;
 });
 }, [admins, selectedRole]);

 // Sync permissions when role or employee changes
 useEffect(() => {
 setSelectedEmployeeId('all');
 if (staffInRole.length > 0) {
 const firstWithPerms = staffInRole.find(e => e.permissions && e.permissions.length > 0);
 setCurrentPermissions(firstWithPerms ? firstWithPerms.permissions : currentRoleConfig.defaultPages);
 } else {
 setCurrentPermissions(currentRoleConfig.defaultPages);
 }
 }, [selectedRole, staffInRole, currentRoleConfig]);

 const handleSelectEmployee = (empId) => {
 setSelectedEmployeeId(empId);
 if (empId === 'all') {
 const firstWithPerms = staffInRole.find(e => e.permissions && e.permissions.length > 0);
 setCurrentPermissions(firstWithPerms ? firstWithPerms.permissions : currentRoleConfig.defaultPages);
 } else {
 const emp = staffInRole.find(e => e._id === empId);
 if (emp) {
 setCurrentPermissions((emp.permissions && emp.permissions.length > 0) ? emp.permissions : currentRoleConfig.defaultPages);
 }
 }
 };

 const togglePermission = (pageName) => {
 setCurrentPermissions(prev =>
 prev.includes(pageName) ? prev.filter(p => p !== pageName) : [...prev, pageName]
 );
 };

 const selectAll = () => {
 setCurrentPermissions(ALL_HR_MODULE_PAGES.map(p => p.name));
 };

 const deselectAll = () => {
 setCurrentPermissions([]);
 };

 const restoreDefaults = () => {
 setCurrentPermissions(currentRoleConfig.defaultPages);
 toast.success(`Restored standard defaults for ${selectedRole}`);
 };

 const handleSave = (target = 'current') => {
 const isBroadcastToRole = target === 'role' || selectedEmployeeId === 'all';
 const activeEmployee = staffInRole.find(e => e._id === selectedEmployeeId);
 const targetTitle = isBroadcastToRole
 ? `all staff under role "${selectedRole}" (${staffInRole.length} members)`
 : `${activeEmployee?.name || 'this employee'}`;

 Swal.fire({
 title: 'Update HR Role Permissions?',
 text: `Apply these selected permissions to ${targetTitle}?`,
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

 if (isBroadcastToRole) {
 url = `${API_URL}/admin/role/${encodeURIComponent(selectedRole)}/permissions`;
 } else {
 url = `${API_URL}/admin/${selectedEmployeeId}/permissions`;
 }

 const res = await fetch(url, {
 method: 'PUT',
 headers: {
 'Content-Type': 'application/json',
 'Authorization': `Bearer ${token}`
 },
 body: JSON.stringify({ permissions: currentPermissions })
 });

 if (res.ok) {
 if (isBroadcastToRole) {
 setAdmins(prev => prev.map(a => {
 const r = (a.role || '').toLowerCase();
 const d = (a.designation || '').toLowerCase();
 const matches = selectedRole === 'HR Manager' 
 ? (r.includes('manager') || d.includes('manager'))
 : (r.includes('executive') || d.includes('executive'));
 return matches ? { ...a, permissions: currentPermissions } : a;
 }));
 toast.success(`Permissions saved for all ${selectedRole} staff!`);
 } else {
 setAdmins(prev => prev.map(a =>
 a._id === selectedEmployeeId ? { ...a, permissions: currentPermissions } : a
 ));
 toast.success(`Permissions saved for ${activeEmployee?.name}!`);
 }
 } else {
 const data = await res.json();
 toast.error(data.message || 'Failed to save permissions');
 }
 } catch (err) {
 toast.error('Server error while saving');
 } finally {
 setIsSaving(false);
 }
 }
 });
 };

 if (isHrExecutive) {
 return (
 <div className="w-full flex items-center justify-center py-28 text-center">
 <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md shadow-sm">
 <ShieldCheck size={40} className="mx-auto text-amber-500 mb-3" />
 <h2 className="text-lg font-black text-slate-800">Access Restricted</h2>
 <p className="text-xs text-slate-500 mt-2 font-medium">
 HR Executives operate under the module permissions configured by the HR Head and HR Manager.
 </p>
 <button
 onClick={() => navigate('/')}
 className="mt-5 px-4 py-2 bg-[#489b0d] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#3d820b]"
 >
 Go to Dashboard
 </button>
 </div>
 </div>
 );
 }

 return (
 <div className="w-full space-y-6 pb-14">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <div className="flex items-center gap-2 mb-1">
 <Link to="/users" className="text-slate-400 hover:text-[#489b0d] text-[12px] font-bold flex items-center gap-1 transition-colors">
 <ArrowLeft size={14} /> Team & Staff
 </Link>
 <ChevronRight size={12} className="text-slate-300" />
 <span className="text-[12px] font-bold text-[#489b0d]">HR Permissions Matrix</span>
 </div>
 <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
 <ShieldCheck className="text-[#489b0d]" size={26} />
 HR Role & Permission Controls
 </h1>
 <p className="text-[13px] text-slate-500 font-medium mt-1">
 {isHrManager 
 ? 'Configure permissions and dashboard access for HR Executives in your team.'
 : 'Define separate permissions and accessible dashboard modules for HR Manager vs HR Executive.'}
 </p>
 </div>

 <div className="flex items-center gap-3">
 {!isHrManager && (
 <Link
 to="/users/roles"
 className="h-10 px-4 flex items-center justify-center gap-2 rounded-lg border border-slate-200 text-slate-600 bg-white font-bold text-[12px] hover:bg-slate-50 transition-colors shadow-xs"
 >
 <SlidersHorizontal size={14} /> All Department Roles
 </Link>
 )}
 <button
 type="button"
 onClick={fetchStaff}
 disabled={isLoading}
 className="h-10 px-4 flex items-center justify-center gap-2 rounded-lg border border-[#489b0d] text-[#489b0d] font-bold text-[12px] hover:bg-[#489b0d]/10 transition-colors bg-white shadow-xs"
 >
 <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
 </button>
 </div>
 </div>

 {isLoading ? (
 <div className="w-full flex items-center justify-center py-28 text-slate-500 font-medium">
 <div className="flex items-center gap-3">
 <Loader2 className="w-6 h-6 animate-spin text-[#489b0d]" />
 <span>Loading HR roles and team permissions...</span>
 </div>
 </div>
 ) : (
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

 {/* ================= LEFT ROLE SELECTOR TABS ================= */}
 <div className="lg:col-span-4 space-y-4">
 <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
 <div className="border-b border-slate-100 pb-3">
 <h3 className="text-[15px] font-black text-slate-800 flex items-center gap-2">
 <Users size={18} className="text-[#489b0d]" />
 Select HR Role
 </h3>
 <p className="text-[11px] text-slate-400">Choose designation to configure access</p>
 </div>

 <div className="space-y-3">
 {availableRoleConfigs.map((item) => {
 const isSelected = selectedRole === item.role;
 const count = admins.filter(a => {
 const r = (a.role || '').toLowerCase();
 const d = (a.designation || '').toLowerCase();
 return item.role === 'HR Manager' 
 ? (r.includes('manager') || d.includes('manager'))
 : ((r.includes('executive') || d.includes('executive')) && !r.includes('manager'));
 }).length;

 return (
 <div
 key={item.role}
 onClick={() => setSelectedRole(item.role)}
 className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
 isSelected
 ? 'border-[#489b0d] bg-[#489b0d]/5 ring-2 ring-[#489b0d]/20 shadow-xs'
 : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
 }`}
 >
 <div className="flex items-start justify-between gap-2 mb-1.5">
 <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase border ${item.badgeColor}`}>
 {item.badge}
 </span>
 <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
 {count} Staff
 </span>
 </div>

 <h4 className={`text-base font-black ${isSelected ? 'text-[#489b0d]' : 'text-slate-800'}`}>
 {item.role}
 </h4>
 <p className="text-[12px] text-slate-500 font-medium mt-1 leading-snug">
 {item.description}
 </p>

 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
 <span className="text-slate-400 font-medium">Standard modules:</span>
 <span className="font-bold text-slate-700">{item.defaultPages.length} Modules</span>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Quick Tips Box */}
 <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-[12px] text-amber-900 space-y-2">
 <div className="flex items-center gap-2 font-black text-amber-950">
 <Info size={16} className="text-amber-700" /> HR Permission Hierarchy
 </div>
 <ul className="space-y-1.5 list-disc list-inside text-amber-800 font-medium text-[11px] leading-relaxed">
 <li><strong>HR Manager:</strong> Manages recruitment pipelines, onboarding approvals, team attendance & leave records.</li>
 <li><strong>HR Executive:</strong> Handles zone-specific calling, applicant interviews & document verification.</li>
 <li>Permissions update live on their next login or refresh.</li>
 </ul>
 </div>
 </div>

 {/* ================= RIGHT PERMISSION MATRIX ================= */}
 <div className="lg:col-span-8 flex flex-col">
 <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex-1 flex flex-col space-y-6">
 
 {/* Role Header Banner */}
 <div className="p-4 bg-gradient-to-r from-[#489b0d]/10 via-emerald-50 to-blue-50/30 border border-[#489b0d]/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <div className="flex items-center gap-2">
 <h3 className="text-lg font-black text-slate-900">{currentRoleConfig.title}</h3>
 <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${currentRoleConfig.badgeColor}`}>
 {currentRoleConfig.badge}
 </span>
 </div>
 <p className="text-[12px] text-slate-600 font-medium mt-0.5">
 Check or uncheck the modules to grant or revoke access for {selectedRole}.
 </p>
 </div>

 <button
 type="button"
 onClick={restoreDefaults}
 className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold transition-all shadow-2xs whitespace-nowrap cursor-pointer"
 >
 Restore Role Defaults
 </button>
 </div>

 {/* Individual Staff Selector */}
 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div>
 <label className="block text-[12px] font-black text-slate-700 mb-0.5">
 Apply Permissions To:
 </label>
 <p className="text-[11px] text-slate-400">Apply to all {selectedRole}s or customize for an individual</p>
 </div>

 <div className="min-w-[300px]">
 <SearchableSelect
 value={selectedEmployeeId}
 onChange={(e) => handleSelectEmployee(e.target.value)}
 options={[
 { value: 'all', label: ` All ${selectedRole} Staff`, sublabel: `${staffInRole.length} Members` },
 ...staffInRole.map(emp => ({
 value: emp._id,
 label: `${emp.name} ${emp.empId ? `[${emp.empId}]` : ''}`,
 sublabel: emp.email
 }))
 ]}
 placeholder="Search staff by name or ID..."
 />
 </div>
 </div>

 {/* Selection Toolbar */}
 <div className="flex items-center justify-between border-b border-slate-100 pb-3">
 <span className="text-[12px] font-bold text-slate-500">
 Enabled Modules: <strong className="text-[#489b0d]">{currentPermissions.length}</strong> / {ALL_HR_MODULE_PAGES.length}
 </span>

 <div className="flex items-center gap-3">
 <button
 type="button"
 onClick={selectAll}
 className="text-[12px] font-bold text-[#489b0d] hover:underline cursor-pointer"
 >
 Select All
 </button>
 <span className="text-slate-300">•</span>
 <button
 type="button"
 onClick={deselectAll}
 className="text-[12px] font-bold text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
 >
 Deselect All
 </button>
 </div>
 </div>

 {/* Module Checkbox Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
 {ALL_HR_MODULE_PAGES.map((mod) => {
 const isChecked = currentPermissions.includes(mod.name);
 return (
 <label
 key={mod.name}
 className={`p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all select-none ${
 isChecked
 ? 'bg-[#489b0d]/5 border-[#489b0d] ring-1 ring-[#489b0d]/20 shadow-2xs'
 : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
 }`}
 >
 <input
 type="checkbox"
 checked={isChecked}
 onChange={() => togglePermission(mod.name)}
 className="mt-1 w-4 h-4 rounded text-[#489b0d] focus:ring-[#489b0d] accent-[#489b0d] cursor-pointer shrink-0"
 />
 <div className="min-w-0 flex-1">
 <div className="flex items-center justify-between gap-2">
 <span className={`text-[13px] font-bold ${isChecked ? 'text-slate-900' : 'text-slate-700'}`}>
 {mod.label}
 </span>
 <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-mono shrink-0">
 {mod.category}
 </span>
 </div>
 <p className="text-[11px] text-slate-400 mt-1 leading-snug">
 {mod.description}
 </p>
 </div>
 </label>
 );
 })}
 </div>

 {/* Action Buttons Footer */}
 <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
 <button
 type="button"
 onClick={restoreDefaults}
 className="h-10 px-4 flex items-center justify-center gap-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-[12px] hover:bg-slate-50 transition-colors bg-white shadow-xs cursor-pointer"
 >
 <RefreshCw size={14} /> Discard Changes
 </button>

 <div className="flex items-center gap-3">
 {selectedEmployeeId !== 'all' && staffInRole.length > 1 && (
 <button
 type="button"
 onClick={() => handleSave('role')}
 disabled={isSaving}
 className="h-10 px-4 flex items-center justify-center gap-2 rounded-lg border border-[#489b0d] text-[#489b0d] font-bold text-[12px] hover:bg-[#489b0d]/10 transition-colors bg-white shadow-xs disabled:opacity-50 cursor-pointer"
 >
 <Users size={15} /> Apply to All {selectedRole}s
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
 <><Save size={16} /> Save {selectedRole} Permissions</>
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
