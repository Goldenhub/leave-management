import { Module } from '@nestjs/common';
import { LeaveTypeService } from './leave-type.service';
import { LeaveTypeController } from './leave-type.controller';

@Module({
  providers: [LeaveTypeService],
  controllers: [LeaveTypeController],
})
export class LeaveTypeModule {}
