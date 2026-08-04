import {
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  IsEmail,
  IsArray,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitFeedbackDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Excelente atencion, muy profesionales', required: false })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ example: 'Maria Garcia', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'maria@email.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+57 300 123 4567', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: ['email', 'whatsapp'],
    enum: ['email', 'sms', 'whatsapp', 'push'],
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsIn(['email', 'sms', 'whatsapp', 'push'], { each: true })
  @IsOptional()
  consentChannels?: string[];
}
