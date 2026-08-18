import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Search, Check, X, Eye } from "lucide-react";

const mockRequests = [
  {
    id: "FR-2025-001",
    customer: "Ravi Kumar",
    loanId: "LN-2025-1050",
    outstanding: "₹2,32,606",
    foreclosureAmount: "₹2,45,000",
    requestDate: "18 May 2025",
    status: "Pending",
  },
  {
    id: "FR-2025-002",
    customer: "Priya Sharma",
    loanId: "LN-2025-1022",
    outstanding: "₹8,45,000",
    foreclosureAmount: "₹8,70,000",
    requestDate: "17 May 2025",
    status: "Approved",
  },
  {
    id: "FR-2025-003",
    customer: "Amit Verma",
    loanId: "LN-2025-1003",
    outstanding: "₹12,80,000",
    foreclosureAmount: "₹13,10,000",
    requestDate: "16 May 2025",
    status: "Under Review",
  },
  {
    id: "FR-2025-004",
    customer: "Neha Singh",
    loanId: "LN-2025-0988",
    outstanding: "₹4,10,000",
    foreclosureAmount: "₹4,25,000",
    requestDate: "15 May 2025",
    status: "Rejected",
  },
];

export default function ForeclosureRequests() {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="text-orange-500 font-bold">{status}</span>;
      case "Approved":
        return <span className="text-[#489b0d] font-bold">{status}</span>;
      case "Under Review":
        return <span className="text-blue-500 font-bold">{status}</span>;
      case "Rejected":
        return <span className="text-red-500 font-bold">{status}</span>;
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
            Foreclosure Requests
          </h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">
              Loan Management
            </span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">
              Foreclosure Requests
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search request..."
              className="h-10 pl-9 pr-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-white w-[250px]"
            />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Loan ID
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Outstanding
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Foreclosure Amount
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Request Date
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockRequests.map((req, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3 px-6 text-[12px] font-bold text-slate-700">
                    {req.id}
                  </td>
                  <td className="py-3 px-4 text-[13px] font-bold text-slate-800">
                    {req.customer}
                  </td>
                  <td className="py-3 px-4 text-[12px] font-medium text-slate-600">
                    {req.loanId}
                  </td>
                  <td className="py-3 px-4 text-[13px] font-semibold text-slate-700">
                    {req.outstanding}
                  </td>
                  <td className="py-3 px-4 text-[13px] font-extrabold text-[#489b0d]">
                    {req.foreclosureAmount}
                  </td>
                  <td className="py-3 px-4 text-[12px] font-medium text-slate-500">
                    {req.requestDate}
                  </td>
                  <td className="py-3 px-4 text-[12px]">
                    {getStatusBadge(req.status)}
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-1.5 text-slate-400 hover:text-[#489b0d] hover:bg-[#489b0d]/10 rounded-md transition-colors"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Reject"
                      >
                        <X size={16} />
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
