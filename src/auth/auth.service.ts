import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from './otp.service';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/schemas/user.schema';
import { LoggerService } from 'src/logger/logger.service';
import { TwilioService } from 'src/notification/twilio.service';
import { Login2faDto, LoginUserDto } from 'src/user/dto/user-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: LoggerService,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly twilioService: TwilioService,
  ) { }

  async handleUserLogin(userDto: LoginUserDto): Promise<any> {
    const user = await this.userService.findUserByMail(userDto.email);

    if (user && await bcrypt.compare(userDto.password, user.password)) {
      this.logger.log(`User validated: ${userDto.email}`);

      const token = uuidv4();
      const otp = await this.otpService.generateOtp(token, user);

      if (process.env.IS_EMAIL_ACTIVE === 'true') {
        await this.twilioService.sendNotification({ phoneNumber: user.phoneNumber, mailAddress: user.email, message: `Your OTP code is ${otp}`, type: 'mail' });
      }

      if (process.env.IS_SMS_ACTIVE === 'true') {
        await this.twilioService.sendNotification({ phoneNumber: user.phoneNumber, mailAddress: user.email, message: `Your OTP code is ${otp}`, type: 'sms' });
      }

      return { message: `Token: ${token}`, status: 'success' };
    }

    const message = `User coult not be found with the given email address: ${userDto.email}`;
    this.logger.warn(message);
    return { message: message, status: 'success' };
  }

  async handleUserLogin2fa(loginDto: Login2faDto): Promise<any> {
    const data = await this.otpService.validateOtp(loginDto.token);

    if (data) {
      const { otp, user } = JSON.parse(data);

      if (loginDto.otp === otp) {
        const token = await this.generateJwt(user);

        this.logger.log(`User logged in: ${user.email}`);
        return { message: `Token: ${token}`, status: 'success' };
      }
    }

    return { message: `Token is not valid`, status: 'error' };
  }

  async generateJwt(user: User): Promise<string> {
    const payload = { username: user.username, userMail: user.email, sub: user._id };

    return this.jwtService.sign(payload);
  }
}
