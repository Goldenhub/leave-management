import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Put,
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

@Controller('leaves')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class LeavesController {
  constructor(
    private leaveService: LeavesService,
    private uploaderService: UploaderService,
  ) {}

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
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // upload files to local folder
    const uploadedAttachments = files?.map(async (file) => {
      const result = await this.uploaderService.uploadFile(
        file,
        input.leaveTypeId,
        input.employeeId,
      );
      return {
        type: file.originalname,
        url: result.url,
      };
    });

    const attachments = await Promise.all(uploadedAttachments);

    const leave = await this.leaveService.createLeave({
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
