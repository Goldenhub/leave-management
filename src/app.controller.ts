import { Controller, Get, UseGuards } from '@nestjs/common';
import { Permissions } from './decorators/permissions.decorator';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from './guards/permissions.guard';
import { AppService } from './app.service';

@Controller('app')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('permissions')
  getPermissions() {
    const permissions = this.appService.getPermissions();
    return {
      statuscode: 200,
      message: 'Permissions fetched successfully',
      data: permissions,
    };
  }
}
