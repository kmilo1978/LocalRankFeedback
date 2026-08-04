import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Feedback')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('locations/:locationId/feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  @ApiOperation({ summary: 'Listar feedback de una sede' })
  async findAll(
    @Param('locationId') locationId: string,
    @CurrentUser('accountId') accountId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('rating') rating?: number,
  ) {
    return this.feedbackService.findAllByLocation(locationId, accountId, {
      page,
      limit,
      rating,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Estadisticas de feedback de una sede' })
  async getStats(
    @Param('locationId') locationId: string,
    @CurrentUser('accountId') accountId: string,
  ) {
    return this.feedbackService.getStats(locationId, accountId);
  }
}
