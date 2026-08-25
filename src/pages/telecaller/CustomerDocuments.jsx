import { useState } from "react";
import { Upload, ChevronDown, FileText, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { mockDocuments, mockLeads } from "./telecallerData";

const tc = {
  card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  cream: "#FFF8E7", text: "#344054", muted: "#667085", border: "#D9EAF2", blue: "#1e7ba8",
};

const docTypes = ["Aadhaar Card", "PAN Card", "Address Proof", "Income Proof", "Salary Slip", "Bank Statement", "Property Document", "Other"];

export default function CustomerDocuments() {
  const [form, setForm] = useState({ leadId: "", type: "", file: null, remark: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.leadId || !form.type || !form.file) {
      toast.error("Please fill all required fields and select a file.");
      return;
    }
    toast.success("Document uploaded successfully.");
    setForm({ leadId: "", type: "", file: null, remark: "" });
  };

  const getStatusBadge = (status) => {
    if (status === "Verified") return <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#DCFCE7", color: "#15803D" }}><CheckCircle2 size={12} /> Verified</span>;
    if (status === "Under Verification") return <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: tc.sky, color: tc.blue }}><Clock size={12} /> Under Verification</span>;
    if (status === "Pending") return <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#FEF3C7", color: "#D97706" }}><AlertCircle size={12} /> Pending</span>;
    if (status === "Rejected" || status === "Re-upload Required") return <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#FEE2E2", color: "#DC2626" }}><AlertCircle size={12} /> {status}</span>;
    return <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#F1F5F9", color: "#64748B" }}>{status}</span>;
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Customer Documents</h1>
        <p className="text-[13px]" style={{ color: tc.muted }}>Upload and manage initial documents received from customers.</p>
      </div>

      <div className="p-4 rounded-xl mb-6" style={{ background: "#FEF9C3", border: "1px solid #FDE047" }}>
        <p className="text-[12px] font-bold" style={{ color: "#854D0E" }}>
          <strong>Important:</strong> You can upload and view documents. Final document verification is done by the operations team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <h3 className="text-[15px] font-extrabold mb-4 pb-3 flex items-center gap-2" style={{ color: tc.text, borderBottom: `1px solid ${tc.border}` }}>
              <Upload size={16} style={{ color: tc.primary }} /> Upload Document
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Lead <span style={{ color: "#DC2626" }}>*</span></label>
                <div className="relative">
                  <select value={form.leadId} onChange={e => setForm({ ...form, leadId: e.target.value })}
                    className="w-full h-10 px-4 rounded-xl border text-[13px] font-medium outline-none appearance-none cursor-pointer"
                    style={{ borderColor: tc.border, background: tc.sky, color: tc.text }}>
                    <option value="">Select lead</option>
                    {mockLeads.map(l => <option key={l.id} value={l.id}>{l.id} - {l.customerName}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: tc.muted }} />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Document Type <span style={{ color: "#DC2626" }}>*</span></label>
                <div className="relative">
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full h-10 px-4 rounded-xl border text-[13px] font-medium outline-none appearance-none cursor-pointer"
                    style={{ borderColor: tc.border, background: tc.sky, color: tc.text }}>
                    <option value="">Select document</option>
                    {docTypes.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: tc.muted }} />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Upload Document <span style={{ color: "#DC2626" }}>*</span></label>
                <input type="file" onChange={e => setForm({ ...form, file: e.target.files[0] })}
                  className="w-full px-4 py-2 rounded-xl border text-[12px] font-medium outline-none cursor-pointer"
                  style={{ borderColor: tc.border, background: tc.sky, color: tc.muted }} />
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Document Remark</label>
                <textarea rows={3} placeholder="Enter document details..."
                  value={form.remark} onChange={e => setForm({ ...form, remark: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border text-[13px] font-medium outline-none resize-none"
                  style={{ borderColor: tc.border, background: tc.sky, color: tc.text }} />
              </div>

              <button type="submit"
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl text-[13px] font-bold text-white transition-colors hover:opacity-90"
                style={{ background: tc.blue }}>
                Upload Document
              </button>
            </div>
          </form>
        </div>

        {/* Documents List */}
        <div className="lg:col-span-2 rounded-2xl" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <div className="p-5" style={{ borderBottom: `1px solid ${tc.border}` }}>
            <h3 className="text-[15px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}>
              <FileText size={16} style={{ color: tc.primary }} /> Uploaded Documents
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ background: tc.sky }}>
                  <th className="text-left px-5 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>Lead & Customer</th>
                  <th className="text-left px-5 py-3 font-bold" style={{ color: tc.blue }}>Document Type</th>
                  <th className="text-left px-5 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>Status</th>
                  <th className="text-left px-5 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>Uploaded On</th>
                </tr>
              </thead>
              <tbody>
                {mockDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center">
                      <p className="font-bold text-[14px]" style={{ color: tc.muted }}>No documents available</p>
                      <p className="text-[12px]" style={{ color: tc.primary }}>No documents have been uploaded yet.</p>
                    </td>
                  </tr>
                ) : mockDocuments.map((d, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-[#FAFCFD] transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-bold" style={{ color: tc.blue }}>{d.leadId}</p>
                      <p className="font-semibold text-[11px]" style={{ color: tc.text }}>{d.customer}</p>
                    </td>
                    <td className="px-5 py-4 font-bold" style={{ color: tc.text }}>{d.type}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {getStatusBadge(d.status)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-medium" style={{ color: tc.muted }}>{d.uploaded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
