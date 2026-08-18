import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Download,
  Search,
  CheckCircle2,
  Clock,
} from "lucide-react";

const mockSchedule = [
  {
    inst: 1,
    date: "20 Apr 2025",
    emi: "₹11,154",
    principal: "₹8,654",
    interest: "₹2,500",
    balance: "₹2,41,346",
    status: "Paid",
  },
  {
    inst: 2,
    date: "20 May 2025",
    emi: "₹11,154",
    principal: "₹8,740",
    interest: "₹2,414",
    balance: "₹2,32,606",
    status: "Paid",
  },
  {
    inst: 3,
    date: "20 Jun 2025",
    emi: "₹11,154",
    principal: "₹8,827",
    interest: "₹2,327",
    balance: "₹2,23,779",
    status: "Upcoming",
  },
  {
    inst: 4,
    date: "20 Jul 2025",
    emi: "₹11,154",
    principal: "₹8,915",
    interest: "₹2,239",
    balance: "₹2,14,864",
    status: "Upcoming",
  },
  {
    inst: 5,
    date: "20 Aug 2025",
    emi: "₹11,154",
    principal: "₹9,004",
    interest: "₹2,150",
    balance: "₹2,05,860",
    status: "Upcoming",
  },
];

export default function RepaymentSchedule() {
  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Repayment Schedule
          </h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">
              Loan Management
            </span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">Repayment Schedule</span>
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
              placeholder="Enter Loan ID..."
              defaultValue="LN-2025-1050"
              className="h-10 pl-9 pr-4 rounded-md border border-[#489b0d] ring-1 ring-[#489b0d]/20 text-[13px] font-bold text-slate-800 focus:outline-none bg-white w-[200px]"
            />
          </div>
          <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      {/* Loan Details Banner */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="flex flex-col gap-1 border-r border-slate-100 pr-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Loan ID
          </span>
          <span className="text-[14px] font-bold text-slate-800">
            LN-2025-1050
          </span>
          <span className="text-[12px] font-medium text-slate-500">
            Ravi Kumar
          </span>
        </div>
        <div className="flex flex-col gap-1 border-r border-slate-100 pr-4 md:pl-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Loan Amount
          </span>
          <span className="text-[16px] font-extrabold text-[#489b0d]">
            ₹2,50,000
          </span>
        </div>
        <div className="flex flex-col gap-1 border-r border-slate-100 pr-4 md:pl-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            EMI Amount
          </span>
          <span className="text-[14px] font-bold text-slate-800">₹11,154</span>
        </div>
        <div className="flex flex-col gap-1 border-r border-slate-100 pr-4 md:pl-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Interest Rate
          </span>
          <span className="text-[14px] font-bold text-slate-800">12.50%</span>
        </div>
        <div className="flex flex-col gap-1 md:pl-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Tenure
          </span>
          <span className="text-[14px] font-bold text-slate-800">
            24 Months
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                  Installment
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  EMI Amount
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Principal
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Interest
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockSchedule.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3 px-6 text-[12px] font-bold text-slate-500 text-center">
                    {item.inst}
                  </td>
                  <td className="py-3 px-4 text-[13px] font-bold text-slate-800">
                    {item.date}
                  </td>
                  <td className="py-3 px-4 text-[13px] font-bold text-slate-700">
                    {item.emi}
                  </td>
                  <td className="py-3 px-4 text-[13px] font-medium text-slate-600">
                    {item.principal}
                  </td>
                  <td className="py-3 px-4 text-[13px] font-medium text-slate-600">
                    {item.interest}
                  </td>
                  <td className="py-3 px-4 text-[13px] font-bold text-slate-700">
                    {item.balance}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {item.status === "Paid" ? (
                      <span className="inline-flex items-center gap-1 text-[#489b0d] font-bold text-[12px]">
                        <CheckCircle2 size={14} /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 font-bold text-[12px]">
                        <Clock size={14} /> Upcoming
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[12px] font-medium text-slate-500">
            Showing 1 to 5 of 24 installments
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
              5
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
