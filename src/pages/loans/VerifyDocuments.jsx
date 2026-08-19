import React, { useState } from "react";
import { 
  ChevronRight, Search, FileText, CheckCircle2, XCircle, Eye, 
  Check, ScanLine, AlertTriangle, Fingerprint, Activity
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const mockDocsToVerify = [
  { id: "DOC-001", customer: "Rohit Kumar", type: "Aadhar Card", status: "Pending", date: "19 May 2025", match: 98, extracted: { Name: "Rohit Kumar", DOB: "12-05-1990", ID: "XXXX-XXXX-1234" } },
  { id: "DOC-002", customer: "Priya Sharma", type: "PAN Card", status: "Pending", date: "19 May 2025", match: 85, extracted: { Name: "Priya Sharma", DOB: "24-08-1992", ID: "ABCDE1234F" } },
  { id: "DOC-003", customer: "Amit Verma", type: "Bank Statement", status: "Pending", date: "18 May 2025", match: 99, extracted: { "Account Name": "Amit Verma", "A/C No": "XXXXX4567", "IFSC": "HDFC0001234" } },
  { id: "DOC-004", customer: "Neha Singh", type: "Salary Slip", status: "Pending", date: "18 May 2025", match: 72, extracted: { "Employee Name": "Neha Singh", "Net Pay": "₹45,000", "Month": "April 2025" } },
  { id: "DOC-005", customer: "Suresh Patel", type: "Voter ID", status: "Approved", date: "17 May 2025", match: 100, extracted: { Name: "Suresh Patel", EPIC: "XYZ1234567" } },
  { id: "DOC-006", customer: "Anita Roy", type: "Driving License", status: "Rejected", date: "16 May 2025", match: 45, extracted: { Name: "Anita M. Roy", "Valid Till": "Expired" } },
];

export default function VerifyDocuments() {
  const [documents, setDocuments] = useState(mockDocsToVerify);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Pending");
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
        setSelectedDoc(prev => prev ? { ...prev, status: action === 'Approve' ? 'Approved' : 'Rejected' } : null);
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
    if(status === 'Approved') return <span className="bg-[#489b0d]/10 text-[#489b0d] px-2 py-0.5 rounded text-[10px] font-bold border border-[#489b0d]/20">Approved</span>;
    if(status === 'Rejected') return <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold border border-red-200">Rejected</span>;
    return <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-200">Pending</span>;
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
            <span className="text-[#489b0d] font-bold">Pending Documents</span>
          </div>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer..." 
            className="h-10 pl-9 pr-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-white w-full sm:w-[250px]"
          />
        </div>
      </div>

      {/* Split Layout: List & Details */}
      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[550px]">
        
        {/* Document List */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <span className="font-bold text-slate-700 text-[14px]">Document Verification Queue</span>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-8 px-3 rounded border border-slate-200 text-[12px] font-bold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white cursor-pointer"
            >
              <option value="All">All Documents</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <div className="p-10 text-center text-slate-400 font-medium text-[13px] flex flex-col items-center">
                  <Fingerprint size={40} className="text-slate-200 mb-3" />
                  No documents found for current filter.
                </div>
              ) : (
                filteredDocs.map(doc => (
                  <div 
                    key={doc.id} 
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${selectedDoc?.id === doc.id ? 'bg-[#489b0d]/5 border-l-4 border-[#489b0d]' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${doc.status === 'Approved' ? 'bg-[#489b0d]/10 text-[#489b0d]' : doc.status === 'Rejected' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                        {doc.status === 'Approved' ? <CheckCircle2 size={18}/> : doc.status === 'Rejected' ? <XCircle size={18}/> : <FileText size={18} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[13px] font-bold text-slate-800">{doc.customer}</p>
                          {getStatusBadge(doc.status)}
                        </div>
                        <p className="text-[11px] font-medium text-slate-500">{doc.type} • {doc.date}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Document Viewer Panel */}
        <div className="w-full lg:w-[450px] bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col shrink-0 overflow-hidden">
          {selectedDoc ? (
            <>
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 text-[14px]">Document Intelligence</h3>
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-[#489b0d]" />
                  <span className="text-[11px] font-bold text-[#489b0d]">AI Scan Active</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                
                {/* Meta info & AI Score */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex flex-col justify-center">
                    <p className="text-[11px] font-semibold text-slate-500 mb-1">Customer & Document</p>
                    <p className="text-[13px] font-bold text-slate-800">{selectedDoc.customer}</p>
                    <p className="text-[12px] font-medium text-slate-600">{selectedDoc.type}</p>
                  </div>
                  <div className={`rounded-lg p-4 border flex flex-col items-center justify-center text-center ${selectedDoc.match >= 90 ? 'bg-[#489b0d]/10 border-[#489b0d]/20 text-[#489b0d]' : selectedDoc.match >= 70 ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-red-50 border-red-200 text-red-600'}`}>
                    <ScanLine size={24} className="mb-1" />
                    <p className="text-[16px] font-extrabold">{selectedDoc.match}% Match</p>
                    <p className="text-[10px] font-bold opacity-80">OCR Confidence Score</p>
                  </div>
                </div>

                {/* AI Extracted Data */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 p-3 border-b border-slate-200 flex justify-between items-center">
                    <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Extracted Data</h4>
                    {getStatusBadge(selectedDoc.status)}
                  </div>
                  <div className="p-4 grid grid-cols-1 gap-3">
                    {Object.entries(selectedDoc.extracted).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                        <span className="text-[12px] font-medium text-slate-500">{key}</span>
                        <span className="text-[13px] font-bold text-slate-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mock Image Placeholder */}
                <div className="flex-1 min-h-[180px] border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50 relative group">
                  <div className="text-center">
                    <ShieldAlert size={40} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-[12px] font-bold text-slate-400">Document Image Preview</p>
                    <p className="text-[10px] text-slate-400 mt-1">{selectedDoc.id}_{selectedDoc.type.replace(/\s+/g, '')}.jpg</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-auto">
                  {selectedDoc.status === 'Pending' ? (
                    <>
                      <button 
                        onClick={() => handleAction(selectedDoc.id, 'Reject')}
                        className="flex-1 h-11 flex items-center justify-center gap-2 rounded-lg border border-red-200 text-red-600 font-bold text-[13px] hover:bg-red-50 transition-colors"
                      >
                        <XCircle size={16} /> Reject
                      </button>
                      <button 
                        onClick={() => handleAction(selectedDoc.id, 'Approve')}
                        className="flex-1 h-11 flex items-center justify-center gap-2 rounded-lg bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm"
                      >
                        <CheckCircle2 size={16} /> Approve
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 h-11 flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 font-bold text-[13px]">
                      {selectedDoc.status === 'Approved' ? <CheckCircle2 size={16} className="text-[#489b0d]" /> : <XCircle size={16} className="text-red-500" />}
                      Document Already {selectedDoc.status}
                    </div>
                  )}
                </div>

              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <FileText size={24} className="text-slate-300" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-700 mb-1">No Document Selected</h3>
              <p className="text-[12px] text-slate-500">Select a document from the list to review and verify.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
