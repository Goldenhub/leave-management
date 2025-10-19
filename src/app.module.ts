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
  ],
  controllers: [EmployeesController, DepartmentsController, RolesController],
  providers: [
    PrismaService,
    EmployeesService,
    DepartmentsService,
    RolesService,
  ],
})
export class AppModule {}
