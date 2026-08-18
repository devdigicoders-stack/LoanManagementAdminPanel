import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Plus, Search, Edit2, Trash2 } from "lucide-react";

const mockSources = [
  {
    id: 1,
    name: "Website",
    description: "Leads generated from the main company website contact forms.",
    activeLeads: 450,
    status: "Active",
  },
  {
    id: 2,
    name: "Referral",
    description: "Leads referred by existing customers or partners.",
    activeLeads: 120,
    status: "Active",
  },
  {
    id: 3,
    name: "Walk-in",
    description: "Customers who visited the branch directly.",
    activeLeads: 85,
    status: "Active",
  },
  {
    id: 4,
    name: "Tele Calling",
    description: "Outbound telemarketing campaigns.",
    activeLeads: 340,
    status: "Active",
  },
  {
    id: 5,
    name: "Social Media",
    description: "Facebook and Instagram ad campaigns.",
    activeLeads: 210,
    status: "Active",
  },
  {
    id: 6,
    name: "Third-party Aggregators",
    description: "Leads bought from PaisaBazaar, BankBazaar, etc.",
    activeLeads: 0,
    status: "Inactive",
  },
];

export default function LeadSources() {
  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Lead Sources
          </h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">
              Lead & Work Management
            </span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">Lead Sources</span>
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
              placeholder="Search sources..."
              className="h-10 pl-9 pr-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-white w-[250px]"
            />
          </div>
          <button className="h-10 px-4 flex items-center gap-2 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm">
            <Plus size={16} /> Add Source
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[60px]">
                  S.No
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[200px]">
                  Source Name
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center w-[120px]">
                  Active Leads
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[120px]">
                  Status
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right w-[100px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockSources.map((source, idx) => (
                <tr
                  key={source.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-4 px-6 text-[13px] font-bold text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-4 px-4 text-[13px] font-bold text-slate-800">
                    {source.name}
                  </td>
                  <td className="py-4 px-4 text-[13px] font-medium text-slate-500 leading-relaxed max-w-[300px] truncate">
                    {source.description}
                  </td>
                  <td className="py-4 px-4 text-[14px] font-extrabold text-slate-700 text-center">
                    {source.activeLeads}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        source.status === "Active"
                          ? "bg-[#489b0d]/10 text-[#489b0d]"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {source.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 size={16} />
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
