import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, Mail, Phone, MapPin, User, Building, 
  ShieldCheck, RefreshCw, Eye, Globe, Users, Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

export default function EmployeeDirectory() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const currentAdminId = localStorage.getItem('adminId') || (JSON.parse(localStorage.getItem('user') || '{}')._id);
          const currentAdminEmail = (localStorage.getItem('adminEmail') || (JSON.parse(localStorage.getItem('user') || '{}').email) || '').toLowerCase();
          
          const filteredStaff = data.filter(e => {
            if (currentAdminId && (e._id === currentAdminId || e.id === currentAdminId)) return false;
            if (currentAdminEmail && e.email && e.email.toLowerCase() === currentAdminEmail) return false;
            return true;
          });
          setEmployees(filteredStaff);
        }
      } else {
        toast.error('Failed to load employee directory');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error fetching directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Unique departments for filter
  const departments = useMemo(() => {
    const set = new Set();
    employees.forEach(e => {
      if (e.department) set.add(e.department);
    });
    return Array.from(set);
  }, [employees]);

  // Zone counts
  const zoneCounts = useMemo(() => {
    const counts = { ALL: employees.length, NORTH: 0, SOUTH: 0, EAST: 0, WEST: 0, CENTRAL: 0 };
    employees.forEach(e => {
      const z = (e.zone || 'NORTH').toUpperCase();
      if (counts[z] !== undefined) counts[z]++;
    });
    return counts;
  }, [employees]);

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const empZone = (emp.zone || 'NORTH').toUpperCase();
      if (zoneFilter !== 'ALL' && empZone !== zoneFilter) return false;
      if (deptFilter !== 'ALL' && emp.department !== deptFilter) return false;
      if (statusFilter !== 'ALL' && emp.status !== statusFilter) return false;

      if (search) {
        const q = search.toLowerCase();
        const matchName = emp.name?.toLowerCase().includes(q);
        const matchId = emp.empId?.toLowerCase().includes(q);
        const matchRole = (emp.role || emp.designation || '').toLowerCase().includes(q);
        const matchEmail = emp.email?.toLowerCase().includes(q);
        const matchMobile = emp.mobile?.toLowerCase().includes(q);
        const matchState = emp.state?.toLowerCase().includes(q);
        const matchCity = (emp.city || emp.district || '').toLowerCase().includes(q);
        if (!matchName && !matchId && !matchRole && !matchEmail && !matchMobile && !matchState && !matchCity) {
          return false;
        }
      }
      return true;
    });
  }, [employees, zoneFilter, deptFilter, statusFilter, search]);

  return (
    <div className="p-6 bg-slate-50/60 min-h-screen space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Users className="text-blue-600" size={26} /> Employee Directory
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Browse and connect with staff members across India by Zone, Department, and Designation.
          </p>
        </div>
        <button
          onClick={fetchEmployees}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-2xs self-start"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Zone Pills Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Globe size={13} /> Zone:
          </span>
          {['ALL', 'NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL'].map(zone => (
            <button
              key={zone}
              onClick={() => setZoneFilter(zone)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                zoneFilter === zone
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80'
              }`}
            >
              {zone === 'ALL' ? 'All Zones' : `${zone} Zone`} ({zoneCounts[zone] || 0})
            </button>
          ))}
        </div>

        {/* Count summary */}
        <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
          Showing <strong className="text-gray-900 font-extrabold">{filteredEmployees.length}</strong> of {employees.length} Staff
        </span>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50/60">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, ID, role, city, mobile..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-xs placeholder:text-gray-400"
            />
          </div>

          {/* Secondary Dropdowns */}
          <div className="flex items-center gap-2.5 flex-wrap">
            
            {/* Department Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-2xs text-xs">
              <Building size={13} className="text-gray-400" />
              <select
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                className="bg-transparent text-gray-800 font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Departments</option>
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-2xs text-xs">
              <ShieldCheck size={13} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-transparent text-gray-800 font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Probation">Probation</option>
              </select>
            </div>

            {(zoneFilter !== 'ALL' || deptFilter !== 'ALL' || statusFilter !== 'ALL' || search) && (
              <button
                onClick={() => {
                  setZoneFilter('ALL');
                  setDeptFilter('ALL');
                  setStatusFilter('ALL');
                  setSearch('');
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold px-2 py-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Grid of Employee Cards */}
        {loading ? (
          <div className="py-20 text-center text-gray-500 font-semibold">Loading employee directory...</div>
        ) : filteredEmployees.length === 0 ? (
          <div className="py-20 text-center text-gray-400 space-y-2">
            <Users size={36} className="mx-auto opacity-30" />
            <p className="font-bold text-gray-700">No employees found matching selected filters.</p>
            <p className="text-xs text-gray-400">Try changing your zone or search query.</p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEmployees.map(emp => {
              const zone = (emp.zone || 'NORTH').toUpperCase();
              return (
                <div 
                  key={emp._id} 
                  className="border border-gray-200/90 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all bg-white flex flex-col justify-between group"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                          {emp.name?.charAt(0).toUpperCase() || 'E'}
                        </div>
                        <div>
                          <h3 
                            onClick={() => navigate(`/employees/${emp._id}`)}
                            className="font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors cursor-pointer text-sm"
                          >
                            {emp.name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                              {emp.empId}
                            </span>
                            <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded border ${
                              zone === 'NORTH' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                              zone === 'SOUTH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              zone === 'EAST' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              zone === 'WEST' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              'bg-slate-50 text-slate-700 border-slate-200'
                            }`}>
                              {zone} Zone
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10.5px] font-extrabold ${
                        emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {emp.status || 'Active'}
                      </span>
                    </div>

                    {/* Body Details */}
                    <div className="space-y-2 py-3 border-y border-gray-100 text-xs">
                      <div className="flex items-center justify-between text-gray-600">
                        <span className="font-semibold text-gray-500 flex items-center gap-1.5">
                          <Briefcase size={12} className="text-gray-400" /> Role & Desig:
                        </span>
                        <span className="font-bold text-gray-800 truncate max-w-[170px]" title={emp.designation || emp.role}>
                          {emp.designation || emp.role || 'Staff'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-gray-600">
                        <span className="font-semibold text-gray-500 flex items-center gap-1.5">
                          <Building size={12} className="text-gray-400" /> Department:
                        </span>
                        <span className="font-bold text-gray-800 truncate max-w-[170px]">
                          {emp.department || emp.division || 'OPERATIONAL'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-gray-600">
                        <span className="font-semibold text-gray-500 flex items-center gap-1.5">
                          <MapPin size={12} className="text-gray-400" /> Location:
                        </span>
                        <span className="font-medium text-gray-700 truncate max-w-[170px]" title={`${emp.city || emp.district || ''}, ${emp.state || ''}`}>
                          {emp.city || emp.district || emp.state ? `${emp.city || emp.district || ''}${emp.state ? `, ${emp.state}` : ''}` : 'Corporate'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex gap-2 pt-3.5 mt-2">
                    {emp.email && (
                      <a 
                        href={`mailto:${emp.email}`}
                        className="flex-1 flex justify-center items-center gap-1 px-2.5 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
                        title={emp.email}
                      >
                        <Mail size={12} /> Email
                      </a>
                    )}
                    {emp.mobile && (
                      <a 
                        href={`tel:${emp.mobile}`}
                        className="flex-1 flex justify-center items-center gap-1 px-2.5 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
                        title={emp.mobile}
                      >
                        <Phone size={12} /> Call
                      </a>
                    )}
                    <button 
                      onClick={() => navigate(`/employees/${emp._id}`)}
                      className="flex-1 flex justify-center items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                      <Eye size={12} /> View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
