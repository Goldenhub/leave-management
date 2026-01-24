import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEmail, IsString, ValidateNested } from 'class-validator';
import { createEmployeeDTO } from 'src/employees/dto/employee.dto';

export class LoginDTO {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  password: string;
}

export class AuthenticatedUserDTO {
  @IsString()
  access_token: string;
  @ValidateNested()
  @Type(() => createEmployeeDTO)
  user: Partial<Employee>;
}

export class AuthenticatedResponseDTO {
  @ApiProperty()
  data: AuthenticatedUserDTO;
  @ApiProperty()
  @IsString()
  message: string;
  @ApiProperty()
  @IsString()
  status: string;
}
