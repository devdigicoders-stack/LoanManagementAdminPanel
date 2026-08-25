import { useState } from "react";
import { MessageSquare, Clock } from "lucide-react";
import { mockAgentLeads } from "./agentData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function RemarksNotes() {
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [form, setForm] = useState({ type: "", priority: "Normal", remark: "" });

  const selectedLead = mockAgentLeads.find(l => l.id === selectedLeadId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!selectedLeadId || !form.type || !form.remark) {
      alert("Please complete all required fields.");
      return;
    }
    alert("Remark added successfully.");
    setForm({ type: "", priority: "Normal", remark: "" });
  };

  const remarkTypes = [
    "Customer Interaction", "Visit", "Meeting", "Follow-up", "Requirement", "Document", "Internal"
  ];

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Remarks & Notes</h1>
        <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Record customer interactions, visit details and important sales information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <h2 className="text-[15px] font-extrabold flex items-center gap-2 mb-5" style={{ color: tc.text }}>
              <MessageSquare size={16} style={{ color: tc.blue }} /> Add Remark
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold" style={{ color: tc.text }}>Lead <span className="text-red-500">*</span></label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl text-[12px] outline-none bg-white"
                  style={{ border: `1px solid ${tc.border}`, color: tc.text }}
                >
                  <option value="">Select assigned lead</option>
                  {mockAgentLeads.map(l => (
                    <option key={l.id} value={l.id}>{l.id} - {l.customerName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold" style={{ color: tc.text }}>Remark Type <span className="text-red-500">*</span></label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl text-[12px] outline-none bg-white"
                  style={{ border: `1px solid ${tc.border}`, color: tc.text }}
                >
                  <option value="">Select type</option>
                  {remarkTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold" style={{ color: tc.text }}>Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl text-[12px] outline-none bg-white"
                  style={{ border: `1px solid ${tc.border}`, color: tc.text }}
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold" style={{ color: tc.text }}>Remark <span className="text-red-500">*</span></label>
                <textarea
                  placeholder="Enter your remark..."
                  rows={4}
                  value={form.remark}
                  onChange={(e) => setForm({ ...form, remark: e.target.value })}
                  className="w-full p-3 rounded-xl text-[12px] outline-none resize-none"
                  style={{ border: `1px solid ${tc.border}`, color: tc.text }}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90 mt-2"
                style={{ background: tc.blue }}
              >
                Add Remark
              </button>
            </form>
          </div>
        </div>

        {/* History Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl overflow-hidden w-full h-full min-h-[400px]" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <div className="p-4" style={{ borderBottom: `1px solid ${tc.border}` }}>
              <h2 className="text-[15px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}>
                <Clock size={16} style={{ color: tc.primary }} /> Remark History {selectedLead ? `for ${selectedLead.customerName}` : ""}
              </h2>
            </div>
            
            {selectedLeadId ? (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr style={{ background: tc.sky }}>
                      {["Remark", "Type", "Priority", "Date", "Time"].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: `1px solid ${tc.border}` }}>
                      <td className="px-4 py-3 min-w-[200px]" style={{ color: tc.text }}>Customer agreed for a property visit on Monday.</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>Follow-up</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">Normal</span></td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>24 Aug 2026</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>14:30 PM</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${tc.border}` }}>
                      <td className="px-4 py-3 min-w-[200px]" style={{ color: tc.text }}>Needs higher loan amount than eligible. Will discuss with manager.</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>Requirement</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">Important</span></td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>23 Aug 2026</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>11:00 AM</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-[14px] font-bold" style={{ color: tc.text }}>No lead selected</p>
                <p className="text-[12px] mt-1" style={{ color: tc.muted }}>Select a lead to view remark history.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
