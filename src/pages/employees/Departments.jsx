import { useState } from 'react';
import { Search, Plus, Edit, Building2, Users } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function Departments() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [departments, setDepartments] = useState([
    { id: 'DEPT-01', name: 'HR', head: 'Priya Singh', totalEmployees: 12, activeEmployees: 10, status: 'Active' },
    { id: 'DEPT-02', name: 'Operations', head: 'Amit Sharma', totalEmployees: 45, activeEmployees: 42, status: 'Active' },
    { id: 'DEPT-03', name: 'Sales', head: 'Ravi Kumar', totalEmployees: 80, activeEmployees: 75, status: 'Active' },
    { id: 'DEPT-04', name: 'Accounts', head: 'Neha Gupta', totalEmployees: 15, activeEmployees: 15, status: 'Active' },
    { id: 'DEPT-05', name: 'Credit', head: 'Suresh Patil', totalEmployees: 25, activeEmployees: 24, status: 'Active' },
  ]);

  const handleStatusToggle = (id, currentStatus) => {
    const action = currentStatus === 'Active' ? 'Deactivate' : 'Activate';
    
    Swal.fire({
      title: `${action} Department?`,
      text: `Are you sure you want to ${action.toLowerCase()} this department?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: currentStatus === 'Active' ? '#ef4444' : '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: `Yes, ${action}`
    }).then((result) => {
      if (result.isConfirmed) {
        setDepartments(departments.map(dept => 
          dept.id === id ? { ...dept, status: currentStatus === 'Active' ? 'Inactive' : 'Active' } : dept
        ));
        toast.success(`Department ${action.toLowerCase()}d successfully`);
      }
    });
  };

  const handleAddDepartment = () => {
    Swal.fire({
      title: 'Add New Department',
      html: `
        <input id="swal-input1" class="swal2-input text-sm" placeholder="Department Name" style="width: 80%; border-radius: 8px; border: 1px solid #D9EAF2;">
        <input id="swal-input2" class="swal2-input text-sm" placeholder="Department Head" style="width: 80%; border-radius: 8px; border: 1px solid #D9EAF2;">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save',
      confirmButtonColor: '#8ED3F4',
      preConfirm: () => {
        const name = document.getElementById('swal-input1').value;
        const head = document.getElementById('swal-input2').value;
        if (!name) {
          Swal.showValidationMessage('Please enter department name');
        }
        return { name, head };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success('Department created successfully!');
      }
    });
  };

  const filteredDepts = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 pb-10 bg-[var(--color-brand-page-bg)] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)] mb-1">Department Management</h1>
          <p className="text-[13px] text-[var(--color-brand-text-secondary)] font-medium">Manage organizational departments and team heads</p>
        </div>
        <button 
          onClick={handleAddDepartment}
          className="flex items-center gap-2 bg-[var(--color-brand-blue-primary)] hover:bg-[var(--color-brand-blue-dark)] text-white px-4 py-2.5 rounded-[10px] text-[13px] font-semibold transition-all shadow-sm"
        >
          <Plus size={16} />
          Add Department
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[14px] border border-[var(--color-brand-border)] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-[12px] bg-[var(--color-brand-sky-light)] flex items-center justify-center shrink-0">
            <Building2 size={20} className="text-[var(--color-brand-blue-dark)]" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-0.5">Total Departments</h4>
            <h3 className="text-2xl font-extrabold text-[var(--color-brand-text)]">{departments.length}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[14px] border border-[var(--color-brand-border)] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-[12px] bg-emerald-50 flex items-center justify-center shrink-0">
            <Users size={20} className="text-emerald-600" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-0.5">Total Employees</h4>
            <h3 className="text-2xl font-extrabold text-[var(--color-brand-text)]">
              {departments.reduce((acc, curr) => acc + curr.totalEmployees, 0)}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[18px] border border-[var(--color-brand-border)] overflow-hidden shadow-sm">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-[var(--color-brand-border)] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--color-brand-sky-pale)]">
          <h2 className="text-[16px] font-bold text-[var(--color-brand-text)]">Department List</h2>
          <div className="relative w-full sm:w-[280px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2 pl-10 pr-4 text-[13px] text-[var(--color-brand-text)] focus:outline-none focus:border-[var(--color-brand-blue-dark)] shadow-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-brand-border)]">
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white">Department</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white">Head</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white text-center">Employees</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white">Status</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-brand-border)]">
              {filteredDepts.map((dept) => (
                <tr key={dept.id} className="hover:bg-[var(--color-brand-hover-bg)] transition-colors group">
                  <td className="py-4 px-6">
                    <p className="text-[14px] font-bold text-[var(--color-brand-text)]">{dept.name}</p>
                    <p className="text-[12px] text-[var(--color-brand-text-secondary)] mt-0.5">{dept.id}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[var(--color-brand-sky-light)] flex items-center justify-center text-[var(--color-brand-blue-dark)] font-bold text-[10px] shrink-0">
                        {dept.head.charAt(0)}
                      </div>
                      <span className="text-[13px] font-bold text-[var(--color-brand-text)]">{dept.head}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <p className="text-[14px] font-bold text-[var(--color-brand-text)]">{dept.totalEmployees}</p>
                    <p className="text-[11px] text-[var(--color-brand-text-secondary)] font-semibold mt-0.5">{dept.activeEmployees} Active</p>
                  </td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => handleStatusToggle(dept.id, dept.status)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${dept.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${dept.status === 'Active' ? 'translate-x-4.5' : 'translate-x-1'}`} />
                    </button>
                    <span className="ml-2 text-[12px] font-semibold text-[var(--color-brand-text-secondary)] align-middle">{dept.status}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        className="p-1.5 text-[var(--color-brand-text-secondary)] hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredDepts.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-[14px] font-bold text-[var(--color-brand-text)]">No departments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
