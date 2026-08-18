import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Search, Download, Eye, Filter } from "lucide-react";

const mockClosures = [
  {
    id: "LN-2023-0180",
    customer: "Sarah Patel",
    loanType: "Personal Loan",
    closedOn: "18 May 2025",
    closedAmount: "₹2,50,000",
    status: "Closed",
  },
  {
    id: "LN-2021-0890",
    customer: "Emily Davis",
    loanType: "Home Loan",
    closedOn: "10 May 2025",
    closedAmount: "₹12,00,000",
    status: "Closed",
  },
  {
    id: "LN-2024-0012",
    customer: "Karan Singh",
    loanType: "Business Loan",
    closedOn: "01 May 2025",
    closedAmount: "₹5,00,000",
    status: "Closed",
  },
  {
    id: "LN-2022-0450",
    customer: "Neha Singh",
    loanType: "Education Loan",
    closedOn: "25 Apr 2025",
    closedAmount: "₹8,00,000",
    status: "Closed",
  },
];

export default function LoanClosure() {
  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Loan Closure
          </h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">
              Loan Management
            </span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">Loan Closure</span>
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
              placeholder="Search..."
              className="h-10 pl-9 pr-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-white w-[180px]"
            />
          </div>
          <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Loan ID
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Loan Type
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Closed On
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Closed Amount
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
              {mockClosures.map((loan, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3 px-6 text-[12px] font-bold text-slate-700">
                    {loan.id}
                  </td>
                  <td className="py-3 px-4 text-[13px] font-bold text-slate-800">
                    {loan.customer}
                  </td>
                  <td className="py-3 px-4 text-[12px] font-medium text-slate-600">
                    {loan.loanType}
                  </td>
                  <td className="py-3 px-4 text-[12px] font-medium text-slate-500">
                    {loan.closedOn}
                  </td>
                  <td className="py-3 px-4 text-[13px] font-extrabold text-[#489b0d]">
                    {loan.closedAmount}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[#489b0d] bg-[#489b0d]/10 px-2.5 py-1 rounded-md text-[11px] font-bold">
                      Closed
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-1.5 text-slate-400 hover:text-[#489b0d] hover:bg-[#489b0d]/10 rounded-md transition-colors"
                        title="Download NOC"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <p className="text-[12px] font-medium text-slate-500">
            Showing 1 to 4 of 78 entries
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
            <span className="px-1 text-slate-400 text-[13px]">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">
              8
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
