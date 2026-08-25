import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Target, MapPin, CalendarCheck, FolderOpen,
  MessageSquare, Bell, BarChart3, User, Lock, LogOut,
  Menu, X, ChevronRight, FileText, PieChart
} from "lucide-react";

const navItems = [
  { name: "Dashboard",            icon: LayoutDashboard, path: "/agent" },
  { name: "My Leads",             icon: Target,          path: "/agent/leads" },
  { name: "Customer Visits",      icon: MapPin,          path: "/agent/visits" },
  { name: "My Follow-ups",        icon: CalendarCheck,   path: "/agent/followups" },
  { name: "Customer Documents",   icon: FolderOpen,      path: "/agent/documents" },
  { name: "Application Tracking", icon: FileText,        path: "/agent/applications" },
  { name: "Remarks & Notes",      icon: MessageSquare,   path: "/agent/remarks" },
  { name: "Reports",              icon: PieChart,        path: "/agent/reports" },
  { name: "Notifications",        icon: Bell,            path: "/agent/notifications" },
  { name: "My Performance",       icon: BarChart3,       path: "/agent/performance" },
  { name: "My Profile",           icon: User,            path: "/agent/profile" },
  { name: "Change Password",      icon: Lock,            path: "/agent/change-password" },
];

export default function AgentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const role    = localStorage.getItem("userRole") || "Sales Admin";
  const picKey  = `adminPic_${role}`;
  const nameKey = `adminName_${role}`;
  const adminPic  = localStorage.getItem(picKey)  || "https://api.dicebear.com/7.x/avataaars/svg?seed=Agent&backgroundColor=dff3ff";
  const adminName = localStorage.getItem(nameKey) || "Agent Operator";

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
        <div className="flex items-center justify-between px-5 py-5 shrink-0" style={{ borderBottom: "1px solid #D9EAF2" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#DFF3FF" }}>
              <span className="font-extrabold text-base" style={{ color: "#1e7ba8" }}>N</span>
            </div>
            <div>
              <p className="font-extrabold text-[14px] leading-tight" style={{ color: "#344054" }}>NGM Loans</p>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#8ED3F4" }}>Agent</p>
            </div>
          </div>
          <button className="lg:hidden p-1 rounded-md" style={{ color: "#667085" }} onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === "/agent"
              ? location.pathname === "/agent"
              : location.pathname.startsWith(item.path) && item.path !== "/agent";
            const active = item.path === "/agent"
              ? location.pathname === "/agent"
              : isActive;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                style={active
                  ? { background: "#DFF3FF", color: "#1e7ba8", border: "1px solid #BFE7F7" }
                  : { color: "#667085", border: "1px solid transparent" }
                }
              >
                <Icon size={17} strokeWidth={active ? 2.5 : 2} style={{ color: active ? "#1e7ba8" : "#8ED3F4", flexShrink: 0 }} />
                <span className="text-[13px] font-semibold truncate">{item.name}</span>
                {active && <ChevronRight size={14} className="ml-auto" style={{ color: "#8ED3F4" }} />}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5 shrink-0" style={{ borderTop: "1px solid #D9EAF2", paddingTop: "12px" }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200 hover:bg-red-50 group"
            style={{ color: "#ef4444" }}
          >
            <LogOut size={17} strokeWidth={2} />
            <span className="text-[13px] font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Header */}
        <header
          className="shrink-0 flex items-center justify-between px-5 py-3"
          style={{ background: "#FFFFFF", borderBottom: "1px solid #D9EAF2", zIndex: 10 }}
        >
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg"
              style={{ background: "#DFF3FF", color: "#1e7ba8" }}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-[14px] font-bold" style={{ color: "#344054" }}>
                {navItems.find(n =>
                  n.path === "/agent"
                    ? location.pathname === "/agent"
                    : location.pathname.startsWith(n.path) && n.path !== "/agent"
                )?.name || "Dashboard"}
              </h1>
              <p className="text-[11px] font-medium" style={{ color: "#667085" }}>Agent Operator · Sales</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NavLink to="/agent/notifications"
              className="relative p-2 rounded-xl transition-all"
              style={{ background: "#DFF3FF" }}
            >
              <Bell size={18} style={{ color: "#1e7ba8" }} />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ background: "#8ED3F4" }}>2</span>
            </NavLink>

            <NavLink to="/agent/profile" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2" style={{ borderColor: "#BFE7F7" }}>
                <img src={adminPic} alt="profile" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <p className="text-[12px] font-bold" style={{ color: "#344054" }}>{adminName}</p>
                <p className="text-[10px] font-medium" style={{ color: "#8ED3F4" }}>Agent Operator</p>
              </div>
            </NavLink>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
