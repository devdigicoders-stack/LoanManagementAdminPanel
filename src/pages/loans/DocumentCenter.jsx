import React from "react";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  Search,
  UploadCloud,
  FileText,
  MoreVertical,
  FolderOpen
} from "lucide-react";

const categories = [
  { name: "Customer KYC Documents", count: "1,248 Files", icon: <FolderOpen size={20} className="text-blue-500" />, bg: "bg-blue-50" },
  { name: "Loan Agreements", count: "1,024 Files", icon: <FileText size={20} className="text-[#489b0d]" />, bg: "bg-[#489b0d]/10" },
  { name: "Sanction Letters", count: "684 Files", icon: <FileText size={20} className="text-purple-500" />, bg: "bg-purple-50" },
  { name: "Disbursement Proofs", count: "1,102 Files", icon: <FileText size={20} className="text-orange-500" />, bg: "bg-orange-50" },
  { name: "EMI Receipts", count: "2,048 Files", icon: <FileText size={20} className="text-teal-500" />, bg: "bg-teal-50" },
];

export default function DocumentCenter() {
  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Document Center</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">Loan Management</span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">Documents</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              className="h-10 pl-9 pr-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-white w-[250px]"
            />
          </div>
          <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm">
            <UploadCloud size={16} /> Upload Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Categories List */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-slate-100 shadow-sm p-4">
          <h2 className="text-[14px] font-extrabold text-slate-800 px-2 mb-4">Categories</h2>
          <div className="space-y-1">
            {categories.map((cat, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${idx === 0 ? 'bg-slate-50 border border-slate-100' : 'hover:bg-slate-50 border border-transparent'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${cat.bg} flex items-center justify-center shrink-0`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-[13px] font-bold text-slate-800">{cat.name}</h3>
                    <p className="text-[11px] font-medium text-slate-500">{cat.count}</p>
                  </div>
                </div>
                <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Files View (Placeholder for selected category) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <FolderOpen size={20} className="text-blue-500" />
              </div>
              <div>
                <h3 className="text-[15px] font-extrabold text-slate-800">Customer KYC Documents</h3>
                <p className="text-[12px] font-medium text-slate-500">1,248 Files uploaded</p>
              </div>
            </div>
            <select className="h-9 px-3 rounded-lg border border-slate-200 text-[12px] font-bold text-slate-600 focus:outline-none bg-white">
              <option>Sort by Date</option>
              <option>Sort by Name</option>
            </select>
          </div>
          
          <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-max">
            {/* Mock Files */}
            {[1,2,3,4,5,6].map((item) => (
              <div key={item} className="border border-slate-100 rounded-md p-4 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <span className="text-[10px] font-extrabold text-red-500">PDF</span>
                  </div>
                  <button className="p-1 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-slate-600 transition-all">
                    <MoreVertical size={14} />
                  </button>
                </div>
                <div>
                  <h4 className="text-[12px] font-bold text-slate-800 truncate" title={`Aadhar_Card_LN2025_${item}.pdf`}>Aadhar_Card_LN2025_{item}.pdf</h4>
                  <p className="text-[10px] font-medium text-slate-500 mt-0.5">2.4 MB • 18 May 2025</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[12px] font-medium text-slate-500">
              Showing 1 to 6 of 1,248 files
            </p>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">
                <ChevronRight size={14} className="rotate-180" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#489b0d] text-white font-bold text-[13px] shadow-sm">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
