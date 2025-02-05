import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { LoggerService } from 'src/logger/logger.service';
import { OtpService } from 'src/redis/otp.service';
import { TwilioService } from 'src/notification/twilio.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '60m' }
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule)
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TwilioService, LoggerService, OtpService, RedisService],
  exports: [AuthService],
})
export class AuthModule {}
