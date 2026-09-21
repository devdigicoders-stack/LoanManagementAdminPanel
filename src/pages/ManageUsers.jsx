import React, { useState, useMemo, useEffect } from "react";
import Swal from "sweetalert2";
import {
  ChevronRight,
  Users,
  UserCheck,
  UserMinus,
  ShieldAlert,
  ShieldCheck,
  UserX,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  FileText,
  Briefcase,
  TrendingUp,
  Eye,
  Edit,
  Ban,
  Unlock,
  Clock,
  Search,
  Trash2,
  UserPlus,
  Building2,
  Layers,
  Crown,
  CheckCircle2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SearchableSelect from "../components/common/SearchableSelect";

export default function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const storedRole = localStorage.getItem('userRole') || currentUser.role || 'Admin';
  const roleLower = storedRole.toLowerCase();
  const cleanRole = roleLower.replace(/[^a-z0-9]/g, '');
  const isMasterAdmin = ['super admin', 'superadmin', 'admin', 'administrator'].includes(roleLower) || ['superadmin', 'admin'].includes(cleanRole);
  const isHRHead = ['hr head', 'hr_head', 'hr admin', 'hradmin', 'hr'].includes(roleLower) || 
                   ['hrhead', 'hradmin', 'hr'].includes(cleanRole) || 
                   (currentUser.designation || '').toLowerCase().includes('hr head');
  const isHRManager = ['hr manager', 'hr_manager', 'hrmanager'].includes(roleLower) || 
                     ['hrmanager'].includes(cleanRole) || 
                     (currentUser.designation || '').toLowerCase().includes('hr manager');

  // Fetch Team & Staff from API
  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users?type=staff`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : (data.users || []);
        // Filter out superadmins and if HR Head, filter out self / HR Head roles
        const staffOnly = list.filter(u => {
          const r = (u.role || '').toLowerCase();
          const d = (u.designation || '').toLowerCase();
          if (['superadmin', 'super admin', 'Super Admin'].includes(u.role)) return false;
          if (isHRHead && !isMasterAdmin) {
            if (r.includes('hr head') || d.includes('hr head') || r === 'admin') return false;
          }
          if (isHRManager && !isMasterAdmin) {
            if (r.includes('hr head') || d.includes('hr head') || r.includes('hr manager') || r === 'admin') return false;
          }
          return true;
        });

        setUsers(staffOnly.map(u => ({
          ...u,
          _id: u._id,
          id: u._id || u.empId || u.id,
          empId: u.empId || (u.role === 'Admin' ? `ADM-${(u._id || '').slice(-6).toUpperCase()}` : (u.empId || `EMP-${(u._id || '').slice(-6).toUpperCase()}`))
        })));
      } else if (response.status === 403) {
        console.warn('No permission to view staff');
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [zoneFilter, setZoneFilter] = useState("All Zones");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [selectedListTab, setSelectedListTab] = useState(
    isHRManager ? "All Executives" : (isHRHead ? "All Team" : "All Staff")
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const name = user.name || '';
      const email = user.email || '';
      const id = user.empId || user.id || '';
      const phone = user.phone || user.mobile || '';
      const role = user.role || '';
      const designation = user.designation || '';

      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm) ||
        role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        designation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter;
      const matchesZone = zoneFilter === 'All Zones' || (user.zone || 'NORTH') === zoneFilter;
      const matchesDept = deptFilter === 'All Departments' || (user.department || 'Operations') === deptFilter;

      const isMgr = role.toLowerCase().includes('hr manager') || designation.toLowerCase().includes('hr manager');
      const isExec = role.toLowerCase().includes('hr executive') || designation.toLowerCase().includes('hr executive');
      const isHead = user.isDepartmentHead || role.toLowerCase().includes('head') || designation.toLowerCase().includes('head');
      const isField = role.toLowerCase().includes('agent') || role.toLowerCase().includes('field') || role.toLowerCase().includes('officer');
      const isOffice = role.toLowerCase().includes('telecaller') || role.toLowerCase().includes('ops') || role.toLowerCase().includes('operation') || role.toLowerCase().includes('account');

      const matchesTab = 
        selectedListTab === "All Staff" ||
        selectedListTab === "All Team" ||
        selectedListTab === "All Executives" ||
        (selectedListTab === "HR Managers" && isMgr) ||
        (selectedListTab === "HR Executives" && isExec) ||
        (selectedListTab === "Department Heads" && isHead) ||
        (selectedListTab === "Field Staff" && isField) ||
        (selectedListTab === "Office Staff" && isOffice) ||
        (selectedListTab === "Active" && user.status === "Active") ||
        (selectedListTab === "Inactive" && user.status !== "Active");

      return matchesSearch && matchesStatus && matchesZone && matchesDept && matchesTab;
    });
  }, [users, searchTerm, statusFilter, zoneFilter, deptFilter, selectedListTab]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const currentItems = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Dynamic KPIs for Staff
  const totalStaffCount = users.length;
  const hrManagersCount = users.filter(u => (u.role || '').toLowerCase().includes('hr manager') || (u.designation || '').toLowerCase().includes('hr manager')).length;
  const hrExecutivesCount = users.filter(u => (u.role || '').toLowerCase().includes('hr executive') || (u.designation || '').toLowerCase().includes('hr executive')).length;
  const headsCount = users.filter(u => u.isDepartmentHead || (u.role || '').toLowerCase().includes('head') || (u.designation || '').toLowerCase().includes('head')).length;
  const activeCount = users.filter(u => u.status === 'Active').length;
  const inactiveCount = users.filter(u => u.status !== 'Active').length;

  const dynamicTopKpis = isHRHead ? [
    { label: "Total HR Team", value: totalStaffCount, icon: Users, color: "text-[#489b0d]", bg: "bg-[#489b0d]/10" },
    { label: "HR Managers", value: hrManagersCount, icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "HR Executives", value: hrExecutivesCount, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Active Members", value: activeCount, icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Inactive / Blocked", value: inactiveCount, icon: UserX, color: "text-red-500", bg: "bg-red-50" },
  ] : (isHRManager ? [
    { label: "My HR Executives", value: hrExecutivesCount || totalStaffCount, icon: UserCheck, color: "text-[#489b0d]", bg: "bg-[#489b0d]/10" },
    { label: "Active Executives", value: activeCount, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Inactive / Blocked", value: inactiveCount, icon: UserX, color: "text-red-500", bg: "bg-red-50" },
  ] : [
    { label: "Total Team & Staff", value: totalStaffCount, icon: Users, color: "text-[#489b0d]", bg: "bg-[#489b0d]/10" },
    { label: "Department Heads", value: headsCount, icon: Crown, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Active Staff", value: activeCount, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Inactive / Blocked", value: inactiveCount, icon: UserX, color: "text-red-500", bg: "bg-red-50" },
  ]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    Swal.fire({
      title: 'Delete Staff Member?',
      text: "Are you sure you want to delete this staff record?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (response.ok) {
            const updated = users.filter(u => u.id !== id && u._id !== id);
            setUsers(updated);
            Swal.fire('Deleted!', data.message || 'Staff member has been removed.', 'success');
          } else {
            Swal.fire('Error!', data.message || 'Failed to delete record.', 'error');
          }
        } catch (error) {
          Swal.fire('Error!', error.message || 'An error occurred.', 'error');
        }
      }
    });
  };

  const handleToggleBlock = async (e, user) => {
    e.stopPropagation();
    const targetId = user._id || user.id;
    const isCurrentlyActive = user.status === "Active";
    const newStatus = isCurrentlyActive ? "Inactive" : "Active";
    const confirmMsg = isCurrentlyActive 
      ? `Are you sure you want to deactivate ${user.name}?` 
      : `Are you sure you want to activate ${user.name}?`;

    Swal.fire({
      title: 'Status Update',
      text: confirmMsg,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: isCurrentlyActive ? '#d33' : '#489b0d',
      cancelButtonColor: '#64748b',
      confirmButtonText: isCurrentlyActive ? 'Yes, Deactivate' : 'Yes, Activate'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${targetId}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
          });
          const data = await response.json();
          if (response.ok && data.success !== false) {
            setUsers(prev => prev.map(u => (u.id === targetId || u._id === targetId || u.email === user.email) ? { ...u, status: newStatus } : u));
            Swal.fire('Updated!', data.message || `Status changed to ${newStatus}.`, 'success');
          } else {
            Swal.fire('Error!', data.message || 'Failed to update status.', 'error');
          }
        } catch (error) {
          Swal.fire('Error!', error.message || 'An error occurred.', 'error');
        }
      }
    });
  };

  // Render Dynamic Avatar Helper (NO hardcoded placeholder URLs!)
  const renderAvatar = (user) => {
    if (user?.avatar && typeof user.avatar === 'string' && (user.avatar.startsWith('http') || user.avatar.startsWith('data:'))) {
      return (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
        />
      );
    }
    const initials = (user?.name || 'S').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const bgColors = [
      'bg-blue-600',
      'bg-emerald-600',
      'bg-purple-600',
      'bg-amber-600',
      'bg-rose-600',
      'bg-indigo-600',
      'bg-teal-600'
    ];
    const colorIndex = (user?.name || 'A').charCodeAt(0) % bgColors.length;

    return (
      <div className={`w-10 h-10 rounded-full ${bgColors[colorIndex]} text-white flex items-center justify-center font-bold text-[13px] shadow-sm shrink-0 uppercase tracking-tight`}>
        {initials}
      </div>
    );
  };

  // Reset page when filters change
  useMemo(() => { setCurrentPage(1); }, [searchTerm, statusFilter, zoneFilter, deptFilter, selectedListTab]);

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-1">
            {isHRHead ? 'HR Team & Staff Management' : (isHRManager ? 'My HR Executives & Team' : 'Team & Staff Management')}
          </h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <Link to="/" className="hover:text-[#489b0d] transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-slate-800 font-bold">
              {isHRHead ? 'HR Managers & Executives Directory' : (isHRManager ? 'My Assigned HR Executives' : 'Team & Staff Directory')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, ID, phone, role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all"
            />
          </div>
          <button
            onClick={() => navigate('/users/hr-permissions')}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2.5 rounded-lg font-bold text-[13px] shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <ShieldCheck size={16} className="text-[#489b0d]" /> HR Permissions
          </button>
          <button
            onClick={() => navigate('/users/add')}
            className="flex items-center gap-2 bg-[#489b0d] hover:bg-[#3e850b] text-white px-4 py-2.5 rounded-lg font-bold text-[13px] shadow-sm transition-all cursor-pointer shrink-0"
          >
            <UserPlus size={16} /> {isHRHead ? '+ Add HR Manager / Exec' : (isHRManager ? '+ Add HR Executive' : '+ Add Staff / Head / Admin')}
          </button>
        </div>
      </div>

      {/* Top KPIs Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {dynamicTopKpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-sm flex flex-col justify-between min-h-[105px] hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-[12px] font-semibold text-slate-500 tracking-wide">
                {kpi.label}
              </p>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${kpi.bg} ${kpi.color}`}
              >
                <kpi.icon size={16} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 leading-none">
                {kpi.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filter Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar bg-slate-50/50">
          {(isHRHead ? [
            "All Team",
            "HR Managers",
            "HR Executives",
            "Active",
            "Inactive"
          ] : (isHRManager ? [
            "All Executives",
            "Active",
            "Inactive"
          ] : [
            "All Staff",
            "Department Heads",
            "Field Staff",
            "Office Staff",
            "Active",
            "Inactive",
          ])).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedListTab(tab)}
              className={`px-5 py-3 text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                selectedListTab === tab
                  ? "border-[#489b0d] text-[#489b0d] bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/40">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="w-44">
              <SearchableSelect
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                options={[
                  { value: 'All Zones', label: '🌐 All Zones' },
                  { value: 'NORTH', label: '📍 North Zone' },
                  { value: 'SOUTH', label: '📍 South Zone' },
                  { value: 'EAST', label: '📍 East Zone' },
                  { value: 'WEST', label: '📍 West Zone' },
                  { value: 'CENTRAL', label: '📍 Central Zone' },
                  { value: 'ALL', label: '📍 All India' }
                ]}
                placeholder="Filter zone..."
                buttonClassName="py-2 text-[12px] font-bold"
              />
            </div>

            <div className="w-52">
              <SearchableSelect
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                options={[
                  { value: 'All Departments', label: '🏢 All Departments' },
                  { value: 'Operations', label: 'Operations' },
                  { value: 'HR & Recruitment', label: 'HR & Recruitment' },
                  { value: 'Sales & Marketing', label: 'Sales & Loans' },
                  { value: 'Credit & Underwriting', label: 'Credit & Underwriting' },
                  { value: 'Accounts & Finance', label: 'Accounts & Finance' },
                  { value: 'Administration', label: 'Administration' }
                ]}
                placeholder="Filter department..."
                buttonClassName="py-2 text-[12px] font-bold"
              />
            </div>

            <div className="w-36">
              <SearchableSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'All Status', label: 'All Status' },
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                  { value: 'Blocked', label: 'Blocked' }
                ]}
                placeholder="Filter status..."
                buttonClassName="py-2 text-[12px] font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-[12px] font-semibold text-slate-500">
              Showing {currentItems.length} of {filteredUsers.length} members
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Role & Designation</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Assigned Zone</th>
                <th className="py-3.5 px-4">Reports To</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 font-semibold text-[13px]">
                    Loading team & staff records...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-medium text-[13px]">
                    No team or staff members found.
                  </td>
                </tr>
              ) : (
                currentItems.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => navigate(`/user-profile/${user.id}`)}
                    className="cursor-pointer transition-colors hover:bg-slate-50/80 group"
                  >
                    {/* Staff Member */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {renderAvatar(user)}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-[13px] font-bold text-slate-800 group-hover:text-[#489b0d] transition-colors leading-tight">
                              {user.name}
                            </p>
                            {user.isDepartmentHead && (
                              <Crown size={12} className="text-amber-500 fill-amber-500 shrink-0" title="Department Head" />
                            )}
                          </div>
                          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                            {user.empId || user.id} • {user.phone || user.mobile || 'No Phone'}
                          </p>
                          <p className="text-[11px] text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role & Designation */}
                    <td className="py-3.5 px-4">
                      <p className="text-[12px] font-bold text-slate-800">
                        {user.designation || user.role}
                      </p>
                      <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 mt-0.5">
                        {user.role}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                        <Building2 size={12} /> {user.department || 'Operations'}
                      </span>
                    </td>

                    {/* Assigned Zone */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        <MapPin size={11} className="text-[#489b0d]" /> {user.zone || 'NORTH'}
                      </span>
                    </td>

                    {/* Reports To */}
                    <td className="py-3.5 px-4">
                      <p className="text-[12px] font-semibold text-slate-600">
                        {user.reportsTo || user.reportsToHeadName || 'Zonal Head'}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {user.status === "Active" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 size={11} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                          <Ban size={11} /> {user.status || 'Inactive'}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/employees/${user._id || user.id}`)}
                          className="p-1.5 text-slate-500 hover:text-[#489b0d] hover:bg-slate-100 rounded-md transition-colors"
                          title="View Full Profile & Activity"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={(e) => handleToggleBlock(e, user)}
                          className={`p-1.5 rounded-md transition-colors ${
                            (user.status === "Blocked" || user.status === "Inactive")
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-amber-600 hover:bg-amber-50"
                          }`}
                          title={user.status === "Active" ? "Deactivate Staff" : "Activate Staff"}
                        >
                          {(user.status === "Blocked" || user.status === "Inactive") ? <Unlock size={15} /> : <Ban size={15} />}
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, user._id || user.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Staff"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-slate-500 font-medium">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-[12px]"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg font-bold text-[12px] transition-colors ${
                  currentPage === i + 1
                    ? "bg-[#489b0d] text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-[12px]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
