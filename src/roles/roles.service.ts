import { Injectable } from '@nestjs/common';
import {
  assignPermissionsDTO,
  createRoleDTO,
  updateRoleDTO,
} from './dto/role.dto';
import { Role } from '@prisma/client';
import prisma from 'src/prisma/prisma.middleware';

@Injectable()
export class RolesService {
  async getRoles(): Promise<Role[]> {
    const roles = await prisma.role.findMany();
    return roles;
  }

  async getRoleById(id: number): Promise<Role | null> {
    const role = await prisma.role.findUnique({
      where: { id },
    });
    return role;
  }

  async create(input: createRoleDTO): Promise<Role> {
    const permissions = input.permissions;
    const role = await prisma.role.create({
      data: {
        ...input,
        permissions,
      },
    });
    return role;
  }

  async update(input: Partial<updateRoleDTO>): Promise<Role | null> {
    const { id, ...data } = input;
    const role = await prisma.role.update({
      where: { id },
      data: {
        ...data,
        permissions: data.permissions,
      },
    });
    return role;
  }

  async assignPermissions(input: assignPermissionsDTO): Promise<Role> {
    const { id, permissions } = input;
    const role = await prisma.role.update({
      where: { id },
      data: {
        permissions,
      },
    });
    return role;
  }
}
