import React, { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import { 
  Users, UserCheck, UserMinus, Briefcase, Award, Search, Filter, 
  Download, Plus, Eye, Trash2, Edit, ChevronLeft, ChevronRight,
  Calendar, TrendingUp, TrendingDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

const initialMockEmployees = [
  { id: 'EMP-1001', name: 'Ravi Kumar', email: 'ravi.kumar@ngm.com', department: 'Loan Department', designation: 'Loan Officer', branch: 'Lucknow Branch', status: 'Active', lastLogin: '18 May 2025, 10:30 AM', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 'EMP-1002', name: 'Priya Sharma', email: 'priya.sharma@ngm.com', department: 'Sales Department', designation: 'Sales Executive', branch: 'Lucknow Branch', status: 'Active', lastLogin: '18 May 2025, 09:45 AM', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 'EMP-1003', name: 'Amit Verma', email: 'amit.verma@ngm.com', department: 'Loan Department', designation: 'Relationship Manager', branch: 'Kanpur Branch', status: 'Active', lastLogin: '18 May 2025, 08:20 AM', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 'EMP-1004', name: 'Neha Singh', email: 'neha.singh@ngm.com', department: 'Operations', designation: 'Verification Officer', branch: 'Delhi Branch', status: 'Active', lastLogin: '17 May 2025, 06:15 PM', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 'EMP-1005', name: 'Suresh Patel', email: 'suresh.patel@ngm.com', department: 'Collections', designation: 'Collection Executive', branch: 'Lucknow Branch', status: 'Inactive', lastLogin: '15 May 2025, 04:30 PM', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 'EMP-1006', name: 'John Doe', email: 'john.doe@ngm.com', department: 'Support', designation: 'Customer Support', branch: 'Delhi Branch', status: 'Active', lastLogin: '18 May 2025, 11:05 AM', avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: 'EMP-1007', name: 'Emily Davis', email: 'emily.davis@ngm.com', department: 'Finance', designation: 'Accountant', branch: 'Lucknow Branch', status: 'Active', lastLogin: '15 May 2025, 09:10 AM', avatar: 'https://i.pravatar.cc/150?u=7' },
  { id: 'EMP-1008', name: 'Michael Brown', email: 'michael.brown@ngm.com', department: 'Admin', designation: 'System Administrator', branch: 'Head Office', status: 'Active', lastLogin: '18 May 2025, 11:30 AM', avatar: 'https://i.pravatar.cc/150?u=8' },
];

export default function ManageEmployees() {
  const [employees, setEmployees] = useState(initialMockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [desigFilter, setDesigFilter] = useState('All Designations');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Extract unique filter options dynamically
  const departments = ['All Departments', ...new Set(employees.map(e => e.department))];
  const designations = ['All Designations', ...new Set(employees.map(e => e.designation))];
  const statuses = ['All Status', 'Active', 'Inactive'];

  // Filtering Logic
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            emp.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = deptFilter === 'All Departments' || emp.department === deptFilter;
      const matchesDesig = desigFilter === 'All Designations' || emp.designation === desigFilter;
      const matchesStatus = statusFilter === 'All Status' || emp.status === statusFilter;
      
      return matchesSearch && matchesDept && matchesDesig && matchesStatus;
    });
  }, [employees, searchTerm, deptFilter, desigFilter, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const currentItems = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Dynamic KPIs
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const inactiveCount = employees.filter(e => e.status === 'Inactive').length;
  const uniqueDepts = new Set(employees.map(e => e.department)).size;
  const uniqueDesigs = new Set(employees.map(e => e.designation)).size;

  const topKpis = [
    { label: 'Total Employees', value: employees.length, change: '+12.5%', isUp: true, icon: Users, color: 'text-[#489b0d]', bg: 'bg-[#489b0d]/10' },
    { label: 'Active Employees', value: activeCount, change: '+8.6%', isUp: true, icon: UserCheck, color: 'text-[#489b0d]', bg: 'bg-[#489b0d]/10' },
    { label: 'Inactive Employees', value: inactiveCount, change: '-3.2%', isUp: false, icon: UserMinus, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Departments', value: uniqueDepts, change: '-', isUp: null, icon: Briefcase, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Designations', value: uniqueDesigs, change: '-', isUp: null, icon: Award, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  // Actions
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = employees.filter(e => e.id !== id);
        setEmployees(updated);
        
        // Adjust page if deleting last item on current page
        const newFilteredLength = updated.length;
        const newTotalPages = Math.ceil(newFilteredLength / itemsPerPage) || 1;
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }
        Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
      }
    });
  };

  // Reset page on filter change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, deptFilter, desigFilter, statusFilter]);

  return (
    <div className="w-full space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Employee Management</h1>
          <p className="text-[13px] text-slate-500 font-medium">Manage your organization employees and their activities</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search employees, email, id..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-16 py-2.5 bg-white border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-80">
            <span className="text-[10px] font-bold text-slate-400">Ctrl + K</span>
          </div>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="flex flex-wrap gap-4">
        {topKpis.map((kpi, idx) => (
          <div key={idx} className="flex-1 min-w-[210px] bg-white rounded-lg border border-slate-100 p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-md flex items-center justify-center shrink-0 ${kpi.bg} ${kpi.color}`}>
              <kpi.icon size={24} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-0.5">{kpi.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-extrabold text-slate-800 leading-none">{kpi.value}</h3>
              </div>
              {kpi.isUp !== null ? (
                <p className={`text-[10px] font-bold flex items-center gap-1 mt-1.5 ${kpi.isUp ? 'text-[#489b0d]' : 'text-red-500'}`}>
                  {kpi.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {kpi.change} <span className="text-slate-400 font-medium">vs last month</span>
                </p>
              ) : (
                <p className="text-[10px] font-bold text-slate-400 mt-1.5">-</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-bold text-slate-600 focus:outline-none focus:border-[#489b0d] min-w-[140px] shrink-0 cursor-pointer hover:bg-slate-50">
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
            <select value={desigFilter} onChange={(e) => setDesigFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-bold text-slate-600 focus:outline-none focus:border-[#489b0d] min-w-[140px] shrink-0 cursor-pointer hover:bg-slate-50">
              {designations.map(desig => <option key={desig} value={desig}>{desig}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-bold text-slate-600 focus:outline-none focus:border-[#489b0d] min-w-[120px] shrink-0 cursor-pointer hover:bg-slate-50">
              {statuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#489b0d]/10 text-[#489b0d] rounded-md text-[12px] font-bold hover:bg-[#489b0d]/20 transition-colors border border-[#489b0d]/20 shrink-0">
              <Download size={14} className="shrink-0" /> Export CSV
            </button>
          </div>
          
          <Link to="/employees/add" className="flex items-center justify-center gap-2 px-4 py-2 bg-[#489b0d] text-white rounded-md text-[12px] font-bold hover:bg-[#3e850b] transition-colors shadow-sm w-full md:w-auto shrink-0">
            <Plus size={16} /> Add Employee
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="py-4 px-5 w-10"><input type="checkbox" className="rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]" /></th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-800 tracking-wide">EMPLOYEE ID</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-800 tracking-wide">EMPLOYEE</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-800 tracking-wide">DEPARTMENT</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-800 tracking-wide">DESIGNATION</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-800 tracking-wide">STATUS</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-800 tracking-wide">LAST LOGIN</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-800 tracking-wide text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentItems.length > 0 ? currentItems.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-3.5 px-5"><input type="checkbox" className="rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]" /></td>
                  <td className="py-3.5 px-5 text-[12px] font-bold text-slate-600 whitespace-nowrap">{emp.id}</td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                      <div>
                        <p className="text-[12px] font-bold text-slate-800 leading-none mb-1">{emp.name}</p>
                        <p className="text-[11px] font-medium text-slate-500 leading-none">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-[12px] font-semibold text-slate-600 whitespace-nowrap">{emp.department}</td>
                  <td className="py-3.5 px-5 text-[12px] font-semibold text-slate-600 whitespace-nowrap">{emp.designation}</td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    {emp.status === 'Active' ? (
                      <span className="inline-flex items-center text-[10px] font-bold text-[#489b0d] bg-[#489b0d]/10 px-2 py-0.5 rounded-md">Active</span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-md">Inactive</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-[12px] font-medium text-slate-500 whitespace-nowrap">{emp.lastLogin}</td>
                  <td className="py-3.5 px-5 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2 transition-opacity">
                      <Link to={`/employees/${emp.id}`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                        <Eye size={16} />
                      </Link>
                      <Link to={`/employees/${emp.id}/edit`} className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="Edit Employee">
                        <Edit size={16} />
                      </Link>
                      <button onClick={() => handleDelete(emp.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Employee">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-500 text-sm">
                    No employees found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between mt-auto bg-slate-50/50">
          <p className="text-[12px] font-medium text-slate-500">
            Showing {filteredEmployees.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} entries
          </p>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={14} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium text-[13px] transition-colors ${
                  currentPage === page 
                    ? 'bg-[#489b0d] text-white shadow-sm' 
                    : 'border border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
