import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformsService } from './platforms.service';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Review Platforms')
@Controller()
export class PlatformsController {
  constructor(private readonly platformsService: PlatformsService) {}

  // === Public endpoint (for feedback form) ===
  @Get('public/feedback/:slug/platforms')
  @ApiOperation({ summary: 'Get active review platforms for a location (public)' })
  async getPublicPlatforms(@Param('slug') slug: string) {
    return this.platformsService.getActivePlatformsForSlug(slug);
  }

  @Post('public/platforms/:id/click')
  @ApiOperation({ summary: 'Track a click on a review platform link' })
  async trackClick(@Param('id') id: string) {
    await this.platformsService.trackClick(id);
    return { success: true };
  }

  // === Protected endpoints ===
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('locations/:locationId/platforms')
  @ApiOperation({ summary: 'Add a review platform to a location' })
  async create(
    @Param('locationId') locationId: string,
    @CurrentUser('accountId') accountId: string,
    @Body() dto: CreatePlatformDto,
  ) {
    return this.platformsService.create(locationId, accountId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('locations/:locationId/platforms')
  @ApiOperation({ summary: 'List review platforms for a location' })
  async findAll(
    @Param('locationId') locationId: string,
    @CurrentUser('accountId') accountId: string,
  ) {
    return this.platformsService.findAllByLocation(locationId, accountId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('locations/:locationId/platforms/:id')
  @ApiOperation({ summary: 'Update a review platform' })
  async update(
    @Param('locationId') locationId: string,
    @Param('id') id: string,
    @CurrentUser('accountId') accountId: string,
    @Body() dto: Partial<CreatePlatformDto>,
  ) {
    return this.platformsService.update(id, locationId, accountId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('locations/:locationId/platforms/:id')
  @ApiOperation({ summary: 'Remove a review platform' })
  async remove(
    @Param('locationId') locationId: string,
    @Param('id') id: string,
    @CurrentUser('accountId') accountId: string,
  ) {
    return this.platformsService.remove(id, locationId, accountId);
  }
}
