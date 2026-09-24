import { ChevronRight, Save, User, Shield, MapPin, Building2, Lock, Phone, Mail, CheckCircle2, ArrowLeft, Info, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import SearchableSelect from '../components/common/SearchableSelect';

export default function AddUser() {
 const navigate = useNavigate();
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [managers, setManagers] = useState([]);

 // Logged-in admin/user role context
 const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
 const storedRole = localStorage.getItem('userRole') || currentUser.role || 'Admin';
 const roleLower = storedRole.toLowerCase();
 const isMasterAdmin = ['super admin', 'superadmin', 'admin'].includes(roleLower);
 const isHRHead = ['hr head', 'hr_head', 'hr admin', 'hradmin'].includes(roleLower) || (currentUser.designation || '').toLowerCase().includes('hr head');
 const isHRManager = ['hr manager', 'hr_manager'].includes(roleLower) || (currentUser.designation || '').toLowerCase().includes('hr manager');

 // Dynamic initial role based on creator
 const defaultRole = isHRHead ? 'HR Manager' : (isHRManager ? 'HR Executive' : 'HR Head');

 const [formData, setFormData] = useState({
 name: '',
 email: '',
 phone: '',
 password: '',
 confirmPassword: '',
 role: defaultRole,
 designation: defaultRole,
 department: 'HR & Recruitment',
 zone: isHRHead || isMasterAdmin ? 'ALL' : 'NORTH',
 reportingManagerId: '',
 reportsToHeadName: '',
 status: 'Active',
 remarks: ''
 });

 // Dynamic Role Options based on who is logged in
 // Dynamic Role Options based on who is logged in
 const ROLE_OPTIONS = (() => {
 if (isHRHead) {
 return [
 { role: 'HR Manager', label: ' HR Manager (HR Team Leader)', dept: 'HR & Recruitment', zone: 'ALL' },
 { role: 'HR Executive', label: ' HR Executive (Zone-Wise Recruiter)', dept: 'HR & Recruitment', zone: 'NORTH' },
 { role: 'RRM', label: ' RRM (Regional Reporting Manager - Zone Head)', dept: 'Sales & Loans', zone: 'NORTH' },
 { role: 'ARM', label: ' ARM (Area Reporting Manager)', dept: 'Sales & Loans', zone: 'NORTH' },
 { role: 'RM', label: ' RM (Reporting Manager)', dept: 'Sales & Loans', zone: 'NORTH' },
 { role: 'RO', label: ' RO / RE (Relationship Officer / Field Staff)', dept: 'Sales & Loans', zone: 'NORTH' },
 { role: 'Telecaller', label: ' Telecaller (Lead Verification)', dept: 'Sales & Loans', zone: 'ALL' }
 ];
 }
 if (isHRManager || !isMasterAdmin) {
 return [
 { role: 'HR Executive', label: ' HR Executive (Zone-Wise Recruiter)', dept: 'HR & Recruitment', zone: 'NORTH' },
 { role: 'RRM', label: ' RRM (Regional Reporting Manager - Zone Head)', dept: 'Sales & Loans', zone: 'NORTH' },
 { role: 'ARM', label: ' ARM (Area Reporting Manager)', dept: 'Sales & Loans', zone: 'NORTH' },
 { role: 'RM', label: ' RM (Reporting Manager)', dept: 'Sales & Loans', zone: 'NORTH' },
 { role: 'RO', label: ' RO / RE (Relationship Officer / Field Staff)', dept: 'Sales & Loans', zone: 'NORTH' },
 { role: 'Telecaller', label: ' Telecaller (Lead Verification)', dept: 'Sales & Loans', zone: 'ALL' }
 ];
 }
 // SuperAdmin / Admin options
 return [
 { role: 'Sales Head', label: ' Sales Head (National Sales Commander)', dept: 'Sales & Loans', zone: 'ALL' },
 { role: 'RRM', label: ' RRM (Regional Reporting Manager - 1 Per Zone)', dept: 'Sales & Loans', zone: 'NORTH' },
 { role: 'ARM', label: ' ARM (Area Reporting Manager - 3 Per RRM)', dept: 'Sales & Loans', zone: 'NORTH' },
 { role: 'RM', label: ' RM (Reporting Manager - 5 Per ARM)', dept: 'Sales & Loans', zone: 'NORTH' },
 { role: 'RO', label: ' RO / RE (Relationship Officer - 25 Per RM)', dept: 'Sales & Loans', zone: 'NORTH' },
 { role: 'Telecaller', label: ' Telecaller (Lead Calling & Verification)', dept: 'Sales & Loans', zone: 'ALL' },
 { role: 'Operation Manager', label: '️ Operation Manager / Operations Head', dept: 'Operations', zone: 'ALL' },
 { role: 'HR Head', label: ' HR Head (Central / Pan-India HR Authority)', dept: 'HR & Recruitment', zone: 'ALL' },
 { role: 'HR Manager', label: ' HR Manager (HR Team Manager)', dept: 'HR & Recruitment', zone: 'ALL' },
 { role: 'HR Executive', label: ' HR Executive (Zone-Wise Recruiter)', dept: 'HR & Recruitment', zone: 'NORTH' },
 { role: 'Credit Head', label: ' Credit Head (Underwriting Lead)', dept: 'Credit & Underwriting', zone: 'ALL' },
 { role: 'Accounts Head', label: ' Accounts Head (Finance Lead)', dept: 'Accounts & Finance', zone: 'ALL' },
 { role: 'admin', label: '️ System Admin (Admin Access)', dept: 'Administration', zone: 'ALL' }
 ];
 })();


 useEffect(() => {
 fetchPotentialManagers();
 }, [formData.zone, formData.department]);

 const fetchPotentialManagers = async () => {
 try {
 const token = localStorage.getItem('token');
 const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users?type=staff`, {
 headers: { 'Authorization': `Bearer ${token}` }
 });
 if (res.ok) {
 const data = await res.json();
 const list = Array.isArray(data) ? data : (data.users || []);
 const eligible = list.filter(u => 
 u.isDepartmentHead || 
 (u.role || '').toLowerCase().includes('head') || 
 (u.role || '').toLowerCase().includes('manager') ||
 (u.role || '').toLowerCase().includes('admin')
 );
 setManagers(eligible);
 }
 } catch (err) {
 console.error('Error fetching managers:', err);
 }
 };

 const HR_MODULE_PERMISSIONS = [
 { name: 'Recruitment', label: 'Recruitment & Job Openings', desc: 'Create/manage job postings & candidate hiring pipeline' },
 { name: 'Onboarding', label: 'Digital Onboarding', desc: 'Manage shortlisted candidate documents & verification' },
 { name: 'Attendance', label: 'Attendance Desk', desc: 'View staff check-ins, logs & biometric status' },
 { name: 'Leave Management', label: 'Leave Approvals', desc: 'Approve or reject leave requests' },
 { name: 'Payroll & Salary', label: 'Payroll & Compensation', desc: 'Access staff salary slips, structures & payroll generation' },
 { name: 'Manage Employees', label: 'Employee Directory', desc: 'View staff profiles, contact info and departments' },
 { name: 'Team & Staff', label: 'Manage Sub-Team', desc: 'Create & manage assigned subordinates' },
 { name: 'Reports & Analytics', label: 'HR Analytics & Reports', desc: 'Access HR reports, headcount, and hiring analytics' },
 { name: 'Notifications', label: 'Company Announcements', desc: 'Post and view company-wide notifications' },
 ];

 const getDefaultPermissionsForRole = (r) => {
 if (r === 'HR Manager') {
 return ['Recruitment', 'Onboarding', 'Attendance', 'Leave Management', 'Manage Employees', 'Team & Staff', 'Reports & Analytics', 'Notifications'];
 }
 if (r === 'HR Executive') {
 return ['Recruitment', 'Onboarding', 'Attendance', 'Leave Management', 'Notifications'];
 }
 return ['Recruitment', 'Onboarding', 'Attendance', 'Leave Management', 'Payroll & Salary', 'Manage Employees', 'Team & Staff', 'Reports & Analytics', 'Notifications'];
 };

 const [selectedPermissions, setSelectedPermissions] = useState(getDefaultPermissionsForRole(defaultRole));

 const togglePermission = (permName) => {
 setSelectedPermissions(prev => 
 prev.includes(permName) ? prev.filter(p => p !== permName) : [...prev, permName]
 );
 };

 const toggleAllPermissions = () => {
 if (selectedPermissions.length === HR_MODULE_PERMISSIONS.length) {
 setSelectedPermissions([]);
 } else {
 setSelectedPermissions(HR_MODULE_PERMISSIONS.map(p => p.name));
 }
 };

 const handleChange = (e) => {
 const { name, value } = e.target;
 if (name === 'role') {
 const match = ROLE_OPTIONS.find(r => r.role === value);
 setFormData(prev => ({
 ...prev,
 role: value,
 designation: value,
 department: match ? match.dept : prev.department,
 zone: value === 'HR Executive' ? 'NORTH' : (match ? match.zone : 'ALL')
 }));
 setSelectedPermissions(getDefaultPermissionsForRole(value));
 } else {
 setFormData(prev => ({ ...prev, [name]: value }));
 }
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 if (!formData.name || !formData.email || !formData.phone || !formData.password) {
 toast.error('Please fill all required fields (*)');
 return;
 }
 if (formData.password !== formData.confirmPassword) {
 toast.error('Passwords do not match');
 return;
 }

 setIsSubmitting(true);
 try {
 const token = localStorage.getItem('token');
 const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'Authorization': `Bearer ${token}`
 },
 body: JSON.stringify({
 name: formData.name,
 email: formData.email,
 phone: formData.phone,
 password: formData.password,
 role: formData.role,
 subRole: formData.designation,
 designation: formData.designation,
 department: formData.department,
 zone: formData.zone,
 permissions: selectedPermissions,
 reportingManagerId: formData.reportingManagerId || null,
 reportsToHeadName: formData.reportsToHeadName || '',
 status: formData.status
 })
 });

 const data = await res.json();
 if (res.ok) {
 toast.success(data.message || `${formData.name} created successfully!`);
 navigate('/users');
 } else {
 toast.error(data.message || 'Failed to create user');
 }
 } catch (err) {
 toast.error('Network error creating user');
 } finally {
 setIsSubmitting(false);
 }
 };

 return (
 <div className="w-full max-w-5xl mx-auto pb-14 space-y-6">
 {/* Header & Back Navigation */}
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
 <div>
 <button 
 onClick={() => navigate('/users')}
 className="inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-500 hover:text-[#489b0d] transition-colors mb-2 cursor-pointer"
 >
 <ArrowLeft size={14} /> Back to Team & Staff Directory
 </button>
 <h1 className="text-2xl font-black text-slate-800 tracking-tight">Add Staff, Department Head & Admin</h1>
 <p className="text-[13px] text-slate-500 font-medium">Create and assign internal team members, zonal heads, department leads, and system administrators.</p>
 </div>
 </div>

 <form onSubmit={handleSubmit} className="space-y-6">
 
 {/* Step 1: Role, Department & Zone */}
 <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
 <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
 <Shield size={18} className="text-[#489b0d]" />
 <h2 className="text-[15px] font-bold text-slate-800">1. Role, Department & Zone Setup</h2>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div>
 <SearchableSelect
 label="Select Role / Designation"
 required
 name="role"
 value={formData.role}
 onChange={handleChange}
 options={ROLE_OPTIONS.map(r => ({ value: r.role, label: r.label, sublabel: r.dept }))}
 placeholder="Choose role..."
 />
 <p className="text-[11px] text-slate-400 mt-1">Role assigned to this administrative user</p>
 </div>

 <div>
 <label className="block text-[12px] font-bold text-slate-700 mb-1">
 Department
 </label>
 <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700">
 {formData.department}
 </div>
 <p className="text-[11px] text-slate-400 mt-1">Auto mapped according to selected role</p>
 </div>
 </div>

 {/* Conditional Zone & Reporting Manager for HR Executive / Team Members */}
 {formData.role === 'HR Executive' && (
 <div className="pt-3 border-t border-slate-100 animate-in fade-in duration-300">
 <div className="max-w-md">
 <SearchableSelect
 label="Assign Operating Zone"
 required
 name="zone"
 value={formData.zone}
 onChange={handleChange}
 options={[
 { value: 'NORTH', label: 'NORTH Zone (Delhi, UP, Punjab, Haryana, J&K)' },
 { value: 'SOUTH', label: 'SOUTH Zone (Karnataka, Tamil Nadu, Kerala, AP, Telangana)' },
 { value: 'EAST', label: 'EAST Zone (WB, Bihar, Odisha, Jharkhand, Assam)' },
 { value: 'WEST', label: 'WEST Zone (Maharashtra, Gujarat, Rajasthan, Goa)' },
 { value: 'CENTRAL', label: 'CENTRAL Zone (MP, Chhattisgarh)' }
 ]}
 placeholder="Select operating zone..."
 />
 <p className="text-[11px] text-slate-400 mt-1">Applicants from this zone will route to this Executive</p>
 </div>
 </div>
 )}

 </div>

 {/* Step 2: Granular Access Permissions */}
 <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
 <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
 <div className="flex items-center gap-2">
 <ShieldCheck size={18} className="text-[#489b0d]" />
 <div>
 <h2 className="text-[15px] font-bold text-slate-800">2. Dashboard & Module Access Permissions</h2>
 <p className="text-[11px] text-slate-400">Select which tools and modules this staff member can access upon logging in</p>
 </div>
 </div>
 <button
 type="button"
 onClick={toggleAllPermissions}
 className="text-[12px] font-bold text-[#489b0d] hover:underline cursor-pointer"
 >
 {selectedPermissions.length === HR_MODULE_PERMISSIONS.length ? 'Deselect All' : 'Select All'}
 </button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
 {HR_MODULE_PERMISSIONS.map((perm) => {
 const isChecked = selectedPermissions.includes(perm.name);
 return (
 <div
 key={perm.name}
 onClick={() => togglePermission(perm.name)}
 className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
 isChecked
 ? 'bg-[#489b0d]/5 border-[#489b0d] shadow-xs'
 : 'bg-slate-50/60 border-slate-200 hover:bg-white hover:border-slate-300'
 }`}
 >
 <input
 type="checkbox"
 checked={isChecked}
 onChange={() => {}}
 className="mt-1 w-4 h-4 rounded text-[#489b0d] focus:ring-[#489b0d] cursor-pointer accent-[#489b0d]"
 />
 <div>
 <h4 className={`text-xs font-bold leading-tight ${isChecked ? 'text-slate-900' : 'text-slate-700'}`}>
 {perm.label}
 </h4>
 <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
 {perm.desc}
 </p>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Step 3: Personal & Login Credentials */}
 <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
 <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
 <User size={18} className="text-[#489b0d]" />
 <h2 className="text-[15px] font-bold text-slate-800">3. Personal & Login Details</h2>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
 <div>
 <label className="block text-[12px] font-bold text-slate-700 mb-1">
 Full Name <span className="text-red-500">*</span>
 </label>
 <div className="relative">
 <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
 <input
 type="text"
 name="name"
 placeholder="e.g. Rahul Sharma"
 value={formData.name}
 onChange={handleChange}
 required
 className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d]"
 />
 </div>
 </div>

 <div>
 <label className="block text-[12px] font-bold text-slate-700 mb-1">
 Official Email Address (Login ID) <span className="text-red-500">*</span>
 </label>
 <div className="relative">
 <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
 <input
 type="email"
 name="email"
 placeholder="e.g. rahul.ops@company.com"
 value={formData.email}
 onChange={handleChange}
 required
 className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d]"
 />
 </div>
 </div>

 <div>
 <label className="block text-[12px] font-bold text-slate-700 mb-1">
 Mobile / Phone Number <span className="text-red-500">*</span>
 </label>
 <div className="relative">
 <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
 <input
 type="tel"
 name="phone"
 placeholder="e.g. 9876543210"
 value={formData.phone}
 onChange={handleChange}
 required
 className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d]"
 />
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
 <div>
 <label className="block text-[12px] font-bold text-slate-700 mb-1">
 Login Password <span className="text-red-500">*</span>
 </label>
 <div className="relative">
 <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
 <input
 type="password"
 name="password"
 placeholder="Minimum 6 characters"
 value={formData.password}
 onChange={handleChange}
 required
 className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d]"
 />
 </div>
 </div>

 <div>
 <label className="block text-[12px] font-bold text-slate-700 mb-1">
 Confirm Password <span className="text-red-500">*</span>
 </label>
 <div className="relative">
 <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
 <input
 type="password"
 name="confirmPassword"
 placeholder="Re-enter password"
 value={formData.confirmPassword}
 onChange={handleChange}
 required
 className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d]"
 />
 </div>
 </div>

 <div>
 <label className="block text-[12px] font-bold text-slate-700 mb-1">
 Account Status
 </label>
 <select
 name="status"
 value={formData.status}
 onChange={handleChange}
 className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] cursor-pointer"
 >
 <option value="Active">Active (Immediate Login Access)</option>
 <option value="Inactive">Inactive (Suspended / Disabled)</option>
 </select>
 </div>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex items-center justify-end gap-3 pt-2">
 <button
 type="button"
 onClick={() => navigate('/users')}
 className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold text-[13px] hover:bg-slate-50 transition-colors"
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={isSubmitting}
 className="flex items-center gap-2 px-7 py-2.5 bg-[#489b0d] hover:bg-[#3e850b] text-white rounded-lg font-bold text-[13px] shadow-sm transition-all disabled:opacity-50 cursor-pointer"
 >
 <Save size={16} /> {isSubmitting ? 'Creating User...' : 'Create Team Member'}
 </button>
 </div>

 </form>
 </div>
 );
}
