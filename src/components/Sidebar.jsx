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

  // Helper: check if permission is granted for current user
  const can = (permission) => {
    try {
      const stored = localStorage.getItem('permissions');
      if (stored) {
        const perms = JSON.parse(stored);
        if (Array.isArray(perms) && perms.length > 0) {
          return perms.includes(permission);
        }
      }
      return false;
    } catch { return false; }
  };

  const getNavGroups = () => {
    const isSuperAdmin = userRole === 'Super Admin';
    const isHR = userRole === 'HR Admin';

    // ── SUPER ADMIN: full role-based sidebar (unchanged) ────────────────────
    if (isSuperAdmin) {
      return [
        {
          title: "",
          items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/" }],
        },
        {
          title: "EMPLOYEE MANAGEMENT",
          items: [
            { name: "Departments", icon: Building2, path: "/employees/departments" },
            { name: "Manage Employees", icon: Users, path: "/employees" },
          ],
        },
        {
          title: "HR REPORTS & ALERTS",
          items: [
            { name: "Reports & Analytics", icon: BarChart3, path: "/hr/reports" },
          ],
        },
        {
          title: "LEAD & APPLICATION",
          items: [
            { name: "Lead Management", icon: Target, path: "/leads" },
            { name: "Loan Application", icon: FileText, path: "/loans" },
          ],
        },
        {
          title: "ADMIN PANEL",
          items: [
            { name: "Manage Users", icon: UserCheck, path: "/users" },
            { name: "Permission Management", icon: Lock, path: "/users/roles" },
            { name: "Manage Complaints", icon: MessageSquare, path: "/complaints" },
            { name: "Notifications", icon: Bell, path: "/notifications" },
          ],
        },
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

    // ── HR: fixed sidebar bypassing permissions ──────────────────────────────
    if (isHR) {
      return [
        { title: "", items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/" }] },
        {
          title: "EMPLOYEE MANAGEMENT",
          items: [
            { name: "Manage Employees", icon: Users, path: "/employees" },
          ],
        },
        {
          title: "CORE HR",
          items: [
            { name: "Recruitment", icon: Users, path: "/hr/recruitment" },
            { name: "Onboarding", icon: UserPlus, path: "/hr/onboarding" },
            { name: "Attendance", icon: ListChecks, path: "/employees/attendance" },
            { name: "Leave Management", icon: CalendarRange, path: "/employees/leave-management" },
          ],
        },
        {
          title: "REPORTS & ANALYTICS",
          items: [
            { name: "Reports & Analytics", icon: BarChart3, path: "/hr/reports" },
            { name: "Payroll & Salary", icon: CircleDollarSign, path: "/hr/payroll" },
            { name: "Notifications", icon: Bell, path: "/notifications" },
          ],
        },
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

    // ── ALL OTHER ROLES: permission-based sidebar ───────────────────────────
    // Each permission granted by SuperAdmin maps to exactly these sidebar items.
    // Dashboard + Account always visible regardless of permissions.

    // Build sidebar items dynamically based on granted permissions
    const items = {
      // USER MANAGEMENT
      manageUsers:        can('Manage Users'),
      manageEmployees:    can('Manage Employees'),
      rolePermissions:    can('Role & Permission Management'),

      // LEAD MANAGEMENT
      leadManagement:     can('Lead Management'),
      assignLead:         can('Assign Lead to Employee'),
      statusMgmt:         can('Status Management'),

      // LOAN MANAGEMENT
      viewLoans:          can('View Loan Applications'),
      approveLoans:       can('Approve/Reject/Hold Loan'),
      verifyDocs:         can('Verify Documents'),
      downloadDocs:       can('Download Documents'),

      // REPORTS & ANALYTICS
      viewReports:        can('View Reports'),
      exportData:         can('Export Data'),
      payroll:            can('Payroll/Salary'),
      sendReminders:      can('Send Reminders/SMS'),

      // HR MANAGEMENT
      manageLeaves:       can('Manage Leaves'),
      attendanceMgmt:     can('Manage Attendance'),
      recruitment:        can('Recruitment'),
      onboarding:         can('Onboarding'),
    };

    // Group: USER MANAGEMENT PANEL
    const userMgmtItems = [
      ...(items.manageUsers      ? [{ name: "Manage Users",          icon: UserCheck,       path: "/users" }]         : []),
      ...(items.manageEmployees  ? [{ name: "Departments",            icon: Building2,       path: "/employees/departments" }] : []),
      ...(items.manageEmployees  ? [{ name: "Manage Employees",       icon: Users,           path: "/employees" }]     : []),
      ...(items.rolePermissions  ? [{ name: "Permission Management",  icon: Lock,            path: "/users/roles" }]   : []),
    ];

    // Group: LEAD MANAGEMENT
    const leadItems = [
      ...(items.leadManagement || items.assignLead || items.statusMgmt
        ? [{ name: "Lead Management", icon: Target, path: "/leads" }]
        : []),
    ];

    // Group: LOAN MANAGEMENT
    const loanItems = [
      ...(items.viewLoans || items.approveLoans || items.verifyDocs || items.downloadDocs
        ? [{ name: "Loan Applications", icon: FileText, path: "/loans" }]
        : []),
    ];

    // Group: REPORTS & PAYROLL
    const reportItems = [
      ...(items.viewReports || items.exportData  ? [{ name: "Reports & Analytics", icon: BarChart3,         path: "/hr/reports" }]  : []),
      ...(items.payroll                          ? [{ name: "Payroll & Salary",     icon: CircleDollarSign, path: "/hr/payroll" }]  : []),
      ...(items.sendReminders || items.viewReports ? [{ name: "Notifications",      icon: Bell,             path: "/notifications" }]: []),
    ];

    // Group: HR & EMPLOYEES
    const hrItems = [
      ...(items.recruitment                      ? [{ name: "Recruitment",          icon: Users,            path: "/hr/recruitment" }] : []),
      ...(items.onboarding                       ? [{ name: "Onboarding",           icon: UserPlus,         path: "/hr/onboarding" }]  : []),
      ...(items.attendanceMgmt                   ? [{ name: "Attendance",           icon: ListChecks,       path: "/employees/attendance" }] : []),
      ...(items.manageLeaves                     ? [{ name: "Leave Management",     icon: CalendarRange,    path: "/employees/leave-management" }] : []),
    ];

    const groups = [
      // Dashboard — always
      { title: "", items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/" }] },

      // User Management
      ...(userMgmtItems.length > 0 ? [{ title: "USER MANAGEMENT", items: userMgmtItems }] : []),

      // Lead
      ...(leadItems.length > 0 ? [{ title: "LEAD MANAGEMENT", items: leadItems }] : []),

      // Loan
      ...(loanItems.length > 0 ? [{ title: "LOAN MANAGEMENT", items: loanItems }] : []),

      // HR & Employees
      ...(hrItems.length > 0 ? [{ title: "CORE HR", items: hrItems }] : []),

      // Reports / Payroll / Notifications
      ...(reportItems.length > 0 ? [{ title: "REPORTS & ANALYTICS", items: reportItems }] : []),

      // Account — always
      {
        title: "ACCOUNT",
        items: [
          { name: "My Profile",       icon: User,   path: "/profile" },
          { name: "Change Password",  icon: Lock,   path: "/change-password" },
          { name: "Logout",           icon: LogOut, path: "/login", isDanger: true },
        ],
      },
    ];

    return groups;
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

      <div className={`fixed lg:static inset-y-0 left-0 z-50 h-screen bg-[var(--color-brand-sky-pale)] flex flex-col overflow-hidden shrink-0 transition-all duration-300 border-r border-[var(--color-brand-border)] ${isOpen ? 'w-[250px] translate-x-0' : 'w-[250px] -translate-x-full lg:w-[80px] lg:translate-x-0'}`}>

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
                      className={`flex items-center px-3 py-2.5 rounded-[10px] transition-all duration-200 group ${isOpen ? 'gap-3' : 'justify-center'
                        } ${isActive
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
