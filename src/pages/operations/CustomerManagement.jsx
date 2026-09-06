import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Eye, Download, Users, FileText, History, FileSearch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockCustomers = [];


export default function CustomerManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const getStatusStyle = (status) => {
    switch(status) {
      case 'Under Review': return 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]';
      case 'Verification Pending': return 'bg-[#FFF8E7] text-[#D97706] border-[#FDE68A]';
      case 'Approved': return 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';
      default: return 'bg-[#FAFCFD] text-[#344054] border-[#D9EAF2]';
    }
  };

  return (
    <div className="w-full bg-[#FAFCFD] min-h-screen p-4 space-y-6">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-[24px] p-8 border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#DFF3FF] to-[#FFF8E7] rounded-full blur-3xl opacity-70 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#344054] tracking-tight">Customer Management</h1>
            <p className="text-[15px] text-[#667085] font-medium mt-2">View customer information and their associated loan applications.</p>
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
            placeholder="Search customer by name, mobile or customer ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8ED3F4] text-[14px] font-medium text-[#344054] transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select className="px-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8ED3F4] text-[14px] font-bold text-[#344054] cursor-pointer min-w-[140px] transition-all">
            <option value="">All Cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
          </select>
          <select className="px-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8ED3F4] text-[14px] font-bold text-[#344054] cursor-pointer min-w-[140px] transition-all">
            <option value="">All Occupations</option>
            <option value="Salaried">Salaried</option>
            <option value="Self-Employed">Self-Employed</option>
          </select>
          <button className="flex items-center justify-center gap-2 px-5 py-3 bg-[#BFE7F7] text-[#0369A1] rounded-xl font-bold text-[14px] hover:bg-[#8ED3F4] transition-colors shadow-sm">
             <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#EFF9FE] border-b border-[#D9EAF2]">
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Customer Info</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Professional Info</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Active Application</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0FAFF]">
              {mockCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-[#667085] font-medium text-[13px]">
                    No customers found.
                  </td>
                </tr>
              ) : mockCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#F7FCFF] transition-colors group">
                  
                  {/* Customer Info */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#DFF3FF] flex items-center justify-center text-[#0284C7] font-bold text-[13px] border border-[#BFE7F7]">
                        {cust.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-[#344054]">{cust.name}</span>
                        <span className="text-[12px] font-semibold text-[#667085]">{cust.id} • {cust.mobile}</span>
                      </div>
                    </div>
                  </td>

                  {/* Professional Info */}
                  <td className="py-4 px-5">
                    <p className="text-[13px] font-black text-[#344054]">{cust.occupation}</p>
                    <p className="text-[11px] font-semibold text-[#667085] mt-0.5">{cust.income} / Month</p>
                  </td>

                  {/* Active Application */}
                  <td className="py-4 px-5">
                    <div className="flex flex-col items-start gap-1">
                      <p className="text-[13px] font-black text-[#0284C7] hover:underline cursor-pointer" onClick={() => navigate(`/operations/applications/${cust.activeApp}`)}>{cust.activeApp}</p>
                      <span className={`px-2 py-0.5 text-[10px] font-black rounded-md border uppercase tracking-wide mt-1 ${getStatusStyle(cust.status)}`}>
                        {cust.status}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => navigate(`/operations/customers/${cust.id}`)} className="p-1.5 text-[#667085] hover:text-[#0284C7] hover:bg-[#DFF3FF] rounded-lg transition-colors" title="View Customer">
                        <Users size={16} />
                      </button>
                      <button onClick={() => navigate(`/operations/applications/${cust.activeApp}`)} className="p-1.5 text-[#667085] hover:text-[#D97706] hover:bg-[#FFF8E7] rounded-lg transition-colors" title="View Application">
                        <FileText size={16} />
                      </button>
                      <button className="p-1.5 text-[#667085] hover:text-[#059669] hover:bg-[#ECFDF5] rounded-lg transition-colors" title="Documents">
                        <FileSearch size={16} />
                      </button>
                      <button className="p-1.5 text-[#667085] hover:text-[#7E22CE] hover:bg-[#F3E8FF] rounded-lg transition-colors" title="History">
                        <History size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
