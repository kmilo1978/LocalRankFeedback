import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Dr. Juan Perez' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Clinica Dental Sonrisa' })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({ example: 'juan@clinicasonrisa.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: '+57 300 123 4567', required: false })
  @IsString()
  @IsOptional()
  phone?: string;
}
