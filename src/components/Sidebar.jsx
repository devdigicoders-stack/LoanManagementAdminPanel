import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCog, ClipboardList, FileText, 
  CheckSquare, UserCheck, Activity, FileStack, Files, 
  FileCheck, FileQuestion, Bell, BarChart3, Shield, 
  MessageSquareWarning, Settings, History, User, Lock, 
  LogOut, ChevronRight, HelpCircle
} from 'lucide-react';

const navGroups = [
  {
    title: '',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/' }
    ]
  },
  {
    title: 'USER MANAGEMENT',
    items: [
      { name: 'Manage Users', icon: Users, path: '/users' },
      { name: 'Manage Employees', icon: UserCog, path: '/employees' }
    ]
  },
  {
    title: 'LEAD MANAGEMENT',
    items: [
      { name: 'Lead Management', icon: ClipboardList, path: '/leads' }
    ]
  },
  {
    title: 'LOAN MANAGEMENT',
    items: [
      { name: 'Loan Applications', icon: FileText, path: '/loans' },
      { name: 'Approve / Reject / Hold', icon: CheckSquare, path: '/loans/action' },
      { name: 'Assign Lead to Employee', icon: UserCheck, path: '/loans/assign' },
      { name: 'Status Management', icon: Activity, path: '/loans/status' }
    ]
  },
  {
    title: 'DOCUMENT MANAGEMENT',
    items: [
      { name: 'Documents', icon: FileStack, path: '/docs' },
      { name: 'View All Documents', icon: Files, path: '/docs/all' },
      { name: 'Verify Documents', icon: FileCheck, path: '/docs/verify' },
      { name: 'Request Additional Docs', icon: FileQuestion, path: '/docs/request' }
    ]
  },
  {
    title: 'COMMUNICATION & ALERTS',
    items: [
      { name: 'Notification Management', icon: Bell, path: '/notifications' }
    ]
  },
  {
    title: 'REPORTS & ANALYTICS',
    items: [
      { name: 'Reports & Analytics', icon: BarChart3, path: '/reports' }
    ]
  },
  {
    title: 'OTHER MANAGEMENT',
    items: [
      { name: 'Permission Management', icon: Shield, path: '/permissions' },
      { name: 'Manage Complaints', icon: MessageSquareWarning, path: '/complaints' }
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { name: 'Settings', icon: Settings, path: '/settings' },
      { name: 'Audit Logs', icon: History, path: '/audit' }
    ]
  },
  {
    title: 'MY ACCOUNT',
    items: [
      { name: 'My Profile', icon: User, path: '/profile' },
      { name: 'Change Password', icon: Lock, path: '/password' }
    ]
  }
];

export default function Sidebar() {
  return (
    <div className="w-[280px] h-screen bg-[#070B14] border-r border-[#1C2538] flex flex-col overflow-hidden shrink-0">
      
      {/* Header / Logo */}
      <div className="p-6 shrink-0 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#D2A054]/10 rounded-lg border border-[#D2A054] flex items-center justify-center transform rotate-45 shadow-sm shrink-0">
          <div className="w-5 h-5 bg-[#D2A054] transform -rotate-45" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#D2A054] leading-tight tracking-wide">LoanPro</h1>
          <p className="text-[11px] text-slate-400 font-medium tracking-wider">Admin Panel</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 scrollbar-hide">
        {navGroups.map((group, idx) => (
          <div key={idx} className={idx !== 0 ? "mt-6" : ""}>
            {group.title && (
              <h4 className="text-[10px] font-bold text-slate-500 mb-2 px-2 tracking-widest uppercase">
                {group.title}
              </h4>
            )}
            <ul className="space-y-1">
              {group.items.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                        isActive 
                          ? 'bg-[#D2A054]/10 text-[#D2A054] border border-[#D2A054]/20 shadow-sm' 
                          : 'text-slate-300 hover:bg-[#121824] hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className="opacity-80" />
                      <span>{item.name}</span>
                    </div>
                    {item.name !== 'Dashboard' && item.name !== 'Logout' && (
                      <ChevronRight size={14} className="opacity-40" />
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer Area */}
      <div className="p-4 shrink-0 border-t border-[#1C2538] bg-[#070B14]">
        <NavLink 
          to="/login" 
          className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl bg-[#121824] border border-[#1C2538] text-slate-300 hover:bg-[#ef4444] hover:text-white hover:border-[#ef4444] transition-all text-[13px] font-bold group shadow-sm"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Logout Securely</span>
        </NavLink>

        {/* <div className="mt-5 text-center">
          <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
            © 2025 LoanPro Admin<br/>All rights reserved.
          </p>
        </div> */}
      </div>
      
    </div>
  );
}
