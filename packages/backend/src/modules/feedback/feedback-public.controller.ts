import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { FeedbackService } from './feedback.service';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';
import { LocationsService } from '../locations/locations.service';

@ApiTags('Public - Feedback')
@Controller('public/feedback')
export class FeedbackPublicController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly locationsService: LocationsService,
  ) {}

  @Get(':slug')
  @ApiOperation({ summary: 'Obtener configuracion del formulario de feedback' })
  @ApiResponse({ status: 200, description: 'Configuracion del formulario' })
  @ApiResponse({ status: 404, description: 'Sede no encontrada' })
  async getFormConfig(@Param('slug') slug: string) {
    return this.locationsService.findBySlug(slug);
  }

  @Post(':slug')
  @ApiOperation({ summary: 'Enviar feedback (formulario publico)' })
  @ApiResponse({ status: 201, description: 'Feedback registrado' })
  @ApiResponse({ status: 404, description: 'Sede no encontrada' })
  async submitFeedback(
    @Param('slug') slug: string,
    @Body() dto: SubmitFeedbackDto,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.feedbackService.submitFeedback(slug, dto, ip, userAgent);
  }
}
