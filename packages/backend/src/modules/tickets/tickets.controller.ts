import { Controller, Get, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('locations/:locationId/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar tickets internos de una sede' })
  async findAll(
    @Param('locationId') locationId: string,
    @CurrentUser('accountId') accountId: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ticketsService.findAllByLocation(locationId, accountId, {
      status,
      page,
      limit,
    });
  }

  @Patch(':ticketId')
  @ApiOperation({ summary: 'Actualizar ticket (status, notas, asignacion)' })
  async update(
    @Param('locationId') locationId: string,
    @Param('ticketId') ticketId: string,
    @CurrentUser('accountId') accountId: string,
    @Body() dto: UpdateTicketDto,
  ) {
    return this.ticketsService.update(ticketId, locationId, accountId, dto);
  }
}
