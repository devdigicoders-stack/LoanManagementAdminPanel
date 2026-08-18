import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
} from "lucide-react";

const mockStatus = [
  {
    id: 1,
    name: "New",
    description: "Freshly assigned lead, not yet contacted.",
    count: 45,
    isDefault: true,
    colorClass: "text-[#489b0d] bg-[#489b0d]/10",
  },
  {
    id: 2,
    name: "Contacted",
    description: "Initial contact has been made.",
    count: 128,
    isDefault: false,
    colorClass: "text-blue-500 bg-blue-50",
  },
  {
    id: 3,
    name: "Qualified",
    description: "Lead meets the criteria and is interested.",
    count: 85,
    isDefault: false,
    colorClass: "text-purple-500 bg-purple-50",
  },
  {
    id: 4,
    name: "Converted",
    description: "Lead has successfully become a loan applicant.",
    count: 320,
    isDefault: false,
    colorClass: "text-green-600 bg-green-50",
  },
  {
    id: 5,
    name: "Lost",
    description: "Lead is not interested or disqualified.",
    count: 210,
    isDefault: false,
    colorClass: "text-red-500 bg-red-50",
  },
  {
    id: 6,
    name: "On Hold",
    description: "Lead requested to be contacted later.",
    count: 34,
    isDefault: false,
    colorClass: "text-orange-500 bg-orange-50",
  },
];

export default function LeadStatus() {
  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Lead Status
          </h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">
              Lead & Work Management
            </span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">Lead Status</span>
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
              placeholder="Search status..."
              className="h-10 pl-9 pr-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-white w-[250px]"
            />
          </div>
          <button className="h-10 px-4 flex items-center gap-2 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm">
            <Plus size={16} /> Add Status
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
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[180px]">
                  Status Name
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center w-[120px]">
                  Default
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center w-[120px]">
                  Lead Count
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right w-[100px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockStatus.map((status, idx) => (
                <tr
                  key={status.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-4 px-6 text-[13px] font-bold text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${status.colorClass}`}
                    >
                      {status.name}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[13px] font-medium text-slate-500 leading-relaxed max-w-[300px] truncate">
                    {status.description}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {status.isDefault ? (
                      <div className="flex justify-center">
                        <CheckCircle2 size={16} className="text-[#489b0d]" />
                      </div>
                    ) : (
                      <span className="text-[12px] font-medium text-slate-400">
                        -
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-[14px] font-extrabold text-slate-700 text-center">
                    {status.count}
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
