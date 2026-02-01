import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LeaveBalanceService } from './leave-balance.service';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from 'src/decorators/permissions.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { IAuthEmployee } from 'src/employees/interface/employee.interface';

@Controller('leaves/balances')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class LeaveBalanceController {
  constructor(private readonly leaveBalanceService: LeaveBalanceService) {}

  //   @Get()
  //   getBalances() {
  //     return this.leaveBalanceService.getBalances();
  //   }

  @Get()
  async getBalanceByEmployeeId(@CurrentUser() employee: IAuthEmployee) {
    const balances = await this.leaveBalanceService.getBalanceByEmployeeId(
      employee.id,
    );

    return {
      statuscode: 200,
      message: 'Fetched balances successfully',
      data: balances,
    };
  }

  @Post('update-now')
  @Permissions('leave-balance:manage')
  async triggerUpdate() {
    await this.leaveBalanceService.triggerUpdate();
    return {
      statuscode: 200,
      message: 'Leave balances updated successfully',
    };
  }
}
