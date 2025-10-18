import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { EmploymentStatus } from 'generated/prisma';

export class createEmployeeDTO {
  @ApiProperty()
  @IsString()
  departmentId: number;
  @ApiProperty()
  @IsString()
  roleId: number;
  @ApiProperty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsString()
  lastName: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty({ required: false })
  @IsString()
  password: string;
  @ApiProperty({ required: false })
  @IsString()
  address: string;
  @ApiProperty()
  @IsString()
  employmentDate: string;
  @ApiProperty({ default: 'Active' })
  @IsEnum(['Active', 'Suspended', 'Terminated'])
  employmentStatus: EmploymentStatus;
}
