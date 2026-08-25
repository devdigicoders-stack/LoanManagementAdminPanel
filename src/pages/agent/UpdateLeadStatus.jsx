import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { mockAgentLeads, statusColors } from "./agentData";
import { ArrowLeft, CheckCircle2, GitMerge } from "lucide-react";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function UpdateLeadStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Using 1 for fallback as per Link to /agent/status/1
  const lead = mockAgentLeads.find(l => l.id === (id === "1" ? "LD-10245" : id)) || mockAgentLeads[0];

  const [form, setForm] = useState({ status: lead.status, remarks: "" });

  const statusOptions = [
    "New", "Contacted", "Interested", "Visit Scheduled", "Visit Completed", 
    "Follow-up", "Documents Pending", "Application Submitted", "Converted", "Lost"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!form.remarks) {
      alert("Please enter a reason/remark for the status change.");
      return;
    }
    alert("Lead status updated successfully.");
    navigate(`/agent/leads/${lead.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="flex items-center gap-3">
        <Link to={`/agent/leads/${lead.id}`} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:opacity-80" style={{ background: tc.card, border: `1px solid ${tc.border}`, color: tc.muted }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-[20px] font-extrabold" style={{ color: tc.text }}>Lead Status Tracking</h1>
          <p className="text-[12px] mt-0.5" style={{ color: tc.muted }}>Update the current stage of this lead.</p>
        </div>
      </div>

      <div className="rounded-2xl p-5" style={{ background: tc.sky, border: `1px solid ${tc.skyMid}` }}>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div>
            <p className="text-[11px] font-bold" style={{ color: tc.blue }}>Customer Name</p>
            <p className="text-[14px] font-extrabold" style={{ color: tc.text }}>{lead.customerName} <span className="text-[11px] font-medium" style={{ color: tc.blue }}>({lead.id})</span></p>
          </div>
          <div>
            <p className="text-[11px] font-bold" style={{ color: tc.blue }}>Current Status</p>
            <span className="px-2.5 py-0.5 rounded-full text-[12px] font-extrabold inline-block mt-0.5" style={{ background: statusColors[lead.status]?.bg || "#fff", color: statusColors[lead.status]?.text || tc.text }}>
              {lead.status}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        
        <div className="mb-6">
          <h2 className="text-[14px] font-extrabold flex items-center gap-2 mb-3" style={{ color: tc.text }}>
            <GitMerge size={16} style={{ color: tc.primary }} /> Lead Status Flow
          </h2>
          <div className="text-[11px] font-semibold flex flex-wrap gap-2 items-center" style={{ color: tc.muted }}>
            <span className="text-blue-600">New</span> → <span>Contacted</span> → <span>Interested</span> → <span>Visit</span> → <span>Documents</span> → <span className="text-green-600">Converted</span>
            <span className="ml-2 px-2 py-0.5 bg-red-50 text-red-600 rounded">Alternative: Lost</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold" style={{ color: tc.text }}>Update Status <span className="text-red-500">*</span></label>
            <select
              required
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none bg-white font-semibold"
              style={{ border: `1px solid ${tc.border}`, color: tc.text }}
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold" style={{ color: tc.text }}>Reason / Remarks <span className="text-red-500">*</span></label>
            <textarea
              required
              placeholder="Enter reason for status change..."
              rows={3}
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              className="w-full p-4 rounded-xl text-[13px] outline-none resize-none"
              style={{ border: `1px solid ${tc.border}`, color: tc.text }}
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 flex items-center justify-center gap-2 rounded-xl text-[14px] font-bold text-white transition-all hover:opacity-90"
              style={{ background: tc.blue }}
            >
              <CheckCircle2 size={18} /> Update Status
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
