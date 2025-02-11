import { AuthGuard } from '@nestjs/passport';
import { ClientDto } from './dto/client-dto';
import { NotificationService } from './notification.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Notification')
@ApiBearerAuth()
@ApiBasicAuth()
@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
    ) {}

    @UseGuards(AuthGuard(['jwt', 'basic']))    
    @Post('send')
    async sendNotification(@Body() clientDto: ClientDto): Promise<any> {
        return await this.notificationService.Notify(clientDto);
    }
}
