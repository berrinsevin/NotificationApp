import { Cacheable } from 'cacheable';
import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class OtpService {
  constructor(
    @Inject('CACHE_INSTANCE') private cacheManager: Cacheable,
  ) { }

  async generateOtp(token: string, user: User): Promise<string> {
    const otp = this.generateNumericOtp();
    await this.cacheManager.set(`otp:${token}`, { otp, user }, '1h');
    return otp;
  }
  
  async validateOtp(token: string): Promise<any> {
    const data = await this.cacheManager.get(`otp:${token}`);

    if (data) {
      return data;
    }

    return null;
  }

  private generateNumericOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
