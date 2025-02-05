import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AttachmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  filename: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  filePath: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mimeType: string;
}
