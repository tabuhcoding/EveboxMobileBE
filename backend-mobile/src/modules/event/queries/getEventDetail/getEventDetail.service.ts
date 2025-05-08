import { Injectable } from "@nestjs/common";
import { Result, Ok, Err } from "oxide.ts";
import { GetEventDetailRepository } from "../../repositories/getEventDetail.repository";
import { EventData } from "../../domain/entities/event.entity";

@Injectable()
export class GetEventDetailService {
  constructor(private readonly eventDetailRepository: GetEventDetailRepository) {}

  async execute(eventId: number): Promise<Result<EventData, Error>> {
    try {
      if (!eventId) {
        return Err(new Error('Event ID is required'));
      }

      const { eventDetail } = await this.eventDetailRepository.getEventDetail(eventId);
      if (!eventDetail) {
        return Err(new Error("Event not found."));
      }
      

      return Ok(eventDetail);
    } catch (error) {
      return Err(new Error('Failed to fetch event detail data'));
    }
  }
}