import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { mockFollowups, mockLeads } from "./telecallerData";

const tc = {
  card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  cream: "#FFF8E7", text: "#344054", muted: "#667085", border: "#D9EAF2", blue: "#1e7ba8",
};

export default function CompleteFollowup() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const fu = mockFollowups.find(f => f.id === id) || mockFollowups[0];
  const lead = fu ? (mockLeads.find(l => l.id === fu.leadId) || mockLeads[0]) : null;

  if (!fu || !lead) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm max-w-xl mx-auto my-8">
        <h2 className="text-lg font-bold text-slate-700">No Follow-up Found</h2>
        <p className="text-sm text-slate-500 mt-2">There are currently no pending follow-up records to complete.</p>
        <button onClick={() => navigate(-1)} className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all">
          Go Back
        </button>
      </div>
    );
  }

  const [outcome, setOutcome] = useState("");
  const [response, setResponse] = useState("");
  const [scheduleNext, setScheduleNext] = useState(false);
  const [nextDate, setNextDate] = useState("");
  const [nextTime, setNextTime] = useState("");
  const [nextPurpose, setNextPurpose] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!outcome || !response) {
      toast.error("Please provide outcome and customer response.");
      return;
    }
    if (scheduleNext && (!nextDate || !nextTime)) {
      toast.error("Please provide next follow-up date and time.");
      return;
    }
    toast.success("Follow-up completed successfully.");
    navigate("/telecaller/followups");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Complete Follow-up</h1>
        <p className="text-[13px]" style={{ color: tc.muted }}>Record the outcome of your follow-up.</p>
      </div>

      <div className="rounded-2xl p-5" style={{ background: tc.sky, border: `1px solid ${tc.skyMid}` }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[12px] font-semibold" style={{ color: tc.muted }}>Customer Name</p>
            <p className="text-[15px] font-extrabold" style={{ color: tc.text }}>{fu.customer}</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold" style={{ color: tc.muted }}>Lead ID</p>
            <p className="text-[15px] font-extrabold" style={{ color: tc.blue }}>{fu.leadId}</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold" style={{ color: tc.muted }}>Follow-up Date</p>
            <p className="text-[14px] font-bold" style={{ color: tc.text }}>{fu.date}</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold" style={{ color: tc.muted }}>Follow-up Time</p>
            <p className="text-[14px] font-bold" style={{ color: tc.text }}>{fu.time}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div>
          <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Follow-up Outcome <span style={{ color: "#DC2626" }}>*</span></label>
          <div className="relative">
            <select value={outcome} onChange={e => setOutcome(e.target.value)}
              className="w-full h-10 px-4 rounded-xl border text-[13px] font-medium outline-none appearance-none cursor-pointer"
              style={{ borderColor: tc.border, background: tc.sky, color: tc.text }}>
              <option value="">Select...</option>
              {["Interested", "Not Interested", "Call Back Later", "Documents Required", "Documents Received", "Application Ready", "Converted", "Lost"].map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: tc.muted }} />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Customer Response <span style={{ color: "#DC2626" }}>*</span></label>
          <textarea rows={3} placeholder="Enter customer's response..."
            value={response} onChange={e => setResponse(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border text-[13px] font-medium outline-none resize-none"
            style={{ borderColor: tc.border, background: tc.sky, color: tc.text }} />
        </div>

        <div className="pt-4" style={{ borderTop: `1px solid ${tc.border}` }}>
          <label className="flex items-center gap-2 cursor-pointer mb-4">
            <input type="checkbox" checked={scheduleNext} onChange={e => setScheduleNext(e.target.checked)} className="w-4 h-4 rounded text-[#1e7ba8] border-gray-300 focus:ring-[#1e7ba8]" />
            <span className="text-[13px] font-bold" style={{ color: tc.text }}>Schedule Next Follow-up</span>
          </label>
          
          {scheduleNext && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl" style={{ background: tc.cream, border: `1px solid ${tc.border}` }}>
              <div>
                <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Date <span style={{ color: "#DC2626" }}>*</span></label>
                <input type="date" value={nextDate} onChange={e => setNextDate(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl border text-[13px] font-medium outline-none"
                  style={{ borderColor: tc.border, background: "#fff", color: tc.text }} />
              </div>
              <div>
                <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Time <span style={{ color: "#DC2626" }}>*</span></label>
                <input type="time" value={nextTime} onChange={e => setNextTime(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl border text-[13px] font-medium outline-none"
                  style={{ borderColor: tc.border, background: "#fff", color: tc.text }} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Purpose</label>
                <input type="text" placeholder="Purpose" value={nextPurpose} onChange={e => setNextPurpose(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl border text-[13px] font-medium outline-none"
                  style={{ borderColor: tc.border, background: "#fff", color: tc.text }} />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl text-[13px] font-bold border"
            style={{ borderColor: tc.border, color: tc.muted }}>
            Cancel
          </button>
          <button type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white"
            style={{ background: tc.blue }}>
            <CheckCircle2 size={15} /> Save Outcome
          </button>
        </div>
      </form>
    </div>
  );
}
