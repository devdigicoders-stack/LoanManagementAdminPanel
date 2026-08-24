import { useState } from 'react';
import { Search, Plus, MoreVertical, Eye, Edit, Trash2, Shield, UserCheck, UserX, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function ManageEmployees() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');

  // Mock data for employees
  const [employees, setEmployees] = useState([
    { id: 'EMP-1001', name: 'Ravi Kumar', email: 'ravi@ngm.com', phone: '+91 9876543210', department: 'Sales', designation: 'Sales Executive', status: 'Active', joinDate: '2023-01-15' },
    { id: 'EMP-1002', name: 'Priya Singh', email: 'priya@ngm.com', phone: '+91 9876543211', department: 'HR', designation: 'HR Manager', status: 'Active', joinDate: '2022-11-01' },
    { id: 'EMP-1003', name: 'Amit Sharma', email: 'amit@ngm.com', phone: '+91 9876543212', department: 'Operations', designation: 'Operations Head', status: 'On Leave', joinDate: '2021-05-20' },
    { id: 'EMP-1004', name: 'Neha Gupta', email: 'neha@ngm.com', phone: '+91 9876543213', department: 'Credit', designation: 'Credit Analyst', status: 'Inactive', joinDate: '2023-08-10' },
  ]);

  const departments = ['All', 'Sales', 'HR', 'Operations', 'Credit', 'Accounts'];

  const handleStatusChange = (id, currentStatus) => {
    const actionText = currentStatus === 'Active' ? 'Deactivate' : 'Activate';
    
    Swal.fire({
      title: `${actionText} Employee?`,
      text: `Are you sure you want to ${actionText.toLowerCase()} this employee?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: currentStatus === 'Active' ? '#ef4444' : '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: `Yes, ${actionText}`
    }).then((result) => {
      if (result.isConfirmed) {
        setEmployees(employees.map(emp => {
          if (emp.id === id) {
            return { ...emp, status: currentStatus === 'Active' ? 'Inactive' : 'Active' };
          }
          return emp;
        }));
        toast.success(`Employee ${actionText.toLowerCase()}d successfully`);
      }
    });
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === 'All' || emp.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="w-full space-y-6 pb-10 bg-[var(--color-brand-page-bg)] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)] mb-1">Employee Management</h1>
          <p className="text-[13px] text-[var(--color-brand-text-secondary)] font-medium">Manage all company employees, their roles and statuses</p>
        </div>
        <button 
          onClick={() => navigate('/employees/add')}
          className="flex items-center gap-2 bg-[var(--color-brand-blue-primary)] hover:bg-[var(--color-brand-blue-dark)] text-white px-4 py-2.5 rounded-[10px] text-[13px] font-semibold transition-all shadow-sm"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-5 rounded-[18px] border border-[var(--color-brand-border)] flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="w-full md:w-auto bg-white border border-[var(--color-brand-border)] text-[var(--color-brand-text)] text-[13px] rounded-[10px] px-4 py-2.5 focus:outline-none focus:border-[var(--color-brand-blue-dark)]"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept} Department</option>
            ))}
          </select>
        </div>
        
        <div className="relative w-full md:w-[300px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2.5 pl-10 pr-4 text-[13px] text-[var(--color-brand-text)] focus:outline-none focus:border-[var(--color-brand-blue-dark)]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[var(--color-brand-border)] rounded-[18px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-brand-sky-pale)] border-b border-[var(--color-brand-border)]">
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider">Employee</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider">Contact</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider">Department</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-brand-border)]">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-[var(--color-brand-hover-bg)] transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-brand-sky-light)] flex items-center justify-center text-[var(--color-brand-blue-dark)] font-bold text-sm shrink-0">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[var(--color-brand-text)]">{emp.name}</p>
                        <p className="text-[12px] text-[var(--color-brand-text-secondary)] mt-0.5">{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] text-[var(--color-brand-text)] font-medium">{emp.email}</p>
                    <p className="text-[12px] text-[var(--color-brand-text-secondary)] mt-0.5">{emp.phone}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] text-[var(--color-brand-text)] font-bold">{emp.department}</p>
                    <p className="text-[12px] text-[var(--color-brand-text-secondary)] mt-0.5">{emp.designation}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold
                      ${emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                        emp.status === 'Inactive' ? 'bg-slate-100 text-slate-600' : 
                        'bg-[var(--color-brand-cream)] text-amber-600'}`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 transition-opacity">
                      <button 
                        onClick={() => navigate(`/employees/${emp.id}`)}
                        className="p-1.5 text-[var(--color-brand-text-secondary)] hover:text-[var(--color-brand-blue-dark)] hover:bg-[var(--color-brand-sky-light)] rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => navigate(`/employees/${emp.id}/edit`)}
                        className="p-1.5 text-[var(--color-brand-text-secondary)] hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                        title="Edit Employee"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(emp.id, emp.status)}
                        className={`p-1.5 rounded-md transition-colors ${
                          emp.status === 'Active' 
                            ? 'text-[var(--color-brand-text-secondary)] hover:text-red-600 hover:bg-red-50' 
                            : 'text-[var(--color-brand-text-secondary)] hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={emp.status === 'Active' ? 'Deactivate' : 'Activate'}
                      >
                        {emp.status === 'Active' ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredEmployees.length === 0 && (
            <div className="p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--color-brand-gray-light)] flex items-center justify-center mx-auto mb-3">
                <Users size={24} className="text-[var(--color-brand-text-secondary)]" />
              </div>
              <p className="text-[14px] font-bold text-[var(--color-brand-text)]">No employees found</p>
              <p className="text-[13px] text-[var(--color-brand-text-secondary)] mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-[var(--color-brand-border)] flex items-center justify-between bg-white">
          <p className="text-[12px] text-[var(--color-brand-text-secondary)] font-medium">Showing <span className="font-bold text-[var(--color-brand-text)]">{filteredEmployees.length}</span> entries</p>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 text-[12px] font-semibold text-[var(--color-brand-text-secondary)] border border-[var(--color-brand-border)] rounded-md hover:bg-[var(--color-brand-gray-light)] transition-colors">Prev</button>
            <button className="px-3 py-1.5 text-[12px] font-semibold text-white bg-[var(--color-brand-blue-primary)] rounded-md">1</button>
            <button className="px-3 py-1.5 text-[12px] font-semibold text-[var(--color-brand-text-secondary)] border border-[var(--color-brand-border)] rounded-md hover:bg-[var(--color-brand-gray-light)] transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
