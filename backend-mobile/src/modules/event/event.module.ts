import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ImagesModule } from '../images/images.module';
import { GetEventOfOrgDetailController } from './queries/getEventOfOrgDetail/getEventOfOrgDetail.controller';
import { GetEventOfOrgDetailService } from './queries/getEventOfOrgDetail/getEventOfOrgDetail.service';
import { GetEventOfOrgDetailRepository } from './repositories/getEventOfOrgDetail.repository';
import { GetEventOfOrgController } from './queries/getEventOfOrg/getEventOfOrg.controller';
import { GetEventOfOrgService } from './queries/getEventOfOrg/getEventOfOrg.service';
import { GetEventOfOrgRepository } from './repositories/getEventOfOrg.repository';

@Module({
  imports: [ScheduleModule.forRoot(), ImagesModule],
  controllers: [
    GetEventOfOrgController,
    GetEventOfOrgDetailController
  ],
  providers: [
    GetEventOfOrgService,
    GetEventOfOrgRepository,


    GetEventOfOrgDetailService,
    GetEventOfOrgDetailRepository
  ]
})

export class EventModule {}