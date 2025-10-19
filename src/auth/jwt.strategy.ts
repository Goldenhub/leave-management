import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IJWTPayload } from './auth.interface';
import { ConfigService } from '@nestjs/config';
// import { Employee } from 'prisma/prisma-clients/admin';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  validate(payload: IJWTPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      designation: payload.designation,
      permissions: payload.permissions,
    };
  }
}
