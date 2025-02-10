import * as fs from 'fs';
import * as Twilio from 'twilio';
import * as SendGrid from '@sendgrid/mail';
import { ClientDto } from './dto/client-dto';
import { isValidMimeType } from './utilities/utilities';
import { Injectable, BadRequestException } from '@nestjs/common';
import { AttachmentDto } from './dto/attachment-dto';

@Injectable()
export class TwilioService {
  private client: Twilio.Twilio;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const sendGridApiKey = process.env.SENDGRID_API_KEY;

    if (!sendGridApiKey) {
      throw new Error('SendGrid configuration is missing');
    }

    this.client = Twilio(accountSid, authToken);
    SendGrid.setApiKey(sendGridApiKey);
  }

  async sendNotification(clientDto: ClientDto): Promise<any> {
    if (clientDto.type === 'sms') {
      return await this.sendSms(clientDto);
    } else if (clientDto.type === 'mail') {
      return await this.sendEmail(clientDto);
    } else {
      throw new BadRequestException('Invalid notification type. Use "sms" or "mail".');
    }
  }

  private async sendSms(clientDto: ClientDto): Promise<any> {
    const from = process.env.TWILIO_PHONE_NUMBER;

    try {
      const response = await this.client.messages.create({
        body: clientDto.message,
        from: from,
        to: clientDto.phoneNumber,
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  private async sendEmail(clientDto: ClientDto): Promise<any> {
    const from = process.env.SENDGRID_FROM_EMAIL;
    console.log(clientDto);

    if (!from) {
      throw new Error('SendGrid sender email (SENDGRID_FROM_EMAIL) is not configured');
    }

    const validAttachments = clientDto.attachments?.length ? clientDto.attachments.map((attachment: AttachmentDto) => {
      if (!isValidMimeType(attachment.mimeType)) {
        throw new Error(`Invalid MIME type: ${attachment.mimeType}`);
      }
  
      const fileData = fs.readFileSync(attachment.filePath).toString('base64');
      return {
        content: fileData,
        filename: attachment.filename,
        type: attachment.mimeType,
        disposition: 'attachment'
      };
    }) : [];

    try {
      const response = await SendGrid.send({
        to: clientDto.mailAddress,
        from: from,
        subject: 'Notification',
        text: clientDto.message,
        attachments: validAttachments,
      });
      console.log(response);
      return response;

    } catch (error) {
      return error;
    }
  }
}