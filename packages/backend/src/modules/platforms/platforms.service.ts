import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LocationsService } from '../locations/locations.service';
import { CreatePlatformDto } from './dto/create-platform.dto';

@Injectable()
export class PlatformsService {
  constructor(
    private prisma: PrismaService,
    private locationsService: LocationsService,
  ) {}

  async create(locationId: string, accountId: string, dto: CreatePlatformDto) {
    await this.locationsService.findOne(locationId, accountId);

    return this.prisma.reviewPlatform.create({
      data: {
        locationId,
        platform: dto.platform,
        name: dto.name,
        url: dto.url,
        icon: dto.icon,
        priority: dto.priority || 0,
      },
    });
  }

  async findAllByLocation(locationId: string, accountId: string) {
    await this.locationsService.findOne(locationId, accountId);

    return this.prisma.reviewPlatform.findMany({
      where: { locationId, active: true },
      orderBy: { priority: 'desc' },
    });
  }

  /**
   * Get active platforms for public form (no auth needed)
   */
  async getActivePlatformsForSlug(slug: string) {
    const location = await this.locationsService.findBySlug(slug);

    return this.prisma.reviewPlatform.findMany({
      where: { locationId: location.id, active: true },
      orderBy: { priority: 'desc' },
      select: {
        id: true,
        platform: true,
        name: true,
        url: true,
        icon: true,
        priority: true,
      },
    });
  }

  async update(id: string, locationId: string, accountId: string, dto: Partial<CreatePlatformDto>) {
    await this.locationsService.findOne(locationId, accountId);

    const platform = await this.prisma.reviewPlatform.findFirst({
      where: { id, locationId },
    });

    if (!platform) throw new NotFoundException('Plataforma no encontrada');

    return this.prisma.reviewPlatform.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, locationId: string, accountId: string) {
    await this.locationsService.findOne(locationId, accountId);

    return this.prisma.reviewPlatform.update({
      where: { id },
      data: { active: false },
    });
  }

  async trackClick(platformId: string) {
    await this.prisma.reviewPlatform.update({
      where: { id: platformId },
      data: { clicks: { increment: 1 } },
    });
  }
}
