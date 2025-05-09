import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ImagesModule } from '../images/images.module';
import { GetEventOfOrgDetailController } from './queries/getEventOfOrgDetail/getEventOfOrgDetail.controller';
import { GetEventOfOrgDetailService } from './queries/getEventOfOrgDetail/getEventOfOrgDetail.service';
import { GetEventOfOrgDetailRepository } from './repositories/getEventOfOrgDetail.repository';
import { GetEventOfOrgController } from './queries/getEventOfOrg/getEventOfOrg.controller';
import { GetEventOfOrgService } from './queries/getEventOfOrg/getEventOfOrg.service';
import { GetEventOfOrgRepository } from './repositories/getEventOfOrg.repository';
import { GetEventRolesController } from './queries/getEventRoles/getEventRoles.controller';
import { GetEventRoleByIdController } from './queries/getEventRoleById/getEventRoleById.controller';
import { GetEventRolesService } from './queries/getEventRoles/getEventRoles.service';
import { GetEventRolesRepository } from './repositories/getEventRoles.repository';
import { GetEventRoleByIdService } from './queries/getEventRoleById/getEventRoleById.service';
import { GetEventMemberController } from './queries/getEventMember/getEventMember.controller';
import { GetEventMembersService } from './queries/getEventMember/getEventMembers.service';
import { GetEventMemberRepository } from './repositories/getEventMember.repository';

@Module({
  imports: [ScheduleModule.forRoot(), ImagesModule],
  controllers: [
    GetEventOfOrgController,
    GetEventOfOrgDetailController,
    GetEventRolesController,
    GetEventRoleByIdController,
    GetEventMemberController,
  ],
  providers: [
    GetEventOfOrgService,
    GetEventOfOrgRepository,


    GetEventOfOrgDetailService,
    GetEventOfOrgDetailRepository,

    GetEventRolesService,
    GetEventRolesRepository,
    GetEventRoleByIdService,
    GetEventMembersService,
    GetEventMemberRepository
  ]
})

export class EventModule {}