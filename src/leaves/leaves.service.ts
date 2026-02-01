import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import prisma from '../prisma/prisma.middleware';
import {
  ApproveLeaveDto,
  CreateLeaveDto,
  GenerateApprovalChainDto,
} from './dto/leave.dto';
import { Employee } from '@prisma/client';
import { differenceInBusinessDays, differenceInMonths } from 'date-fns';
import { LeaveStatus } from './enums/leave.enum';

@Injectable()
export class LeavesService {
  async getLeaves() {
    return prisma.leave.findMany();
  }

  async generateApprovalChain(input: GenerateApprovalChainDto) {
    const chain: { approverId: string; level: number }[] = [];
    let level = 1;

    let current = await prisma.employee.findUnique({
      where: {
        employeeId: input.employeeId,
      },
      include: { manager: true },
    });

    while (current?.manager) {
      const approver = {
        approverId: current.manager.employeeId,
        level,
      };
      chain.push(approver);
      current = await prisma.employee.findUnique({
        where: {
          employeeId: current.manager.employeeId,
        },
        include: { manager: true },
      });
      level++;
    }

    return chain;
  }

  /**
   * Creates a leave
   *
   * @param input: CreateLeaveDto
   * @returns created leave
   */
  async createLeave(employeeId: string, input: CreateLeaveDto) {
    // Get leave types with requirements
    const leaveType = await prisma.leaveType.findUnique({
      where: {
        id: Number(input.leaveTypeId),
      },
      include: {
        requirements: true,
      },
    });

    if (!leaveType) {
      throw new NotFoundException('Leave type not found');
    }

    // Check requirements
    for (const requirement of leaveType.requirements) {
      switch (requirement.type) {
        case 'MIN_SERVICE': {
          const staff = await prisma.employee.findUnique({
            where: {
              employeeId,
            },
          });
          const monthsWorked = differenceInMonths(
            new Date(),
            (staff as Employee).createdAt,
          );
          if (monthsWorked < Number(requirement.value)) {
            throw new BadRequestException(
              `Minimum service of ${requirement.value} months required`,
            );
          }
          break;
        }
        case 'DOCUMENT': {
          if (
            !input.attachments?.some(
              (attachment) => attachment.type === requirement.value,
            )
          ) {
            throw new BadRequestException(
              `Attachment of type "${requirement.value}" is required for this leave type`,
            );
          }
          break;
        }
      }
    }

    // Generate approval chain
    const approvalChain = await this.generateApprovalChain({
      employeeId,
    });

    const { attachments, ...leaveDataWithoutAttachments } = input;
    const leave = await prisma.leave.create({
      data: {
        ...leaveDataWithoutAttachments,
        leaveTypeId: Number(input.leaveTypeId),
        employeeId,
        approvals: {
          create: approvalChain.map((approval) => ({
            approverId: approval.approverId,
            level: approval.level,
          })),
        },
        attachments: {
          create: attachments?.map((attachment) => ({
            type: attachment.type,
            url: attachment.url,
          })),
        },
      },
      include: {
        approvals: true,
        attachments: true,
      },
    });

    const duration =
      differenceInBusinessDays(
        new Date(input.endDate),
        new Date(input.startDate),
      ) + 1;

    // create leave balance
    await prisma.leaveBalance.create({
      data: {
        employeeId: employeeId,
        leaveTypeId: Number(input.leaveTypeId),
        year: new Date().getFullYear(),
        allocatedDays: duration,
        usedDays: 0,
        remainingDays: duration,
      },
    });

    return leave;
  }

  async cancelLeave(leaveId: number, employeeId: string) {
    const leave = await prisma.leave.update({
      where: {
        id: Number(leaveId),
        employeeId,
      },
      data: {
        status: 'Canceled',
      },
    });

    return leave;
  }

  /**
   * Approve/Reject a leave
   *
   * @param input: ApproveLeaveDto
   * @returns Leave id and status
   */
  async approveLeave(
    leaveId: number,
    input: ApproveLeaveDto,
  ): Promise<{ leaveId: number; status: string }> {
    const leave = await prisma.leave.findUnique({
      where: {
        id: Number(leaveId),
      },
      include: {
        approvals: true,
      },
    });

    if (!leave) {
      throw new NotFoundException('Leave not found');
    }

    const approval = leave.approvals.find(
      (approval) =>
        approval.approverId === input.approverId &&
        approval.decision === 'Pending',
    );

    if (!approval) {
      throw new ForbiddenException('Not authorized to approve now');
    }

    await prisma.leaveApproval.update({
      where: {
        id: approval.id,
      },
      data: {
        decision: input.decision,
        comment: input.comment,
      },
    });

    const allApprovals = await prisma.leaveApproval.findMany({
      where: {
        leaveId: Number(leaveId),
      },
    });

    let newStatus: 'Approved' | 'Rejected' | 'Pending' = 'Pending';

    if (allApprovals.some((approval) => approval.decision === 'Rejected')) {
      newStatus = 'Rejected';
    } else if (
      allApprovals.every((approval) => approval.decision === 'Approved')
    ) {
      newStatus = 'Approved';
    }

    if (newStatus !== leave.status) {
      await prisma.leave.update({
        where: {
          id: Number(leaveId),
        },
        data: {
          status: newStatus,
        },
      });
    }

    return {
      leaveId: Number(leaveId),
      status: newStatus,
    };
  }

  async getMyLeaves(employeeId: string, status: LeaveStatus) {
    const leaves = await prisma.leave.findMany({
      where: {
        employeeId,
        status,
      },
      include: {
        leaveType: true,
        approvals: {
          include: {
            approver: {
              include: {
                department: true,
                designation: true,
              },
            },
          },
        },
      },
    });

    return leaves;
  }

  async getLeavesPendingMyApprovals(employeeId: string) {
    const pendingApprovals = await prisma.leave.findMany({
      where: {
        status: 'Pending',
        approvals: {
          some: {
            approverId: employeeId,
          },
        },
      },
      include: {
        employee: true,
        attachments: true,
        approvals: true,
      },
    });

    const result = pendingApprovals
      .map((pendingApproval) => {
        return {
          ...pendingApproval,
          approvals: pendingApproval.approvals.filter((approval) => {
            const previousLevel = approval.level - 1;
            if (
              (approval.approverId === employeeId &&
                previousLevel !== 0 &&
                pendingApproval.approvals[previousLevel - 1].decision ===
                  'Approved') ||
              (approval.approverId === employeeId &&
                approval.level === 1 &&
                pendingApproval.approvals[0].decision === 'Pending')
            ) {
              return true;
            } else {
              return false;
            }
          }),
        };
      })
      .filter((pendingApproval) => pendingApproval.approvals.length > 0);

    return result;
  }
}
