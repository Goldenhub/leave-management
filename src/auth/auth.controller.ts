import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { Designation, Employee, Role } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() input: LoginDTO) {
    const employee = await this.authService.validateEmployee(input);

    if (!employee) {
      throw new BadRequestException(
        'Invalid email or password. Please try again.',
      );
    }

    const result = this.authService.login(
      employee as Employee & { role: Role; designation: Designation },
    );

    return {
      statuscode: 200,
      message: 'Logged in successfully',
      data: {
        ...result,
      },
    };
  }
}
