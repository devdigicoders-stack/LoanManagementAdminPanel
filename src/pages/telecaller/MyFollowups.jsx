import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, Eye, CheckCircle2, CalendarDays, MessageSquare, PhoneCall, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const tc = {
  card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  cream: "#FFF8E7", text: "#344054", muted: "#667085", border: "#D9EAF2", blue: "#1e7ba8",
};

export default function MyFollowups() {
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveFollowups();
  }, []);

  const fetchLiveFollowups = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/my-leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let leadsData = [];
      if (res.ok) {
        const data = await res.json();
        leadsData = data.leads || [];
      } else {
        res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          leadsData = await res.json();
        }
      }

      const extracted = [];
      const todayStr = new Date().toISOString().split('T')[0];

      (leadsData || []).forEach(l => {
        if (l.followUps && l.followUps.length > 0) {
          l.followUps.forEach(fu => {
            const schedDate = fu.scheduledAt || todayStr;
            let computedStatus = fu.status || 'Upcoming';
            if (computedStatus === 'Scheduled' || computedStatus === 'Upcoming' || computedStatus === 'Pending') {
              if (schedDate === todayStr) computedStatus = 'Due Today';
              else if (schedDate < todayStr) computedStatus = 'Missed / Overdue';
              else computedStatus = 'Upcoming';
            }
            extracted.push({
              leadId: l.leadId || l._id,
              mongoLeadId: l._id,
              followupId: fu._id,
              customer: l.name,
              mobile: l.mobile,
              zone: l.zone || 'NORTH',
              date: schedDate,
              time: fu.scheduledTime || "11:00 AM",
              type: fu.type || 'Call',
              purpose: fu.notes || fu.remarks || l.loanPurpose || "Discussion",
              status: computedStatus
            });
          });
        } else if (l.nextFollowUp && l.nextFollowUp !== '-') {
          // If follow-up date was set directly on lead
          const schedDate = l.nextFollowUp;
          let computedStatus = 'Upcoming';
          if (schedDate === todayStr) computedStatus = 'Due Today';
          else if (schedDate < todayStr) computedStatus = 'Missed / Overdue';

          extracted.push({
            leadId: l.leadId || l._id,
            mongoLeadId: l._id,
            followupId: `direct-${l._id}`,
            customer: l.name,
            mobile: l.mobile,
            zone: l.zone || 'NORTH',
            date: schedDate,
            time: "11:00 AM",
            type: 'Call',
            purpose: l.telecallerNotes || l.remarks || l.loanPurpose || "Customer Callback",
            status: computedStatus
          });
        }
      });
      setFollowups(extracted);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load follow-ups");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (mongoLeadId, followupId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads/${mongoLeadId}/followup/${followupId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: "Completed" })
      });
      if (res.ok) {
        setFollowups(prev => prev.map(f => f.followupId === followupId ? { ...f, status: "Completed" } : f));
        toast.success("Follow-up marked as Completed in MongoDB!");
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const todayCount = followups.filter(f => f.status === "Due Today" || f.date === new Date().toISOString().split('T')[0]).length;
  const upcomingCount = followups.filter(f => f.status === "Upcoming").length;
  const completedCount = followups.filter(f => f.status === "Completed").length;

  const summary = [
    { label: "Total Follow-ups", count: followups.length, color: tc.blue, bg: tc.sky },
    { label: "Due Today", count: todayCount, color: "#D97706", bg: "#FEF3C7" },
    { label: "Upcoming", count: upcomingCount, color: "#1e7ba8", bg: tc.sky },
    { label: "Completed", count: completedCount, color: "#15803D", bg: "#DCFCE7" },
  ];

  return (
    <div className="space-y-5" style={{ color: tc.text }}>
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>My Follow-ups</h1>
        <p className="text-[13px]" style={{ color: tc.muted }}>
          Live customer reminders and scheduled calls retrieved from MongoDB.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summary.map((s, i) => (
          <div key={i} className="rounded-2xl p-4 text-center" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <span className="text-[24px] font-extrabold" style={{ color: s.color }}>
              {loading ? "..." : s.count}
            </span>
            <p className="text-[12px] font-bold" style={{ color: tc.muted }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] whitespace-nowrap">
            <thead>
              <tr style={{ background: tc.sky }}>
                {["Lead ID", "Customer Name", "Contact", "Zone", "Follow-up Date", "Type", "Discussion Focus / Notes", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    <Loader2 size={20} className="animate-spin mx-auto mb-2 text-[#1e7ba8]" />
                    Loading follow-up tasks...
                  </td>
                </tr>
              ) : followups.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No pending follow-ups found in database.
                  </td>
                </tr>
              ) : (
                followups.map((fu, i) => {
                  return (
                    <tr key={fu.followupId || i} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-[#FAFCFD] transition-colors whitespace-nowrap">
                      <td className="px-4 py-3 font-bold font-mono" style={{ color: tc.blue }}>{fu.leadId}</td>
                      <td className="px-4 py-3 font-semibold">{fu.customer}</td>
                      <td className="px-4 py-3">
                        <a href={`tel:${fu.mobile}`} className="font-mono text-xs text-blue-600 hover:underline">
                          {fu.mobile}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                          {fu.zone} Zone
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold" style={{ color: tc.muted }}>{fu.date}</td>
                      <td className="px-4 py-3 font-medium">{fu.type}</td>
                      <td className="px-4 py-3 max-w-[240px] truncate" style={{ color: tc.text }} title={fu.purpose}>
                        {fu.purpose}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          fu.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          fu.status === 'Due Today' ? 'bg-amber-100 text-amber-800' :
                          fu.status.includes('Missed') ? 'bg-rose-100 text-rose-800' :
                          'bg-blue-50 text-blue-700'
                        }`}>
                          {fu.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <a 
                            href={`tel:${fu.mobile}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Call Customer Now"
                          >
                            <PhoneCall size={15} />
                          </a>
                          {fu.status !== 'Completed' && (
                            <button
                              onClick={() => handleMarkCompleted(fu.mongoLeadId, fu.followupId)}
                              className="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-md text-[11px] transition-colors"
                            >
                              Mark Done
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
