import { JwtModule } from '@nestjs/jwt';
import { OtpService } from './otp.service';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { Module, forwardRef } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LoggerService } from 'src/logger/logger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioService } from 'src/notification/twilio.service';
import { BasicAuthentication } from './guards/basic.authentication';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '24h' }
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
    CacheModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TwilioService, LoggerService, OtpService, BasicAuthentication],
  exports: [AuthService],
})
export class AuthModule {}
