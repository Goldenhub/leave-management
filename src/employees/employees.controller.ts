import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { createEmployeeDTO, updateEmployeeDTO } from './dto/employee.dto';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('employees')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class EmployeesController {
  constructor(private employeeService: EmployeesService) {}

  @Post()
  @Permissions('employee:create', 'employee:manage')
  async create(@Body() input: createEmployeeDTO) {
    console.log('ts');
    const employee = await this.employeeService.create(input);
    console.log('tt');
    if (!employee) {
      throw new InternalServerErrorException('Error creating employee');
    }

    return {
      statusCode: 201,
      message: 'Employee created successfully',
      data: {
        ...employee,
      },
    };
  }

  @Get()
  @Permissions('employee:read', 'employee:manage')
  async fetchAll() {
    const employees = await this.employeeService.getAllEmployees();

    return {
      statusCode: 200,
      message: 'Employees fetched',
      data: employees,
    };
  }

  @Get(':employeeId')
  @Permissions('employee:view', 'employee:manage')
  async fetchByEmployeeId(@Param('employeeId') employeeId: string) {
    const employee = await this.employeeService.getEmployeeById(employeeId);

    if (!employee) {
      return new NotFoundException('Employee not found');
    }

    return {
      statusCode: 200,
      message: 'Employee found',
      data: {
        ...employee,
      },
    };
  }

  @Put(':employeeId')
  @Permissions('employee:update', 'employee:manage')
  async update(
    @Param('employeeId') employeeId: string,
    @Body() input: updateEmployeeDTO,
  ) {
    const employee = await this.employeeService.updateEmployee(
      employeeId,
      input,
    );
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return {
      statusCode: 200,
      message: 'Employee updated successfully',
      data: {
        ...employee,
      },
    };
  }

  @Put(':employeeId/role')
  @Permissions('employee:assignRole', 'employee:manage')
  async assignRole(
    @Param('employeeId') employeeId: string,
    @Body('roleId') roleId: number,
  ) {
    const employee = await this.employeeService.updateEmployee(employeeId, {
      roleId,
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return {
      statusCode: 200,
      message: 'Role assigned successfully',
      data: {
        ...employee,
      },
    };
  }
}
