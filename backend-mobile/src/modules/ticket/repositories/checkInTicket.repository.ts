import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/database/prisma/prisma.service";
import { Result, Ok, Err } from "oxide.ts";
import { CheckInTicketResponseData } from "../commands/checkInTicket/checkInTicket-response.dto";

@Injectable()
export class CheckInTicketRepository {
  constructor(private readonly prisma: PrismaService) {}

  async checkInTicket(id: string, email: string, eventId: number): Promise<Result<CheckInTicketResponseData, Error>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        console.log(`User with email ${email} not found`)
        return Err(new Error(`User with email ${email} not found`))
      }

      const hasPermission = await this.checkPermissionToCheckin(eventId, user.id);

      if (!hasPermission) {
        console.log('You do not have permission to check in ticket')
        return Err(new Error('You do not have permission to check in ticket'));
      }

      const existing = await this.prisma.ticketQRCode.findUnique({
        where: {
          id
        },
        select: {
          isCheckedIn: true,
        },
      });

      if (!existing) {
        return Err(new Error('Ticket not found'));
      }

      if (existing.isCheckedIn) {
        return Err(new Error('Ticket has been checked in'));
      }

      const updatedTicket = await this.prisma.ticketQRCode.update({
        where: { id },
        data: {
          isCheckedIn: true,
          checkedBy: email
        }
      });

      return Ok({id});
    } catch (error) {
      return Err(new Error('Failed to check in ticket'));
    }
  }

  async getEventById(eventId: number) {
    return this.prisma.events.findUnique({
      where: { id: eventId },
      select: { id: true, organizerId: true },
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

  async checkPermissionToCheckin(eventId: number, userId: string): Promise<boolean> {
    const member = await this.getMember(eventId, userId);
    if (!member || member.isDeleted) {
      return false;
    }

    const role = await this.prisma.eventRole.findUnique({
      where: { id: member.role }
    });

    if (!role) {
      return false;
    }

    return role.checkin;
  }
}