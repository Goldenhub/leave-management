import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateLeaveTypeDto, UpdateLeaveTypeDto } from './dto/leave-type.dto';
import { LeaveTypeService } from './leave-type.service';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('leave-types')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class LeaveTypeController {
  constructor(private leaveTypeService: LeaveTypeService) {}

  @Get()
  @Permissions('leaveType:read', 'leaveType:manage')
  async getAllLeaveTypes() {
    const leaveTypes = await this.leaveTypeService.getLeaveTypes();
    return {
      statuscode: 200,
      message: 'Leave types fetched successfully',
      data: leaveTypes,
    };
  }

  @Get(':id')
  @Permissions('leaveType:view', 'leaveType:manage')
  async getLeaveTypeById(@Param('id') id: string) {
    const leaveType = await this.leaveTypeService.getLeaveTypeById(id);
    return {
      statuscode: 200,
      message: 'Leave type fetched successfully',
      data: leaveType,
    };
  }

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

  @Put(':id')
  @Permissions('leaveType:update', 'leaveType:manage')
  async updateLeaveType(
    @Body() input: UpdateLeaveTypeDto,
    @Param('id') id: string,
  ) {
    const leaveType = await this.leaveTypeService.updateLeaveType(input, id);

    return {
      statuscode: 200,
      message: 'Leave type updated successfully',
      data: leaveType,
    };
  }

  @Delete(':id')
  @Permissions('leaveType:delete', 'leaveType:manage')
  async deleteLeaveType(@Param('id') id: string) {
    await this.leaveTypeService.deleteLeaveType(id);

    return {
      statuscode: 200,
      message: 'Leave type deleted successfully',
    };
  }
}
