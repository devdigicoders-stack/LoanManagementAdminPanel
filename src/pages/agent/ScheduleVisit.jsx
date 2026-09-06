import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function ScheduleVisit() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [form, setForm] = useState({ 
    date: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0], 
    time: "11:00 AM", 
    location: "", 
    purpose: "Address Verification", 
    notes: "" 
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
        if (data.length > 0) {
          setSelectedLeadId(data[0]._id);
          setForm(prev => ({ ...prev, location: data[0].address || "Lucknow" }));
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const selectedLead = leads.find(l => l._id === selectedLeadId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLead) {
      return toast.error("Please select a customer lead");
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/visits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          leadId: selectedLead.leadId || selectedLead._id,
          customerName: selectedLead.name,
          mobile: selectedLead.mobile,
          address: form.location || selectedLead.address || "Lucknow",
          purpose: form.purpose,
          scheduledDate: form.date,
          scheduledTime: form.time,
          remarks: form.notes
        })
      });

      if (res.ok) {
        toast.success("Field visit scheduled & saved to MongoDB!");
        navigate("/agent/visits");
      } else {
        toast.error("Failed to schedule visit");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error scheduling visit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Schedule Customer Visit</h1>
        <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>
          Plan a new physical field verification or document pickup for a live MongoDB lead.
        </p>
      </div>

      <div className="rounded-2xl p-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold" style={{ color: tc.text }}>Select Live Lead <span className="text-red-500">*</span></label>
            <select
              value={selectedLeadId}
              onChange={(e) => {
                setSelectedLeadId(e.target.value);
                const l = leads.find(x => x._id === e.target.value);
                if (l && l.address) setForm(prev => ({ ...prev, location: l.address }));
              }}
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all bg-white"
              style={{ border: `1px solid ${tc.border}`, color: tc.text }}
            >
              {loading ? (
                <option>Loading leads from database...</option>
              ) : (
                leads.map(l => (
                  <option key={l._id} value={l._id}>
                    {l.leadId || l.name} - {l.name} ({l.loanPurpose} • {l.expectedAmount || '₹10L'})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold" style={{ color: tc.text }}>Customer Name</label>
              <input
                type="text"
                readOnly
                value={selectedLead ? selectedLead.name : ""}
                className="w-full h-11 px-4 rounded-xl text-[13px] outline-none bg-gray-50"
                style={{ border: `1px solid ${tc.border}`, color: tc.text }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold" style={{ color: tc.text }}>Mobile</label>
              <input
                type="text"
                readOnly
                value={selectedLead ? selectedLead.mobile : ""}
                className="w-full h-11 px-4 rounded-xl text-[13px] outline-none bg-gray-50 font-mono"
                style={{ border: `1px solid ${tc.border}`, color: tc.text }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold" style={{ color: tc.text }}>Visit Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all bg-white"
                style={{ border: `1px solid ${tc.border}`, color: tc.text }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold" style={{ color: tc.text }}>Visit Time <span className="text-red-500">*</span></label>
              <select
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all bg-white"
                style={{ border: `1px solid ${tc.border}`, color: tc.text }}
              >
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>12:00 PM</option>
                <option>02:00 PM</option>
                <option>03:30 PM</option>
                <option>05:00 PM</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold" style={{ color: tc.text }}>Verification Purpose <span className="text-red-500">*</span></label>
            <select
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all bg-white"
              style={{ border: `1px solid ${tc.border}`, color: tc.text }}
            >
              <option>Address Verification</option>
              <option>Document Collection</option>
              <option>Business Verification</option>
              <option>Follow-up</option>
              <option>EMI Recovery</option>
              <option>Asset Inspection</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold" style={{ color: tc.text }}>Location / Address <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. 12, Sector 5, Gomti Nagar, Lucknow"
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all bg-white"
              style={{ border: `1px solid ${tc.border}`, color: tc.text }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold" style={{ color: tc.text }}>Special Instructions / Remarks</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="e.g. Meet customer at shop, verify physical stock and electric meter."
              className="w-full p-4 rounded-xl text-[13px] outline-none transition-all bg-white"
              style={{ border: `1px solid ${tc.border}`, color: tc.text }}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: tc.border }}>
            <button
              type="button"
              onClick={() => navigate("/agent/visits")}
              className="px-6 py-2.5 rounded-xl font-bold text-[13px] transition-all hover:opacity-80"
              style={{ background: tc.bg, border: `1px solid ${tc.border}`, color: tc.text }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedLead}
              className="px-6 py-2.5 rounded-xl font-bold text-[13px] text-white flex items-center gap-2 transition-all hover:opacity-90 shadow-sm disabled:opacity-50"
              style={{ background: tc.blue }}
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Schedule & Save Visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
