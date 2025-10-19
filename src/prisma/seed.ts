import { EmploymentStatus, LeaveStatus } from '@prisma/client';
import prisma from './prisma.middleware';

async function main() {
  console.log('🌱 Seeding database...');

  // --- Departments ---
  const [engineering, hr, finance] = await prisma.$transaction([
    prisma.department.upsert({
      where: { code: 'ENG' },
      create: { name: 'engineering', code: 'ENG' },
      update: {},
    }),
    prisma.department.upsert({
      where: { code: 'HR' },
      create: { name: 'human resources', code: 'HR' },
      update: {},
    }),
    prisma.department.upsert({
      where: { code: 'FIN' },
      create: { name: 'finance', code: 'FIN' },
      update: {},
    }),
  ]);

  // --- Designations ---
  const [systemAdmin, softwareEngineer, hrManager, financialAnalyst] =
    await prisma.$transaction([
      prisma.designation.upsert({
        where: {
          title_departmentId: {
            title: 'system administrator',
            departmentId: engineering.id,
          },
        },
        create: {
          title: 'system administrator',
          departmentId: engineering.id,
        },
        update: {},
      }),
      prisma.designation.upsert({
        where: {
          title_departmentId: {
            title: 'software engineer',
            departmentId: engineering.id,
          },
        },
        create: {
          title: 'software engineer',
          departmentId: engineering.id,
        },
        update: {},
      }),
      prisma.designation.upsert({
        where: {
          title_departmentId: { title: 'hr manager', departmentId: hr.id },
        },
        create: {
          title: 'hr manager',
          departmentId: hr.id,
        },
        update: {},
      }),
      prisma.designation.upsert({
        where: {
          title_departmentId: {
            title: 'financial analyst',
            departmentId: finance.id,
          },
        },
        create: {
          title: 'financial analyst',
          departmentId: finance.id,
        },
        update: {},
      }),
    ]);

  // --- Roles ---
  const [superAdminRole, managerRole, staffRole] = await prisma.$transaction([
    prisma.role.upsert({
      where: { name: 'super admin' },
      create: {
        name: 'super admin',
        description: 'Full system access',
        permissions:
          'department:manage,employee:manage,role:manage,profile:view,profile:update,leave:manage,leaveType:manage,report:manage',
      },
      update: {},
    }),
    prisma.role.upsert({
      where: { name: 'manager' },
      create: {
        name: 'manager',
        description: 'Manages team leaves and approvals',
        permissions:
          'department:view,department:read,employee:view,employee:read,role:view,role:read,profile:view,profile:update,leave:create,leave:view,leave:read,leave:update,leave:delete,leave:approve,leaveType:view,leaveType:read,report:create,report:update,report:view,report:read',
      },
      update: {},
    }),
    prisma.role.upsert({
      where: { name: 'staff' },
      create: {
        name: 'staff',
        description: 'Regular employee role',
        permissions:
          'department:view,department:read,employee:view,employee:read,profile:view,profile:update,leave:create,leave:view,leave:read,leave:update,leave:delete,leaveType:view,leaveType:read,report:view,report:read,report:create,report:update',
      },
      update: {},
    }),
  ]);

  // --- Employees ---
  const [admin, manager, staff] = await prisma.$transaction([
    prisma.employee.upsert({
      where: {
        employeeId: engineering.code + '-00001',
        email: 'admin@company.com',
      },
      create: {
        employeeId: engineering.code + '-00001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'admin@company.com',
        password: 'Admin@1234',
        phone: '08010000001',
        gender: 'Male',
        dateOfBirth: new Date('1990-06-15'),
        address: 'Lagos, Nigeria',
        departmentId: engineering.id,
        roleId: superAdminRole.id,
        designationId: systemAdmin.id,
        employmentDate: new Date('2020-01-10'),
        employmentStatus: EmploymentStatus.Active,
        passwordUpdated: true,
      },
      update: {},
    }),
    prisma.employee.upsert({
      where: {
        employeeId: hr.code + '-00001',
        email: 'manager@company.com',
      },
      create: {
        employeeId: hr.code + '-00002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'manager@company.com',
        password: 'Manager@1234',
        phone: '08010000002',
        gender: 'Female',
        dateOfBirth: new Date('1993-02-16'),
        address: 'Abuja, Nigeria',
        departmentId: hr.id,
        roleId: managerRole.id,
        designationId: hrManager.id,
        employmentDate: new Date('2021-05-15'),
        employmentStatus: EmploymentStatus.Active,
        passwordUpdated: true,
      },
      update: {},
    }),
    prisma.employee.upsert({
      where: {
        employeeId: engineering.code + '-00003',
        email: 'staff@company.com',
      },
      create: {
        employeeId: engineering.code + '-00003',
        firstName: 'Mark',
        lastName: 'Adams',
        email: 'staff@company.com',
        password: 'Staff@1234',
        phone: '08010000003',
        gender: 'Male',
        dateOfBirth: new Date('1994-05-22'),
        address: 'Port Harcourt, Nigeria',
        departmentId: finance.id,
        roleId: staffRole.id,
        designationId: financialAnalyst.id,
        employmentDate: new Date('2022-03-20'),
        employmentStatus: EmploymentStatus.Active,
        passwordUpdated: true,
      },
      update: {},
    }),
  ]);

  // --- Leave Types ---
  const [annualLeave, sickLeave, maternityLeave, examStudyLeave] =
    await prisma.$transaction([
      prisma.leaveType.upsert({
        where: { name: 'annual leave' },
        create: {
          name: 'annual leave',
          description: 'Yearly paid time off',
          maxDays: 20,
        },
        update: {},
      }),
      prisma.leaveType.upsert({
        where: { name: 'sick leave' },
        create: {
          name: 'sick leave',
          description: 'Leave due to illness',
          maxDays: 5,
        },
        update: {},
      }),
      prisma.leaveType.upsert({
        where: { name: 'maternity leave' },
        create: {
          name: 'maternity leave',
          description: 'Leave for childbirth and recovery',
          maxDays: 90,
        },
        update: {},
      }),
      prisma.leaveType.upsert({
        where: { name: 'exam and study leave' },
        create: {
          name: 'exam and study leave',
          description: 'Leave for examinations and study purposes',
        },
        update: {},
      }),
    ]);

  await prisma.$transaction([
    prisma.leaveRequirement.upsert({
      where: {
        name_leaveTypeId: {
          name: 'Minimum 6 months of service',
          leaveTypeId: annualLeave.id,
        },
      },
      create: {
        name: 'Minimum 6 months of service',
        leaveTypeId: annualLeave.id,
      },
      update: {},
    }),
    prisma.leaveRequirement.upsert({
      where: {
        name_leaveTypeId: {
          name: 'exam timetable or study proof',
          leaveTypeId: examStudyLeave.id,
        },
      },
      create: {
        uploadRequired: true,
        name: 'exam timetable or study proof',
        leaveTypeId: examStudyLeave.id,
      },
      update: {},
    }),
  ]);

  // --- Sample Leave Request ---

  await prisma.leave.create({
    data: {
      type: 'Annual Leave',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-10'),
      reason: 'Family vacation',
      status: LeaveStatus.Pending as LeaveStatus,
      employeeId: staff.employeeId,
      leaveTypeId: annualLeave.id,
    },
  });

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
