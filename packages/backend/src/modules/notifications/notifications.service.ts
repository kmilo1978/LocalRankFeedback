import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { WhatsappService } from './whatsapp.service';

export interface NegativeFeedbackAlert {
  // Business info
  locationName: string;
  notifyEmail?: string;
  notifyWhatsapp?: string;
  // Feedback details
  rating: number;
  comment?: string;
  // Client info (if provided)
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  // Meta
  feedbackId: string;
  createdAt: Date;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private emailService: EmailService,
    private whatsappService: WhatsappService,
  ) {}

  /**
   * Send alert to business owner when negative feedback (1-3 stars) is received.
   * Attempts both WhatsApp and Email based on what's configured.
   */
  async sendNegativeFeedbackAlert(alert: NegativeFeedbackAlert): Promise<void> {
    const results: string[] = [];

    // Send WhatsApp notification (priority channel)
    if (alert.notifyWhatsapp) {
      try {
        await this.whatsappService.sendFeedbackAlert(
          alert.notifyWhatsapp,
          alert,
        );
        results.push('whatsapp:sent');
        this.logger.log(
          `WhatsApp alert sent to ${alert.notifyWhatsapp} for feedback ${alert.feedbackId}`,
        );
      } catch (error) {
        results.push('whatsapp:failed');
        this.logger.error(
          `Failed to send WhatsApp alert: ${error.message}`,
          error.stack,
        );
      }
    }

    // Send Email notification
    if (alert.notifyEmail) {
      try {
        await this.emailService.sendFeedbackAlert(alert.notifyEmail, alert);
        results.push('email:sent');
        this.logger.log(
          `Email alert sent to ${alert.notifyEmail} for feedback ${alert.feedbackId}`,
        );
      } catch (error) {
        results.push('email:failed');
        this.logger.error(
          `Failed to send email alert: ${error.message}`,
          error.stack,
        );
      }
    }

    // If no channels configured, log warning
    if (!alert.notifyWhatsapp && !alert.notifyEmail) {
      this.logger.warn(
        `No notification channels configured for location "${alert.locationName}". Feedback ${alert.feedbackId} not notified.`,
      );
    }

    this.logger.log(
      `Notification results for feedback ${alert.feedbackId}: [${results.join(', ')}]`,
    );
  }
}
