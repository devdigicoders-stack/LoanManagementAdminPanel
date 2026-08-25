import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { mockAgentLeads } from "./agentData";
import { FileText, Send, AlertTriangle } from "lucide-react";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function CreateApplication() {
  const navigate = useNavigate();
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const selectedLead = mockAgentLeads.find(l => l.id === selectedLeadId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!selectedLeadId) {
      alert("Please select an eligible lead.");
      return;
    }
    if(!confirmed) {
      alert("Please confirm that the information has been reviewed.");
      return;
    }
    alert("Application submitted successfully and forwarded for processing.");
    navigate("/agent/applications");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Create Application</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Generate a formal loan application for an interested customer.</p>
        </div>
        <Link to="/agent/applications" className="text-[13px] font-bold underline" style={{ color: tc.blue }}>View All Applications</Link>
      </div>

      <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="max-w-md space-y-1.5">
          <label className="text-[13px] font-bold" style={{ color: tc.text }}>Select Qualified Lead <span className="text-red-500">*</span></label>
          <select
            value={selectedLeadId}
            onChange={(e) => setSelectedLeadId(e.target.value)}
            className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all bg-white"
            style={{ border: `1px solid ${tc.border}`, color: tc.text }}
          >
            <option value="">Select lead...</option>
            {mockAgentLeads.filter(l => l.status === "Interested" || l.status === "Documents Pending" || l.status === "Application Submitted").map(l => (
              <option key={l.id} value={l.id}>{l.id} - {l.customerName}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedLead && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Customer Summary */}
            <div className="rounded-2xl p-5 space-y-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
              <h2 className="text-[14px] font-extrabold" style={{ color: tc.text }}>Customer Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[11px] font-bold mb-0.5" style={{ color: tc.muted }}>Name</p><p className="text-[13px] font-semibold" style={{ color: tc.text }}>{selectedLead.customerName}</p></div>
                <div><p className="text-[11px] font-bold mb-0.5" style={{ color: tc.muted }}>Mobile</p><p className="text-[13px] font-semibold" style={{ color: tc.text }}>{selectedLead.mobile}</p></div>
                <div className="col-span-2"><p className="text-[11px] font-bold mb-0.5" style={{ color: tc.muted }}>Address</p><p className="text-[13px] font-semibold" style={{ color: tc.text }}>{selectedLead.address}, {selectedLead.city}</p></div>
                <div><p className="text-[11px] font-bold mb-0.5" style={{ color: tc.muted }}>Occupation</p><p className="text-[13px] font-semibold" style={{ color: tc.text }}>{selectedLead.occupation}</p></div>
                <div><p className="text-[11px] font-bold mb-0.5" style={{ color: tc.muted }}>Income</p><p className="text-[13px] font-semibold" style={{ color: tc.text }}>₹{Number(selectedLead.income).toLocaleString("en-IN")}</p></div>
              </div>
            </div>

            {/* Loan Requirement */}
            <div className="rounded-2xl p-5 space-y-4" style={{ background: tc.sky, border: `1px solid ${tc.skyMid}` }}>
              <h2 className="text-[14px] font-extrabold" style={{ color: tc.blue }}>Loan Requirement</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[11px] font-bold mb-0.5" style={{ color: tc.blue }}>Loan Type</p><p className="text-[13px] font-bold" style={{ color: tc.blue }}>{selectedLead.loanType}</p></div>
                <div><p className="text-[11px] font-bold mb-0.5" style={{ color: tc.blue }}>Required Amount</p><p className="text-[13px] font-bold" style={{ color: tc.blue }}>₹{Number(selectedLead.amount).toLocaleString("en-IN")}</p></div>
                <div><p className="text-[11px] font-bold mb-0.5" style={{ color: tc.blue }}>Purpose</p><p className="text-[13px] font-bold" style={{ color: tc.blue }}>{selectedLead.purpose}</p></div>
                <div><p className="text-[11px] font-bold mb-0.5" style={{ color: tc.blue }}>Tenure</p><p className="text-[13px] font-bold" style={{ color: tc.blue }}>{selectedLead.tenure}</p></div>
              </div>
            </div>
          </div>

          {/* Document Checklist */}
          <div className="rounded-2xl p-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <h2 className="text-[15px] font-extrabold flex items-center gap-2 mb-4" style={{ color: tc.text }}>
              <FileText size={16} style={{ color: "#D97706" }} /> Document Checklist
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Identity Proof", "Address Proof", "Income Proof", "Bank Statement", "Other Required Documents"].map(doc => (
                <label key={doc} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: tc.border }}>
                  <input type="checkbox" defaultChecked={Math.random() > 0.5} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-[13px] font-semibold" style={{ color: tc.text }}>{doc}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: tc.cream, border: `1px solid ${tc.border}` }}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                required
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="w-4 h-4 rounded mt-0.5 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-[13px] font-extrabold" style={{ color: tc.text }}>I confirm that the customer information has been reviewed and is ready for application processing.</span>
                <p className="text-[11px] mt-1 font-semibold flex items-center gap-1" style={{ color: tc.muted }}>
                  <AlertTriangle size={12} /> Important: Agent Operators do not approve loans. This action only forwards the application for processing.
                </p>
              </div>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-8 py-3 flex items-center justify-center gap-2 rounded-xl text-[14px] font-bold text-white transition-all hover:opacity-90 shadow-md"
              style={{ background: tc.blue }}
            >
              <Send size={16} /> Submit Application
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
