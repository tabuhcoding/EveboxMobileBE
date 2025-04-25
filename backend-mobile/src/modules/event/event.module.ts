import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ImagesModule } from '../images/images.module';
import { GetEventOfOrgController } from './queries/getEventOfOrg/getEventOfOrg.controller';
import { GetEventOfOrgService } from './queries/getEventOfOrg/getEventOfOrg.service';
import { GetEventOfOrgRepository } from './repositories/getEventOfOrg.repository';

@Module({
  imports: [ScheduleModule.forRoot(), ImagesModule],
  controllers: [
    GetEventOfOrgController,
  ],
  providers: [
    GetEventOfOrgService,
    GetEventOfOrgRepository,
  ]
})

export class EventModule {}