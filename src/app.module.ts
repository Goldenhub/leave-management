import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { EmployeesService } from './employees/employees.service';
import { EmployeesController } from './employees/employees.controller';
import { EmployeesModule } from './employees/employees.module';
import { DepartmentsService } from './departments/departments.service';
import { DepartmentsController } from './departments/departments.controller';
import { DepartmentsModule } from './departments/departments.module';
import { RolesService } from './roles/roles.service';
import { RolesController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';
import { LeavesModule } from './leaves/leaves.module';
import { ConfigModule } from '@nestjs/config';
import { LeaveTypeModule } from './leave-type/leave-type.module';
import { UploaderModule } from './uploader/uploader.module';
import { DesignationsModule } from './designations/designations.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { LeaveBalanceModule } from './leave-balance/leave-balance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    EmployeesModule,
    DepartmentsModule,
    RolesModule,
    LeavesModule,
    LeaveTypeModule,
    UploaderModule,
    DesignationsModule,
    LeaveBalanceModule,
  ],
  controllers: [
    EmployeesController,
    DepartmentsController,
    RolesController,
    AppController,
  ],
  providers: [
    PrismaService,
    EmployeesService,
    DepartmentsService,
    RolesService,
    AppService,
  ],
})
export class AppModule {}
