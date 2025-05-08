import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ImagesModule } from '../images/images.module';
import { GetEventDetailController } from './queries/getEventDetail/getEventDetail.controller';
import { GetEventDetailService } from './queries/getEventDetail/getEventDetail.service';
import { GetEventDetailRepository } from './repositories/getEventDetail.repository';
import { GetEventOfOrgController } from './queries/getEventOfOrg/getEventOfOrg.controller';
import { GetEventOfOrgService } from './queries/getEventOfOrg/getEventOfOrg.service';
import { GetEventOfOrgRepository } from './repositories/getEventOfOrg.repository';

@Module({
  imports: [ScheduleModule.forRoot(), ImagesModule],
  controllers: [
    GetEventOfOrgController,
    GetEventDetailController
  ],
  providers: [
    GetEventOfOrgService,
    GetEventOfOrgRepository,


    GetEventDetailService,
    GetEventDetailRepository
  ]
})

export class EventModule {}