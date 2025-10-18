export const PERMISSIONS: Record<string, string[]> = {
  department: ['create', 'read', 'view', 'update', 'delete', 'manage'],
  employee: ['create', 'read', 'view', 'update', 'delete', 'manage'],
  role: ['create', 'read', 'view', 'update', 'delete', 'manage'],
  profile: ['view', 'update'],
  leave: ['create', 'read', 'view', 'update', 'delete', 'manage'],
  leaveType: ['create', 'read', 'view', 'update', 'delete', 'manage'],
};
