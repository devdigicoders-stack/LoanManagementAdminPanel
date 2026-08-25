import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Phone, PhoneCall, PhoneOff, ChevronDown, Save } from "lucide-react";
import toast from "react-hot-toast";
import { mockLeads } from "./telecallerData";

const tc = {
  card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  cream: "#FFF8E7", text: "#344054", muted: "#667085", border: "#D9EAF2", blue: "#1e7ba8",
};

const callOutcomes = ["Connected","Not Connected","Busy","Switched Off","Invalid Number","Call Back Requested"];
const customerResponses = ["Interested","Not Interested","Need More Information","Call Back Later","Documents Ready","Documents Pending"];

function SelectField({ label, options, value, onChange }) {
  return (
    <div>
      <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>{label}</label>
      <div className="relative">
        <select value={value} onChange={onChange}
          className="w-full h-10 px-4 pr-9 rounded-xl border text-[13px] font-medium outline-none appearance-none cursor-pointer"
          style={{ borderColor: tc.border, background: tc.sky, color: tc.text }}>
          <option value="">Select...</option>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: tc.muted }} />
      </div>
    </div>
  );
}

export default function CustomerCall() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = mockLeads.find(l => l.id === id) || mockLeads[0];

  const [calling, setCalling] = useState(false);
  const [callDone, setCallDone] = useState(false);
  const [outcome, setOutcome] = useState("");
  const [response, setResponse] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleCall = () => {
    setCalling(true);
    setTimeout(() => { setCalling(false); setCallDone(true); }, 1500);
  };

  const handleSave = () => {
    if (!outcome || !response) { toast.error("Please select call outcome and customer response."); return; }
    toast.success("Call details saved successfully.");
    navigate(`/telecaller/leads/${lead.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Customer Call</h1>
        <p className="text-[13px]" style={{ color: tc.muted }}>Record call details and customer response.</p>
      </div>

      {/* Customer Card */}
      <div className="rounded-2xl p-5" style={{ background: tc.sky, border: `1px solid ${tc.skyMid}` }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-[20px]"
              style={{ background: "#BFE7F7", color: tc.blue }}>
              {lead.customerName.charAt(0)}
            </div>
            <div>
              <p className="text-[17px] font-extrabold" style={{ color: tc.text }}>{lead.customerName}</p>
              <p className="text-[13px] font-semibold" style={{ color: tc.muted }}>{lead.mobile}</p>
              <p className="text-[12px] mt-0.5" style={{ color: tc.blue }}>{lead.id} · {lead.loanType}</p>
              <p className="text-[12px] font-bold" style={{ color: "#15803D" }}>
                ₹{Number(lead.amount).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Call Buttons */}
          <div className="flex flex-col gap-2">
            <button onClick={handleCall} disabled={calling}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all"
              style={{ background: callDone ? "#DCFCE7" : "#15803D", color: callDone ? "#15803D" : "#fff", border: callDone ? "1px solid #86EFAC" : "none" }}>
              {calling ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Calling...</>
              ) : callDone ? (
                <><PhoneCall size={15} /> Call Again</>
              ) : (
                <><Phone size={15} /> Call Customer</>
              )}
            </button>
            {callDone && (
              <span className="text-center text-[11px] font-bold px-2 py-1 rounded-lg" style={{ background: "#DCFCE7", color: "#15803D" }}>
                ✓ Call Initiated
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Call Result */}
      <div className="rounded-2xl p-5 space-y-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <h3 className="text-[15px] font-extrabold pb-3" style={{ color: tc.blue, borderBottom: `1px solid ${tc.border}` }}>
          Call Outcome
        </h3>

        <SelectField label="Call Outcome" options={callOutcomes} value={outcome} onChange={e => setOutcome(e.target.value)} />
        <SelectField label="Customer Response" options={customerResponses} value={response} onChange={e => setResponse(e.target.value)} />

        <div>
          <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Remarks</label>
          <textarea rows={4} value={remarks} onChange={e => setRemarks(e.target.value)}
            placeholder="Enter details discussed with the customer..."
            className="w-full px-4 py-3 rounded-xl border text-[13px] font-medium outline-none resize-none"
            style={{ borderColor: tc.border, background: tc.sky, color: tc.text }} />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl text-[13px] font-bold border"
            style={{ borderColor: tc.border, color: tc.muted }}>
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white"
            style={{ background: tc.blue }}>
            <Save size={15} /> Save Call Details
          </button>
        </div>
      </div>
    </div>
  );
}
