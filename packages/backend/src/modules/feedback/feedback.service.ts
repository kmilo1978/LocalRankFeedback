import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';
import { LocationsService } from '../locations/locations.service';

export interface FeedbackResult {
  feedbackId: string;
  action: 'redirect_google' | 'captured_private';
  googleReviewUrl?: string;
  message: string;
}

@Injectable()
export class FeedbackService {
  constructor(
    private prisma: PrismaService,
    private locationsService: LocationsService,
  ) {}

  /**
   * Submit feedback from public form (Review Gate logic)
   * - Rating 4-5: redirect to Google review
   * - Rating 1-3: capture privately + create ticket
   */
  async submitFeedback(
    slug: string,
    dto: SubmitFeedbackDto,
    ip?: string,
    userAgent?: string,
  ): Promise<FeedbackResult> {
    const location = await this.locationsService.findBySlug(slug);
    const threshold = (location.settings as any)?.reviewGateThreshold || 4;

    // Create or find contact if data provided
    let contactId: string | undefined;
    if (dto.email || dto.phone || dto.name) {
      const contact = await this.prisma.contact.upsert({
        where: {
          locationId_email: {
            locationId: location.id,
            email: dto.email || `anonymous-${Date.now()}@noemail.local`,
          },
        },
        update: {
          name: dto.name || undefined,
          phone: dto.phone || undefined,
        },
        create: {
          locationId: location.id,
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          source: 'feedback',
        },
      });
      contactId = contact.id;

      // Register consent if provided
      if (dto.consentChannels && dto.consentChannels.length > 0) {
        const consents = dto.consentChannels.map((channel) => ({
          contactId: contact.id,
          channel,
          granted: true,
          ipAddress: ip,
          userAgent,
        }));

        await this.prisma.consent.createMany({ data: consents });
      }
    }

    // Create feedback record
    const feedback = await this.prisma.feedback.create({
      data: {
        locationId: location.id,
        contactId,
        rating: dto.rating,
        comment: dto.comment,
        directedToGoogle: dto.rating >= threshold,
        ipAddress: ip,
        userAgent,
      },
    });

    // If negative feedback, create internal ticket
    if (dto.rating < threshold) {
      await this.prisma.internalTicket.create({
        data: {
          locationId: location.id,
          feedbackId: feedback.id,
          status: 'open',
        },
      });

      // TODO: Send notification to business owner (email/WhatsApp)

      return {
        feedbackId: feedback.id,
        action: 'captured_private',
        message:
          (location.branding as any)?.negativeMessage ||
          'Gracias por tu feedback. Lo tendremos en cuenta para mejorar.',
      };
    }

    // Positive feedback - redirect to Google
    return {
      feedbackId: feedback.id,
      action: 'redirect_google',
      googleReviewUrl: location.googleReviewUrl || undefined,
      message:
        (location.branding as any)?.positiveMessage ||
        'Nos alegra que hayas tenido una buena experiencia! Te invitamos a compartirla en Google.',
    };
  }

  /**
   * Get all feedback for a location (panel view)
   */
  async findAllByLocation(
    locationId: string,
    accountId: string,
    options?: { page?: number; limit?: number; rating?: number },
  ) {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { locationId };
    if (options?.rating) {
      where.rating = options.rating;
    }

    // Verify location belongs to account
    await this.locationsService.findOne(locationId, accountId);

    const [data, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          contact: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      this.prisma.feedback.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get feedback stats for a location
   */
  async getStats(locationId: string, accountId: string) {
    await this.locationsService.findOne(locationId, accountId);

    const [total, avgRating, distribution, directedToGoogle] =
      await Promise.all([
        this.prisma.feedback.count({ where: { locationId } }),
        this.prisma.feedback.aggregate({
          where: { locationId },
          _avg: { rating: true },
        }),
        this.prisma.feedback.groupBy({
          by: ['rating'],
          where: { locationId },
          _count: { rating: true },
        }),
        this.prisma.feedback.count({
          where: { locationId, directedToGoogle: true },
        }),
      ]);

    return {
      total,
      averageRating: avgRating._avg.rating
        ? Math.round(avgRating._avg.rating * 100) / 100
        : 0,
      directedToGoogle,
      distribution: distribution.reduce(
        (acc, item) => {
          acc[item.rating] = item._count.rating;
          return acc;
        },
        {} as Record<number, number>,
      ),
    };
  }
}
