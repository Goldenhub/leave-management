import { Injectable } from '@nestjs/common';
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
  ) {
    const leaveType = await prisma.leaveType.findUnique({
      where: {
        id: leaveTypeId,
      },
    });
    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname}`;

    // Save file to local folder
    const filepath = join(this.uploadPath, filename);
    writeFileSync(filepath, file.buffer);

    // Return file path (you can adjust to return a URL for serving)
    return { url: `/uploads/${leaveType?.name}/${employeeId}/${filename}` };
  }
}
