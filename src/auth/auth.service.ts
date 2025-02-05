import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoggerService } from 'src/logger/logger.service';
import { TwilioService } from 'src/notification/twilio.service';
import { OtpService } from 'src/redis/otp.service';
import { LoginUserDto } from 'src/user/dto/user-dto';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly twilioService: TwilioService,
    private readonly logger: LoggerService,
  ) {}

  async validateUser(usetDto: LoginUserDto): Promise<User | null> {
    const user = await this.userService.findUser(usetDto.username);

    if (user && await bcrypt.compare(usetDto.password, user.password)) {
      this.logger.log(`User validated: ${usetDto.username}`);
      return user;
    }
    
    this.logger.warn(`User validation failed: ${usetDto.username}`);
    return null;
  }

  async generateJwt(user: User): Promise<string> {
    const payload = { username: user.username, sub: user.id };

    return this.jwtService.sign(payload);
  }

  async handleUserAuthentication(user: User | null, otpPhoneNumber: string): Promise<{ message: string, status: string }> {
    if (user || user !== null) {
      const token = await this.generateJwt(user);
      const otp = await this.otpService.generateOtp(otpPhoneNumber);
      await this.twilioService.sendNotification({ phoneNumber: otpPhoneNumber, message: `Your OTP code is ${otp}`, type: 'sms' });

      this.logger.log(`User authenticated: ${user.username}`);
      return { message: `Token: ${token}`, status: 'success' };
    }

    this.logger.warn('User authentication failed');
    return { message: 'Invalid username or password', status: 'error' };
  }
}
