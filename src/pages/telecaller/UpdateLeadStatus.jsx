import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RefreshCw, ChevronDown, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { mockLeads, statusColors } from "./telecallerData";

const tc = {
  card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  cream: "#FFF8E7", text: "#344054", muted: "#667085", border: "#D9EAF2", blue: "#1e7ba8",
};

const statuses = ["New", "Contacted", "Interested", "Follow-up", "Documents Pending", "Application Submitted", "Converted", "Lost"];

export default function UpdateLeadStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = mockLeads.find(l => l.id === id) || mockLeads[0];

  if (!lead) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm max-w-xl mx-auto my-8">
        <h2 className="text-lg font-bold text-slate-700">No Lead Found</h2>
        <p className="text-sm text-slate-500 mt-2">There are currently no leads available to update.</p>
        <button onClick={() => navigate(-1)} className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all">
          Go Back
        </button>
      </div>
    );
  }

  const [status, setStatus] = useState(lead.status);
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!status || !reason) {
      toast.error("Please select new status and enter reason.");
      return;
    }
    toast.success("Lead status updated successfully.");
    navigate(`/telecaller/leads/${lead.id}`);
  };

  const sc = statusColors[lead.status] || { bg: "#F1F5F9", text: "#64748B" };
  const nc = statusColors[status] || { bg: "#F1F5F9", text: "#64748B" };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Update Lead Status</h1>
        <p className="text-[13px]" style={{ color: tc.muted }}>Change status and record reason for lead {lead.id}.</p>
      </div>

      <div className="p-4 rounded-xl mb-6" style={{ background: tc.sky, border: `1px solid ${tc.skyMid}` }}>
        <p className="text-[12px] font-bold mb-2" style={{ color: tc.blue }}>Current Status Flow:</p>
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold" style={{ color: tc.muted }}>
          <span>New</span><ArrowRight size={10} />
          <span>Contacted</span><ArrowRight size={10} />
          <span>Interested</span><ArrowRight size={10} />
          <span>Follow-up</span><ArrowRight size={10} />
          <span>Documents Pending</span><ArrowRight size={10} />
          <span>Application Submitted</span><ArrowRight size={10} />
          <span style={{ color: "#059669" }}>Converted</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="flex items-center justify-between pb-5" style={{ borderBottom: `1px solid ${tc.border}` }}>
          <div>
            <p className="text-[12px] font-bold mb-1" style={{ color: tc.muted }}>Current Status</p>
            <span className="px-3 py-1 rounded-full text-[13px] font-bold" style={{ background: sc.bg, color: sc.text }}>{lead.status}</span>
          </div>
          <ArrowRight size={20} style={{ color: tc.muted }} />
          <div className="text-right">
            <p className="text-[12px] font-bold mb-1" style={{ color: tc.muted }}>New Status</p>
            <span className="px-3 py-1 rounded-full text-[13px] font-bold" style={{ background: nc.bg, color: nc.text }}>{status}</span>
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Select New Status <span style={{ color: "#DC2626" }}>*</span></label>
          <div className="relative">
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border text-[14px] font-bold outline-none appearance-none cursor-pointer"
              style={{ borderColor: tc.border, background: tc.sky, color: tc.blue }}>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: tc.blue }} />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Reason / Remarks <span style={{ color: "#DC2626" }}>*</span></label>
          <textarea rows={4} placeholder="Enter reason for status change..."
            value={reason} onChange={e => setReason(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border text-[13px] font-medium outline-none resize-none"
            style={{ borderColor: tc.border, background: tc.cream, color: tc.text }} />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl text-[13px] font-bold border"
            style={{ borderColor: tc.border, color: tc.muted }}>
            Cancel
          </button>
          <button type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white"
            style={{ background: tc.blue }}>
            <RefreshCw size={15} /> Update Status
          </button>
        </div>
      </form>
    </div>
  );
}
