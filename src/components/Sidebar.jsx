import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  User,
  Users,
  Target,
  FileText,
  UserCheck,
  FolderOpen,
  ShieldCheck,
  CheckCircle2,
  FilePlus,
  ClipboardList,
  Bell,
  BarChart3,
  Lock,
  MessageSquare,
  LogOut,
  Building2,
  CalendarRange,
  ListChecks,
  History,
  FileBadge,
  UserPlus,
  CircleDollarSign,
  MonitorSmartphone,
  AlertCircle,
  FileCheck,
  MapPin,
  CreditCard,
  Gavel,
  Landmark,
  CheckSquare,
  Wallet,
  XOctagon,
  PhoneCall,
  UserCog,
  Briefcase,
  UserX
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const [userRole, setUserRole] = useState('Super Admin');
  const [userSubRole, setUserSubRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'Super Admin';
    const subRole = localStorage.getItem('userSubRole') || '';
    setUserRole(role);
    setUserSubRole(subRole);
  }, []);

  const getNavGroups = () => {
    const allGroups = [
      {
        title: "",
        items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/" }],
        roles: ['Super Admin', 'Operation Admin', 'Sales Admin', 'Accountant Admin', 'Credit Admin']
      },
      {
        title: "CORE HR",
        items: [
          { name: "Dashboard", icon: LayoutDashboard, path: "/" },
          { name: "Employees Data", icon: Users, path: "/employees" },
          { name: "Recruit & Onboard", icon: UserPlus, path: "/hr/onboarding" },
        ],
        roles: ['HR Admin']
      },
      {
        title: "TIME & PAYROLL",
        items: [
          { name: "Attendance & Time", icon: ListChecks, path: "/employees/attendance" },
          { name: "Leave Management", icon: CalendarRange, path: "/employees/leave-management" },
          { name: "Payroll & Salary", icon: CircleDollarSign, path: "/hr/payroll" },
        ],
        roles: ['HR Admin']
      },
      {
        title: "PERFORMANCE & ANALYTICS",
        items: [
          { name: "Performance Mgmt", icon: Target, path: "/employees/performance" },
          { name: "Targets & Achiev", icon: Target, path: "/hr/targets" },
          { name: "Reports & Analytics", icon: BarChart3, path: "/hr/reports" },
        ],
        roles: ['HR Admin']
      },
      {
        title: "SELF SERVICE",
        items: [
          { name: "ESS Portal", icon: MonitorSmartphone, path: "/hr/ess" },
        ],
        roles: ['HR Admin']
      },
      {
        // title: "DASHBOARD",
        items: [
          // { name: "Common Dashboard", icon: LayoutDashboard, path: "/" },
        ],
        roles: ['Operation Admin', 'Ops Head', 'Ops Manager', 'Ops Executive', 'National Head', 'Founder']
      },
      {
        title: "LEAD & CRM",
        items: [
          { name: "All Leads", icon: Users, path: "/ops/leads" },
          { name: "Add Lead", icon: UserPlus, path: "/ops/leads/add" },
          { name: "Lead Assignment", icon: UserCog, path: "/ops/leads/assignment" },
          { name: "Follow-Ups", icon: CalendarRange, path: "/ops/leads/followups" },
          { name: "Lead Reports", icon: BarChart3, path: "/ops/leads/reports" },
        ],
        roles: ['Operation Admin', 'Ops Head', 'Ops Manager', 'Ops Executive', 'National Head']
      },
      {
        title: "LOAN ORIGINATION (LOS)",
        items: [
          { name: "Applications", icon: FileText, path: "/ops/los/applications" },
          { name: "Data Collection", icon: FolderOpen, path: "/ops/los/data" },
          { name: "Document Verification", icon: ShieldCheck, path: "/ops/los/verification" },
          { name: "Field Verification", icon: MapPin, path: "/ops/los/field-verification" },
          { name: "Credit Scoring", icon: CreditCard, path: "/ops/los/scoring" },
          { name: "Underwriting", icon: Briefcase, path: "/ops/los/underwriting" },
          { name: "Collateral / Security", icon: Lock, path: "/ops/los/collateral" },
          { name: "Approval", icon: CheckSquare, path: "/ops/los/approval" },
          { name: "Legal Documentation", icon: Gavel, path: "/ops/los/legal" },
          { name: "Disbursement", icon: Landmark, path: "/ops/los/disbursement" },
        ],
        roles: ['Operation Admin', 'Ops Head', 'Ops Manager', 'National Head']
      },
      {
        title: "LOAN SERVICING",
        items: [
          { name: "Active Loans", icon: CheckCircle2, path: "/ops/servicing/active" },
          { name: "EMI", icon: CircleDollarSign, path: "/ops/servicing/emi" },
          { name: "Part Payment", icon: Wallet, path: "/ops/servicing/part-payment" },
          { name: "Pre-Closure", icon: XOctagon, path: "/ops/servicing/closure" },
          { name: "Restructuring", icon: History, path: "/ops/servicing/restructuring" },
          { name: "NOC", icon: FileCheck, path: "/ops/servicing/noc" },
        ],
        roles: ['Operation Admin', 'Ops Head', 'Ops Manager', 'National Head']
      },
      {
        title: "COLLECTIONS",
        items: [
          { name: "Collection Dashboard", icon: LayoutDashboard, path: "/ops/collections" },
          { name: "Tele-Calling", icon: PhoneCall, path: "/ops/collections/tele-calling" },
          { name: "Field Recovery", icon: MapPin, path: "/ops/collections/field" },
          { name: "Notice", icon: Bell, path: "/ops/collections/notice" },
          { name: "Settlement", icon: UserCheck, path: "/ops/collections/settlement" },
          { name: "Legal Action", icon: Gavel, path: "/ops/collections/legal" },
        ],
        roles: ['Operation Admin', 'Ops Head', 'National Head']
      },
      {
        title: "REPORTS & ANALYTICS",
        items: [
          { name: "Portfolio", icon: BarChart3, path: "/ops/reports/portfolio" },
          { name: "Disbursement", icon: Landmark, path: "/ops/reports/disbursement" },
          { name: "Collection", icon: CircleDollarSign, path: "/ops/reports/collection" },
          { name: "NPA", icon: AlertCircle, path: "/ops/reports/npa" },
          { name: "Defaulters", icon: UserX, path: "/ops/reports/defaulters" },
          { name: "Performance", icon: Target, path: "/ops/reports/performance" },
        ],
        roles: ['Operation Admin', 'Ops Head', 'National Head', 'Founder']
      },
      {
        title: "HR EXECUTIVE",
        items: [
          { name: "Dashboard", icon: LayoutDashboard, path: "/" },
          { name: "Recruitment", icon: Users, path: "/hr/recruitment" },
          { name: "Onboarding", icon: UserPlus, path: "/hr/onboarding" },
          { name: "Attendance", icon: ListChecks, path: "/employees/attendance" },
        ],
        roles: ['HR Executive']
      },
      {
        title: "EMPLOYEE MANAGEMENT",
        items: [
          { name: "Manage Employees", icon: Users, path: "/employees" },
          { name: "Departments", icon: Building2, path: "/employees/departments" },
          { name: "Attendance", icon: ListChecks, path: "/employees/attendance" },
          { name: "Leave Management", icon: CalendarRange, path: "/employees/leave-management" },
          { name: "Activity Logs", icon: History, path: "/employees/activity" },
        ],
        roles: ['Super Admin']
      },
      {
        title: "HR REPORTS & ALERTS",
        items: [
          { name: "Reports & Analytics", icon: BarChart3, path: "/hr/reports" },
          { name: "Notifications", icon: Bell, path: "/hr/notifications" },
        ],
        roles: ['Super Admin']
      },
      {
        title: "LEAD & APPLICATION",
        items: [
          { name: "Lead Management", icon: Target, path: "/leads" },
          { name: "Loan Application", icon: FileText, path: "/loans" },
          { name: "View Documents", icon: FolderOpen, path: "/loans/documents" },
          { name: "Verify Documents", icon: ShieldCheck, path: "/verify-documents" },
        ],
        roles: ['Super Admin', 'Sales Admin']
      },
      {
        title: "ADMIN PANEL",
        items: [
          { name: "Manage Users", icon: UserCheck, path: "/users" },
          { name: "Application Decision", icon: CheckCircle2, path: "/application-decision" },
          { name: "Request Documents", icon: FilePlus, path: "/request-documents" },
          { name: "Assign Leads", icon: ClipboardList, path: "/leads/assignment" },
          { name: "Permission Management", icon: Lock, path: "/users/roles" },
          { name: "Manage Complaints", icon: MessageSquare, path: "/complaints" },
        ],
        roles: ['Super Admin', 'Credit Admin']
      },
      {
        title: "ACCOUNT",
        items: [
          { name: "My Profile", icon: User, path: "/profile" },
          { name: "Change Password", icon: Lock, path: "/change-password" },
          { name: "Logout", icon: LogOut, path: "/login", isDanger: true },
        ],
        roles: ['Super Admin', 'HR Admin', 'HR Executive', 'Operation Admin', 'Ops Head', 'Ops Manager', 'Ops Executive', 'Sales Admin', 'Accountant Admin', 'Credit Admin']
      }
    ];

    let filteredGroups = allGroups.filter(group => group.roles.includes(userRole));

    if (userRole === 'Sales Admin' && userSubRole === 'Tele callers operator') {
      filteredGroups = filteredGroups.map(g => {
        if (g.title === "LEAD & APPLICATION") {
          return { ...g, items: g.items.filter(i => i.name === 'Lead Management') };
        }
        return g;
      });
    }

    return filteredGroups;
  };

  const navGroups = getNavGroups();

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={`fixed lg:static inset-y-0 left-0 z-50 h-screen bg-[#F0FAFF] flex flex-col overflow-hidden shrink-0 transition-all duration-300 border-r border-[var(--color-brand-border)] ${isOpen ? 'w-[250px] translate-x-0' : 'w-[250px] -translate-x-full lg:w-[80px] lg:translate-x-0'}`}>
        
        <div className={`py-6 pb-4 shrink-0 flex items-center justify-center transition-all duration-300 bg-white ${isOpen ? 'px-6' : 'px-2'}`}>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[var(--color-brand-sky-light)] rounded-xl flex items-center justify-center shrink-0">
              <span className="text-[var(--color-brand-blue-dark)] font-extrabold text-xl">N</span>
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <span className="font-extrabold text-[var(--color-brand-text)] text-[16px] leading-tight">NGM Loans</span>
                <span className="text-[10px] font-bold text-[var(--color-brand-blue-dark)] uppercase tracking-wider">{userRole}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 no-scrollbar mt-4">
          {navGroups.map((group, idx) => (
            <div key={idx} className={group.title ? "mt-6" : "mt-2"}>
              {group.title && (
                <h3 className={`px-3 mb-2 text-[10px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${isOpen ? 'opacity-100' : 'opacity-0 w-0 h-0 overflow-hidden m-0 p-0'}`}>
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
                        onClick={() => {
                          if (window.innerWidth < 1024) setIsOpen && setIsOpen(false);
                        }}
                        title={!isOpen ? item.name : undefined}
                        className={`flex items-center px-3 py-2.5 rounded-[10px] transition-all duration-200 group ${
                          isOpen ? 'gap-3' : 'justify-center'
                        } ${
                          isActive
                            ? "bg-[var(--color-brand-sky-light)] text-[var(--color-brand-blue-dark)] shadow-sm border border-[var(--color-brand-border)]"
                            : "text-[var(--color-brand-text-secondary)] hover:bg-[var(--color-brand-sky-light)]/50 hover:text-[var(--color-brand-blue-dark)]"
                        }`}
                      >
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={`shrink-0 ${isActive ? "text-[var(--color-brand-blue-dark)]" : item.isDanger ? "text-red-500 group-hover:text-red-600" : "text-slate-400 group-hover:text-[var(--color-brand-blue-dark)]"}`}
                      />
                      <span
                        className={`text-[13px] font-semibold tracking-wide truncate transition-all duration-300 ${isOpen ? 'opacity-100 w-auto ml-1' : 'opacity-0 w-0 hidden'} ${isActive ? "text-[var(--color-brand-blue-dark)]" : item.isDanger ? "text-red-500 group-hover:text-red-600" : ""}`}
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
      </div>
    </>
  );
}
