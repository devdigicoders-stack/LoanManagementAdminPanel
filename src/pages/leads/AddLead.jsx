import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function AddLead() {
  return (
    <div className="w-full max-w-[1200px] space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Add New Lead</h1>
        <div className="flex items-center text-[12px] font-medium text-slate-500">
          <span className="cursor-pointer hover:text-[#489b0d] transition-colors">
            Lead & Work Management
          </span>
          <ChevronRight size={14} className="mx-1" />
          <Link to="/leads" className="hover:text-[#489b0d] transition-colors">
            All Leads
          </Link>
          <ChevronRight size={14} className="mx-1" />
          <span className="text-[#489b0d] font-bold">Add Lead</span>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Column 1: Personal Information */}
            <div className="space-y-6">
              <h3 className="text-[14px] font-extrabold text-slate-800 border-b border-slate-100 pb-2">
                Personal Information
              </h3>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Alternate Mobile
                </label>
                <input
                  type="tel"
                  placeholder="Enter alternate number"
                  className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Column 2: Lead Information */}
            <div className="space-y-6">
              <h3 className="text-[14px] font-extrabold text-slate-800 border-b border-slate-100 pb-2">
                Lead Information
              </h3>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Source <span className="text-red-500">*</span>
                </label>
                <select className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white appearance-none">
                  <option value="" disabled selected>
                    Select source
                  </option>
                  <option>Website</option>
                  <option>Referral</option>
                  <option>Walk-in</option>
                  <option>Tele Calling</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Expected Loan Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter amount"
                  className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Loan Purpose <span className="text-red-500">*</span>
                </label>
                <select className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white appearance-none">
                  <option value="" disabled selected>
                    Select purpose
                  </option>
                  <option>Home Loan</option>
                  <option>Personal Loan</option>
                  <option>Business Loan</option>
                  <option>Education Loan</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Preferred Branch <span className="text-red-500">*</span>
                </label>
                <select className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white appearance-none">
                  <option value="" disabled selected>
                    Select branch
                  </option>
                  <option>Lucknow Main Branch</option>
                  <option>Gomti Nagar Branch</option>
                  <option>Aliganj Branch</option>
                </select>
              </div>
            </div>

            {/* Column 3: Additional Information */}
            <div className="space-y-6">
              <h3 className="text-[14px] font-extrabold text-slate-800 border-b border-slate-100 pb-2">
                Additional Information (Optional)
              </h3>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Address
                </label>
                <textarea
                  placeholder="Enter complete address"
                  rows="4"
                  className="w-full p-4 rounded-md border border-slate-200 text-[13px] text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Remarks
                </label>
                <textarea
                  placeholder="Enter remarks"
                  rows="4"
                  className="w-full p-4 rounded-md border border-slate-200 text-[13px] text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white resize-none"
                ></textarea>
              </div>
            </div>
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
            Save Lead
          </button>
        </div>
      </div>
    </div>
  );
}
