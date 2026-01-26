import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { createDepartmentDTO } from './dto/department.dto';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('departments')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class DepartmentsController {
  constructor(private readonly departmentService: DepartmentsService) {}

  @Get()
  @Permissions('department:read', 'department:manage')
  async fetchAll() {
    const departments = await this.departmentService.getDepartments();
    return {
      statuscode: 200,
      message: 'Departments fetched successfully',
      data: departments,
    };
  }

  @Get(':id')
  @Permissions('department:view', 'department:manage')
  async fetchOne(@Param('id') id: string) {
    const department = await this.departmentService.getDepartment(id);

    return {
      statuscode: 200,
      message: 'Department fetched successfully',
      data: department,
    };
  }

  @Post()
  @Permissions('department:create', 'department:manage')
  async create(@Body() input: createDepartmentDTO) {
    const department = await this.departmentService.create(input);
    return {
      statuscode: 201,
      message: 'Department created successfully',
      data: {
        ...department,
      },
    };
  }

  @Put(':id')
  @Permissions('department:update', 'department:manage')
  async update(
    @Body() input: Partial<createDepartmentDTO>,
    @Param('id') id: string,
  ) {
    const department = await this.departmentService.update(input, id);
    return {
      statuscode: 200,
      message: 'Department updated successfully',
      data: {
        ...department,
      },
    };
  }

  @Delete(':id')
  @Permissions('department:delete', 'department:manage')
  async delete(@Param('id') id: string) {
    await this.departmentService.delete(id);
    return {
      statuscode: 200,
      message: 'Department deleted successfully',
    };
  }
}
