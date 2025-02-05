import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TwilioService } from './twilio.service';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { LoggerService } from 'src/logger/logger.service';
import { OtpService } from 'src/redis/otp.service';
import { RedisService } from 'src/redis/redis.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    BullModule.registerQueue({
      name: 'notification-queue',
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, TwilioService, LoggerService, OtpService, RedisService],
})
export class NotificationModule {}
