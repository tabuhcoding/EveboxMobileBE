import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';
import { Result, Ok, Err } from 'oxide.ts';
import { EventOrgFrontDisplayDto } from '../queries/getEventOfOrg/getEventOfOrg-response.dto';

@Injectable()
export class GetEventOfOrgRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(email: string): Promise<Result<(EventOrgFrontDisplayDto & { role: number })[], Error>> {
    try {
      if (!email) {
        return Err(new Error('Email is required'));
      }
  
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
  
      if (!user) {
        return Err(new Error('User not found'));
      }
  
      const userId = user.id;
  
      // 1. Get events where user is the ORGANIZER (role = 0)
      const organizerEvents = await this.prisma.events.findMany({
        where: {
          organizerId: email,
          deleteAt: null,
        },
        select: {
          id: true,
          title: true,
          venue: true,
          Images_Events_imgLogoIdToImages: true,
          Images_Events_imgPosterIdToImages: true,
          deleteAt: true,
          locations: {
            select: {
              street: true,
              ward: true,
              districts: {
                select: {
                  name: true,
                  province: {
                    select: { name: true }
                  }
                }
              }
            }
          },
          isApproved: true,
        }
      });
  
      // 2. Get events from UserEventRelationship
      const relatedEvents = await this.prisma.eventUserRelationship.findMany({
        where: {
          userId,
        },
        select: {
          role: true,
          event: {
            select: {
              id: true,
              title: true,
              venue: true,
              Images_Events_imgLogoIdToImages: true,
              Images_Events_imgPosterIdToImages: true,
              deleteAt: true,
              locations: {
                select: {
                  street: true,
                  ward: true,
                  districts: {
                    select: {
                      name: true,
                      province: {
                        select: { name: true }
                      }
                    }
                  }
                }
              },
              isApproved: true,
            }
          }
        }
      });
  
      const results: (EventOrgFrontDisplayDto & { role: number })[] = [];
  
      // Add organizer events
      for (const event of organizerEvents) {
        const showings = await this.prisma.showing.findMany({
          where: { eventId: event.id },
          select: { id: true, startTime: true },
        });
  
        const { street, ward, districts } = event.locations ?? {};
        const districtName = districts?.name || '';
        const provinceName = districts?.province?.name || '';
        const locationsString = `${street || ''}, ${ward || ''}, ${districtName}, ${provinceName}`;
        const startTime = await this.caculateEventsStartDate(showings);
  
        results.push({
          ...event,
          startDate: startTime,
          locationString:locationsString,
          role: 1, // Organizer role
        });
      }
  
      // Add related events (from user-event relationships)
      for (const rel of relatedEvents) {
        const event = rel.event;
        if (!event || event.deleteAt) continue;
  
        // Avoid duplicates if already added as organizer
        if (results.some(e => e.id === event.id)) continue;
  
        const showings = await this.prisma.showing.findMany({
          where: { eventId: event.id },
          select: { id: true, startTime: true },
        });
  
        const { street, ward, districts } = event.locations ?? {};
        const districtName = districts?.name || '';
        const provinceName = districts?.province?.name || '';
        const locationsString = `${street || ''}, ${ward || ''}, ${districtName}, ${provinceName}`;
        const startTime = await this.caculateEventsStartDate(showings);
  
        results.push({
          ...event,
          startDate: startTime,
          locationString:locationsString,
          role: rel.role, // Other role
        });
      }
  
      return Ok(results);
    } catch (error) {
      return Err(new Error('Failed to retrieve events'));
    }
  }
  
  async caculateEventsStartDate(showings: any[]) {
    let startTime = new Date("9999-12-31T23:59:59.999Z");
    const nowDate = new Date();
    for (const showing of showings) {
      if (new Date(showing.startTime) > nowDate && new Date(showing.startTime) < startTime) {
        startTime = new Date(showing.startTime);
        continue;
      }
      if (new Date(showing.startTime) < startTime) {
        startTime = new Date(showing.startTime);
      }
    }
    return startTime;
  }
}