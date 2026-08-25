import { useState } from "react";
import { MessageSquare, Plus, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { mockRemarks, mockLeads } from "./telecallerData";

const tc = {
  card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  cream: "#FFF8E7", text: "#344054", muted: "#667085", border: "#D9EAF2", blue: "#1e7ba8",
};

export default function RemarksNotes() {
  const [form, setForm] = useState({ leadId: "", type: "", remark: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.leadId || !form.type || !form.remark) {
      toast.error("Please fill all fields.");
      return;
    }
    toast.success("Remark added successfully.");
    setForm({ leadId: "", type: "", remark: "" });
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Remarks & Notes</h1>
        <p className="text-[13px]" style={{ color: tc.muted }}>Record important customer interactions and sales information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Add Remark Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="rounded-2xl p-5" style={{ background: tc.sky, border: `1px solid ${tc.skyMid}` }}>
            <h3 className="text-[15px] font-extrabold mb-4 pb-3 flex items-center gap-2" style={{ color: tc.blue, borderBottom: `1px solid ${tc.border}` }}>
              <Plus size={16} /> Add Remark
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Lead <span style={{ color: "#DC2626" }}>*</span></label>
                <div className="relative">
                  <select value={form.leadId} onChange={e => setForm({ ...form, leadId: e.target.value })}
                    className="w-full h-10 px-4 rounded-xl border text-[13px] font-medium outline-none appearance-none cursor-pointer"
                    style={{ borderColor: tc.border, background: "#fff", color: tc.text }}>
                    <option value="">Select lead</option>
                    {mockLeads.map(l => <option key={l.id} value={l.id}>{l.id} - {l.customerName}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: tc.muted }} />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Remark Type <span style={{ color: "#DC2626" }}>*</span></label>
                <div className="relative">
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full h-10 px-4 rounded-xl border text-[13px] font-medium outline-none appearance-none cursor-pointer"
                    style={{ borderColor: tc.border, background: "#fff", color: tc.text }}>
                    <option value="">Select type</option>
                    {["Call", "Customer Interaction", "Follow-up", "Requirement", "Document", "Internal"].map(o => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: tc.muted }} />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Remark <span style={{ color: "#DC2626" }}>*</span></label>
                <textarea rows={4} placeholder="Enter your remark..."
                  value={form.remark} onChange={e => setForm({ ...form, remark: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border text-[13px] font-medium outline-none resize-none"
                  style={{ borderColor: tc.border, background: "#fff", color: tc.text }} />
              </div>

              <button type="submit"
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl text-[13px] font-bold text-white transition-colors hover:opacity-90"
                style={{ background: tc.blue }}>
                Add Remark
              </button>
            </div>
          </form>
        </div>

        {/* Remark History */}
        <div className="lg:col-span-2 rounded-2xl" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <div className="p-5" style={{ borderBottom: `1px solid ${tc.border}` }}>
            <h3 className="text-[15px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}>
              <MessageSquare size={16} style={{ color: tc.primary }} /> Remark History
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ background: tc.sky }}>
                  <th className="text-left px-5 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>Lead & Customer</th>
                  <th className="text-left px-5 py-3 font-bold" style={{ color: tc.blue }}>Remark</th>
                  <th className="text-left px-5 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>Type</th>
                  <th className="text-left px-5 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {mockRemarks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center">
                      <p className="font-bold text-[14px]" style={{ color: tc.muted }}>No remarks available</p>
                      <p className="text-[12px]" style={{ color: tc.primary }}>No remarks have been added yet.</p>
                    </td>
                  </tr>
                ) : mockRemarks.map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-[#FAFCFD] transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-bold" style={{ color: tc.blue }}>{r.leadId}</p>
                      <p className="font-semibold text-[11px]" style={{ color: tc.text }}>{r.customer}</p>
                    </td>
                    <td className="px-5 py-4 font-medium leading-relaxed" style={{ color: tc.text }}>{r.remark}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ background: tc.cream, color: "#D97706" }}>{r.type}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap" style={{ color: tc.muted }}>
                      <p>{r.date}</p>
                      <p className="text-[11px]">{r.time}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
