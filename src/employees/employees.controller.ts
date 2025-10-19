import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { createEmployeeDTO, updateEmployeeDTO } from './dto/employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private employeeService: EmployeesService) {}

  @Post()
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
  async fetchAll() {
    const employees = await this.employeeService.getAllEmployees();

    return {
      statusCode: 200,
      message: 'Employees fetched',
      data: employees,
    };
  }

  @Get(':employeeId')
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
