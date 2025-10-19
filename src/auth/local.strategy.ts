import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const employee = await this.authService.validateEmployee({
      email,
      password,
    });
    if (!employee) {
      throw new BadRequestException(
        `Invalid email or password. Please try again.`,
      );
    }
    return employee;
  }
}
