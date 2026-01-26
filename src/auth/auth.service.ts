import { Injectable } from '@nestjs/common';
import { Designation, Employee, Role } from '@prisma/client';
import { EmployeesService } from 'src/employees/employees.service';
import { comparePassword } from 'src/utils/helpers.util';
import { AuthenticatedUserDTO, LoginDTO } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly employeesService: EmployeesService,
    private jwtService: JwtService,
  ) {}

  async validateEmployee(input: LoginDTO) {
    const employee = await this.employeesService.findByEmail(input.email);
    const passwordHash = employee?.password as string;
    if (employee && comparePassword(input.password, passwordHash)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = employee;
      return result;
    }
    return null;
  }

  login(
    employee: Employee & {
      role: Role;
      designation: Designation;
    },
  ): AuthenticatedUserDTO {
    const employeePermissions = employee.role.permissions.split(',');
    const permissions = new Set<string>();
    employeePermissions.forEach((permission) => permissions.add(permission));

    const uniquePermissions = Array.from(permissions);
    const role = {
      id: employee.role.id,
      name: employee.role.name,
      description: employee.role.description,
    };
    const designation = {
      id: employee.designation.id,
      title: employee.designation.title,
    };

    const payload = {
      sub: employee.employeeId,
      email: employee.email,
      role: role.name,
      designation: designation.title,
      permissions: uniquePermissions,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        ...employee,
      },
    };
  }
}
