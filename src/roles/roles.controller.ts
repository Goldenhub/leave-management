import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import {
  assignPermissionsDTO,
  createRoleDTO,
  updateRoleDTO,
} from './dto/role.dto';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('roles')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Permissions('role:read', 'role:manage')
  async fetchAll() {
    const roles = await this.rolesService.getRoles();
    return {
      statusCode: 200,
      message: 'Roles fetched successfully',
      data: roles,
    };
  }

  @Get(':id')
  @Permissions('role:view', 'role:manage')
  async fetchById(@Param('id') id: string) {
    console.log(typeof id);
    const role = await this.rolesService.getRoleById(Number(id));
    if (!role) {
      return {
        statusCode: 404,
        message: 'Role not found',
      };
    }
    return {
      statusCode: 200,
      message: 'Role fetched successfully',
      data: role,
    };
  }

  @Post()
  @Permissions('role:create', 'role:manage')
  async create(@Body() input: createRoleDTO) {
    try {
      const response = await this.rolesService.create(input);
      if (response) {
        return {
          statusCode: 201,
          message: 'Role created successfully',
          data: response,
        };
      } else {
        return {
          statusCode: 400,
          message: 'Role creation failed',
        };
      }
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'Internal server error',
      };
    }
  }

  @Put(':id')
  @Permissions('role:update', 'role:manage')
  async update(
    @Param('id') id: number,
    @Body() input: Partial<Omit<updateRoleDTO, 'id'>>,
  ) {
    const response = await this.rolesService.update({ id, ...input });
    if (response) {
      return {
        statusCode: 200,
        message: 'Role updated successfully',
        data: response,
      };
    } else {
      return {
        statusCode: 400,
        message: 'Role update failed',
      };
    }
  }

  @Patch(':id/permissions')
  @Permissions('role:assignPermissions', 'role:manage')
  async assignPermissions(
    @Param('id') id: number,
    @Body() input: Pick<assignPermissionsDTO, 'permissions'>,
  ) {
    const response = await this.rolesService.assignPermissions({
      ...input,
      id,
    });
    if (!response) {
      return {
        statusCode: 400,
        message: 'Assigning permissions failed',
      };
    }
    return {
      statusCode: 200,
      message: 'Permissions assigned successfully',
      data: response,
    };
  }
}
