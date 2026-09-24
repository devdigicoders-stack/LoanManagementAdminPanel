import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { RefreshCw, ChevronDown, ArrowRight, UserCheck, Phone, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { statusColors } from "./telecallerData";

const tc = {
  card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  cream: "#FFF8E7", text: "#344054", muted: "#667085", border: "#D9EAF2", blue: "#1e7ba8",
};

const statuses = ["New", "Contacted", "Interested", "Follow-up", "Documents Pending", "Application Submitted", "Converted", "Lost"];

export default function UpdateLeadStatus() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const leadIdQuery = searchParams.get('leadId') || id;
  const navigate = useNavigate();

  const [availableLeads, setAvailableLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(leadIdQuery || "");
  const [lead, setLead] = useState(null);
  const [status, setStatus] = useState("Contacted");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/my-leads`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const list = data.leads || [];
          setAvailableLeads(list);
          
          if (list.length > 0) {
            const found = list.find(l => (l._id === selectedLeadId || l.leadId === selectedLeadId)) || list[0];
            setLead(found);
            setSelectedLeadId(found._id);
            setStatus(found.status || "Contacted");
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [selectedLeadId]);

  const handleSelectChange = (e) => {
    const chosenId = e.target.value;
    setSelectedLeadId(chosenId);
    const chosenLead = availableLeads.find(l => l._id === chosenId);
    if (chosenLead) {
      setLead(chosenLead);
      setStatus(chosenLead.status || "Contacted");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!status || !reason) {
      toast.error("Please select new status and enter reason/remarks.");
      return;
    }
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const targetId = lead.dbId || lead._id || id;
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads/${targetId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, remarks: reason, reason })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Lead status & remarks updated! RM notified.");
        navigate(`/telecaller/leads`);
      } else {
        toast.error(data.message || "Failed to update lead status");
      }
    } catch (err) {
      toast.error("Error communicating with server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sc = lead ? (statusColors[lead.status] || { bg: "#F1F5F9", text: "#64748B" }) : { bg: "#F1F5F9", text: "#64748B" };
  const nc = statusColors[status] || { bg: "#F1F5F9", text: "#64748B" };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <h1 className="text-[22px] font-extrabold text-slate-900">Update Lead Status</h1>
        <p className="text-[13px] text-slate-500">Record customer calling feedback and update status in database.</p>
      </div>

      <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
        <p className="text-[12px] font-bold mb-2 text-purple-800">Status Flow:</p>
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-600">
          <span>New</span><ArrowRight size={10} />
          <span>Contacted</span><ArrowRight size={10} />
          <span>Interested</span><ArrowRight size={10} />
          <span>Follow-up</span><ArrowRight size={10} />
          <span>Documents Pending</span><ArrowRight size={10} />
          <span className="text-emerald-700">Converted</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-5 bg-white border border-slate-200 shadow-sm">
        {/* Select Lead Dropdown */}
        <div>
          <label className="block text-[12px] font-bold mb-1.5 text-slate-800">Select Customer Lead <span className="text-rose-600">*</span></label>
          <div className="relative">
            <select
              value={selectedLeadId}
              onChange={handleSelectChange}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-[13px] font-bold text-slate-800 outline-none appearance-none cursor-pointer"
            >
              {availableLeads.length === 0 ? (
                <option value="">No leads in your queue</option>
              ) : (
                availableLeads.map(l => (
                  <option key={l._id} value={l._id}>
                    {l.name} ({l.mobile}) - ₹{Number(l.expectedAmount || 500000).toLocaleString('en-IN')} [{l.status || 'New'}]
                  </option>
                ))
              )}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>
        </div>

        {lead && (
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-0.5">Current Status</p>
              <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold" style={{ background: sc.bg, color: sc.text }}>
                {lead.status || 'New'}
              </span>
            </div>
            <ArrowRight size={18} className="text-slate-400" />
            <div className="text-right">
              <p className="text-[11px] font-bold text-slate-500 mb-0.5">New Status</p>
              <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold" style={{ background: nc.bg, color: nc.text }}>
                {status}
              </span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-[12px] font-bold mb-1.5 text-slate-800">Select New Status <span className="text-rose-600">*</span></label>
          <div className="relative">
            <select 
              value={status} 
              onChange={e => setStatus(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-purple-200 bg-purple-50 text-[14px] font-bold text-purple-900 outline-none appearance-none cursor-pointer"
            >
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-purple-700" />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-bold mb-1.5 text-slate-800">Calling Notes / Remarks <span className="text-rose-600">*</span></label>
          <textarea 
            rows={4} 
            placeholder="Customer discussion feedback, loan requirement details, follow-up remarks..."
            value={reason} 
            onChange={e => setReason(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[13px] font-medium outline-none resize-none focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl text-[13px] font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={15} className={isSubmitting ? "animate-spin" : ""} /> 
            {isSubmitting ? "Saving..." : "Update Status & Remarks"}
          </button>
        </div>
      </form>
    </div>
  );
}
