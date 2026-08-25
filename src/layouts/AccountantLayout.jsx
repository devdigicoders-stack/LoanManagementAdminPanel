import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CreditCard, Banknote, List, Users,
  Receipt, RefreshCcw, FileMinus, CheckSquare, BarChart3,
  Bell, User, Lock, LogOut, Menu, X, ChevronRight, Calculator
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const navItems = [
  { name: "Dashboard",            icon: LayoutDashboard, path: "/accountant" },
  { name: "Payments & Coll.",     icon: CreditCard,      path: "/accountant/payments" },
  { name: "Record Payment",       icon: Calculator,      path: "/accountant/payments/add" },
  { name: "Transactions",         icon: List,            path: "/accountant/transactions" },
  { name: "Outstanding Payments", icon: Banknote,        path: "/accountant/outstanding" },
  { name: "Customers",            icon: Users,           path: "/accountant/customers" },
  { name: "Receipts",             icon: Receipt,         path: "/accountant/receipts" },
  { name: "Refunds",              icon: RefreshCcw,      path: "/accountant/refunds" },
  { name: "Expenses",             icon: FileMinus,       path: "/accountant/expenses" },
  { name: "Reconciliation",       icon: CheckSquare,     path: "/accountant/reconciliation" },
  { name: "Financial Reports",    icon: BarChart3,       path: "/accountant/reports" },
  { name: "Notifications",        icon: Bell,            path: "/accountant/notifications" },
  { name: "My Profile",           icon: User,            path: "/accountant/profile" },
  { name: "Change Password",      icon: Lock,            path: "/accountant/change-password" },
];

const tc = {
  bg: "#FAFCFD",
  card: "#FFFFFF",
  sky: "#DFF3FF",
  skyMid: "#BFE7F7",
  primary: "#8ED3F4",
  cream: "#FFF8E7",
  text: "#344054",
  muted: "#667085",
  border: "#D9EAF2",
  blue: "#1e7ba8",
};

export default function AccountantLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const name = localStorage.getItem(`adminName_${localStorage.getItem("userRole")}`) || "Accountant Admin";
  const pic = localStorage.getItem(`adminPic_${localStorage.getItem("userRole")}`) || "https://api.dicebear.com/7.x/avataaars/svg?seed=Accountant&backgroundColor=dff3ff";

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: tc.bg }}>
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-30 w-72 transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col`}
        style={{ background: tc.card, borderRight: `1px solid ${tc.border}` }}
        style={{ transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)', lg: { transform: 'none' }, background: tc.card, borderRight: `1px solid ${tc.border}` }}
      >
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-extrabold tracking-tight" style={{ color: tc.text }}>
              NGM <span style={{ color: tc.blue }}>Accounts</span>
            </h2>
            <p className="text-[11px] font-bold mt-0.5" style={{ color: tc.muted }}>Financial Management</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-xl" style={{ background: tc.sky, color: tc.blue }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/accountant' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all duration-200 group relative ${
                  isActive ? "shadow-sm" : "hover:bg-opacity-50"
                }`}
                style={{
                  background: isActive ? tc.sky : "transparent",
                  color: isActive ? tc.blue : tc.muted,
                }}
              >
                {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full" style={{ background: tc.blue }} />}
                <Icon size={18} className={isActive ? "" : "group-hover:scale-110 transition-transform"} style={{ color: isActive ? tc.blue : tc.muted }} />
                {item.name}
                {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
              </Link>
            );
          })}
        </div>

        <div className="p-4 m-4 rounded-2xl" style={{ background: tc.bg, border: `1px solid ${tc.border}` }}>
          <div className="flex items-center gap-3 mb-4">
            <img src={pic} alt="profile" className="w-10 h-10 rounded-xl bg-white shadow-sm" style={{ border: `1px solid ${tc.border}` }} />
            <div className="overflow-hidden">
              <p className="text-[13px] font-extrabold truncate" style={{ color: tc.text }}>{name}</p>
              <p className="text-[11px] font-semibold truncate" style={{ color: tc.blue }}>Accountant Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:bg-red-50 text-red-600"
            style={{ border: `1px solid #fee2e2` }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#FAFCFD]">
        
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b" style={{ borderColor: tc.border }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl" style={{ background: tc.sky, color: tc.blue }}>
              <Menu size={20} />
            </button>
            <h1 className="text-[16px] font-extrabold" style={{ color: tc.text }}>Accounts Panel</h1>
          </div>
          <img src={pic} alt="profile" className="w-8 h-8 rounded-lg" style={{ border: `1px solid ${tc.border}` }} />
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <Outlet />
        </div>

      </main>
    </div>
  );
}
