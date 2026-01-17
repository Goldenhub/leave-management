import { Injectable } from '@nestjs/common';
import prisma from '../prisma/prisma.middleware';
import { CreateLeaveTypeDto } from './dto/leave-type.dto';

@Injectable()
export class LeaveTypeService {
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
}
