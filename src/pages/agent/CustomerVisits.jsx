import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, CalendarCheck, Clock, CheckCircle, XCircle, RefreshCw, Eye, Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function CustomerVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/visits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVisits(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load visits");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/visits/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: "Completed", outcome: "Verification passed and documents collected." })
      });
      if (res.ok) {
        setVisits(prev => prev.map(v => v._id === id ? { ...v, status: "Completed" } : v));
        toast.success("Visit marked as Completed!");
      }
    } catch (err) {
      toast.error("Failed to update visit status");
    }
  };

  const scheduledCount = visits.filter(v => v.status === "Scheduled").length;
  const completedCount = visits.filter(v => v.status === "Completed").length;

  const cards = [
    { label: "Total Visits", value: visits.length, icon: MapPin, color: "#EEF2FF", iconColor: "#4338CA" },
    { label: "Scheduled", value: scheduledCount, icon: Clock, color: "#FEF3C7", iconColor: "#D97706" },
    { label: "Completed", value: completedCount, icon: CheckCircle, color: "#DCFCE7", iconColor: "#15803D" },
    { label: "Pending Follow-up", value: visits.filter(v => v.purpose === "Follow-up").length, icon: RefreshCw, color: "#F3E8FF", iconColor: "#7E22CE" },
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Customer Field Visits</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>
            Live customer verifications, physical meetings and document pickups from MongoDB.
          </p>
        </div>
        <Link to="/agent/visits/add" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90" style={{ background: tc.blue }}>
          <Plus size={16} /> Schedule Visit
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="rounded-2xl p-4 flex flex-col gap-2" style={{ background: tc.card, border: `1px solid ${tc.border}`, boxShadow: "0 1px 6px rgba(142,211,244,0.08)" }}>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: card.color }}>
                  <Icon size={17} style={{ color: card.iconColor }} />
                </div>
                <span className="text-[20px] font-extrabold" style={{ color: tc.text }}>
                  {loading ? "..." : card.value}
                </span>
              </div>
              <div>
                <p className="text-[12px] font-bold" style={{ color: tc.text }}>{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl overflow-hidden w-full" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: tc.sky }}>
                {["Visit ID", "Customer Name", "Mobile", "Scheduled Date", "Time", "Location Address", "Purpose", "Assigned Agent", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    <Loader2 size={20} className="animate-spin mx-auto mb-2 text-[#1e7ba8]" />
                    Loading visits...
                  </td>
                </tr>
              ) : visits.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No field visits scheduled.
                  </td>
                </tr>
              ) : (
                visits.map(v => (
                  <tr key={v._id} className="hover:bg-slate-50/50 transition-colors" style={{ borderBottom: `1px solid ${tc.border}` }}>
                    <td className="px-4 py-3 font-bold" style={{ color: tc.blue }}>{v.visitId}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.text }}>{v.customerName}</td>
                    <td className="px-4 py-3 font-mono text-[11px]" style={{ color: tc.muted }}>{v.mobile}</td>
                    <td className="px-4 py-3" style={{ color: tc.muted }}>
                      {new Date(v.scheduledDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3" style={{ color: tc.muted }}>{v.scheduledTime}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate" style={{ color: tc.text }} title={v.address}>
                      {v.address}
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: tc.text }}>{v.purpose}</td>
                    <td className="px-4 py-3" style={{ color: tc.muted }}>{v.agentName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        v.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {v.status !== 'Completed' ? (
                        <button 
                          onClick={() => handleMarkCompleted(v._id)}
                          className="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-lg text-[11px] transition-all"
                        >
                          Complete
                        </button>
                      ) : (
                        <span className="text-green-600 font-bold text-xs">✓ Done</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
