import { IsNotEmpty, IsString } from 'class-validator';

export class createDepartmentDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
