import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Users, RefreshCw, CheckCircle2, ChevronRight,
  Shield, MapPin, Mail, Phone, Calendar, Clock, AlertTriangle,
  FileText, TrendingUp, Search, UserCheck, Check, Sparkles, Building2
} from 'lucide-react';
import { Skeleton, SkeletonCard } from '../components/common/SkeletonLoader';

export default function RoleHandoverPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [subordinateStaff, setSubordinateStaff] = useState([]);
  const [groundLeads, setGroundLeads] = useState([]);
  const [availableManagers, setAvailableManagers] = useState([]);

  // Selection & Transfer Form States
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [targetManagerId, setTargetManagerId] = useState("");
  const [searchTarget, setSearchTarget] = useState("");
  const [transferActiveLeads, setTransferActiveLeads] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // 1. Fetch the user details
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, { headers });
        if (!res.ok) {
          toast.error("User not found");
          navigate('/users');
          return;
        }

        const data = await res.json();
        const loadedUser = data.user || data;
        setUser(loadedUser);
        setSubordinateStaff(loadedUser.subordinateStaff || []);
        setGroundLeads(loadedUser.groundLeads || []);

        // Default: select all team members for easy 1-click handover
        if (loadedUser.subordinateStaff?.length > 0) {
          setSelectedStaffIds(loadedUser.subordinateStaff.map(s => s._id || s.id));
        }

        // 2. Fetch available target peers in same role & same zone
        const empRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees`, { headers });
        if (empRes.ok) {
          const allEmps = await empRes.json();
          const userZone = (loadedUser.zone || 'NORTH').toUpperCase();
          const myRole = (loadedUser.role || loadedUser.zonalRole || loadedUser.designation || '').toLowerCase().trim();

          const eligible = allEmps.filter(e => {
            const eId = (e._id || e.id || '').toString();
            const currentId = (loadedUser._id || loadedUser.id || '').toString();
            if (eId === currentId) return false;
            if (e.status !== 'Active') return false;

            const eRole = (e.role || e.zonalRole || e.designation || '').toLowerCase().trim();

            let isRoleMatch = false;
            if (myRole.includes('sales head')) isRoleMatch = eRole.includes('sales head');
            else if (myRole === 'rrm' || myRole.includes('regional')) isRoleMatch = eRole === 'rrm' || eRole.includes('rrm');
            else if (myRole === 'arm' || myRole.includes('area')) isRoleMatch = eRole === 'arm' || eRole.includes('arm');
            else if (myRole === 'rm' || myRole.includes('relationship')) isRoleMatch = eRole.includes('rm') || eRole.includes('relationship');
            else if (myRole.includes('hr manager')) isRoleMatch = eRole.includes('hr manager') || eRole.includes('hr head');
            else if (myRole.includes('hr head')) isRoleMatch = eRole.includes('hr head');
            else isRoleMatch = eRole === myRole;

            if (!isRoleMatch) return false;

            const isHeadLevel = myRole.includes('head') || myRole.includes('rrm');
            if (isHeadLevel) return true;

            const eZone = (e.zone || 'ALL').toUpperCase();
            return eZone === 'ALL' || eZone === userZone;
          });

          setAvailableManagers(eligible);
        }
      } catch (err) {
        console.error("Error loading handover data:", err);
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    fetchRoleData();
  }, [id, navigate]);

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!targetManagerId) {
      toast.error("Please select a Target Manager to transfer to");
      return;
    }

    if (selectedStaffIds.length === 0) {
      toast.error("Please select at least one team member to transfer");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/bulk-transfer-team`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          employeeIds: selectedStaffIds,
          targetManagerId,
          transferActiveLeads
        })
      });

      const data = await res.json();
      if (res.ok && data.success !== false) {
        toast.success(data.message || 'Team handover and lead portfolio transferred successfully!');
        setTimeout(() => {
          navigate('/users');
        }, 1500);
      } else {
        toast.error(data.message || 'Transfer failed');
      }
    } catch (err) {
      toast.error(err.message || 'Server error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6 pb-12 p-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonCard height="h-64" />
          <div className="lg:col-span-2 space-y-6">
            <SkeletonCard height="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const roleName = user.role || user.zonalRole || user.designation || 'Staff Member';
  const zoneName = (user.zone || 'NORTH').toUpperCase();

  const filteredTargetManagers = availableManagers.filter(m => {
    if (!searchTarget.trim()) return true;
    const q = searchTarget.toLowerCase();
    return (m.name || '').toLowerCase().includes(q) ||
           (m.email || '').toLowerCase().includes(q) ||
           (m.empId || '').toLowerCase().includes(q);
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-16 px-2 sm:px-4">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center text-[12px] font-semibold text-slate-500 mb-1">
            <Link to="/users" className="hover:text-blue-600 transition-colors">Manage Users</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-slate-800">Role Handover & Team Transfer</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <RefreshCw className="text-blue-600 w-6 h-6" /> Role Handover & Portfolio Transfer
          </h1>
        </div>
        <button
          onClick={() => navigate('/users')}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-lg text-[13px] font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <ArrowLeft size={16} /> Back to Users
        </button>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Resigning Role Details & Zone Info Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-bl-full pointer-events-none" />

            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center uppercase shadow-md shadow-blue-500/20">
                {(user.name || 'U').slice(0, 2)}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-black text-slate-800 truncate">{user.name}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                    {roleName}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>
                    {user.status || 'Active'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 text-[12px]">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5"><Building2 size={14} /> Assigned Zone</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md">{zoneName}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5"><Shield size={14} /> Employee ID</span>
                <span className="font-mono font-bold text-slate-800">{user.empId || user.userId || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5"><Mail size={14} /> Email</span>
                <span className="font-semibold text-slate-700 truncate max-w-[180px]">{user.email || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5"><Phone size={14} /> Mobile</span>
                <span className="font-bold text-slate-800">{user.mobile || user.phone || 'N/A'}</span>
              </div>
              {user.statusRemarks && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mt-2 text-amber-900">
                  <div className="font-bold text-[11px] uppercase tracking-wide flex items-center gap-1 text-amber-700 mb-0.5">
                    <AlertTriangle size={13} /> Deactivation / Resignation Remark
                  </div>
                  <p className="text-[12px]">{user.statusRemarks}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics of this Role */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Reporting Team</div>
              <div className="text-2xl font-black text-slate-800 mt-1">{subordinateStaff.length}</div>
              <div className="text-[11px] text-blue-600 font-semibold mt-0.5">Direct Juniors</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Active Leads</div>
              <div className="text-2xl font-black text-slate-800 mt-1">{groundLeads.length}</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">In-Process Files</div>
            </div>
          </div>

          {/* Target Manager Selection Box */}
          <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-[14px] flex items-center gap-2">
                <UserCheck className="text-blue-600 w-4 h-4" /> Select Target Manager
              </h3>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                {zoneName} Zone Only
              </span>
            </div>
            <p className="text-[12px] text-slate-500">
              Choose an active <strong>{roleName}</strong> in <strong>{zoneName} Zone</strong> to receive this team and active leads.
            </p>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={`Search ${roleName} by name, emp ID...`}
                value={searchTarget}
                onChange={(e) => setSearchTarget(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-[12px] focus:outline-none focus:border-blue-500 bg-slate-50/50"
              />
            </div>

            <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
              {filteredTargetManagers.map(mgr => {
                const isSelected = targetManagerId === (mgr._id || mgr.id);
                return (
                  <label
                    key={mgr._id || mgr.id}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50/70' : ''}`}
                  >
                    <input
                      type="radio"
                      name="targetManager"
                      value={mgr._id || mgr.id}
                      checked={isSelected}
                      onChange={() => setTargetManagerId(mgr._id || mgr.id)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold text-slate-800 flex items-center justify-between">
                        <span className="truncate">{mgr.name}</span>
                        {isSelected && <Check size={14} className="text-blue-600 shrink-0" />}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono">{mgr.empId || 'EMP'}</span> &bull;
                        <span className="text-blue-600 font-bold">{mgr.role || mgr.zonalRole || 'Manager'}</span> &bull;
                        <span className="text-slate-600 font-semibold">{mgr.zone || 'ALL'}</span>
                      </div>
                    </div>
                  </label>
                );
              })}

              {filteredTargetManagers.length === 0 && (
                <div className="p-4 text-center text-slate-400 text-[12px]">
                  No matching active {roleName} found in {zoneName} Zone.
                </div>
              )}
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer">
              <input
                type="checkbox"
                checked={transferActiveLeads}
                onChange={(e) => setTransferActiveLeads(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
              />
              <div className="text-[12px]">
                <span className="font-bold text-slate-800 block">Transfer Active Lead Portfolio</span>
                <span className="text-slate-500">Auto re-routes active in-process leads from this team to target manager's review desk.</span>
              </div>
            </label>

            <button
              onClick={handleTransferSubmit}
              disabled={!targetManagerId || selectedStaffIds.length === 0 || isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-[13px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
              {isSubmitting ? 'Transferring...' : `Execute Handover (${selectedStaffIds.length} Members)`}
            </button>
          </div>
        </div>

        {/* Right Col: Subordinate Team Table & Leads Status Overview */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Subordinate Team Members Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50">
              <div>
                <h3 className="font-black text-slate-800 text-[15px] flex items-center gap-2">
                  <Users className="text-blue-600 w-5 h-5" /> Team Members Reporting Under This Role
                </h3>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Select members to transfer to the new target manager.
                </p>
              </div>

              {subordinateStaff.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedStaffIds(subordinateStaff.map(s => s._id || s.id))}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    Select All ({subordinateStaff.length})
                  </button>
                  <button
                    onClick={() => setSelectedStaffIds([])}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-700 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/60 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4 text-center w-12">
                      <input
                        type="checkbox"
                        checked={subordinateStaff.length > 0 && selectedStaffIds.length === subordinateStaff.length}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedStaffIds(subordinateStaff.map(s => s._id || s.id));
                          else setSelectedStaffIds([]);
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Role & Designation</th>
                    <th className="py-3 px-4">Employee ID</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[13px]">
                  {subordinateStaff.map((staff, idx) => {
                    const sId = staff._id || staff.id;
                    const isChecked = selectedStaffIds.includes(sId);
                    return (
                      <tr key={idx} className={`hover:bg-slate-50/60 transition-colors ${isChecked ? 'bg-blue-50/40' : ''}`}>
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedStaffIds(prev => [...prev, sId]);
                              else setSelectedStaffIds(prev => prev.filter(id => id !== sId));
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center shrink-0">
                              {(staff.name || 'S').slice(0, 2).toUpperCase()}
                            </div>
                            <span className="truncate">{staff.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-700">{staff.role || staff.zonalRole || 'Staff'}</span>
                          <span className="text-[11px] text-slate-400 block">{staff.designation || 'Field Staff'}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[12px] text-slate-600">{staff.empId || 'EMP-N/A'}</td>
                        <td className="py-3.5 px-4 text-slate-600 text-[12px]">{staff.mobile || staff.phone || 'N/A'}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${staff.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                            {staff.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {subordinateStaff.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-10 text-center text-slate-400 font-medium">
                        No team members currently report under this staff member.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Leads & Files Status Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-black text-slate-800 text-[15px] flex items-center gap-2">
                  <FileText className="text-emerald-600 w-5 h-5" /> Active Leads & Pipeline Portfolio ({groundLeads.length})
                </h3>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Current files originating from this team that will be re-assigned.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/60 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Lead ID</th>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitted Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[13px]">
                  {groundLeads.map((lead, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700 text-[12px]">{lead.leadId || 'N/A'}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{lead.name}</td>
                      <td className="py-3 px-4 text-slate-600">{lead.productCategory || 'Loan'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                          {lead.status || 'New'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[12px] text-slate-500">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </td>
                    </tr>
                  ))}

                  {groundLeads.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">
                        No active leads currently pending in this role's pipeline.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

