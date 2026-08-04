import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({ example: 'Sede Principal - Centro' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Calle 50 #10-20, Bogota', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '+57 601 234 5678', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'ChIJN1t_tDeuEmsRUsoyG83frY4', required: false })
  @IsString()
  @IsOptional()
  googlePlaceId?: string;

  @ApiProperty({
    example: 'https://g.page/r/XXXXXXX/review',
    required: false,
  })
  @IsString()
  @IsOptional()
  googleReviewUrl?: string;

  @ApiProperty({
    example: { primaryColor: '#2563eb', thankYouMessage: 'Gracias por tu visita!' },
    required: false,
  })
  @IsObject()
  @IsOptional()
  branding?: Record<string, any>;

  @ApiProperty({
    example: { reviewGateThreshold: 4, notifyEmail: 'admin@clinica.com' },
    required: false,
  })
  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;
}
