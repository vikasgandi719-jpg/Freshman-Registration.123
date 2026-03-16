export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  BRANCH_ADMIN: 'branch_admin',
  VERIFIER: 'verifier',
  VIEWER: 'viewer',
};

export const ADMIN_ROLE_LABELS = {
  super_admin:  'Super Admin',
  branch_admin: 'Branch Admin',
  verifier:     'Verifier',
  viewer:       'Viewer',
};

export const ADMIN_ROLE_DESCRIPTIONS = {
  super_admin:  'Full access to all features, branches, and settings.',
  branch_admin: 'Manage students and documents within assigned branch.',
  verifier:     'Can verify and reject student documents.',
  viewer:       'Read-only access to student records.',
};

export const ADMIN_ROLE_COLORS = {
  super_admin:  { bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' },
  branch_admin: { bg: '#F0FDF4', text: '#15803D', dot: '#22C55E' },
  verifier:     { bg: '#FFF7ED', text: '#C2410C', dot: '#F97316' },
  viewer:       { bg: '#F8FAFC', text: '#64748B', dot: '#94A3B8' },
};

export const ADMIN_PERMISSIONS = {
  super_admin: [
    'view_all_students',
    'edit_all_students',
    'verify_documents',
    'reject_documents',
    'manage_branches',
    'manage_admins',
    'view_reports',
    'export_data',
    'manage_settings',
  ],
  branch_admin: [
    'view_branch_students',
    'edit_branch_students',
    'verify_documents',
    'reject_documents',
    'view_reports',
  ],
  verifier: [
    'view_branch_students',
    'verify_documents',
    'reject_documents',
  ],
  viewer: [
    'view_branch_students',
  ],
};

export const hasPermission = (role, permission) => {
  const perms = ADMIN_PERMISSIONS[role] || [];
  return perms.includes(permission);
};

export const ADMIN_ROLE_LIST = Object.entries(ADMIN_ROLE_LABELS).map(([value, label]) => ({
  value,
  label,
  description: ADMIN_ROLE_DESCRIPTIONS[value],
  color: ADMIN_ROLE_COLORS[value],
}));