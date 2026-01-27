import { BadRequestException, Injectable } from '@nestjs/common';
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
    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname}`;

    // Save file to local folder
    const filepath = join(
      this.uploadPath,
      leaveType?.name as string,
      employeeId,
      filename,
    );
    writeFileSync(filepath, file.buffer);

    // Return file path (you can adjust to return a URL for serving)
    return { url: `/uploads/${leaveType?.name}/${employeeId}/${filename}` };
  }
}
