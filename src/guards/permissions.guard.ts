import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Request } from 'express';
// import { Role } from '@prisma/client';
import { IAuthEmployee } from 'src/employees/interface/employee.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const employee = request.user as IAuthEmployee;

    const employeePermissions = employee.permissions;

    if (
      !employee ||
      !Array.isArray(employeePermissions) ||
      !employeePermissions.length
    ) {
      throw new ForbiddenException('Permission not granted');
    }

    const hasPermission = requiredPermissions.some((permission) =>
      employeePermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
