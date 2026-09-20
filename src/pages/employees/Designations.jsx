import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Building, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const DEPARTMENTS = [
  'OPERATIONAL', 'FIELD-SALES', 'BRANCH SALES', 'COLLECTIONS', 'OFFICIAL WORK'
];

export default function Designations() {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingDesig, setEditingDesig] = useState(null);
  const [form, setForm] = useState({
    name: '',
    department: 'OPERATIONAL',
    description: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/designations`);
      if (res.ok) {
        const data = await res.json();
        setDesignations(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      toast.error('Failed to load designations');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingDesig(null);
    setForm({ name: '', department: 'OPERATIONAL', description: '', status: 'Active' });
    setShowModal(true);
  };

  const handleOpenEdit = (desig) => {
    setEditingDesig(desig);
    setForm({
      name: desig.name,
      department: desig.department,
      description: desig.description || '',
      status: desig.status || 'Active'
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Designation name is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingDesig
        ? `${import.meta.env.VITE_API_BASE_URL}/designations/${editingDesig._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/designations`;
      const method = editingDesig ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(editingDesig ? 'Designation updated' : 'Designation created');
        setShowModal(false);
        fetchDesignations();
      } else {
        toast.error(data.message || 'Error saving designation');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Delete Designation?',
      text: `Are you sure you want to remove "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/designations/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            toast.success('Designation deleted');
            fetchDesignations();
          } else {
            toast.error('Failed to delete');
          }
        } catch (err) {
          toast.error('Server error');
        }
      }
    });
  };

  const filtered = designations.filter(d => {
    if (deptFilter !== 'all' && d.department !== deptFilter) return false;
    if (searchTerm && !d.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Designations & Roles</h1>
          <p className="text-[13px] text-slate-500 font-medium">Manage departmental designations, roles, and vacancy categories</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#489b0d] hover:bg-[#3e850b] text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Designation
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        
        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              value={deptFilter}
              onChange={e => { setDeptFilter(e.target.value); setCurrentPage(1); }}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold bg-white text-slate-700 focus:ring-1 focus:ring-[#489b0d]"
            >
              <option value="all">All Departments ({designations.length})</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept} ({designations.filter(d => d.department === dept).length})</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search designation name..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs w-64 bg-white focus:outline-none focus:border-[#489b0d]"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-700 tracking-wide uppercase">Designation Name</th>
                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-700 tracking-wide uppercase">Department</th>
                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-700 tracking-wide uppercase">Description</th>
                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-700 tracking-wide uppercase">Status</th>
                <th className="py-3.5 px-6 text-[11px] font-bold text-slate-700 tracking-wide uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {paginatedItems.map((desig) => (
                <tr key={desig._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-slate-800">{desig.name}</td>
                  <td className="py-3.5 px-6">
                    <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold text-xs border border-slate-200">
                      {desig.department}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-xs text-slate-500">{desig.description || 'Standard departmental role'}</td>
                  <td className="py-3.5 px-6">
                    <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[11px] font-bold">
                      {desig.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(desig)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit Designation"
                    >
                      <Edit2 size={15}/>
                    </button>
                    <button
                      onClick={() => handleDelete(desig._id, desig.name)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete Designation"
                    >
                      <Trash2 size={15}/>
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400 font-medium">
                    {loading ? 'Loading designations...' : 'No designations found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Rows per page:</span>
              <select
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-[#489b0d]"
              >
                {[15, 25, 50, 100].map(sz => (
                  <option key={sz} value={sz}>{sz}</option>
                ))}
              </select>
            </div>
            <span className="text-slate-300">|</span>
            <div>
              Showing <span className="font-bold text-slate-800">{filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to <span className="font-bold text-slate-800">{Math.min(currentPage * pageSize, filtered.length)}</span> of <span className="font-bold text-slate-800">{filtered.length}</span> entries
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
            >
              ‹ Prev
            </button>
            <span className="px-3 py-1.5 font-bold text-slate-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
            >
              Next ›
            </button>
          </div>
        </div>

      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
              <h2 className="text-base font-bold text-slate-900">{editingDesig ? 'Edit Designation' : 'Add New Designation'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
            </div>
            <form onSubmit={handleSave} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Designation Name *</label>
                <input
                  required
                  autoFocus
                  type="text"
                  placeholder="e.g. Credit Manager"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-1 focus:ring-[#489b0d]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
                <select
                  value={form.department}
                  onChange={e => setForm({...form, department: e.target.value})}
                  className="w-full border border-slate-300 rounded p-2 text-sm bg-white focus:ring-1 focus:ring-[#489b0d]"
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Brief role summary"
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-1 focus:ring-[#489b0d]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({...form, status: e.target.value})}
                  className="w-full border border-slate-300 rounded p-2 text-sm bg-white focus:ring-1 focus:ring-[#489b0d]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#489b0d] hover:bg-[#3e850b] text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  {editingDesig ? 'Update Designation' : 'Save Designation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
