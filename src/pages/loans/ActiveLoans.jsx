import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Filter, Download, Eye, Search } from "lucide-react";

const mockActiveLoans = [
  {
    id: "LN-2025-1001",
    customer: "Priya Sharma",
    loanType: "Home Loan",
    amount: "₹12,00,000",
    outstanding: "₹11,50,000",
    emi: "₹15,000",
    nextEmiDate: "05 Jun 2025",
    status: "Active",
  },
  {
    id: "LN-2025-1002",
    customer: "Ravi Kumar",
    loanType: "Personal Loan",
    amount: "₹5,00,000",
    outstanding: "₹4,20,000",
    emi: "₹12,500",
    nextEmiDate: "10 Jun 2025",
    status: "Active",
  },
  {
    id: "LN-2025-1003",
    customer: "Amit Verma",
    loanType: "Business Loan",
    amount: "₹15,00,000",
    outstanding: "₹12,80,000",
    emi: "₹35,000",
    nextEmiDate: "15 Jun 2025",
    status: "Active",
  },
  {
    id: "LN-2025-1004",
    customer: "Neha Singh",
    loanType: "Education Loan",
    amount: "₹8,00,000",
    outstanding: "₹7,50,000",
    emi: "₹10,200",
    nextEmiDate: "01 Jun 2025",
    status: "Active",
  },
  {
    id: "LN-2025-1005",
    customer: "Suresh Patel",
    loanType: "Personal Loan",
    amount: "₹3,00,000",
    outstanding: "₹2,10,000",
    emi: "₹8,500",
    nextEmiDate: "20 Jun 2025",
    status: "Active",
  },
];

export default function ActiveLoans() {
  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Active Loans
          </h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">
              Loan Management
            </span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">Active Loans</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search loans..."
              className="h-10 pl-9 pr-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-white w-[200px]"
            />
          </div>
          <select className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white min-w-[120px]">
            <option>All Branches</option>
          </select>
          <select className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white min-w-[120px]">
            <option>All Loan Types</option>
          </select>
          <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={14} /> Filter
          </button>
          <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[1000px]">
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
                  Loan Amount
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Outstanding
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  EMI
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Next EMI Date
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockActiveLoans.map((loan, idx) => (
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
                  <td className="py-3 px-4 text-[13px] font-semibold text-slate-700">
                    {loan.amount}
                  </td>
                  <td className="py-3 px-4 text-[13px] font-extrabold text-[#489b0d]">
                    {loan.outstanding}
                  </td>
                  <td className="py-3 px-4 text-[12px] font-semibold text-slate-700">
                    {loan.emi}
                  </td>
                  <td className="py-3 px-4 text-[12px] font-medium text-slate-500">
                    {loan.nextEmiDate}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[#489b0d] bg-[#489b0d]/10 px-2.5 py-1 rounded-md text-[11px] font-bold">
                      Active
                    </span>
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
            Showing 1 to 5 of 256 entries
          </p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
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
              52
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
