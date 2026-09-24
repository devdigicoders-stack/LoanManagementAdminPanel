import React, { useState } from 'react';
import { Eye, Filter, Search, ClipboardList, CheckCircle2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TablePagination from '../../components/TablePagination';

const mockAssigned = [];


const priorityStyle = {
  Normal: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
  Medium: 'bg-[#DFF3FF] text-[#0369A1] border-[#BFE7F7]',
  High: 'bg-[#FFF8E7] text-[#D97706] border-[#FDE68A]',
  Urgent: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
};

const statusStyle = {
  'Under Review': 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]',
  'Documents Pending': 'bg-[#FFF8E7] text-[#D97706] border-[#FDE68A]',
  'Verification Pending': 'bg-[#DFF3FF] text-[#0369A1] border-[#BFE7F7]',
  'Completed': 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
};

export default function AssignedApplications() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <div className="w-full bg-[#FAFCFD] min-h-screen p-4 space-y-6 pb-12">

      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-[24px] p-8 border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#DFF3FF] to-[#FFF8E7] rounded-full blur-3xl opacity-70 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#344054] tracking-tight">Assigned Applications</h1>
            <p className="text-[15px] text-[#667085] font-medium mt-2">View and process applications assigned to you by the operations manager.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#DFF3FF] border border-[#BFE7F7] rounded-xl px-4 py-2">
              <User size={16} className="text-[#0284C7]" />
              <span className="text-[13px] font-bold text-[#0369A1]">Assigned to: You</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-[24px] border border-[#D9EAF2] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]" />
          <input type="text" placeholder="Search by Application ID, Customer Name or Mobile Number..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8ED3F4] text-[14px] font-medium text-[#344054] transition-all" />
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="px-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:ring-2 focus:ring-[#8ED3F4] focus:outline-none text-[14px] font-bold text-[#344054] cursor-pointer min-w-[130px]">
            <option value="">All Status</option>
            <option>Under Review</option>
            <option>Documents Pending</option>
            <option>Verification Pending</option>
          </select>
          <select className="px-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:ring-2 focus:ring-[#8ED3F4] focus:outline-none text-[14px] font-bold text-[#344054] cursor-pointer min-w-[130px]">
            <option value="">All Priority</option>
            <option>Normal</option>
            <option>High</option>
            <option>Urgent</option>
          </select>
          <button className="flex items-center gap-2 px-5 py-3 bg-[#BFE7F7] text-[#0369A1] rounded-xl font-bold text-[14px] hover:bg-[#8ED3F4] transition-colors shadow-sm">
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#EFF9FE] border-b border-[#D9EAF2]">
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Application ID</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Customer</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Loan Type</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Amount</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Priority</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Status</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0FAFF]">
              {mockAssigned.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#667085] font-medium text-[13px]">
                    No assigned applications found.
                  </td>
                </tr>
              ) : mockAssigned.map((app) => (
                <tr key={app.id} className="hover:bg-[#F7FCFF] transition-colors group">
                  <td className="py-4 px-5">
                    <p className="text-[13px] font-black text-[#0284C7] cursor-pointer hover:underline" onClick={() => navigate(`/operations/applications/${app.id}`)}>{app.id}</p>
                    <p className="text-[11px] text-[#667085] mt-0.5">{app.date}</p>
                  </td>
                  <td className="py-4 px-5">
                    <p className="text-[13px] font-bold text-[#344054]">{app.customer}</p>
                    <p className="text-[11px] text-[#667085]">{app.mobile}</p>
                  </td>
                  <td className="py-4 px-5 text-[13px] text-[#344054]">{app.type}</td>
                  <td className="py-4 px-5 text-[13px] font-bold text-[#344054]">{app.amount}</td>
                  <td className="py-4 px-5">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md border ${priorityStyle[app.priority]}`}>{app.priority}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md border ${statusStyle[app.status] || 'bg-[#FAFCFD] text-[#667085] border-[#D9EAF2]'}`}>{app.status}</span>
                  </td>
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
        <TablePagination
          currentPage={currentPage}
          totalItems={mockAssigned.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => setPageSize(size)}
        />
      </div>
    </div>
  );
}
