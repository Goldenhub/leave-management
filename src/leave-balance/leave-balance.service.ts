import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import prisma from '../prisma/prisma.middleware';

@Injectable()
export class LeaveBalanceService {
  private readonly logger = new Logger(LeaveBalanceService.name);

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

  // Runs every day at midnight UTC
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyUpdate() {
    this.logger.log('Starting daily leave balance update');
    try {
      await this.updateAllBalances();
      this.logger.log('Completed daily leave balance update');
    } catch (err) {
      this.logger.error('Failed to update leave balances', err);
    }
  }

  // Public trigger for on-demand updates
  async triggerUpdate() {
    return this.updateAllBalances();
  }

  private async updateAllBalances() {
    const balances = await prisma.leaveBalance.findMany();

    for (const b of balances) {
      const year = b.year;
      const yearStart = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
      const yearEnd = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

      const leaves = await prisma.leave.findMany({
        where: {
          employeeId: b.employeeId,
          leaveTypeId: b.leaveTypeId,
          status: 'Approved',
          AND: [
            { endDate: { gte: yearStart } },
            { startDate: { lte: yearEnd } },
          ],
        },
      });

      let used = 0;
      for (const l of leaves) {
        const start = l.startDate < yearStart ? yearStart : l.startDate;
        const end = l.endDate > yearEnd ? yearEnd : l.endDate;
        const days =
          Math.floor(
            (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000),
          ) + 1;
        used += Math.max(0, days);
      }

      const remaining = Math.max(0, b.allocatedDays - used);

      if (used !== b.usedDays || remaining !== b.remainingDays) {
        await prisma.leaveBalance.update({
          where: { id: b.id },
          data: { usedDays: used, remainingDays: remaining },
        });
      }
    }
  }
}
