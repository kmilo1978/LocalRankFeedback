import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NegativeFeedbackAlert } from './notifications.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly sendgridApiKey: string;
  private readonly fromEmail: string;

  constructor(private configService: ConfigService) {
    this.sendgridApiKey = this.configService.get<string>(
      'SENDGRID_API_KEY',
      '',
    );
    this.fromEmail = this.configService.get<string>(
      'SENDGRID_FROM_EMAIL',
      'alertas@localrankfeedback.com',
    );
  }

  /**
   * Send feedback alert email to business owner.
   * Uses SendGrid if configured, otherwise logs the email content.
   */
  async sendFeedbackAlert(
    toEmail: string,
    alert: NegativeFeedbackAlert,
  ): Promise<{ method: string; success: boolean }> {
    const subject = `🚨 Feedback negativo (${alert.rating}/5) - ${alert.locationName}`;
    const html = this.buildAlertEmailHtml(alert);

    // If SendGrid is configured, use it
    if (this.sendgridApiKey) {
      return this.sendViaSendGrid(toEmail, subject, html);
    }

    // Fallback: log the email
    this.logger.log(
      `[Email Fallback] To: ${toEmail}\nSubject: ${subject}\n\n${this.buildAlertPlainText(alert)}`,
    );

    return { method: 'log', success: true };
  }

  /**
   * Send email via SendGrid API
   */
  private async sendViaSendGrid(
    to: string,
    subject: string,
    html: string,
  ): Promise<{ method: string; success: boolean }> {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.sendgridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: this.fromEmail, name: 'LocalRank Feedback' },
          subject,
          content: [{ type: 'text/html', value: html }],
        }),
      });

      if (!response.ok && response.status !== 202) {
        const error = await response.text();
        throw new Error(`SendGrid API error: ${response.status} - ${error}`);
      }

      this.logger.log(`Email sent via SendGrid to ${to}`);
      return { method: 'sendgrid', success: true };
    } catch (error) {
      this.logger.error(`SendGrid failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Build HTML email for feedback alert
   */
  private buildAlertEmailHtml(alert: NegativeFeedbackAlert): string {
    const stars = '⭐'.repeat(alert.rating) + '☆'.repeat(5 - alert.rating);
    const timestamp = new Date(alert.createdAt).toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
    });

    const ratingColor =
      alert.rating === 1 ? '#dc2626' : alert.rating === 2 ? '#ea580c' : '#d97706';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <!-- Header -->
    <div style="background-color:${ratingColor};border-radius:12px 12px 0 0;padding:24px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:20px;">🚨 Alerta de Feedback Negativo</h1>
      <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px;">${alert.locationName}</p>
    </div>

    <!-- Body -->
    <div style="background-color:white;padding:24px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <!-- Rating -->
      <div style="text-align:center;margin-bottom:20px;">
        <p style="font-size:32px;margin:0;">${stars}</p>
        <p style="color:#6b7280;font-size:14px;margin:4px 0 0;">Calificacion: ${alert.rating} de 5</p>
      </div>

      <!-- Comment -->
      ${alert.comment ? `
      <div style="background-color:#fef3c7;border-left:4px solid ${ratingColor};padding:16px;border-radius:0 8px 8px 0;margin-bottom:20px;">
        <p style="margin:0;font-size:14px;color:#92400e;font-weight:600;">Comentario del cliente:</p>
        <p style="margin:8px 0 0;font-size:15px;color:#78350f;font-style:italic;">"${alert.comment}"</p>
      </div>
      ` : `
      <div style="background-color:#f9fafb;padding:12px;border-radius:8px;margin-bottom:20px;text-align:center;">
        <p style="margin:0;color:#9ca3af;font-size:14px;">Sin comentario adicional</p>
      </div>
      `}

      <!-- Client Info -->
      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:20px;">
        <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#374151;">👤 Informacion del cliente:</p>
        ${alert.clientName ? `<p style="margin:4px 0;font-size:14px;color:#4b5563;">Nombre: <strong>${alert.clientName}</strong></p>` : ''}
        ${alert.clientEmail ? `<p style="margin:4px 0;font-size:14px;color:#4b5563;">Email: <a href="mailto:${alert.clientEmail}" style="color:#2563eb;">${alert.clientEmail}</a></p>` : ''}
        ${alert.clientPhone ? `<p style="margin:4px 0;font-size:14px;color:#4b5563;">Telefono: <a href="tel:${alert.clientPhone}" style="color:#2563eb;">${alert.clientPhone}</a></p>` : ''}
        ${!alert.clientName && !alert.clientEmail && !alert.clientPhone ? '<p style="margin:4px 0;font-size:14px;color:#9ca3af;">Cliente anonimo</p>' : ''}
      </div>

      <!-- Action -->
      <div style="background-color:#eff6ff;border-radius:8px;padding:16px;text-align:center;">
        <p style="margin:0;font-size:14px;color:#1e40af;font-weight:600;">⚡ Accion recomendada</p>
        <p style="margin:8px 0 0;font-size:14px;color:#1e40af;">Contactar al cliente lo antes posible para resolver su inquietud y evitar una resena negativa publica.</p>
      </div>

      <!-- Metadata -->
      <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;text-align:center;">
        Recibido: ${timestamp} | ID: ${alert.feedbackId}
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:16px;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">
        Enviado por <strong>LocalRank Feedback</strong> | 
        <a href="#" style="color:#2563eb;">Configurar alertas</a>
      </p>
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Build plain text version of the alert (for logging)
   */
  private buildAlertPlainText(alert: NegativeFeedbackAlert): string {
    const stars = '⭐'.repeat(alert.rating) + '☆'.repeat(5 - alert.rating);
    let text = `ALERTA DE FEEDBACK NEGATIVO\n`;
    text += `================================\n`;
    text += `Sede: ${alert.locationName}\n`;
    text += `Calificacion: ${stars} (${alert.rating}/5)\n`;
    text += `Fecha: ${new Date(alert.createdAt).toLocaleString('es-CO')}\n\n`;

    if (alert.comment) {
      text += `Comentario: "${alert.comment}"\n\n`;
    }

    text += `Cliente:\n`;
    text += `  Nombre: ${alert.clientName || 'Anonimo'}\n`;
    text += `  Email: ${alert.clientEmail || 'No proporcionado'}\n`;
    text += `  Telefono: ${alert.clientPhone || 'No proporcionado'}\n\n`;

    text += `Accion: Contactar al cliente para resolver su inquietud.\n`;
    text += `================================\n`;
    text += `LocalRank Feedback | ID: ${alert.feedbackId}`;

    return text;
  }
}
