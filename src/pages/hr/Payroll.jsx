import React, { useState, useEffect } from 'react';
import { Search, Edit2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Payroll() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchPayrollData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/payroll', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      } else {
        toast.error('Failed to load payroll data');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error');
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (emp) => {
    setEditingId(emp.id);
    setEditFormData({ ...emp.payroll });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSaveClick = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/payroll/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });
      
      if (res.ok) {
        toast.success("Payroll updated successfully");
        fetchPayrollData();
        setEditingId(null);
      } else {
        toast.error("Failed to update payroll");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating payroll");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : Number(value)
    }));
  };

  const formatCurrency = (val) => {
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  const getRoleBadgeStyle = (role) => {
    switch(role) {
      case 'SECURED EXEC': return 'bg-blue-50 text-blue-600';
      case 'HR': return 'bg-purple-100 text-purple-600';
      case 'UNSECURED LOAN MANAGER': return 'bg-teal-50 text-teal-600';
      case 'AGENT MANAGER': return 'bg-orange-50 text-orange-600';
      case 'AGENT EXEC': return 'bg-pink-50 text-pink-600';
      case 'SECURED LOAN MANAGER': return 'bg-amber-50 text-amber-600';
      case 'REPORTING MANAGER': return 'bg-red-50 text-red-600';
      case 'TELECALLER': return 'bg-fuchsia-50 text-fuchsia-600';
      case 'SENIOR TELECALLER': return 'bg-indigo-50 text-indigo-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="w-full bg-[#f4f7fb] min-h-screen">
      
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
        <p className="text-[14px] text-gray-500 font-medium">View and edit employee salary structures</p>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by name, ID, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-[14px] text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 transition-shadow shadow-sm placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="px-6 pb-10">
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Gross Monthly</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Gross Yearly</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Transport</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Perf. Bonus</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Achievement</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Incentives</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredEmployees.map((emp) => {
                  const isEditing = editingId === emp.id;
                  
                  return (
                    <tr key={emp.id} className={`hover:bg-gray-50/50 transition-colors ${isEditing ? 'bg-blue-50/30' : ''}`}>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-[13px] font-bold text-gray-800">{emp.name}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{emp.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${getRoleBadgeStyle(emp.role)}`}>
                          {emp.role}
                        </span>
                      </td>
                      
                      {/* Editing Fields vs View Mode */}
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input type="number" name="grossMonthly" value={editFormData.grossMonthly} onChange={handleChange} className="w-24 border border-gray-300 rounded px-2 py-1 text-[13px] focus:outline-none focus:border-blue-500 font-medium" />
                        ) : (
                          <p className="text-[13px] font-bold text-gray-600">{formatCurrency(emp.payroll.grossMonthly)}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input type="number" name="grossYearly" value={editFormData.grossYearly} onChange={handleChange} className="w-24 border border-gray-300 rounded px-2 py-1 text-[13px] focus:outline-none focus:border-blue-500 font-medium" />
                        ) : (
                          <p className="text-[13px] font-bold text-gray-600">{formatCurrency(emp.payroll.grossYearly)}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input type="number" name="transport" value={editFormData.transport} onChange={handleChange} className="w-20 border border-gray-300 rounded px-2 py-1 text-[13px] focus:outline-none focus:border-blue-500 font-medium" />
                        ) : (
                          <p className="text-[13px] font-bold text-gray-600">{formatCurrency(emp.payroll.transport)}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input type="number" name="perfBonus" value={editFormData.perfBonus} onChange={handleChange} className="w-20 border border-gray-300 rounded px-2 py-1 text-[13px] focus:outline-none focus:border-blue-500 font-medium" />
                        ) : (
                          <p className="text-[13px] font-bold text-gray-600">{formatCurrency(emp.payroll.perfBonus)}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input type="number" name="achievement" value={editFormData.achievement} onChange={handleChange} className="w-20 border border-gray-300 rounded px-2 py-1 text-[13px] focus:outline-none focus:border-blue-500 font-medium" />
                        ) : (
                          <p className="text-[13px] font-bold text-gray-600">{formatCurrency(emp.payroll.achievement)}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input type="number" name="incentives" value={editFormData.incentives} onChange={handleChange} className="w-20 border border-gray-300 rounded px-2 py-1 text-[13px] focus:outline-none focus:border-blue-500 font-medium" />
                        ) : (
                          <p className="text-[13px] font-bold text-gray-600">{formatCurrency(emp.payroll.incentives)}</p>
                        )}
                      </td>
                      
                      {/* Action buttons */}
                      <td className="py-3 px-4 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleSaveClick(emp.id)} className="flex items-center gap-1 bg-[#16a34a] hover:bg-green-700 text-white px-3 py-1.5 rounded text-[12px] font-bold transition-colors">
                              <Check size={14} strokeWidth={3} /> Save
                            </button>
                            <button onClick={handleCancelClick} className="flex items-center gap-1 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded text-[12px] font-bold transition-colors">
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => handleEditClick(emp)} className="inline-flex items-center justify-center gap-1.5 border border-blue-200 text-blue-600 hover:bg-blue-50 px-4 py-1.5 rounded-md text-[12px] font-bold transition-colors w-[80px]">
                            <Edit2 size={12} strokeWidth={2.5} /> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-gray-500 text-sm font-medium">
                      No employees found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
