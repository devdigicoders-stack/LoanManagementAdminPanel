import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, Users, Plus, Pencil, Trash2, Crown, 
  Search, Mail, ArrowRight, LayoutGrid, List, UserCheck, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import SearchableSelect from '../../components/common/SearchableSelect';

export default function Departments() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [totalHeadcount, setTotalHeadcount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignHeadOpen, setIsAssignHeadOpen] = useState(false);
  
  // Selected department for Assign Head or Edit
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedHeadId, setSelectedHeadId] = useState('');

  // Form states
  const [formData, setFormData] = useState({ name: '', description: '', headEmployeeId: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/employees?limit=200`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const emps = Array.isArray(data) ? data : (data.employees || []);
        setAllEmployees(emps);
      }
    } catch (e) {
      console.error('Failed to fetch employees list', e);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/departments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        let headCountTotal = 0;
        const deptArray = data.map(d => {
          headCountTotal += d.headcount || 0;
          return d;
        });
        setDepartments(deptArray);
        setTotalHeadcount(headCountTotal);
      } else {
        toast.error('Failed to load departments');
      }
    } catch (e) {
      toast.error('Server error');
    } finally {
      setIsLoading(false);
    }
  };

  // Employee options for SearchableSelect
  const employeeSelectOptions = useMemo(() => {
    return [
      { value: '', label: 'None / Unassigned', sublabel: 'No head assigned' },
      ...allEmployees.map(emp => ({
        value: emp._id,
        label: emp.name,
        sublabel: `${emp.designation || emp.role || 'Staff'} • ${emp.empId || ''}`
      }))
    ];
  }, [allEmployees]);

  // Filtered departments by search term
  const filteredDepartments = useMemo(() => {
    if (!searchTerm.trim()) return departments;
    const term = searchTerm.toLowerCase();
    return departments.filter(d => 
      d.name?.toLowerCase().includes(term) ||
      d.head?.toLowerCase().includes(term) ||
      d.departmentCode?.toLowerCase().includes(term) ||
      d.description?.toLowerCase().includes(term)
    );
  }, [departments, searchTerm]);

  const handleDelete = async (id, name) => {
    if (!id) return;
    const result = await Swal.fire({
      title: `Delete ${name}?`,
      text: 'Department structure will be removed. Employee records will remain safe.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, delete'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/departments/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          toast.success('Department deleted successfully');
          fetchDepartments();
        } else {
          toast.error('Failed to delete department');
        }
      } catch (e) {
        toast.error('Server error');
      }
    }
  };

  const handleAssignHead = async (e) => {
    e.preventDefault();
    if (!selectedDept) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/departments/${selectedDept._id}/assign-head`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ employeeId: selectedHeadId || null })
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || 'Department Head updated');
        setIsAssignHeadOpen(false);
        setSelectedDept(null);
        setSelectedHeadId('');
        fetchDepartments();
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to assign department head');
      }
    } catch (err) {
      toast.error('Server error while assigning head');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Department name is required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/departments`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          headEmployeeId: formData.headEmployeeId || null
        })
      });
      
      if (res.ok) {
        toast.success('Department created successfully!');
        setIsCreateModalOpen(false);
        setFormData({ name: '', description: '', headEmployeeId: '' });
        fetchDepartments();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to create department');
      }
    } catch (error) {
      toast.error('Server error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Department name is required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/departments/${selectedDept._id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          headEmployeeId: formData.headEmployeeId || null
        })
      });
      
      if (res.ok) {
        toast.success('Department updated successfully!');
        setIsEditModalOpen(false);
        setSelectedDept(null);
        setFormData({ name: '', description: '', headEmployeeId: '' });
        fetchDepartments();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to update department');
      }
    } catch (error) {
      toast.error('Server error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (dept) => {
    setSelectedDept(dept);
    setFormData({
      name: dept.name || '',
      description: dept.description || '',
      headEmployeeId: dept.headEmployeeId || ''
    });
    setIsEditModalOpen(true);
  };

  const openAssignHeadModal = (dept) => {
    setSelectedDept(dept);
    setSelectedHeadId(dept.headEmployeeId || '');
    setIsAssignHeadOpen(true);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50/60 min-h-screen space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-xs">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Departments</h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Manage departments, department heads, and team members.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1 md:flex-initial">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search departments or heads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* View Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>

          {/* Add Department Button */}
          <button 
            onClick={() => {
              setFormData({ name: '', description: '', headEmployeeId: '' });
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={16} /> Add Department
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Building2 size={20} /></div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Departments</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{departments.length}</p>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Crown size={20} /></div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Appointed Heads</p>
            <p className="text-xl font-black text-amber-600 mt-0.5">
              {departments.filter(d => d.head && d.head !== 'N/A').length} / {departments.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Users size={20} /></div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Staff Members</p>
            <p className="text-xl font-black text-emerald-700 mt-0.5">{totalHeadcount}</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center text-slate-500 font-bold">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading departments...
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center shadow-xs">
          <Building2 size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-black text-slate-800">No departments found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
            {searchTerm ? `No results match "${searchTerm}". Try a different keyword.` : 'Click "Add Department" above to create your first department.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* ================= GRID VIEW ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDepartments.map((dept) => {
            const hasHead = dept.head && dept.head !== 'N/A';

            return (
              <div 
                key={dept._id || dept.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Header */}
                <div className="p-5 border-b border-slate-100">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                      {dept.departmentCode || dept.id || 'DEPT'}
                    </span>
                    
                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => openEditModal(dept)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Department"
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(dept._id, dept.name)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Department"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    {dept.name}
                  </h3>
                  {dept.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-medium">
                      {dept.description}
                    </p>
                  )}
                </div>

                {/* Head Section */}
                <div className="p-5 flex-1 bg-slate-50/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Crown size={12} className={hasHead ? "text-amber-500" : "text-slate-300"} />
                      Department Head
                    </span>
                    <button
                      type="button"
                      onClick={() => openAssignHeadModal(dept)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      {hasHead ? 'Change' : '+ Appoint'}
                    </button>
                  </div>

                  {hasHead ? (
                    <div className="p-3 bg-white border border-amber-200/80 rounded-xl flex items-center gap-3 shadow-2xs">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {dept.head.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-black text-slate-900 truncate">{dept.head}</h4>
                        <p className="text-[11px] font-semibold text-slate-500 truncate">
                          {dept.headRole && dept.headRole !== 'N/A' ? dept.headRole : 'Department Head'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => openAssignHeadModal(dept)}
                      className="p-3 bg-white border border-dashed border-slate-200 rounded-xl text-center cursor-pointer hover:border-blue-400 transition-colors"
                    >
                      <p className="text-xs font-bold text-blue-600">+ Appoint Head</p>
                    </div>
                  )}
                </div>

                {/* Footer Bar */}
                <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-600">
                    <Users size={14} className="text-slate-400" />
                    <span>{dept.headcount || 0} {(dept.headcount === 1) ? 'Member' : 'Members'}</span>
                  </div>

                  <button 
                    onClick={() => navigate('/employees', { state: { initialSearch: dept.name } })} 
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Staff <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================= TABLE VIEW ================= */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Department Name</th>
                  <th className="py-3.5 px-4">Department Head</th>
                  <th className="py-3.5 px-4">Staff Count</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDepartments.map((dept) => {
                  const hasHead = dept.head && dept.head !== 'N/A';

                  return (
                    <tr key={dept._id || dept.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                          {dept.departmentCode || dept.id || 'DEPT'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        <div>{dept.name}</div>
                        {dept.description && (
                          <div className="text-[11px] font-normal text-slate-400 line-clamp-1">{dept.description}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {hasHead ? (
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black flex items-center justify-center shrink-0">
                              {dept.head.charAt(0).toUpperCase()}
                            </span>
                            <div>
                              <div className="font-bold text-slate-800">{dept.head}</div>
                              <div className="text-[10px] text-slate-400">{dept.headRole || 'Head'}</div>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openAssignHeadModal(dept)}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            + Appoint Head
                          </button>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-md">
                          <Users size={12} className="text-slate-400" />
                          {dept.headcount || 0}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => navigate('/employees', { state: { initialSearch: dept.name } })}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                          >
                            Staff
                          </button>
                          <button 
                            onClick={() => openEditModal(dept)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(dept._id, dept.name)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= CREATE DEPARTMENT MODAL ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-visible shadow-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Building2 size={16} className="text-blue-600" /> Add New Department
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateDepartment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. OPERATIONS, SALES, CREDIT"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description (Optional)</label>
                <textarea 
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Department scope and details..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department Head (Optional)</label>
                <SearchableSelect
                  placeholder="Search and select employee..."
                  options={employeeSelectOptions}
                  value={formData.headEmployeeId}
                  onChange={(val) => setFormData({...formData, headEmployeeId: val})}
                />
              </div>
              
              <div className="pt-3 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 disabled:opacity-70"
                >
                  {isSubmitting ? 'Creating...' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT DEPARTMENT MODAL ================= */}
      {isEditModalOpen && selectedDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-visible shadow-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Pencil size={16} className="text-blue-600" /> Edit Department
              </h2>
              <button onClick={() => { setIsEditModalOpen(false); setSelectedDept(null); }} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdateDepartment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea 
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department Head</label>
                <SearchableSelect
                  placeholder="Search and select employee..."
                  options={employeeSelectOptions}
                  value={formData.headEmployeeId}
                  onChange={(val) => setFormData({...formData, headEmployeeId: val})}
                />
              </div>
              
              <div className="pt-3 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsEditModalOpen(false); setSelectedDept(null); }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 disabled:opacity-70"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ASSIGN HEAD MODAL ================= */}
      {isAssignHeadOpen && selectedDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-visible shadow-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <div>
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Crown size={16} className="text-amber-500" /> Appoint Department Head
                </h2>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{selectedDept.name}</p>
              </div>
              <button 
                onClick={() => { setIsAssignHeadOpen(false); setSelectedDept(null); }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAssignHead} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Select Employee as Head
                </label>
                <SearchableSelect
                  placeholder="Search by employee name or ID..."
                  options={employeeSelectOptions}
                  value={selectedHeadId}
                  onChange={(val) => setSelectedHeadId(val)}
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsAssignHeadOpen(false); setSelectedDept(null); }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center gap-1.5"
                >
                  <UserCheck size={16} />
                  {isSubmitting ? 'Saving...' : 'Confirm Head'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
