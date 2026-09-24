import { useState, useEffect } from "react";
import { MessageSquare, Plus, ChevronDown, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const tc = {
  card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  cream: "#FFF8E7", text: "#344054", muted: "#667085", border: "#D9EAF2", blue: "#1e7ba8",
};

export default function RemarksNotes() {
  const [form, setForm] = useState({ leadId: "", type: "Customer Interaction", remark: "" });
  const [leads, setLeads] = useState([]);
  const [remarksList, setRemarksList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchLeadsAndRemarks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/my-leads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const allLeads = data.leads || [];
        setLeads(allLeads);

        // Gather all follow-ups / remarks
        const remarksArr = [];
        allLeads.forEach(l => {
          if (l.telecallerNotes) {
            remarksArr.push({
              leadId: l.leadId || l._id,
              customer: l.name,
              remark: l.telecallerNotes,
              type: "Verification",
              date: l.telecallerConfirmedAt ? new Date(l.telecallerConfirmedAt).toLocaleDateString('en-IN') : 'Recent',
              time: l.telecallerConfirmedBy || 'Telecaller'
            });
          }
          if (Array.isArray(l.followUps)) {
            l.followUps.forEach(fu => {
              remarksArr.push({
                leadId: l.leadId || l._id,
                customer: l.name,
                remark: fu.remarks || fu.notes || 'Note added',
                type: fu.type || fu.status || "Call",
                date: fu.scheduledAt ? new Date(fu.scheduledAt).toLocaleDateString('en-IN') : 'Recent',
                time: fu.addedBy || 'Telecaller'
              });
            });
          }
        });
        setRemarksList(remarksArr);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadsAndRemarks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.leadId || !form.remark) {
      toast.error("Please select lead and enter remark.");
      return;
    }
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads/${form.leadId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'Contacted',
          remarks: form.remark,
          reason: form.remark
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Remark added & synced with RM dashboard!");
        setForm({ leadId: "", type: "Customer Interaction", remark: "" });
        fetchLeadsAndRemarks();
      } else {
        toast.error(data.message || "Failed to add remark");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setSubmitting(false);
    }
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
                    {leads.map(l => <option key={l._id} value={l._id}>{l.leadId || l._id} - {l.name} ({l.mobile})</option>)}
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
                    <option value="Customer Interaction">Customer Interaction</option>
                    <option value="Call Verification">Call Verification</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Requirement">Requirement</option>
                    <option value="Documents Pending">Documents Pending</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: tc.muted }} />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Customer Response / Remark <span style={{ color: "#DC2626" }}>*</span></label>
                <textarea rows={4} placeholder="Enter what customer said, verification details..."
                  value={form.remark} onChange={e => setForm({ ...form, remark: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border text-[13px] font-medium outline-none resize-none"
                  style={{ borderColor: tc.border, background: "#fff", color: tc.text }} />
              </div>

              <button type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl text-[13px] font-bold text-white transition-colors hover:opacity-90 disabled:opacity-50"
                style={{ background: tc.blue }}>
                {submitting ? <RefreshCw size={15} className="animate-spin" /> : <Plus size={15} />}
                Add Remark & Notify RM
              </button>
            </div>
          </form>
        </div>

        {/* Remark History */}
        <div className="lg:col-span-2 rounded-2xl" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <div className="p-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${tc.border}` }}>
            <h3 className="text-[15px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}>
              <MessageSquare size={16} style={{ color: tc.blue }} /> Telecaller Interaction & Remarks Timeline
            </h3>
            <button onClick={fetchLeadsAndRemarks} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-600 transition">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ background: tc.sky }}>
                  <th className="text-left px-5 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>Lead & Customer</th>
                  <th className="text-left px-5 py-3 font-bold" style={{ color: tc.blue }}>Remark</th>
                  <th className="text-left px-5 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>Type</th>
                  <th className="text-left px-5 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>Date & Telecaller</th>
                </tr>
              </thead>
              <tbody>
                {remarksList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center">
                      <p className="font-bold text-[14px]" style={{ color: tc.muted }}>No remarks available</p>
                      <p className="text-[12px]" style={{ color: tc.blue }}>Remarks added by Telecallers will appear here.</p>
                    </td>
                  </tr>
                ) : remarksList.map((r, i) => (
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
                      <p className="text-[11px] font-bold text-slate-500">{r.time}</p>
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
