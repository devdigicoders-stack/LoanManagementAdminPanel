import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Filter,
  Download,
  Search,
  MessageCircle,
  PhoneCall,
} from "lucide-react";

const mockOverdue = [
  {
    id: "LN-2025-1021",
    customer: "Deepak Yadav",
    loanType: "Personal Loan",
    overdueAmount: "₹25,000",
    days: 45,
    lastEmi: "05 Apr 2025",
    zone: "Red",
  },
  {
    id: "LN-2025-1087",
    customer: "Pooja Mishra",
    loanType: "Home Loan",
    overdueAmount: "₹45,200",
    days: 15,
    lastEmi: "05 May 2025",
    zone: "Orange",
  },
  {
    id: "LN-2025-0998",
    customer: "Karan Singh",
    loanType: "Business Loan",
    overdueAmount: "₹85,500",
    days: 90,
    lastEmi: "20 Feb 2025",
    zone: "Red",
  },
  {
    id: "LN-2025-1045",
    customer: "Kavita Gupta",
    loanType: "Personal Loan",
    overdueAmount: "₹12,400",
    days: 5,
    lastEmi: "15 May 2025",
    zone: "Yellow",
  },
];

export default function OverdueLoans() {
  const getDaysBadge = (days, zone) => {
    if (zone === "Red")
      return (
        <span className="text-red-500 bg-red-50 px-2 py-1 rounded text-[11px] font-extrabold">
          {days} Days
        </span>
      );
    if (zone === "Orange")
      return (
        <span className="text-orange-500 bg-orange-50 px-2 py-1 rounded text-[11px] font-extrabold">
          {days} Days
        </span>
      );
    return (
      <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-[11px] font-extrabold">
        {days} Days
      </span>
    );
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Overdue Loans
          </h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">
              Loan Management
            </span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-red-500 font-bold">NPA / Overdue Loans</span>
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
              placeholder="Search..."
              className="h-10 pl-9 pr-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-white w-[160px]"
            />
          </div>
          <select className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white min-w-[120px]">
            <option>All Branches</option>
            <option>Mumbai Branch</option>
            <option>Delhi Branch</option>
            <option>Bangalore Branch</option>
            <option>Chennai Branch</option>
          </select>
          <select className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white min-w-[120px]">
            <option>All Loan Types</option>
          </select>
          <select className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white min-w-[140px]">
            <option>All Overdue Zones</option>
            <option>SMA-0 (1-30 days)</option>
            <option>SMA-1 (31-60 days)</option>
            <option>SMA-2 (61-90 days)</option>
            <option>NPA (90+ days)</option>
          </select>
          <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 p-5 rounded-lg shadow-sm">
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Total Overdue Amount
          </p>
          <h3 className="text-2xl font-extrabold text-red-500">₹1,25,64,000</h3>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-lg shadow-sm">
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            SMA-0 (1-30 Days)
          </p>
          <h3 className="text-2xl font-extrabold text-yellow-500">
            45{" "}
            <span className="text-[14px] font-bold text-slate-400 ml-1">
              Accounts
            </span>
          </h3>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-lg shadow-sm">
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            SMA-1 / SMA-2
          </p>
          <h3 className="text-2xl font-extrabold text-orange-500">
            18{" "}
            <span className="text-[14px] font-bold text-slate-400 ml-1">
              Accounts
            </span>
          </h3>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-lg shadow-sm">
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            NPA (90+ Days)
          </p>
          <h3 className="text-2xl font-extrabold text-red-600">
            8{" "}
            <span className="text-[14px] font-bold text-slate-400 ml-1">
              Accounts
            </span>
          </h3>
        </div>
      </div>

      {/* Table */}
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
                  Overdue Amount
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                  Overdue Days
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Last EMI Date
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockOverdue.map((loan, idx) => (
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
                  <td className="py-3 px-4 text-[14px] font-extrabold text-red-500">
                    {loan.overdueAmount}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getDaysBadge(loan.days, loan.zone)}
                  </td>
                  <td className="py-3 px-4 text-[12px] font-medium text-slate-500">
                    {loan.lastEmi}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        title="WhatsApp"
                      >
                        <MessageCircle size={16} />
                      </button>
                      <button
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Call"
                      >
                        <PhoneCall size={16} />
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
            Showing 1 to 4 of 71 entries
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
