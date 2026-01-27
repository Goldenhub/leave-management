export interface MenuLinks {
  label: string;
  icon?: string;
  permissions?: string[];
  url: string;
  subLinks?: MenuLinks[];
}

export const MenuConfig: MenuLinks[] = [
  {
    label: 'Leaves',
    url: '/leaves',
    icon: 'viewList',
    permissions: ['leave:view', 'leave:manage'],
    subLinks: [
      {
        label: 'My leaves',
        url: '/my-leaves',
        permissions: ['leave:view', 'leave:manage'],
      },
      {
        label: 'Approvals',
        url: '/approvals',
        permissions: ['leave:approve', 'leave:manage'],
      },
    ],
  },
  {
    label: 'Configuration',
    icon: 'gear',
    url: '/configuration',
    permissions: [
      'configuration:create',
      'configuration:update',
      'configuration:delete',
      'configuration:manage',
    ],
    subLinks: [
      {
        label: 'Leave Types',
        url: '/leave-types',
        permissions: [
          'leaveType:create',
          'leaveType:update',
          'leaveType:delete',
          'leaveType:manage',
        ],
      },
      {
        label: 'Employees',
        url: '/employees',
        permissions: [
          'employee:create',
          'employee:update',
          'employee:delete',
          'employee:manage',
        ],
      },
      {
        label: 'Departments',
        url: '/departments',
        permissions: [
          'department:create',
          'department:update',
          'department:delete',
          'department:manage',
        ],
      },
      {
        label: 'Designations',
        url: '/designations',
        permissions: [
          'designation:create',
          'designation:update',
          'designation:delete',
          'designation:manage',
        ],
      },
      {
        label: 'Roles & Permissions',
        url: '/roles-permissions',
        permissions: [
          'role:create',
          'role:update',
          'role:delete',
          'role:manage',
        ],
      },
    ],
  },
  {
    label: 'Reports',
    url: '/reports',
    icon: 'chart',
    permissions: [
      'report:create',
      'report:view',
      'report:read',
      'report:update',
      'report:delete',
      'report:manage',
    ],
  },
];
