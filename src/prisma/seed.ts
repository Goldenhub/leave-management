import { EmploymentStatus } from '@prisma/client';
import prisma from './prisma.middleware';

async function main() {
  console.log('🌱 Seeding database...');

  // --- Departments ---
  const administration = await prisma.department.upsert({
    where: { code: 'ADM' },
    create: { name: 'administration', code: 'ADM' },
    update: {},
  });

  // --- Designations ---
  const systemAdmin = await prisma.designation.upsert({
    where: {
      title_departmentId: {
        title: 'system administrator',
        departmentId: administration.id,
      },
    },
    create: {
      title: 'system administrator',
      departmentId: administration.id,
    },
    update: {},
  });

  // --- Roles ---
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'super admin' },
    create: {
      name: 'super admin',
      description: 'Full system access',
      permissions:
        'department:manage,employee:manage,role:manage,profile:view,profile:update,leave:manage,leaveType:manage,report:manage,designation:manage,configuration:manage',
    },
    update: {},
  });

  await prisma.employee.upsert({
    where: {
      employeeId: administration.code + '-00001',
      email: 'admin@company.com',
    },
    create: {
      employeeId: administration.code + '-00001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'admin@company.com',
      password: 'Admin@1234',
      phone: '08010000001',
      gender: 'Male',
      dateOfBirth: new Date('1990-06-15'),
      address: 'Lagos, Nigeria',
      departmentId: administration.id,
      roleId: superAdminRole.id,
      designationId: systemAdmin.id,
      employmentDate: new Date('2020-01-10'),
      employmentStatus: EmploymentStatus.Active,
      passwordUpdated: true,
    },
    update: {},
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
