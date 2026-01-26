import { Injectable } from '@nestjs/common';
import prisma from 'src/prisma/prisma.middleware';
import { CreateDesignationDto } from './dto/designations.dto';

@Injectable()
export class DesignationsService {
  async getDesignations() {
    const designations = await prisma.designation.findMany();
    return designations;
  }

  async getDesignationById(id: string) {
    const designation = await prisma.designation.findUnique({
      where: { id: Number(id) },
    });
    return designation;
  }

  async create(input: CreateDesignationDto) {
    const designation = await prisma.designation.create({
      data: {
        ...input,
      },
    });
    return designation;
  }

  async update(id: string, input: CreateDesignationDto) {
    const designation = await prisma.designation.update({
      where: { id: Number(id) },
      data: {
        ...input,
      },
    });
    return designation;
  }

  async delete(id: string) {
    const designation = await prisma.designation.delete({
      where: { id: Number(id) },
    });
    return designation;
  }
}
