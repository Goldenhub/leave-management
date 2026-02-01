import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import prisma from '../prisma/prisma.middleware';

@Injectable()
export class UploaderService {
  private uploadPath = join(__dirname, '../../uploads');

  constructor() {
    // Ensure the uploads folder exists
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    leaveTypeId: number,
    employeeId: string,
    leaveDuration: number,
  ) {
    const leaveType = await prisma.leaveType.findUnique({
      where: {
        id: leaveTypeId,
      },
    });
    if ((leaveType?.maxDays as number) < leaveDuration) {
      throw new BadRequestException(
        `This leave has a maximum days of ${leaveType?.maxDays}`,
      );
    }

    const existingLeaveOfSameType = await prisma.leave.findFirst({
      where: {
        employeeId,
        leaveTypeId: Number(leaveTypeId),
        status: {
          in: ['Pending', 'Approved'],
        },
      },
    });

    if (existingLeaveOfSameType) {
      throw new ConflictException(
        'You cannot apply for same leave type when there is one that is pending or approved',
      );
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const ext = file.mimetype.split('/')[1];
    const filename = `${timestamp}-${file.originalname}.${ext}`;

    // Save file to local folder
    const dirPath = join(
      this.uploadPath,
      leaveType?.name as string,
      employeeId,
    );
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    const filePath = join(dirPath, filename);
    writeFileSync(filePath, file.buffer);

    // Return file path (you can adjust to return a URL for serving)
    return {
      url: `/uploads/${leaveType?.name}/${employeeId}/${filename}`,
    };
  }
}
