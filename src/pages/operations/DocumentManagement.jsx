import React, { useState } from 'react';
import { 
  FileText, Search, Filter, RefreshCw, Eye, Download, ShieldCheck, 
  XCircle, FileSearch, X, RotateCw, CheckCircle2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockDocs = [];


export default function DocumentManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [showPreview, setShowPreview] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handlePreview = (doc) => {
    setSelectedDoc(doc);
    setShowPreview(true);
  };

  const handleReject = (doc) => {
    setSelectedDoc(doc);
    setShowReject(true);
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Pending Verification': return 'bg-[#FFF8E7] text-[#D97706] border-[#FDE68A]';
      case 'Verified': return 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';
      case 'Rejected': return 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]';
      case 'Re-upload Required': return 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]';
      default: return 'bg-[#FAFCFD] text-[#344054] border-[#D9EAF2]';
    }
  };

  const StatCard = ({ title, value, icon: Icon, bg, color }) => (
    <div className="bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all p-6 flex flex-col relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${bg} to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center shrink-0 border border-[#D9EAF2]`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
      </div>
      <p className="text-[13px] font-bold text-[#667085] mb-1">{title}</p>
      <h3 className="text-3xl font-black text-[#344054] tracking-tight">{value}</h3>
    </div>
  );

  return (
    <div className="w-full bg-[#FAFCFD] min-h-screen p-4 space-y-6 pb-12 relative">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-[24px] p-8 border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#DFF3FF] to-[#FFF8E7] rounded-full blur-3xl opacity-70 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#344054] tracking-tight">Document Management</h1>
            <p className="text-[15px] text-[#667085] font-medium mt-2">Review, verify and manage documents submitted with loan applications.</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard title="Total Documents" value="1,245" icon={FileText} bg="from-[#FAFCFD]" color="text-[#667085]" />
        <StatCard title="Pending Verification" value="142" icon={FileSearch} bg="from-[#FFF8E7]" color="text-[#D97706]" />
        <StatCard title="Verified Documents" value="890" icon={ShieldCheck} bg="from-[#ECFDF5]" color="text-[#059669]" />
        <StatCard title="Rejected Documents" value="18" icon={XCircle} bg="from-[#FEF2F2]" color="text-[#DC2626]" />
        <StatCard title="Re-upload Required" value="45" icon={RotateCw} bg="from-[#F3E8FF]" color="text-[#7E22CE]" />
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-[24px] border border-[#D9EAF2] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#667085]" />
          <input 
            type="text" 
            placeholder="Search by App ID, Customer Name or Document Name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8ED3F4] text-[14px] font-medium text-[#344054] transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select className="px-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8ED3F4] text-[14px] font-bold text-[#344054] cursor-pointer min-w-[140px] transition-all">
            <option value="">All Types</option>
            <option value="Identity Proof">Identity Proof</option>
            <option value="Address Proof">Address Proof</option>
            <option value="Income Proof">Income Proof</option>
          </select>
          <select className="px-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8ED3F4] text-[14px] font-bold text-[#344054] cursor-pointer min-w-[140px] transition-all">
            <option value="">All Statuses</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button className="flex items-center justify-center gap-2 px-5 py-3 bg-[#BFE7F7] text-[#0369A1] rounded-xl font-bold text-[14px] hover:bg-[#8ED3F4] transition-colors shadow-sm">
             <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#EFF9FE] border-b border-[#D9EAF2]">
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Application</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Document Name & Type</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Uploaded By</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Status</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0FAFF]">
              {mockDocs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-[#667085] font-medium text-[13px]">
                    No documents found.
                  </td>
                </tr>
              ) : mockDocs.map((doc, idx) => (
                <tr key={idx} className="hover:bg-[#F7FCFF] transition-colors group">
                  <td className="py-4 px-5">
                    <p className="text-[13px] font-black text-[#344054] hover:text-[#0284C7] cursor-pointer" onClick={() => navigate(`/operations/applications/${doc.id}`)}>{doc.id}</p>
                    <p className="text-[12px] font-semibold text-[#667085] mt-0.5">{doc.customer}</p>
                  </td>
                  <td className="py-4 px-5">
                    <p className="text-[13px] font-bold text-[#344054] flex items-center gap-2">
                       <FileText size={14} className="text-[#0284C7]" />
                       {doc.docName}
                    </p>
                    <p className="text-[11px] font-semibold text-[#667085] mt-1">{doc.type}</p>
                  </td>
                  <td className="py-4 px-5">
                    <p className="text-[13px] font-bold text-[#344054]">{doc.by}</p>
                    <p className="text-[11px] font-semibold text-[#667085] mt-0.5">{doc.date}</p>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`px-2.5 py-1 text-[10px] font-black rounded-md border uppercase tracking-wide ${getStatusStyle(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handlePreview(doc)} className="text-[12px] font-bold text-[#0284C7] bg-[#DFF3FF] px-2.5 py-1.5 rounded-lg hover:bg-[#BFE7F7] transition-colors border border-[#BFE7F7] flex items-center gap-1">
                        <Eye size={14} /> View
                      </button>
                      <button className="text-[12px] font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-1.5 rounded-lg hover:bg-[#D1FAE5] transition-colors border border-[#A7F3D0] flex items-center gap-1">
                        <CheckCircle2 size={14} /> Verify
                      </button>
                      <button onClick={() => handleReject(doc)} className="text-[12px] font-bold text-[#DC2626] bg-[#FEF2F2] px-2.5 py-1.5 rounded-lg hover:bg-[#FECACA] transition-colors border border-[#FECACA] flex items-center gap-1">
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {showReject && selectedDoc && (
        <div className="fixed inset-0 bg-[#344054]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-[#D9EAF2] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#D9EAF2] flex justify-between items-center bg-[#FAFCFD]">
              <h3 className="text-xl font-black text-[#344054]">Reject Document</h3>
              <button onClick={() => setShowReject(false)} className="text-[#667085] hover:text-[#DC2626] transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[14px] font-medium text-[#667085]">Please provide a reason for rejecting the document: <span className="font-bold text-[#344054]">{selectedDoc.docName}</span></p>
              <div>
                <label className="text-[12px] font-bold text-[#344054] uppercase tracking-wide block mb-2">Rejection Reason</label>
                <textarea 
                  className="w-full h-28 p-3 rounded-xl border border-[#D9EAF2] focus:ring-2 focus:ring-[#FECACA] focus:outline-none text-[14px] text-[#344054] bg-[#FAFCFD] resize-none"
                  placeholder="Enter rejection reason..."
                ></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-[#D9EAF2] bg-[#FAFCFD] flex justify-end gap-3">
              <button onClick={() => setShowReject(false)} className="px-5 py-2.5 rounded-xl font-bold text-[14px] text-[#344054] bg-white border border-[#D9EAF2] hover:bg-[#F0FAFF] transition-all">Cancel</button>
              <button onClick={() => setShowReject(false)} className="px-5 py-2.5 rounded-xl font-bold text-[14px] text-white bg-[#DC2626] border border-[#B91C1C] hover:bg-[#B91C1C] shadow-md transition-all">Reject Document</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedDoc && (
        <div className="fixed inset-0 bg-[#344054]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-8">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-6xl h-full max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-300">
            {/* Header */}
            <div className="p-6 border-b border-[#D9EAF2] flex justify-between items-center bg-[#FAFCFD] shrink-0">
              <div className="flex flex-col">
                <h3 className="text-xl font-black text-[#344054]">Document Preview</h3>
                <p className="text-[13px] font-bold text-[#667085] mt-1">{selectedDoc.customer} • {selectedDoc.id} • {selectedDoc.docName}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#344054] border border-[#D9EAF2] rounded-xl font-bold text-[13px] hover:bg-[#F0FAFF] transition-all">
                  <Download size={16} /> Download
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] rounded-xl font-bold text-[13px] hover:bg-[#D1FAE5] transition-all">
                  <CheckCircle2 size={16} /> Verify
                </button>
                <button onClick={() => {setShowPreview(false); handleReject(selectedDoc);}} className="flex items-center gap-2 px-4 py-2 bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] rounded-xl font-bold text-[13px] hover:bg-[#FECACA] transition-all">
                  <XCircle size={16} /> Reject
                </button>
                <button onClick={() => setShowPreview(false)} className="p-2 ml-4 text-[#667085] hover:text-[#344054] hover:bg-[#F0FAFF] rounded-xl transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>
            
            {/* Content (Mock PDF viewer) */}
            <div className="flex-1 bg-[#F1F5F9] p-8 overflow-y-auto flex items-center justify-center">
              <div className="w-full max-w-3xl aspect-[1/1.4] bg-white shadow-lg border border-[#E2E8F0] flex flex-col items-center justify-center p-12 text-center">
                 <FileText size={80} className="text-[#D9EAF2] mb-6" />
                 <h2 className="text-2xl font-black text-[#344054]">{selectedDoc.docName}</h2>
                 <p className="text-[#667085] mt-2">Document Preview renders here.</p>
                 <div className="mt-12 grid grid-cols-2 gap-x-12 gap-y-4 text-left w-full max-w-sm border-t border-[#D9EAF2] pt-6">
                    <div>
                      <p className="text-[11px] font-bold text-[#94A3B8] uppercase">Uploaded By</p>
                      <p className="text-[14px] font-bold text-[#344054]">{selectedDoc.by}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#94A3B8] uppercase">Upload Date</p>
                      <p className="text-[14px] font-bold text-[#344054]">{selectedDoc.date}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#94A3B8] uppercase">Document Type</p>
                      <p className="text-[14px] font-bold text-[#344054]">{selectedDoc.type}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#94A3B8] uppercase">Current Status</p>
                      <p className="text-[14px] font-bold text-[#D97706]">{selectedDoc.status}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
