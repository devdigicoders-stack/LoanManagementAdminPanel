/**
 * RBAC Permission Utility
 * Reads the logged-in admin's permissions from localStorage.
 * Used throughout the frontend to conditionally show/hide UI elements and sidebar pages.
 */

// Role-Specific Sidebar Page Permissions
export const ROLE_SIDEBAR_PAGES = {
  'Super Admin': [
    { name: 'Customers', path: '/customers', description: 'Borrowers & customer directory' },
    { name: 'Lead Management', path: '/leads', description: 'All loan inquiries & lead allocations' },
    { name: 'Loan Applications', path: '/loans', description: 'All loan applications & sanction queue' },
    { name: 'Document Verification', path: '/loans/documents', description: 'KYC & borrower document checks' },
    { name: 'Active Loans', path: '/loans/active', description: 'Active disbursed loans & monitoring' },
    { name: 'EMI Collections', path: '/loans/collections', description: 'Daily collections & EMI tracker' },
    { name: 'Overdue Loans', path: '/loans/overdue', description: 'Overdue and defaulted borrower accounts' },
    { name: 'Departments', path: '/employees/departments', description: 'Company branches & departments' },
    { name: 'Manage Employees', path: '/employees', description: 'Staff directory & profiles' },
    { name: 'Recruitment', path: '/hr/recruitment', description: 'Job openings, candidates & hiring' },
    { name: 'Onboarding', path: '/hr/onboarding', description: 'Candidate digital onboarding' },
    { name: 'Attendance', path: '/employees/attendance', description: 'Staff daily check-in logs' },
    { name: 'Leave Management', path: '/employees/leave-management', description: 'Leave requests & approvals' },
    { name: 'Payroll & Salary', path: '/hr/payroll', description: 'Salary calculations & payslips' },
    { name: 'Operations & Verification', path: '/operations/dashboard', description: 'Operations LOS desk' },
    { name: 'Disbursals & Finance', path: '/accountant', description: 'Financial ledger & payouts' },
    { name: 'Loan Offers', path: '/offers', description: 'Loan products & promotional schemes' },
    { name: 'Manage Users', path: '/users', description: 'System users & staff hierarchy' },
    { name: 'Permission Management', path: '/users/roles', description: 'Access control & role permissions' },
    { name: 'Reports & Analytics', path: '/hr/reports', description: 'Master reports & business metrics' },
    { name: 'Manage Complaints', path: '/complaints', description: 'Grievance & customer tickets' },
    { name: 'Notifications', path: '/notifications', description: 'System-wide announcements' }
  ],
  'Admin': [
    { name: 'Customers', path: '/customers', description: 'Borrowers & customer directory' },
    { name: 'Lead Management', path: '/leads', description: 'All loan inquiries & lead allocations' },
    { name: 'Loan Applications', path: '/loans', description: 'All loan requests & approval queue' },
    { name: 'Document Verification', path: '/loans/documents', description: 'KYC & borrower document checks' },
    { name: 'Active Loans', path: '/loans/active', description: 'Active disbursed loans & monitoring' },
    { name: 'EMI Collections', path: '/loans/collections', description: 'Daily collections & EMI tracker' },
    { name: 'Overdue Loans', path: '/loans/overdue', description: 'Overdue and defaulted accounts' },
    { name: 'Departments', path: '/employees/departments', description: 'Company branches & departments' },
    { name: 'Manage Employees', path: '/employees', description: 'Staff directory & profiles' },
    { name: 'Recruitment', path: '/hr/recruitment', description: 'Job openings & candidates' },
    { name: 'Onboarding', path: '/hr/onboarding', description: 'Candidate digital onboarding' },
    { name: 'Attendance', path: '/employees/attendance', description: 'Staff daily check-in logs' },
    { name: 'Leave Management', path: '/employees/leave-management', description: 'Leave requests & approvals' },
    { name: 'Payroll & Salary', path: '/hr/payroll', description: 'Salary calculations & payslips' },
    { name: 'Operations & Verification', path: '/operations/dashboard', description: 'Operations LOS desk' },
    { name: 'Disbursals & Finance', path: '/accountant', description: 'Financial ledger & payouts' },
    { name: 'Loan Offers', path: '/offers', description: 'Loan schemes & offers' },
    { name: 'Manage Users', path: '/users', description: 'Staff accounts & hierarchy' },
    { name: 'Permission Management', path: '/users/roles', description: 'Access control & role permissions' },
    { name: 'Reports & Analytics', path: '/hr/reports', description: 'Master reports & metrics' },
    { name: 'Manage Complaints', path: '/complaints', description: 'Grievance & tickets' },
    { name: 'Notifications', path: '/notifications', description: 'Announcements' }
  ],
  'HR Head': [
    { name: 'Manage Employees', path: '/employees', description: 'Employee directory & profile management' },
    { name: 'Departments', path: '/employees/departments', description: 'Company branches & department structures' },
    { name: 'Recruitment', path: '/hr/recruitment', description: 'Job openings, candidates & pan-India hiring' },
    { name: 'Onboarding', path: '/hr/onboarding', description: 'Digital candidate onboarding & form links' },
    { name: 'Attendance', path: '/employees/attendance', description: 'Daily staff check-in logs & records' },
    { name: 'Leave Management', path: '/employees/leave-management', description: 'Leave requests, balance & approvals' },
    { name: 'Payroll & Salary', path: '/hr/payroll', description: 'Salary calculations, CTC & payroll slips' },
    { name: 'Team & Staff', path: '/users', description: 'Manage HR Managers & HR Executives' },
    { name: 'Reports & Analytics', path: '/hr/reports', description: 'Master HR reports, analytics & headcount' },
    { name: 'Notifications', path: '/notifications', description: 'HR announcements & broadcast alerts' }
  ],
  'HR Manager': [
    { name: 'Manage Employees', path: '/employees', description: 'Employee directory & active teams' },
    { name: 'Recruitment', path: '/hr/recruitment', description: 'Zone job openings & candidates' },
    { name: 'Onboarding', path: '/hr/onboarding', description: 'Candidate digital onboarding' },
    { name: 'Attendance', path: '/employees/attendance', description: 'Daily staff check-in logs & records' },
    { name: 'Leave Management', path: '/employees/leave-management', description: 'Leave requests & approvals' },
    { name: 'Team & Staff', path: '/users', description: 'Manage HR Executives in team' },
    { name: 'Reports & Analytics', path: '/hr/reports', description: 'Team performance & hiring metrics' },
    { name: 'Notifications', path: '/notifications', description: 'Announcements & team alerts' }
  ],
  'HR Executive': [
    { name: 'Recruitment', path: '/hr/recruitment', description: 'Assigned zone candidates & interviews' },
    { name: 'Onboarding', path: '/hr/onboarding', description: 'Candidate document collection & onboarding' },
    { name: 'Attendance', path: '/employees/attendance', description: 'Attendance records' },
    { name: 'Leave Management', path: '/employees/leave-management', description: 'My leave & team leave tracking' },
    { name: 'Notifications', path: '/notifications', description: 'HR announcements' }
  ],
  'HR Admin': [
    { name: 'Departments', path: '/employees/departments', description: 'Company branches & department management' },
    { name: 'Manage Employees', path: '/employees', description: 'Employee directory, profiles & tabs' },
    { name: 'Lead Management', path: '/leads', description: 'Lead generation & customer pipeline' },
    { name: 'Recruitment', path: '/hr/recruitment', description: 'Job openings, candidates & hiring pipeline' },
    { name: 'Onboarding', path: '/hr/onboarding', description: 'Digital candidate onboarding & form links' },
    { name: 'Attendance', path: '/employees/attendance', description: 'Daily staff check-in logs & records' },
    { name: 'Leave Management', path: '/employees/leave-management', description: 'Leave requests, balance & approvals' },
    { name: 'Payroll & Salary', path: '/hr/payroll', description: 'Salary calculations, CTC & payroll slips' },
    { name: 'Reports & Analytics', path: '/hr/reports', description: 'HR analytics, headcounts & summaries' },
    { name: 'Team & Staff', path: '/users', description: 'HR staff management' },
    { name: 'Notifications', path: '/notifications', description: 'Company announcements & alerts' }
  ],
  'Operation Admin': [
    { name: 'Manage Users', path: '/users', description: 'Customer directory & verification' },
    { name: 'Customers', path: '/customers', description: 'Customer profiles & KYC' },
    { name: 'Lead Management', path: '/leads', description: 'All incoming loan leads & assignments' },
    { name: 'Loan Applications', path: '/loans', description: 'All loan requests & status overview' },
    { name: 'Document Verification', path: '/loans/documents', description: 'KYC, PAN, Aadhar & income docs' },
    { name: 'Active Loans', path: '/loans/active', description: 'Disbursed and active running loans' },
    { name: 'EMI Collections', path: '/loans/collections', description: 'Daily and monthly EMI collection tracker' },
    { name: 'Overdue Loans', path: '/loans/overdue', description: 'Defaulted & overdue borrower accounts' },
    { name: 'Application Verification', path: '/operations/verification', description: 'Field and desktop checks' },
    { name: 'Follow-Up Management', path: '/operations/follow-ups', description: 'Customer pending document follow-ups' },
    { name: 'Reports & Analytics', path: '/hr/reports', description: 'Operations reports & turnaround times' },
    { name: 'Notifications', path: '/notifications', description: 'Operational notifications & reminders' }
  ],
  'Tele callers operator': [
    { name: 'Assigned Leads', path: '/telecaller/assigned-leads', description: 'Allocated leads queue & caller assignments' },
    { name: 'My Leads', path: '/telecaller/leads', description: 'Personal leads, status updates & calling history' },
    { name: 'My Followups', path: '/telecaller/followups', description: 'Scheduled follow-up reminders & customer callbacks' },
    { name: 'Customer Documents', path: '/telecaller/documents', description: 'Collected customer KYC & loan paperwork' },
    { name: 'Remarks & Notes', path: '/telecaller/remarks', description: 'Call logs, conversation notes & customer feedback' },
    { name: 'Telecaller Reports', path: '/telecaller/reports', description: 'Calling analytics, conversions & lead summaries' },
    { name: 'My Performance', path: '/telecaller/performance', description: 'Daily talk-time, targets & achieved milestones' },
    { name: 'Notifications', path: '/telecaller/notifications', description: 'Lead assignment alerts & call reminders' }
  ],
  'Agent operator': [
    { name: 'My Leads', path: '/agent/leads', description: 'Field leads pipeline & potential applicants' },
    { name: 'Customer Visits', path: '/agent/visits', description: 'On-site customer visits & schedule tracking' },
    { name: 'My Follow-ups', path: '/agent/followups', description: 'Field meeting follow-ups & appointments' },
    { name: 'Customer Documents', path: '/agent/documents', description: 'Physical document collection & uploads' },
    { name: 'Application Tracking', path: '/agent/applications', description: 'Status tracking of submitted applications' },
    { name: 'Remarks & Notes', path: '/agent/remarks', description: 'Field survey notes & customer verification comments' },
    { name: 'Agent Reports', path: '/agent/reports', description: 'Visit reports, conversion rates & progress' },
    { name: 'Notifications', path: '/agent/notifications', description: 'Visit schedules & application updates' },
    { name: 'My Performance', path: '/agent/performance', description: 'Agent target achievements & monthly metrics' }
  ],
  'Accountant Admin': [
    { name: 'Payments & Collections', path: '/accountant/payments', description: 'EMI collection records & receipts' },
    { name: 'Record Payment', path: '/accountant/payments/add', description: 'Manual cash/online payment entry' },
    { name: 'Transactions', path: '/accountant/transactions', description: 'Full ledger & payment transactions' },
    { name: 'Outstanding Payments', path: '/accountant/outstanding', description: 'Overdue EMIs & pending amounts' },
    { name: 'Customers', path: '/accountant/customers', description: 'Customer financial balances' },
    { name: 'Receipts', path: '/accountant/receipts', description: 'Payment receipts & vouchers' },
    { name: 'Refunds', path: '/accountant/refunds', description: 'Excess payment & fee refunds' },
    { name: 'Expenses', path: '/accountant/expenses', description: 'Company branch & operational expenses' },
    { name: 'Reconciliation', path: '/accountant/reconciliation', description: 'Bank statement & book matching' },
    { name: 'Financial Reports', path: '/accountant/reports', description: 'Balance sheet, P&L & collection trends' },
    { name: 'Notifications', path: '/accountant/notifications', description: 'Payment notices & dues alerts' }
  ],
  'Credit Admin': [
    { name: 'Loan Applications', path: '/loans', description: 'Underwriting queue & risk assessments' },
    { name: 'Approve / Reject Loans', path: '/loans', description: 'Sanction, rejection or hold decisions' },
    { name: 'Document Verification', path: '/loans/documents', description: 'Income statements & CIBIL score checks' },
    { name: 'Active Loans', path: '/loans/active', description: 'Approved and active loan accounts' },
    { name: 'Repayment Schedule', path: '/loans/repayments', description: 'Customer EMI schedule & repayment details' },
    { name: 'Reports & Analytics', path: '/hr/reports', description: 'Approval rates, NPA & risk analytics' },
    { name: 'Notifications', path: '/notifications', description: 'Underwriting alerts & loan escalations' }
  ]
};

// Default full permissions per role (used as initial preset and fallback)
export const ROLE_PERMISSIONS = {
  super_admin: ROLE_SIDEBAR_PAGES['Super Admin'].map(p => p.name),
  superadmin: ROLE_SIDEBAR_PAGES['Super Admin'].map(p => p.name),
  admin: ROLE_SIDEBAR_PAGES['Admin'].map(p => p.name),
  administrator: ROLE_SIDEBAR_PAGES['Admin'].map(p => p.name),
  hr_head: ROLE_SIDEBAR_PAGES['HR Head'].map(p => p.name),
  hrhead: ROLE_SIDEBAR_PAGES['HR Head'].map(p => p.name),
  hr_manager: ROLE_SIDEBAR_PAGES['HR Manager'].map(p => p.name),
  hrmanager: ROLE_SIDEBAR_PAGES['HR Manager'].map(p => p.name),
  hr_executive: ROLE_SIDEBAR_PAGES['HR Executive'].map(p => p.name),
  hrexecutive: ROLE_SIDEBAR_PAGES['HR Executive'].map(p => p.name),
  hr_admin: ROLE_SIDEBAR_PAGES['HR Admin'].map(p => p.name),
  hradmin: ROLE_SIDEBAR_PAGES['HR Admin'].map(p => p.name),
  operation_admin: ROLE_SIDEBAR_PAGES['Operation Admin'].map(p => p.name),
  operationadmin: ROLE_SIDEBAR_PAGES['Operation Admin'].map(p => p.name),
  operations: ROLE_SIDEBAR_PAGES['Operation Admin'].map(p => p.name),
  tele_callers_operator: ROLE_SIDEBAR_PAGES['Tele callers operator'].map(p => p.name),
  telecallersoperator: ROLE_SIDEBAR_PAGES['Tele callers operator'].map(p => p.name),
  telecaller: ROLE_SIDEBAR_PAGES['Tele callers operator'].map(p => p.name),
  agent_operator: ROLE_SIDEBAR_PAGES['Agent operator'].map(p => p.name),
  agentoperator: ROLE_SIDEBAR_PAGES['Agent operator'].map(p => p.name),
  agent: ROLE_SIDEBAR_PAGES['Agent operator'].map(p => p.name),
  sales_admin: ROLE_SIDEBAR_PAGES['Tele callers operator'].map(p => p.name),
  salesadmin: ROLE_SIDEBAR_PAGES['Tele callers operator'].map(p => p.name),
  accountant_admin: ROLE_SIDEBAR_PAGES['Accountant Admin'].map(p => p.name),
  accountantadmin: ROLE_SIDEBAR_PAGES['Accountant Admin'].map(p => p.name),
  accountant: ROLE_SIDEBAR_PAGES['Accountant Admin'].map(p => p.name),
  credit_admin: ROLE_SIDEBAR_PAGES['Credit Admin'].map(p => p.name),
  creditadmin: ROLE_SIDEBAR_PAGES['Credit Admin'].map(p => p.name)
};

const PERMISSION_ALIASES = {
  'Departments': ['Departments', 'Manage Departments'],
  'Manage Employees': ['Manage Employees', 'Employees'],
  'Employees': ['Manage Employees', 'Employees'],
  'Payroll & Salary': ['Payroll/Salary', 'Payroll & Salary', 'Payroll'],
  'Payroll/Salary': ['Payroll & Salary', 'Payroll/Salary', 'Payroll'],
  'Reports & Analytics': ['View Reports', 'Export Data', 'Reports & Analytics', 'Reports'],
  'View Reports': ['Reports & Analytics', 'View Reports'],
  'Loan Applications': ['View Loan Applications', 'Loan Applications', 'Loan Application', 'Approve / Reject Loans', 'Approve/Reject/Hold Loan', 'Applications'],
  'Loan Application': ['View Loan Applications', 'Loan Applications', 'Loan Application', 'Approve / Reject Loans', 'Approve/Reject/Hold Loan'],
  'View Loan Applications': ['Loan Applications', 'View Loan Applications'],
  'Approve / Reject Loans': ['Loan Applications', 'View Loan Applications', 'Approve / Reject Loans', 'Approve/Reject/Hold Loan'],
  'Document Verification': ['Document Verification', 'Verify Documents', 'Download Documents', 'Document Center'],
  'Document Center': ['Document Verification', 'Verify Documents', 'Download Documents', 'Document Center'],
  'Verify Documents': ['Document Verification', 'Verify Documents', 'Document Center'],
  'Lead Management': ['Lead Management', 'All Leads', 'Leads'],
  'Recruitment': ['View Job', 'Add Job', 'Recruitment', 'Jobs'],
  'Onboarding': ['Onboarding', 'Candidate Onboarding'],
  'Attendance': ['Attendance', 'Staff Attendance', 'Daily Attendance'],
  'Leave Management': ['Leave Management', 'Leave Requests', 'Leaves'],
  'Notifications': ['Send Reminders/SMS', 'Notifications', 'Announcements'],
  'Customer Follow-ups': ['Customer Follow-ups', 'My Followups', 'Follow-Up Management', 'FollowUps'],
  'My Followups': ['Customer Follow-ups', 'My Followups', 'Follow-Up Management', 'FollowUps'],
  'Payments & Coll.': ['Payments & Collections', 'Payments & Coll.'],
  'Payments & Collections': ['Payments & Collections', 'Payments & Coll.'],
  'Agent Reports': ['Reports', 'Agent Reports'],
  'Telecaller Reports': ['Reports', 'Telecaller Reports'],
  'Permission Management': ['Role & Permission Management', 'Permission Management', 'Role Permissions', 'Roles & Permissions'],
  'Role & Permission Management': ['Role & Permission Management', 'Permission Management', 'Role Permissions', 'Roles & Permissions'],
  'Manage Complaints': ['Manage Complaints', 'Complaints'],
  'Telecaller Portal': ['Telecaller Portal', 'Telecaller', 'Tele callers operator'],
  'Field Agent Portal': ['Field Agent Portal', 'Agent Portal', 'Agent operator'],
  'Accountant Portal': ['Accountant Portal', 'Accountant Admin', 'Accountant', 'Disbursals & Finance'],
  'Manage Users': ['Manage Users', 'Team & Staff', 'Users', 'Staff'],
  'Team & Staff': ['Manage Users', 'Team & Staff', 'Users', 'Staff']
};

/**
 * Check if the current user has a specific permission (supports legacy aliases)
 * @param {string} permission - The permission key to check
 * @returns {boolean}
 */
export const hasPermission = (permission) => {
  try {
    const rawRole = localStorage.getItem('userRole') || 'Super Admin';
    const cleanRole = rawRole.toLowerCase().replace(/[^a-z0-9]/g, '');
    const snakeRole = rawRole.toLowerCase().replace(/ /g, '_');

    // Super Admin has master access to all pages
    if (['superadmin', 'super_admin'].includes(cleanRole) || ['super admin', 'superadmin'].includes(rawRole.toLowerCase())) {
      return true;
    }

    const stored = localStorage.getItem('permissions');
    if (stored !== null && stored !== undefined) {
      const perms = JSON.parse(stored);
      if (Array.isArray(perms)) {
        if (perms.includes(permission)) return true;

        const matchingAliases = PERMISSION_ALIASES[permission] || [];
        if (matchingAliases.some(alias => perms.includes(alias))) return true;

        // Strictly respect configured permissions list
        return false;
      }
    }

    // Fallback: derive from default role permissions
    const rolePerms = ROLE_PERMISSIONS[cleanRole] || ROLE_PERMISSIONS[snakeRole] || ROLE_PERMISSIONS[rawRole] || [];
    if (rolePerms.includes(permission)) return true;

    const matchingAliases = PERMISSION_ALIASES[permission] || [];
    if (matchingAliases.some(alias => rolePerms.includes(alias))) return true;

    return false;
  } catch {
    return false;
  }
};

/**
 * Sync latest permissions from server and update local storage & broadcast event
 */
export const syncPermissionsWithServer = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://loan-management-backend-wu4y.onrender.com/api';
    const res = await fetch(`${API_URL}/admin/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.permissions) && data.permissions.length > 0) {
        storePermissions(data.permissions);
        window.dispatchEvent(new CustomEvent('permissionsUpdated', { detail: data.permissions }));
        return data.permissions;
      }
    }
  } catch (err) {
    // ignore
  }
  return null;
};

/**
 * Get all permissions for the current user
 * @returns {string[]}
 */
export const getPermissions = () => {
  try {
    const stored = localStorage.getItem('permissions');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    const role = localStorage.getItem('userRole') || 'admin';
    const cleanRole = role.toLowerCase().replace(/[^a-z0-9]/g, '');
    const roleKey = role.toLowerCase().replace(/ /g, '_');
    return ROLE_PERMISSIONS[cleanRole] || ROLE_PERMISSIONS[roleKey] || [];
  } catch {
    return [];
  }
};

/**
 * Store permissions in localStorage after login
 * @param {string[]} permissions
 */
export const storePermissions = (permissions) => {
  if (Array.isArray(permissions) && permissions.length > 0) {
    localStorage.setItem('permissions', JSON.stringify(permissions));
  } else {
    // Don't overwrite with empty array, fallback to default role permissions
    const role = localStorage.getItem('userRole') || 'admin';
    const cleanRole = role.toLowerCase().replace(/[^a-z0-9]/g, '');
    const roleKey = role.toLowerCase().replace(/ /g, '_');
    const defaultPerms = ROLE_PERMISSIONS[cleanRole] || ROLE_PERMISSIONS[roleKey] || [];
    localStorage.setItem('permissions', JSON.stringify(defaultPerms));
  }
};

/**
 * Clear permissions on logout
 */
export const clearPermissions = () => {
  localStorage.removeItem('permissions');
};

