import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  Activity,
  BarChart3,
  Settings,
  LogOut,
  AlertCircle
} from "lucide-react";

const navGroups = [
  {
    title: "",
    items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/" }],
  },
  {
    title: "EMPLOYEE MANAGEMENT",
    items: [
      { name: "Manage Employee", icon: UserCog, path: "/employees" },
    ],
  },
  {
    title: "USER MANAGEMENT",
    items: [
      { name: "Manage Users", icon: Users, path: "/users" },
    ],
  },
  {
    title: "LEAD MANAGEMENT",
    items: [
      { name: "Lead Management", icon: Activity, path: "/leads" },
    ],
  },
  {
    title: "LOAN MANAGEMENT",
    items: [
      { name: "Loan Application Management", icon: FileText, path: "/loans" },
    ],
  },
  {
    title: "SYSTEM & REPORTS",
    items: [
      { name: "Reports & Analytics", icon: BarChart3, path: "/reports" },
      { name: "Manage Complaints", icon: AlertCircle, path: "/complaints" },
      { name: "Settings", icon: Settings, path: "/settings" },
    ],
  },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar Content */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] h-screen bg-white border-r border-slate-200 flex flex-col overflow-hidden shrink-0 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      {/* Header / Logo */}
      <div className="p-6 pb-2 shrink-0 flex items-center justify-center">
        <img
          src="/loanlogo.png"
          alt="NGM Logo"
          className="h-[60px] object-contain"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 no-scrollbar">
        {navGroups.map((group, idx) => (
          <div key={idx} className={group.title ? "mt-6" : "mt-2"}>
            {group.title && (
              <h3 className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {group.title}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (location.pathname === "/" && item.path === "/");

                return (
                  <NavLink
                    key={itemIdx}
                    to={item.path}
                    onClick={() => setIsOpen && setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group ${
                      isActive
                        ? "bg-[#489b0d] text-white shadow-md shadow-[#489b0d]/20"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#489b0d]"
                    }`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={`shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-[#489b0d]"}`}
                    />
                    <span
                      className={`text-[13px] font-semibold tracking-wide truncate ${isActive ? "text-white" : ""}`}
                    >
                      {item.name}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions & Copyright */}
      <div className="p-4 shrink-0 bg-white border-t border-slate-100">
        {/* Logout Button */}
        <NavLink
          to="/login"
          className="w-full flex items-center justify-center gap-2 py-2.5 mb-4 bg-red-50 hover:bg-red-100 text-red-600 text-[13px] font-bold rounded-md transition-colors border border-red-100"
        >
          <LogOut size={16} strokeWidth={2.5} />
          Logout
        </NavLink>
      </div>
    </div>
    </>
  );
}
