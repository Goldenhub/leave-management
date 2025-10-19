import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';
import { EmploymentStatus } from '@prisma/client';
import { IsValidPhoneNumber } from 'src/decorators/is-valid-phone-number';

export class createEmployeeDTO {
  @ApiProperty()
  @IsNumber()
  departmentId: number;
  @ApiProperty()
  @IsNumber()
  roleId: number;
  @ApiProperty()
  @IsNumber()
  designationId: number;
  @ApiProperty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsString()
  lastName: string;
  @ApiProperty()
  @IsString()
  gender: 'Male' | 'Female';
  @ApiProperty()
  @IsDateString()
  dateOfBirth: string;
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
  @IsValidPhoneNumber()
  phone: string;
  @ApiProperty()
  @IsDateString()
  employmentDate: string;
  @ApiProperty({ default: 'Active' })
  @IsEnum(['Active', 'Suspended', 'Terminated'])
  employmentStatus: EmploymentStatus;
}

export class updateEmployeeDTO {
  @ApiProperty()
  @IsNumber()
  departmentId: number;
  @ApiProperty()
  @IsNumber()
  roleId: number;
  @ApiProperty()
  @IsNumber()
  designationId: number;
  @ApiProperty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsString()
  lastName: string;
  @ApiProperty({ required: false })
  @IsString()
  address: string;
  @ApiProperty()
  @IsString()
  employmentDate: string;
  @ApiProperty()
  @IsEnum(['Active', 'Suspended', 'Terminated'])
  employmentStatus: EmploymentStatus;
}
