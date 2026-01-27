import { IsNumber, IsString } from 'class-validator';

export class CreateLeaveBalanceDto {
  @IsNumber()
  id: number;

  @IsString()
  employeeId: string;

  @IsNumber()
  leaveTypeId: number;

  @IsNumber()
  year: number;

  @IsNumber()
  allocatedDays: number;

  @IsNumber()
  usedDays: number;

  @IsNumber()
  remainingDays: number;
}
