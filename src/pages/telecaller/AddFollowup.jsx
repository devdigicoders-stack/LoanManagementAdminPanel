import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CalendarCheck, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { mockLeads } from "./telecallerData";

const tc = {
  card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  cream: "#FFF8E7", text: "#344054", muted: "#667085", border: "#D9EAF2", blue: "#1e7ba8",
};

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>
        {label}{required && <span style={{ color: "#DC2626" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ ...props }) {
  return (
    <input {...props} className="w-full h-10 px-4 rounded-xl border text-[13px] font-medium outline-none transition-all"
      style={{ borderColor: tc.border, background: tc.sky, color: tc.text }} />
  );
}

function Select({ options, ...props }) {
  return (
    <div className="relative">
      <select {...props} className="w-full h-10 px-4 rounded-xl border text-[13px] font-medium outline-none appearance-none cursor-pointer transition-all"
        style={{ borderColor: tc.border, background: tc.sky, color: tc.text }}>
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: tc.muted }} />
    </div>
  );
}

export default function AddFollowup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialLeadId = searchParams.get("lead") || "";

  const [form, setForm] = useState({
    leadId: initialLeadId,
    customer: "",
    date: "",
    time: "",
    type: "",
    purpose: "",
    remarks: ""
  });

  useEffect(() => {
    if (form.leadId) {
      const l = mockLeads.find(x => x.id === form.leadId);
      if (l) setForm(f => ({ ...f, customer: l.customerName }));
      else setForm(f => ({ ...f, customer: "Unknown Customer" }));
    } else {
      setForm(f => ({ ...f, customer: "" }));
    }
  }, [form.leadId]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.leadId || !form.date || !form.time || !form.type) {
      toast.error("Please select a lead, date, time and type.");
      return;
    }
    toast.success("Follow-up scheduled successfully.");
    navigate("/telecaller/followups");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Schedule Follow-up</h1>
        <p className="text-[13px]" style={{ color: tc.muted }}>Schedule a new follow-up for an assigned lead.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl p-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <Field label="Lead" required>
            <Select options={mockLeads.map(l => l.id)} value={form.leadId} onChange={e => set("leadId", e.target.value)} />
          </Field>
          <Field label="Customer">
            <Input value={form.customer} disabled style={{ background: "#E0F7FA", color: tc.muted, cursor: "not-allowed" }} />
          </Field>
          
          <Field label="Follow-up Date" required><Input type="date" value={form.date} onChange={e => set("date", e.target.value)} /></Field>
          <Field label="Follow-up Time" required><Input type="time" value={form.time} onChange={e => set("time", e.target.value)} /></Field>
          
          <Field label="Follow-up Type" required>
            <Select options={["Call", "Customer Callback", "Document Follow-up", "Other"]} value={form.type} onChange={e => set("type", e.target.value)} />
          </Field>
          <Field label="Purpose">
            <Input placeholder="Enter follow-up purpose" value={form.purpose} onChange={e => set("purpose", e.target.value)} />
          </Field>
          
          <div className="sm:col-span-2">
            <Field label="Remarks">
              <textarea rows={3} placeholder="Enter follow-up notes..."
                value={form.remarks} onChange={e => set("remarks", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-[13px] font-medium outline-none resize-none"
                style={{ borderColor: tc.border, background: tc.sky, color: tc.text }} />
            </Field>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4" style={{ borderTop: `1px solid ${tc.border}` }}>
          <button type="button" onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl text-[13px] font-bold border transition-colors"
            style={{ borderColor: tc.border, color: tc.muted }}>
            Cancel
          </button>
          <button type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-colors"
            style={{ background: tc.blue }}>
            <CalendarCheck size={15} /> Schedule Follow-up
          </button>
        </div>
      </form>
    </div>
  );
}
