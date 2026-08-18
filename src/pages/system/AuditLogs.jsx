import React from "react";
import { Link } from "react-router-dom";
import { 
  Search,
  Filter,
  Download,
  Calendar,
  History,
  LogIn,
  Edit,
  Trash2,
  FilePlus,
  ShieldAlert
} from "lucide-react";

const mockLogs = [
  { id: "LOG-9001", user: "Admin User", role: "Super Admin", action: "User Login", resource: "System", timestamp: "18 May 2025, 09:12 AM", status: "Success", icon: <LogIn size={14} className="text-blue-500" />, bg: "bg-blue-50" },
  { id: "LOG-9002", user: "Ravi Kumar", role: "Loan Officer", action: "Created Application", resource: "Loan Application (LN-2025-081)", timestamp: "18 May 2025, 10:45 AM", status: "Success", icon: <FilePlus size={14} className="text-[#489b0d]" />, bg: "bg-[#489b0d]/10" },
  { id: "LOG-9003", user: "Neha Singh", role: "Branch Manager", action: "Approved Top-up", resource: "Top-up Request (TR-045)", timestamp: "18 May 2025, 11:20 AM", status: "Success", icon: <Edit size={14} className="text-purple-500" />, bg: "bg-purple-50" },
  { id: "LOG-9004", user: "System", role: "System", action: "Automated Backup", resource: "Database", timestamp: "18 May 2025, 12:00 AM", status: "Success", icon: <History size={14} className="text-slate-500" />, bg: "bg-slate-100" },
  { id: "LOG-9005", user: "Unknown", role: "N/A", action: "Failed Login Attempt", resource: "Authentication", timestamp: "18 May 2025, 02:15 PM", status: "Failed", icon: <ShieldAlert size={14} className="text-red-500" />, bg: "bg-red-50" },
  { id: "LOG-9006", user: "Admin User", role: "Super Admin", action: "Deleted User", resource: "User (ID: 45)", timestamp: "17 May 2025, 04:30 PM", status: "Success", icon: <Trash2 size={14} className="text-orange-500" />, bg: "bg-orange-50" },
];

export default function AuditLogs() {
  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Audit Logs</h1>
          <p className="text-[12px] font-medium text-slate-500">Track and monitor all system activities and user actions</p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search logs by user, action..." 
              className="h-10 pl-9 pr-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-white w-[250px]"
            />
          </div>
          <div className="h-10 px-3 flex items-center justify-between rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 bg-white min-w-[150px]">
            <span className="truncate">Last 7 Days</span>
            <Calendar size={14} className="text-slate-400 ml-2" />
          </div>
          <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={14} /> Filter
          </button>
          <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Actions (7D)</p>
          <h3 className="text-2xl font-extrabold text-slate-800">14,592</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Critical Alerts</p>
          <h3 className="text-2xl font-extrabold text-red-500">18</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Users Today</p>
          <h3 className="text-2xl font-extrabold text-blue-500">45</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Failed Logins</p>
          <h3 className="text-2xl font-extrabold text-orange-500">12</h3>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col overflow-hidden flex-1">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Log ID</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">User / Role</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Action</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Resource</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-6 text-[12px] font-bold text-slate-600">{log.id}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-[13px] font-bold text-slate-800">{log.user}</p>
                      <p className="text-[11px] font-medium text-slate-500">{log.role}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${log.bg}`}>
                        {log.icon}
                      </div>
                      <span className="text-[13px] font-semibold text-slate-700">{log.action}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[13px] font-medium text-slate-600">{log.resource}</td>
                  <td className="py-3 px-4 text-[12px] font-semibold text-slate-500">{log.timestamp}</td>
                  <td className="py-3 px-6 text-right">
                    {log.status === "Success" ? (
                      <span className="inline-flex items-center justify-center px-2 py-1 rounded text-[11px] font-extrabold bg-[#489b0d]/10 text-[#489b0d]">Success</span>
                    ) : (
                      <span className="inline-flex items-center justify-center px-2 py-1 rounded text-[11px] font-extrabold bg-red-100 text-red-500">Failed</span>
                    )}
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
