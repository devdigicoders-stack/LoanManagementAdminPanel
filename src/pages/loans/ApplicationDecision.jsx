import React, { useState } from "react";
import { 
  ChevronRight, Search, FileText, CheckCircle2, XCircle, 
  AlertCircle, ShieldCheck, User, TrendingUp, Clock, FileBadge,
  CheckCircle, BarChart3, Activity, Briefcase
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const mockApplications = [
  { id: "APP-2025-110", customer: "Priya Sharma", type: "Home Loan", amount: "₹15,00,000", score: "High", risk: "Low", status: "Pending", numericScore: 780, employment: "Salaried", income: "₹85,000/mo" },
  { id: "APP-2025-111", customer: "Rohit Kumar", type: "Personal Loan", amount: "₹2,50,000", score: "Medium", risk: "Medium", status: "Pending", numericScore: 650, employment: "Self-Employed", income: "₹45,000/mo" },
  { id: "APP-2025-112", customer: "Amit Verma", type: "Business Loan", amount: "₹10,00,000", score: "High", risk: "Low", status: "Pending", numericScore: 810, employment: "Business", income: "₹2,50,000/mo" },
  { id: "APP-2025-113", customer: "Neha Singh", type: "Education Loan", amount: "₹5,00,000", score: "Low", risk: "High", status: "Pending", numericScore: 520, employment: "Student", income: "N/A" },
  { id: "APP-2025-114", customer: "Vikas Dubey", type: "Car Loan", amount: "₹8,00,000", score: "High", risk: "Low", status: "Approved", numericScore: 760, employment: "Salaried", income: "₹65,000/mo" },
  { id: "APP-2025-115", customer: "Sunita Rao", type: "Personal Loan", amount: "₹3,00,000", score: "Low", risk: "High", status: "Rejected", numericScore: 540, employment: "Self-Employed", income: "₹30,000/mo" },
];

export default function ApplicationDecision() {
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Pending");
  const [searchQuery, setSearchQuery] = useState("");

  const handleDecision = (id, decision) => {
    Swal.fire({
      title: `${decision} Application?`,
      text: `Are you sure you want to ${decision.toLowerCase()} this application?`,
      icon: decision === 'Approve' ? 'success' : decision === 'Hold' ? 'info' : 'warning',
      showCancelButton: true,
      confirmButtonColor: decision === 'Approve' ? '#489b0d' : decision === 'Hold' ? '#f59e0b' : '#ef4444',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: `Yes, ${decision}!`
    }).then((result) => {
      if (result.isConfirmed) {
        setApplications(prev => prev.map(app => 
          app.id === id ? { ...app, status: decision === 'Approve' ? 'Approved' : decision === 'Reject' ? 'Rejected' : 'Hold' } : app
        ));
        setSelectedApp(prev => prev ? { ...prev, status: decision === 'Approve' ? 'Approved' : decision === 'Reject' ? 'Rejected' : 'Hold' } : null);
        toast.success(`Application ${decision.toLowerCase()}d successfully.`);
      }
    });
  };

  const filteredApps = applications.filter(app => {
    const matchStatus = filterStatus === "All" || app.status === filterStatus;
    const matchSearch = app.customer.toLowerCase().includes(searchQuery.toLowerCase()) || app.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getScoreBadge = (score) => {
    if(score === 'High') return <span className="bg-[#489b0d]/10 text-[#489b0d] px-2 py-0.5 rounded text-[10px] font-bold border border-[#489b0d]/20">Excellent</span>;
    if(score === 'Medium') return <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-200">Fair</span>;
    return <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold border border-red-200">Poor</span>;
  }

  const getRiskBadge = (risk) => {
    if(risk === 'Low') return <span className="text-[#489b0d] font-bold flex items-center gap-1 text-[11px]"><ShieldCheck size={14}/> Low Risk</span>;
    if(risk === 'Medium') return <span className="text-orange-500 font-bold flex items-center gap-1 text-[11px]"><AlertCircle size={14}/> Medium Risk</span>;
    return <span className="text-red-500 font-bold flex items-center gap-1 text-[11px]"><ShieldAlert size={14}/> High Risk</span>;
  }

  const getStatusBadge = (status) => {
    if(status === 'Approved') return <span className="bg-[#489b0d]/10 text-[#489b0d] px-2 py-0.5 rounded text-[10px] font-bold border border-[#489b0d]/20"><CheckCircle size={10} className="inline mr-1"/>Approved</span>;
    if(status === 'Rejected') return <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold border border-red-200"><XCircle size={10} className="inline mr-1"/>Rejected</span>;
    if(status === 'Hold') return <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded text-[10px] font-bold border border-purple-200"><Clock size={10} className="inline mr-1"/>On Hold</span>;
    return <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-200">Pending</span>;
  }

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Application Decision</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">Underwriting</span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">Pending Decisions</span>
          </div>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Application/Customer..." 
            className="h-10 pl-9 pr-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-white w-full sm:w-[280px]"
          />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 h-full min-h-[550px]">
        {/* Applications List */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <span className="font-bold text-slate-700 text-[14px]">Underwriting Queue</span>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-8 px-3 rounded border border-slate-200 text-[12px] font-bold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white cursor-pointer"
            >
              <option value="All">All Applications</option>
              <option value="Pending">Pending Decision</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Hold">On Hold</option>
            </select>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <div className="p-10 text-center text-slate-400 font-medium text-[13px] flex flex-col items-center">
                  <FileBadge size={40} className="text-slate-200 mb-3" />
                  No applications found for current filter.
                </div>
              ) : (
                filteredApps.map(app => (
                  <div 
                    key={app.id} 
                    onClick={() => setSelectedApp(app)}
                    className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${selectedApp?.id === app.id ? 'bg-[#489b0d]/5 border-l-4 border-[#489b0d]' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${app.status === 'Approved' ? 'bg-[#489b0d]/10 border-[#489b0d]/20 text-[#489b0d]' : app.status === 'Rejected' ? 'bg-red-50 border-red-200 text-red-500' : app.status === 'Hold' ? 'bg-purple-50 border-purple-200 text-purple-500' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                        {app.status === 'Approved' ? <CheckCircle2 size={18}/> : app.status === 'Rejected' ? <XCircle size={18}/> : app.status === 'Hold' ? <Clock size={18}/> : <FileBadge size={18} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[13px] font-bold text-slate-800">{app.customer}</p>
                          {getStatusBadge(app.status)}
                        </div>
                        <p className="text-[11px] font-medium text-slate-500">{app.id} • {app.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-extrabold text-[#489b0d] mb-1">{app.amount}</p>
                      {getScoreBadge(app.score)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Decision Panel */}
        <div className="w-full xl:w-[500px] bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col shrink-0 overflow-hidden">
          {selectedApp ? (
            <>
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-[16px]">{selectedApp.customer}</h3>
                  <p className="text-[12px] text-slate-500 font-medium">{selectedApp.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-[16px] font-extrabold text-[#489b0d]">{selectedApp.amount}</p>
                  <p className="text-[11px] font-bold text-slate-500">{selectedApp.type}</p>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                
                {/* Risk Assessment & Intelligence */}
                <div className="bg-slate-50 p-5 border border-slate-100 rounded-lg">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200">
                    <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <BarChart3 size={16} className="text-[#489b0d]"/> Credit Intelligence
                    </h4>
                    {getRiskBadge(selectedApp.risk)}
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-end mb-1">
                      <p className="text-[11px] text-slate-500 font-bold">Credit Score</p>
                      <p className="text-[18px] font-black text-slate-800">{selectedApp.numericScore} <span className="text-[11px] text-slate-400 font-medium">/ 900</span></p>
                    </div>
                    {/* Progress Bar for Score */}
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-1.5 overflow-hidden flex">
                      <div className="bg-red-500 h-2" style={{ width: '30%' }}></div>
                      <div className="bg-orange-500 h-2" style={{ width: '40%' }}></div>
                      <div className="bg-[#489b0d] h-2" style={{ width: '30%' }}></div>
                    </div>
                    {/* Absolute indicator dot (Mock positioning) */}
                    <div className="relative w-full">
                      <div className="absolute top-[-14px] w-3 h-3 bg-white border-2 border-slate-800 rounded-full shadow" style={{ left: `${(selectedApp.numericScore / 900) * 100}%`, transform: 'translateX(-50%)' }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-1 text-slate-500">
                        <Briefcase size={14} /> <span className="text-[10px] font-bold">Employment</span>
                      </div>
                      <p className="text-[13px] font-bold text-slate-800">{selectedApp.employment}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-1 text-slate-500">
                        <TrendingUp size={14} /> <span className="text-[10px] font-bold">Monthly Income</span>
                      </div>
                      <p className="text-[13px] font-bold text-slate-800">{selectedApp.income}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50/50 p-3 rounded border border-blue-100">
                    <p className="text-[11px] text-blue-600 font-bold mb-1 flex items-center gap-1"><Activity size={14}/> System Recommendation</p>
                    <p className={`text-[13px] font-bold ${selectedApp.score === 'High' ? 'text-[#489b0d]' : selectedApp.score === 'Medium' ? 'text-orange-500' : 'text-red-500'}`}>
                      {selectedApp.score === 'High' ? 'Auto-Approval Recommended based on excellent credit history.' : selectedApp.score === 'Medium' ? 'Manual Review Required. Check income stability.' : 'High Risk - Reject. Low credit score.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider mb-2">Underwriter Comments</h4>
                  <textarea 
                    rows="3" 
                    placeholder="Add justification for your decision..." 
                    className="w-full border border-slate-200 rounded p-3 text-[12px] text-slate-700 focus:outline-none focus:border-[#489b0d] resize-none"
                    disabled={selectedApp.status !== 'Pending'}
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto">
                  {selectedApp.status === 'Pending' ? (
                    <div className="grid grid-cols-3 gap-3">
                      <button 
                        onClick={() => handleDecision(selectedApp.id, 'Reject')}
                        className="h-11 flex items-center justify-center gap-2 rounded-lg border border-red-200 text-red-600 font-bold text-[13px] hover:bg-red-50 transition-colors"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleDecision(selectedApp.id, 'Hold')}
                        className="h-11 flex items-center justify-center gap-2 rounded-lg border border-orange-200 text-orange-600 font-bold text-[13px] hover:bg-orange-50 transition-colors"
                      >
                        Hold
                      </button>
                      <button 
                        onClick={() => handleDecision(selectedApp.id, 'Approve')}
                        className="h-11 flex items-center justify-center gap-2 rounded-lg bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm"
                      >
                        Approve
                      </button>
                    </div>
                  ) : (
                    <div className="h-11 w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 font-bold text-[13px]">
                      {selectedApp.status === 'Approved' ? <CheckCircle2 size={16} className="text-[#489b0d]" /> : selectedApp.status === 'Rejected' ? <XCircle size={16} className="text-red-500" /> : <Clock size={16} className="text-purple-500" />}
                      Decision Finalized: {selectedApp.status}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={24} className="text-slate-300" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-700 mb-1">Select Application</h3>
              <p className="text-[12px] text-slate-500">Choose an application from the list to review and make a decision.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
