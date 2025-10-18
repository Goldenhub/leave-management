import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'generated/prisma';
import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  password: string;
}

export class AuthenticatedUserDTO {
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  employee: {
    employee_id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    role?: Pick<Role, 'id' | 'name' | 'description'>;
    permissions: string[];
    password_updated?: boolean;
  };
  @ApiProperty()
  @IsBoolean()
  isAuthenticated: boolean;
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
export class AuthenticatedErrorResponseDTO {
  @ApiProperty()
  @IsString()
  error: string;
  @ApiProperty()
  @IsString()
  status: string;
}
