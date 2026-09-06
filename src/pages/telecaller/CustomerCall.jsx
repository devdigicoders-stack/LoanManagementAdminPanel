import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Phone, PhoneCall, PhoneOff, ChevronDown, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

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
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  const [calling, setCalling] = useState(false);
  const [callDone, setCallDone] = useState(false);
  const [outcome, setOutcome] = useState("Connected");
  const [response, setResponse] = useState("Interested");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLead(data);
      } else {
        // Fallback fetch first available lead
        const allRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (allRes.ok) {
          const allData = await allRes.json();
          if (allData.length > 0) setLead(allData[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    setCalling(true);
    setTimeout(() => { setCalling(false); setCallDone(true); }, 1200);
  };

  const handleSave = async () => {
    if (!outcome || !response) { 
      return toast.error("Please select call outcome and customer response."); 
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const leadId = lead?._id || id;
      
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads/${leadId}/followup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: "Call",
          scheduledAt: new Date().toISOString().split('T')[0],
          status: "Completed",
          notes: `Call Outcome: ${outcome} | Response: ${response}. ${remarks}`,
          addedBy: "Telecaller"
        })
      });

      if (res.ok) {
        toast.success("Call log & followup saved to MongoDB!");
        navigate("/telecaller/followups");
      } else {
        toast.error("Failed to save call log");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Loader2 size={24} className="animate-spin mx-auto mb-2 text-[#1e7ba8]" />
        Loading lead details...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Customer Call</h1>
        <p className="text-[13px]" style={{ color: tc.muted }}>Record live call outcome and customer response to MongoDB.</p>
      </div>

      {lead && (
        <div className="rounded-2xl p-5 flex items-center justify-between"
          style={{ background: tc.card, border: `1px solid ${tc.border}`, boxShadow: "0 1px 6px rgba(142,211,244,0.08)" }}>
          <div>
            <p className="text-[11px] font-mono font-bold" style={{ color: tc.blue }}>{lead.leadId || 'LEAD'}</p>
            <p className="text-[17px] font-extrabold mt-0.5" style={{ color: tc.text }}>{lead.name}</p>
            <p className="text-[13px] font-bold mt-0.5" style={{ color: tc.muted }}>
              {lead.loanPurpose} • {lead.expectedAmount || '₹10L'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[15px] font-mono font-extrabold" style={{ color: tc.text }}>{lead.mobile}</p>
            <a
              href={`tel:${lead.mobile}`}
              onClick={handleCall}
              className={`mt-2 flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold text-white transition-all shadow-sm ${
                callDone ? "bg-slate-600" : "bg-[#15803D] hover:opacity-90"
              }`}
            >
              {calling ? <PhoneOff size={14} className="animate-pulse" /> : <PhoneCall size={14} />}
              {calling ? "Calling..." : callDone ? "Call Again" : "Dial Customer"}
            </a>
          </div>
        </div>
      )}

      <div className="rounded-2xl p-6 space-y-4"
        style={{ background: tc.card, border: `1px solid ${tc.border}`, boxShadow: "0 1px 6px rgba(142,211,244,0.08)" }}>
        <h2 className="text-[14px] font-extrabold" style={{ color: tc.text }}>Call Outcome & Notes</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField label="Call Outcome *" options={callOutcomes} value={outcome} onChange={e => setOutcome(e.target.value)} />
          <SelectField label="Customer Response *" options={customerResponses} value={response} onChange={e => setResponse(e.target.value)} />
        </div>

        <div>
          <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Discussion Notes / Remarks</label>
          <textarea rows={3} value={remarks} onChange={e => setRemarks(e.target.value)}
            placeholder="e.g. Customer requested call back on Saturday morning after 11am to confirm document collection."
            className="w-full p-3 rounded-xl border text-[13px] font-medium outline-none"
            style={{ borderColor: tc.border, background: tc.sky, color: tc.text }} />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl text-[13px] font-bold transition-all hover:opacity-80"
            style={{ background: tc.sky, color: tc.muted }}>
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90 shadow-sm disabled:opacity-50"
            style={{ background: tc.blue }}
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Call Follow-up
          </button>
        </div>
      </div>
    </div>
  );
}
