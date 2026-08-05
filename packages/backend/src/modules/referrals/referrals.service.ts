import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReferralsService {
  private readonly logger = new Logger(ReferralsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Called after positive feedback. Creates a referral link for the contact
   * if the location has an active referral program.
   */
  async createReferralLinkIfConfigured(
    locationId: string,
    contactId: string,
  ): Promise<{ created: boolean; code?: string; inviteAt?: Date }> {
    const program = await this.prisma.referralProgram.findFirst({
      where: { locationId, active: true },
    });

    if (!program) return { created: false };

    // Check if this contact already has an active link for this program
    const existing = await this.prisma.referralLink.findFirst({
      where: { programId: program.id, contactId, active: true },
    });

    if (existing) return { created: false, code: existing.code };

    // Check max referrals per person
    if (program.maxReferrals) {
      const count = await this.prisma.referralLink.count({
        where: { programId: program.id, contactId },
      });
      if (count >= program.maxReferrals) return { created: false };
    }

    // Generate referral link
    const code = this.generateReferralCode();
    const expiresAt = new Date(Date.now() + program.expirationDays * 24 * 60 * 60 * 1000);
    const inviteAt = new Date(Date.now() + program.delayDays * 24 * 60 * 60 * 1000);

    await this.prisma.referralLink.create({
      data: {
        programId: program.id,
        contactId,
        code,
        expiresAt,
      },
    });

    this.logger.log(
      `Referral link "${code}" created for contact ${contactId}. ` +
      `Invite scheduled for ${inviteAt.toISOString()} (${program.delayDays} days)`,
    );

    return { created: true, code, inviteAt };
  }

  /**
   * Get referral info for public landing page
   */
  async getReferralByCode(code: string) {
    const link = await this.prisma.referralLink.findUnique({
      where: { code },
      include: {
        program: {
          select: {
            name: true,
            rewardReferrer: true,
            rewardReferred: true,
            location: { select: { name: true, branding: true } },
          },
        },
        contact: { select: { name: true } },
      },
    });

    if (!link || !link.active) {
      throw new NotFoundException('Link de referido no encontrado o expirado');
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      throw new NotFoundException('Link de referido expirado');
    }

    return {
      code: link.code,
      referrerName: link.contact.name || 'Un amigo',
      programName: link.program.name,
      rewardForYou: link.program.rewardReferred,
      rewardForReferrer: link.program.rewardReferrer,
      locationName: link.program.location.name,
      branding: link.program.location.branding,
    };
  }

  /**
   * Track a click on referral link
   */
  async trackClick(code: string) {
    const link = await this.prisma.referralLink.findUnique({ where: { code } });
    if (!link) throw new NotFoundException('Link no encontrado');

    await this.prisma.referralLink.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } },
    });

    await this.prisma.referralEvent.create({
      data: { linkId: link.id, type: 'click' },
    });

    return { success: true };
  }

  /**
   * Register a conversion (referred person becomes a client)
   */
  async registerConversion(
    code: string,
    data: { name?: string; phone?: string; email?: string },
  ) {
    const link = await this.prisma.referralLink.findUnique({
      where: { code },
      include: { program: true },
    });

    if (!link || !link.active) {
      throw new NotFoundException('Link de referido no valido');
    }

    // Record conversion event
    await this.prisma.referralEvent.create({
      data: {
        linkId: link.id,
        type: 'conversion',
        referredName: data.name,
        referredPhone: data.phone,
        referredEmail: data.email,
      },
    });

    // Update link stats
    await this.prisma.referralLink.update({
      where: { id: link.id },
      data: { conversions: { increment: 1 } },
    });

    this.logger.log(`Referral conversion registered for link "${code}"`);

    // TODO: Send reward notifications to both referrer and referred
    // via WhatsApp/SMS/Email

    return {
      success: true,
      message: `Referido registrado! Ambos reciben su premio.`,
      rewardReferred: link.program.rewardReferred,
    };
  }

  /**
   * Get program config
   */
  async getProgram(locationId: string) {
    return this.prisma.referralProgram.findFirst({
      where: { locationId },
    });
  }

  /**
   * Create or update referral program
   */
  async upsertProgram(locationId: string, data: {
    name: string;
    rewardReferrer: string;
    rewardReferred: string;
    delayDays?: number;
    minRating?: number;
    maxReferrals?: number;
    expirationDays?: number;
    message?: string;
    active?: boolean;
  }) {
    const existing = await this.prisma.referralProgram.findFirst({
      where: { locationId },
    });

    if (existing) {
      return this.prisma.referralProgram.update({
        where: { id: existing.id },
        data,
      });
    }

    return this.prisma.referralProgram.create({
      data: { locationId, ...data },
    });
  }

  /**
   * List referral links for a location
   */
  async listReferralLinks(locationId: string, options?: { page?: number; limit?: number }) {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const program = await this.prisma.referralProgram.findFirst({
      where: { locationId },
    });

    if (!program) return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };

    const [data, total] = await Promise.all([
      this.prisma.referralLink.findMany({
        where: { programId: program.id },
        include: {
          contact: { select: { name: true, email: true } },
          _count: { select: { events: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.referralLink.count({ where: { programId: program.id } }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  /**
   * Get referral program stats
   */
  async getStats(locationId: string) {
    const program = await this.prisma.referralProgram.findFirst({
      where: { locationId },
    });

    if (!program) return { active: false };

    const [totalLinks, totalClicks, totalConversions] = await Promise.all([
      this.prisma.referralLink.count({ where: { programId: program.id } }),
      this.prisma.referralLink.aggregate({
        where: { programId: program.id },
        _sum: { clicks: true },
      }),
      this.prisma.referralLink.aggregate({
        where: { programId: program.id },
        _sum: { conversions: true },
      }),
    ]);

    const clicks = totalClicks._sum.clicks || 0;
    const conversions = totalConversions._sum.conversions || 0;

    return {
      active: program.active,
      totalLinks,
      totalClicks: clicks,
      totalConversions: conversions,
      conversionRate: clicks > 0 ? Math.round((conversions / clicks) * 100) : 0,
    };
  }

  private generateReferralCode(): string {
    return uuidv4().slice(0, 8).toLowerCase();
  }
}
