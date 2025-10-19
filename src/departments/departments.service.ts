import { Injectable } from '@nestjs/common';
import prisma from 'src/prisma/prisma.middleware';
import { createDepartmentDTO } from './dto/department.dto';

@Injectable()
export class DepartmentsService {
  async create(input: createDepartmentDTO) {
    const department = await prisma.department.create({
      data: {
        name: input.name,
        code: input.code,
      },
    });

    return department;
  }

  async update(input: Partial<createDepartmentDTO>) {
    const department = await prisma.department.update({
      where: { code: input.code },
      data: {
        ...input,
      },
    });
    return department;
  }
}
