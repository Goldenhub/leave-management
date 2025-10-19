export const PERMISSIONS: Record<string, string[]> = {
  department: ['create', 'read', 'view', 'update', 'delete', 'manage'],
  employee: ['create', 'read', 'view', 'update', 'delete', 'manage'],
  role: [
    'create',
    'read',
    'view',
    'update',
    'delete',
    'assignPermissions',
    'manage',
  ],
  profile: ['view', 'update'],
  leave: ['create', 'read', 'view', 'update', 'delete', 'approve', 'manage'],
  leaveType: ['create', 'read', 'view', 'update', 'delete', 'manage'],
  report: ['create', 'read', 'view', 'update', 'delete', 'manage'],
};
