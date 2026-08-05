import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RewardsService {
  private readonly logger = new Logger(RewardsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Called after positive feedback (4-5 stars).
   * Checks if location has reward config, creates a scheduled coupon.
   */
  async scheduleRewardIfConfigured(
    locationId: string,
    feedbackId: string,
    contactId?: string,
  ): Promise<{ scheduled: boolean; sendAt?: Date }> {
    const config = await this.prisma.rewardConfig.findFirst({
      where: { locationId, active: true },
    });

    if (!config) {
      return { scheduled: false };
    }

    // Check monthly limit
    if (config.maxPerMonth) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const count = await this.prisma.rewardCoupon.count({
        where: {
          locationId,
          configId: config.id,
          createdAt: { gte: startOfMonth },
        },
      });

      if (count >= config.maxPerMonth) {
        this.logger.log(`Monthly coupon limit reached for location ${locationId}`);
        return { scheduled: false };
      }
    }

    // Generate unique code
    const code = this.generateCouponCode();

    // Calculate send time
    const sendAt = new Date(Date.now() + config.delayMinutes * 60 * 1000);

    // Calculate expiration
    const expiresAt = new Date(sendAt.getTime() + config.expirationDays * 24 * 60 * 60 * 1000);

    // Create coupon
    await this.prisma.rewardCoupon.create({
      data: {
        configId: config.id,
        locationId,
        feedbackId,
        contactId,
        code,
        rewardTitle: config.rewardTitle,
        rewardDescription: config.rewardDescription,
        status: 'pending',
        sendAt,
        expiresAt,
        channel: config.channel,
      },
    });

    this.logger.log(
      `Reward coupon "${code}" scheduled for ${sendAt.toISOString()} ` +
      `(${config.delayMinutes} min delay) at location ${locationId}`,
    );

    return { scheduled: true, sendAt };
  }

  /**
   * Process pending coupons that are due to be sent.
   * Called by a cron job or queue worker.
   */
  async processPendingCoupons(): Promise<number> {
    const now = new Date();

    const pendingCoupons = await this.prisma.rewardCoupon.findMany({
      where: {
        status: 'pending',
        sendAt: { lte: now },
      },
      take: 50, // Process in batches
    });

    let sent = 0;

    for (const coupon of pendingCoupons) {
      try {
        // TODO: Send via WhatsApp/SMS/Email using NotificationsService
        // For now, mark as sent
        await this.prisma.rewardCoupon.update({
          where: { id: coupon.id },
          data: { status: 'sent', sentAt: now },
        });
        sent++;
        this.logger.log(`Coupon ${coupon.code} sent`);
      } catch (error) {
        this.logger.error(`Failed to send coupon ${coupon.code}: ${error.message}`);
      }
    }

    return sent;
  }

  /**
   * Redeem a coupon (business marks it as used)
   */
  async redeemCoupon(code: string) {
    const coupon = await this.prisma.rewardCoupon.findUnique({
      where: { code },
    });

    if (!coupon) return { success: false, message: 'Cupon no encontrado' };
    if (coupon.status === 'redeemed') return { success: false, message: 'Cupon ya fue canjeado' };
    if (coupon.status === 'expired') return { success: false, message: 'Cupon expirado' };
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      await this.prisma.rewardCoupon.update({
        where: { id: coupon.id },
        data: { status: 'expired' },
      });
      return { success: false, message: 'Cupon expirado' };
    }

    await this.prisma.rewardCoupon.update({
      where: { id: coupon.id },
      data: { status: 'redeemed', redeemedAt: new Date() },
    });

    return { success: true, coupon };
  }

  /**
   * Get reward config for a location
   */
  async getConfig(locationId: string) {
    return this.prisma.rewardConfig.findFirst({
      where: { locationId },
    });
  }

  /**
   * Create or update reward config
   */
  async upsertConfig(locationId: string, data: {
    rewardTitle: string;
    rewardDescription: string;
    delayMinutes?: number;
    channel?: string;
    expirationDays?: number;
    maxPerMonth?: number;
    minRating?: number;
    active?: boolean;
  }) {
    const existing = await this.prisma.rewardConfig.findFirst({
      where: { locationId },
    });

    if (existing) {
      return this.prisma.rewardConfig.update({
        where: { id: existing.id },
        data,
      });
    }

    return this.prisma.rewardConfig.create({
      data: { locationId, ...data },
    });
  }

  /**
   * Get coupon stats for a location
   */
  async getStats(locationId: string) {
    const [total, sent, redeemed, pending] = await Promise.all([
      this.prisma.rewardCoupon.count({ where: { locationId } }),
      this.prisma.rewardCoupon.count({ where: { locationId, status: 'sent' } }),
      this.prisma.rewardCoupon.count({ where: { locationId, status: 'redeemed' } }),
      this.prisma.rewardCoupon.count({ where: { locationId, status: 'pending' } }),
    ]);

    return {
      total,
      sent,
      redeemed,
      pending,
      redemptionRate: sent > 0 ? Math.round((redeemed / sent) * 100) : 0,
    };
  }

  private generateCouponCode(): string {
    return `LR-${uuidv4().slice(0, 8).toUpperCase()}`;
  }
}
