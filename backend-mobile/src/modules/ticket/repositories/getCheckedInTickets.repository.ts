import { Injectable } from "@nestjs/common";
import { Result, Ok, Err } from "oxide.ts";
import { PrismaService } from "src/infrastructure/database/prisma/prisma.service";
import { CheckedInTicketsData } from "../queries/getCheckedInTickets/getCheckedInTickets-response.dto";

@Injectable()
export class GetCheckedInTicketsRepository {
  constructor(private readonly prisma: PrismaService) { }

  async getCheckedInTickets(showingId: string, email: string): Promise<Result<CheckedInTicketsData[], Error>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        return Err(new Error(`User with email ${email} not found`))
      }

      const showing = await this.prisma.showing.findUnique({
        where: { id: showingId }
      });

      if (!showing) {
        return Err(new Error('Showing not found'));
      }

      const event = await this.prisma.events.findUnique({
        where:{ id: showing.eventId }
      })

      if (!event) {
        return Err(new Error('Event not found'));
      }

      const hasPermission = await this.checkPermissionToGet(event.id, user.id);

      if (!hasPermission) {
        return Err(new Error('You do not have permission to get checked-in ticket'));
      }

      const tickets = await this.prisma.ticket.findMany({
        where: { 
          showingId,
          TicketQRCode: {
            some: {
              isCheckedIn: true
            }
          }
        },
        select: {
          id: true,
          showingId: true,
          status: true,
          price: true,
          type: true,
          Showing: {
            select: {
              startTime: true,
              endTime: true,
              Events: {
                select: {
                  id: true,
                  title: true,
                  venue: true,
                  locations: {
                    select: {
                      id: true,
                      street: true,
                      ward: true,
                      districtId: true,
                      createdAt: true,
                      districts: {
                        select: {
                          name: true,
                          province: { select: { name: true } },
                        },
                      },
                    },
                  },
                }
              }
            }
          },
          PaymentInfo: {
            select: {
              paidAt: true,
            }
          },
          TicketQRCode: {
            where: {
              isCheckedIn: true,
            },
            select: {
              id: true,
              qrCode: true,
              ticketTypeId: true,
              seatId: true,
            }
          }
        }
      });

      if (!tickets) {
        return Err(new Error('No checked-in tickets found'));
      }

      const formattedTickets: CheckedInTicketsData[] = tickets.map(ticket => {
        const { street, ward, districts } = ticket.Showing?.Events?.locations ?? {};
        const districtName = districts?.name || '';
        const provinceName = districts?.province?.name || '';
        const locationsString = `${street || ''}, ${ward || ''}, ${districtName}, ${provinceName}`;

        return {
          id: ticket.id,
          showingId: ticket.showingId,
          status: ticket.status,
          type: ticket.type,
          price: ticket.price,
          paidAt: ticket.PaymentInfo?.paidAt ?? null,
          ticketQrCode: ticket.TicketQRCode?.map(t => ({
            ticketQrId: t.id,
            qrCode: t.qrCode,
            ticketTypeId: t.ticketTypeId,
            seatId: t.seatId ?? 0,
          })) ?? [],
          startTime: ticket.Showing?.startTime ?? null,
          endTime: ticket.Showing?.endTime ?? null,
          eventTitle: ticket.Showing?.Events?.title ?? '',
          eventVenue: ticket.Showing?.Events?.venue ?? '',
          locationsString: locationsString.trim() ?? '',
        }
      });

      return Ok(formattedTickets);
    } catch (error) {
      console.error(error);
      return null;
    }
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

  async checkPermissionToGet(eventId: number, userId: string): Promise<boolean> {
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

    return role.isSummarized || role.viewOrder || role.checkin;
  }
}