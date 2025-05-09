import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { EventUserRelationship } from '@prisma/client';
import { GetEventMembersQueryDto } from '../queries/getEventMember/getEventMembers.query.dto';

@Injectable()
export class GetEventMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly roleMap = {
    1: 'organizer',
    2: 'administrator',
    3: 'manager',
    4: 'check-in staff',
    5: 'check-out staff',
    6: 'redeem staff',
  };

  async getEventById(eventId: number) {
    return this.prisma.events.findUnique({
      where: { id: eventId },
      select: { id: true, organizerId: true },
    });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getMember(eventId: number, userId: string) {
    return this.prisma.eventUserRelationship.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });
  }

  async getEventOrganizer(eventId: number) {
    return this.prisma.events.findUnique({
      where: { id: eventId },
      select: { organizerId: true },
    });
  }

  async getMembers(eventId: number, query: GetEventMembersQueryDto) {
    const where = {
      eventId,
      isDeleted: false,
      ...(query.email ? { email: query.email } : {}),
    };

    return this.prisma.eventUserRelationship.findMany({ where });
  }
}
