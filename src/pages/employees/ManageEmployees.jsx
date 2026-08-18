import React from 'react';
import { 
  Users, UserCheck, UserMinus, Briefcase, Award, Search, Filter, 
  Download, Plus, Eye, MoreVertical, ChevronLeft, ChevronRight,
  Calendar, TrendingUp, TrendingDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

const topKpis = [
  { label: 'Total Employees', value: '156', change: '+12.5%', isUp: true, icon: Users, color: 'text-[#489b0d]', bg: 'bg-[#489b0d]/10' },
  { label: 'Active Employees', value: '142', change: '+8.6%', isUp: true, icon: UserCheck, color: 'text-[#489b0d]', bg: 'bg-[#489b0d]/10' },
  { label: 'Inactive Employees', value: '14', change: '-3.2%', isUp: false, icon: UserMinus, color: 'text-red-500', bg: 'bg-red-50' },
  { label: 'Departments', value: '8', change: '-', isUp: null, icon: Briefcase, color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: 'Designations', value: '12', change: '-', isUp: null, icon: Award, color: 'text-orange-500', bg: 'bg-orange-50' },
];

const mockEmployees = [
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
            placeholder="Search employees, email, mobile..." 
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
          <div key={idx} className="flex-1 min-w-[210px] bg-white rounded-lg border border-slate-100 p-5 shadow-sm flex items-center gap-4">
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
            <select className="px-3 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-bold text-slate-600 focus:outline-none focus:border-[#489b0d] min-w-[140px] shrink-0">
              <option>All Departments</option>
            </select>
            <select className="px-3 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-bold text-slate-600 focus:outline-none focus:border-[#489b0d] min-w-[140px] shrink-0">
              <option>All Designations</option>
            </select>
            <select className="px-3 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-bold text-slate-600 focus:outline-none focus:border-[#489b0d] min-w-[120px] shrink-0">
              <option>All Status</option>
            </select>
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-bold text-slate-600 cursor-pointer shrink-0">
              <Calendar size={14} className="text-slate-400 shrink-0" />
              01 May 2025 - 18 May 2025
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-md text-[12px] font-bold hover:bg-slate-50 transition-colors shrink-0">
              <Filter size={14} className="shrink-0" /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#489b0d]/10 text-[#489b0d] rounded-md text-[12px] font-bold hover:bg-[#489b0d]/20 transition-colors border border-[#489b0d]/20 shrink-0">
              <Download size={14} className="shrink-0" /> Export
            </button>
          </div>
          
          <Link to="/employees/add" className="flex items-center justify-center gap-2 px-4 py-2 bg-[#489b0d] text-white rounded-md text-[12px] font-bold hover:bg-[#3e850b] transition-colors shadow-sm w-full md:w-auto shrink-0">
            <Plus size={16} /> Add Employee
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="py-4 px-5 w-10"><input type="checkbox" className="rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]" /></th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-800 tracking-wide">EMPLOYEE ID</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-800 tracking-wide">EMPLOYEE</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-800 tracking-wide">DEPARTMENT</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-800 tracking-wide">DESIGNATION</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-800 tracking-wide">BRANCH</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-800 tracking-wide">STATUS</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-800 tracking-wide">LAST LOGIN</th>
                <th className="py-4 px-5 text-[11px] font-bold text-slate-800 tracking-wide text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
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
                  <td className="py-3.5 px-5 text-[12px] font-semibold text-slate-600 whitespace-nowrap">{emp.branch}</td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    {emp.status === 'Active' ? (
                      <span className="inline-flex items-center text-[10px] font-bold text-[#489b0d] bg-[#489b0d]/10 px-2 py-0.5 rounded-md">Active</span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-md">Inactive</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-[12px] font-medium text-slate-500 whitespace-nowrap">{emp.lastLogin}</td>
                  <td className="py-3.5 px-5 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link to={`/employees/${emp.id}`} className="p-1.5 text-slate-400 hover:text-[#489b0d] hover:bg-green-50 rounded-lg transition-colors">
                        <Eye size={16} />
                      </Link>
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between mt-auto bg-white">
          <p className="text-[12px] font-medium text-slate-500">Showing 1 to 8 of 156 entries</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">
              <ChevronLeft size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#489b0d] text-white font-bold text-[13px] shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">4</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">5</button>
            <span className="px-1 text-slate-400 text-[13px]">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">20</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
