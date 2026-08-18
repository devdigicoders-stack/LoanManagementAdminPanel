import { ChevronRight, ChevronLeft, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const activityData = [
  { id: 1, date: '10 May 2025, 10:30 AM', activity: 'Logged In', module: 'Authentication', ip: '192.168.1.1', details: 'User logged into the system successfully.' },
  { id: 2, date: '09 May 2025, 04:15 PM', activity: 'Created Application', module: 'Loan Management', ip: '192.168.1.1', details: 'Created new loan application for John Doe (APP-1029).' },
  { id: 3, date: '08 May 2025, 11:20 AM', activity: 'Updated Profile', module: 'User Management', ip: '192.168.1.1', details: 'Updated contact phone number.' },
  { id: 4, date: '07 May 2025, 02:45 PM', activity: 'Approved Loan', module: 'Loan Management', ip: '192.168.1.5', details: 'Approved loan application APP-1015.' },
  { id: 5, date: '05 May 2025, 09:10 AM', activity: 'Logged In', module: 'Authentication', ip: '192.168.1.1', details: 'User logged into the system successfully.' },
];

export default function UserActivityLog() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="w-full max-w-6xl mx-auto">
      
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">User Activity Log</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <Link to="/users" className="hover:text-[#489b0d] transition-colors">User Management</Link>
            <ChevronRight size={14} className="mx-1" />
            <Link to="/users" className="hover:text-[#489b0d] transition-colors">Manage Users</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-slate-800">Activity Log</span>
          </div>
        </div>
        
        <Link to="/users" className="px-4 py-2 border border-slate-200 text-slate-600 rounded-md text-[13px] font-bold hover:bg-slate-50 transition-colors bg-white shadow-sm flex items-center gap-2">
           &larr; Back to Users
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column - User Info Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <h3 className="text-[14px] font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">User Information</h3>
            
            <div className="flex items-center gap-4 mb-6">
              <img src="https://i.pravatar.cc/150?u=1" alt="Ravi Kumar" className="w-12 h-12 rounded-full border-2 border-slate-50 object-cover" />
              <div>
                <h2 className="text-[14px] font-bold text-slate-800 mb-0.5">Ravi Kumar</h2>
                <p className="text-[11px] font-bold text-[#489b0d]">Super Admin</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-0.5">Email</p>
                <p className="text-[12px] font-bold text-slate-800">ravi.kumar@ngm.com</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-0.5">Last Login</p>
                <p className="text-[12px] font-bold text-slate-800">10 May 2025, 10:30 AM</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-0.5">Status</p>
                <span className="px-2 py-0.5 bg-emerald-50 text-[#489b0d] border border-emerald-100 rounded text-[10px] font-bold inline-block mt-1">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Activity Table */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
            
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="text-[15px] font-bold text-slate-800 w-full sm:w-auto">Activity History</h3>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search activity..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-[12px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all"
                  />
                </div>
                <button className="p-2 border border-slate-200 text-slate-500 rounded-md hover:bg-slate-50 transition-colors">
                  <Filter size={16} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="py-3 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Date & Time</th>
                    <th className="py-3 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Activity</th>
                    <th className="py-3 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Module</th>
                    <th className="py-3 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">IP Address</th>
                    <th className="py-3 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {activityData.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-5 text-[12px] font-bold text-slate-700 whitespace-nowrap">{log.date}</td>
                      <td className="py-3 px-5 text-[12px] font-bold text-[#489b0d] whitespace-nowrap">{log.activity}</td>
                      <td className="py-3 px-5 text-[12px] font-medium text-slate-600 whitespace-nowrap">{log.module}</td>
                      <td className="py-3 px-5 text-[12px] font-medium text-slate-500 whitespace-nowrap">{log.ip}</td>
                      <td className="py-3 px-5 text-[12px] font-medium text-slate-500 min-w-[200px]">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between mt-auto">
              <p className="text-[12px] font-medium text-slate-500">Showing 1 to 5 of 45 entries</p>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">
                  <ChevronLeft size={14} />
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded bg-[#489b0d] text-white font-bold text-[12px] shadow-sm">
                  1
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[12px]">
                  2
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[12px]">
                  3
                </button>
                <span className="px-1 text-slate-400 text-[12px]">...</span>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
