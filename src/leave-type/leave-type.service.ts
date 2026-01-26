import { Injectable } from '@nestjs/common';
import prisma from '../prisma/prisma.middleware';
import { CreateLeaveTypeDto, UpdateLeaveTypeDto } from './dto/leave-type.dto';

@Injectable()
export class LeaveTypeService {
  async getLeaveTypes() {
    return prisma.leaveType.findMany({
      include: {
        requirements: true,
      },
    });
  }

  async getLeaveTypeById(id: string) {
    return prisma.leaveType.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        requirements: true,
      },
    });
  }

  /**
   * Creates a leave type with the requirements
   *
   * @param input: CreateLeaveTypeDto
   * @returns LeaveType with the requirements
   */
  async createLeaveType(input: CreateLeaveTypeDto) {
    const leaveType = await prisma.leaveType.create({
      data: {
        name: input.name,
        description: input.description,
        maxDays: input.maxDays,
        requirements: {
          create: input.requirements.map((requirements) => ({
            ...requirements,
          })),
        },
      },
      include: {
        requirements: true,
      },
    });

    return leaveType;
  }

  async updateLeaveType(input: UpdateLeaveTypeDto, id: string) {
    const leaveType = await prisma.leaveType.update({
      where: {
        id: Number(id),
      },
      data: {
        name: input.name,
        description: input.description,
        maxDays: input.maxDays,
        requirements: input.requirements
          ? {
              deleteMany: {},
              create: input.requirements.map((requirements) => ({
                ...requirements,
              })),
            }
          : undefined,
      },
      include: {
        requirements: true,
      },
    });

    return leaveType;
  }

  async deleteLeaveType(id: string) {
    await prisma.leaveType.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
