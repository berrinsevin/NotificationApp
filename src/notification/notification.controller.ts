import { AuthGuard } from '@nestjs/passport';
import { ClientDto } from './dto/client-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BasicAuthentication } from 'src/auth/guards/basic.authentication';

@ApiTags('Notification')
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
    ) {}

    @UseGuards(AuthGuard('jwt'), AuthGuard('basic'))
    @Post('send')
    async sendNotification(@Body() clientDto: ClientDto): Promise<any> {
        return await this.notificationService.Notify(clientDto);
    }
}
