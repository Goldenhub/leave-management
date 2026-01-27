import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApproveLeaveDto, CreateLeaveDto } from './dto/leave.dto';
import { LeavesService } from './leaves.service';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploaderService } from 'src/uploader/uploader.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { IAuthEmployee } from 'src/employees/interface/employee.interface';
import { LeaveStatus } from './enums/leave.enum';
import { getDaysCount } from 'src/utils/helpers.util';

@Controller('leaves')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class LeavesController {
  constructor(
    private leaveService: LeavesService,
    private uploaderService: UploaderService,
  ) {}

  @Get('own')
  @Permissions('leave:read', 'leave:manage')
  async getMyLeaves(
    @CurrentUser() employee: IAuthEmployee,
    @Query('status') status: LeaveStatus,
  ) {
    const myLeaves = await this.leaveService.getMyLeaves(employee.id, status);

    return {
      statuscode: 200,
      message: 'Fetched leaves successfully',
      data: myLeaves,
    };
  }

  @Get('pending')
  @Permissions('leave:approve', 'leave:manage')
  async getLeavesPendingMyApprovals(@CurrentUser() employee: IAuthEmployee) {
    const pendingApprovals =
      await this.leaveService.getLeavesPendingMyApprovals(employee.id);

    return {
      statuscode: 200,
      message: 'Pending leaves retrieved',
      data: pendingApprovals,
    };
  }

  @Post()
  @Permissions('leave:create', 'leave:manage')
  @UseInterceptors(
    FilesInterceptor('attachments', 5, {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Only PNG or PDF files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async createLeave(
    @Body() input: CreateLeaveDto,
    @CurrentUser() employee: IAuthEmployee,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // Get leave duration
    const duration = getDaysCount(input.startDate, input.endDate);

    // upload files to local folder
    const uploadedAttachments = files?.map(async (file) => {
      const result = await this.uploaderService.uploadFile(
        file,
        Number(input.leaveTypeId),
        employee.id,
        duration,
      );
      return {
        type: file.originalname,
        url: result.url,
      };
    });

    const attachments = await Promise.all(uploadedAttachments);

    const leave = await this.leaveService.createLeave(employee.id, {
      ...input,
      attachments,
    });

    return {
      statuscode: 201,
      message: 'Leave created successfully',
      data: leave,
    };
  }

  @Put()
  @Permissions('leave:approve', 'leave:manage')
  async approveLeave(@Body() input: ApproveLeaveDto) {
    const response = await this.leaveService.approveLeave(input);

    return {
      statuscode: 200,
      message:
        response.status === 'Approved' ? 'Leave approved' : 'Leave rejected',
      data: response,
    };
  }
}
