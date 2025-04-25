import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';

@Injectable()
export class GetUserTicketRepository {
  constructor(private readonly prisma: PrismaService) { }
  async getUserTicket(userId: string) {
    try {
      const userTicket = await this.prisma.ticket.findMany({
        where: {
          userId: userId
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
                  title: true,
                  // description: true,
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
            select: {
              qrCode: true,
              ticketTypeId: true,
              seatId: true,
            }
          }
        }
      });
      if (!userTicket) {
        return null;
      }
      // Xử lý địa chỉ
      // const { street, ward, districts } = event.locations ?? {};
      // const districtName = districts?.name || '';
      // const provinceName = districts?.province?.name || '';
      // const locationsString = `${street || ''}, ${ward || ''}, ${districtName}, ${provinceName}`;
      const formatUserTicket = userTicket.map(ticket => {
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
          PaymentInfo: ticket.PaymentInfo ?? undefined,
          TicketQRCode: ticket.TicketQRCode ?? [],
          Showing: ticket.Showing
            ? {
              startTime: ticket.Showing.startTime,
              endTime: ticket.Showing.endTime,
              Events: {
                title: ticket.Showing.Events?.title || '',
                venue: ticket.Showing.Events?.venue || '',
                locationsString: locationsString || '',
              },
            }
            : undefined,
          };
        }
      );
      return formatUserTicket;
    }
    catch (e) {
      console.error(e);
      return null;
    }
  }

  async getUserTicketById(userId: string, ticketId: string) {
    try{
      const userTicket = await this.prisma.ticket.findFirst({
        where: {
          id: ticketId,
          userId: userId
        },
        select:{
          Showing: {
            select: {
              startTime: true,
              endTime: true,
              Events: {
                select: {
                  title: true,
                  venue: true,
                  Images_Events_imgPosterIdToImages: {
                    select: {
                      imageUrl: true,
                    }
                  }
                },
              }
            }
          },
          TicketQRCode: {
            select: {
              qrCode: true,
              ticketTypeId: true,
              seatId: true,
            }
          },
          PaymentInfo: {
            select: {
              method: true,
              paidAt: true,
            }
          },
          FormResponse: {
            select: {
              FormAnswer: {
                select: {
                  FormInput: {
                    select: {
                      fieldName: true
                    }
                  },
                  value: true,
                }
              }
            }
          },
          id: true,
          showingId: true,
          status: true,
          price: true,
          type: true,
        }
      });

      if(!userTicket){
        return null;
      }

      console.log(userTicket.id)
      
      const { ticketTypeId } = userTicket.TicketQRCode[0] || {};
      const seatIds = userTicket.TicketQRCode.map(ticket => ticket.seatId).filter(seatId => seatId !== null);
      const ticketType = ticketTypeId ? await this.prisma.ticketType.findFirst({
        where: {
          id: ticketTypeId,
        },
        select: {
          name: true,
          price: true,
          sections: {
            select: {
              sectionId: true,
            }
          }
        }
      }) : null;
      if( seatIds.length > 0 ){
        const seats = await this.prisma.seat.findMany({
          where: {
            id: { in: seatIds },
          },
          select: {
            id: true,
            name: true,
            Row: {
              select: {
                id: true,
                name: true,
                Section: {
                  select: {
                    id: true,
                    name: true,
                  }
                }
              }
            }
          }
        });
        return {
          ...userTicket,
          ticketType: ticketType ? {
            name: ticketType.name,
            price: ticketType.price,
          } : null,
          seats: seats ? seats : [],
          count: userTicket.TicketQRCode.length,
        }
      }
      return {
        ...userTicket,
        ticketType: ticketType ? {
          name: ticketType.name,
          price: ticketType.price,
          sections: ticketType.sections.map(section => section.sectionId),
        } : null,
        seats: [],
        count: userTicket.TicketQRCode.length,
      }
    }
    catch (error){
      console.error(error);
      return null;
    }
  }
}