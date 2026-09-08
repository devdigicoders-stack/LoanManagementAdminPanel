import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import {
  LayoutDashboard,
  User,
  Users,
  Target,
  FileText,
  UserCheck,
  FolderOpen,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Bell,
  BarChart3,
  Lock,
  MessageSquare,
  LogOut,
  Building2,
  CalendarRange,
  ListChecks,
  UserPlus,
  CircleDollarSign,
  AlertCircle,
  FileCheck,
  MapPin,
  CreditCard,
  PhoneCall,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { hasPermission, syncPermissionsWithServer, getPermissions } from "../utils/permissions";

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const [userRole, setUserRole] = useState('Super Admin');
  const [userSubRole, setUserSubRole] = useState('');
  const [permissions, setPermissions] = useState(() => getPermissions());

  // Collapsible dropdowns state
  const [openDropdowns, setOpenDropdowns] = useState({
    "Loan Management": true,
    "Telecaller Portal": false,
    "Field Agent Portal": false,
    "Operations Portal": false,
    "HR Management Portal": false,
    "Accountant Portal": false,
    "Credit Admin Portal": false
  });

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'Super Admin';
    const subRole = localStorage.getItem('userSubRole') || '';
    setUserRole(role);
    setUserSubRole(subRole);

    if (role === 'Super Admin') return;

    const doSync = () => {
      syncPermissionsWithServer().then((latest) => {
        if (latest) setPermissions(latest);
      });
    };

    doSync();

    const onPermsUpdated = (e) => {
      if (e?.detail) {
        setPermissions(e.detail);
      } else {
        setPermissions(getPermissions());
      }
    };
    window.addEventListener('permissionsUpdated', onPermsUpdated);
    window.addEventListener('storage', onPermsUpdated);
    window.addEventListener('focus', doSync);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') doSync();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const interval = setInterval(doSync, 10000);

    return () => {
      window.removeEventListener('permissionsUpdated', onPermsUpdated);
      window.removeEventListener('storage', onPermsUpdated);
      window.removeEventListener('focus', doSync);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  const toggleDropdown = (name) => {
    if (!isOpen && setIsOpen) {
      setIsOpen(true);
    }
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const getNavGroups = () => {
    const isSuperAdmin = ['super admin', 'superadmin'].includes(userRole.toLowerCase());
    const isAdmin = ['admin', 'administrator'].includes(userRole.toLowerCase());
    
    // Only Super Admin should bypass permissions automatically. 
    // Admins should follow their explicitly assigned permissions.
    const isMaster = isSuperAdmin; 

    // Helper to filter subitems for Admin
    const filterSubs = (subs) => {
      if (isSuperAdmin) return subs;
      return subs.filter(s => hasPermission(s.name));
    };

    // ── MASTER ADMIN / SUPER ADMIN / CUSTOM ADMIN NAVIGATION ─────────
    if (isMaster || isAdmin) {
      const portalItems = [
        ...(isMaster || hasPermission('Loan Applications') || hasPermission('Loan Management') ? [{ name: "Loan Management", icon: FileText, path: "/loans", badge: "Loans" }] : []),
        ...(isMaster || hasPermission('Offer Management') || hasPermission('Loan Management') ? [{ name: "Offer Management", icon: CircleDollarSign, path: "/offers", badge: "Offers" }] : []),
        ...(isMaster || hasPermission('Lead Management') ? [{ name: "Lead Management", icon: Target, path: "/leads", badge: "Leads" }] : []),
        ...(isMaster || hasPermission('Telecaller Portal') ? [{ name: "Telecaller Portal", icon: PhoneCall, path: "/telecaller", badge: "Calling" }] : []),
        ...(isMaster || hasPermission('Field Agent Portal') ? [{ name: "Field Agent Portal", icon: MapPin, path: "/agent", badge: "Field" }] : []),
        ...(isMaster || hasPermission('Operations Portal') || hasPermission('Operation Dashboard') ? [{ name: "Operations & LOS", icon: ShieldAlert, path: "/operations/dashboard", badge: "LOS" }] : []),
        ...(isMaster || hasPermission('Manage Employees') || hasPermission('Departments') ? [{ name: "Manage Employees", icon: Users, path: "/employees", badge: "HR" }] : []),
        ...(isMaster || hasPermission('Accountant Portal') ? [{ name: "Accountant & Finance", icon: CreditCard, path: "/accountant", badge: "Finance" }] : []),
      ];

      const adminItems = [
        ...(isMaster || hasPermission('Offer Management') ? [{ name: "Manage Offers", icon: CircleDollarSign, path: "/offers" }] : []),
        ...(isMaster || hasPermission('Manage Users') ? [{ name: "Manage Users", icon: UserCheck, path: "/users" }] : []),
        ...(isMaster || hasPermission('Permission Management') || hasPermission('Role & Permission Management') ? [{ name: "Permission Management", icon: Lock, path: "/users/roles" }] : []),
        ...(isMaster || hasPermission('Reports & Analytics') ? [{ name: "Reports & Analytics", icon: BarChart3, path: "/hr/reports" }] : []),
        ...(isMaster || hasPermission('Manage Complaints') ? [{ name: "Manage Complaints", icon: MessageSquare, path: "/complaints" }] : []),
        ...(isMaster || hasPermission('Notifications') ? [{ name: "Notifications", icon: Bell, path: "/notifications" }] : []),
      ];

      return [
        {
          title: "",
          items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/" }],
        },
        ...(portalItems.length > 0 ? [{ title: "PORTALS & WORKFLOWS", items: portalItems }] : []),
        ...(adminItems.length > 0 ? [{ title: "ADMIN & CONTROLS", items: adminItems }] : []),
        {
          title: "ACCOUNT",
          items: [
            { name: "My Profile", icon: User, path: "/profile" },
            { name: "Change Password", icon: Lock, path: "/change-password" },
            { name: "Logout", icon: LogOut, path: "/login", isDanger: true },
          ],
        },
      ];
    }

    // ── SUB-ROLE USERS (Telecaller, Agent, HR, Accountant pure roles) ─────────
    const items = {
      // HR
      departments: hasPermission('Departments'),
      manageEmployees: hasPermission('Manage Employees'),
      recruitment: hasPermission('Recruitment'),
      onboarding: hasPermission('Onboarding'),
      attendance: hasPermission('Attendance'),
      leaveManagement: hasPermission('Leave Management'),
      payroll: hasPermission('Payroll & Salary'),

      // Sales & Calling
      leadManagement: hasPermission('Lead Management'),
      assignedLeads: hasPermission('Assigned Leads'),
      customerFollowups: hasPermission('Customer Follow-ups') || hasPermission('My Followups'),
      telecallerPortal: hasPermission('Telecaller Portal'),
      fieldAgentPortal: hasPermission('Field Agent Portal'),

      // Loan
      loanApplications: hasPermission('Loan Applications') || hasPermission('Loan Application'),
      approveRejectLoans: hasPermission('Approve / Reject Loans'),
      documentVerification: hasPermission('Document Verification') || hasPermission('Document Center'),
      activeLoans: hasPermission('Active Loans'),
      repaymentSchedule: hasPermission('Repayment Schedule'),
      emiCollections: hasPermission('EMI Collections'),
      overdueLoans: hasPermission('Overdue Loans'),
      appVerification: hasPermission('Application Verification'),
      followUps: hasPermission('Follow-Up Management'),

      // Finance
      accountantPortal: hasPermission('Accountant Portal'),

      // Admin & Controls
      manageUsers: hasPermission('Manage Users'),
      rolePermissions: hasPermission('Permission Management') || hasPermission('Role & Permission Management'),
      manageComplaints: hasPermission('Manage Complaints'),
      reports: hasPermission('Reports & Analytics'),
      notifications: hasPermission('Notifications'),
    };

    const hrItems = [
      ...(items.departments ? [{ name: "Departments", icon: Building2, path: "/employees/departments" }] : []),
      ...(items.manageEmployees ? [{ name: "Manage Employees", icon: Users, path: "/employees" }] : []),
      ...(items.recruitment ? [{ name: "Recruitment", icon: Users, path: "/hr/recruitment" }] : []),
      ...(items.onboarding ? [{ name: "Onboarding", icon: UserPlus, path: "/hr/onboarding" }] : []),
      ...(items.attendance ? [{ name: "Attendance", icon: ListChecks, path: "/employees/attendance" }] : []),
      ...(items.leaveManagement ? [{ name: "Leave Management", icon: CalendarRange, path: "/employees/leave-management" }] : []),
      ...(items.payroll ? [{ name: "Payroll & Salary", icon: CircleDollarSign, path: "/hr/payroll" }] : []),
    ];

    const leadItems = [
      ...(items.leadManagement ? [{ name: "Lead Management", icon: Target, path: "/leads" }] : []),
      ...(items.assignedLeads ? [{ name: "Assigned Leads", icon: FolderOpen, path: "/telecaller/assigned-leads" }] : []),
      ...(items.customerFollowups ? [{ name: "Customer Follow-ups", icon: CalendarRange, path: "/telecaller/followups" }] : []),
      ...(items.telecallerPortal ? [{ name: "Telecaller Portal", icon: PhoneCall, path: "/telecaller" }] : []),
      ...(items.fieldAgentPortal ? [{ name: "Field Agent Portal", icon: MapPin, path: "/agent" }] : []),
    ];

    const loanItems = [
      ...(items.loanApplications ? [{ name: "Loan Application", icon: FileText, path: "/loans" }] : []),
      ...(items.approveRejectLoans ? [{ name: "Approve / Reject Loans", icon: CheckCircle2, path: "/loans" }] : []),
      ...(items.documentVerification ? [{ name: "Document Center", icon: FileCheck, path: "/loans/documents" }] : []),
      ...(items.activeLoans ? [{ name: "Active Loans", icon: FileText, path: "/loans/active" }] : []),
      ...(items.repaymentSchedule ? [{ name: "Repayment Schedule", icon: CalendarRange, path: "/loans/repayments" }] : []),
      ...(items.emiCollections ? [{ name: "EMI Collections", icon: CircleDollarSign, path: "/loans/collections" }] : []),
      ...(items.overdueLoans ? [{ name: "Overdue Loans", icon: AlertCircle, path: "/loans/overdue" }] : []),
      ...(items.appVerification ? [{ name: "Application Verification", icon: ShieldCheck, path: "/operations/verification" }] : []),
      ...(items.followUps ? [{ name: "Follow-Up Management", icon: ListChecks, path: "/operations/follow-ups" }] : []),
    ];

    const financeItems = [
      ...(items.accountantPortal ? [{ name: "Accountant Portal", icon: CreditCard, path: "/accountant" }] : []),
    ];

    const adminItems = [
      ...(items.manageUsers ? [{ name: "Manage Users", icon: UserCheck, path: "/users" }] : []),
      ...(items.rolePermissions ? [{ name: "Permission Management", icon: Lock, path: "/users/roles" }] : []),
      ...(items.reports ? [{ name: "Reports & Analytics", icon: BarChart3, path: "/hr/reports" }] : []),
      ...(items.manageComplaints ? [{ name: "Manage Complaints", icon: MessageSquare, path: "/complaints" }] : []),
      ...(items.notifications ? [{ name: "Notifications", icon: Bell, path: "/notifications" }] : []),
    ];

    return [
      { title: "", items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/" }] },
      ...(hrItems.length > 0 ? [{ title: "EMPLOYEE & HR MANAGEMENT", items: hrItems }] : []),
      ...(leadItems.length > 0 ? [{ title: "LEAD & SALES MANAGEMENT", items: leadItems }] : []),
      ...(loanItems.length > 0 ? [{ title: "LOAN OPERATIONS & RECOVERY", items: loanItems }] : []),
      ...(financeItems.length > 0 ? [{ title: "ACCOUNTS & FINANCE", items: financeItems }] : []),
      ...(adminItems.length > 0 ? [{ title: "ADMIN & SYSTEM CONTROLS", items: adminItems }] : []),
      {
        title: "ACCOUNT",
        items: [
          { name: "My Profile", icon: User, path: "/profile" },
          { name: "Change Password", icon: Lock, path: "/change-password" },
          { name: "Logout", icon: LogOut, path: "/login", isDanger: true },
        ],
      },
    ];
  };

  const navGroups = getNavGroups();

  // Auto-expand dropdown if any child page is active
  useEffect(() => {
    const currentPath = location.pathname;
    navGroups.forEach(group => {
      group.items.forEach(item => {
        if (item.subItems && item.subItems.some(sub => sub.path === currentPath || (sub.path !== "/" && currentPath.startsWith(sub.path)))) {
          setOpenDropdowns(prev => ({ ...prev, [item.name]: true }));
        }
      });
    });
  }, [location.pathname]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`fixed lg:static inset-y-0 left-0 z-50 h-screen bg-[var(--color-brand-sky-pale)] flex flex-col overflow-hidden shrink-0 transition-all duration-300 border-r border-[var(--color-brand-border)] ${isOpen ? 'w-[260px] translate-x-0' : 'w-[260px] -translate-x-full lg:w-[80px] lg:translate-x-0'}`}>

        {/* Brand Header */}
        <div className={`py-5 pb-4 shrink-0 flex items-center justify-center transition-all duration-300 bg-white border-b border-slate-100 ${isOpen ? 'px-6' : 'px-2'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-[#489b0d] to-[#367509] rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-white font-extrabold text-xl">N</span>
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <span className="font-extrabold text-[var(--color-brand-text)] text-[16px] leading-tight">NUOG Housing</span>
                <span className="text-[10px] font-bold text-[#489b0d] uppercase tracking-wider">{userRole}</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3.5 pb-6 custom-scrollbar mt-3">
          {navGroups.map((group, idx) => (
            <div key={idx} className={group.title ? "mt-5" : "mt-1"}>
              {group.title && (
                <h3 className={`px-3 mb-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${isOpen ? 'opacity-100' : 'opacity-0 w-0 h-0 overflow-hidden m-0 p-0'}`}>
                  {group.title}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const hasSubItems = Array.isArray(item.subItems) && item.subItems.length > 0;

                  // ── DROPDOWN PARENT ITEM ───────────────────────────────────
                  if (hasSubItems) {
                    const isExpanded = !!openDropdowns[item.name];
                    const isAnyChildActive = item.subItems.some(
                      (sub) => location.pathname === sub.path || (sub.path !== "/" && location.pathname.startsWith(sub.path))
                    );

                    return (
                      <div key={itemIdx} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => toggleDropdown(item.name)}
                          title={!isOpen ? item.name : undefined}
                          className={`w-full flex items-center px-3 py-2.5 rounded-[10px] transition-all duration-200 group cursor-pointer ${
                            isOpen ? "justify-between" : "justify-center"
                          } ${
                            isAnyChildActive
                              ? "bg-[var(--color-brand-sky-light)] text-[var(--color-brand-blue-dark)] shadow-2xs border border-[var(--color-brand-border)] font-bold"
                              : "text-[var(--color-brand-text-secondary)] hover:bg-[var(--color-brand-sky-light)]/50 hover:text-[var(--color-brand-blue-dark)]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              size={18}
                              strokeWidth={isAnyChildActive ? 2.5 : 2}
                              className={`shrink-0 ${
                                isAnyChildActive
                                  ? "text-[var(--color-brand-blue-dark)]"
                                  : "text-slate-400 group-hover:text-[var(--color-brand-blue-dark)]"
                              }`}
                            />
                            {isOpen && (
                              <span className={`text-[13px] font-semibold tracking-wide truncate transition-all duration-300 ${
                                isAnyChildActive ? "text-[var(--color-brand-blue-dark)] font-bold" : ""
                              }`}>
                                {item.name}
                              </span>
                            )}
                          </div>

                          {isOpen && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              {item.badge && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100/70 text-blue-700 tracking-wider uppercase">
                                  {item.badge}
                                </span>
                              )}
                              {isExpanded ? (
                                <ChevronDown size={14} className="text-slate-400 transition-transform" />
                              ) : (
                                <ChevronRight size={14} className="text-slate-400 transition-transform" />
                              )}
                            </div>
                          )}
                        </button>

                        {/* Sub-items Drawer */}
                        {isOpen && isExpanded && (
                          <div className="pl-6 pr-1 py-1 space-y-0.5 border-l-2 border-slate-200/90 ml-4 my-1 animate-in fade-in duration-200">
                            {item.subItems.map((sub, sIdx) => {
                              const isSubActive =
                                location.pathname === sub.path ||
                                (sub.path !== "/" && location.pathname.startsWith(sub.path + "/"));

                              return (
                                <NavLink
                                  key={sIdx}
                                  to={sub.path}
                                  onClick={() => {
                                    if (window.innerWidth < 1024 && setIsOpen) setIsOpen(false);
                                  }}
                                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all group/sub ${
                                    isSubActive
                                      ? "bg-[var(--color-brand-sky-light)] text-[var(--color-brand-blue-dark)] font-bold shadow-2xs"
                                      : "text-slate-600 hover:text-[var(--color-brand-blue-dark)] hover:bg-[var(--color-brand-sky-light)]/40"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full transition-all shrink-0 ${
                                      isSubActive
                                        ? "bg-[var(--color-brand-blue-dark)] scale-125"
                                        : "bg-slate-300 group-hover/sub:bg-[var(--color-brand-blue-dark)]"
                                    }`}
                                  />
                                  <span className="truncate">{sub.name}</span>
                                </NavLink>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // ── REGULAR STANDALONE LINK ITEM ───────────────────────────
                  const isActive =
                    location.pathname === item.path ||
                    (location.pathname === "/" && item.path === "/");

                  return (
                    <NavLink
                      key={itemIdx}
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024 && setIsOpen) setIsOpen(false);
                      }}
                      title={!isOpen ? item.name : undefined}
                      className={`flex items-center px-3 py-2.5 rounded-[10px] transition-all duration-200 group ${
                        isOpen ? 'gap-3' : 'justify-center'
                      } ${
                        isActive
                          ? "bg-[var(--color-brand-sky-light)] text-[var(--color-brand-blue-dark)] shadow-sm border border-[var(--color-brand-border)] font-bold"
                          : "text-[var(--color-brand-text-secondary)] hover:bg-[var(--color-brand-sky-light)]/50 hover:text-[var(--color-brand-blue-dark)]"
                      }`}
                    >
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={`shrink-0 ${
                          isActive
                            ? "text-[var(--color-brand-blue-dark)]"
                            : item.isDanger
                            ? "text-red-500 group-hover:text-red-600"
                            : "text-slate-400 group-hover:text-[var(--color-brand-blue-dark)]"
                        }`}
                      />
                      <span
                        className={`text-[13px] font-semibold tracking-wide truncate transition-all duration-300 ${
                          isOpen ? 'opacity-100 w-auto ml-1' : 'opacity-0 w-0 hidden'
                        } ${
                          isActive
                            ? "text-[var(--color-brand-blue-dark)]"
                            : item.isDanger
                            ? "text-red-500 group-hover:text-red-600"
                            : ""
                        }`}
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

