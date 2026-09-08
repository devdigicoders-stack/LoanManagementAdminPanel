import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  Plus,
  MoreVertical,
  PhoneCall,
  Users,
  MessageCircle,
  Calendar,
} from "lucide-react";

export default function FollowUps() {
  const [followUps, setFollowUps] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [canAssign, setCanAssign] = useState(false);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const api = import.meta.env.VITE_API_BASE_URL;

  const loadFollowUps = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/followups?status=${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setFollowUps(data.followUps || []);
        setCanAssign(data.canAssign === true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFollowUps();
  }, [status]);

  useEffect(() => {
    if (!canAssign) return;
    fetch(`${api}/employees?status=Active`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setEmployees(Array.isArray(data) ? data : []));
  }, [canAssign]);

  const assignFollowUp = async (followUpId, assignedToId) => {
    if (!assignedToId) return;
    const response = await fetch(`${api}/followups/${followUpId}/assign`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ assignedToId }),
    });
    if (response.ok) loadFollowUps();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Upcoming":
        return "text-slate-500 font-bold";
      case "Due Today":
        return "text-red-500 font-bold";
      case "Completed":
        return "text-[#489b0d] font-bold";
      default:
        return "text-slate-500 font-bold";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Call":
        return <PhoneCall size={16} className="text-blue-500" />;
      case "Meeting":
        return <Users size={16} className="text-purple-500" />;
      case "WhatsApp":
        return <MessageCircle size={16} className="text-[#489b0d]" />;
      default:
        return <PhoneCall size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="w-full max-w-[1000px] space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Follow Ups</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">
              Lead & Work Management
            </span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">Follow Ups</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white min-w-[140px]">
            <option value="all">All Status</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Due Today">Due Today</option>
            <option value="Completed">Completed</option>
            <option value="Missed">Missed</option>
          </select>
          <div className="h-10 px-3 flex items-center justify-between rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 bg-white min-w-[120px]">
            <span>Today</span>
            <ChevronRight size={14} className="text-slate-400 rotate-90" />
          </div>
          <button className="h-10 px-4 flex items-center gap-2 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm">
            <Plus size={16} /> Add Follow Up
          </button>
        </div>
      </div>

      {/* Follow Ups List */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden p-2">
        <div className="flex flex-col divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium text-sm">Loading follow-ups...</div>
          ) : followUps.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium text-sm">
              No follow-ups found.
            </div>
          ) : followUps.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-md transition-colors cursor-pointer group"
            >
              {/* Left: Avatar & Name */}
              <div className="flex items-center gap-4 w-[250px]">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-100">
                  {(item.leadName || "L").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-slate-800 leading-none mb-1">
                    {item.leadName}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-500">
                    {item.leadId}
                  </p>
                </div>
              </div>

              {/* Middle: Type & Date */}
              <div className="flex items-center gap-12 flex-1">
                <div className="flex items-center gap-2 w-[100px]">
                  {getTypeIcon(item.type)}
                  <span className="text-[13px] font-semibold text-slate-700">
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" />
                  <span className="text-[13px] font-semibold text-slate-700">
                    {new Date(item.scheduledAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Right: Status & Actions */}
              <div className="flex items-center gap-6">
                <span
                  className={`text-[12px] w-[80px] text-right ${getStatusStyle(item.status)}`}
                >
                  {item.status}
                </span>
                {canAssign ? (
                  <select
                    value={item.assignedToId || ""}
                    onChange={(event) => assignFollowUp(item._id, event.target.value)}
                    className="h-8 max-w-[170px] rounded border border-slate-200 px-2 text-[11px] font-semibold text-slate-600"
                  >
                    <option value="">Assign employee</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name} ({employee.empId})
                      </option>
                    ))}
                  </select>
                ) : <MoreVertical size={16} className="text-slate-400" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
