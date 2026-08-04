import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LocationsService } from '../locations/locations.service';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private locationsService: LocationsService,
  ) {}

  async findAllByLocation(
    locationId: string,
    accountId: string,
    options?: { status?: string; page?: number; limit?: number },
  ) {
    await this.locationsService.findOne(locationId, accountId);

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { locationId };
    if (options?.status) {
      where.status = options.status;
    }

    const [data, total] = await Promise.all([
      this.prisma.internalTicket.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          feedback: {
            include: {
              contact: {
                select: { id: true, name: true, email: true, phone: true },
              },
            },
          },
        },
      }),
      this.prisma.internalTicket.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async update(
    ticketId: string,
    locationId: string,
    accountId: string,
    dto: UpdateTicketDto,
  ) {
    await this.locationsService.findOne(locationId, accountId);

    const ticket = await this.prisma.internalTicket.findFirst({
      where: { id: ticketId, locationId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }

    return this.prisma.internalTicket.update({
      where: { id: ticketId },
      data: {
        status: dto.status,
        notes: dto.notes,
        assignedTo: dto.assignedTo,
        resolvedAt: dto.status === 'resolved' ? new Date() : undefined,
        updatedAt: new Date(),
      },
    });
  }
}
