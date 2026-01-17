import { Module } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(), // use memory so we can save manually
    }),
  ],
  providers: [UploaderService],
})
export class UploaderModule {}
