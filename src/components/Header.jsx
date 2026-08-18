import { Bell, Calendar, Clock, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header({ toggleSidebar }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between z-10">
      
      <div className="flex items-center gap-4">
        {/* Hamburger Menu (Mobile Only) */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 transition-colors rounded-md hover:bg-slate-50"
        >
          <Menu size={24} />
        </button>

        {/* Live Date & Time Section */}
        <div className="flex items-center gap-6 hidden lg:flex">
        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-md border border-slate-100 shadow-sm">
          <Calendar size={16} className="text-[#489b0d]" />
          <span className="text-[13px] font-bold tracking-wide">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-md border border-slate-100 shadow-sm">
          <Clock size={16} className="text-[#489b0d]" />
          <span className="text-[13px] font-bold tracking-wide tabular-nums">{formattedTime}</span>
        </div>
        </div>
      </div>
      
      {/* Search and Profile Section */}
      <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto justify-end">
        
        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          
          {/* Notification Bell */}
          <Link to="/notifications" className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors group">
            <Bell size={24} strokeWidth={2} className="group-hover:animate-swing" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#489b0d] border-[2px] border-white text-white text-[9px] font-bold flex items-center justify-center rounded-full">
              6
            </span>
          </Link>
          
          <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>

          {/* Profile Dropdown */}
          <Link to="/profile" className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 shrink-0">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f8fafc" alt="Admin" className="w-full h-full object-cover mt-2" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[13px] font-bold text-slate-800 leading-tight">Admin User</p>
              <p className="text-[11px] font-medium text-slate-500 leading-tight mt-0.5">Super Admin</p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
