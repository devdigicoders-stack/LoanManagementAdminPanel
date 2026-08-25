import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockAgentLeads } from "./agentData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function ScheduleVisit() {
  const navigate = useNavigate();
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [form, setForm] = useState({ date: "", time: "", location: "", purpose: "", notes: "" });

  const selectedLead = mockAgentLeads.find(l => l.id === selectedLeadId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!selectedLeadId || !form.date || !form.time || !form.location) {
      alert("Please complete all required fields.");
      return;
    }
    alert("Customer visit scheduled successfully.");
    navigate("/agent/visits");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Schedule Customer Visit</h1>
        <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Plan a new field visit or meeting with an assigned lead.</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold" style={{ color: tc.text }}>Mobile</label>
              <input
                type="text"
                readOnly
                value={selectedLead ? selectedLead.mobile : ""}
                className="w-full h-11 px-4 rounded-xl text-[13px] outline-none bg-gray-50"
                style={{ border: `1px solid ${tc.border}`, color: tc.muted }}
                placeholder="Auto populated"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold" style={{ color: tc.text }}>Visit Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full h-11 px-4 rounded-xl text-[13px] outline-none"
                style={{ border: `1px solid ${tc.border}`, color: tc.text }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold" style={{ color: tc.text }}>Visit Time <span className="text-red-500">*</span></label>
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
            <label className="text-[13px] font-bold" style={{ color: tc.text }}>Visit Location <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="Enter meeting location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none"
              style={{ border: `1px solid ${tc.border}`, color: tc.text }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold" style={{ color: tc.text }}>Visit Purpose</label>
            <select
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none bg-white"
              style={{ border: `1px solid ${tc.border}`, color: tc.text }}
            >
              <option value="">Select purpose</option>
              <option value="Loan Discussion">Loan Discussion</option>
              <option value="Document Collection">Document Collection</option>
              <option value="Property Visit">Property Visit</option>
              <option value="Application Discussion">Application Discussion</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold" style={{ color: tc.text }}>Additional Notes</label>
            <textarea
              placeholder="Enter visit instructions or notes..."
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
              Schedule Visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
