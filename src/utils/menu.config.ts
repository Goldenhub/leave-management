export interface MenuLinks {
  label: string;
  icon?: string;
  permissions?: string[];
  url: string;
  subLinks?: MenuLinks[];
}

export const MenuConfig: MenuLinks[] = [
  {
    label: 'Overview',
    url: '/dashboard',
    icon: 'dashboard',
    permissions: ['dashboard:view'],
  },
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
    permissions: ['configuration:view', 'configuration:manage'],
    subLinks: [
      {
        label: 'Leave Types',
        url: '/leave-types',
        permissions: ['leaveType:view', 'leaveType:manage'],
      },
      {
        label: 'Employees',
        url: '/employees',
        permissions: ['employee:view', 'employee:manage'],
      },
      {
        label: 'Departments',
        url: '/departments',
        permissions: ['department:view', 'department:manage'],
      },
      {
        label: 'Designations',
        url: '/designations',
        permissions: ['designation:view', 'designation:manage'],
      },
      {
        label: 'Roles & Permissions',
        url: '/roles-permissions',
        permissions: ['role:view', 'role:manage'],
      },
    ],
  },
  {
    label: 'Reports',
    url: '/reports',
    icon: 'chart',
    permissions: ['report:view', 'report:manage'],
  },
];
