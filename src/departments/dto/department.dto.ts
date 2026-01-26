import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createDepartmentDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
