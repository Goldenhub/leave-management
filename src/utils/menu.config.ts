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
    permissions: ['leave:view'],
    subLinks: [
      {
        label: 'My leaves',
        url: '/my-leaves',
        permissions: ['leave:view'],
      },
      { label: 'Approvals', url: '/approvals', permissions: ['leave:approve'] },
    ],
  },
  {
    label: 'Configuration',
    icon: 'gear',
    url: '/configuration',
    permissions: ['configuration:view'],
    subLinks: [
      {
        label: 'Leave Types',
        url: '/leave-types',
        permissions: ['leaveType:view'],
      },
      {
        label: 'Employees',
        url: '/employees',
        permissions: ['employee:view'],
      },
      {
        label: 'Departments',
        url: '/departments',
        permissions: ['department:view'],
      },
      {
        label: 'Designations',
        url: '/designations',
        permissions: ['designation:view'],
      },
      {
        label: 'Roles & Permissions',
        url: '/roles-permissions',
        permissions: ['role:view'],
      },
    ],
  },
  {
    label: 'Reports',
    url: '/reports',
    icon: 'chart',
    permissions: ['report:view'],
  },
];
