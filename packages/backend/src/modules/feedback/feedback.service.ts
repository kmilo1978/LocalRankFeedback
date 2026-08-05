import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';
import { LocationsService } from '../locations/locations.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface FeedbackResult {
  feedbackId: string;
  action: 'redirect_google' | 'captured_private';
  googleReviewUrl?: string;
  message: string;
  notificationSent?: boolean;
}

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);

  constructor(
    private prisma: PrismaService,
    private locationsService: LocationsService,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Submit feedback from public form (Review Gate logic)
   * - Rating 4-5: redirect directly to Google Maps Business (GMB) review link
   * - Rating 1-3: capture privately + create ticket + send WhatsApp/Email alert to owner
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

    // ===========================
    // NEGATIVE FEEDBACK (1-3 stars)
    // Create ticket + Send WhatsApp/Email notification to business owner
    // ===========================
    if (dto.rating < threshold) {
      // Create internal ticket
      await this.prisma.internalTicket.create({
        data: {
          locationId: location.id,
          feedbackId: feedback.id,
          status: 'open',
        },
      });

      // Send notification to business owner (WhatsApp + Email)
      const settings = location.settings as any;
      const notifyWhatsapp = settings?.notifyWhatsapp;
      const notifyEmail = settings?.notifyEmail;

      // Fire notification asynchronously (don't block the response)
      this.notificationsService
        .sendNegativeFeedbackAlert({
          locationName: location.name,
          notifyEmail,
          notifyWhatsapp,
          rating: dto.rating,
          comment: dto.comment,
          clientName: dto.name,
          clientEmail: dto.email,
          clientPhone: dto.phone,
          feedbackId: feedback.id,
          createdAt: new Date(),
        })
        .catch((error) => {
          this.logger.error(
            `Failed to send notification for feedback ${feedback.id}: ${error.message}`,
          );
        });

      this.logger.log(
        `Negative feedback received (${dto.rating}/5) at "${location.name}". ` +
          `Ticket created. Notification dispatched to: ` +
          `WhatsApp=${notifyWhatsapp || 'none'}, Email=${notifyEmail || 'none'}`,
      );

      return {
        feedbackId: feedback.id,
        action: 'captured_private',
        notificationSent: !!(notifyWhatsapp || notifyEmail),
        message:
          (location.branding as any)?.negativeMessage ||
          'Gracias por tu feedback. Lo tendremos en cuenta para mejorar. Nuestro equipo ha sido notificado.',
      };
    }

    // ===========================
    // POSITIVE FEEDBACK (4-5 stars)
    // Redirect directly to Google Maps Business review link
    // ===========================
    this.logger.log(
      `Positive feedback received (${dto.rating}/5) at "${location.name}". ` +
        `Redirecting to GMB: ${location.googleReviewUrl || 'no URL configured'}`,
    );

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
