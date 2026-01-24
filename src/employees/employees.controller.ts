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
import { generateMenu } from 'src/utils/helpers.util';
import { MenuConfig } from 'src/utils/menu.config';
import type { Employee } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';

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

  @Get()
  getCurrentEmployee(@CurrentUser() employee: Employee) {
    return {
      statusCode: 200,
      message: 'Current employee fetched',
      data: {
        ...employee,
      },
    };
  }

  @Get('menu')
  async getMenu(@CurrentUser() employee: Employee) {
    const user = await this.employeeService.getEmployeeById(
      employee.employeeId,
    );

    if (!user) {
      throw new NotFoundException('Employee not found');
    }

    const permissions = user.role.permissions.split(',');
    const menu = generateMenu(MenuConfig, permissions);

    return {
      statusCode: 200,
      message: 'Menu fetched successfully',
      data: {
        menu,
      },
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
