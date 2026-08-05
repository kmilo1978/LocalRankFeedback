import { IsString, IsNotEmpty, IsOptional, IsUrl, IsInt, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlatformDto {
  @ApiProperty({ example: 'google', enum: ['google', 'doctoralia', 'facebook', 'tripadvisor', 'yelp', 'trustpilot', 'rappi', 'custom'] })
  @IsString()
  @IsIn(['google', 'doctoralia', 'facebook', 'tripadvisor', 'yelp', 'trustpilot', 'rappi', 'custom'])
  platform: string;

  @ApiProperty({ example: 'Google Maps' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://g.page/r/XXXXX/review' })
  @IsUrl()
  url: string;

  @ApiProperty({ example: '⭐', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ example: 10, required: false })
  @IsInt()
  @IsOptional()
  priority?: number;
}
