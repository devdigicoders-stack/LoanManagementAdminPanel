import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Network, Plus, ChevronRight, Settings, X, Trash2, Pencil, 
  Crown, UserCheck, Shield, ChevronDown, ChevronUp, Search, Mail, Phone, 
  Briefcase, UserPlus, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function Departments() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [totalHeadcount, setTotalHeadcount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cards'); // 'cards' | 'hierarchy'
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignHeadOpen, setIsAssignHeadOpen] = useState(false);
  
  // Selected department for Assign Head or Team view
  const [selectedDeptForHead, setSelectedDeptForHead] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [expandedDeptId, setExpandedDeptId] = useState(null);
  const [headSearchTerm, setHeadSearchTerm] = useState('');

  // Form states
  const [newDept, setNewDept] = useState({ name: '', description: '', headEmployeeId: '', budget: '' });
  const [editDept, setEditDept] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
        
        const formatBudget = (num) => {
          if (!num || num === 0) return '₹0';
          if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
          if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
          return `₹${num.toLocaleString()}`;
        };

        const deptArray = data.map(d => {
          headCountTotal += d.headcount || 0;
          return {
            ...d,
            budgetString: formatBudget(d.budgetNum)
          };
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
    if (!selectedDeptForHead) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/departments/${selectedDeptForHead._id}/assign-head`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ employeeId: selectedEmployeeId || null })
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || 'Department Head updated successfully');
        setIsAssignHeadOpen(false);
        setSelectedDeptForHead(null);
        setSelectedEmployeeId('');
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
    if (!newDept.name) {
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
          name: newDept.name,
          description: newDept.description,
          headEmployeeId: newDept.headEmployeeId || null,
          budget: Number(newDept.budget) || 0
        })
      });
      
      if (res.ok) {
        toast.success('Department created successfully!');
        setIsModalOpen(false);
        setNewDept({ name: '', description: '', headEmployeeId: '', budget: '' });
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
    if (!editDept?.name) {
      toast.error('Department name is required');
      return;
    }
    
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/departments/${editDept._id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editDept.name,
          description: editDept.description,
          headEmployeeId: editDept.headEmployeeId || null,
          head: editDept.head || 'N/A',
          headRole: editDept.headRole || 'N/A',
          budget: Number(editDept.budgetNum) || 0
        })
      });
      
      if (res.ok) {
        toast.success('Department updated successfully!');
        setIsEditModalOpen(false);
        setEditDept(null);
        fetchDepartments();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to update department');
      }
    } catch (error) {
      toast.error('Server error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Filtered employees for Assign Head modal search
  const filteredHeadCandidates = allEmployees.filter(emp => {
    if (!headSearchTerm) return true;
    const term = headSearchTerm.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(term) ||
      emp.email?.toLowerCase().includes(term) ||
      emp.empId?.toLowerCase().includes(term) ||
      emp.designation?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 bg-slate-50/60 min-h-screen relative space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Departments & Leadership Hierarchy</h1>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Every department is led by a Department Head who oversees teams, task allocations, and subordinate roles.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('cards')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'cards' 
                  ? 'bg-white text-slate-900 shadow-xs font-black' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Department Cards
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hierarchy')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'hierarchy' 
                  ? 'bg-white text-slate-900 shadow-xs font-black' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Org Hierarchy Tree
            </button>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors"
          >
            <Plus size={16} /> New Department
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl"><Building2 size={24} /></div>
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Total Departments</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{departments.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl"><Crown size={24} /></div>
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Department Heads Appointed</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">
              {departments.filter(d => d.head && d.head !== 'N/A').length} / {departments.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl"><Users size={24} /></div>
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Total Active Staff</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{totalHeadcount}</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center text-slate-500 font-bold">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading departments and leadership hierarchy...
        </div>
      ) : activeTab === 'cards' ? (
        /* ================= CARDS VIEW ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => {
            const hasHead = dept.head && dept.head !== 'N/A';
            const isExpanded = expandedDeptId === dept._id;

            return (
              <div 
                key={dept._id || dept.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden"
              >
                {/* Department Card Header */}
                <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-slate-50/80 to-white flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                        {dept.departmentCode || dept.id}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {dept.headcount} {dept.headcount === 1 ? 'member' : 'members'}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mt-1 truncate">{dept.name}</h3>
                    {dept.description && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{dept.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button 
                      onClick={() => { setEditDept({ ...dept, budgetNum: dept.budgetNum || '' }); setIsEditModalOpen(true); }}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Department"
                    >
                      <Pencil size={15} />
                    </button>
                    <button 
                      onClick={() => handleDelete(dept._id, dept.name)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Department"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Department Head Profile Box */}
                <div className="p-5 border-b border-slate-100 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Crown size={13} className={hasHead ? "text-amber-500" : "text-slate-300"} />
                      Department Head
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDeptForHead(dept);
                        setSelectedEmployeeId(dept.headEmployeeId || '');
                        setIsAssignHeadOpen(true);
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                    >
                      {hasHead ? 'Change Head' : '+ Appoint Head'}
                    </button>
                  </div>

                  {hasHead ? (
                    <div className="p-3.5 bg-amber-50/40 border border-amber-200/70 rounded-xl flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {dept.head.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-black text-slate-900 truncate">{dept.head}</h4>
                          <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[9px] font-black rounded uppercase">
                            HEAD
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-600 truncate mt-0.5">
                          {dept.headRole && dept.headRole !== 'N/A' ? dept.headRole : `${dept.name} Head`}
                        </p>
                        
                        {(dept.headDetails?.email || dept.headEmail) && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 truncate">
                            <Mail size={12} className="shrink-0 text-slate-400" />
                            <span className="truncate">{dept.headDetails?.email || dept.headEmail}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                      <p className="text-xs font-semibold text-slate-400">No Department Head Appointed</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDeptForHead(dept);
                          setSelectedEmployeeId('');
                          setIsAssignHeadOpen(true);
                        }}
                        className="mt-2 text-xs font-black text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      >
                        <UserPlus size={14} /> Appoint Department Head
                      </button>
                    </div>
                  )}

                  {/* Subordinate Roles List */}
                  {dept.subRoles && dept.subRoles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                        Subordinate Roles Under Head ({dept.subRoles.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {dept.subRoles.map((role, rIdx) => (
                          <span 
                            key={rIdx}
                            className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Team Members Collapsible Section */}
                <div className="p-4 bg-slate-50/50 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>Department Team ({dept.teamMembers?.length || 0})</span>
                    <button
                      type="button"
                      onClick={() => setExpandedDeptId(isExpanded ? null : dept._id)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
                    >
                      {isExpanded ? (
                        <>Hide Members <ChevronUp size={14} /></>
                      ) : (
                        <>View Members <ChevronDown size={14} /></>
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {dept.teamMembers && dept.teamMembers.length > 0 ? (
                        dept.teamMembers.map((emp) => (
                          <div 
                            key={emp._id}
                            className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                          >
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate flex items-center gap-1.5">
                                {emp.name}
                                {emp.isHead && (
                                  <span className="text-[9px] px-1 bg-amber-100 text-amber-800 font-bold rounded">
                                    HEAD
                                  </span>
                                )}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">{emp.designation || emp.role || 'Member'}</p>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">{emp.empId || ''}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic py-2 text-center">No team members assigned yet</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Annual Budget</span>
                    <p className="font-black text-slate-800">{dept.budgetString}</p>
                  </div>
                  <button 
                    onClick={() => navigate('/employees', { state: { initialSearch: dept.name } })} 
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
                  >
                    Manage Staff <ArrowRight size={12} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* ================= HIERARCHY TREE VIEW ================= */
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-6">
              <Network className="text-blue-600" size={22} />
              <div>
                <h2 className="text-lg font-black text-slate-900">Organizational Department Tree</h2>
                <p className="text-xs text-slate-500 font-medium">Top-down chain of command: Department Head oversees all subordinate roles and field officers.</p>
              </div>
            </div>

            <div className="space-y-6">
              {departments.map((dept) => (
                <div key={dept._id || dept.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/40">
                  {/* Department Node */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-600 text-white rounded-xl font-black text-xs">
                        {dept.departmentCode || dept.id}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">{dept.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {dept.headcount} Total Team Members • Budget: {dept.budgetString}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Department Head:</span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                        dept.head && dept.head !== 'N/A'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        👑 {dept.head} ({dept.headRole || 'Head'})
                      </span>
                    </div>
                  </div>

                  {/* Branch Lines: Sub-Roles & Employees */}
                  <div className="mt-4 pl-4 sm:pl-8 border-l-2 border-dashed border-blue-300 space-y-4">
                    
                    {/* Sub-Roles Level */}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                        <Briefcase size={13} className="text-blue-500" />
                        Subordinate Roles & Designations
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(dept.subRoles || []).map((role, idx) => (
                          <div 
                            key={idx}
                            className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            {role}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Team Members Level */}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                        <Users size={13} className="text-emerald-500" />
                        Reporting Team Members
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {(dept.teamMembers || []).map((emp) => (
                          <div 
                            key={emp._id} 
                            className={`p-3 rounded-xl border text-xs ${
                              emp.isHead 
                                ? 'bg-amber-50/70 border-amber-300' 
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-slate-900 truncate">{emp.name}</p>
                              {emp.isHead && <span className="text-[9px] font-black text-amber-700 bg-amber-100 px-1 rounded">HEAD</span>}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">{emp.designation || 'Staff'}</p>
                            <p className="text-[10px] font-mono text-slate-400 mt-1">Reports to: {dept.head}</p>
                          </div>
                        ))}
                        {(!dept.teamMembers || dept.teamMembers.length === 0) && (
                          <div className="text-xs text-slate-400 italic py-2">No team members assigned</div>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= ASSIGN / APPOINT HEAD MODAL ================= */}
      {isAssignHeadOpen && selectedDeptForHead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <Crown size={20} className="text-amber-500" />
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Appoint Head of {selectedDeptForHead.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Select an employee to lead this department. All team members will report to this Head.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setIsAssignHeadOpen(false); setSelectedDeptForHead(null); }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAssignHead} className="p-6 space-y-4">
              {/* Employee search */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Search & Select Employee
                </label>
                <div className="relative mb-2">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search by name, email, designation..."
                    value={headSearchTerm}
                    onChange={(e) => setHeadSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                  <label 
                    className={`flex items-center gap-3 p-3 text-xs cursor-pointer hover:bg-slate-50 ${
                      selectedEmployeeId === '' ? 'bg-blue-50/60 font-bold text-blue-700' : 'text-slate-700'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="selectedHead" 
                      value="" 
                      checked={selectedEmployeeId === ''} 
                      onChange={() => setSelectedEmployeeId('')}
                      className="text-blue-600"
                    />
                    <div>
                      <span className="font-bold">None / Unassigned</span>
                      <p className="text-[10px] text-slate-400">Leave department without an active head</p>
                    </div>
                  </label>

                  {filteredHeadCandidates.map((emp) => (
                    <label 
                      key={emp._id} 
                      className={`flex items-center gap-3 p-3 text-xs cursor-pointer hover:bg-slate-50 ${
                        selectedEmployeeId === emp._id ? 'bg-blue-50/80 font-bold text-blue-800' : 'text-slate-700'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="selectedHead" 
                        value={emp._id} 
                        checked={selectedEmployeeId === emp._id} 
                        onChange={() => setSelectedEmployeeId(emp._id)}
                        className="text-blue-600"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold truncate">{emp.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">{emp.empId || ''}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{emp.designation || emp.role || 'Staff'} • {emp.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsAssignHeadOpen(false); setSelectedDeptForHead(null); }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={16} />
                  {isSubmitting ? 'Saving...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CREATE DEPARTMENT MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-base font-black text-slate-900">Create New Department</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateDepartment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department Name *</label>
                <input 
                  type="text" 
                  required
                  value={newDept.name}
                  onChange={(e) => setNewDept({...newDept, name: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. OPERATIONS, CREDIT, HR"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description (Optional)</label>
                <textarea 
                  rows={2}
                  value={newDept.description}
                  onChange={(e) => setNewDept({...newDept, description: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Primary role and scope of this department..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Appoint Department Head (Optional)</label>
                <select 
                  value={newDept.headEmployeeId}
                  onChange={(e) => setNewDept({...newDept, headEmployeeId: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Employee as Head...</option>
                  {allEmployees.map(e => (
                    <option key={e._id} value={e._id}>{e.name} ({e.designation || e.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Annual Budget Override (₹)</label>
                <input 
                  type="number" 
                  value={newDept.budget}
                  onChange={(e) => setNewDept({...newDept, budget: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 5000000"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
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
      {isEditModalOpen && editDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-base font-black text-slate-900">Edit Department</h2>
              <button onClick={() => { setIsEditModalOpen(false); setEditDept(null); }} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateDepartment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department Name *</label>
                <input 
                  type="text" 
                  required
                  value={editDept.name}
                  onChange={(e) => setEditDept({...editDept, name: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea 
                  rows={2}
                  value={editDept.description || ''}
                  onChange={(e) => setEditDept({...editDept, description: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department Head (Employee)</label>
                <select 
                  value={editDept.headEmployeeId || ''}
                  onChange={(e) => setEditDept({...editDept, headEmployeeId: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Employee...</option>
                  {allEmployees.map(e => (
                    <option key={e._id} value={e._id}>{e.name} ({e.designation || e.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Annual Budget Override (₹)</label>
                <input 
                  type="number" 
                  value={editDept.budgetNum || ''}
                  onChange={(e) => setEditDept({...editDept, budgetNum: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsEditModalOpen(false); setEditDept(null); }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 disabled:opacity-70"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
