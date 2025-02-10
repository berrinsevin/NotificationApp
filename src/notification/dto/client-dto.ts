import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, ValidateIf } from 'class-validator';
import { AttachmentDto } from './attachment-dto';
import { Type } from 'class-transformer';

export class ClientDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.type === 'sms')
  @Matches(/^\+\d{10,15}$/, { message: 'Phone number must start with + and include the country code.' })
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @ValidateIf((o) => o.type === 'mail')
  @IsEmail({}, { message: 'Email address must be a valid email.' })
  mailAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(sms|mail)$/, { message: 'Type must be either "sms" or "email".' })
  type: string;

  @ApiProperty({ type: [AttachmentDto], isArray: true, default: [] })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[] = []
}
