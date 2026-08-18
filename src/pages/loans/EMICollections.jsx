import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Search,
  IndianRupee,
  Calendar,
  FileText,
  CreditCard,
  User,
  AlertCircle,
} from "lucide-react";

export default function EMICollections() {
  const [loanId, setLoanId] = useState("LN-2025-1050");
  const [isSearched, setIsSearched] = useState(true);

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            EMI Collection
          </h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">
              Loan Management
            </span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">EMI Collection</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Search & Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search Card */}
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <h3 className="text-[14px] font-extrabold text-slate-800 mb-4">
              Find Loan Account
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                  Enter Loan ID or Mobile
                </label>
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={loanId}
                    onChange={(e) => setLoanId(e.target.value)}
                    placeholder="e.g. LN-2025-1050"
                    className="w-full h-11 pl-10 pr-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>
              <button
                onClick={() => setIsSearched(true)}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm"
              >
                Search Account
              </button>
            </div>
          </div>

          {/* Account Details (Visible if searched) */}
          {isSearched && (
            <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-[14px] font-extrabold text-slate-800">
                  Account Summary
                </h3>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-500">
                  EMI Due
                </span>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                      Customer Name
                    </p>
                    <p className="text-[14px] font-bold text-slate-800">
                      Ravi Kumar
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                      Loan Amount
                    </p>
                    <p className="text-[13px] font-bold text-slate-800">
                      ₹2,50,000
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                      Outstanding
                    </p>
                    <p className="text-[13px] font-bold text-slate-800">
                      ₹2,32,606
                    </p>
                  </div>
                </div>

                <div className="bg-[#489b0d]/5 rounded-md p-4 border border-[#489b0d]/10 mt-2 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-[#489b0d] uppercase tracking-wider mb-1">
                      Due Amount
                    </p>
                    <p className="text-[20px] font-extrabold text-[#489b0d] leading-none">
                      ₹11,154
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Due Date
                    </p>
                    <p className="text-[13px] font-bold text-slate-800">
                      20 Jun 2025
                    </p>
                  </div>
                </div>

                {/* Warning for overdue if any */}
                <div className="flex items-start gap-2 text-orange-500 bg-orange-50 p-3 rounded-lg text-[11px] font-bold">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <p>Collect payment before 20th to avoid late penalty.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Collection Form */}
        {isSearched ? (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 sm:p-8">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-extrabold text-slate-800 mb-1">
                  Record Payment
                </h2>
                <p className="text-[13px] font-medium text-slate-500">
                  Enter payment details to generate receipt.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                    Collection Amount
                  </label>
                  <div className="relative">
                    <IndianRupee
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      defaultValue="11,154"
                      className="w-full h-12 pl-10 pr-4 rounded-md border border-slate-200 text-[16px] font-extrabold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-1.5 ml-1">
                    Default amount is the current EMI due.
                  </p>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                    Payment Mode
                  </label>
                  <div className="relative">
                    <CreditCard
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <select className="w-full h-11 pl-10 pr-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white appearance-none">
                      <option>UPI / Online</option>
                      <option>Bank Transfer (NEFT/RTGS)</option>
                      <option>Cheque</option>
                      <option>Cash</option>
                    </select>
                    <ChevronRight
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                    Payment Date
                  </label>
                  <div className="relative">
                    <Calendar
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="date"
                      defaultValue="2025-06-18"
                      className="w-full h-11 pl-10 pr-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                    Reference Number (Txn ID / Cheque No)
                  </label>
                  <div className="relative">
                    <FileText
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Enter transaction reference"
                      className="w-full h-11 pl-10 pr-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                    Remarks (Optional)
                  </label>
                  <textarea
                    placeholder="Add any additional notes here..."
                    className="w-full p-4 rounded-md border border-slate-200 text-[13px] font-medium text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white resize-none h-24"
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button className="h-11 px-6 rounded-md border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button className="h-11 px-8 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm">
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 flex flex-col items-center justify-center bg-white rounded-lg border border-slate-100 border-dashed text-slate-400 p-10 min-h-[400px]">
            <Search size={48} className="mb-4 opacity-20" />
            <p className="text-[16px] font-bold text-slate-600 mb-1">
              No Account Selected
            </p>
            <p className="text-[13px] font-medium">
              Search for a loan account ID to record EMI payment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
