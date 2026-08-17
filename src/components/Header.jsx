import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  let title = 'Good Morning, Admin!';
  let subtitle = "Here's what's happening with your loan management system today.";
  let showHand = true;

  if (location.pathname === '/users') {
    title = 'Manage Users';
    subtitle = 'View, search, and manage all users in the system.';
    showHand = false;
  }

  return (
    <div className="shrink-0 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-white shadow-sm mb-6">
      <div className="px-2">
        <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          {title}
          {showHand && (
            <span className="inline-block origin-bottom-right hover:rotate-12 transition-transform cursor-default text-2xl">👋</span>
          )}
        </h1>
        <p className="text-[13px] text-slate-500 font-medium mt-0.5">{subtitle}</p>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto">
        {/* Search Bar */}
        <div className="relative flex-1 lg:w-80 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} strokeWidth={2.5} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full pl-10 pr-16 py-2.5 bg-white border border-slate-200 rounded-2xl text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-70">
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200">Ctrl</span>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200">K</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-sm group">
            <Bell size={20} strokeWidth={2.5} className="group-hover:animate-swing" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 border-2 border-white rounded-full"></span>
          </button>
          
          <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>

          {/* Profile Dropdown */}
          <button className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm text-left">
            <div className="w-9 h-9 rounded-xl bg-blue-50 overflow-hidden shadow-inner shrink-0 flex items-center justify-center">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=e2e8f0" alt="Admin" className="w-full h-full object-cover mt-2" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[13px] font-bold text-slate-800 leading-none mb-1">Admin User</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">Super Admin</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
