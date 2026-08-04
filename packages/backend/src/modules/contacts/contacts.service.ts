import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LocationsService } from '../locations/locations.service';

@Injectable()
export class ContactsService {
  constructor(
    private prisma: PrismaService,
    private locationsService: LocationsService,
  ) {}

  async findAllByLocation(
    locationId: string,
    accountId: string,
    options?: { page?: number; limit?: number; search?: string },
  ) {
    await this.locationsService.findOne(locationId, accountId);

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { locationId };
    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { email: { contains: options.search, mode: 'insensitive' } },
        { phone: { contains: options.search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          _count: { select: { feedback: true } },
        },
      }),
      this.prisma.contact.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
