import React from "react";
import { 
  Search,
  Filter,
  Download,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  MoreVertical
} from "lucide-react";

const mockComplaints = [
  { id: "CMP-001", customer: "Ramesh Tiwari", phone: "+91 9876543210", subject: "EMI Payment not reflected", date: "18 May 2025", status: "Pending", priority: "High" },
  { id: "CMP-002", customer: "Sunita Devi", phone: "+91 8765432109", subject: "Delay in loan disbursement", date: "17 May 2025", status: "In Progress", priority: "High" },
  { id: "CMP-003", customer: "Mohd. Ali", phone: "+91 7654321098", subject: "Update registered mobile number", date: "16 May 2025", status: "Resolved", priority: "Low" },
  { id: "CMP-004", customer: "Kavita Sharma", phone: "+91 6543210987", subject: "Foreclosure charges query", date: "16 May 2025", status: "Resolved", priority: "Medium" },
  { id: "CMP-005", customer: "Vikram Singh", phone: "+91 5432109876", subject: "Harassment by collection agent", date: "15 May 2025", status: "Escalated", priority: "Critical" },
];

export default function ManageComplaints() {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="px-2 py-1 bg-orange-100 text-orange-500 text-[11px] font-bold rounded flex items-center gap-1 w-max"><Clock size={12} /> Pending</span>;
      case "In Progress":
        return <span className="px-2 py-1 bg-blue-100 text-blue-500 text-[11px] font-bold rounded flex items-center gap-1 w-max"><Clock size={12} /> In Progress</span>;
      case "Resolved":
        return <span className="px-2 py-1 bg-[#489b0d]/10 text-[#489b0d] text-[11px] font-bold rounded flex items-center gap-1 w-max"><CheckCircle2 size={12} /> Resolved</span>;
      case "Escalated":
        return <span className="px-2 py-1 bg-red-100 text-red-500 text-[11px] font-bold rounded flex items-center gap-1 w-max"><AlertCircle size={12} /> Escalated</span>;
      default:
        return <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[11px] font-bold rounded w-max">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Critical":
        return <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-extrabold uppercase rounded w-max">{priority}</span>;
      case "High":
        return <span className="px-2 py-1 bg-orange-100 text-orange-600 text-[10px] font-extrabold uppercase rounded w-max">{priority}</span>;
      case "Medium":
        return <span className="px-2 py-1 bg-blue-100 text-blue-600 text-[10px] font-extrabold uppercase rounded w-max">{priority}</span>;
      case "Low":
        return <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase rounded w-max">{priority}</span>;
      default:
        return null;
    }
  }

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Manage Complaints</h1>
          <p className="text-[12px] font-medium text-slate-500">View, track, and resolve customer grievances</p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search complaint ID, customer..." 
              className="h-10 pl-9 pr-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-white w-[250px]"
            />
          </div>
          <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={14} /> Filter
          </button>
          <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={14} /> Export
          </button>
          <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm">
            <MessageSquare size={14} /> Log Complaint
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Active Complaints</p>
          <h3 className="text-2xl font-extrabold text-slate-800">42</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Assignment</p>
          <h3 className="text-2xl font-extrabold text-orange-500">14</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Escalated</p>
          <h3 className="text-2xl font-extrabold text-red-500">3</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Resolution Rate</p>
          <h3 className="text-2xl font-extrabold text-[#489b0d]">92%</h3>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col overflow-hidden flex-1">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[60px]">
                  <input type="checkbox" className="rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]" />
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ticket ID</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Customer Details</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date Raised</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockComplaints.map((comp, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-6">
                    <input type="checkbox" className="rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]" />
                  </td>
                  <td className="py-3 px-4 text-[13px] font-extrabold text-slate-700">{comp.id}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-[13px] font-bold text-slate-800">{comp.customer}</p>
                      <p className="text-[11px] font-medium text-slate-500">{comp.phone}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[13px] font-semibold text-slate-700 max-w-[200px] truncate">{comp.subject}</td>
                  <td className="py-3 px-4 text-[12px] font-medium text-slate-600">{comp.date}</td>
                  <td className="py-3 px-4">
                    {getPriorityBadge(comp.priority)}
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(comp.status)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-auto">
                      <MoreVertical size={16} />
                    </button>
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
