import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  Search,
  Check,
  X,
  Eye,
  CheckCircle2
} from "lucide-react";

const mockRequests = [
  { id: "TR-2025-081", customer: "Emily Davis", loanId: "LN-2024-0456", existingOut: "₹1,20,000", reqAmount: "₹50,000", total: "₹1,70,000", status: "Pending" },
  { id: "TR-2025-082", customer: "Rajesh Kumar", loanId: "LN-2023-1120", existingOut: "₹4,50,000", reqAmount: "₹1,00,000", total: "₹5,50,000", status: "Approved" },
  { id: "TR-2025-083", customer: "Anita Singh", loanId: "LN-2024-0015", existingOut: "₹80,000", reqAmount: "₹30,000", total: "₹1,10,000", status: "Pending" },
  { id: "TR-2025-084", customer: "Mohd Ali", loanId: "LN-2022-0980", existingOut: "₹2,10,000", reqAmount: "₹1,50,000", total: "₹3,60,000", status: "Rejected" },
];

export default function TopUpRequests() {
  const [selectedReq, setSelectedReq] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending": return <span className="text-orange-500 font-bold">{status}</span>;
      case "Approved": return <span className="text-[#489b0d] font-bold">{status}</span>;
      case "Rejected": return <span className="text-red-500 font-bold">{status}</span>;
      default: return <span className="text-slate-500 font-bold">{status}</span>;
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Top-up Requests</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">Loan Management</span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">Top-up Requests</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search request..." 
              className="h-10 pl-9 pr-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-white w-[250px]"
            />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Request ID</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Customer Name</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Loan ID</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Existing Outstanding</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Requested Top-up</th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockRequests.map((req, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-6 text-[12px] font-bold text-slate-700">{req.id}</td>
                  <td className="py-3 px-4 text-[13px] font-bold text-slate-800">{req.customer}</td>
                  <td className="py-3 px-4 text-[12px] font-medium text-slate-600">{req.loanId}</td>
                  <td className="py-3 px-4 text-[13px] font-semibold text-slate-700">{req.existingOut}</td>
                  <td className="py-3 px-4 text-[13px] font-extrabold text-[#489b0d]">{req.reqAmount}</td>
                  <td className="py-3 px-4 text-[12px]">{getStatusBadge(req.status)}</td>
                  <td className="py-3 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedReq(req)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        title="View & Decide"
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
      </div>

      {/* Detail View Drawer (Slide-over) */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setSelectedReq(null)}></div>
          <div className="w-[450px] bg-slate-50 h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-extrabold text-slate-800 mb-0.5">Top-up Loan Request</h2>
                <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                  <span>Applicant: <span className="text-slate-800">{selectedReq.customer}</span></span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-[#489b0d] bg-[#489b0d]/10 px-1.5 rounded">{selectedReq.loanId}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReq(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-md border border-slate-100 flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Existing Outstanding</p>
                  <p className="text-[14px] font-extrabold text-slate-800">{selectedReq.existingOut}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100 flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Requested Top-up</p>
                  <p className="text-[16px] font-extrabold text-blue-600">{selectedReq.reqAmount}</p>
                </div>
                <div className="bg-[#489b0d]/5 p-4 rounded-md border border-[#489b0d]/20 flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] font-bold text-[#489b0d] uppercase tracking-wider mb-1">Total After Top-up</p>
                  <p className="text-[16px] font-extrabold text-[#489b0d]">{selectedReq.total}</p>
                </div>
              </div>

              <div>
                <h3 className="text-[13px] font-extrabold text-slate-800 mb-3">Eligibility Check</h3>
                <div className="bg-white rounded-md border border-slate-100 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#489b0d]" />
                    <span className="text-[12px] font-bold text-slate-700">EMI Paid on Time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#489b0d]" />
                    <span className="text-[12px] font-bold text-slate-700">Income Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#489b0d]" />
                    <span className="text-[12px] font-bold text-slate-700">CIBIL Score Good</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => setSelectedReq(null)}
                className="flex-1 h-11 flex items-center justify-center rounded-md border border-slate-200 text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors"
              >
                Back to List
              </button>
              <button 
                className="flex-1 h-11 flex items-center justify-center rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm"
              >
                Approve
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
