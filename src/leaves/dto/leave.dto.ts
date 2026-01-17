import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApprovalDecision, LeaveStatus } from '../enums/leave.enum';

export class GenerateApprovalChainDto {
  @IsString()
  employeeId: string;
}

export class LeaveAttachmentDto {
  @IsString()
  type: string; // e.g., 'HOSPITAL_REPORT'

  @IsString()
  url: string; // uploaded file URL
}

export class CreateLeaveDto {
  @IsNumber()
  leaveTypeId: number;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsString()
  reason: string;

  @IsEnum(LeaveStatus, {
    message: 'type must be Pending, Approved, Rejected, Canceled',
  })
  status: LeaveStatus;

  @IsNumber()
  employeeId: string;

  @IsOptional()
  @IsArray()
  attachments?: LeaveAttachmentDto[];
}

export class ApproveLeaveDto {
  @IsString()
  approverId: string;

  @IsNumber()
  leaveId: number;

  @IsEnum(ApprovalDecision, {
    message: 'type must be Pending, Approved, Rejected',
  })
  decision: ApprovalDecision;

  @IsOptional()
  @IsString()
  comment?: string;
}
