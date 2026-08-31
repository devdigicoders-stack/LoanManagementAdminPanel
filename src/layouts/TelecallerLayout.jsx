import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Target, Plus, CalendarCheck, FolderOpen,
  MessageSquare, Bell, BarChart3, Activity, User, Lock, LogOut,
  Menu, X, ChevronRight
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/telecaller" },
  { name: "My Leads", icon: Target, path: "/telecaller/leads" },
];

export default function TelecallerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const role    = localStorage.getItem("userRole") || "Sales Admin";
  const picKey  = `adminPic_${role}`;
  const nameKey = `adminName_${role}`;
  const adminPic  = localStorage.getItem(picKey)  || "https://api.dicebear.com/7.x/avataaars/svg?seed=TC&backgroundColor=dff3ff";
  const adminName = localStorage.getItem(nameKey) || "Telecaller";

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userSubRole");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "#FAFCFD", fontFamily: "'Inter', sans-serif" }}>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(52,64,84,0.4)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col h-full transition-all duration-300 overflow-hidden shrink-0 ${
          sidebarOpen ? "w-[240px] translate-x-0" : "w-[240px] -translate-x-full lg:translate-x-0 lg:w-[240px]"
        }`}
        style={{ background: "#FFFFFF", borderRight: "1px solid #D9EAF2", boxShadow: "2px 0 12px rgba(142,211,244,0.08)" }}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-6 shrink-0" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#8b5cf6]">
              <span className="font-extrabold text-lg text-white">N</span>
            </div>
            <div>
              <p className="font-extrabold text-[15px] leading-tight text-gray-900">NuoG Housing</p>
              <p className="text-[11px] font-medium text-gray-500">Telecaller Portal</p>
            </div>
          </div>
          <button className="lg:hidden p-1 rounded-md text-gray-500" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === "/telecaller"
              ? location.pathname === "/telecaller"
              : location.pathname.startsWith(item.path) && item.path !== "/telecaller";
            const active = item.path === "/telecaller"
              ? location.pathname === "/telecaller"
              : isActive;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  active 
                    ? "bg-purple-50 text-purple-700 font-bold" 
                    : "text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} className={active ? "text-purple-600" : "text-gray-400"} />
                <span className="text-[14px] truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-5 pb-6 shrink-0 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
               T
             </div>
             <div>
               <p className="font-bold text-[14px] text-gray-900">Telecaller</p>
               <p className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Telecaller</p>
             </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl w-full transition-all duration-200 bg-red-50 hover:bg-red-100 text-red-600 font-bold"
          >
            <LogOut size={16} strokeWidth={2.5} />
            <span className="text-[13px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Header - We can hide this entirely as the image doesn't show a top header, just a content area */}
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
