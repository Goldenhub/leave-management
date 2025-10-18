import { Injectable } from '@nestjs/common';
import { Employee, Role } from 'generated/prisma';
import { EmployeesService } from 'src/employees/employees.service';
import { comparePassword } from 'src/utils/helpers.util';
import {
  AuthenticatedErrorResponseDTO,
  AuthenticatedResponseDTO,
} from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly employeesService: EmployeesService,
    private jwtService: JwtService,
  ) {}

  async validateEmployee(
    email: string,
    password: string,
  ): Promise<Partial<Employee & { role: Role }> | null> {
    const employee = await this.employeesService.findByEmail(email);
    if (employee && comparePassword(password, employee.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = employee;
      return result;
    }
    return null;
  }

  login(
    employee:
      | (Partial<Employee> & {
          role: Role;
        })
      | null,
  ): AuthenticatedResponseDTO | AuthenticatedErrorResponseDTO {
    if (!employee) {
      return {
        status: 'error',
        error: 'Invalid email or password',
      };
    }
    const employeePermissions = employee.role.permissions.split(',');
    const permissions = new Set<string>();
    employeePermissions.forEach((permission) => permissions.add(permission));

    const uniquePermissions = Array.from(permissions);
    const role = {
      id: employee.role.id,
      name: employee.role.name,
      description: employee.role.description,
    };

    const payload = {
      email: employee.email,
      employeeId: employee.employeeId as string,
      role,
      permissions: uniquePermissions,
    };

    return {
      status: 'success',
      message: 'Login successful',
      data: {
        access_token: this.jwtService.sign(payload),
        employee: {
          employee_id: employee.employeeId as string,
          email: employee.email as string,
          first_name: employee.firstName as string,
          last_name: employee.lastName as string,
          role,
          permissions: uniquePermissions,
          password_updated: employee.passwordUpdated as boolean,
        },
        isAuthenticated: true,
      },
    };
  }
}
