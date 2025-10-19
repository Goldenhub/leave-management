import { Injectable, NotFoundException } from '@nestjs/common';
import prisma from '../prisma/prisma.middleware';
import { createEmployeeDTO, updateEmployeeDTO } from './dto/employee.dto';

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

    const designation = await prisma.designation.findFirst({
      where: { id: input.designationId },
    });

    if (!designation) {
      throw new NotFoundException(
        'Designation not found. Create the designation first',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { departmentId, roleId, designationId, ...employeeData } = input;
    const employee = await prisma.employee.create({
      data: {
        ...employeeData,
        email,
        employeeId,
        employmentDate: new Date(input.employmentDate),
        dateOfBirth: new Date(input.dateOfBirth),
        employmentStatus: input.employmentStatus,
        department: { connect: { id: department.id } },
        role: { connect: { id: role.id } },
        designation: { connect: { id: designation.id } },
      },
    });

    //   send mail to be implemented

    return { id: employee.employeeId };
  }

  async updateEmployee(employeeId: string, input: Partial<updateEmployeeDTO>) {
    const employee = await prisma.employee.findUnique({
      where: { employeeId: employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const updatedEmployee = await prisma.employee.update({
      where: { employeeId: employeeId },
      data: {
        ...input,
      },
    });

    return updatedEmployee;
  }

  async getAllEmployees() {
    const employees = await prisma.employee.findMany({
      include: { role: true },
    });
    return employees;
  }

  async getEmployeeById(employeeId: string) {
    const employee = await prisma.employee.findUnique({
      where: { employeeId: employeeId },
      include: { role: true },
    });

    return employee;
  }

  async findByEmail(email: string) {
    const employee = await prisma.employee.findUnique({
      where: { email },
      include: { role: true, designation: true },
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
