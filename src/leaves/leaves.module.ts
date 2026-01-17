import { Module } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { LeavesController } from './leaves.controller';
import { UploaderService } from 'src/uploader/uploader.service';

@Module({
  providers: [LeavesService, UploaderService],
  controllers: [LeavesController],
})
export class LeavesModule {}
