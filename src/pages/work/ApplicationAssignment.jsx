import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Filter, Eye, Calendar } from "lucide-react";

const mockApplications = [
  {
    id: "APP-2025-1250",
    customer: "Rohit Kumar",
    loanType: "Home Loan",
    assignedTo: "Ravi Kumar",
    status: "In Progress",
    assignedOn: "18 May 2025",
  },
  {
    id: "APP-2025-1249",
    customer: "Priya Sharma",
    loanType: "Personal Loan",
    assignedTo: "Neha Singh",
    status: "In Progress",
    assignedOn: "17 May 2025",
  },
  {
    id: "APP-2025-1248",
    customer: "Amit Verma",
    loanType: "Business Loan",
    assignedTo: "Suresh Patel",
    status: "Pending",
    assignedOn: "17 May 2025",
  },
  {
    id: "APP-2025-1247",
    customer: "Neha Singh",
    loanType: "Education Loan",
    assignedTo: "John Doe",
    status: "Pending",
    assignedOn: "17 May 2025",
  },
  {
    id: "APP-2025-1246",
    customer: "Suresh Patel",
    loanType: "Home Loan",
    assignedTo: "Emily Davis",
    status: "Completed",
    assignedOn: "16 May 2025",
  },
];

export default function ApplicationAssignment() {
  const getStatusBadge = (status) => {
    switch (status) {
      case "In Progress":
        return <span className="text-[#489b0d] font-bold">{status}</span>;
      case "Pending":
        return <span className="text-orange-500 font-bold">{status}</span>;
      case "Completed":
        return <span className="text-blue-500 font-bold">{status}</span>;
      default:
        return <span className="text-slate-500 font-bold">{status}</span>;
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Application Assignment
          </h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">
              Lead & Work Management
            </span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">
              Application Assignment
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white min-w-[140px]">
            <option>All Branches</option>
          </select>
          <select className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white min-w-[140px]">
            <option>All Status</option>
          </select>
          <div className="h-10 px-3 flex items-center justify-between rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 bg-white min-w-[200px]">
            <span>01 May 2025 - 18 May 2025</span>
            <Calendar size={14} className="text-slate-400" />
          </div>
          <button className="h-10 px-4 flex items-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Application ID
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Loan Type
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Assigned On
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockApplications.map((app, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3 px-6 text-[12px] font-bold text-slate-700">
                    {app.id}
                  </td>
                  <td className="py-3 px-4 text-[13px] font-bold text-slate-800">
                    {app.customer}
                  </td>
                  <td className="py-3 px-4 text-[12px] font-medium text-slate-600">
                    {app.loanType}
                  </td>
                  <td className="py-3 px-4 text-[12px] font-semibold text-slate-700">
                    {app.assignedTo}
                  </td>
                  <td className="py-3 px-4 text-[12px]">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="py-3 px-4 text-[12px] font-medium text-slate-500">
                    {app.assignedOn}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button className="p-1.5 text-slate-400 hover:text-[#489b0d] hover:bg-[#489b0d]/10 rounded-md transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <p className="text-[12px] font-medium text-slate-500">
            Showing 1 to 5 of 125 entries
          </p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">
              <ChevronRight size={14} className="rotate-180" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#489b0d] text-white font-bold text-[13px] shadow-sm">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">
              3
            </button>
            <span className="px-1 text-slate-400 text-[13px]">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">
              25
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
