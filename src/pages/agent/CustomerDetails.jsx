import { useState } from "react";
import { User, Briefcase, IndianRupee, Save } from "lucide-react";
import { mockAgentLeads } from "./agentData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function CustomerDetails() {
  const [selectedLeadId, setSelectedLeadId] = useState("");
  
  // Minimal form state to satisfy requirement
  const [form, setForm] = useState({
    fullName: "", mobile: "", altMobile: "", email: "", dob: "",
    address: "", city: "", state: "", pincode: "",
    occupation: "", company: "", income: "", empType: "",
    loanType: "", amount: "", purpose: "", tenure: "", existingLoan: ""
  });

  const handleLeadSelect = (e) => {
    const id = e.target.value;
    setSelectedLeadId(id);
    const lead = mockAgentLeads.find(l => l.id === id);
    if(lead) {
      setForm({
        ...form,
        fullName: lead.customerName, mobile: lead.mobile, altMobile: lead.altMobile, email: lead.email,
        address: lead.address, city: lead.city, state: lead.state, pincode: lead.pincode,
        occupation: lead.occupation, company: lead.company, income: lead.income,
        loanType: lead.loanType, amount: lead.amount, purpose: lead.purpose, tenure: lead.tenure, existingLoan: lead.existingLoan
      });
    } else {
      // clear form
      setForm(Object.keys(form).reduce((acc, key) => ({...acc, [key]: ""}), {}));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!selectedLeadId) {
      alert("Please select a lead first.");
      return;
    }
    alert("Customer information updated successfully.");
  };

  const InputField = ({ label, type = "text", field }) => (
    <div className="space-y-1.5">
      <label className="text-[12px] font-bold" style={{ color: tc.text }}>{label}</label>
      <input
        type={type}
        value={form[field]}
        onChange={(e) => setForm({...form, [field]: e.target.value})}
        className="w-full h-10 px-3 rounded-lg text-[13px] outline-none"
        style={{ border: `1px solid ${tc.border}`, color: tc.text, background: tc.bg }}
      />
    </div>
  );

  return (
    <div className="space-y-6 w-full max-w-5xl">
      
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Customer Details</h1>
        <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>View and update assigned customer information.</p>
      </div>

      <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="max-w-sm space-y-1.5">
          <label className="text-[13px] font-bold" style={{ color: tc.text }}>Select Lead</label>
          <select
            value={selectedLeadId}
            onChange={handleLeadSelect}
            className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all bg-white"
            style={{ border: `1px solid ${tc.border}`, color: tc.text }}
          >
            <option value="">Select assigned lead...</option>
            {mockAgentLeads.map(l => (
              <option key={l.id} value={l.id}>{l.id} - {l.customerName}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedLeadId && (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="rounded-2xl p-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <h2 className="text-[15px] font-extrabold flex items-center gap-2 mb-5" style={{ color: tc.text }}>
              <User size={16} style={{ color: tc.blue }} /> Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <InputField label="Full Name" field="fullName" />
              <InputField label="Mobile" field="mobile" />
              <InputField label="Alternate Mobile" field="altMobile" />
              <InputField label="Email" type="email" field="email" />
              <InputField label="Date of Birth" type="date" field="dob" />
              <div className="sm:col-span-2 md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="lg:col-span-2">
                  <InputField label="Address (Current & Permanent)" field="address" />
                </div>
                <InputField label="City" field="city" />
                <InputField label="State" field="state" />
                <InputField label="Pincode" field="pincode" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <h2 className="text-[15px] font-extrabold flex items-center gap-2 mb-5" style={{ color: tc.text }}>
              <Briefcase size={16} style={{ color: "#D97706" }} /> Professional Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              <InputField label="Occupation" field="occupation" />
              <InputField label="Company / Business Name" field="company" />
              <InputField label="Monthly Income" type="number" field="income" />
              <InputField label="Employment Type" field="empType" />
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <h2 className="text-[15px] font-extrabold flex items-center gap-2 mb-5" style={{ color: tc.text }}>
              <IndianRupee size={16} style={{ color: "#15803D" }} /> Loan Requirement
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <InputField label="Loan Type" field="loanType" />
              <InputField label="Required Amount" type="number" field="amount" />
              <InputField label="Purpose" field="purpose" />
              <InputField label="Preferred Tenure" field="tenure" />
              <InputField label="Existing Loan" field="existingLoan" />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 flex items-center gap-2 rounded-xl text-[14px] font-bold text-white transition-all hover:opacity-90"
              style={{ background: tc.blue }}
            >
              <Save size={16} /> Update Customer Information
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
