import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateLeaveTypeDto } from './dto/leave-type.dto';
import { LeaveTypeService } from './leave-type.service';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('leave-types')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class LeaveTypeController {
  constructor(private leaveTypeService: LeaveTypeService) {}

  @Post()
  @Permissions('leaveType:create', 'leaveType:manage')
  async createLeaveType(@Body() input: CreateLeaveTypeDto) {
    const leaveType = await this.leaveTypeService.createLeaveType(input);

    return {
      statuscode: 201,
      message: 'Leave type created successfully',
      data: leaveType,
    };
  }
}
