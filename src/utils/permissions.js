/**
 * RBAC Permission Utility
 * Reads the logged-in admin's permissions from localStorage.
 * Used throughout the frontend to conditionally show/hide UI elements and sidebar pages.
 */

// Role-Specific Sidebar Page Permissions
export const ROLE_SIDEBAR_PAGES = {
  'Admin': [
    { name: 'Manage Users', path: '/users', description: 'Customer database, verification & management' },
    { name: 'Permission Management', path: '/users/roles', description: 'Configure role permissions & access control' },
    { name: 'Manage Complaints', path: '/complaints', description: 'Customer grievance & support tickets' },
    { name: 'Departments', path: '/employees/departments', description: 'Company branches & department management' },
    { name: 'Manage Employees', path: '/employees', description: 'Employee directory, profiles & tabs' },
    { name: 'Recruitment', path: '/hr/recruitment', description: 'Job openings, candidates & hiring pipeline' },
    { name: 'Onboarding', path: '/hr/onboarding', description: 'Digital candidate onboarding & form links' },
    { name: 'Attendance', path: '/employees/attendance', description: 'Daily staff check-in logs & records' },
    { name: 'Leave Management', path: '/employees/leave-management', description: 'Leave requests, balance & approvals' },
    { name: 'Payroll & Salary', path: '/hr/payroll', description: 'Salary calculations, CTC & payroll slips' },
    { name: 'Lead Management', path: '/leads', description: 'All inbound loan leads & assignments' },
    { name: 'Telecaller Portal', path: '/telecaller', description: 'Telecalling leads & call tracking portal' },
    { name: 'Field Agent Portal', path: '/agent', description: 'Field agent verification & visits portal' },
    { name: 'Loan Applications', path: '/loans', description: 'All loan requests & approval queue' },
    { name: 'Document Verification', path: '/loans/documents', description: 'KYC, PAN, Aadhar & income docs' },
    { name: 'Active Loans', path: '/loans/active', description: 'Disbursed and active running loans' },
    { name: 'Repayment Schedule', path: '/loans/repayments', description: 'Customer EMI schedule & repayments' },
    { name: 'EMI Collections', path: '/loans/collections', description: 'Daily and monthly EMI collection tracker' },
    { name: 'Overdue Loans', path: '/loans/overdue', description: 'Defaulted & overdue borrower accounts' },
    { name: 'Application Verification', path: '/operations/verification', description: 'Field and desktop checks' },
    { name: 'Follow-Up Management', path: '/operations/follow-ups', description: 'Customer pending document follow-ups' },
    { name: 'Accountant Portal', path: '/accountant', description: 'Accounts, collections & financial ledger portal' },
    { name: 'Reports & Analytics', path: '/hr/reports', description: 'Master reports, analytics & turnaround times' },
    { name: 'Notifications', path: '/notifications', description: 'System-wide announcements & alerts' }
  ],
  'HR Admin': [
    { name: 'Departments', path: '/employees/departments', description: 'Company branches & department management' },
    { name: 'Manage Employees', path: '/employees', description: 'Employee directory, profiles & tabs' },
    { name: 'Lead Management', path: '/leads', description: 'Lead generation, assignments & customer pipeline' },
    { name: 'Recruitment', path: '/hr/recruitment', description: 'Job openings, candidates & hiring pipeline' },
    { name: 'Onboarding', path: '/hr/onboarding', description: 'Digital candidate onboarding & form links' },
    { name: 'Attendance', path: '/employees/attendance', description: 'Daily staff check-in logs & records' },
    { name: 'Leave Management', path: '/employees/leave-management', description: 'Leave requests, balance & approvals' },
    { name: 'Payroll & Salary', path: '/hr/payroll', description: 'Salary calculations, CTC & payroll slips' },
    { name: 'Reports & Analytics', path: '/hr/reports', description: 'HR analytics, headcounts & summaries' },
    { name: 'Notifications', path: '/notifications', description: 'Company announcements & alerts' }
  ],
  'Operation Admin': [
    { name: 'Manage Users', path: '/users', description: 'Customer directory & verification' },
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
  admin: ROLE_SIDEBAR_PAGES['Admin'].map(p => p.name),
  administrator: ROLE_SIDEBAR_PAGES['Admin'].map(p => p.name),
  hr_admin: ROLE_SIDEBAR_PAGES['HR Admin'].map(p => p.name),
  hradmin: ROLE_SIDEBAR_PAGES['HR Admin'].map(p => p.name),
  operation_admin: ROLE_SIDEBAR_PAGES['Operation Admin'].map(p => p.name),
  operationadmin: ROLE_SIDEBAR_PAGES['Operation Admin'].map(p => p.name),
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

/**
 * Check if the current user has a specific permission (supports legacy aliases)
 * @param {string} permission - The permission key to check
 * @returns {boolean}
 */
export const hasPermission = (permission) => {
  try {
    const role = (localStorage.getItem('userRole') || 'Super Admin').toLowerCase();
    if (['super admin', 'superadmin'].includes(role)) return true;

    const stored = localStorage.getItem('permissions');
    if (stored !== null && stored !== undefined) {
      const perms = JSON.parse(stored);
      if (Array.isArray(perms)) {
        if (perms.includes(permission)) return true;

        // Legacy / alias mappings
        const aliases = {
          'Departments': ['Departments', 'Manage Departments'],
          'Manage Employees': ['Manage Employees'],
          'Payroll & Salary': ['Payroll/Salary', 'Payroll & Salary'],
          'Payroll/Salary': ['Payroll & Salary', 'Payroll/Salary'],
          'Reports & Analytics': ['View Reports', 'Export Data', 'Reports & Analytics'],
          'View Reports': ['Reports & Analytics', 'View Reports'],
          'Loan Applications': ['View Loan Applications', 'Loan Applications', 'Loan Application', 'Approve / Reject Loans', 'Approve/Reject/Hold Loan'],
          'Loan Application': ['View Loan Applications', 'Loan Applications', 'Loan Application', 'Approve / Reject Loans', 'Approve/Reject/Hold Loan'],
          'View Loan Applications': ['Loan Applications', 'View Loan Applications'],
          'Approve / Reject Loans': ['Loan Applications', 'View Loan Applications', 'Approve / Reject Loans', 'Approve/Reject/Hold Loan'],
          'Document Verification': ['Document Verification', 'Verify Documents', 'Download Documents', 'Document Center'],
          'Document Center': ['Document Verification', 'Verify Documents', 'Download Documents', 'Document Center'],
          'Verify Documents': ['Document Verification', 'Verify Documents', 'Document Center'],
          'Lead Management': ['Lead Management'],
          'Recruitment': ['View Job', 'Add Job', 'Recruitment'],
          'Notifications': ['Send Reminders/SMS', 'Notifications'],
          'Customer Follow-ups': ['Customer Follow-ups', 'My Followups', 'Follow-Up Management', 'FollowUps'],
          'My Followups': ['Customer Follow-ups', 'My Followups', 'Follow-Up Management', 'FollowUps'],
          'Payments & Coll.': ['Payments & Collections', 'Payments & Coll.'],
          'Payments & Collections': ['Payments & Collections', 'Payments & Coll.'],
          'Agent Reports': ['Reports', 'Agent Reports'],
          'Telecaller Reports': ['Reports', 'Telecaller Reports'],
          'Permission Management': ['Role & Permission Management', 'Permission Management', 'Role Permissions'],
          'Role & Permission Management': ['Role & Permission Management', 'Permission Management', 'Role Permissions'],
          'Manage Complaints': ['Manage Complaints', 'Complaints'],
          'Telecaller Portal': ['Telecaller Portal', 'Telecaller', 'Tele callers operator'],
          'Field Agent Portal': ['Field Agent Portal', 'Agent Portal', 'Agent operator'],
          'Accountant Portal': ['Accountant Portal', 'Accountant Admin', 'Accountant']
        };

        const matchingAliases = aliases[permission] || [];
        if (matchingAliases.some(alias => perms.includes(alias))) return true;

        // User has explicit permissions loaded from DB (even if empty []) -> denied
        return false;
      }
    }

    // Fallback: derive from role defaults only if permissions were never loaded
    const cleanRole = (role || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const rolePerms = ROLE_PERMISSIONS[cleanRole] || ROLE_PERMISSIONS[(role || '').toLowerCase().replace(/ /g, '_')] || [];
    return rolePerms.includes(permission);
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
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const res = await fetch(`${API_URL}/admin/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.permissions)) {
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
    if (stored) return JSON.parse(stored);
    const role = localStorage.getItem('userRole') || 'admin';
    const roleKey = role.toLowerCase().replace(/ /g, '_');
    return ROLE_PERMISSIONS[roleKey] || [];
  } catch {
    return [];
  }
};

/**
 * Store permissions in localStorage after login
 * @param {string[]} permissions
 */
export const storePermissions = (permissions) => {
  localStorage.setItem('permissions', JSON.stringify(permissions));
};

/**
 * Clear permissions on logout
 */
export const clearPermissions = () => {
  localStorage.removeItem('permissions');
};
