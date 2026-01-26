import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class createRoleDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  permissions: string;
}

export class updateRoleDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  permissions?: string;
}

export class assignPermissionsDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ArrayNotEmpty()
  @IsArray()
  @IsString({ each: true })
  permissions: string;
}
