import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';
import { Result, Ok, Err } from 'oxide.ts';
import { EventOrgDetailResponseDto } from '../queries/getEventOfOrgDetail/getEventOfOrgDetail-response.dto';

@Injectable()
export class GetEventOfOrgDetailRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getEventDetail(eventId: number, userId: string): Promise<Result<EventOrgDetailResponseDto, Error>> {
    try{
      const event = await this.prisma.events.findUnique({
        where: {
          id: eventId >> 0,
          deleteAt: null,
        },
        select: {
          id: true,
          title: true,
          description: true,
          Images_Events_imgLogoIdToImages: {
            select: {
              id: true,
              imageUrl: true
            }
          },
          Images_Events_imgPosterIdToImages: {
            select: {
              id: true,
              imageUrl: true
            }
          },
          createdAt: true,
          isOnline: true,
          locations: {
            select: {
              id: true,
              street: true,
              ward: true,
              districts: {
                select:{
                  id: true,
                  name: true,
                  province: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              }
            }
          },
          venue: true,
          isApproved: true,
          orgDescription: true,
          orgName: true,
          deleteAt: true,
          EventCategories: {
            select: {
              Categories: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          Showing: {
            select: {
                id: true,
                isFree: true,
                startTime: true,
                endTime: true,
            }
          }
        }
      });

      if (!event) {
        return Err(new Error('No event found'));
      }

      const { street, ward, districts } = event.locations ?? {};
    const districtName = districts?.name || '';
    const provinceName = districts?.province?.name || '';
    const locationsString = `${street || ''}, ${ward || ''}, ${districtName}, ${provinceName}`;
      const eventDetail: EventOrgDetailResponseDto = {
        ...event,
        locationsString,
        EventCategories: event.EventCategories.map(category => ({
          id: category.Categories.id,
          name: category.Categories.name
        }))
      };
      return Ok(eventDetail);
    }
    catch(err) {
      return Err(err);
    }
  }
}