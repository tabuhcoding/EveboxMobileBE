import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetEventRolesRepository } from '../../repositories/getEventRoles.repository';

@Injectable()
export class GetEventRoleByIdService {
  constructor(private readonly repository: GetEventRolesRepository) {}

  async execute(currentEmail: string, roleId: number) {
    // const isOrganizer = await this.repository.isOrganizer(currentEmail);
    // if (!isOrganizer) {
    //   throw new ForbiddenException('Only organizers can access roles.');
    // }

    const role = await this.repository.findById(roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return {
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
    };
  }
}
