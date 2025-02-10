import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Login2faDto, LoginUserDto } from 'src/user/dto/user-dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'User Login' })
  @Post('login') 
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.handleUserLogin(loginUserDto);
  }

  @ApiOperation({ summary: 'User Login' })
  @Post('login2fa') 
  async login2fa(@Body() loginUserDto: Login2faDto) {
    return this.authService.handleUserLogin2fa(loginUserDto);
  }
}
