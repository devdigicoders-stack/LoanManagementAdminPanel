import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Eye, Edit, ClipboardList, Settings2, Download, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TablePagination from '../../components/TablePagination';

const mockApps = [];


export default function ApplicationManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const getStatusStyle = (status) => {
    switch(status) {
      case 'New': return 'bg-[#DFF3FF] text-[#0284C7] border-[#BFE7F7]';
      case 'In Progress': return 'bg-[#F0FAFF] text-[#0369A1] border-[#D9EAF2]';
      case 'Documents Pending': return 'bg-[#FFF8E7] text-[#D97706] border-[#FDE68A]';
      case 'Verification Pending': return 'bg-[#FEF9C3] text-[#CA8A04] border-[#FEF08A]';
      case 'Under Review': return 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]';
      case 'On Hold': return 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]';
      case 'Approved': return 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';
      case 'Rejected': return 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]';
      case 'Completed': return 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]';
      default: return 'bg-[#FAFCFD] text-[#344054] border-[#D9EAF2]';
    }
  };

  const getPriorityStyle = (priority) => {
    switch(priority) {
      case 'Urgent': return 'text-[#DC2626] bg-[#FEF2F2]';
      case 'High': return 'text-[#D97706] bg-[#FFF8E7]';
      case 'Medium': return 'text-[#0284C7] bg-[#DFF3FF]';
      default: return 'text-[#667085] bg-[#F1F5F9]';
    }
  };

  return (
    <div className="w-full bg-[#FAFCFD] min-h-screen p-4 space-y-6">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-[24px] p-8 border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#DFF3FF] to-[#FFF8E7] rounded-full blur-3xl opacity-70 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#344054] tracking-tight">Application Management</h1>
            <p className="text-[15px] text-[#667085] font-medium mt-2">View, track, and process all loan applications.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#344054] border border-[#D9EAF2] rounded-xl font-bold text-[14px] hover:bg-[#F0FAFF] shadow-sm transition-all hover:-translate-y-0.5">
               <Download size={18} /> Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-[24px] border border-[#D9EAF2] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#667085]" />
          <input 
            type="text" 
            placeholder="Search by ID, Name, Mobile, PAN..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8ED3F4] text-[14px] font-medium text-[#344054] transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select className="px-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8ED3F4] text-[14px] font-bold text-[#344054] cursor-pointer min-w-[140px] transition-all">
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Documents Pending">Documents Pending</option>
          </select>
          <select className="px-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8ED3F4] text-[14px] font-bold text-[#344054] cursor-pointer min-w-[140px] transition-all">
            <option value="">All Loan Types</option>
            <option value="Personal">Personal Loan</option>
            <option value="Home">Home Loan</option>
            <option value="Business">Business Loan</option>
          </select>
          <button className="flex items-center justify-center gap-2 px-5 py-3 bg-[#BFE7F7] text-[#0369A1] rounded-xl font-bold text-[14px] hover:bg-[#8ED3F4] transition-colors shadow-sm">
             <Filter size={18} /> Filter
          </button>
          <button className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-[#D9EAF2] text-[#667085] rounded-xl font-bold text-[14px] hover:bg-[#F0FAFF] transition-colors shadow-sm">
             <RefreshCw size={18} /> Reset
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#EFF9FE] border-b border-[#D9EAF2]">
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Application ID</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Customer Info</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Loan Details</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Status & Priority</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Assigned To</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0FAFF]">
              {mockApps.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[#667085] font-medium text-[13px]">
                    No applications found.
                  </td>
                </tr>
              ) : mockApps.map((app) => (
                <tr key={app.id} className="hover:bg-[#F7FCFF] transition-colors group">
                  
                  {/* ID & Date */}
                  <td className="py-4 px-5">
                    <p className="text-[13px] font-black text-[#344054]">{app.id}</p>
                    <p className="text-[11px] font-semibold text-[#667085] mt-0.5">{app.date}</p>
                  </td>

                  {/* Customer Info */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[8px] bg-[#DFF3FF] flex items-center justify-center text-[#344054] font-bold text-[12px] border border-[#BFE7F7]">
                        {app.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-[#344054]">{app.name}</span>
                        <span className="text-[11px] font-semibold text-[#667085]">{app.mobile}</span>
                      </div>
                    </div>
                  </td>

                  {/* Loan Details */}
                  <td className="py-4 px-5">
                    <p className="text-[13px] font-black text-[#344054]">{app.amount}</p>
                    <p className="text-[11px] font-semibold text-[#667085] mt-0.5">{app.type}</p>
                  </td>

                  {/* Status & Priority */}
                  <td className="py-4 px-5">
                    <div className="flex flex-col items-start gap-1.5">
                      <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-md border uppercase tracking-wide ${getStatusStyle(app.status)}`}>
                        {app.status}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${getPriorityStyle(app.priority)}`}>
                        {app.priority} Priority
                      </span>
                    </div>
                  </td>

                  {/* Assigned Officer */}
                  <td className="py-4 px-5">
                    {app.officer !== 'Unassigned' ? (
                      <div className="flex items-center gap-2">
                         <div className="w-5 h-5 rounded-full bg-[#FFF8E7] flex items-center justify-center text-[#D97706] font-bold text-[9px] border border-[#FDE68A]">
                           {app.officer.charAt(0)}
                         </div>
                         <span className="text-[12px] font-bold text-[#344054]">{app.officer}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-bold text-[#667085] bg-[#F1F5F9] px-2 py-1 rounded-md">Unassigned</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => navigate(`/operations/applications/${app.id}`)} className="p-1.5 text-[#667085] hover:text-[#0284C7] hover:bg-[#DFF3FF] rounded-lg transition-colors" title="View Application">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-[#667085] hover:text-[#D97706] hover:bg-[#FFF8E7] rounded-lg transition-colors" title="Documents">
                        <ClipboardList size={16} />
                      </button>
                      <button className="p-1.5 text-[#667085] hover:text-[#059669] hover:bg-[#ECFDF5] rounded-lg transition-colors" title="Update Status">
                        <CheckCircle2 size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          totalItems={mockApps.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => setPageSize(size)}
        />

      </div>
    </div>
  );
}
