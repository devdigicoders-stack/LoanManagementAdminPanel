import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const tc = {
  card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  cream: "#FFF8E7", text: "#344054", muted: "#667085", border: "#D9EAF2", blue: "#1e7ba8",
};

const states = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir"];

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

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-4 pb-3" style={{ borderBottom: `1px solid ${tc.border}` }}>
      <h3 className="text-[14px] font-extrabold" style={{ color: tc.blue }}>{title}</h3>
      {subtitle && <p className="text-[12px]" style={{ color: tc.muted }}>{subtitle}</p>}
    </div>
  );
}

export default function AddNewLead() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", mobile: "", altMobile: "", email: "", address: "",
    city: "", state: "", pincode: "", occupation: "", company: "", income: "",
    loanType: "", amount: "", purpose: "", tenure: "", existingLoan: "No",
    priority: "Normal", remarks: ""
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e, scheduleFollowup = false) => {
    e.preventDefault();
    if (!form.fullName || !form.mobile || !form.loanType || !form.amount) {
      toast.error("Please complete all required fields.");
      return;
    }
    toast.success("Lead created successfully.");
    if (scheduleFollowup) navigate("/telecaller/followups/add");
    else navigate("/telecaller/leads");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/telecaller/leads")}
          className="p-1.5 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft size={18} style={{ color: tc.text }} />
        </button>
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Add New Lead</h1>
          <p className="text-[13px]" style={{ color: tc.muted }}>Capture customer information and initial loan requirements.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Customer Details */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <SectionHeader title="Customer Details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <Field label="Full Name" required><Input placeholder="Enter customer name" value={form.fullName} onChange={e => set("fullName", e.target.value)} /></Field>
            <Field label="Mobile Number" required><Input placeholder="Enter mobile number" value={form.mobile} onChange={e => set("mobile", e.target.value)} /></Field>
            <Field label="Alternate Mobile"><Input placeholder="Enter alternate mobile number" value={form.altMobile} onChange={e => set("altMobile", e.target.value)} /></Field>
            <Field label="Email"><Input type="email" placeholder="Enter email address" value={form.email} onChange={e => set("email", e.target.value)} /></Field>
            <Field label="Address" ><Input placeholder="Enter complete address" value={form.address} onChange={e => set("address", e.target.value)} /></Field>
            <Field label="City"><Input placeholder="Enter city" value={form.city} onChange={e => set("city", e.target.value)} /></Field>
            <Field label="State"><Select options={states} value={form.state} onChange={e => set("state", e.target.value)} /></Field>
            <Field label="Pincode"><Input placeholder="Enter pincode" value={form.pincode} onChange={e => set("pincode", e.target.value)} /></Field>
          </div>
        </div>

        {/* Professional Details */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: tc.cream, border: `1px solid ${tc.border}` }}>
          <SectionHeader title="Professional Details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <Field label="Occupation" required>
              <Select options={["Salaried", "Self Employed", "Business", "Professional", "Other"]} value={form.occupation} onChange={e => set("occupation", e.target.value)} />
            </Field>
            <Field label="Company / Business Name"><Input placeholder="Enter company/business name" value={form.company} onChange={e => set("company", e.target.value)} /></Field>
            <Field label="Monthly Income" required><Input placeholder="Enter monthly income" value={form.income} onChange={e => set("income", e.target.value)} /></Field>
          </div>
        </div>

        {/* Loan Requirement */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <SectionHeader title="Loan Requirement" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <Field label="Loan Type" required>
              <Select options={["Home Loan", "Loan Against Property", "Other"]} value={form.loanType} onChange={e => set("loanType", e.target.value)} />
            </Field>
            <Field label="Required Loan Amount" required><Input placeholder="Enter required amount" value={form.amount} onChange={e => set("amount", e.target.value)} /></Field>
            <Field label="Loan Purpose">
              <Select options={["Purchase", "Construction", "Renovation", "Business Expansion", "Other"]} value={form.purpose} onChange={e => set("purpose", e.target.value)} />
            </Field>
            <Field label="Preferred Tenure">
              <Select options={["5 years", "10 years", "15 years", "20 years", "25 years", "30 years"]} value={form.tenure} onChange={e => set("tenure", e.target.value)} />
            </Field>
            <Field label="Existing Loan">
              <Select options={["No", "Yes"]} value={form.existingLoan} onChange={e => set("existingLoan", e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Lead Info */}
        <div className="rounded-2xl p-5 mb-5" style={{ background: tc.sky, border: `1px solid ${tc.skyMid}` }}>
          <SectionHeader title="Lead Information" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <Field label="Lead Source">
              <Input value="Telecaller" disabled style={{ background: "#E0F7FA", color: tc.muted, cursor: "not-allowed" }} />
            </Field>
            <Field label="Priority">
              <Select options={["Normal", "Medium", "High", "Urgent"]} value={form.priority} onChange={e => set("priority", e.target.value)} />
            </Field>
            <div className="xl:col-span-3">
              <Field label="Initial Remarks">
                <textarea rows={3} placeholder="Enter customer requirement..."
                  value={form.remarks} onChange={e => set("remarks", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-[13px] font-medium outline-none resize-none"
                  style={{ borderColor: tc.border, background: "#FFFFFF", color: tc.text }} />
              </Field>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-end">
          <button type="button" onClick={() => navigate("/telecaller/leads")}
            className="px-5 py-2.5 rounded-xl text-[13px] font-bold border transition-colors"
            style={{ borderColor: tc.border, color: tc.muted, background: "#fff" }}>
            Cancel
          </button>
          <button type="button" onClick={e => handleSubmit(e, true)}
            className="px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors"
            style={{ background: tc.cream, color: "#D97706", border: "1px solid #FDE68A" }}>
            Save & Schedule Follow-up
          </button>
          <button type="submit"
            className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-colors"
            style={{ background: tc.blue }}>
            Save Lead
          </button>
        </div>
      </form>
    </div>
  );
}
