import { Injectable } from '@nestjs/common';
import prisma from '../prisma/prisma.middleware';

@Injectable()
export class LeaveBalanceService {
  async getBalances() {
    return prisma.leaveBalance.findMany();
  }

  async getBalanceByEmployeeId(employeeId: string) {
    return prisma.leaveBalance.findMany({
      where: {
        employeeId,
      },
      include: {
        leaveType: true,
      },
    });
  }
}
