import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Plus,
  List,
  LayoutGrid,
  MoreHorizontal,
  Clock,
} from "lucide-react";

// Mock Data for Kanban
const tasks = {
  todo: [
    {
      id: 1,
      title: "Call Rohit Kumar",
      subtitle: "LID-2025-1268",
      priority: "High",
      due: "Today",
    },
    {
      id: 2,
      title: "Prepare quotation",
      subtitle: "LID-2025-1265",
      priority: "Medium",
      due: "21 May 2025",
    },
    {
      id: 3,
      title: "Verify documents",
      subtitle: "APP-2025-1249",
      priority: "High",
      due: "Today",
    },
  ],
  inProgress: [
    {
      id: 4,
      title: "Meeting with Priya Sharma",
      subtitle: "LID-2025-1267",
      priority: "High",
      due: "Today",
    },
    {
      id: 5,
      title: "Follow up with Amit Verma",
      subtitle: "LID-2025-1266",
      priority: "Medium",
      due: "Today",
    },
    {
      id: 6,
      title: "Check credit score",
      subtitle: "APP-2025-1244",
      priority: "Low",
      due: "22 May 2025",
    },
  ],
  completed: [
    {
      id: 7,
      title: "Welcome call",
      subtitle: "LID-2025-1264",
      priority: "Low",
      due: "16 May 2025",
    },
    {
      id: 8,
      title: "Send documents list",
      subtitle: "LID-2025-1263",
      priority: "Medium",
      due: "17 May 2025",
    },
    {
      id: 9,
      title: "Application submitted",
      subtitle: "APP-2025-1246",
      priority: "Low",
      due: "18 May 2025",
    },
  ],
};

const TaskCard = ({ task }) => {
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-500 bg-red-50";
      case "Medium":
        return "text-orange-500 bg-orange-50";
      case "Low":
        return "text-[#489b0d] bg-[#489b0d]/10";
      default:
        return "text-slate-500 bg-slate-100";
    }
  };

  return (
    <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-grab group">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-[13px] font-bold text-slate-800 leading-snug pr-4">
          {task.title}
        </h4>
        <button className="text-slate-400 hover:text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={14} />
        </button>
      </div>
      <p className="text-[11px] font-medium text-slate-500 mb-4">
        {task.subtitle}
      </p>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityStyle(task.priority)}`}
        >
          {task.priority}
        </span>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock size={12} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {task.due}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function TaskManagement() {
  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Task Management
          </h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">
              Lead & Work Management
            </span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">Tasks</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-md p-1 shadow-sm">
            <button className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg transition-colors">
              <List size={16} />
            </button>
            <button className="p-1.5 bg-[#489b0d]/10 text-[#489b0d] rounded-lg transition-colors">
              <LayoutGrid size={16} />
            </button>
          </div>
          <button className="h-10 px-4 flex items-center gap-2 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm">
            <Plus size={16} /> Add Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex items-start gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {/* To Do Column */}
        <div className="w-[320px] shrink-0 flex flex-col bg-slate-50/50 rounded-lg border border-slate-100 p-4 min-h-[500px]">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[13px] font-extrabold text-slate-800 tracking-wide uppercase">
              To-Do <span className="text-slate-400 ml-1">(3)</span>
            </h3>
            <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-200 text-slate-500 transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-3 flex-1">
            {tasks.todo.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="w-[320px] shrink-0 flex flex-col bg-slate-50/50 rounded-lg border border-slate-100 p-4 min-h-[500px]">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[13px] font-extrabold text-slate-800 tracking-wide uppercase">
              In Progress <span className="text-slate-400 ml-1">(3)</span>
            </h3>
            <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-200 text-slate-500 transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-3 flex-1">
            {tasks.inProgress.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* Completed Column */}
        <div className="w-[320px] shrink-0 flex flex-col bg-slate-50/50 rounded-lg border border-slate-100 p-4 min-h-[500px]">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[13px] font-extrabold text-[#489b0d] tracking-wide uppercase">
              Completed <span className="text-[#489b0d]/60 ml-1">(3)</span>
            </h3>
            <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#489b0d]/10 text-[#489b0d] transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-3 flex-1">
            {tasks.completed.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
