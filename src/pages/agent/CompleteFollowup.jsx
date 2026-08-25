import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { mockFollowups } from "./agentData";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function CompleteFollowup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const followup = mockFollowups.find(f => f.id === id) || mockFollowups[0];

  const [form, setForm] = useState({ outcome: "", response: "", scheduleNext: false, nextDate: "", nextTime: "", nextPurpose: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!form.outcome) {
      alert("Please select an outcome.");
      return;
    }
    alert("Follow-up completed successfully.");
    navigate("/agent/followups");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="flex items-center gap-3">
        <Link to="/agent/followups" className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:opacity-80" style={{ background: tc.card, border: `1px solid ${tc.border}`, color: tc.muted }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-[20px] font-extrabold" style={{ color: tc.text }}>Complete Follow-up</h1>
          <p className="text-[12px] mt-0.5" style={{ color: tc.muted }}>Record the result of your recent interaction.</p>
        </div>
      </div>

      <div className="rounded-2xl p-5" style={{ background: tc.sky, border: `1px solid ${tc.skyMid}` }}>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div>
            <p className="text-[11px] font-bold" style={{ color: tc.blue }}>Customer Name</p>
            <p className="text-[14px] font-extrabold" style={{ color: tc.text }}>{followup.customerName} <span className="text-[11px] font-medium" style={{ color: tc.blue }}>({followup.leadId})</span></p>
          </div>
          <div>
            <p className="text-[11px] font-bold" style={{ color: tc.blue }}>Scheduled Date & Time</p>
            <p className="text-[14px] font-extrabold" style={{ color: tc.text }}>{followup.date} at {followup.time}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold" style={{ color: tc.text }}>Outcome <span className="text-red-500">*</span></label>
            <select
              required
              value={form.outcome}
              onChange={(e) => setForm({ ...form, outcome: e.target.value })}
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none bg-white"
              style={{ border: `1px solid ${tc.border}`, color: tc.text }}
            >
              <option value="">Select outcome</option>
              <option value="Interested">Interested</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Call Back Later">Call Back Later</option>
              <option value="Documents Required">Documents Required</option>
              <option value="Documents Received">Documents Received</option>
              <option value="Application Ready">Application Ready</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold" style={{ color: tc.text }}>Customer Response</label>
            <textarea
              placeholder="Enter customer response..."
              rows={3}
              value={form.response}
              onChange={(e) => setForm({ ...form, response: e.target.value })}
              className="w-full p-4 rounded-xl text-[13px] outline-none resize-none"
              style={{ border: `1px solid ${tc.border}`, color: tc.text }}
            ></textarea>
          </div>

          <div className="pt-2 pb-2" style={{ borderTop: `1px solid ${tc.border}` }}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={form.scheduleNext}
                onChange={(e) => setForm({ ...form, scheduleNext: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-[13px] font-bold" style={{ color: tc.text }}>Schedule Next Follow-up</span>
            </label>
          </div>

          {form.scheduleNext && (
            <div className="p-4 rounded-xl space-y-4" style={{ background: tc.bg, border: `1px solid ${tc.border}` }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold" style={{ color: tc.text }}>Date</label>
                  <input type="date" value={form.nextDate} onChange={(e) => setForm({...form, nextDate: e.target.value})} className="w-full h-10 px-3 rounded-lg text-[13px] outline-none" style={{ border: `1px solid ${tc.border}`, color: tc.text }} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold" style={{ color: tc.text }}>Time</label>
                  <input type="time" value={form.nextTime} onChange={(e) => setForm({...form, nextTime: e.target.value})} className="w-full h-10 px-3 rounded-lg text-[13px] outline-none" style={{ border: `1px solid ${tc.border}`, color: tc.text }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold" style={{ color: tc.text }}>Purpose</label>
                <input type="text" placeholder="Purpose for next follow-up" value={form.nextPurpose} onChange={(e) => setForm({...form, nextPurpose: e.target.value})} className="w-full h-10 px-3 rounded-lg text-[13px] outline-none" style={{ border: `1px solid ${tc.border}`, color: tc.text }} />
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full h-12 flex items-center justify-center gap-2 rounded-xl text-[14px] font-bold text-white transition-all hover:opacity-90"
              style={{ background: tc.blue }}
            >
              <CheckCircle2 size={18} /> Save Outcome
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
