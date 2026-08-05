import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReferralsService } from './referrals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Referrals')
@Controller()
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  // === Public: Referral landing page ===
  @Get('public/referral/:code')
  @ApiOperation({ summary: 'Get referral info (public landing page)' })
  async getReferralInfo(@Param('code') code: string) {
    return this.referralsService.getReferralByCode(code);
  }

  @Post('public/referral/:code/click')
  @ApiOperation({ summary: 'Track referral link click' })
  async trackClick(@Param('code') code: string) {
    return this.referralsService.trackClick(code);
  }

  @Post('public/referral/:code/convert')
  @ApiOperation({ summary: 'Register a referral conversion' })
  async convert(
    @Param('code') code: string,
    @Body() dto: { name?: string; phone?: string; email?: string },
  ) {
    return this.referralsService.registerConversion(code, dto);
  }

  // === Protected: Program configuration ===
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('locations/:locationId/referrals/program')
  @ApiOperation({ summary: 'Get referral program config' })
  async getProgram(@Param('locationId') locationId: string) {
    return this.referralsService.getProgram(locationId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('locations/:locationId/referrals/program')
  @ApiOperation({ summary: 'Create/update referral program' })
  async upsertProgram(
    @Param('locationId') locationId: string,
    @Body() dto: {
      name: string;
      rewardReferrer: string;
      rewardReferred: string;
      delayDays?: number;
      minRating?: number;
      maxReferrals?: number;
      expirationDays?: number;
      message?: string;
      active?: boolean;
    },
  ) {
    return this.referralsService.upsertProgram(locationId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('locations/:locationId/referrals')
  @ApiOperation({ summary: 'List referral links and stats' })
  async listReferrals(
    @Param('locationId') locationId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.referralsService.listReferralLinks(locationId, { page, limit });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('locations/:locationId/referrals/stats')
  @ApiOperation({ summary: 'Referral program stats' })
  async getStats(@Param('locationId') locationId: string) {
    return this.referralsService.getStats(locationId);
  }
}
