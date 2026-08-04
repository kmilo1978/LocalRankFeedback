import { IsOptional, IsString, IsIn, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTicketDto {
  @ApiProperty({
    example: 'in_progress',
    enum: ['open', 'in_progress', 'resolved', 'dismissed'],
    required: false,
  })
  @IsString()
  @IsIn(['open', 'in_progress', 'resolved', 'dismissed'])
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'Contactar al paciente para resolver', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  assignedTo?: string;
}
