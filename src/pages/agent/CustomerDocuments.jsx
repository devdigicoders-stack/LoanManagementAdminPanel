import { useState } from "react";
import { FolderOpen, Upload, Search, Download, Trash2 } from "lucide-react";
import { mockAgentLeads } from "./agentData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function CustomerDocuments() {
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [form, setForm] = useState({ docType: "", file: null, remark: "" });

  const selectedLead = mockAgentLeads.find(l => l.id === selectedLeadId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!selectedLeadId || !form.docType || !form.file) {
      alert("Please complete all required fields and select a file.");
      return;
    }
    alert("Document uploaded successfully.");
    setForm({ docType: "", file: null, remark: "" });
  };

  const documentTypes = [
    "Aadhaar Card", "PAN Card", "Address Proof", "Income Proof", 
    "Salary Slip", "Bank Statement", "Property Documents", "Business Proof", "Other"
  ];

  return (
    <div className="space-y-6 w-full">
      
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Customer Documents</h1>
        <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Collect and upload initial documents required for the loan application.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <h2 className="text-[15px] font-extrabold flex items-center gap-2 mb-5" style={{ color: tc.text }}>
              <Upload size={16} style={{ color: tc.blue }} /> Upload Document
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold" style={{ color: tc.text }}>Lead <span className="text-red-500">*</span></label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl text-[12px] outline-none bg-white"
                  style={{ border: `1px solid ${tc.border}`, color: tc.text }}
                >
                  <option value="">Select assigned lead</option>
                  {mockAgentLeads.map(l => (
                    <option key={l.id} value={l.id}>{l.id} - {l.customerName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold" style={{ color: tc.text }}>Customer</label>
                <input
                  type="text"
                  readOnly
                  value={selectedLead ? selectedLead.customerName : ""}
                  className="w-full h-10 px-3 rounded-xl text-[12px] outline-none bg-gray-50"
                  style={{ border: `1px solid ${tc.border}`, color: tc.muted }}
                  placeholder="Auto populated"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold" style={{ color: tc.text }}>Document Type <span className="text-red-500">*</span></label>
                <select
                  value={form.docType}
                  onChange={(e) => setForm({ ...form, docType: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl text-[12px] outline-none bg-white"
                  style={{ border: `1px solid ${tc.border}`, color: tc.text }}
                >
                  <option value="">Select document type</option>
                  {documentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold" style={{ color: tc.text }}>Upload Document <span className="text-red-500">*</span></label>
                <input
                  type="file"
                  onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                  className="w-full text-[12px] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[12px] file:font-bold file:bg-[#DFF3FF] file:text-[#1e7ba8] hover:file:opacity-90"
                  style={{ color: tc.text }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold" style={{ color: tc.text }}>Document Remark</label>
                <textarea
                  placeholder="Enter document details..."
                  rows={2}
                  value={form.remark}
                  onChange={(e) => setForm({ ...form, remark: e.target.value })}
                  className="w-full p-3 rounded-xl text-[12px] outline-none resize-none"
                  style={{ border: `1px solid ${tc.border}`, color: tc.text }}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90 mt-2"
                style={{ background: tc.blue }}
              >
                Upload Document
              </button>
            </form>
          </div>
        </div>

        {/* Status Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <h2 className="text-[15px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}>
                <FolderOpen size={16} style={{ color: tc.primary }} /> Document Status
              </h2>
              <div className="relative max-w-xs w-full">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.muted }} />
                <input type="text" placeholder="Search documents..." className="w-full h-9 pl-9 pr-3 rounded-lg text-[12px] outline-none" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} />
              </div>
            </div>

            {selectedLeadId ? (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr style={{ background: tc.sky }}>
                      {["Document Type", "Status", "Uploaded On", "Remark", "Actions"].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Mock Data based on selection */}
                    <tr style={{ borderBottom: `1px solid ${tc.border}` }}>
                      <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: tc.text }}>Aadhaar Card</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "#DCFCE7", color: "#15803D" }}>Verified</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>24 Aug 2026</td>
                      <td className="px-4 py-3 min-w-[150px]" style={{ color: tc.muted }}>Front and back clear</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: tc.blue }} title="Download"><Download size={14} /></button>
                        </div>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${tc.border}` }}>
                      <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: tc.text }}>PAN Card</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "#FEF3C7", color: "#D97706" }}>Under Verification</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>25 Aug 2026</td>
                      <td className="px-4 py-3 min-w-[150px]" style={{ color: tc.muted }}>-</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: tc.blue }} title="Download"><Download size={14} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-600" title="Delete"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${tc.border}` }}>
                      <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: tc.text }}>Bank Statement</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "#FEE2E2", color: "#DC2626" }}>Re-upload Required</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>23 Aug 2026</td>
                      <td className="px-4 py-3 min-w-[150px]" style={{ color: tc.muted }}>Blurry image, please re-upload last 6 months.</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: tc.blue }} title="Download"><Download size={14} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-600" title="Delete"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[14px] font-bold" style={{ color: tc.text }}>No documents available</p>
                <p className="text-[12px] mt-1" style={{ color: tc.muted }}>Select a lead from the left to view and manage their documents.</p>
              </div>
            )}

            <div className="mt-5 p-4 rounded-xl text-[12px] leading-relaxed" style={{ background: tc.cream, border: `1px solid ${tc.border}`, color: tc.text }}>
              <strong>Important Permission:</strong> Agent Operator can upload, view, and download permitted documents. You cannot final verify, approve, or reject documents unless explicitly given permission by Sales/Operations Admin.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
