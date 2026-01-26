import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import prisma from 'src/prisma/prisma.middleware';
import { createDepartmentDTO } from './dto/department.dto';

@Injectable()
export class DepartmentsService {
  async getDepartments() {
    const departments = await prisma.department.findMany();
    return departments;
  }

  async getDepartment(id: string) {
    const department = await prisma.department.findFirst({
      where: { id: Number(id) },
    });
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    return department;
  }

  async create(input: createDepartmentDTO) {
    const department = await prisma.department.create({
      data: {
        name: input.name,
        code: input.code,
        description: input.description,
      },
    });

    return department;
  }

  async update(input: Partial<createDepartmentDTO>, id: string) {
    const department = await prisma.department.update({
      where: { id: Number(id) },
      data: {
        ...input,
      },
    });
    return department;
  }

  async delete(id: string) {
    const response = await prisma.designation.findMany({
      where: {
        departmentId: Number(id),
      },
    });
    if (response.length) {
      throw new ConflictException(
        'Cannot delete department with existing designations',
      );
    }
    await prisma.department.delete({
      where: { id: Number(id) },
    });
  }
}
