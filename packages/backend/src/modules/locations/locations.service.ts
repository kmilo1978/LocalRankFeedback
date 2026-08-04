import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async create(accountId: string, dto: CreateLocationDto) {
    const slug = this.generateSlug(dto.name);

    return this.prisma.location.create({
      data: {
        accountId,
        name: dto.name,
        address: dto.address,
        phone: dto.phone,
        googlePlaceId: dto.googlePlaceId,
        googleReviewUrl: dto.googleReviewUrl,
        feedbackSlug: slug,
        branding: dto.branding || {},
        settings: dto.settings || {},
      },
    });
  }

  async findAll(accountId: string) {
    return this.prisma.location.findMany({
      where: { accountId, active: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, accountId: string) {
    const location = await this.prisma.location.findFirst({
      where: { id, accountId },
    });

    if (!location) {
      throw new NotFoundException('Sede no encontrada');
    }

    return location;
  }

  async findBySlug(slug: string) {
    const location = await this.prisma.location.findUnique({
      where: { feedbackSlug: slug },
      select: {
        id: true,
        name: true,
        feedbackSlug: true,
        googleReviewUrl: true,
        branding: true,
        settings: true,
        active: true,
      },
    });

    if (!location || !location.active) {
      throw new NotFoundException('Sede no encontrada');
    }

    return location;
  }

  async update(id: string, accountId: string, dto: UpdateLocationDto) {
    await this.findOne(id, accountId);

    return this.prisma.location.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: string, accountId: string) {
    await this.findOne(id, accountId);

    return this.prisma.location.update({
      where: { id },
      data: { active: false, updatedAt: new Date() },
    });
  }

  private generateSlug(name: string): string {
    const base = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const suffix = uuidv4().slice(0, 6);
    return `${base}-${suffix}`;
  }
}
