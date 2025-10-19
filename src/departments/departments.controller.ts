import { Body, Controller, Post } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { createDepartmentDTO } from './dto/department.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private departmentService: DepartmentsService) {}

  @Post()
  async create(@Body() input: createDepartmentDTO) {
    const department = await this.departmentService.create(input);
    return {
      statusCode: 201,
      message: 'Department created successfully',
      data: {
        ...department,
      },
    };
  }

  async update(@Body() input: Partial<createDepartmentDTO>) {
    const department = await this.departmentService.update(input);
    return {
      statusCode: 200,
      message: 'Department updated successfully',
      data: {
        ...department,
      },
    };
  }
}
