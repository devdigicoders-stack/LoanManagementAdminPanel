import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FileText, FolderOpen, ListChecks, CircleDollarSign, AlertCircle,
  ShieldCheck, ShieldAlert, CheckCircle2, PhoneCall, CalendarCheck,
  BarChart3, Activity, MessageSquare, MapPin, Building2, Users,
  UserPlus, CalendarRange, CreditCard, Receipt, Target, PlusCircle,
  Layers, ChevronRight, UserCheck, Lock, Upload
} from 'lucide-react';

const PORTAL_CONFIGS = [
  {
    prefix: '/loans',
    name: 'Loan Management',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: FileText,
    tabs: [
      { name: 'Loan Applications', path: '/loans', icon: FileText, exact: true },
      { name: 'Document Center', path: '/loans/documents', icon: FolderOpen },
      { name: 'Active Loans', path: '/loans/active', icon: CheckCircle2 },
      { name: 'EMI Collections', path: '/loans/collections', icon: CircleDollarSign },
      { name: 'Overdue Loans', path: '/loans/overdue', icon: AlertCircle },
      { name: 'Repayment Schedule', path: '/loans/repayments', icon: CalendarRange },
    ]
  },
  {
    prefix: '/telecaller',
    name: 'Telecaller Portal',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: PhoneCall,
    tabs: [
      { name: 'Dashboard', path: '/telecaller', icon: Activity, exact: true },
      { name: 'Assigned Leads', path: '/telecaller/assigned-leads', icon: FolderOpen },
      { name: 'My Leads', path: '/telecaller/leads', icon: Target },
      { name: 'My Followups', path: '/telecaller/followups', icon: CalendarCheck },
      { name: 'Customer Documents', path: '/telecaller/documents', icon: FolderOpen },
      { name: 'Remarks & Notes', path: '/telecaller/remarks', icon: MessageSquare },
      { name: 'Telecaller Reports', path: '/telecaller/reports', icon: BarChart3 },
      { name: 'Performance', path: '/telecaller/performance', icon: Activity },
    ]
  },
  {
    prefix: '/agent',
    name: 'Field Agent Portal',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: MapPin,
    tabs: [
      { name: 'Dashboard', path: '/agent', icon: Activity, exact: true },
      { name: 'Field Leads', path: '/agent/leads', icon: Target },
      { name: 'Customer Visits', path: '/agent/visits', icon: MapPin },
      { name: 'Follow-ups', path: '/agent/followups', icon: CalendarCheck },
      { name: 'Customer Documents', path: '/agent/documents', icon: FolderOpen },
      { name: 'Applications', path: '/agent/applications', icon: FileText },
      { name: 'Agent Reports', path: '/agent/reports', icon: BarChart3 },
      { name: 'Performance', path: '/agent/performance', icon: Activity },
    ]
  },
  {
    prefix: '/operations',
    name: 'Operations & LOS',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: ShieldAlert,
    tabs: [
      { name: 'Operation Dashboard', path: '/operations/dashboard', icon: Activity },
      { name: 'Applications', path: '/operations/applications', icon: FileText },
      { name: 'Assigned', path: '/operations/assigned', icon: FolderOpen },
      { name: 'Customers', path: '/operations/customers', icon: Users },
      { name: 'Verification', path: '/operations/verification', icon: ShieldCheck },
      { name: 'Follow-ups', path: '/operations/follow-ups', icon: ListChecks },
      { name: 'Remarks', path: '/operations/remarks', icon: MessageSquare },
      { name: 'Operation Reports', path: '/operations/reports', icon: BarChart3 },
    ]
  },
  {
    prefix: '/employees',
    altPrefix: '/hr',
    name: 'HR & Staff Management',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: Building2,
    tabs: [
      { name: 'Manage Employees', path: '/employees', icon: Users, exact: true },
      { name: 'Departments', path: '/employees/departments', icon: Building2 },
      { name: 'Recruitment', path: '/hr/recruitment', icon: Users },
      { name: 'Onboarding', path: '/hr/onboarding', icon: UserPlus },
      { name: 'Attendance', path: '/employees/attendance', icon: ListChecks },
      { name: 'Leave Management', path: '/employees/leave-management', icon: CalendarRange },
      { name: 'Payroll & Salary', path: '/hr/payroll', icon: CircleDollarSign },
      { name: 'HR Reports', path: '/hr/reports', icon: BarChart3 },
    ]
  },
  {
    prefix: '/accountant',
    name: 'Finance & Accountant Portal',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: CreditCard,
    tabs: [
      { name: 'Dashboard', path: '/accountant', icon: Activity, exact: true },
      { name: 'Payments & Collections', path: '/accountant/payments', icon: CircleDollarSign },
      { name: 'Record Payment', path: '/accountant/payments/add', icon: PlusCircle },
      { name: 'Transactions Ledger', path: '/accountant/transactions', icon: FileText },
      { name: 'Outstanding Payments', path: '/accountant/outstanding', icon: AlertCircle },
      { name: 'Customer Balances', path: '/accountant/customers', icon: Users },
      { name: 'Receipts', path: '/accountant/receipts', icon: Receipt },
      { name: 'Bank Reconciliation', path: '/accountant/reconciliation', icon: ShieldCheck },
      { name: 'Financial Reports', path: '/accountant/reports', icon: BarChart3 },
    ]
  },
  {
    prefix: '/leads',
    name: 'Lead Management',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: Target,
    tabs: [
      { name: 'All Leads', path: '/leads', icon: Target, exact: true },
      { name: 'Add New Lead', path: '/leads/add', icon: PlusCircle },
      { name: 'Assign Leads', path: '/leads/assign', icon: Users },
      { name: 'Follow-ups', path: '/leads/followups', icon: CalendarCheck },
      { name: 'Lead Status', path: '/leads/status', icon: ListChecks },
      { name: 'Lead Sources', path: '/leads/sources', icon: Layers },
    ]
  },
  {
    prefix: '/users',
    name: 'User & Access Controls',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    icon: UserCheck,
    tabs: [
      { name: 'Manage Users', path: '/users', icon: UserCheck, exact: true },
      { name: 'Add User', path: '/users/add', icon: UserPlus },
      { name: 'Role & Permissions', path: '/users/roles', icon: Lock },
      { name: 'Bulk Import', path: '/users/import', icon: Upload },
    ]
  }
];

export default function PortalSubNav() {
  const location = useLocation();
  const path = location.pathname;

  // Don't show subnav on root dashboard ("/")
  if (path === '/' || path === '/login') return null;

  // Strictly ONLY Super Admin and Admin should see this universal module navigation hub
  const userRole = (localStorage.getItem('userRole') || '').toLowerCase().trim();
  const isMasterAdmin = ['super admin', 'superadmin', 'admin', 'administrator'].includes(userRole);

  if (!isMasterAdmin) return null;

  // Find matching portal configuration
  const portal = PORTAL_CONFIGS.find(p => 
    path.startsWith(p.prefix) || (p.altPrefix && path.startsWith(p.altPrefix))
  );

  if (!portal) return null;

  const PortalIcon = portal.icon;

  return (
    <div className="mb-6 bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-2.5 sm:p-3">
      {/* Header bar showing Portal Name */}
      <div className="flex items-center justify-between gap-3 pb-2.5 mb-2.5 border-b border-slate-100 px-1.5 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border font-bold ${portal.badgeColor}`}>
            <PortalIcon size={16} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 leading-tight">{portal.name}</h2>
            <p className="text-[11px] text-slate-400 font-semibold">Module Navigation Hub</p>
          </div>
        </div>

        <div className="text-[11px] font-bold text-slate-400 hidden sm:flex items-center gap-1">
          <span>Click any sub-module to switch</span>
          <ChevronRight size={12} />
        </div>
      </div>

      {/* Horizontal Nav Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {portal.tabs.map((tab, idx) => {
          const TabIcon = tab.icon;
          const isActive = tab.exact 
            ? path === tab.path 
            : (path === tab.path || (tab.path !== portal.prefix && path.startsWith(tab.path)));

          return (
            <NavLink
              key={idx}
              to={tab.path}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 bg-slate-50/70 border border-slate-200/60'
              }`}
            >
              <TabIcon size={14} className={isActive ? 'text-blue-400' : 'text-slate-400'} />
              <span>{tab.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
