import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { LoggerService } from 'src/logger/logger.service';
import { TwilioService } from 'src/notification/twilio.service';
import { OtpService } from './otp.service';
import { CacheModule } from '@nestjs/cache-manager';
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
    CacheModule.register(),
    forwardRef(() => UserModule)
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TwilioService, LoggerService, OtpService, BasicAuthentication],
  exports: [AuthService],
})
export class AuthModule {}
