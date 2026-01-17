import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { createDepartmentDTO } from './dto/department.dto';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('departments')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class DepartmentsController {
  constructor(private departmentService: DepartmentsService) {}

  @Post()
  @Permissions('department:create', 'department:manage')
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

  @Patch()
  @Permissions('department:update', 'department:manage')
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
