import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LeaveRequirementType } from '../enum/leave-type.enum';

export class CreateLeaveTypeDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  maxDays: number;

  @ValidateNested({ each: true })
  @Type(() => CreateLeaveRequirementDto)
  requirements: CreateLeaveRequirementDto[];
}

export class UpdateLeaveTypeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  maxDays?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateLeaveRequirementDto)
  requirements?: CreateLeaveRequirementDto[];
}

export class CreateLeaveRequirementDto {
  @IsEnum(LeaveRequirementType, {
    message: 'type must be DOCUMENT or MIN_SERVICE',
  })
  type: LeaveRequirementType;

  @IsString()
  value: string;
}
