/**
 * RBAC Permission Utility
 * Reads the logged-in admin's permissions from localStorage.
 * Used throughout the frontend to conditionally show/hide UI elements.
 */

export const ALL_PERMISSIONS = [
  'Manage Users',
  'Manage Employees',
  'Role & Permission Management',
  'Lead Management',
  'Assign Lead to Employee',
  'Status Management',
  'View Loan Applications',
  'Approve/Reject/Hold Loan',
  'Verify Documents',
  'Download Documents',
  'Send Reminders/SMS',
  'View Reports',
  'Export Data',
  'Payroll/Salary',
];

// Default permissions per role (used as fallback for mock logins)
export const ROLE_PERMISSIONS = {
  admin: ALL_PERMISSIONS,
  hr_admin: ['Manage Employees', 'View Reports', 'Payroll/Salary'],
  operation_admin: [
    'Manage Users', 'View Loan Applications', 'Verify Documents',
    'Download Documents', 'Send Reminders/SMS', 'View Reports', 'Export Data'
  ],
  sales_admin: [
    'Lead Management', 'Assign Lead to Employee', 'Status Management',
    'Send Reminders/SMS', 'View Reports'
  ],
  credit_admin: [
    'View Loan Applications', 'Approve/Reject/Hold Loan',
    'Verify Documents', 'Download Documents', 'View Reports'
  ],
  accountant: ['View Loan Applications', 'View Reports', 'Export Data', 'Payroll/Salary'],
  loan_officer: ['View Loan Applications', 'Verify Documents'],
  telecaller: ['Lead Management', 'Send Reminders/SMS'],
};

/**
 * Check if the current user has a specific permission
 * @param {string} permission - The permission key to check
 * @returns {boolean}
 */
export const hasPermission = (permission) => {
  try {
    const stored = localStorage.getItem('permissions');
    if (stored) {
      const perms = JSON.parse(stored);
      return Array.isArray(perms) && perms.includes(permission);
    }
    // Fallback: derive from role
    const role = localStorage.getItem('userRole') || 'admin';
    const roleKey = role.toLowerCase().replace(/ /g, '_');
    const rolePerms = ROLE_PERMISSIONS[roleKey] || [];
    return rolePerms.includes(permission);
  } catch {
    return false;
  }
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
