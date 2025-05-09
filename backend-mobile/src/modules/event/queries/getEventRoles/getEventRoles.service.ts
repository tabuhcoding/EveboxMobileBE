import { ForbiddenException, Injectable } from '@nestjs/common';
import { GetEventRolesRepository } from '../../repositories/getEventRoles.repository';

@Injectable()
export class GetEventRolesService {
  constructor(private readonly repository: GetEventRolesRepository) {}

  async execute(currentEmail: string) {
    // const isOrganizer = await this.repository.isOrganizer(currentEmail);

    // if (!isOrganizer) {
    //   throw new ForbiddenException('Access denied: Only event organizers can view roles.');
    // }

    const roles = await this.repository.findAllRoles();

    return roles.map(role => ({
      role: role.id,
      isEdited: role.isEdited,
      isSummarized: role.isSummarized,
      viewVoucher: role.viewVoucher,
      marketing: role.marketing,
      viewOrder: role.viewOrder,
      viewSeatmap: role.viewSeatmap,
      viewMember: role.viewMember,
      checkin: role.checkin,
      checkout: role.checkout,
      redeem: role.redeem,
    }));
  }
}
