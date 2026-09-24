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
  CalendarCheck,
  ListChecks,
  UserPlus,
  CircleDollarSign,
  AlertCircle,
  AlertTriangle,
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
    const rawRole = (userRole || '').trim().toLowerCase();
    const cleanRole = rawRole.replace(/[^a-z0-9]/g, '');

    const isSuperAdmin = ['superadmin', 'super_admin'].includes(cleanRole) || rawRole === 'super admin';
    const isAdmin = ['admin', 'administrator'].includes(cleanRole) || rawRole === 'admin';
    const isHrHead = ['hrhead', 'hr_head'].includes(cleanRole) || rawRole.includes('hr head');
    const isHrManager = ['hrmanager', 'hr_manager'].includes(cleanRole) || rawRole.includes('hr manager');
    const isHrExecutive = ['hrexecutive', 'hr_executive', 'hrexec', 'executive'].includes(cleanRole) || rawRole.includes('hr executive') || cleanRole.includes('executive');
    const isHrAdmin = ['hradmin', 'hr_admin'].includes(cleanRole) || rawRole.includes('hr admin');
    const isOps = ['operationadmin', 'operation_admin', 'operations', 'operation'].includes(cleanRole) || rawRole.includes('operation');
    const isSalesHead = cleanRole.includes('saleshead') || rawRole.includes('sales head');
    const isRrm = cleanRole === 'rrm' || rawRole.includes('rrm') || rawRole.includes('regional');
    const isArm = cleanRole === 'arm' || rawRole.includes('arm') || rawRole.includes('area');
    const isRm = cleanRole === 'rm' || rawRole.includes('reporting manager');
    const isRo = cleanRole === 'ro' || cleanRole === 're' || rawRole.includes('relationship officer') || rawRole.includes('relationship executive');
    const isTelecaller = cleanRole.includes('tele') || rawRole.includes('telecaller') || rawRole.includes('calling');

    // ── SUPER ADMIN & MASTER ADMIN ────────────────────────────────────
    if (isSuperAdmin || isAdmin) {
      const salesHeadItems = [
        { name: "Sales Dashboard", icon: ShieldAlert, path: "/sales/dashboard" },
        {
          name: "File Approvals",
          icon: ShieldCheck,
          path: "/sales/file-approvals",
          badge: "Approval",
          badgeColor: "bg-amber-100 text-amber-800 border border-amber-300 font-bold"
        },
        {
          name: "Bank Submissions",
          icon: Building2,
          path: "/sales/bank-submissions",
          badge: "5 Banks",
          badgeColor: "bg-sky-100 text-sky-800 border border-sky-300 font-bold"
        },
        {
          name: "Hold Cases",
          icon: AlertTriangle,
          path: "/sales/hold-escalations",
          badge: "Hold Alert",
          badgeColor: "bg-rose-100 text-rose-700 border border-rose-300 font-bold"
        },
        {
          name: "Request Staff Hiring",
          icon: UserPlus,
          path: "/sales/hiring-requests",
          badge: "HR",
          badgeColor: "bg-emerald-100 text-emerald-800 border border-emerald-300"
        },
      ];

      const coreItems = [
        { name: "Customers", icon: Users, path: "/customers", badge: "Borrowers" },
        { name: "All Leads", icon: Target, path: "/leads", badge: "Leads" },
        { name: "Loan Applications", icon: FileText, path: "/loans", badge: "All Views" },
        { name: "Disbursals & Finance", icon: CreditCard, path: "/accountant", badge: "Finance" },
      ];

      const hrItems = [
        { name: "Employee Directory", icon: Users, path: "/employees" },
        // { name: "Departments", icon: Building2, path: "/employees/departments" },
        { name: "Recruitment", icon: UserPlus, path: "/hr/recruitment" },
        { name: "Onboarding", icon: UserCheck, path: "/hr/onboarding" },
        { name: "Attendance", icon: ListChecks, path: "/employees/attendance" },
        { name: "Payroll & Salary", icon: CircleDollarSign, path: "/hr/payroll" },
      ];

      const adminItems = [
        { name: "Team & Staff", icon: UserCheck, path: "/users" },
        { name: "Roles & Permissions", icon: Lock, path: "/users/roles" },
        { name: "Reports & Analytics", icon: BarChart3, path: "/hr/reports" },
        { name: "Complaints Desk", icon: MessageSquare, path: "/complaints" },
        { name: "Announcements", icon: Bell, path: "/notifications" },
      ];

      return [
        {
          title: "",
          items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/" }],
        },
        { title: "SALES HEAD COMMAND", items: salesHeadItems },
        { title: "CORE WORKFLOWS", items: coreItems },
        { title: "HR & EMPLOYEES", items: hrItems },
        { title: "MANAGEMENT & CONTROLS", items: adminItems },
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

    // ── 1. RRM / REGIONAL REPORTING MANAGER / SALES HEAD ──────────────
    if (isSalesHead || isRrm) {
      const rrmCommandItems = [
        { name: "Sales Dashboard", icon: ShieldAlert, path: "/sales/dashboard" },
        {
          name: "File Approvals",
          icon: ShieldCheck,
          path: "/sales/file-approvals",
          badge: "Approval",
          badgeColor: "bg-amber-100 text-amber-800 border border-amber-300 font-bold"
        },
        {
          name: "Bank Submissions",
          icon: Building2,
          path: "/sales/bank-submissions",
          badge: "5 Banks",
          badgeColor: "bg-sky-100 text-sky-800 border border-sky-300 font-bold"
        },
        {
          name: "Hold Cases",
          icon: AlertTriangle,
          path: "/sales/hold-escalations",
          badge: "Hold Alert",
          badgeColor: "bg-rose-100 text-rose-700 border border-rose-300 font-bold"
        },
      ];

      const rrmPipelineItems = [
        { name: "All Regional Leads", icon: Target, path: "/leads", badge: "Leads" },
        { name: "Team Attendance", icon: ListChecks, path: "/employees/attendance" },
      ];

      const rrmHrItems = [
        {
          name: "Request Staff Hiring",
          icon: UserPlus,
          path: "/sales/hiring-requests",
          badge: "To HR",
          badgeColor: "bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold"
        },
        { name: "My Leaves", icon: CalendarCheck, path: "/employees/leave-management?tab=my-leaves" },
      ];

      return [
        { title: "ZONAL & BANK COMMAND", items: rrmCommandItems },
        { title: "PIPELINE & ZONAL TEAM", items: rrmPipelineItems },
        { title: "HR & HIRING DEMAND", items: rrmHrItems },
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

    // ── 2. ARM / AREA REPORTING MANAGER ──────────────────────────────
    if (isArm) {
      const armCommandItems = [
        { name: "Area Dashboard", icon: ShieldAlert, path: "/sales/arm-dashboard" },
        {
          name: "Hold Cases Radar",
          icon: AlertTriangle,
          path: "/sales/hold-escalations",
          badge: "Hold Alert",
          badgeColor: "bg-rose-100 text-rose-700 border border-rose-300 font-bold"
        },
        {
          name: "Bank Submissions",
          icon: Building2,
          path: "/sales/bank-submissions",
          badge: "View Only",
          badgeColor: "bg-slate-100 text-slate-700 border border-slate-300 font-bold"
        },
      ];

      const armPipelineItems = [
        { name: "Area Leads", icon: Target, path: "/leads", badge: "Live" },
        { name: "Team Attendance", icon: ListChecks, path: "/employees/attendance" },
      ];

      const armHrItems = [
        {
          name: "Request Team Hiring",
          icon: UserPlus,
          path: "/sales/hiring-requests",
          badge: "Demand",
          badgeColor: "bg-indigo-100 text-indigo-800 border border-indigo-300 font-bold"
        },
        { name: "My Leaves", icon: CalendarCheck, path: "/employees/leave-management?tab=my-leaves" },
      ];

      return [
        { title: "AREA COMMAND & SUPERVISION", items: armCommandItems },
        { title: "AREA PIPELINE & TEAMS", items: armPipelineItems },
        { title: "STAFFING & LEAVES", items: armHrItems },
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

    // ── 3. RM / REPORTING MANAGER ────────────────────────────────────
    if (isRm) {
      const rmReviewItems = [
        { name: "RM Dashboard", icon: LayoutDashboard, path: "/sales/rm-dashboard" },
        {
          name: "Lead Review Desk",
          icon: Target,
          path: "/sales/rm-lead-review",
          badge: "Review",
          badgeColor: "bg-blue-100 text-blue-800 border border-blue-300 font-bold"
        },
        {
          name: "Hold Escalation Radar",
          icon: AlertTriangle,
          path: "/sales/hold-escalations",
          badge: "HOLD",
          badgeColor: "bg-rose-100 text-rose-700 border border-rose-300 font-bold"
        },
      ];

      const rmWorkItems = [
        {
          name: "Telecaller Follow-ups",
          icon: PhoneCall,
          path: "/sales/rm-telecaller-desk",
          badge: "Calling",
          badgeColor: "bg-amber-100 text-amber-800 border border-amber-300 font-bold"
        },
        { name: "Team Attendance", icon: ListChecks, path: "/employees/attendance" },
      ];

      const rmAccountItems = [
        { name: "My Leaves", icon: CalendarCheck, path: "/employees/leave-management?tab=my-leaves" },
      ];

      return [
        { title: "RM COMMAND CENTER", items: rmReviewItems },
        { title: "TELECALLER & FIELD DESK", items: rmWorkItems },
        { title: "MY ATTENDANCE", items: rmAccountItems },
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

    // ── 4. TELECALLER PORTAL (Strict Clean Single-Window Workflow) ──────────
    if (isTelecaller) {
      const telecallerCoreItems = [
        { 
          name: "Telecaller Calling Desk", 
          icon: PhoneCall, 
          path: "/telecaller",
          badge: "Live Desk",
          badgeColor: "bg-purple-100 text-purple-800 border border-purple-300 font-bold"
        },
        {
          name: "Call Follow-ups",
          icon: CalendarRange,
          path: "/telecaller/followups",
        },
        { 
          name: "Customer Documents", 
          icon: FileCheck, 
          path: "/telecaller/documents" 
        },
      ];

      const telecallerAccountItems = [
        { name: "My Attendance", icon: ListChecks, path: "/employees/attendance" },
        { name: "My Leaves", icon: CalendarCheck, path: "/employees/leave-management?tab=my-leaves" },
        { name: "My Performance", icon: BarChart3, path: "/telecaller/my-performance" },
      ];

      return [
        { title: "TELECALLER WORKSPACE", items: telecallerCoreItems },
        { title: "MY ATTENDANCE & HR", items: telecallerAccountItems },
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

    // ── HR ROLES (HR Head, HR Manager, HR Executive, HR Admin) ─────────
    if (isHrHead || isHrManager || isHrExecutive || isHrAdmin) {
      const hrWorkflowItems = [
        ...(hasPermission('Manage Employees')
          ? [{ name: "Employee Directory", icon: Users, path: "/employees" }] : []),
        // ...(hasPermission('Departments')
        //   ? [{ name: "Departments", icon: Building2, path: "/employees/departments" }] : []),
        ...(hasPermission('Recruitment')
          ? [{ name: "Recruitment & Jobs", icon: Users, path: "/hr/recruitment" }] : []),
        ...(hasPermission('Onboarding')
          ? [{ name: "Onboarding", icon: UserPlus, path: "/hr/onboarding" }] : []),
        ...(hasPermission('Attendance')
          ? [{ name: "Attendance", icon: ListChecks, path: "/employees/attendance" }] : []),
        ...(hasPermission('Leave Management') || hasPermission('My Leaves')
          ? [
              { name: "My Leaves", icon: CalendarCheck, path: "/employees/leave-management?tab=my-leaves" }
            ] : []),
        ...(hasPermission('Payroll & Salary')
          ? [{ name: "Payroll & Salary", icon: CircleDollarSign, path: "/hr/payroll" }] : []),
      ];

      const canManagePermissions = !isHrExecutive && (isHrHead || isHrManager || isAdmin || isSuperAdmin);

      const hrManagementItems = [
        ...(!isHrExecutive && (hasPermission('Team & Staff') || hasPermission('Manage Users'))
          ? [{ name: "Team & Staff", icon: UserCheck, path: "/users" }] : []),
        ...(canManagePermissions && (hasPermission('Permission Management') || hasPermission('Role & Permission Management') || isHrHead || isHrManager)
          ? [
            { name: "HR Permissions", icon: ShieldCheck, path: "/users/hr-permissions" }
          ] : []),
        ...(hasPermission('Reports & Analytics')
          ? [{ name: isHrExecutive ? "My Activity Report" : "HR Reports & Analytics", icon: BarChart3, path: "/hr/reports" }] : []),
        ...(hasPermission('Notifications')
          ? [{ name: "Announcements", icon: Bell, path: "/notifications" }] : []),
      ];

      return [
        {
          title: "",
          items: [{ name: "HR Dashboard", icon: LayoutDashboard, path: "/" }],
        },
        ...(hrWorkflowItems.length > 0 ? [{ title: "HR WORKFLOWS", items: hrWorkflowItems }] : []),
        ...(hrManagementItems.length > 0 ? [{ title: "MANAGEMENT & TEAM", items: hrManagementItems }] : []),
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

    // ── OPERATIONS ADMIN / OPERATION MANAGER ─────────────────────────
    if (isOps) {
      const opsItems = [
        { 
          name: "Operations Dashboard", 
          icon: LayoutDashboard, 
          path: "/operations/dashboard",
          badge: "All Zones",
          badgeColor: "bg-sky-100 text-sky-800 border border-sky-300 font-bold"
        },
        { 
          name: "Verify & Forward Desk", 
          icon: ShieldCheck, 
          path: "/operations/verification",
          badge: "21 Lenders",
          badgeColor: "bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold"
        },
        { 
          name: "Bank Submissions & Tracking", 
          icon: Building2, 
          path: "/sales/bank-submissions",
          badge: "Live Status",
          badgeColor: "bg-amber-100 text-amber-800 border border-amber-300 font-bold"
        },
      ];

      return [
        {
          title: "OPERATIONS COMMAND",
          items: opsItems,
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

    // ── SUB-ROLE USERS & DYNAMIC RBAC FALLBACK ─────────────────────────
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
      ...(items.manageEmployees ? [{ name: "Employees", icon: Users, path: "/employees" }] : []),
      ...(items.recruitment ? [{ name: "Recruitment", icon: Users, path: "/hr/recruitment" }] : []),
      ...(items.onboarding ? [{ name: "Onboarding", icon: UserPlus, path: "/hr/onboarding" }] : []),
      ...(items.attendance ? [{ name: "Attendance", icon: ListChecks, path: "/employees/attendance" }] : []),
      ...(items.leaveManagement ? [{ name: "My Leaves", icon: CalendarCheck, path: "/employees/leave-management?tab=my-leaves" }] : []),
      ...(items.payroll ? [{ name: "Payroll & Salary", icon: CircleDollarSign, path: "/hr/payroll" }] : []),
    ];

    const leadItems = [
      ...(items.leadManagement ? [{ name: "All Leads", icon: Target, path: "/leads" }] : []),
      ...(items.assignedLeads ? [{ name: "My Assigned Leads", icon: FolderOpen, path: "/telecaller/assigned-leads" }] : []),
      ...(items.customerFollowups ? [{ name: "Follow-ups", icon: CalendarRange, path: "/telecaller/followups" }] : []),
      ...(items.telecallerPortal ? [{ name: "Telecaller Calling", icon: PhoneCall, path: "/telecaller" }] : []),
      ...(items.fieldAgentPortal ? [{ name: "Field Agent Area", icon: MapPin, path: "/agent" }] : []),
    ];

    const loanItems = [
      ...(items.loanApplications ? [{ name: "Applications", icon: FileText, path: "/loans" }] : []),
      ...(items.approveRejectLoans ? [{ name: "Sanction Decisions", icon: CheckCircle2, path: "/loans" }] : []),
      ...(items.documentVerification ? [{ name: "Document Desk", icon: FileCheck, path: "/loans/documents" }] : []),
      ...(items.activeLoans ? [{ name: "Active Loans", icon: FileText, path: "/loans/active" }] : []),
      ...(items.repaymentSchedule ? [{ name: "Repayment Schedule", icon: CalendarRange, path: "/loans/repayments" }] : []),
      ...(items.emiCollections ? [{ name: "EMI Collections", icon: CircleDollarSign, path: "/loans/collections" }] : []),
      ...(items.overdueLoans ? [{ name: "Overdue & NPA", icon: AlertCircle, path: "/loans/overdue" }] : []),
      ...(items.appVerification ? [{ name: "Verification Desk", icon: ShieldCheck, path: "/operations/verification" }] : []),
      ...(items.followUps ? [{ name: "Operations Follow-ups", icon: ListChecks, path: "/operations/follow-ups" }] : []),
    ];

    const financeItems = [
      ...(items.accountantPortal ? [{ name: "Disbursals & Payouts", icon: CreditCard, path: "/accountant" }] : []),
    ];

    const adminItems = [
      ...(items.manageUsers ? [{ name: "Team & Staff", icon: UserCheck, path: "/users" }] : []),
      ...(items.rolePermissions ? [
        { name: "HR Permissions", icon: ShieldCheck, path: "/users/hr-permissions" },
        { name: "Roles & Permissions", icon: Lock, path: "/users/roles" }
      ] : []),
      ...(items.reports ? [{ name: "Reports & Analytics", icon: BarChart3, path: "/hr/reports" }] : []),
      ...(items.manageComplaints ? [{ name: "Complaints", icon: MessageSquare, path: "/complaints" }] : []),
      ...(items.notifications ? [{ name: "Announcements", icon: Bell, path: "/notifications" }] : []),
    ];

    return [
      { title: "", items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/" }] },
      ...(hrItems.length > 0 ? [{ title: "HR & EMPLOYEES", items: hrItems }] : []),
      ...(leadItems.length > 0 ? [{ title: "LEADS & SALES", items: leadItems }] : []),
      ...(loanItems.length > 0 ? [{ title: "LOANS & RECOVERY", items: loanItems }] : []),
      ...(financeItems.length > 0 ? [{ title: "ACCOUNTS & FINANCE", items: financeItems }] : []),
      ...(adminItems.length > 0 ? [{ title: "ADMIN CONTROLS", items: adminItems }] : []),
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
                          className={`w-full flex items-center px-3 py-2.5 rounded-[10px] transition-all duration-200 group cursor-pointer ${isOpen ? "justify-between" : "justify-center"
                            } ${isAnyChildActive
                              ? "bg-[var(--color-brand-sky-light)] text-[var(--color-brand-blue-dark)] shadow-2xs border border-[var(--color-brand-border)] font-bold"
                              : "text-[var(--color-brand-text-secondary)] hover:bg-[var(--color-brand-sky-light)]/50 hover:text-[var(--color-brand-blue-dark)]"
                            }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              size={18}
                              strokeWidth={isAnyChildActive ? 2.5 : 2}
                              className={`shrink-0 ${isAnyChildActive
                                ? "text-[var(--color-brand-blue-dark)]"
                                : "text-slate-400 group-hover:text-[var(--color-brand-blue-dark)]"
                                }`}
                            />
                            {isOpen && (
                              <span className={`text-[13px] font-semibold tracking-wide truncate transition-all duration-300 ${isAnyChildActive ? "text-[var(--color-brand-blue-dark)] font-bold" : ""
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
                                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all group/sub ${isSubActive
                                    ? "bg-[var(--color-brand-sky-light)] text-[var(--color-brand-blue-dark)] font-bold shadow-2xs"
                                    : "text-slate-600 hover:text-[var(--color-brand-blue-dark)] hover:bg-[var(--color-brand-sky-light)]/40"
                                    }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full transition-all shrink-0 ${isSubActive
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
                      className={`flex items-center px-3 py-2.5 rounded-[10px] transition-all duration-200 group whitespace-nowrap ${isOpen ? 'gap-3' : 'justify-center'
                        } ${isActive
                          ? "bg-[var(--color-brand-sky-light)] text-[var(--color-brand-blue-dark)] shadow-sm border border-[var(--color-brand-border)] font-bold"
                          : "text-[var(--color-brand-text-secondary)] hover:bg-[var(--color-brand-sky-light)]/50 hover:text-[var(--color-brand-blue-dark)]"
                        }`}
                    >
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={`shrink-0 ${isActive
                          ? "text-[var(--color-brand-blue-dark)]"
                          : item.isDanger
                            ? "text-red-500 group-hover:text-red-600"
                            : "text-slate-400 group-hover:text-[var(--color-brand-blue-dark)]"
                          }`}
                      />
                      <span
                        className={`text-[13px] font-semibold tracking-wide truncate whitespace-nowrap transition-all duration-300 flex-1 ${isOpen ? 'opacity-100 w-auto ml-1' : 'opacity-0 w-0 hidden'
                          } ${isActive
                            ? "text-[var(--color-brand-blue-dark)]"
                            : item.isDanger
                              ? "text-red-500 group-hover:text-red-600"
                              : ""
                          }`}
                      >
                        {item.name}
                      </span>
                      {isOpen && item.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 whitespace-nowrap ${item.badgeColor || 'bg-blue-100/80 text-blue-700'
                          }`}>
                          {item.badge}
                        </span>
                      )}
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

