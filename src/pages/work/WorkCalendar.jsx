import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Plus,
  ChevronLeft,
  Calendar as CalendarIcon,
} from "lucide-react";

export default function WorkCalendar() {
  // Dummy days for May 2025
  // May 1st 2025 is a Thursday.
  // 31 days in May.
  const daysInMonth = 31;
  const startDayOfWeek = 4; // 0=Sun, 1=Mon, ..., 4=Thu

  const calendarCells = [];

  // Empty cells before start of month
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarCells.push({ empty: true, date: null });
  }

  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({ empty: false, date: i });
  }

  // Ensure grid is complete to fill 5-6 weeks (42 cells max usually)
  const remainingCells = 35 - calendarCells.length; // 5 rows
  if (remainingCells > 0) {
    for (let i = 0; i < remainingCells; i++) {
      calendarCells.push({ empty: true, date: null });
    }
  }

  const getEventsForDate = (date) => {
    if (date === 5)
      return [
        {
          id: 1,
          title: "Call - Rohit",
          time: "11:00 AM",
          type: "call",
          color: "text-[#489b0d] bg-[#489b0d]/10",
        },
      ];
    if (date === 14)
      return [
        {
          id: 2,
          title: "Meeting - Priya",
          time: "02:00 PM",
          type: "meeting",
          color: "text-purple-500 bg-purple-50",
        },
      ];
    if (date === 22)
      return [
        {
          id: 3,
          title: "Verify Docs",
          time: "10:30 AM",
          type: "task",
          color: "text-blue-500 bg-blue-50",
        },
      ];
    if (date === 25)
      return [
        {
          id: 4,
          title: "Call - Neha",
          time: "12:00 PM",
          type: "call",
          color: "text-[#489b0d] bg-[#489b0d]/10",
        },
        {
          id: 5,
          title: "Follow up",
          time: "04:00 PM",
          type: "followup",
          color: "text-orange-500 bg-orange-50",
        },
      ];
    return [];
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Work Calendar
          </h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">
              Lead & Work Management
            </span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">Work Calendar</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <select className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white min-w-[100px]">
            <option>Month</option>
            <option>Week</option>
            <option>Day</option>
          </select>
          <div className="flex items-center">
            <button className="h-10 w-10 flex items-center justify-center border border-slate-200 border-r-0 rounded-l-xl text-slate-500 hover:bg-slate-50 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <div className="h-10 px-4 flex items-center justify-center border border-slate-200 bg-white text-[13px] font-bold text-slate-800 min-w-[120px]">
              May 2025
            </div>
            <button className="h-10 w-10 flex items-center justify-center border border-slate-200 border-l-0 rounded-r-xl text-slate-500 hover:bg-slate-50 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
          <button className="h-10 px-4 flex items-center gap-2 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm">
            <Plus size={16} /> Add Event
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col flex-1 overflow-hidden min-h-[600px]">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50 shrink-0">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="py-3 text-center text-[12px] font-extrabold text-slate-500 uppercase tracking-wider border-r border-slate-100 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-slate-100 gap-[1px]">
          {calendarCells.map((cell, idx) => {
            const isToday = cell.date === 18; // Mock today is 18th
            const events = cell.date ? getEventsForDate(cell.date) : [];

            return (
              <div
                key={idx}
                className={`bg-white min-h-[100px] p-2 hover:bg-slate-50 transition-colors ${!cell.date ? "bg-slate-50/30" : "cursor-pointer"}`}
              >
                {cell.date && (
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`w-7 h-7 flex items-center justify-center rounded-full text-[13px] font-bold ${isToday ? "bg-[#489b0d] text-white shadow-sm" : "text-slate-600"}`}
                      >
                        {cell.date}
                      </span>
                    </div>

                    <div className="space-y-1 mt-auto">
                      {events.map((ev) => (
                        <div
                          key={ev.id}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-bold truncate flex flex-col gap-0.5 ${ev.color}`}
                        >
                          <span className="truncate">{ev.title}</span>
                          <span className="font-medium opacity-80">
                            {ev.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
