import { Body, Controller, Post, UseGuards, Request, LoggerService } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '@nestjs/passport';
import { ClientDto } from './dto/client-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OtpService } from 'src/redis/otp.service';

@ApiTags('Notification')
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly otpService: OtpService,
        //private readonly logger: LoggerService,
    ) {}

    // @UseGuards(AuthGuard('jwt'))
    // @Post('send')
    // async sendNotification(@Body() clientDto: ClientDto): Promise<void> {
    //     return await this.notificationService.Notify(clientDto);
    // }

    @UseGuards(AuthGuard('jwt'))
    @Post('send')
    async sendNotification(@Body() clientDto: ClientDto): Promise<any> {
        //const userId = req.user.userId;
        const otpValid = await this.otpService.validateOtp(clientDto);
        
        if (!otpValid) {
            //this.logger.warn(`OTP validation failed for user ${userId}`);
            return { message: 'OTP validation failed' };
        }

        return await this.notificationService.Notify(clientDto);
    }
}
