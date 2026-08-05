import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NegativeFeedbackAlert } from './notifications.service';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly whatsappToken: string;
  private readonly phoneNumberId: string;

  constructor(private configService: ConfigService) {
    this.whatsappToken = this.configService.get<string>('WHATSAPP_TOKEN', '');
    this.phoneNumberId = this.configService.get<string>(
      'WHATSAPP_PHONE_NUMBER_ID',
      '',
    );
  }

  /**
   * Send a feedback alert via WhatsApp Cloud API.
   * If WhatsApp Cloud API is not configured, falls back to WhatsApp URL API
   * (generates a clickable link that opens WhatsApp with the message).
   */
  async sendFeedbackAlert(
    toPhone: string,
    alert: NegativeFeedbackAlert,
  ): Promise<{ method: string; success: boolean }> {
    const message = this.buildAlertMessage(alert);

    // If WhatsApp Cloud API is configured, use it
    if (this.whatsappToken && this.phoneNumberId) {
      return this.sendViaCloudApi(toPhone, message);
    }

    // Fallback: log the message that would be sent (and generate wa.me link)
    const waLink = this.generateWhatsAppLink(toPhone, message);
    this.logger.log(
      `[WhatsApp Fallback] Message for ${toPhone}:\n${message}\n\nDirect link: ${waLink}`,
    );

    // In production without Cloud API, you could use a third-party service
    // For now, we log it and return success (the notification was "processed")
    return { method: 'log', success: true };
  }

  /**
   * Send message via WhatsApp Cloud API (Meta Business)
   */
  private async sendViaCloudApi(
    toPhone: string,
    message: string,
  ): Promise<{ method: string; success: boolean }> {
    const phone = this.cleanPhoneNumber(toPhone);
    const url = `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.whatsappToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone,
          type: 'text',
          text: { body: message },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`WhatsApp API error: ${response.status} - ${error}`);
      }

      this.logger.log(`WhatsApp Cloud API message sent to ${phone}`);
      return { method: 'cloud_api', success: true };
    } catch (error) {
      this.logger.error(`WhatsApp Cloud API failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Build the alert message text
   */
  private buildAlertMessage(alert: NegativeFeedbackAlert): string {
    const stars = '⭐'.repeat(alert.rating) + '☆'.repeat(5 - alert.rating);
    const timestamp = new Date(alert.createdAt).toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      dateStyle: 'short',
      timeStyle: 'short',
    });

    let message = `🚨 *Alerta de Feedback Negativo*\n\n`;
    message += `📍 *Sede:* ${alert.locationName}\n`;
    message += `⭐ *Calificacion:* ${stars} (${alert.rating}/5)\n`;
    message += `📅 *Fecha:* ${timestamp}\n`;

    if (alert.comment) {
      message += `\n💬 *Comentario:*\n"${alert.comment}"\n`;
    }

    if (alert.clientName || alert.clientEmail || alert.clientPhone) {
      message += `\n👤 *Cliente:*\n`;
      if (alert.clientName) message += `   Nombre: ${alert.clientName}\n`;
      if (alert.clientEmail) message += `   Email: ${alert.clientEmail}\n`;
      if (alert.clientPhone) message += `   Tel: ${alert.clientPhone}\n`;
    } else {
      message += `\n👤 *Cliente:* Anonimo\n`;
    }

    message += `\n⚡ *Accion recomendada:* Contactar al cliente lo antes posible para resolver su inquietud.`;
    message += `\n\n---\nEnviado por LocalRank Feedback`;

    return message;
  }

  /**
   * Generate a wa.me link (fallback when Cloud API is not available)
   */
  private generateWhatsAppLink(phone: string, message: string): string {
    const cleanPhone = this.cleanPhoneNumber(phone);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  /**
   * Clean phone number: remove spaces, dashes, parentheses. Keep + prefix or add country code.
   */
  private cleanPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    // Remove leading + for wa.me format
    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }
    return cleaned;
  }
}
