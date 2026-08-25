import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockAgentLeads } from "./agentData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function AddFollowup() {
  const navigate = useNavigate();
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [form, setForm] = useState({ date: "", time: "", type: "", purpose: "", remarks: "" });

  const selectedLead = mockAgentLeads.find(l => l.id === selectedLeadId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!selectedLeadId || !form.date || !form.time || !form.type) {
      alert("Please complete all required fields.");
      return;
    }
    alert("Follow-up scheduled successfully.");
    navigate("/agent/followups");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Schedule Follow-up</h1>
        <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Plan your next interaction with the customer.</p>
      </div>

      <div className="rounded-2xl p-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold" style={{ color: tc.text }}>Lead <span className="text-red-500">*</span></label>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all bg-white"
              style={{ border: `1px solid ${tc.border}`, color: tc.text }}
            >
              <option value="">Select assigned lead</option>
              {mockAgentLeads.map(l => (
                <option key={l.id} value={l.id}>{l.id} - {l.customerName}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold" style={{ color: tc.text }}>Customer</label>
            <input
              type="text"
              readOnly
              value={selectedLead ? selectedLead.customerName : ""}
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none bg-gray-50"
              style={{ border: `1px solid ${tc.border}`, color: tc.muted }}
              placeholder="Auto populated"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold" style={{ color: tc.text }}>Follow-up Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full h-11 px-4 rounded-xl text-[13px] outline-none"
                style={{ border: `1px solid ${tc.border}`, color: tc.text }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold" style={{ color: tc.text }}>Follow-up Time <span className="text-red-500">*</span></label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full h-11 px-4 rounded-xl text-[13px] outline-none"
                style={{ border: `1px solid ${tc.border}`, color: tc.text }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold" style={{ color: tc.text }}>Follow-up Type <span className="text-red-500">*</span></label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none bg-white"
              style={{ border: `1px solid ${tc.border}`, color: tc.text }}
            >
              <option value="">Select type</option>
              <option value="Call">Call</option>
              <option value="Visit">Visit</option>
              <option value="Meeting">Meeting</option>
              <option value="Document Collection">Document Collection</option>
              <option value="Application Follow-up">Application Follow-up</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold" style={{ color: tc.text }}>Purpose</label>
            <input
              type="text"
              placeholder="Enter purpose..."
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none"
              style={{ border: `1px solid ${tc.border}`, color: tc.text }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold" style={{ color: tc.text }}>Remarks</label>
            <textarea
              placeholder="Enter follow-up notes..."
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
              className="w-full h-12 rounded-xl text-[14px] font-bold text-white transition-all hover:opacity-90"
              style={{ background: tc.blue }}
            >
              Schedule Follow-up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
