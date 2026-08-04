import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackPublicController } from './feedback-public.controller';
import { FeedbackService } from './feedback.service';
import { LocationsModule } from '../locations/locations.module';

@Module({
  imports: [LocationsModule],
  controllers: [FeedbackController, FeedbackPublicController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
