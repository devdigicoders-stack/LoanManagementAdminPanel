import React from "react";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck
} from "lucide-react";

const mockAttendance = [
  { id: "EMP-1001", name: "Ravi Kumar", date: "18 May 2025", checkIn: "09:05 AM", checkOut: "06:15 PM", status: "Present" },
  { id: "EMP-1002", name: "Priya Singh", date: "18 May 2025", checkIn: "09:30 AM", checkOut: "06:00 PM", status: "Late" },
  { id: "EMP-1003", name: "Amit Sharma", date: "18 May 2025", checkIn: "-", checkOut: "-", status: "Absent" },
  { id: "EMP-1004", name: "Neha Verma", date: "18 May 2025", checkIn: "09:00 AM", checkOut: "02:00 PM", status: "Half Day" },
  { id: "EMP-1005", name: "Suresh Patel", date: "18 May 2025", checkIn: "08:55 AM", checkOut: "06:30 PM", status: "Present" },
];

export default function Attendance() {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Present":
        return <span className="px-2 py-1 bg-[#489b0d]/10 text-[#489b0d] text-[11px] font-bold rounded flex items-center gap-1 w-max"><CheckCircle2 size={12} /> Present</span>;
      case "Absent":
        return <span className="px-2 py-1 bg-red-100 text-red-500 text-[11px] font-bold rounded flex items-center gap-1 w-max"><XCircle size={12} /> Absent</span>;
      case "Late":
        return <span className="px-2 py-1 bg-orange-100 text-orange-500 text-[11px] font-bold rounded flex items-center gap-1 w-max"><Clock size={12} /> Late</span>;
      case "Half Day":
        return <span className="px-2 py-1 bg-blue-100 text-blue-500 text-[11px] font-bold rounded flex items-center gap-1 w-max"><UserCheck size={12} /> Half Day</span>;
      default:
        return <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[11px] font-bold rounded w-max">{status}</span>;
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Attendance</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">Employee Management</span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">Attendance</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search employee..." 
              className="h-10 pl-9 pr-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-white w-[200px]"
            />
          </div>
          <div className="h-10 px-3 flex items-center justify-between rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 bg-white min-w-[150px]">
            <span className="truncate">18 May 2025</span>
            <Calendar size={14} className="text-slate-400 ml-2" />
          </div>
          <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={14} /> Filter
          </button>
          <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Employees</p>
          <h3 className="text-2xl font-extrabold text-slate-800">124</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Present</p>
          <h3 className="text-2xl font-extrabold text-[#489b0d]">108</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Absent</p>
          <h3 className="text-2xl font-extrabold text-red-500">12</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Late / Half Day</p>
          <h3 className="text-2xl font-extrabold text-orange-500">4</h3>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col overflow-hidden flex-1">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[60px]">
                  <input type="checkbox" className="rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]" />
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Check In</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Check Out</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockAttendance.map((record, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-6">
                    <input type="checkbox" className="rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]" />
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-[13px] font-bold text-slate-800">{record.name}</p>
                      <p className="text-[11px] font-medium text-slate-500">{record.id}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[12px] font-semibold text-slate-600">{record.date}</td>
                  <td className="py-3 px-4 text-[12px] font-bold text-slate-700">{record.checkIn}</td>
                  <td className="py-3 px-4 text-[12px] font-bold text-slate-700">{record.checkOut}</td>
                  <td className="py-3 px-4">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <button className="text-[12px] font-bold text-blue-600 hover:underline">Edit</button>
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
