import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function AssignLead() {
  return (
    <div className="w-full max-w-[1200px] space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Assign Lead</h1>
        <div className="flex items-center text-[12px] font-medium text-slate-500">
          <span className="cursor-pointer hover:text-[#489b0d] transition-colors">
            Lead & Work Management
          </span>
          <ChevronRight size={14} className="mx-1" />
          <span className="text-[#489b0d] font-bold">Lead Assignment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Lead Information */}
        <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden h-fit">
          <div className="p-6 md:p-8">
            <h3 className="text-[14px] font-extrabold text-slate-800 border-b border-slate-100 pb-3 mb-6">
              Lead Information
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <img
                src="https://i.pravatar.cc/150?u=rohit"
                alt="Rohit Kumar"
                className="w-[60px] h-[60px] rounded-full object-cover border-2 border-slate-50 shadow-sm"
              />
              <div>
                <h4 className="text-[16px] font-bold text-slate-800 leading-none mb-1">
                  Rohit Kumar
                </h4>
                <p className="text-[12px] font-medium text-slate-500">
                  LID-2025-1268
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Mobile
                </p>
                <p className="text-[13px] font-bold text-slate-800">
                  +91 9876543210
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Source
                </p>
                <p className="text-[13px] font-bold text-slate-800">Website</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Expected Amount
                </p>
                <p className="text-[14px] font-extrabold text-[#489b0d]">
                  ₹5,00,000
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Status
                </p>
                <span className="text-[#489b0d] bg-[#489b0d]/10 px-2 py-0.5 rounded text-[11px] font-bold">
                  New
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Assign To Form */}
        <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 space-y-6">
            <h3 className="text-[14px] font-extrabold text-slate-800 border-b border-slate-100 pb-3">
              Assign To
            </h3>

            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-2">
                Select Employee <span className="text-red-500">*</span>
              </label>
              <select className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white appearance-none">
                <option value="" disabled selected>
                  Select employee
                </option>
                <option>Ravi Kumar (Loan Officer)</option>
                <option>Neha Singh (Loan Officer)</option>
                <option>Suresh Patel (Branch Manager)</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-2">
                Assign To Team (Optional)
              </label>
              <select className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white appearance-none">
                <option value="" disabled selected>
                  Select team
                </option>
                <option>Sales Team A</option>
                <option>Sales Team B</option>
                <option>Document Verification Team</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-3">
                Priority
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="priority"
                    className="w-4 h-4 text-[#489b0d] border-slate-300 focus:ring-[#489b0d] cursor-pointer"
                  />
                  <span className="text-[13px] font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
                    Low
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="priority"
                    className="w-4 h-4 text-[#489b0d] border-slate-300 focus:ring-[#489b0d] cursor-pointer"
                    defaultChecked
                  />
                  <span className="text-[13px] font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
                    Medium
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="priority"
                    className="w-4 h-4 text-[#489b0d] border-slate-300 focus:ring-[#489b0d] cursor-pointer"
                  />
                  <span className="text-[13px] font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
                    High
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-2">
                Remarks (Optional)
              </label>
              <textarea
                placeholder="Enter remarks"
                rows="4"
                className="w-full p-4 rounded-md border border-slate-200 text-[13px] text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white resize-none"
              ></textarea>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
            <Link to="/leads">
              <button className="px-6 py-2.5 rounded-md border border-slate-200 text-slate-600 font-bold text-[13px] hover:bg-slate-100 transition-colors">
                Cancel
              </button>
            </Link>
            <button className="px-8 py-2.5 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm">
              Assign Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
