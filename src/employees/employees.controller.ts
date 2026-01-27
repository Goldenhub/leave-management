import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import {
  createEmployeeDTO,
  updateEmployeeDTO,
  UpdatePasswordDto,
} from './dto/employee.dto';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { AuthGuard } from '@nestjs/passport';
import { generateMenu } from 'src/utils/helpers.util';
import { MenuConfig } from 'src/utils/menu.config';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { IAuthEmployee } from './interface/employee.interface';

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
      statuscode: 201,
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
      statuscode: 200,
      message: 'Employees fetched',
      data: employees,
    };
  }

  @Get('managers')
  @Permissions('employee:read', 'employee:manage')
  async fetchManagers() {
    const managers = await this.employeeService.getManagers();

    return {
      statuscode: 200,
      message: 'Managers fetched',
      data: managers,
    };
  }

  @Get()
  getCurrentEmployee(@CurrentUser() employee: IAuthEmployee) {
    return {
      statuscode: 200,
      message: 'Current employee fetched',
      data: {
        ...employee,
      },
    };
  }

  @Get('menu')
  async getMenu(@CurrentUser() employee: IAuthEmployee) {
    const user = await this.employeeService.getEmployeeById(employee.id);

    if (!user) {
      throw new NotFoundException('Employee not found');
    }

    const permissions = user.role.permissions.split(',');
    const menu = generateMenu(MenuConfig, permissions);

    return {
      statuscode: 200,
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
      statuscode: 200,
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
      statuscode: 200,
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
      statuscode: 200,
      message: 'Role assigned successfully',
      data: {
        ...employee,
      },
    };
  }

  @Patch('update-password')
  @Permissions('profile:update')
  async updatePassword(
    @CurrentUser() currentUser: IAuthEmployee,
    @Body() input: UpdatePasswordDto,
  ) {
    const employeeId = await this.employeeService.updatePassword(
      currentUser.id,
      input,
    );
    if (!employeeId) {
      throw new NotFoundException('Employee not found');
    }

    return {
      statuscode: 200,
      message: 'Password updated successfully',
      data: {
        id: employeeId,
      },
    };
  }
}
