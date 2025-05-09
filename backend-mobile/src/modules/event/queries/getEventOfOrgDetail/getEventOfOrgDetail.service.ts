import { Injectable } from '@nestjs/common';
import { Err, Result } from 'oxide.ts';
import { GetEventOfOrgDetailRepository } from '../../repositories/getEventOfOrgDetail.repository';
import { EventOrgDetailResponseDto } from './getEventOfOrgDetail-response.dto';

@Injectable()
export class GetEventOfOrgDetailService {
  constructor(private readonly getEventOfOrgDetailRepository: GetEventOfOrgDetailRepository) {}

  async findAll(organizerId: string, eventId: number): Promise<Result<EventOrgDetailResponseDto, Error>> {
    try{
      if (!organizerId) {
        return Err(new Error('Organizer ID is required'));
      }
      return await this.getEventOfOrgDetailRepository.getEventDetail(eventId, organizerId);
    } catch (error) {
      return Err(new Error('Failed to retrieve events'));
    }
  }
}