import React, { useState } from "react";
import { 
  ChevronRight, Search, FileText, Send, Clock, Plus, Trash2, CheckCircle2,
  FileCheck, ShieldAlert
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const mockRequests = [
  { id: "REQ-001", customer: "Priya Sharma", app: "APP-2025-110", doc: "ITR 2024", status: "Pending Upload", date: "19 May 2025" },
  { id: "REQ-002", customer: "Amit Verma", app: "APP-2025-112", doc: "Business Proof", status: "Uploaded", date: "18 May 2025" },
  { id: "REQ-003", customer: "Rahul Bajaj", app: "APP-2025-115", doc: "Property Papers", status: "Pending Upload", date: "17 May 2025" },
  { id: "REQ-004", customer: "Neha Singh", app: "APP-2025-118", doc: "Salary Slip", status: "Uploaded", date: "16 May 2025" },
];

export default function RequestDocuments() {
  const [requests, setRequests] = useState(mockRequests);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form State
  const [customer, setCustomer] = useState("");
  const [docName, setDocName] = useState("");
  const [comments, setComments] = useState("");

  const handleSendRequest = (e) => {
    e.preventDefault();
    if (!customer || !docName) {
      toast.error("Please fill in customer and document name");
      return;
    }

    const newReq = {
      id: `REQ-00${requests.length + 3}`,
      customer,
      app: "APP-NEW",
      doc: docName,
      status: "Pending Upload",
      date: "19 May 2025"
    };

    setRequests([newReq, ...requests]);
    toast.success("Document request sent successfully!");
    setShowForm(false);
    setCustomer("");
    setDocName("");
    setComments("");
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this document request?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setRequests(prev => prev.filter(r => r.id !== id));
        toast.success("Request deleted successfully!");
      }
    });
  };

  const filteredRequests = requests.filter(req => {
    const matchStatus = filterStatus === "All" || req.status === filterStatus;
    const matchSearch = req.customer.toLowerCase().includes(searchQuery.toLowerCase()) || req.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending Upload').length,
    uploaded: requests.filter(r => r.status === 'Uploaded').length
  };

  const getStatusBadge = (status) => {
    if(status === 'Uploaded') return <span className="bg-[#489b0d]/10 text-[#489b0d] px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 w-fit"><CheckCircle2 size={12}/> Uploaded</span>;
    return <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 w-fit"><Clock size={12}/> Pending Upload</span>;
  }

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Request Documents</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">Documents</span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">Request Missing Documents</span>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full sm:w-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Request/Customer..." 
              className="h-10 pl-9 pr-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-white w-full sm:w-[250px]"
            />
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="h-10 px-4 flex items-center justify-center gap-2 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus size={16} /> New Request
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center gap-4 cursor-pointer hover:border-[#489b0d]/30 transition-colors" onClick={() => setFilterStatus("All")}>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0"><FileText size={20}/></div>
          <div><p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Total Requests</p><p className="text-2xl font-black text-slate-800">{stats.total}</p></div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center gap-4 cursor-pointer hover:border-orange-500/30 transition-colors" onClick={() => setFilterStatus("Pending Upload")}>
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><Clock size={20}/></div>
          <div><p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Pending Upload</p><p className="text-2xl font-black text-slate-800">{stats.pending}</p></div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center gap-4 cursor-pointer hover:border-[#489b0d]/30 transition-colors" onClick={() => setFilterStatus("Uploaded")}>
          <div className="w-12 h-12 rounded-full bg-[#489b0d]/10 text-[#489b0d] flex items-center justify-center shrink-0"><CheckCircle2 size={20}/></div>
          <div><p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Uploaded (Ready)</p><p className="text-2xl font-black text-slate-800">{stats.uploaded}</p></div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Request ID</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Customer / Application</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Requested Document</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Requested On</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6"><span className="text-[13px] font-bold text-slate-700">{req.id}</span></td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] font-bold text-slate-800">{req.customer}</p>
                    <p className="text-[11px] font-medium text-slate-500">{req.app}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-slate-700">
                      <FileText size={14} className="text-blue-500"/>
                      <span className="text-[13px] font-bold">{req.doc}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(req.status)}
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[12px] font-semibold text-slate-600">{req.date}</p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 transition-opacity">
                      {req.status === 'Pending Upload' ? (
                        <button onClick={() => toast.success("Reminder sent to customer!")} className="h-8 px-2.5 flex items-center gap-1.5 text-slate-600 font-bold text-[11px] hover:text-blue-600 hover:bg-blue-50 rounded border border-slate-200 transition-colors" title="Send Reminder">
                          <Send size={12} strokeWidth={2.5} /> Remind
                        </button>
                      ) : (
                        <button onClick={() => toast.success("Opening Verification Module...")} className="h-8 px-2.5 flex items-center gap-1.5 text-slate-600 font-bold text-[11px] hover:text-[#489b0d] hover:bg-[#489b0d]/10 rounded border border-slate-200 transition-colors" title="Verify Document">
                          <FileCheck size={12} strokeWidth={2.5} /> Verify
                        </button>
                      )}
                      <button onClick={() => handleDelete(req.id)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded border border-transparent transition-colors" title="Delete Request">
                        <Trash2 size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRequests.length === 0 && (
            <div className="text-center py-10 flex flex-col items-center">
              <ShieldAlert size={40} className="text-slate-200 mb-3" />
              <p className="text-slate-500 font-medium text-[13px]">No document requests found for current view.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Request Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-extrabold text-slate-800 text-[16px]">Request Missing Document</h3>
            </div>
            <form onSubmit={handleSendRequest} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Select Customer / Application</label>
                <select 
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full h-11 px-3 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-[#489b0d] bg-white"
                >
                  <option value="">Select an application...</option>
                  <option value="Suresh Patel">APP-2025-125 - Suresh Patel</option>
                  <option value="Anita Roy">APP-2025-126 - Anita Roy</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Document Required</label>
                <select 
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full h-11 px-3 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-[#489b0d] bg-white"
                >
                  <option value="">Select document type...</option>
                  <option value="6 Months Bank Statement">6 Months Bank Statement</option>
                  <option value="ITR 2024">ITR 2024</option>
                  <option value="Salary Slip (Last 3 months)">Salary Slip (Last 3 months)</option>
                  <option value="Property Documents">Property Documents</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Additional Instructions (Optional)</label>
                <textarea 
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows="3" 
                  className="w-full border border-slate-200 rounded-lg p-3 text-[13px] text-slate-700 focus:outline-none focus:border-[#489b0d] resize-none"
                  placeholder="E.g., Please upload a clear PDF of the statement with password removed."
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 h-11 rounded-lg border border-slate-200 text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 h-11 rounded-lg bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send size={16} /> Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
