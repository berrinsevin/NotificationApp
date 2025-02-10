import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class OtpService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async generateOtp(token: string, user: User): Promise<string> {
    const otp = this.generateNumericOtp();
    await this.cacheManager.set(`otp:${token}`, JSON.stringify({ otp, user }), 3600);
    return otp;
  }
  
  async validateOtp(token: string): Promise<any> {
    const data = await this.cacheManager.get(`otp:${token}`);

    if (data) {
        const parsedData = JSON.parse(data as string);
        return parsedData;
    }

    return null;
  }

  private generateNumericOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
