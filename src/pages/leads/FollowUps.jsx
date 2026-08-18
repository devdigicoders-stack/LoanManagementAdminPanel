import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Plus,
  MoreVertical,
  PhoneCall,
  Users,
  MessageCircle,
  Calendar,
} from "lucide-react";

const mockFollowUps = [
  {
    id: 1,
    leadName: "Rohit Kumar",
    leadId: "LID-2025-1268",
    avatar: "https://i.pravatar.cc/150?u=rohit",
    type: "Call",
    datetime: "20 May 2025, 11:00 AM",
    status: "Upcoming",
  },
  {
    id: 2,
    leadName: "Priya Sharma",
    leadId: "LID-2025-1267",
    avatar: "https://i.pravatar.cc/150?u=priya",
    type: "Meeting",
    datetime: "19 May 2025, 02:00 PM",
    status: "Due Today",
  },
  {
    id: 3,
    leadName: "Amit Verma",
    leadId: "LID-2025-1266",
    avatar: "https://i.pravatar.cc/150?u=amit",
    type: "Call",
    datetime: "18 May 2025, 10:30 AM",
    status: "Completed",
  },
  {
    id: 4,
    leadName: "Neha Singh",
    leadId: "LID-2025-1265",
    avatar: "https://i.pravatar.cc/150?u=neha",
    type: "WhatsApp",
    datetime: "17 May 2025, 11:30 AM",
    status: "Completed",
  },
  {
    id: 5,
    leadName: "Suresh Patel",
    leadId: "LID-2025-1264",
    avatar: "https://i.pravatar.cc/150?u=suresh",
    type: "Call",
    datetime: "17 May 2025, 10:00 AM",
    status: "Completed",
  },
];

export default function FollowUps() {
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
          <select className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white min-w-[140px]">
            <option>All Employees</option>
          </select>
          <select className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white min-w-[140px]">
            <option>All Status</option>
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
          {mockFollowUps.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-md transition-colors cursor-pointer group"
            >
              {/* Left: Avatar & Name */}
              <div className="flex items-center gap-4 w-[250px]">
                <img
                  src={item.avatar}
                  alt={item.leadName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
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
                    {item.datetime}
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
                <button className="p-1.5 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-200 transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
