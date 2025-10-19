import { ApiProperty } from '@nestjs/swagger';
import { Designation, Role } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsObject,
  IsString,
} from 'class-validator';

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
  @IsString()
  employee_id: string;
  @IsString()
  email: string;
  @IsString()
  first_name?: string;
  @IsString()
  last_name?: string;
  @IsObject()
  role?: Pick<Role, 'id' | 'name' | 'description'>;
  @IsObject()
  designation?: Pick<Designation, 'id' | 'title'>;
  @IsArray()
  @IsString({ each: true })
  permissions: string[];
  @IsBoolean()
  password_updated?: boolean;
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
