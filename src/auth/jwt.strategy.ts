import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_CONSTANT } from '../constants/jwt.constant';
import { PrismaService } from 'src/prisma/prisma.service';
// import { Employee } from 'prisma/prisma-clients/admin';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTANT || 'default',
    });
  }

  async validate(payload: { employeeId: string; email: string }) {
    const employee = await this.prisma.employee.findUnique({
      where: { employeeId: payload.employeeId, email: payload.email },
      select: { employeeId: true, email: true, role: true },
    });

    if (!employee) {
      throw new UnauthorizedException('Employee not found');
    }

    return employee;
  }
}
