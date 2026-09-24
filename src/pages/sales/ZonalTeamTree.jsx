import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Building2, Users, ChevronDown, ChevronRight, UserPlus, 
  Search, Shield, Phone, Mail, MapPin, RefreshCw, ArrowLeft, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

export default function ZonalTeamTree() {
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState('NORTH');
  const [treeData, setTreeData] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'tree'

  const [userScope, setUserScope] = useState({ role: '', zone: 'NORTH' });

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchTree = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/sales/zonal-tree`, authHeader);
      if (res.data.success) {
        setTreeData(res.data.tree || {});
        if (res.data.userScope) {
          setUserScope(res.data.userScope);
          if (res.data.userScope.zone) {
            setSelectedZone(res.data.userScope.zone);
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load zonal hierarchy tree');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const currentZoneData = treeData[selectedZone] || {
    rrms: [],
    unassignedARMs: [],
    unassignedRMs: [],
    unassignedRERO: [],
    staffList: [],
    rrmCount: 0,
    armCount: 0,
    rmCount: 0,
    reRoCount: 0,
    totalStaff: 0
  };

  const isRestrictedRole = ['arm', 'rm', 'ro', 're'].includes((userScope.role || '').toLowerCase());
  const allowedZones = isRestrictedRole ? [userScope.zone || 'NORTH'] : ['NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL'];

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              {isRestrictedRole ? `${userScope.role.toUpperCase()} Area Hierarchy` : 'Zonal Sales Team Hierarchy'}
            </span>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-slate-100 text-slate-700 border">
              Zone: {selectedZone}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            {isRestrictedRole ? 'My Subordinate Team & Ground Staff' : 'Zonal Team & Staff Directory'}
          </h1>
          <p className="text-sm text-slate-500">
            {isRestrictedRole 
              ? 'Showing only the staff and managers reporting directly under your command hierarchy.'
              : 'Click on any zone to view active employees, assigned designations, and reporting structure.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(userScope.role === 'arm' ? '/sales/arm-dashboard' : '/sales/dashboard')}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <button
            onClick={fetchTree}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
            title="Refresh List"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Zone Selector Tabs (Visible to SuperAdmin/SalesHead, locked for ARM/RM) */}
      {!isRestrictedRole && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {allowedZones.map(z => {
            const zData = treeData[z] || {};
            const isSelected = selectedZone === z;
            return (
              <button
                key={z}
                onClick={() => setSelectedZone(z)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md border-indigo-600'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider">{z} ZONE</span>
                  <Building2 size={16} className={isSelected ? 'text-indigo-200' : 'text-slate-400'} />
                </div>
                <div className={`text-xl font-black mt-2 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {zData.totalStaff || 0} <span className="text-xs font-normal opacity-80">Staff</span>
                </div>
                <div className={`text-[11px] mt-1 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {zData.rrmCount || 0} RRM • {zData.armCount || 0} ARM • {zData.rmCount || 0} RM
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* View Toggle & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              viewMode === 'table'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers size={15} />
            Zone Staff Table ({currentZoneData.totalStaff || 0})
          </button>
          <button
            onClick={() => setViewMode('tree')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              viewMode === 'tree'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building2 size={15} />
            Hierarchy Tree View
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${selectedZone} zone staff...`}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600 bg-slate-50"
          />
        </div>
      </div>

      {/* TABLE VIEW (Selected Zone Staff) */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-bold text-slate-900">
                {selectedZone} Zone Staff & Leadership Directory
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Total: {currentZoneData.totalStaff || 0} Staff Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold text-[11px]">
                <tr className="whitespace-nowrap">
                  <th className="px-5 py-3.5 whitespace-nowrap">Emp ID</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Staff Member</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Zone</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Designation / Zonal Role</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Reporting Manager</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Contact</th>
                  <th className="px-5 py-3.5 text-right whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-slate-400 whitespace-nowrap">
                      <RefreshCw size={22} className="animate-spin mx-auto mb-2 text-indigo-600" />
                      Loading staff for {selectedZone} Zone...
                    </td>
                  </tr>
                ) : (currentZoneData.staffList || []).filter(s => {
                  if (!searchQuery) return true;
                  const q = searchQuery.toLowerCase();
                  return (
                    (s.name && s.name.toLowerCase().includes(q)) ||
                    (s.empId && s.empId.toLowerCase().includes(q)) ||
                    (s.role && s.role.toLowerCase().includes(q)) ||
                    (s.zonalRole && s.zonalRole.toLowerCase().includes(q)) ||
                    (s.mobile && s.mobile.includes(q)) ||
                    (s.email && s.email.toLowerCase().includes(q))
                  );
                }).length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-slate-400 whitespace-nowrap">
                      <Users size={32} className="mx-auto text-slate-300 mb-2" />
                      No active staff found in {selectedZone} Zone.
                    </td>
                  </tr>
                ) : (
                  (currentZoneData.staffList || []).filter(s => {
                    if (!searchQuery) return true;
                    const q = searchQuery.toLowerCase();
                    return (
                      (s.name && s.name.toLowerCase().includes(q)) ||
                      (s.empId && s.empId.toLowerCase().includes(q)) ||
                      (s.role && s.role.toLowerCase().includes(q)) ||
                      (s.zonalRole && s.zonalRole.toLowerCase().includes(q)) ||
                      (s.mobile && s.mobile.includes(q)) ||
                      (s.email && s.email.toLowerCase().includes(q))
                    );
                  }).map((staff) => (
                    <tr key={staff._id} className="hover:bg-slate-50/80 transition group whitespace-nowrap">
                      <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                        {staff.empId || 'EMP-' + staff._id.slice(-4).toUpperCase()}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{staff.name}</span>
                          {staff.email && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-[11px] text-slate-400">{staff.email}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded font-black text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 whitespace-nowrap">
                          {staff.zone || selectedZone}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 whitespace-nowrap">
                          {staff.zonalRole || staff.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                        {staff.rmName || staff.armName || staff.rrmName || (
                          <span className="text-slate-400 italic">Central Sales Head</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="text-slate-800 font-medium">{staff.mobile || '-'}</div>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TREE HIERARCHY VIEW */}
      {viewMode === 'tree' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-base font-bold text-slate-900">
              {selectedZone} Zone Hierarchical Tree
            </h2>
            <span className="text-xs text-slate-500">Click to expand / collapse nodes</span>
          </div>

          {currentZoneData.rrms.length === 0 && (currentZoneData.arms || []).length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              <Users size={36} className="mx-auto text-slate-300 mb-2" />
              {isRestrictedRole 
                ? 'No subordinate staff assigned under you yet. Use Hiring Requisitions to request team members.'
                : `No active staff mapped in ${selectedZone} Zone yet.`}
            </div>
          ) : (
            <div className="space-y-4">
              {/* If user is ARM, render direct subordinate RMs and staff */}
              {userScope.role === 'arm' ? (
                (currentZoneData.rms || []).length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs border border-dashed rounded-xl">
                    <Users size={30} className="mx-auto text-slate-300 mb-2" />
                    No Reporting Managers (RMs) or ground staff assigned under your area yet.
                  </div>
                ) : (
                  (currentZoneData.rms || []).map((rm) => {
                    const isRmExpanded = expandedNodes[rm._id] !== false;
                    return (
                      <div key={rm._id} className="border border-purple-200 rounded-xl p-4 bg-purple-50/20">
                        <div
                          onClick={() => toggleNode(rm._id)}
                          className="flex items-center justify-between cursor-pointer p-3 bg-white rounded-xl shadow-sm border border-purple-100 hover:border-purple-300 transition"
                        >
                          <div className="flex items-center gap-3">
                            <span className="p-2 bg-purple-600 text-white rounded-lg"><Users size={16} /></span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">{rm.name}</span>
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-black rounded">
                                  Reporting Manager (RM)
                                </span>
                              </div>
                              <div className="text-xs text-slate-500">{rm.email} • {rm.mobile}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
                            <span>{(rm.reRos || []).length} RE/ROs</span>
                            {isRmExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          </div>
                        </div>

                        {/* Nested RE/ROs */}
                        {isRmExpanded && (
                          <div className="mt-3 pl-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border-l-2 border-purple-200">
                            {(rm.reRos || []).length === 0 ? (
                              <div className="col-span-full text-xs text-slate-400 italic py-2">
                                No Field RO/RE mapped under this RM yet.
                              </div>
                            ) : (
                              rm.reRos.map((ro) => (
                                <div key={ro._id} className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-xs space-y-1">
                                  <div className="font-bold text-slate-900">{ro.name}</div>
                                  <div className="text-[11px] text-slate-500">{ro.zonalRole || ro.role || 'RO'}</div>
                                  <div className="text-[10px] text-slate-400">{ro.mobile || ro.email}</div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )
              ) : (
                /* Standard Root: RRM and below */
                currentZoneData.rrms.map((rrm) => {
                  const isRrmExpanded = expandedNodes[rrm._id] !== false; // default expanded
                  return (
                    <div key={rrm._id} className="border border-indigo-200 rounded-2xl p-4 bg-indigo-50/30">
                      {/* RRM Node */}
                      <div
                        onClick={() => toggleNode(rrm._id)}
                        className="flex items-center justify-between cursor-pointer p-3 bg-white rounded-xl shadow-sm border border-indigo-100 hover:border-indigo-300 transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className="p-2 bg-indigo-600 text-white rounded-lg"><Shield size={18} /></span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{rrm.name}</span>
                              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded">
                                RRM (Regional Head)
                              </span>
                            </div>
                            <div className="text-xs text-slate-500">{rrm.email} • {rrm.mobile}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                          <span>{(rrm.arms || []).length} ARMs</span>
                          {isRrmExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </div>
                      </div>

                      {/* Nested ARMs */}
                      {isRrmExpanded && (
                        <div className="mt-3 pl-6 space-y-3 border-l-2 border-indigo-200">
                          {(rrm.arms || []).length === 0 ? (
                            <div className="text-xs text-slate-400 italic py-2">No ARMs mapped under this RRM yet.</div>
                          ) : (
                            rrm.arms.map((arm) => {
                              const isArmExpanded = expandedNodes[arm._id] !== false;
                              return (
                                <div key={arm._id} className="border border-slate-200 rounded-xl p-3 bg-white shadow-sm">
                                  {/* ARM Node */}
                                  <div
                                    onClick={() => toggleNode(arm._id)}
                                    className="flex items-center justify-between cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <span className="p-1.5 bg-blue-100 text-blue-700 rounded-md"><Users size={16} /></span>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-bold text-slate-800 text-xs">{arm.name}</span>
                                          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-bold rounded">
                                            ARM (Area Manager)
                                          </span>
                                        </div>
                                        <div className="text-[11px] text-slate-400">{arm.email} • {arm.mobile}</div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
                                      <span>{(arm.rms || []).length} RMs</span>
                                      {isArmExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    </div>
                                  </div>

                                  {/* Nested RMs */}
                                  {isArmExpanded && (
                                    <div className="mt-2.5 pl-5 space-y-2 border-l-2 border-blue-100">
                                      {(arm.rms || []).length === 0 ? (
                                        <div className="text-xs text-slate-400 italic py-1">No RMs mapped under this ARM.</div>
                                      ) : (
                                        arm.rms.map((rm) => {
                                          const isRmExpanded = expandedNodes[rm._id] || false;
                                          return (
                                            <div key={rm._id} className="border border-slate-100 rounded-lg p-2.5 bg-slate-50/70">
                                              {/* RM Node */}
                                              <div
                                                onClick={() => toggleNode(rm._id)}
                                                className="flex items-center justify-between cursor-pointer"
                                              >
                                                <div className="flex items-center gap-2">
                                                  <span className="p-1 bg-purple-100 text-purple-700 rounded"><Users size={14} /></span>
                                                  <div>
                                                    <span className="font-bold text-slate-800 text-xs">{rm.name}</span>
                                                    <span className="ml-2 px-1.5 py-0.2 bg-purple-50 text-purple-700 text-[9px] font-semibold rounded">
                                                      RM (Reporting Manager)
                                                    </span>
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-[11px] text-purple-700 font-bold">
                                                  <span>{(rm.reRos || []).length} RE/ROs</span>
                                                  {isRmExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                </div>
                                              </div>

                                              {/* Nested RE/ROs */}
                                              {isRmExpanded && (
                                                <div className="mt-2 pl-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 border-l-2 border-purple-200">
                                                  {(rm.reRos || []).length === 0 ? (
                                                    <div className="col-span-full text-xs text-slate-400 italic py-1">
                                                      No Field RO/RE mapped under this RM.
                                                    </div>
                                                  ) : (
                                                    rm.reRos.map((ro) => (
                                                      <div key={ro._id} className="p-2 bg-white rounded border border-slate-200 text-xs">
                                                        <div className="font-bold text-slate-800">{ro.name}</div>
                                                        <div className="text-[10px] text-slate-400">{ro.zonalRole || 'RO'} • {ro.mobile}</div>
                                                      </div>
                                                    ))
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
