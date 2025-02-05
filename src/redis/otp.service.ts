import { Injectable, Logger } from '@nestjs/common';
import { ClientDto } from 'src/notification/dto/client-dto';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from './redis.service';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(private readonly redisService: RedisService) {}

  async generateOtp(phoneNumber: string): Promise<string> {
    const otp = uuidv4().slice(0, 6);
    const redisClient = this.redisService.getClient();
    const redisKey = `otp:${phoneNumber}`;

    await redisClient.set(`otp:${phoneNumber}`, otp, 'EX', 300);
    this.logger.log(`Generated OTP for user ${phoneNumber}: ${otp}`);
    return otp;
  }

  async validateOtp(clientDto: ClientDto): Promise<boolean> {
    const redisClient = this.redisService.getClient();
    const storedOtp = await redisClient.get(`otp:${clientDto.phoneNumber}`);
    
    if (storedOtp === clientDto.otp) {
      await redisClient.del(`otp:${clientDto.phoneNumber}`);
      return true;
    }
    return false;
  }
}
