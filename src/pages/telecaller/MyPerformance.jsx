import { useState, useEffect } from "react";
import { 
  BarChart3, TrendingUp, Target, Phone, Users, Star, 
  CalendarCheck, CheckCircle2, XCircle, Filter, Award, 
  Clock, ShieldCheck, Flame, ArrowUpRight, RefreshCw, 
  Calendar, PhoneCall, CheckCircle, Sparkles
} from "lucide-react";
import toast from "react-hot-toast";

export default function MyPerformance() {
  const [filter, setFilter] = useState("All Time");
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [followups, setFollowups] = useState([]);

  const userRole = localStorage.getItem("userRole") || "tele";
  const agentName = localStorage.getItem(`adminName_${userRole}`) || "Telecaller Agent";

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const [leadsRes, followupsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/my-leads`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/leads/my-followups`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ ok: false }))
      ]);

      let allLeads = [];
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        allLeads = [
          ...(data.leads || []).map(l => ({ ...l, type: 'Lead' })),
          ...(data.loanApplications || []).map(a => ({ ...a, type: 'LoanApplication' }))
        ];
      }

      let allFollowups = [];
      if (followupsRes.ok) {
        const fData = await followupsRes.json();
        allFollowups = fData.followups || [];
      }

      setLeads(allLeads);
      setFollowups(allFollowups);
    } catch (err) {
      console.error("Failed to load performance metrics", err);
      toast.error("Failed to sync live performance data");
    } finally {
      setLoading(false);
    }
  };

  // Filter calculations based on timeline
  const now = new Date();
  const filteredLeads = leads.filter(l => {
    if (filter === "All Time") return true;
    const itemDate = new Date(l.createdAt || l.updatedAt || now);
    if (filter === "Today") {
      return itemDate.toDateString() === now.toDateString();
    }
    if (filter === "This Week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return itemDate >= oneWeekAgo;
    }
    if (filter === "This Month") {
      return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // Dynamic KPI Metrics
  const totalLeads = filteredLeads.length;
  const readyToCall = filteredLeads.filter(l => l.workflowStage === 'RM_Telecaller_Review' && !l.telecallerConfirmedAt).length;
  const contactedLeads = filteredLeads.filter(l => 
    Boolean(l.telecallerConfirmedAt || l.telecallerNotes || (l.followUps && l.followUps.length > 0) || 
    ['Contacted', 'Interested', 'Follow-up', 'Qualified', 'Converted', 'Lost', 'Documents Pending'].includes(l.status))
  ).length;

  const interestedLeads = filteredLeads.filter(l => 
    ['Interested', 'Qualified', 'Customer_Confirmed'].includes(l.status)
  ).length;

  const convertedLeads = filteredLeads.filter(l => 
    ['Converted', 'Sanctioned', 'Disbursed', 'Approved'].includes(l.status) || l.workflowStage === 'Disbursed'
  ).length;

  const followupsCompleted = filteredLeads.filter(l => 
    (l.followUps && l.followUps.some(f => f.status === 'Completed' || f.status === 'Done')) || l.status === 'Follow-up'
  ).length;

  const lostLeads = filteredLeads.filter(l => 
    ['Lost', 'Rejected', 'Not Interested', 'Cancelled'].includes(l.status)
  ).length;

  const totalCallsLogged = filteredLeads.reduce((acc, l) => {
    let callCount = (l.followUps || []).length;
    if (l.telecallerConfirmedAt) callCount += 1;
    return acc + Math.max(1, callCount);
  }, 0);

  const conversionRate = totalLeads > 0 
    ? Math.round(((convertedLeads + interestedLeads) / totalLeads) * 100) 
    : 0;

  const contactRate = totalLeads > 0 
    ? Math.round((contactedLeads / totalLeads) * 100) 
    : 0;

  // Visual Activity Overview Bar Metrics
  const activityMetrics = [
    { label: "Leads Assigned", current: totalLeads, target: Math.max(10, totalLeads + 5), color: "bg-purple-600", textCol: "text-purple-700" },
    { label: "Calls & Outreaches Made", current: totalCallsLogged, target: Math.max(20, totalCallsLogged + 10), color: "bg-indigo-600", textCol: "text-indigo-700" },
    { label: "Customers Contacted & Verified", current: contactedLeads, target: Math.max(totalLeads, 10), color: "bg-blue-600", textCol: "text-blue-700" },
    { label: "Interested / Confirmed Customers", current: interestedLeads, target: Math.max(contactedLeads, 5), color: "bg-amber-500", textCol: "text-amber-700" },
    { label: "Final Converted / Handed Over", current: convertedLeads, target: Math.max(interestedLeads, 5), color: "bg-emerald-600", textCol: "text-emerald-700" },
  ];

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-12">
      {/* ── TOP HERO HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 rounded-3xl shadow-lg border border-purple-900/40 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <Award size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles size={11} /> Live Telecaller Scorecard
              </span>
              <span className="text-xs text-slate-400">• {agentName}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">My Calling & Sales Performance</h1>
            <p className="text-xs md:text-sm text-purple-200/80 font-medium">
              Real-time analytics for calls made, customer engagement, conversion rates & RM handovers.
            </p>
          </div>
        </div>

        {/* Filter & Refresh */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="relative">
            <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-300" />
            <select 
              value={filter} 
              onChange={e => setFilter(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-xs font-bold text-white outline-none cursor-pointer backdrop-blur-md transition-all"
            >
              <option value="Today" className="text-slate-900">Today</option>
              <option value="This Week" className="text-slate-900">This Week</option>
              <option value="This Month" className="text-slate-900">This Month</option>
              <option value="All Time" className="text-slate-900">All Time</option>
            </select>
          </div>

          <button
            onClick={fetchPerformanceData}
            disabled={loading}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
            title="Refresh Performance Metrics"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-purple-300" : ""} />
          </button>
        </div>
      </div>

      {/* ── TOP HIGHLIGHT CARDS (Conversion, Contact Rate & Efficiency) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Conversion Rate */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-purple-50 to-indigo-50/50 border border-purple-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">Conversion & Interest Rate</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-purple-950 tracking-tight">{conversionRate}%</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                <ArrowUpRight size={12} /> Positive
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              {interestedLeads + convertedLeads} Positive Leads out of {totalLeads} Assigned
            </p>
          </div>
          <div className="w-full bg-purple-200/60 h-2.5 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${Math.min(100, conversionRate)}%` }} />
          </div>
        </div>

        {/* Card 2: Contact Outreach Rate */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-blue-50 to-sky-50/50 border border-blue-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Contact Outreach Rate</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <PhoneCall size={20} />
            </div>
          </div>
          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-blue-950 tracking-tight">{contactRate}%</span>
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                Active Desk
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              {contactedLeads} Customers Contacted & Verified
            </p>
          </div>
          <div className="w-full bg-blue-200/60 h-2.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${Math.min(100, contactRate)}%` }} />
          </div>
        </div>

        {/* Card 3: Performance Badge & RM Sync */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">RM Handover Status</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="my-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-emerald-950 tracking-tight">{convertedLeads}</span>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg">
                Handed to Ops / RM
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              {readyToCall} Leads currently pending customer call
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700">
            <CheckCircle size={14} /> Real-time database synchronisation
          </div>
        </div>
      </div>

      {/* ── METRIC TILES GRID ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[
          { label: "Total Assigned", val: totalLeads, icon: Target, bg: "bg-purple-50 text-purple-700 border-purple-200" },
          { label: "Total Calls", val: totalCallsLogged, icon: Phone, bg: "bg-indigo-50 text-indigo-700 border-indigo-200" },
          { label: "Contacted", val: contactedLeads, icon: Users, bg: "bg-blue-50 text-blue-700 border-blue-200" },
          { label: "Interested", val: interestedLeads, icon: Star, bg: "bg-amber-50 text-amber-700 border-amber-200" },
          { label: "Follow-ups", val: followupsCompleted, icon: CalendarCheck, bg: "bg-teal-50 text-teal-700 border-teal-200" },
          { label: "Lost / Dropped", val: lostLeads, icon: XCircle, bg: "bg-rose-50 text-rose-700 border-rose-200" },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-purple-300 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl border ${item.bg}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 leading-none">{item.val}</p>
                <p className="text-[11px] font-bold text-slate-500 mt-1">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── ACTIVITY PROGRESS & MILESTONES ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity Funnel */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <BarChart3 size={18} className="text-purple-600" /> Pipeline Activity Funnel
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Conversion progression of leads assigned by Reporting Managers (RM).
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
              {filter}
            </span>
          </div>

          <div className="space-y-4">
            {activityMetrics.map((d, i) => {
              const pct = d.target > 0 ? Math.min(100, Math.round((d.current / d.target) * 100)) : 0;
              return (
                <div key={i} className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-700">{d.label}</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-sm font-black ${d.textCol}`}>{d.current}</span>
                      <span className="text-[11px] font-semibold text-slate-400">/ target {d.target}</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${d.color}`} 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Performance Tips & Daily Target Checklist */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flame size={20} className="text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-base">Telecaller Best Practices</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
              Maintain high customer engagement and submit remarks promptly for Reporting Manager verification.
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">Immediate Callbacks</h4>
                  <p className="text-[11px] text-emerald-800 font-medium mt-0.5">Call assigned leads within 15 minutes of RM approval.</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-purple-950">Detailed Remarks</h4>
                  <p className="text-[11px] text-purple-800 font-medium mt-0.5">Always record income, loan type and customer availability notes.</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-blue-950">Schedule Timely Follow-ups</h4>
                  <p className="text-[11px] text-blue-800 font-medium mt-0.5">Never leave interested customers without a next callback date.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-purple-400" />
              <span className="text-xs font-bold">Total Calling Records</span>
            </div>
            <span className="text-xs font-black text-emerald-400 font-mono">{totalCallsLogged} Logs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
