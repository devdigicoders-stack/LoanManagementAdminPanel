import React, { useState } from "react";
import { 
  ChevronRight, Search, CheckCircle2, XCircle, Eye, 
  FileText
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const mockDocsToVerify = [];


export default function VerifyDocuments() {
  const [documents, setDocuments] = useState(mockDocsToVerify);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAction = (id, action) => {
    Swal.fire({
      title: `Confirm ${action}?`,
      text: `Are you sure you want to ${action.toLowerCase()} this document?`,
      icon: action === 'Approve' ? 'success' : 'warning',
      showCancelButton: true,
      confirmButtonColor: action === 'Approve' ? '#489b0d' : '#ef4444',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: `Yes, ${action}!`
    }).then((result) => {
      if (result.isConfirmed) {
        setDocuments(prev => prev.map(doc => 
          doc.id === id ? { ...doc, status: action === 'Approve' ? 'Approved' : 'Rejected' } : doc
        ));
        toast.success(`Document ${action.toLowerCase()}d successfully.`);
      }
    });
  };

  const filteredDocs = documents.filter(doc => {
    const matchStatus = filterStatus === "All" || doc.status === filterStatus;
    const matchSearch = doc.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status) => {
    if(status === 'Approved') return <span className="bg-[#489b0d]/10 text-[#489b0d] px-2 py-0.5 rounded text-[11px] font-bold">Approved</span>;
    if(status === 'Rejected') return <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded text-[11px] font-bold">Rejected</span>;
    return <span className="bg-orange-50 text-orange-500 px-2 py-0.5 rounded text-[11px] font-bold">Pending</span>;
  }

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Verify Documents</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">Verification</span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">All Documents</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white w-[140px]"
          >
            <option value="All">All Documents</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer..." 
              className="h-10 pl-9 pr-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white w-full sm:w-[250px]"
            />
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Document ID</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Document Type</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Uploaded On</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <span className="text-[13px] font-bold text-slate-700">{doc.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] font-bold text-slate-800">{doc.customer}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-slate-400" />
                      <p className="text-[13px] font-bold text-slate-700">{doc.type}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(doc.status)}
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[12px] font-semibold text-slate-600">{doc.date}</p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 transition-opacity">
                      <a 
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors tooltip-trigger" 
                        title="View Document"
                      >
                        <Eye size={16} strokeWidth={2.5} />
                      </a>
                      {doc.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleAction(doc.id, 'Approve')}
                            className="p-1.5 text-slate-400 hover:text-[#489b0d] hover:bg-[#489b0d]/10 rounded transition-colors tooltip-trigger" 
                            title="Approve"
                          >
                            <CheckCircle2 size={16} strokeWidth={2.5} />
                          </button>
                          <button 
                            onClick={() => handleAction(doc.id, 'Reject')}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors tooltip-trigger" 
                            title="Reject"
                          >
                            <XCircle size={16} strokeWidth={2.5} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDocs.length === 0 && (
            <div className="text-center py-10">
              <p className="text-slate-500 font-medium text-[13px]">No documents found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
