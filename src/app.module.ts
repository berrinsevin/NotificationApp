import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/NotifyApp'),
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),
    NotificationModule,
    AuthModule,
    UserModule,
    LoggerModule,
  ],
})
export class AppModule { }
