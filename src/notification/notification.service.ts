import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { ClientDto } from './dto/client-dto';
import { TwilioService } from './twilio.service';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    private readonly twilioService: TwilioService,
    private readonly logger: LoggerService,
    @InjectQueue('notification-queue') private notificationQueue: Queue
  ) {
    this.notificationQueue.process(async (job) => {
      const clientDto: ClientDto = job.data;
      return this.sendNotification(clientDto);
    });
  }

  async Notify(clientDto: ClientDto): Promise<any> {
    await this.notificationQueue.add(clientDto);
    return { message: 'Notification added to the queue', status: 'queued' };
  }

  private async sendNotification(clientDto: ClientDto): Promise<any> {
    try {
      let result: any = await this.twilioService.sendNotification(clientDto);

      if (result?.[0]?.statusCode == 202) {
        this.logger.warn(`Notification sent successfully, ${clientDto.type === 'sms' ? clientDto.phoneNumber : clientDto.mailAddress}`);
        return { message: 'Notification sent successfully', status: 'success' };
      }

      this.logger.warn(`Notification failed to send, ${clientDto.type === 'sms' ? clientDto.phoneNumber : clientDto.mailAddress}`);
      return { message: result.message, status: 'error' };
    } catch (error) {
      console.log(error);
      this.logger.error(`Notification failed to send, ${error.message}`, 'NotificationService');
      return { message: error.message, status: 'error' };
    }
  }
}
