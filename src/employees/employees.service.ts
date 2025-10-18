import { Injectable, NotFoundException } from '@nestjs/common';
import prisma from '../prisma/prisma.middleware';
import { createEmployeeDTO } from './dto/employee.dto';

@Injectable()
export class EmployeesService {
  async create(input: createEmployeeDTO) {
    const email = input.email?.trim()?.toLowerCase();

    const department = await prisma.department.findFirst({
      where: { id: input.departmentId },
    });

    if (!department) {
      throw new NotFoundException(
        'Department not found. Create the department first',
      );
    }

    const employeeId = await this.generateEmployeeId(department.code);

    const role = await prisma.role.findFirst({
      where: { id: input.roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found. Create the role first');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { departmentId, roleId, ...employeeData } = input;
    const employee = await prisma.employee.create({
      data: {
        ...employeeData,
        email,
        employeeId,
        employmentStatus: input.employmentStatus,
        department: { connect: { id: department.id } },
        role: { connect: { id: role.id } },
      },
    });

    //   send mail to be implemented

    return { id: employee.id };
  }

  async getAllEmployees() {
    const employees = await prisma.employee.findMany({
      include: { role: true },
    });
    return employees;
  }

  async getEmployeeById(employeeId: number) {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { role: true },
    });

    return employee;
  }

  async findByEmail(email: string) {
    console.log(email);

    const employee = await prisma.employee.findUnique({
      where: { email },
      include: { role: true },
    });

    return employee;
  }

  async generateEmployeeId(departmentCode: string) {
    departmentCode = departmentCode.toUpperCase();
    // get the total count of employees
    const count = ((await prisma.employee.count()) + 1)
      .toString()
      .padStart(5, '0');
    // generate employee id
    const employeeId = `${departmentCode}-${count}`;

    return employeeId;
  }
}
