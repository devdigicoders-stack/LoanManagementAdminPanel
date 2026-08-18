import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const mockLogs = [
  { id: 1, name: 'Ravi Kumar', activity: 'Login', ip: '192.168.1.10', time: '18 May 2025, 10:30 AM', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Ravi Kumar', activity: 'Created Application', ip: '192.168.1.10', time: '18 May 2025, 10:45 AM', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 3, name: 'Priya Sharma', activity: 'Login', ip: '192.168.1.12', time: '18 May 2025, 09:45 AM', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 4, name: 'Amit Verma', activity: 'Updated Application', ip: '192.168.1.15', time: '18 May 2025, 09:15 AM', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 5, name: 'Neha Singh', activity: 'Uploaded Document', ip: '192.168.1.18', time: '18 May 2025, 08:30 AM', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 6, name: 'Suresh Patel', activity: 'Assigned Lead', ip: '192.168.1.22', time: '17 May 2025, 05:10 PM', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 7, name: 'John Doe', activity: 'Login', ip: '192.168.1.25', time: '17 May 2025, 08:45 PM', avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: 8, name: 'Emily Davis', activity: 'Created Lead', ip: '192.168.1.28', time: '17 May 2025, 04:30 PM', avatar: 'https://i.pravatar.cc/150?u=7' },
];

export default function EmployeeActivityLogs() {
  return (
    <div className="w-full space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Activity / Login Logs</h1>
          <p className="text-[13px] text-slate-500 font-medium">Track employee logins and activities</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-bold text-slate-600 focus:outline-none focus:border-[#489b0d] shadow-sm">
            <option>All Activities</option>
            <option>Login / Logout</option>
            <option>Document Uploads</option>
            <option>Application Updates</option>
          </select>
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-bold text-slate-600 shadow-sm cursor-pointer">
            <Calendar size={14} className="text-slate-400" />
            01 May 2025 - 18 May 2025
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase">Employee</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase">Activity</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase">IP Address</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img src={log.avatar} alt={log.name} className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                      <p className="text-[13px] font-bold text-slate-800">{log.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[13px] font-bold text-slate-700">{log.activity}</td>
                  <td className="py-4 px-6 text-[13px] font-medium text-slate-500 font-mono">{log.ip}</td>
                  <td className="py-4 px-6 text-[12px] font-medium text-slate-500">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-center bg-white">
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">
              <ChevronLeft size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#489b0d] text-white font-bold text-[13px] shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">2</button>
            <span className="px-1 text-slate-400 text-[13px]">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">10</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
