import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RewardsService } from './rewards.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Rewards')
@Controller()
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  // === Public: Redeem coupon ===
  @Post('public/coupons/:code/redeem')
  @ApiOperation({ summary: 'Redeem a reward coupon' })
  async redeemCoupon(@Param('code') code: string) {
    return this.rewardsService.redeemCoupon(code);
  }

  // === Protected: Config & Stats ===
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('locations/:locationId/rewards/config')
  @ApiOperation({ summary: 'Get reward configuration for a location' })
  async getConfig(@Param('locationId') locationId: string) {
    return this.rewardsService.getConfig(locationId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('locations/:locationId/rewards/config')
  @ApiOperation({ summary: 'Create/update reward configuration' })
  async upsertConfig(
    @Param('locationId') locationId: string,
    @Body() dto: {
      rewardTitle: string;
      rewardDescription: string;
      delayMinutes?: number;
      channel?: string;
      expirationDays?: number;
      maxPerMonth?: number;
      minRating?: number;
      active?: boolean;
    },
  ) {
    return this.rewardsService.upsertConfig(locationId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('locations/:locationId/rewards/stats')
  @ApiOperation({ summary: 'Get reward coupon stats' })
  async getStats(@Param('locationId') locationId: string) {
    return this.rewardsService.getStats(locationId);
  }
}
