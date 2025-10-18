import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { Employee } from 'generated/prisma/client';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDTO) {
    const employee = await this.authService.validateEmployee(
      body.email,
      body.password,
    );

    if (!employee) {
      throw new BadRequestException(
        'Invalid email or password. Please try again.',
      );
    }

    return this.authService.login(employee as Employee & { role: any });
  }
}
