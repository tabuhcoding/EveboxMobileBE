import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { GetEventMembersQueryDto } from './getEventMembers.query.dto';
import { GetEventMembersResponseDto } from './getEventMembers-response.dto';
import { GetEventMemberRepository } from '../../repositories/getEventMember.repository';
import { Err, Ok, Result } from 'oxide.ts';

@Injectable()
export class GetEventMembersService {
  constructor(private readonly repository: GetEventMemberRepository) {}

  async execute(
    eventId: number,
    currentEmail: string,
    query: GetEventMembersQueryDto,
  ): Promise<Result<GetEventMembersResponseDto, Error>> {
    try {
      const event = await this.repository.getEventOrganizer(eventId);
      if (!event) return Err(new Error('Event not found'));

      const members = await this.repository.getMembers(eventId, query);

      const response: GetEventMembersResponseDto = {
        statusCode: 200,
        message: 'Success',
        data: members.map((m) => ({
          eventId: m.eventId,
          userId: m.userId,
          email: m.email,
          role: m.role,
          role_desc: m.role_desc,
          createdAt: m.createdAt,
          updatedAt: m.updatedAt,
          isDeleted: m.isDeleted,
        })),
      };

      return Ok(response);
    } catch (error) {
      console.error('[GetEventMembersService] Failed:', error);
      return Err(new Error('Failed to fetch members'));
    }
  }
}
