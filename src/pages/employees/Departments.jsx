import React, { useState, useEffect } from 'react';
import { Building2, Users, Network, Plus, ChevronRight, Settings, X, Trash2, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Departments() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [totalHeadcount, setTotalHeadcount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [newDept, setNewDept] = useState({ name: '', head: '', headRole: '', budget: '' });
  const [editDept, setEditDept] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this department? Employees inside this division will remain unaffected.')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/departments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Department deleted');
        fetchDepartments();
      } else {
        toast.error('Failed to delete department');
      }
    } catch (e) {
      toast.error('Server error');
    }
  };

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    if (!editDept.name) {
      toast.error('Department name is required');
      return;
    }
    
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/departments/${editDept._id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editDept.name,
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

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/departments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        
        let headCountTotal = 0;
        
        // Format budget function
        const formatBudget = (num) => {
          if (!num || num === 0) return 'N/A';
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

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    if (!newDept.name) {
      toast.error('Department name is required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/departments', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newDept.name,
          head: newDept.head || 'N/A',
          headRole: newDept.headRole || 'N/A',
          budget: Number(newDept.budget) || 0
        })
      });
      
      if (res.ok) {
        toast.success('Department created successfully!');
        setIsModalOpen(false);
        setNewDept({ name: '', head: '', headRole: '', budget: '' });
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments & Hierarchy</h1>
          <p className="text-sm text-gray-500 mt-1">Manage organizational structure, reporting lines, and department heads.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700"
          >
            <Plus size={16} /> Create Department
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Building2 size={24} /></div>
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Total Departments</p>
             <p className="text-xl font-black text-gray-900 mt-0.5">{departments.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Users size={24} /></div>
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Total Headcount</p>
             <p className="text-xl font-black text-gray-900 mt-0.5">{totalHeadcount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 cursor-pointer hover:border-blue-300 transition-colors">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Network size={24} /></div>
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Org Chart</p>
             <p className="text-sm font-bold text-blue-600 mt-0.5 flex items-center gap-1">View Hierarchy <ChevronRight size={14}/></p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
             <div className="p-8 text-center text-gray-500 font-medium">Loading departments...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Department ID</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Department Name</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Department Head</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-center">Headcount</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Annual Budget</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {departments.map(dept => (
                  <tr key={dept._id || dept.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-blue-600">{dept.id}</td>
                    <td className="py-4 px-4 font-bold text-gray-900">{dept.name}</td>
                    <td className="py-4 px-4">
                      <span className={`block font-bold ${dept.head === 'N/A' ? 'text-gray-400 italic' : 'text-gray-900'}`}>{dept.head}</span>
                      {dept.headRole !== 'N/A' && <span className="text-xs text-gray-500">{dept.headRole}</span>}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded font-bold">{dept.headcount}</span>
                    </td>
                    <td className="py-4 px-4 text-right font-medium text-gray-700">{dept.budgetString}</td>
                    <td className="py-4 px-4 text-right flex justify-end gap-2">
                      {dept._id && (
                        <>
                          <button onClick={() => { setEditDept({...dept, budgetNum: dept.budgetNum || ''}); setIsEditModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit Department">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => handleDelete(dept._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete Department">
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                      <button onClick={() => navigate('/employees', { state: { initialSearch: dept.name } })} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded text-xs font-bold hover:bg-gray-50">
                        View Members
                      </button>
                    </td>
                  </tr>
                ))}
                {departments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500 font-medium">No departments found. Click 'Create Department' to add one.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Create New Department</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateDepartment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Department Name *</label>
                <input 
                  type="text" 
                  required
                  value={newDept.name}
                  onChange={(e) => setNewDept({...newDept, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g. Finance, Human Resources"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Department Head</label>
                  <input 
                    type="text" 
                    value={newDept.head}
                    onChange={(e) => setNewDept({...newDept, head: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Amit Desai"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Head Role</label>
                  <input 
                    type="text" 
                    value={newDept.headRole}
                    onChange={(e) => setNewDept({...newDept, headRole: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. VP Finance"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Annual Budget Override (Optional)</label>
                <input 
                  type="number" 
                  value={newDept.budget}
                  onChange={(e) => setNewDept({...newDept, budget: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 5000000"
                />
                <p className="text-[11px] text-gray-500 mt-1">If left blank, budget is auto-calculated based on employee salaries.</p>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? 'Creating...' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Department Modal */}
      {isEditModalOpen && editDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Edit Department</h2>
              <button onClick={() => { setIsEditModalOpen(false); setEditDept(null); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateDepartment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Department Name *</label>
                <input 
                  type="text" 
                  required
                  value={editDept.name}
                  onChange={(e) => setEditDept({...editDept, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Department Head</label>
                  <input 
                    type="text" 
                    value={editDept.head}
                    onChange={(e) => setEditDept({...editDept, head: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Head Role</label>
                  <input 
                    type="text" 
                    value={editDept.headRole}
                    onChange={(e) => setEditDept({...editDept, headRole: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Annual Budget Override (Optional)</label>
                <input 
                  type="number" 
                  value={editDept.budgetNum}
                  onChange={(e) => setEditDept({...editDept, budgetNum: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-[11px] text-gray-500 mt-1">If left blank, budget is auto-calculated based on employee salaries.</p>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsEditModalOpen(false); setEditDept(null); }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-70"
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
