import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmployeesModule } from 'src/employees/employees.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONSTANT, JWT_EXPIRATION } from 'src/constants/jwt.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeesService } from 'src/employees/employees.service';
import { StringValue } from 'ms';

@Module({
  imports: [
    EmployeesModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_CONSTANT,
      signOptions: { expiresIn: JWT_EXPIRATION as StringValue },
    }),
  ],
  providers: [AuthService, EmployeesService, JwtStrategy, PrismaService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
