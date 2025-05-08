import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/database/prisma/prisma.service";

@Injectable()
export class GetEventDetailRepository {
  constructor(private readonly prisma: PrismaService) { }

  async getEventDetail(eventId: number) {
    const nowDate = new Date();
    const event = await this.prisma.events.findUnique({
      where: {
        id: eventId,
        deleteAt: null,
      },
      select: {
        id: true,
        title: true,
        description: true,
        organizerId: true,
        locationId: true,
        Images_Events_imgLogoIdToImages: true,
        Images_Events_imgPosterIdToImages: true,
        createdAt: true,
        venue: true,
        orgName: true,
        orgDescription: true,
        isOnline: true,
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
        lastScore: true,
        isSpecial: true,
        isOnlyOnEve: true,
        EventCategories: {
          select: {
            Categories: {
              select: { id: true, name: true },
            },
          },
        },
        Showing: {
          where: {
            startTime: {
              gte: nowDate,
            },
          },
          select: {
            id: true,
            eventId: true,
            isFree: true,
            isSalable: true,
            isPresale: true,
            seatMapId: true,
            startTime: true,
            endTime: true,
            isEnabledQueueWaiting: true,
            showAllSeats: true,
            TicketType: {
              select: {
                id: true,
                name: true,
                description: true,
                color: true,
                isFree: true,
                price: true,
                originalPrice: true,
                maxQtyPerOrder: true,
                minQtyPerOrder: true,
                startTime: true,
                endTime: true,
                position: true,
                imageUrl: true,
                isHidden: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      return { eventDetail: null, locationsString: '' };
    }

    // Xử lý địa chỉ
    const { street, ward, districts } = event.locations ?? {};
    const districtName = districts?.name || '';
    const provinceName = districts?.province?.name || '';
    const locationsString = `${street || ''}, ${ward || ''}, ${districtName}, ${provinceName}`;
    let startTime = event.Showing.length > 0 ? new Date(event.Showing[0].startTime) : new Date();
    let minTicketPrice = Infinity;
    // Cập nhật status cho showing và ticketType
    const updatedShowings = await Promise.all(event.Showing.map(async (showing) => {
      const showingStatus = await this.getShowingStatus(showing.id);
      if (new Date(showing.startTime) < startTime) {
        startTime = new Date(showing.startTime);
      }
      showing.TicketType.forEach(ticketType => {
        if (ticketType.price < minTicketPrice) {
          minTicketPrice = ticketType.price;
        }
      });
      return {
        ...showing,
        status: showingStatus.showingStatus, // ✅ Gán status mới cho showing
        TicketType: showing.TicketType.map(ticketType => ({
          ...ticketType,
          status: showingStatus.ticketTypesStatus[ticketType.id] || "sold_out" // ✅ Gán status cho ticketType
        }))
      };
    }));

    // Tính toán event.status
    const eventStatus = this.calculateEventStatus(updatedShowings);

    return {
      eventDetail: { ...event, Showing: updatedShowings, status: eventStatus, startTime, minTicketPrice, locationsString },
    };
  }

  calculateEventStatus(showings: any[]): string {
    if (showings.some(showing => ["book_now", "register_now"].includes(showing.status))) {
      return "available";
    }
    if (showings.some(showing => showing.status === "not_open")) {
      return "not_open";
    }
    if (showings.some(showing => showing.status === "sale_closed")) {
      return "sale_closed";
    }
    if (showings.some(showing => showing.status === "register_closed")) {
      return "register_closed";
    }
    if (showings.some(showing => showing.status === "sold_out")) {
      return "sold_out";
    }
    return "event_over"; // Không có showing nào
  }

  async getShowingStatus(showingId: string) {
    try {
      const showing = await this.prisma.showing.findUnique({
        where: {
          id: showingId,
        },
        select: {
          TicketType: {
            select: {
              id: true,
            }
          },
          seatMapId: true,
        },
      });
      let showingStatus = "sold_out"; // Mặc định là sold_out
      const ticketTypesStatus = {}; // Lưu trạng thái từng ticketType

      for (const ticketType of showing.TicketType) {
        const ticketTypeStatus = await this.getTicketTypeStatus(showing.seatMapId, ticketType.id);
        ticketTypesStatus[ticketType.id] = ticketTypeStatus; // Lưu trạng thái từng ticketType

        // Cập nhật showingStatus theo thứ tự ưu tiên
        if (ticketTypeStatus === "register_now") {
          showingStatus = "register_now";
        } else if (ticketTypeStatus === "book_now" && showingStatus === "sold_out") {
          showingStatus = "book_now";
        } else if (ticketTypeStatus === "not_open" && ["sold_out", "book_now"].includes(showingStatus)) {
          showingStatus = "not_open";
        } else if (ticketTypeStatus === "register_closed" && ["sold_out", "book_now", "not_open"].includes(showingStatus)) {
          showingStatus = "register_closed";
        }
      }
      // Return kết quả
      return { ticketTypesStatus, showingStatus };

    }
    catch (error) {
      // throw new Error(error);
      console.log(error);
      return null;
    }
  }
  async getTicketTypeStatus(seatMapId: number, ticketTypeId: string) {
    try {
      const ticketTypeQuantity = await this.prisma.ticketType.findUnique({
        where: {
          id: ticketTypeId,
        },
        select: {
          showingId: true,
          quantity: true,
          price: true,
          startTime: true,
          endTime: true,
          sections: {
            select: {
              sectionId: true,
            }
          }
        },
      });

      const date = new Date();
      if (ticketTypeQuantity.startTime && ticketTypeQuantity.startTime > date) {
        return "not_open";
      }
      else if (ticketTypeQuantity.endTime && ticketTypeQuantity.endTime < date) {
        return ticketTypeQuantity.price == 0 ? "register_closed" : "sale_closed";
      }

      const seatmap = await this.prisma.seatmap.findFirst({
        where: {
          id: seatMapId,
        },
        select: {
          id: true,
          Section: {
            select: {
              id: true,
              Row: {
                select: {
                  Seat: {
                    select: {
                      SeatStatus: true,
                    }
                  }
                },
              }
            }
          },
        },
      });
      if (!seatmap) {
        return "sold_out";
      }

      const seatSection = seatmap.Section;
      if (!seatSection || seatSection.length === 0) {
        const ticketSold = await this.prisma.ticketQRCode.count({
          where: {
            ticketTypeId: ticketTypeId,
          },
        });

        if (ticketSold >= ticketTypeQuantity.quantity) {
          return "sold_out";
        }
        else {
          return ticketTypeQuantity.price == 0 ? "register_now" : "book_now";
        }
      }
      const sectionIdInTicketType = ticketTypeQuantity.sections.map(section => section.sectionId);
      for (const section of seatSection) {
        if (sectionIdInTicketType.includes(section.id)) {
          continue;
        }
        const rows = section.Row;
        for (const row of rows) {
          const seats = row.Seat;
          for (const seat of seats) {
            for (const status of seat.SeatStatus) {
              if (status.showingId === ticketTypeQuantity.showingId
                && status.status === 1
              ) {
                return ticketTypeQuantity.price == 0 ? "register_now" : "book_now";
              }
            }
          }
        }
      }
      return "sold_out";
    }
    catch (error) {
      console.log(error);
      return "sold_out";
    }
  }
}